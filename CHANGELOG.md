# CHANGE LOG

---

[TOC]

## 0.4.0
[+] 代码重构, 支持自定义某些扩展名文件的处理方法
[+] 新增命令 --init 生成一个默认配置文件
[+] 新增一些配置项


## 0.3.3
[+] 新增命令 --clear 和 --copy 和 --beautity

## 0.3.2
[^] 修复-m all 不能正常获取所有module的问题

## 0.3.1
[+] start方法接收"all"作为modNames参数,用于直接生成所有已定义的modules,会按name查重.

## 0.3.0
[+] 新增配置项 justCopy, true=>所有entry执行操作变为copy. 满足想要打包一个开发包,但配置文件不动的需求. 默认为false.

[+] 新增配置项 cssBeautifyMethod, clean-css的format配置项. 默认"beautify".

[^] 修复clearExportDir为false时有事会报错, 文件夹已存在的bug.

## 0.2.2
[+] 新增配置项 beautify 以控制文件处理方式true=>只美化不压缩,false=>压缩,默认为false

[+] 新增配置项 ascii_only 以解决某些中文会出现乱码的问题,默认为true

[^] 修改配置项 clearExportDir 默认值为false




