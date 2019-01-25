;(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    global.echartsMap = factory()
}(this, (function() {
    var echartsMap = {}
    var myMap = null,dom = null,showData = null
    //34个省、市、自治区的名字拼音映射数组
    var provinces = {
        //23个省
        "台湾": "taiwan",
        "河北": "hebei",
        "山西": "shanxi",
        "辽宁": "liaoning",
        "吉林": "jilin",
        "黑龙江": "heilongjiang",
        "江苏": "jiangsu",
        "浙江": "zhejiang",
        "安徽": "anhui",
        "福建": "fujian",
        "江西": "jiangxi",
        "山东": "shandong",
        "河南": "henan",
        "湖北": "hubei",
        "湖南": "hunan",
        "广东": "guangdong",
        "海南": "hainan",
        "四川": "sichuan",
        "贵州": "guizhou",
        "云南": "yunnan",
        "陕西": "shanxi1",
        "甘肃": "gansu",
        "青海": "qinghai",
        //5个自治区
        "新疆": "xinjiang",
        "广西": "guangxi",
        "内蒙古": "neimenggu",
        "宁夏": "ningxia",
        "西藏": "xizang",
        //4个直辖市
        "北京": "beijing",
        "天津": "tianjin",
        "上海": "shanghai",
        "重庆": "chongqing",
        //2个特别行政区
        "香港": "xianggang",
        "澳门": "aomen"
    };

    // 初始化
    function init(id, data) {
        dom = document.getElementById(id)
        myMap = echarts.init(dom)
        showData = data
        goCity('china')
        myMap.on('click', (params) => {
            goCity(params.name)
        })
    }

    // 获取地图数据文件
    function getMapFile(fileName) {
        return new Promise((reslove, reject) => {
            var xml = new XMLHttpRequest()
            xml.open("GET",`statics/map/${fileName}.json`,true)
            xml.onreadystatechange = function() {
                if (xml.readyState==4 && xml.status==200) {
                    var data = window.JSON.parse(xml.responseText)
                    var d = []
                    for (var i = 0; i < data.features.length; i++) {
                        d.push({
                          name: data.features[i].properties.name
                        })
                    }
                    reslove(data)
                }
            }
            xml.send()
        })
    }

    // 跳往城市
    function goCity(city) {
        let path = ''
        if(city in provinces) {
            path = `province/${provinces[city]}`
        } else if (city in cityMap) {
            path = `city/${cityMap[city]}`
        } else {
            path = `china`
        }
        getMapFile(path).then(data => {
            echarts.registerMap(city, data);
            renderMap(city)
        })
    }

    function renderMap(map, data) {
        var option = {
            backgroundColor: '#36384d',
            title: {
                text: '三级下钻',
                left: 'center',
                textStyle: {
                    color: '#fff',
                    fontSize: 16
                }
            },
            tooltip: {
                trigger: 'item',
                formatter: '{b}'
            },
            animationDuration: 1000,
            animationEasing: 'cubicOut',
            animationDurationUpdate: 1000,
            visualMap: {
                min: 100,
                max: 200,
                calculable: true,
                inRange: {
                  color: ['#50a3ba', '#eac736', '#d94e5d']
                },
                textStyle: {
                  color: '#fff'
                }
            },
            geo: {
                map: map,
                label: {
                    emphasis: {
                        show: false
                    }
                },
                itemStyle: {
                    normal: {
                        areaColor: '#4777E8',
                        borderColor: '#111'
                    },
                    emphasis: {
                        areaColor: '#2a333d'
                    }
                }
            },
            series: [
                {
                    name: 'pm2.5',
                    type: 'scatter',
                    coordinateSystem: 'geo',
                    data: showData,
                    symbolSize: function(val) {
                        return val[2] / 10
                    },
                    label: {
                        normal: {
                            formatter: '{b}',
                            position: 'right',
                            show: false
                        },
                        emphasis: {
                            show: true
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: '#ddb926'
                        }
                    }
                }
            ]
        }
        myMap.setOption(option)
    }

    echartsMap.init = init
    echartsMap.goCity = goCity

    return echartsMap
})))