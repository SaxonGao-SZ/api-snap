// var HTTP = require('http');
// var { networkInterfaces } = require('os');
import fs from 'fs';
import HTTP from 'http';
import { networkInterfaces } from 'os';
import path, { dirname, join, sep } from 'path';
import responseHandler from './response-handler.js';
/**
 * @param {'IPV4' | 'IPV6'} ipType IP 类型
 * @param {number} port
 */
const RuntimeState = function (ipType, port) {
    if (ipType !== RuntimeState.IP4 || ipType !== RuntimeState.IP6) {
        ipType = RuntimeState.IP4;
        console.warn(`RuntimeState(<"IPV4" | "IPV6"> ipType): RuntimeState, auto reset "${ipType}" to "${this.IP4}"`);
    }
    this.initialPort(port);
    this.initialHost(ipType.toUpperCase());
    console.log(this.hosts, this.port);
}
RuntimeState.IP4 = 'IPV4';
RuntimeState.IP6 = 'IPV6';
RuntimeState.prototype = {
    hosts: [],
    port: 0,
    state: [],

    /**
     * @param {string} ipType 
     */
    initialHost(ipType) {
        const networkConfig = networkInterfaces();
        // console.log('this.networkConfig: ', this.networkConfig);
        for (let idxa in networkConfig) {
            let nets = networkConfig[idxa];
            for (let idxb in nets) {
                let net = nets[idxb];
                if (net.family.toUpperCase() === ipType) {
                    console.log(`initialHost: ${net.family.toUpperCase()} === ${ipType}: ${net.address}`)
                    this.hosts.push(net.address);
                    this.state.push(`http://${net.address}:${this.port}`)
                    break;
                }
            }
        }
    },

    initialPort(port) {
        this.port = port ? port : Math.ceil(Math.random() * 10000);
    },

    save() {
        let _this = this;
        let projectDir = dirname(dirname(process.argv[1]));
        const runtimeStateFile = path.join(projectDir,'runtime','state.json');
        console.log(`save: ${runtimeStateFile}`);
        fs.open(runtimeStateFile, 'w+', function(err, fd){
            if(err) {
                console.error(err);
                return;
            }
            fs.write(fd, JSON.stringify(_this.state), function(err,written){
                if(err) {
                    console.log(`fs.write fail:"${runtimeStateFile}", error`);
                    return;
                } else {
                    console.log(`fs.write success: ${written}`);
                }
                fs.close(fd, function(){
                    console.log('fd closed');
                });
            })
        } );
    }

}

/**
 * @param {'IPV4' | 'IPV6'} ipType IP 类型
 */
var Server = function (ipType = 'IPV4', port='') {
    this.runtimeState = new RuntimeState(ipType, port);
    this.initial();
    this.start();
}

Server.prototype = {
    httpServersMap: new Map(),
    runtimeState: null,

    initial() {
        for (let index in this.runtimeState.hosts) {
            let host = this.runtimeState.hosts[index];
            this.httpServersMap.set(host, {
                server: HTTP.createServer(responseHandler),
                option: {
                    host: host,
                    port: this.runtimeState.port
                }
            });
            this.httpServersMap.get(host).server.on('connect', function(){
                console.log('connect', arguments);
            });
            this.httpServersMap.get(host).server.onClose = this.onClose;
            this.httpServersMap.get(host).server.onErro = this.onErro;
        }
    },

    onError() {
        console.error('error', arguments);
    },

    onClose() {
        console.warn('close', arguments);
    },

    start() {
        console.log(`start ${this.httpServersMap.size} server${this.httpServersMap.size>1? 's': ''}...`, );
        let _this = this;
        let index = 0;
        this.httpServersMap.forEach(function(httpServer, key, httpServersMap) {
            if(index === _this.httpServersMap.size-1){
                _this.saveRuntimeState();
            }
            console.log(`${index}: listen ${httpServer.option.host}:${httpServer.option.port}...`);
            httpServer.server.listen(httpServer.option.port, httpServer.option.host, () => {
                console.log(`http://${httpServer.option.host}:${httpServer.option.port}`);
            });
            index++;
        });
        console.log('wating request...');
    },

    saveRuntimeState() {
        this.runtimeState.save();
    },
};

export default Server;