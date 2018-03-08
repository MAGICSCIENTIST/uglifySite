//引用
let ProgressBar = require('progress');
let extend = require('node.extend');
let fs = require('fs-extra');
let path = require('path');
let mkdirp = require('mkdirp');
// let uglifyjs = require('uglify-js');
let uglifyjs = require('uglify-es');
let _cleanCss = require('clean-css');
let cleanCssFunc;
let chalk = require('chalk')
// 变量
const succes = chalk.green;
const error = chalk.red;
const warn = chalk.yellow
const defaultOpt = {
    dir: './dist/', //根目录
    clearExportDir: false,
    beautify: false,
    cssBeautifyMethod: "beautify", //keep-breaks .... clean-css format
    justCopy: false, //change all entry to copy method
    ascii_only: true,
    //TODO: NO USE THIS TIME
    scriptExName: '.js',
    htmlExName: '.html',
    styleExName: '.css',
}

//TODO: this is a test
// let config = require('./uglify.config');

// start(['SYS', 'visualMonitor'], config)
// start(['common', 'map', 'login', 'platformCenter', 'visualMonitor'], config)


/**
 * 设置配置信息
 * 
 * @param {string||object} options 配置信息, string=> require配置文件路径, object=>配置项目的object
 * @returns promise
 */
function _setConfig(options) {
    return new Promise((res, rej) => {
        if (typeof options === 'string') {
            let requirepath = path.isAbsolute(options) ? options : path.resolve(options).replace(/\\/g, '/');
            let config = require(requirepath)
            this.options = extend(true, defaultOpt, config);
            res(this.options)
        } else if (typeof options === 'object') {
            this.options = extend(true, defaultOpt, options);
            res(this.options)
        } else {
            throw "unExpected options type"
        }
    })
}


/**
 * 开始执行
 * 
 * @param {any} modNames 需要压缩的模块名
 * @param {any} options  config obj || default find uglify.config.js
 */
function _start(modNames, opt) {

    console.time("clean")
    console.time("work")
    console.log(chalk.green("---------start building--------"));

    //check config's module's name is distinct
    let _namelist = opt.modules.map(x => { return x.name });
    _namelist.forEach(x => {
        if (_namelist.filter(_x => _x === x).length > 1) {
            throw "defined module <" + x + "> is not unique"
        }
    })

    // let opt = extend(true, defaultOpt, options);

    // create dir if not exists
    if (!fs.existsSync(opt.dir)) {
        mkdirp(opt.dir);
    }
    if (opt.clearExportDir) {
        console.log(succes('start clean : ' + opt.dir))
        fs.emptyDirSync(opt.dir)
        console.timeEnd("clean")
        console.log(succes('clear success'))
    }

    cleanCssFunc = new _cleanCss({
        format: opt.beautify ? opt.cssBeautifyMethod : undefined, // formats output in a really nice way,
        returnPromise: true
    })


    //用于忽略大小写
    modNames = (modNames instanceof Array) ? modNames.map(x => x.toLowerCase()) : modNames.toLowerCase();
    opt.modules = opt.modules.map(x => { x.name = x.name.toLowerCase(); return x })

    let modules = getModules(modNames, opt);
    return _minModsAsync(modules, opt);
    // console.log(succes(msg));

}

/**
 * 获取模块
 * 
 * @param {string||string[]} modNames 模块name
 * @param {object} opt configFile's exprot object
 * @returns 
 */
function getModules(modNames, opt) {
    let result = [];

    let modules = (modNames === 'all')?opt.modules:_recursiveToGetModules([], modNames, opt);

    //distinct
    modules.filter(mod => {
        let i = result.findIndex(x => x.name === mod.name);
        //if i'm not in the result  
        //    then push me in result
        if (i === -1) {
            result.push(mod);
        }
    })

    return result;

}

/**
 * 通过name 获取出预定义的模块信息
 *  并递归出所有linkmod
 * @param {object[]} modules
 * @param {string||string[]} names  内容在modules就不再去获取了
 * @param {object} opt 
 */
function _recursiveToGetModules(modules, names, opt) {
    let result = [];
    if (names instanceof Array) {
        //内容在modules就不再去获取了 避免死循环
        names = names.filter(x => {
            return modules.findIndex(mod => { mod.name === x }) === -1
        })
        //找到预定义的模组中 是 我需要的模组    
        result = opt.modules.filter(mod => {
            return names.includes(mod.name);
        })
    } else if (typeof names === 'string' && !~modules.findIndex(mod => { mod.name === names })) {
        //内容在modules就不再去获取了 避免死循环 ↑       
        result = opt.modules.filter(mod => {
            return names === mod.name;
        })
    }


    result.forEach(mod => {
        if (mod.linkMods) {
            Array.prototype.push.apply(result, _recursiveToGetModules(result, (mod.linkMods instanceof Array) ? mod.linkMods.map(x => x.toLowerCase()) : mod.linkMods.toLowerCase(), opt))
        }
    })
    return result;
}

