let fs = require('fs-extra');
let commonFunc = require('./../common/commonFunc')
let log = require('./../common/log')

 /**
 * 复制文件
 * 这里不管正则什么的,路径要提前生成好
 * @param {any} src 文件源 string
 * @param {any} target 结果目标 string
 */
function _copyFile(src, target, opt) {
    log.succes('start copy on ' + src)
    return commonFunc.ensureDir(target)
        .then(() => {
            return fs.copy(src, target)
        }).then(() => {
            log.succes('copy done: ' + target)
            return { src: src, target: target };
        }).catch(err => {
            if (err) {
                log.error('copy error: ' + target)
                log.info('-----------msg-------------')
                log.error(err)
                log.info('-----------msg-------------')
            }
        })
}




module.exports = {
   
    execute: _copyFile,
    

}