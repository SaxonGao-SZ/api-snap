var apiSnapAgent = (function () {
    'use strict';

    class Buffer {
        static buf = {};
        static length = 0;

        /**
         * 
         * @param {any} aKey - 用于生成 akey 的数据
         * @param {any} bKey - 用于生成 akey 的数据
         * @param {any} valueData - 存储在 key 中的数据
         * @param {(length: number)=>void} callBack
         */
        static set(aKey, bKey = null, valueData = null, callBack) {
            if (!aKey) return this.length;
            let _this = this;
            setTimeout(() => {
                try {
                    let a = `${Array.from(aKey).join('~')}`;
                    let b = `${!bKey ? Array.from(bKey).join('~') : 'null'}`;
                    if (typeof _this.buf[a] === 'undefined') {
                        _this.buf[a] = {};
                        _this.length++;

                    }
                    if (bKey){
                        _this.buf[a][b] = valueData ? _this.tarStr(valueData) : '';
                    }
                    if (callBack)
                        callBack(_this.length);
                    console.log('Buffer.set', _this.length);
                } catch (err) {
                    console.error('Buffer.set Error', err);
                }

            }, 0);
        };
        /**
         * 过滤掉不需要的字符
         * @param {string} data 
         */
        static tarStr(data) {
            let tmp = data.replace(/\/\/(.+)(\r|\n)?/g, '/*$1$2*/'); // 去掉单行注释
            tmp = tmp.replace(/\r/g, ''); //\r 替换
            tmp = tmp.replace(/[ ]{2,}/g, ' ');  // 去掉两个以上的空格，保留一个
            tmp = tmp.replace(/>[ ]+</g, '><');  // 去掉标签中间的空格    
            tmp = tmp.replace(/[ ]?([=:;]{1,3})[ ]?/g, '$1');  // 去掉等号两边的空格    
            return tmp;
        }

        /**
         * 转化为 JSON
         * @return {string}
         */
        static toJson(){
            return JSON.stringify(this.buf);
        }

        static reset() {
            this.buf = {};
            this.length = 0;
        }
    }

    window.ApiSnapAgentBuffer = Buffer;

    class Agent {

        static bufAKey = null;
        static bufBKey = null;
        static reportUrl = '';

        static isOnLoadSetted = false;

        static bufMaxLen = 2;

        static setBufAKey(value) {
            console.log('Agent.setBufAKey', value, Date.now());
            this.bufAKey = value;
        }

        static getBufAKey() {
            console.log('Agent.getBufAKey this.bufAKey', this.bufAKey, Date.now());
            let key = null; // 创建一个 null 指针
            key = this.bufAKey; // 指到 this.bufAKey
            console.log('Agent.getBufKey key', key, Date.now());
            return key;
        }

        static clearBufAKey() {
            this.bufAKey = null; // this.bufAKey 清空
        }

        static setBufBKey(value) {
            console.log('Agent.setBufBKey', value, Date.now());
            this.bufBKey = value;
        }


        static getBufBKey() {
            console.log('Agent.getBufKey this.bufBKey', this.bufBKey, Date.now());
            let key = null; // 创建一个 null 指针
            key = this.bufBKey; // 指到 this.bufBKey
            this.bufBKey = null; // this.bufBKey 清空
            console.log('Agent.getBufKey key', key, Date.now());
            return key;
        }

        static clearBufBKey() {
            this.bufBKey = null; // this.bufBKey 清空
        }

        static initial() {
            console.log('Agent.initial...');
            this.initialOpen();
            this.initialSend();
            this.getReportUrl();
            console.log('Agent.initial done');
        }

        static getReportUrl() {
            let request = new Request('..//runtime/state.json', {method: "GET"});
            let _this = this;
            fetch(request)
                .then(response => {
                    return response.json();
                })
                .then( datas => {
                    datas.forEach(item=>{
                        if (item.indexOf(window.location.hostname) >= 0){
                            _this.reportUrl = `${item}/set`;
                        }
                        return;
                    });
        
                } )
                .catch();
        }

        /**
         * 初始化 XMLHttpRequest.prototype.open 方法，使其可以截获参数
         */
        static initialOpen() {
            console.log('Agent.initialOpen');
            let _this = this;
            let oOpen = XMLHttpRequest.prototype.open;
            XMLHttpRequest.prototype.open = function () {
                // scope: XMLHttpRequest
                console.log('XMLHttpRequest.open', this, arguments);
                _this.setBufAKey(arguments);
                Buffer.set(arguments, '');
                oOpen.apply(this, [...arguments]);
                _this.initialOnload(this);
            };
        }



        /**
         * 初始化 XMLHttpRequest.prototype.send 方法，使其可以截获参数
         */
        static initialSend() {
            console.log('Agent.initialSend');
            let oSend = XMLHttpRequest.prototype.send;
            let _this = this;
            XMLHttpRequest.prototype.send = function () {
                console.log('XMLHttpRequest.send', this, arguments);
                let aKey = _this.getBufAKey();
                _this.setBufBKey(arguments);
                Buffer.set(aKey, arguments);
                oSend.apply(this, [...arguments]);
            };
        }


        static initialOnload(xhr) {
            // onload 方法只存在于实例中，目前只能这么处理
            let oOnload = xhr.onload;
            let _this = this;
            xhr.onload = function () {
                console.log('XMLHttpRequest.onload', arguments);
                let aKey = _this.getBufAKey();
                let bKey = _this.getBufBKey();
                Buffer.set(aKey, bKey, xhr.response, (bufLen) => {
                    if (bufLen >= _this.bufMaxLen) {
                        console.log('XMLHttpRequest.onload', `${bufLen}/${_this.bufMaxLen}`);
                        _this.report();
                    }
                });
                oOnload && oOnload.apply(xhr, [...arguments]);
            };
            xhr.isOnLoadSetted = true;
        }

        static report() {
            console.log('Agent.report');
            let request = new Request(this.reportUrl,{
                method: 'post', 
                body: Buffer.toJson(),
            });
            fetch(request)
            .then().catch();
        }

    }
    Agent.initial();
    const apiSnapAgent = function () {
        // Agent.initial();
    };

    return apiSnapAgent;

}());
//# sourceMappingURL=snap-agent.js.map
