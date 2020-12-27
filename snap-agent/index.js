class Agent {
    static initial() {
        this.initailSend();
    }

    static initailSend() {
        let oSend = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.send = function () {
            console.log('XMLHttpRequest.send',this, arguments);
            oSend.apply(this, [...arguments]);
        }
    }
}

const apiSnapAgent = function () {
    Agent.initial();
}



export default apiSnapAgent;