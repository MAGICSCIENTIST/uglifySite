#!/usr/bin/env node
let path = require('path')
let program = require('commander');
let uglifySite = require("../uglifyBuild.js");

//set commander opt
program.version('0.2.0')
    .option('-c, --configPath <n>', '设置配置文件路径')
    .option('-m, --modNames <n>', '设置希望执行的模块')
    .parse(process.argv);


console.log(program.configPath)
console.log(program.modNames)

let _cpath = program.configPath || path.resolve("").replace(/\\/g,'/') + '/uglify.config.js';
uglifySite.setConfig(_cpath)
    .then(res => {
        console.log(uglifySite.options);
        // uglifySite.start('common');
        uglifySite.start(program.modNames.split(','));
    }).catch(err => {
        throw err;
    });
