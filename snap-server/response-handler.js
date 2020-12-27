import Storage from './storage.js';
/**
 * @param {NodeJS} request 
 * @param {*} response 
 */
const responseHandler = function(request, response) {
    console.log('request: ', request.url, typeof request);
    request.on('data', function(data){
        console.log('data',data.toString());
        Storage.save(data);
    });
    const content = '';
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Method', '*');
    response.statusCode = 200;
    response.write(content);
    response.end();
}


export default responseHandler;