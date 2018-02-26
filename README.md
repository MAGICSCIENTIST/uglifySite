# uglifySite

[![NPM](https://api.travis-ci.org/MAGICSCIENTIST/uglifySite.svg?branch=master)](https://travis-ci.org/MAGICSCIENTIST/uglifySite) [![NPM ver](https://img.shields.io/npm/v/uglifysite.svg?style=flat)](https://www.npmjs.com/package/uglifysite) [![ISSUES](https://img.shields.io/github/issues/MAGICSCIENTIST/uglifySite.svg)](https://github.com/MAGICSCIENTIST/uglifySite/issues) [![LICENSE](https://img.shields.io/github/license/MAGICSCIENTIST/uglifySite.svg)](https://github.com/MAGICSCIENTIST/uglifySite/blob/master/LICENSE) [![NODE](https://img.shields.io/badge/node-%3E6.11.2-brightgreen.svg)](https://nodejs.org/en/) [![pro]( http://progressed.io/bar/80?title=completed)]()




 
 
a library to min or copy your site's everything. split large project to small part.
这是一个能把你的站点文件中能压缩的压缩,不能压缩的复制出, 从而分出一个新的project的类库. 主要用作自动的把庞大的项目分割成可用的小项目.
因为可以copy,所以理论上只要有分拣需求,不是网站也能用(→_→)

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
- [ ] example and document

# TRY-LIST
- [ ] do something for `.html` files
- [ ] combine two `.js` or `.css` files if allowed
- [ ] try to kill images that no use
- [ ] faster and faster
