var apiSnapAgent = (function () {
    'use strict';

    class Agent {
        static initial() {
            this.initailSend();
        }

        static initailSend() {
            let oSend = XMLHttpRequest.prototype.send;
            XMLHttpRequest.prototype.send = function () {
                console.log('XMLHttpRequest.send',this, arguments);
                oSend.apply(this, [...arguments]);
            };
        }
    }

    const apiSnapAgent = function () {
        Agent.initial();
    };

    return apiSnapAgent;

}());
//# sourceMappingURL=snap-agent.js.map
