let extend = require('node.extend');
let fs = require('fs-extra');
let commonFunc = require('./../common/commonFunc')
let copyLoader = require('./executor-copy')
let uglifyjs = require('uglify-es');
let log = require('./../common/log')

/**
 * 读取并压缩并复制js
 * 这里不管正则什么的,路径提前生成好
 * @param {any} src 文件源 string
 * @param {any} target 结果目标 string
 * @param {object} opt 
 */
function _exJsFile(src, target, opt) {   
    if (!fs.pathExistsSync(src)) {
        return new Promise(function (resolve) {
            resolve({ err: 'no file' });
        });
    }
    log.succes('start min work on ' + src)
    // if (path.extname(target) !== opt.scriptExName) {
    //     target += opt.scriptExName;
    // }
    return fs.readFile(src, 'utf8')
        .then((data) => {
            var result = uglifyjs.minify(data, {
                output: {
                    ascii_only: opt.ascii_only,
                    beautify: opt.beautify
                }
            });
            if (result.error) {
                throw result.error;
            }
            return commonFunc.ensureDir(target).then(() => {
                return fs.writeFile(target, result.code)
            });
        }).then(() => {
            log.succes('min done: ' + target)
            return { src: src, target: target };
        }).catch(err => {
            log.error('min error: ' + target)
            log.info('-----------msg-------------')
            log.error(err)
            log.info('-----------msg-------------')
            log.warn('try to start copy :' + target)
            copyLoader.execute(src, target, opt);
        })
}

function _minJs(data,opt){
    var defOpt = {
        output: {
            ascii_only: opt.ascii_only,
            beautify: opt.beautify
        }
    }
    var _opt =  extend(true, defOpt, opt);
    return uglifyjs.minify(data, { warnings: true });
    
}

module.exports={
    execute: _exJsFile,
    min:_minJs
}