/**
 * Async压缩并输出模块文件
 * 
 * @param {any} mods 模块s
 * @returns promise
 */
function _minModsAsync(mods, opt) {
    if (!mods) {
        return 'no mod'
    }
    let oper_mode_List = [];
    for (let i = 0; i < mods.length; i++) {
        let oper_part_List = [];
        let mod = mods[i]
        console.log(chalk.green("---------" + i + " module: " + mod.name + " begin work--------"));
        //处理js        
        oper_part_List.push(entryExWorker('./', mod.scriptEntry, [], opt).then(pathArray => {
            return Promise.all(
                pathArray.map(_pobj => {
                    return opt.justCopy ? _copyFile(_pobj.src, _pobj.target, opt) : _exJsFile(_pobj.src, _pobj.target, opt);
                })
            )
        }))
        //处理css        
        oper_part_List.push(entryExWorker('./', mod.styleEntry, [], opt).then(pathArray => {
            return Promise.all(
                pathArray.map(_pobj => {
                    return opt.justCopy ? _copyFile(_pobj.src, _pobj.target, opt) : _exCssFile(_pobj.src, _pobj.target, opt);
                })
            )
        }))
        //处理html
        oper_part_List.push(entryExWorker('./', mod.htmlEntry, [], opt).then(pathArray => {
            return Promise.all(
                pathArray.map(_pobj => {
                    return _copyFile(_pobj.src, _pobj.target, opt);
                })
            )
        }))
        //处理copy 
        oper_part_List.push(entryExWorker('./', mod.copyEntry, [], opt).then(pathArray => {
            return Promise.all(
                pathArray.map(_pobj => {
                    return _copyFile(_pobj.src, _pobj.target, opt);
                })
            )
        }))

        //每个模块处理完后
        oper_mode_List.push(
            Promise.all(oper_part_List).then(values => {
                console.log(chalk.green("---------" + i + " module: " + mod.name + " finish work--------"));
                return values;
            })
        )

    }

    //所有模块处理完后
    return Promise.all(oper_mode_List).then(values => {
        let count = 0;
        values.forEach(x => count += x.length)
        console.timeEnd("work")
        console.log(succes('执行完毕 共处理 ' + count + '个文件||文件夹'))
    })
}

//包装那个递归方法_recursiveEntry以支持promise
function entryExWorker(root, entry, _pobjList, opt) {
    return new Promise((res, rej) => {
        try {
            let result = [];
            let pathlist = _recursiveEntry(root, entry, _pobjList, opt)
            //distinct
            pathlist.filter(_pathobj => {
                let i = result.findIndex(x => x.src === _pathobj.src && x.target === _pathobj.target);
                //if i'm not in the result  
                //    then push me in result
                if (i === -1) {
                    result.push(_pathobj);
                }
            })
            res(result)
        } catch (err) {
            rej(err)
        }
    })
}

/**
 * 递归处理entry 
 * @param {any} root 起始目录 XXXX/
 * @param {any} entry 入口
 * @param {any} func 处理func
 */
function _recursiveEntry(root, entry, _pobjList, opt) {
    if (typeof entry === 'string') {//如果entry是_path 的 string
        _pobjList = _solvePath(entry, root, opt.dir)
    } else if (entry instanceof Array) {//如果entry是_path 的 string[]
        _pobjList = entry.forEach(item => {
            Array.prototype.push.apply(_pobjList, _solvePath(item, root, opt.dir));
        })
    } else if (typeof entry === 'object') {  //entry 是 object
        for (const key in entry) {
            if (!entry.hasOwnProperty(key)) {
                continue
            }
            const pro = entry[key];
            if (key === "test") {
                if (pro instanceof Array) {
                    pro.forEach(item => {
                        Array.prototype.push.apply(_pobjList, _solvePath(item, root, opt.dir));
                    })
                } else {
                    Array.prototype.push.apply(_pobjList, _solvePath(pro, root, opt.dir));
                }
            }//属性项目是obj则递归
            else if (typeof pro === 'object') {
                _recursiveEntry(root + key + '/', pro, _pobjList, opt);
            }
        }
    }
    return _pobjList
}

