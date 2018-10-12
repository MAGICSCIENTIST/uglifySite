let fs = require('fs-extra');
let commonFunc = require('./../common/commonFunc')
let cssLoader = require('./executor-css')
let jsLoader = require('./executor-js')
let copyLoader = require('./executor-copy')
let log = require('./../common/log')


/**
* 读取并压缩并复制
* 这里不管正则什么的,路径提前生成好
* @param {any} src 文件源 string
* @param {any} target 结果目标 string
* @param {object} opt 
*/
function _exVueFile(src, target, opt) {
    if (!fs.pathExistsSync(src)) {
        return new Promise(function (resolve) {
            resolve({ err: 'no file' });
        });
    }
    log.succes('start min work on ' + src);
    // if (path.extname(target) !== opt.scriptExName) {
    //     target += opt.scriptExName;
    // }
    return fs.readFile(src, 'utf8')
        .then((data) => {




            var fileData = data.replace(/[\r\n\t]/g, "");
            return _minVue(fileData, opt)


            // try {
            //     var html = fileData.match(/<template.*>(.*)<\/template>/)[0];
            //     var script = fileData.match(/<script.*>(.*)<\/script>/)[1];
            //     let res = uglifyjs.minify(script, { warnings: true });
            //     if (res.error) {
            //         throw res.error + "\n 压缩js代码失败，已跳过jS压缩步骤，继续生成新文件。";

            //     } else {
            //         script = uglifyjs.minify(script).code;
            //     }
            //     var css = fileData.match(/<style.*>(.*)<\/style>/)[0];

            //     /*fs.writeFile(outPath, html+"<script>"+script+"</script>"+css, (data) => {
            //          if(data){log.data)};
            //         });*/
            //     result.code = html + "<script>" + script + "</script>" + css;

            // } catch (err) {
            //     log.err.message);

            // }




            // if (result.error) {
            //     throw result.error;
            // }

        })
        .then(result => {
            return commonFunc.ensureDir(target).then(() => {
                return fs.writeFile(target, result)
            });
        })
        .then(() => {
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

async function _minVue(data, opt) {
    let style = data.match(/<style.*>(.*)<\/style>/)[1];
    let html = data.match(/<template.*>(.*)<\/template>/)[0];
    let script = data.match(/<script.*>(.*)<\/script>/)[1];

    let scriptMin = jsLoader.min(script, opt);
    let styleMin = await cssLoader.min(style, opt);

    if (scriptMin.error) {
        throw scriptMin.error
    }


    return html + `<script>${scriptMin.code}</script> <style scoped="scoped"> ${styleMin.styles}</style>`;

}

module.exports = {

    execute: _exVueFile,
    min: _minVue
}