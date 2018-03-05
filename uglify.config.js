module.exports = {
    dir: './dist/', //输出根目录
    clearExportDir: false,
    beautify :true,
    justCopy:false,
    ascii_only:true,
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
            name:'common',
            styleEntry:{
                example:{
                    css:{
                        test:'**'
                    }
                }
            },
            scriptEntry:{
                example:{
                    js:{
                        test:['index.js']
                    }
                }
            },
            copyEntry:{
                example:{
                    fonts:{
                        test:'*'
                    }
                }
            },
            htmlEntry:{
                example:{
                    html:{
                        test:'index.html'
                    }
                }
            }
        }
    ]

}
