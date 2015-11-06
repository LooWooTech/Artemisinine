var g_alpha = 1;
var bHalf = false;
var host = "http://" + arcgisServer + ":6080";

var data = [
    { id: 35, Time: new Date("09/09/2014"), hid: 26, FBT: 1 ,Ellipse:34}, { id: 34, Time: new Date("09/10/2014"), hid: 27, FBT: 2,Ellipse:33 },
    { id: 33, Time: new Date("09/11/2014"), hid: 28, FBT: 3,Ellipse:32 }, { id: 32, Time: new Date("09/12/2014"), hid: 29, FBT: 4,Ellipse:31 },
    { id: 31, Time: new Date("10/01/2014"), hid: 30, FBT: 5,Ellipse:30 }, { id: 30, Time: new Date("10/02/2014"), hid: 31, FBT: 6,Ellipse:29 },
    { id: 29, Time: new Date("10/03/2014"), hid: 32, FBT: 7,Ellipse:28 }, { id: 28, Time: new Date("10/04/2014"), hid: 33, FBT: 8,Ellipse:27 },
    { id: 27, Time: new Date("10/05/2014"), hid: 34, FBT: 9,Ellipse:26 }, { id: 17, Time: new Date("09/01/2015"), hid: 1, FBT: 11,Ellipse:16 },
    { id: 16, Time: new Date("09/02/2015"), hid: 2, FBT: 12,Ellipse:15 }, { id: 15, Time: new Date("09/03/2015"), hid: 3, FBT: 13,Ellipse:14 },
    { id: 14, Time: new Date("09/04/2015"), hid: 4, FBT: 14,Ellipse:13 }, { id: 13, Time: new Date("09/05/2015"), hid: 5, FBT: 15,Ellipse:12 },
    { id: 12, Time: new Date("09/06/2015"), hid: 6, FBT: 16,Ellipse:11 }, { id: 11, Time: new Date("09/07/2015"), hid: 7, FBT: 17,Ellipse:10 },
    { id: 18, Time: new Date("09/08/2015"), hid: 8, FBT: 18,Ellipse:17 }, { id: 10, Time: new Date("09/09/2015"), hid: 9, FBT: 19,Ellipse:9 },
    { id: 9, Time: new Date("09/10/2015"), hid: 10, FBT: 20,Ellipse:8 }, { id: 8, Time: new Date("09/11/2015"), hid: 11, FBT: 21,Ellipse:7 },
    { id: 7, Time: new Date("09/12/2015"), hid: 12, FBT: 22,Ellipse:6 }, { id: 6, Time: new Date("10/01/2015"), hid: 13, FBT: 23,Ellipse:5 },
    { id: 5, Time: new Date("10/02/2015"), hid: 14, FBT: 24,Ellipse:4 }, { id: 4, Time: new Date("10/03/2015"), hid: 15, FBT: 25,Ellipse:3 },
    { id: 3, Time: new Date("10/04/2015"), hid: 16, FBT: 26,Ellipse:2 }, { id: 2, Time: new Date("10/05/2015"), hid: 17, FBT: 27,Ellipse:1 },
    { id: 25, Time: new Date("10/06/2015"), hid: 18, FBT: 28,Ellipse:24 }, { id: 24, Time: new Date("10/07/2015"), hid: 19, FBT: 29,Ellipse:23 },
    { id: 23, Time: new Date("10/08/2015"), hid: 20, FBT: 30,Ellipse:24 }, { id: 22, Time: new Date("10/09/2015"), hid: 21, FBT: 31,Ellipse:21 },
    { id: 21, Time: new Date("10/10/2015"), hid: 22, FBT: 32,Ellipse:20 }, { id: 20, Time: new Date("10/11/2015"), hid: 23, FBT: 33,Ellipse:19 },
    { id: 19, Time: new Date("10/12/2015"), hid: 24, FBT: 34,Ellipse:18 }
]
var dates = new Array();
var AllLayers = new Array();//所有时间段各种疾病的疾病数据图层
var AllHeatLayers = new Array();//所有时间段各种疾病的热度图数据图层
var AllEllipseLayers = new Array();//所有时间段各种疾病的椭圆图数据
var AllFBLayers = new Array();//所有时间段各种疾病的发病图数据

