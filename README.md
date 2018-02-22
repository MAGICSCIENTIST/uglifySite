# uglifySite
a library to min or copy your site's everything. split large project to small part.
这是一个能把你的站点能压缩的压缩,不能压缩的赋值出一个新project的类库. 主要用作自动的把庞大的项目分割成可用的小项目.
理论上不是网站也能用(→_→)

# why i start this project
手中项目结构复杂,工作需要经常将代码按功能模块拆分成小型可用系统.初步尝试使用webpack,但是由于项目使用了arcgis api for javascript, 打包屡次失败, 恼羞成怒做了这么一个可以压缩分解庞大项目的工具.

# CANDO-LIST
- [x] uglify `.js` `.css` file. if min failed, the file will be copy to the target folder.
- [x] copy `everything` to target folder.
- [x] config your module's `name` `copyEntry` `scriptEntry` `htmlEntry` `styleEntry` `linkMods` with api or js file.
- [x] with modules's `linkMods` i can find module's module recursively . with this sometimes you don't have to write too many names to solve a lot of files when your module have defined it's reference.
- [x] entry's config support `*` to get it's children(child's children **not** included), `**` to get it's children(child's children **is** included) and Regular expression.
- [x] support commander . please tap `-h` to get more details

# TODO-LIST
- [ ] combine two `.js` or `.css` files if allowed
- [ ] do something for `.html` files
- [ ] check and support other type like `scss` `less` and so on
- [ ] make a Better Progressbar
- [ ] open loader function api for custom type file
- [ ] faster and faster
- [ ] example and document