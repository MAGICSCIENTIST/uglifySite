
let chalk = require('chalk');
const succes = chalk.green;
const error = chalk.red;
const warn = chalk.yellow

module.exports={
    succes : function(msg){
        console.log(succes(`success: ${msg}`))
    },
    error  : function(msg){
        console.log(error(`success: ${msg}`))
    },
    warn : function(msg){
        console.log(warn(`success: ${msg}`))
    },
    info:function(msg){
        console.log(msg)
    }
}