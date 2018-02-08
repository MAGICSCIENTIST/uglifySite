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
            name: 'testRoot',
            linkMods: 'test',
            copyEntry: {
                test: ['fonts', 'image', 'script/Common/init.js']
            },
        },
        {
            name: 'test',
            scriptEntry: {
                test: 'script/VisualMonitoring/menu/{.+\.js}'
            },          
        },
        /*-------- 模块包定义 ---------------*/
        /* 基本模块 */
        {
            name: 'SYS',
            linkMods: [
                'common',
                'map',
                'login',
                'platformCenter'
            ]
        },
        /* 可视化监测 */
        {
            name: 'visualMonitor',
            linkMods: [
                'animalBio',
                'palnebio'
            ],
            scriptEntry: {
                test: [
                    'script/VisualMonitoring/menu/{.+\.js}',
                    'script/VisualMonitoring/initApp.js'
                ]
            },
            htmlEntry: {
                test: 'html/VisualMonitoring/main.html',
            }
        },


        /*-------- 子模块定义 ---------------*/
        /* common */
        {
            name: 'common',
            copyEntry: {
                test: ['fonts', 'image', 'script/Common/init.js'],
                // script:{
                //     Plugins:{
                //         test:'**'
                //     }
                // }
            },
            scriptEntry: {
                script: {
                    Common: {
                        /**枚举**/
                        Enum: {
                            test: 'mapType'
                        },
                        test: [
                            'appConfig', /**基础配置**/
                            // 'init', /**初始化用类**/
                            'baseCommand', /**基础命令**/
                            'baseTool', /**基础工具**/
                            'toolBar',/**工具条,地图上那个**/
                            'baseDialog', /**面板基类**/
                            'baseMenu', /**卡片菜单的基类**/
                            'dataAccess', /**数据传输类**/
                            'dateTool', /**日期工具类**/
                            'inherit', /**继承封装类**/
                            'jsonConvert',/**某些地方在用的转换方法类**/
                            'legend',/**图例类**/
                            'LogHelp', /**日志类**/
                            'monInquire', /**自定义查询类**/
                            'regular', /**正则封装类**/
                            'skin' /**换肤用,暂未启用**/
                        ]
                    },
                    Lib: {
                        test: [
                            'jquery-2.0.3.min',
                            'jquery.easing',
                            'webVideoCtrl' /**某视频用**/
                        ]
                    },
                    /**这里列举了几乎都会用的插件,特殊插件见下一节**/
                    Plugins: {
                        test: '**'
                        // Bootstrap: {
                        //     test: [
                        //         'beyond.min.js',
                        //         'bootstrap.min.js',
                        //     ]
                        // }
                    },

                },
            },
            htmlEntry: {
                html: {
                    test: 'index.html',
                },
                /**模板**/
                templates: {
                    common: {
                        test: [
                            'baseDialog.html', /**页面基本容器**/
                            'menuCard.html', /**卡片基本容器**/
                        ]
                    },
                },
            },
            styleEntry: {
                css: {
                    skin: {
                        test: 'skin-navyblue.css'
                    },
                    test: [
                        'beyond.min.css',
                        'bootstrap.min.css',
                        'childPages.css',
                        'common.css',
                        'formstyle.css',
                        'header.css',
                        /**下边这个字体图标的**/
                        'font-awesome.min.css',
                        'weather-icons.min.css',
                        'typicons.min.css',
                        'style.css',
                    ]
                },
                script: {
                    Plugins: {
                        test: '**'
                    }
                }
            }
        },
        /**map**/
        {
            name: 'map',
            //TODO: MOVE THIS OPTION'S JS FILE to SCRIPTENTRY
            copyEntry: {
                test: ['arcgis_js_api']
                // arcgis_js_api: {
                //     test: '**',
                // },
            },
            scriptEntry: {
                script: {
                    /**地图封装**/
                    Map: {
                        test: [
                            'esriMapClass.js', /**2d**/
                            'skyline.js', /**3d**/
                            'symbolFun.js',
                        ]
                    },
                    /**工具栏里的各种东西**/
                    Tools: {
                        command: {
                            test: [
                                'command_baseSwitch.js',
                                'command_clearMap.js',
                                'command_fullmap.js',
                                'command_landmarkManage.js',
                                'command_location.js',
                                'command_toc.js'
                            ]
                        },
                        tool: {
                            test: [
                                'tool_buffer_line.js',
                                'tool_buffer_point.js',
                                'tool_identifyTask.js',
                                'tool_meaArea.js',
                                'tool_meaLength.js'
                            ]
                        }
                    },

                }
            },
            htmlEntry: {
                /**模板**/
                templates: {
                    common: {
                        test: [
                            'baseDialog.html', /**页面基本容器**/
                            'menuCard.html', /**卡片基本容器**/
                        ]
                    },
                    toolbar: {
                        test: [
                            'baseSwitchPanel.html',
                            'buffPanel.html',
                            'landmarkManagePanel.html',
                            'locationPanel.html',
                            'tocPanel.html',
                        ]
                    }
                },
            }
        },
        /**登录**/
        {
            name: 'login',
            scriptEntry: 'script/Login/loginPage',
            htmlEntry: {
                test: 'loginPage.html'
            }
        },
        /**单点**/
        {
            name: 'platformCenter',
            scriptEntry: 'script/PlatformCenter/platformCenter.js',
            htmlEntry: 'html/PlatformCenter.html',
        },
        /** 动物多样性 **/
        {
            name: 'animalBio',
            scriptEntry: {
                script: {
                    VisualMonitoring: {
                        BioDiversity: {
                            test: 'animalBio'
                        }
                    }
                }
            },
            htmlEntry: {
                templates:{
                    VisualMonitoring:{
                        BioDiversity:{
                            Animal:{
                                test:"*"
                            }
                        }
                    }
                }                
            }
        }
    ]

}
