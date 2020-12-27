
export default class Buffer {
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

        }, 0)
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