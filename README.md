# uglifySite [![NPM](https://api.travis-ci.org/MAGICSCIENTIST/uglifySite.svg?branch=master)](https://travis-ci.org/MAGICSCIENTIST/uglifySite) [![NPM ver](https://img.shields.io/npm/v/uglifysite.svg?style=flat)](https://www.npmjs.com/package/uglifysite) [![ISSUES](https://img.shields.io/github/issues/MAGICSCIENTIST/uglifySite.svg)](https://github.com/MAGICSCIENTIST/uglifySite/issues) [![LICENSE](https://img.shields.io/github/license/MAGICSCIENTIST/uglifySite.svg)](https://github.com/MAGICSCIENTIST/uglifySite/blob/master/LICENSE) [![NODE](https://img.shields.io/badge/node-%3E6.11.2-brightgreen.svg)](https://nodejs.org/en/) [![pro]( http://progressed.io/bar/80?title=completed)]()




 
 
a library to min or copy your site's everything. split large project to small part. support dojo define.
这是一个能把你的站点文件中能压缩的压缩,不能压缩的复制出, 从而分出一个新的project的类库. 主要用作自动的把庞大的项目分割成可用的小项目.
因为可以copy,所以理论上只要有分拣需求,不是网站也能用(→_→)
### [更新日志](https://github.com/MAGICSCIENTIST/uglifySite/blob/master/CHANGELOG.md)

# Installation
 

* $  npm install uglifysite --save-dev

# WHY I START
手中项目结构复杂,工作需要经常将代码按功能模块拆分成小型可用系统.初步尝试使用webpack,但是可能是我太菜,由于项目使用了arcgis api for javascript, 打包屡次失败, 恼羞成怒┴─┴︵╰（‵□′╰）.考虑到各种框架的兼容性,再踩坑下去可能要跪,干脆就做了这么一个可以单纯压缩分解庞大项目的工具.

in my case,站点整体体积大约减少45% *★,°*:.☆\(￣▽￣)/$:*.°★*。撒花！

# CANDO-LIST
- [x] clean target folder before start (you set `clearExportDir` to `false`  to disable this features in config file).
- [x] uglify `.js` `.css` file. if minify failed,the file will be copy to the target folder.
- [x] copy `everything` to target folder.
- [x] support custom config, such like your module's `name` `copyEntry` `scriptEntry` `htmlEntry` `styleEntry` `linkMods` target folder and some other things with api or js file.
- [x] with modules's `linkMods` i can find module's module recursively . with this sometimes you don't have to write too many names to solve a lot of files when your module have defined it's reference.
- [x] entry's config support `*` to get it's children(child's children **not** included), `**` to get it's children(child's children **is** included) and Regular expression.
- [x] support commander . please tap `-h` to get more details
- [x] download from npm 

# TODO-LIST
- [ ] check and support other type like `scss` `less` and so on
- [ ] make a Better Progressbar
- [ ] open loader function api for custom type file
- [x] simple document
- [ ] example

# TRY-LIST
- [ ] do something for `.html` files
- [ ] combine two `.js` or `.css` files if allowed
- [ ] try to kill images that no use
- [ ] faster and faster

# HOW TO USE
## from commander

```
$ uglifysite -c ./xxx/uglify.config.js -m mod1,mod2... 
```

```
//-c is set config file path , default is uglify.config.js in the root 
$ -c  xxxx/xxx/xxxxx.js
```

```
//-m is set which module should be pack, can be a list split by \,\ .data is the name that defined in your config file 
$ -m  XXX1,XXX2,XXX3

// -m all means build all module defined in config file
$ -m  all
```

```
// other params
$ --copy  //mens do not build or uglify just copy

$ --clear  //mens clear target folder before build
```



## from api

```  javascript
let uglifySite = require('uglifySite');
uglifySite
  .setConfig('./uglify.config.js') //.setConfig(configObj) 
  .then(res=>{
    return uglifySite.start('modName or modNames array')
    //uglifySite.start('all');//do with all modules that defined in config
    //uglifySite.start('XXX');
    //uglifySite.start(['XXX1','XXX2']);
  })
  .then(()=>{
    //done
  })
```

## config file
* a basic config file 
``` javascript
module.exports = {
    dir: './dist/', //输出根目录 export to where
    clearExportDir: true, //干活前是否清空输出目录, if clear target dir before work
    modules: [ 
        //模块1 module1
        //模块2 module2
        //模块3 module3
        ...
    ]

}

```

* every defined module is a obj that has some parameters
``` javascript
{
            name:'common', //module's unique name 
            linkMods: ['XXXX1','XXXX2'], // reference modules's name.
            styleEntry{ //style files's location 
               test:"XXXX/XXXX.CSS"
            },
            scriptEntry:{ //script files's location
                test:"XXXX/XXXX.js"
            },
            htmlEntry:{//html files's  location
                test:"XXXX/XXXX.html"
            },
            copyEntry:{ //other files's location
                test:"XXXX/XXXX" //no extName === folder
            }
}

```

* all entry support several location types => obj tree, string||string[], Regular expression...
``` javascript
//string
scriptEntry:{
    test:'example/js/index.js'
}

//string[]
scriptEntry:{
    test:['example/js/index.js','example/js/index2.js']
}

//obj tree
scriptEntry:{
    example:{
        js:{    
            test:['index.js','index2.js']
        }
    }
}

//Regular expression in '{}'
scriptEntry:{
    test:'script/menu/{.+\.js}', //mean: script/menu/all js file 
}

// all test also support * and ** . (mostly used by copyEntry)
copyEntry:{
    test:'fonts/*', //mean: all file in fonts (child's children excluded)
}
copyEntry:{
    test:'fonts/**', //mean: all file in fonts (child's children included)
}

// obj tree support * and ** and regular expression too
copyEntry:{
    fonts:{
        test:'**'
    }
}
```