/**
 * 将各种格式的src数组处理成标准的src并生成其对应的target地址 
 * 处理正则 
 * @param {any} srcPathStr 
 * @param {any} srcRoot  数据源所在文件夹, 相对路径 eg. ./script/
 * @param {any} targetRoot  目标目录文件夹, 相对路径 eg. ./dist/
 * @returns 
 */
function _solvePath(srcPathStr, srcRoot, targetRoot) {

    let result = [];
    let srcPathArray;
    const regexTag = new RegExp(/{.*}/, 'g');
    // const getRegexTag = new RegExp('/(?<={)[^}]*/','g');
    //TODO:如果包含正则
    if (regexTag.test(srcPathStr)) {
        let pathSplitList = srcPathStr.split('/');
        //记录第几节有正则,并且有哪些匹配结果,没有正则的放普通记录TODO: 应该是树形结构
        // let regexMatch = new Array(pathSplitList.length + 1).fill(new Array());
        let regexMatch = []
        let pathTreeRoot = new partPathTreeNode(srcRoot);
        regexMatch[0] = [pathTreeRoot];
        for (let i = 0; i < pathSplitList.length; i++) {
            const _pathPart = pathSplitList[i];
            regexMatch[i + 1] = regexMatch[i + 1] || [];
            //如果这部分是正则
            if (regexTag.test(_pathPart)) {
                //获取正则表达式                
                // let regex = /(?<={)[^}]*/.exec(_pathPart);
                let regex = /(?:{)[^}]*/.exec(_pathPart);
                regex = regex ? regex[0].substr(1) : '';
                regex = new RegExp(regex);
                //读出正则所在这级的所有文件和文件夹的name 并从中筛选出符合正则的文件||文件夹                
                regexMatch[i].forEach(node => {
                    let _root = node.getWholePath() + '/';
                    result = _readDir(_root, { recursive: true, sync: true, returnAll: true })
                    result
                        .map(name => {
                            return name.replace(_root, '');
                        })
                        .filter(name => {
                            return regex.test(name);
                        }).forEach(name => {
                            var childNode = new partPathTreeNode(name)
                            node.addChild(childNode);
                            regexMatch[i + 1].push(childNode)
                        })
                })

            } else {
                regexMatch[i].forEach(node => {
                    var childNode = new partPathTreeNode(_pathPart)
                    node.addChild(childNode);
                    regexMatch[i + 1].push(childNode)
                })
            }
        }
        result = regexMatch[regexMatch.length - 1]
            .map(item => {
                let _path = item.getWholePath();
                return new pathObj(_path, path.resolve(targetRoot, _path));
            })
    } else if (/\*\*/.test(srcPathStr)) { //如果包含 ** 符号 将下发所有内容和内容的内容加入list
        //TODO: WHOLE DIST COPY?
        result = _readDir(srcRoot + srcPathStr.replace('**', ''), { recursive: true, sync: true })
            .map(_path => {
                return new pathObj(_path, path.resolve(targetRoot, _path));
            })

    } else if (/\*/.test(srcPathStr)) { //如果包含 * 符号 将下放内容(只是同级k非文件夹)加入list
        result = _readDir(srcRoot + srcPathStr.replace('*', ''), { recursive: false, sync: true })
            .map(_path => {
                return new pathObj(_path, path.resolve(targetRoot, _path));
            })
    } else {
        result.push(new pathObj(srcRoot + srcPathStr, path.resolve(targetRoot, srcRoot, srcPathStr)));
    }
    return result;

}

/**
 *　读取文件夹下的文件, 返回其相对路径数组
 *  返回路径带着root!!!!!!
 * @param {string} root  哪个目录
 * @param {bool} opt 
 *  {bool} recursive 是否递归查询子项文件夹里的内容 default:false 不递归
 *  {bool} sync  是否同步 default:false TODO: SUPPORT ASYNC default:false 异步
 *  {bool} returnAll  是否返回所有name,(包括市文件夹的) default:false 只返回是文件的
 */
function _readDir(root, opt) {

    let result = [];
    let names = fs.readdirSync(root)
    for (let i = 0; i < names.length; i++) {
        const filepath = root + names[i];
        //如果是文件夹
        if (fs.statSync(filepath).isDirectory()) {
            //要求递归则深入
            if (opt.recursive) {
                Array.prototype.push.apply(result, _readDir(filepath + '/', { recursive: true, sync: true }));
            } else if (!opt.returnAll) {//如果不是指定也要floder的则忽略此name
                continue
            }
        }
        result.push(filepath)
    }
    return result;
}

