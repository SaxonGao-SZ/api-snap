let HTTP = require('http');
class Server {
    http = new HTTP.Server();
    port = 9997;
    constructor() {
        this.http = new HTTP.Server();
    }

    initial() {
        this.http.onClose = this.onClose;
        this.http.onErro = this.onError;
    }

    onError = () => {
        console.error('error', arguments);
    }

    onClose = () => {
        console.warn('close', arguments);
    }

    start = (port) => {
        try {
            this.http.listen;
        }

    }

}

module.exports = Server;