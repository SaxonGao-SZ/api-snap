import fs, { readSync } from 'fs';
import path, {dirname} from 'path';


const projectDir = dirname(dirname(process.argv[1]));
const cacheFile = path.join(projectDir,'runtime','cache.store');
let cache = '';
const Storage = {
    save(data) {
        let _this = this;
        fs.open(cacheFile, 'w+', function(err, fd){
            if(err) {
                console.error(err);
                return;
            }
            fs.write(fd, data, function(err,written){
                if(err) {
                    console.log(`Storage.save fs.write fail:"${cacheFile}", error`);
                    return;
                } else {
                    console.log(`Storage.save fs.write success: ${written}`);
                }
                fs.close(fd, function(){
                    console.log('Storage.save fd closed');
                });
            })
        } );
    },


    updateCache() {
        cache = readSync(cacheFile);
        console.log('Storage.updateCache', cache);
    }
}

export default Storage;