/**
 * 读取并压缩并复制
 * 这里不管正则什么的,路径提前生成好
 * @param {any} src 文件源 string
 * @param {any} target 结果目标 string
 * @param {object} opt 
 */
function _exJsFile(src, target, opt) {
    if (path.extname(src) !== opt.scriptExName) {
        src += opt.scriptExName;
    }
    if (!fs.pathExistsSync(src)) {
        return new Promise(function (resolve) {
            resolve({ err: 'no file' });
        });
    }
    console.log(succes('start min work on ' + src))
    if (path.extname(target) !== opt.scriptExName) {
        target += opt.scriptExName;
    }
    return fs.readFile(src, 'utf8')
        .then((data) => {
            let result = uglifyjs.minify(data, {
                output: {
                    ascii_only: opt.ascii_only,
                    beautify: opt.beautify
                }
            });
            if (result.error) {
                throw result.error;
            }
            return _fuckDir(target).then(() => {
                return fs.writeFile(target, result.code)
            });
        }).then(() => {
            console.log(succes('min done: ' + target))
            return { src: src, target: target };
        }).catch(err => {
            console.log(error('min error: ' + target))
            console.log(error('-----------msg-------------'))
            console.log(error(err))
            console.log(error('-----------msg-------------'))
            console.log(warn('try to start copy :' + target))
            _copyFile(src, target, opt);
        })
}

/**
 * 读取并压缩并复制
 * 这里不管正则什么的,路径提前生成好
 * @param {any} src 文件源 string
 * @param {any} target 结果目标 string
 * @param {object} opt 
 */
function _exCssFile(src, target, opt) {
    if (path.extname(src) !== opt.styleExName) {
        src += opt.styleExName;
    }
    if (!fs.pathExistsSync(src)) {
        return new Promise(function (resolve) {
            resolve({ err: 'no file' });
        });
    }
    console.log(succes('start css work on ' + src))
    if (path.extname(target) !== opt.styleExName) {
        target += opt.styleExName;
    }
    return fs.readFile(src, 'utf8')
        .then((data) => {
            return cleanCssFunc.minify(data)
        }).then(result => {
            if (result.error) {
                throw result.error;
            }
            return _fuckDir(target).then(() => {
                return fs.writeFile(target, result.styles)
            });
        }).then(() => {
            console.log(succes('min style done: ' + target))
            return { src: src, target: target };
        }).catch(err => {
            console.log(error('min style error: ' + target))
            console.log(error('-----------msg-------------'))
            console.log(error(err))
            console.log(error('-----------msg-------------'))
            console.log(warn('try to start copy :' + target))
            _copyFile(src, target, opt);
        })
}

/**
 * 复制文件
 * 这里不管正则什么的,路径要提前生成好
 * @param {any} src 文件源 string
 * @param {any} target 结果目标 string
 */
function _copyFile(src, target, opt) {
    console.log(succes('start copy on ' + src))
    return _fuckDir(target)
        .then(() => {
            return fs.copy(src, target)
        }).then(() => {
            console.log(succes('copy done: ' + target))
            return { src: src, target: target };
        }).catch(err => {
            if (err) {
                console.log(error('copy error: ' + target))
                console.log(error('-----------msg-------------'))
                console.log(error(err))
                console.log(error('-----------msg-------------'))
            }
        })
}

//make sure that path is exists
function _fuckDir(pathStr) {
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
}

/** ----------------- below is class define ------------------ **/

function pathObj(src, target) {
    return {
        src: src,
        target: target,
    }
}
function partPathTreeNode(path, parent) {
    function _setMyLevel() {
        let parPath = this.parent ? this.parent.getWholePath() : '';
        this.wholePath = !parPath.trim() ? this.path : parPath + '/' + this.path;
        this.level = this.parent ? this.parent.getLevel() + 1 : 0;
    }

    let result = {
        level: 0,
        parent: parent,
        wholePath: "",
        path: path,
        children: [],
        setParent: function (parent) {
            this.parent = parent;
            _setMyLevel.call(this);
        },
        getLevel: function () {
            return this.level
        },
        addChild: function (child) {
            child.parent = this
            _setMyLevel.call(child);
            this.children.push(child)
        },
        getWholePath: function () {
            return this.wholePath;
        }
    }
    _setMyLevel.call(result);
    return result
}

module.exports = {
    options: {},
    start: function (modNames, options) {
        this.options = extend(true, defaultOpt, options);
        return _start.call(this, modNames, this.options);
    },
    setConfig: function (options) {
        return _setConfig.call(this, options);
    }
}