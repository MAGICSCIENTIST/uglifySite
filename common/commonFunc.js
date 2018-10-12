let fs = require('fs-extra');
let path = require('path');
let mkdirp = require('mkdirp');

module.exports = {
    // isJsFile: function (src, template) {

    // },
    // isMe(src, template) {


    // },

    //make sure that path is exists
    ensureDir: function (pathStr) {
        return new Promise((resolve, reject) => {
            if (typeof pathStr !== 'string') {
                return;
            }
            if (path.extname(pathStr)) {
                pathStr = path.dirname(pathStr);
            }
            fs.pathExists(pathStr)
                .then(exisits => {
                    if (exisits) {
                        resolve()
                    } else {
                        mkdirp(pathStr, (err) => {
                            if (err) {
                                reject(err);
                            }
                            resolve();
                        });
                    }
                })

        });
    },
    

}