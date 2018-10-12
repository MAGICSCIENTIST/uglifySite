let fs = require('fs-extra');
let commonFunc = require('./../common/commonFunc')
let copyLoader = require('./executor-copy')
let _cleanCss = require('clean-css');
let log = require('./../common/log')

 /**
    * 读取并压缩并复制
    * 这里不管正则什么的,路径提前生成好
    * @param {any} src 文件源 string
    * @param {any} target 结果目标 string
    * @param {object} opt 
    */
function _exCssFile(src, target, opt) {
    
    // if (path.extname(src) !== opt.styleExName) {
    //     src += opt.styleExName;
    // }
    if (!fs.pathExistsSync(src)) {
        return new Promise(function (resolve) {
            resolve({ err: 'no file' });
        });
    }
    log.succes('start css work on ' + src)
    // if (path.extname(target) !== opt.styleExName) {
    //     target += opt.styleExName;
    // }
    return fs.readFile(src, 'utf8')
        .then((data) => {
            return _minCss(data,opt)            
        }).then(result => {
            if (result.error) {
                throw result.error;
            }
            return commonFunc.ensureDir(target).then(() => {
                return fs.writeFile(target, result.styles)
            });
        }).then(() => {
            log.succes('min style done: ' + target)
            return { src: src, target: target };
        }).catch(err => {
            log.error('min style error: ' + target)
            log.info('-----------msg-------------')
            log.error(err)
            log.info('-----------msg-------------')
            log.warn('try to start copy :' + target)
            copyLoader.execute(src, target, opt);
        })
}

function _minCss(data,opt){
    var  cleanCssFunc = new _cleanCss({
        format: opt.beautify ? opt.cssBeautifyMethod : undefined, // formats output in a really nice way,
        returnPromise: true
    })
   return  cleanCssFunc.minify(data)
}


module.exports = {
   
    execute: _exCssFile,
    min:_minCss,

}