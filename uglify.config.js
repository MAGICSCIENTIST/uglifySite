module.exports = {
    dir: './dist/', //输出根目录
    clearExportDir: true,
    clearExclude: {
        test: 'arcgis_js_api/**', //TODO: CHECK THIS
    },
    minExcluede: {
        test: 'arcgis_js_api/**', //TODO: CHECK THIS
    },
    exclude: {  //TODO: CHECK THIS TO EXCLUDE

    },
    modules: [
        {
            name:'copyExample',
            copyEntry:{
                test:'example/**'
            }
        }
    ]

}