var indexs = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 27, 28, 29, 30, 31, 32, 33, 34, 35];
var layers = new Array();//每个时间段的疾病数据图层
var heatlayers = new Array();//每个时间段的热度图图层
var FBLayers = new Array();//每个时间段的发病图图层
var Ellipses = new Array();//每个时间段的椭圆图
var layer;
var visible = [];
var line;//当前一个图层序号
var current;//即将切换到的图层序号
var Serial=0;//当前查看疾病序号（指向哪种疾病）
var Type = "Place";//记录当前图层类型
require([
       "esri/map", "esri/layers/ArcGISDynamicMapServiceLayer", "esri/layers/ImageParameters", "esri/layers/RasterLayer",
       "esri/layers/ArcGISTiledMapServiceLayer", "esri/renderers/HeatmapRenderer",
       "esri/dijit/TimeSlider", "esri/TimeExtent", "dojo/_base/array", "dojo/dom", "dojo/_base/connect",
       "esri/layers/FeatureLayer", "esri/InfoTemplate", "esri/dijit/Search",
       "esri/renderers/ClassBreaksRenderer", "esri/Color","esri/renderers/UniqueValueRenderer", "esri/renderers/BlendRenderer", "esri/renderers/SimpleRenderer", "esri/symbols/SimpleFillSymbol", "esri/symbols/SimpleLineSymbol", "esri/symbols/SimpleMarkerSymbol",
       "esri/dijit/HomeButton",
       "esri/tasks/RelationshipQuery","esri/domUtils","dojo/parser",
       "dojo/domReady!"
], function (
       Map, ArcGISDynamicMapServiceLayer, ImageParameters, RasterLayer,
       Tiled, HeatmapRenderer,
       TimeSlider, TimeExtent, arrayUtils, dom, connect,
       FeatureLayer, InfoTemplate, Search,
       ClassBreaksRenderer, Color,UniqueValueRenderer, BlendRenderer, SimpleRenderer, SimpleFillSymbol, SimpleLineSymbol, SimpleMarkerSymbol,
       HomeButton,
       RelationshipQuery,domUtils,parser
       ) {
    var map = new Map("map", {
        center:[108.363,23.094],
        logo: false
    });
 

    //全图
    var home = new HomeButton({
        map: map
    }, "HomeButton");
    home.startup();


    var XZQ = new ArcGISDynamicMapServiceLayer(host + "/arcgis/rest/services/basemap/MapServer", {
        id: "DynamicXZQ"
    });
    map.addLayers(XZQ);
    //地图加载
    var tiled = new Tiled(host + "/arcgis/rest/services/basemap/MapServer", {
        id: "XZQ",
        opacity: 0.5
    });
    map.addLayer(tiled);

    var blurDiv = dom.byId("blurInfo");
    var blurCtrl = dom.byId("blurControl");
    var maxCtrl = dom.byId("maxControl");
    var minCtrl = dom.byId("minControl");
    var valCtrl = dom.byId("valueControl");
    //热力图图例
    var heatmapRenderer = new HeatmapRenderer({
        field: "Data",
        blurRadius: blurCtrl.value,
        maxPixelIntensity: maxCtrl.value,
        minPixelIntensity: minCtrl.value
    });

    //热度图事件
    var sliders = document.querySelectorAll(".blurInfo p~input[type=range]");
    var addLiveValue = function (ctrl) {
        var val = ctrl.previousElementSibling.querySelector("span");
        ctrl.addEventListener("input", function (evt) {
            console.log(evt.target.value);
            val.innerHTML = evt.target.value;
        });
    };
    for (var i = 0; i < sliders.length; i++) {
        addLiveValue(sliders.item(i));
    }

    blurCtrl.addEventListener("change", function (evt) {
        var r = +evt.target.value;
        if (r !== heatmapRenderer.blurRadius) {
            heatmapRenderer.blurRadius = r;
            heatlayers[current].redraw();
        }
    });

    maxCtrl.addEventListener("change", function (evt) {
        var r = +evt.target.value;
        if (r !== heatmapRenderer.maxPixelIntensity) {
            heatmapRenderer.maxPixelIntensity = r;
            heatlayers[current].redraw();
        }
    });

    minCtrl.addEventListener("change", function (evt) {
        var r = +evt.target.value;
        if (r !== heatmapRenderer.minPixelIntensity) {
            heatmapRenderer.minPixelIntensity = r;
            heatlayers[current].redraw();
        }
    });

    valCtrl.addEventListener("change", function (evt) {
        var chk = evt.target.checked;
        if (!chk) {
            document.getElementById("maxValue").innerHTML = 21;
            maxCtrl.value = 21;
            heatmapRenderer.maxPixelIntensity = 21;
        }
        else {
            document.getElementById("maxValue").innerHTML = 250;
            maxCtrl.value = 250;
            heatmapRenderer.maxPixelIntensity = 250;

        }
        heatmapRenderer.field = (chk) ? "Data" : null;
        heatlayers[current].redraw();
    });



    //医疗点数据
    var HLayer = new FeatureLayer(host + "/arcgis/rest/services/Data/MapServer/0", {
        mode: FeatureLayer.MODE_SNAPSHOT,
        opacity: 1,
        outFields: ["*"],
        infoTemplate: new InfoTemplate("医疗机构", "医疗机构：${NAME}<br/>机构ID：${JGID}<br/>ZZJGDM:${ZZJGDM}<br/>XZDM:${XZDM}" )
    });
    var relationQuery = new RelationshipQuery();
    relationQuery.relationshipId = 1;
    //点击医疗机构图层事件
    HLayer.on("click", function (evt) {
        var grapicAttributes = evt.graphic.attributes;
        console.log(grapicAttributes.JGID);
        dom.byId("name").innerHTML = grapicAttributes.NAME;
        dom.byId("DList").src = "/Map/Query?JGID=" + grapicAttributes.JGID;
        dom.byId("DChart").src = "/Map/Chart?JGID=" + grapicAttributes.JGID;
    })
    //医疗机构图例
    var Hrenderer = new SimpleRenderer(new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 5, new SimpleLineSymbol(SimpleFillSymbol.STYLE_SOLID, new Color([255, 255, 255]), 1), new Color([255, 255, 255])));

   // HLayer.setRenderer(Hrenderer);
    map.addLayer(HLayer);

    //疾病数据图例
    var renderer = new SimpleRenderer(new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 20, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 0, 0, 0]), 0), new Color([255, 255, 255])));
    renderer.setColorInfo({
        field: "Data",
        minDataValue: 0.01,
        maxDataValue: 200,
        colors: [
            new Color([255, 0, 0, 0]),
            new Color([255, 0, 0, 1]),
        ]
    });
    renderer.setSizeInfo({
        field: "Data",
        minSize: 1,
        maxSize: 50,
        minDataValue: .01,
        maxDataValue: 100,
        valueUnit: "unknown"
    });
    //椭圆图图例

    var ellipsesymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT, new Color([0, 0, 0,0]), 2), new Color([128, 255, 128, 0.25]));
   
    var ellipseRenderer = new UniqueValueRenderer(ellipsesymbol);

    var maptype = dojo.byId("MapType");
    dojo.connect(maptype, "onchange", function SelectChange() {
        var value = maptype.value;
        console.log(value);
        mapTypeChange();
        Type = value;
        timeExtentChange();
    });


    var mapTypeChange = function () {
        //当切换图层的时候，首先获取之前的图层模式，根据之前的图层模式，处理相应的数据设置
        switch (Type) {
            case "Place":
                HLayer.setVisibility(false);
                break;
            case "Situation":
                if (current != undefined) {
                    layers[current].setVisibility(false);
                    layers[current].setOpacity(0);
                }
                if (line != undefined) {
                    layers[line].setVisibility(false);
                    layers[line].setOpacity(0);
                }
                break;
            case "Heat":
                if (current != undefined) {
                    heatlayers[current].setVisibility(false);
                    heatlayers[current].setOpacity(0);
                }

                if (line != undefined) {
                    heatlayers[line].setVisibility(false);
                    heatlayers[line].setOpacity(0);
                }
                domUtils.hide(blurDiv);
                break;
            case "Onset":
                var count = FBLayers.length;
                for (var i = 0; i < count; i++) {
                    map.removeLayer(FBLayers[i]);
                }
                break;
            case "Ellipse":
                var count = Ellipses.length;
                for (var i = 0; i < count; i++) {
                    map.removeLayer(Ellipses[i]);
                }
                break;
            default: break;
        }
    }

    //时间条创建
    var timeSlider = new TimeSlider({
        style: "width:100%;",
        thumbMovingRate: 1000
    }, dom.byId("timeSliderDiv"));
    for (var i = 0; i < data.length; i++) {
        dates[i] = data[i].Time;
    }
    timeSlider.setTimeStops(dates);
    timeSlider.startup();

    //切换时间点时间
    timeSlider.on("time-extent-change", function () {
        timeExtentChange();
    });

    var timeExtentChange = function () {
        var currentTime = timeSlider.getCurrentTimeExtent().endTime;
        dom.byId("modern").innerHTML = "<i>" + currentTime.getFullYear() + "年" + (currentTime.getMonth() + 1) + "月" + currentTime.getDate() + "日";
        for (var i = 0; i < data.length; i++) {
            if (data[i].Time.toString() == currentTime.toString()) {
                line = current;
                current = i;
                console.log(current);
                break;
            }
        }
        console.log("Line:" + line + "  Current:" + current+"Serial:"+Serial);

        if (current == undefined) {
            return;
        }
        var value = maptype.value;
        
        switch (value) {
            case "Place"://医疗机构
                HLayer.setVisibility(true);
                return;
            case "Situation"://疾病数据
                //AllLayers[0][0].setVisibility(true);
                //AllLayers[0][0].setOpacity(1);
                //AllLayers[Serial][current].setVisibility(true);
                layers[current].setVisibility(true);
                console.log("医疗疾病数据从图层编号：" + line + "切换到图层编号：" + current);
                ShowerSituation();
                console.log("医疗疾病数据渐变结束");
                break;
            case "Heat"://热度图
                domUtils.show(blurDiv);
                heatlayers[current].setVisibility(true);
                console.log("热力图层从编号：" + line + "切换到图层编号为：" + current);
                ShowerHeat();
                console.log("热力图渐变结束");
                break;
            case "Onset"://发病图
                if (current != undefined) {
                    FBLayers[current].setVisibility(true);
                    map.addLayer(FBLayers[current]);
                    FBLayers[current].setOpacity(0);
                }
                
                ShowerOnset();
                console.log("发病图渐变结束");
                break;
            case "Ellipse":
                if (current != undefined) {
                    map.addLayer(Ellipses[current]);
                    Ellipses[current].setOpacity(0);
                }
                ShowEllipse();
                break;
            default: break;
        }




    }

    //疾病数据渐变
    var ShowerSituation = function () {
        
        var opacity = layers[current].opacity;
        if (opacity < 1) {
            opacity += 0.05;
            layers[current].setOpacity(opacity);
            if (line != undefined && line !== current) {
                layers[line].setOpacity(1 - opacity);
                if (Number(1 - opacity) === 0) {
                    layers[line].setVisibility(false);
                }
                console.log("图层" + line + "透明度：" + layers[line].opacity + ";  图层" + current + "透明度：" + layers[current].opacity);
            }

            setTimeout(ShowerSituation, 50);
        }
        /*
        var opacity = AllLayers[Serial][current].opacity;
        if (opacity < 1) {
            opacity += 0.05;
            AllLayers[Serial][current].setOpacity(opacity);
            if (line != undefined && line !== current) {
                AllLayers[Serial][line].setOpacity(1 - opacity);
                if (Number(1 - opacity) === 0) {
                    AllLayers[Serial][line].setVisibility(false);
                }
            }
            setTimeout(ShowerSituation, 20);
        }*/
    }

    //热度图数据渐变
    var ShowerHeat = function () {
        var opacity = heatlayers[current].opacity;
        if (opacity < 1) {
            opacity += 0.05;
            heatlayers[current].setOpacity(opacity);
            if (line != undefined && line !== current) {
                heatlayers[line].setOpacity(1 - opacity);
                if (Number(1 - opacity) === 0) {
                    flag = false;
                    heatlayers[line].setVisibility(false);
                }
                console.log("图层" + line + "透明度:" + heatlayers[line].opacity + "; 图层" + current + "透明度：" + heatlayers[current].opacity);
            }
            setTimeout(ShowerHeat, 20);
        }
        
    }

    //发病图数据渐变
    var ShowerOnset = function () {
        var opacity = FBLayers[current].opacity;
        if (opacity < 1) {
            opacity += 0.05;
            FBLayers[current].setOpacity(opacity);
            if (line != undefined && line !== current) {
                FBLayers[line].setOpacity(1 - opacity);
                if (Number(1 - opacity) === 0) {
                    FBLayers[line].setVisibility(false);
                    map.removeLayer(FBLayers[line]);
                }
            }
            setTimeout(ShowerOnset, 20);
        }
    }

    var ShowEllipse = function () {
        var opacity = Ellipses[current].opacity;
        if (opacity < 1) {
            opacity += 0.05;
            Ellipses[current].setOpacity(opacity);
            if (line != undefined && line !== current) {
                Ellipses[line].setOpacity(1 - opacity);
                if (Number(1 - opacity) === 0) {
                    map.removeLayer(Ellipses[line]);
                }
            }
            setTimeout(ShowEllipse, 20);
        }
    }

    function GetLayerUrl(MapService) {
        return host + "/arcgis/rest/services/" + MapService + "/MapServer/";
    }


    function AddAllFeatureLayers() {
        
        for (var i = 0; i < data.length; i++) {
            console.log(GetLayerUrl("Data") + data[i].id);
            layers[i] = new FeatureLayer(GetLayerUrl("Data") + data[i].id, {
                mode: FeatureLayer.MODE_ONDEMAND,
                opacity: 0,
                visible: false,
                outFields: ["*"],
                infoTemplate: new InfoTemplate("疾病数据", "医疗机构：${JGID}<br/>名称：${NAME}<br/>疾病数据：${Data}<br/>时间：${Time}")
            });
            heatlayers[i] = new FeatureLayer(GetLayerUrl("Data") + data[i].id, {
                mode: FeatureLayer.MODE_SNAPSHOT,
                opacity: 0,
                visible: false,
                outFields: ["*"],
                infoTemplate: new InfoTemplate("疾病数据", "医疗机构：${JGID}<br/>名称：${NAME}<br/>疾病数据：${Data}<br/>时间：${Time}")
            });

            layers[i].setRenderer(renderer);
            heatlayers[i].setRenderer(heatmapRenderer);
        }
        map.addLayers(layers);
        map.addLayers(heatlayers);

        /*
        for (var i = 0; i < Info2.length; i++) {
            var templayers = new Array();//医疗疾病
            var tempheat = new Array();//热力图
            var tempEllipse = new Array();//椭圆图
            var tempFB = new Array();//发病
            for (var j = 0; j < Info2[i].length; j++) {
                templayers[j] = new FeatureLayer(GetLayerUrl("Data") + Info2[i][j].id, {
                    mode: FeatureLayer.MODE_ONDEMAND,
                    opacity: 0,
                    visible: false,
                    outFields: ["*"],
                    infoTemplate: new InfoTemplate("疾病数据", "医疗机构ID：${JGID}<br/>名称：${NAME}<br/>疾病数据：${Data}<br/>时间：${Time}")
                });
                templayers[j].setRenderer(renderer);
                tempheat[j] = new FeatureLayer(GetLayerUrl("Data") + Info2[i][j].id, {
                    mode: FeatureLayer.MODE_SNAPSHOT,
                    opacity: 0,
                    visible: false,
                    outFields: ["*"],
                    InfoTemplate: new InfoTemplate("疾病数据", "医疗机构：${JGID}<br/>名称：${NAME}<br/>疾病数据：${Data}<br/>时间：${Time}")
                });
                tempheat[j].setRenderer(heatmapRenderer);
                tempEllipse[j] = new FeatureLayer(GetLayerUrl("Ellipse") + Info[i][j].Ellipse, {
                    opacity: 0
                });
                tempEllipse[j].setRenderer(ellipseRenderer);
                tempFB[j] = new ArcGISDynamicMapServiceLayer(GetLayerUrl("FBT"), {
                    opacity: 0,
                    visible: false
                });
                tempFB[j].setVisibleLayers([Info2[i][j].FBT]);
            }
            AllLayers[i] = templayers;
            AllHeatLayers[i] = tempheat;
            AllEllipseLayers[i] = tempEllipse;
            AllFBLayers[i] = tempFB;
            map.addLayers(AllLayers[i]);
            map.addLayers(AllHeatLayers[i]);

        }*/
    }

    function AddDynamicLayer() {
        
        for (var i = 0; i < data.length; i++) {
            FBLayers[i] = new ArcGISDynamicMapServiceLayer(GetLayerUrl("FBT"), {
                opacity: 0,
                visible:false
            });
            FBLayers[i].setVisibleLayers([data[i].FBT]);
            Ellipses[i] = new FeatureLayer(GetLayerUrl("Ellipse") + data[i].Ellipse, {
                opacity: 0,
            });
            Ellipses[i].setRenderer(ellipseRenderer);
        }
        
    }

    //加载所有的疾病数据图层
    map.on("load", function () {
        AddAllFeatureLayers();
        AddDynamicLayer();
        //text();
    });



    //搜索
    var s = new Search({
        sources: [{
            featureLayer: new FeatureLayer(host + "/arcgis/rest/services/Data/MapServer/0", {
                outFields: ["*"],
                infoTemplate: new InfoTemplate("医疗机构", "医疗机构：${JGID}<br/>机构名称:${NAME}")
            }),
            searchFields: ["NAME"],
            outFields: ["JGID", "NAME"],
            displayField: "JGID",
            exactMatch: false,
            suggestionTemplate: "${JGID}",
            name: "医疗机构",
            enableSuggestions: false
        }],
        enableButtonMode: true,
        enableLabel: false,
        enableInfoWindow: true,
        showInfoWindowOnSelect: false,
        map: map
    }, "Search");
    s.startup();
})