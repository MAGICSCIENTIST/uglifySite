module.exports = {
    dir: './dist/', //输出根目录
    clearExportDir: false,
    beautify: false,
    justCopy: false,
    ascii_only: true,
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
            // styleEntry:{
            //     example:{
            //         css:{
            //             test:'**'
            //         }
            //     }
            // },
            // scriptEntry:{
            //   test:"testFiles/**"
            // },
            // copyEntry:{
            //     example:{
            //         fonts:{
            //             test:'*'
            //         }
            //     }
            // },
            // htmlEntry:{
            //     example:{
            //         html:{
            //             test:'index.html'
            //         }
            //     }
            // }
            entry: {
                test: "src/**"
            },
        }
    ],
    loader: [
        {
            test: [".vue"],
            loader: "vueLoader"
        },
        {
            test: [".css"],
            loader: "cssLoader"
        },        
        {
            test: [".js"],
            loader: "jsLoader"
        }
    ]

}
