var g_alpha = 1;
var bHalf = false;
var host = "10.22.102.18:6080";

var data = [
    { id: 35, Time: new Date("09/09/2014"), hid: 26, FBT: 1 }, { id: 34, Time: new Date("09/10/2014"), hid: 27, FBT: 2 },
    { id: 33, Time: new Date("09/11/2014"), hid: 28, FBT: 3 }, { id: 32, Time: new Date("09/12/2014"), hid: 29, FBT: 4 },
    { id: 31, Time: new Date("10/01/2014"), hid: 30, FBT: 5 }, { id: 30, Time: new Date("10/02/2014"), hid: 31, FBT: 6 },
    { id: 29, Time: new Date("10/03/2014"), hid: 32, FBT: 7 }, { id: 28, Time: new Date("10/04/2014"), hid: 33, FBT: 8 },
    { id: 27, Time: new Date("10/05/2014"), hid: 34, FBT: 9 }, { id: 17, Time: new Date("09/01/2015"), hid: 1, FBT: 11 },
    { id: 16, Time: new Date("09/02/2015"), hid: 2, FBT: 12 }, { id: 15, Time: new Date("09/03/2015"), hid: 3, FBT: 13 },
    { id: 14, Time: new Date("09/04/2015"), hid: 4, FBT: 14 }, { id: 13, Time: new Date("09/05/2015"), hid: 5, FBT: 15 },
    { id: 12, Time: new Date("09/06/2015"), hid: 6, FBT: 16 }, { id: 11, Time: new Date("09/07/2015"), hid: 7, FBT: 17 },
    { id: 18, Time: new Date("09/08/2015"), hid: 8, FBT: 18 }, { id: 10, Time: new Date("09/09/2015"), hid: 9, FBT: 19 },
    { id: 9, Time: new Date("09/10/2015"), hid: 10, FBT: 20 }, { id: 8, Time: new Date("09/11/2015"), hid: 11, FBT: 21 },
    { id: 7, Time: new Date("09/12/2015"), hid: 12, FBT: 22 }, { id: 6, Time: new Date("10/01/2015"), hid: 13, FBT: 23 },
    { id: 5, Time: new Date("10/02/2015"), hid: 14, FBT: 24 }, { id: 4, Time: new Date("10/03/2015"), hid: 15, FBT: 25 },
    { id: 3, Time: new Date("10/04/2015"), hid: 16, FBT: 26 }, { id: 2, Time: new Date("10/05/2015"), hid: 17, FBT: 27 },
    { id: 25, Time: new Date("10/06/2015"), hid: 18, FBT: 28 }, { id: 24, Time: new Date("10/07/2015"), hid: 19, FBT: 29 },
    { id: 23, Time: new Date("10/08/2015"), hid: 20, FBT: 30 }, { id: 22, Time: new Date("10/09/2015"), hid: 21, FBT: 31 },
    { id: 21, Time: new Date("10/10/2015"), hid: 22, FBT: 32 }, { id: 20, Time: new Date("10/11/2015"), hid: 23, FBT: 33 },
    { id: 19, Time: new Date("10/12/2015"), hid: 24, FBT: 34 }
]

var data2 = [
    { id: 20, Time: new Date("09/09/2014"), hid: 26 }, { id: 19, Time: new Date("09/10/2014"), hid: 27 },
    { id: 18, Time: new Date("09/11/2014"), hid: 26 }, { id: 17, Time: new Date("09/12/2014"), hid: 27 },
    { id: 16, Time: new Date("10/01/2014"), hid: 26 }, { id: 15, Time: new Date("10/02/2014"), hid: 27 },
    { id: 14, Time: new Date("10/03/2014"), hid: 26 }, { id: 13, Time: new Date("10/04/2014"), hid: 27 },
    { id: 12, Time: new Date("10/05/2014"), hid: 26 },

     { id: 4, Time: new Date("09/03/2015"), hid: 26 }, { id: 5, Time: new Date("09/08/2015"), hid: 27 },
     { id: 3, Time: new Date("09/09/2015"), hid: 26 }, { id: 2, Time: new Date("10/03/2015"), hid: 27 },
     { id: 1, Time: new Date("10/05/2015"), hid: 26 }, { id: 10, Time: new Date("10/06/2015"), hid: 27 },
     { id: 9, Time: new Date("10/07/2015"), hid: 26 }, { id: 8, Time: new Date("10/08/2015"), hid: 27 },
     { id: 7, Time: new Date("10/09/2015"), hid: 26 }, { id: 6, Time: new Date("10/10/2015"), hid: 27 },
]
var dates = new Array();
var indexs = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 27, 28, 29, 30, 31, 32, 33, 34, 35];
var layers = new Array();//每个时间段的疾病数据图层
var heatlayers = new Array();//每个时间段的热度图图层
var FBLayers = new Array();
var layer;
var visible = [];
var line;//当前一个图层序号
var current;//即将切换到的图层序号
require([
       "esri/map", "esri/layers/ArcGISDynamicMapServiceLayer", "esri/layers/ImageParameters",
       "esri/layers/ArcGISTiledMapServiceLayer","esri/renderers/HeatmapRenderer",
       "esri/dijit/TimeSlider","esri/TimeExtent","dojo/_base/array","dojo/dom","dojo/_base/connect",
       "esri/layers/FeatureLayer", "esri/InfoTemplate", "esri/dijit/Search",
       "esri/renderers/ClassBreaksRenderer", "esri/Color", "esri/renderers/BlendRenderer", "esri/renderers/SimpleRenderer", "esri/symbols/SimpleFillSymbol", "esri/symbols/SimpleLineSymbol", "esri/symbols/SimpleMarkerSymbol",
       "esri/dijit/HomeButton",
       "esri/tasks/RelationshipQuery",
       "dojo/domReady!"
], function (
       Map, ArcGISDynamicMapServiceLayer, ImageParameters,
       Tiled,HeatmapRenderer,
       TimeSlider,TimeExtent,arrayUtils,dom,connect,
       FeatureLayer, InfoTemplate, Search,
       ClassBreaksRenderer, Color, BlendRenderer, SimpleRenderer, SimpleFillSymbol, SimpleLineSymbol, SimpleMarkerSymbol,
       HomeButton,
       RelationshipQuery
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

    var XZQ = new ArcGISDynamicMapServiceLayer("http://10.22.102.18:6080/arcgis/rest/services/basemap/MapServer", {
        id: "DynamicXZQ"
    });
    map.addLayers(XZQ);
    //XZQ.on("update-end", function () {
    //    console.log("行政区动态图层加载完毕");
    //});
    

    //地图加载
    var tiled = new Tiled("http://10.22.102.18:6080/arcgis/rest/services/basemap/MapServer", {
        id: "XZQ",
        opacity:0.5
    });
   map.addLayer(tiled);



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
            //heatmapFeatureLayer.redraw();
            heatlayers[current].redraw();
        }
    });

    maxCtrl.addEventListener("change", function (evt) {
        var r = +evt.target.value;
        if (r !== heatmapRenderer.maxPixelIntensity) {
            heatmapRenderer.maxPixelIntensity = r;
            //heatmapFeatureLayer.redraw();
            heatlayers[current].redraw();
        }
    });

    minCtrl.addEventListener("change", function (evt) {
        var r = +evt.target.value;
        if (r !== heatmapRenderer.minPixelIntensity) {
            heatmapRenderer.minPixelIntensity = r;
            //heatmapFeatureLayer.redraw();
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
        //heatmapFeatureLayer.redraw();
        heatlayers[current].redraw();
    });



    //医疗点数据
    var HLayer = new FeatureLayer("http://10.22.102.18:6080/arcgis/rest/services/Data/MapServer/0", {
        mode: FeatureLayer.MODE_ONDEMAND,
        opacity: 1,
        outFields: ["*"],
        infoTemplate: new InfoTemplate("医疗机构", "医疗机构：${NAME}<br/>机构ID：${JGID}")
    });
    var relationQuery = new RelationshipQuery();
    relationQuery.relationshipId = 1;
    connect.connect(HLayer, "onClick", function (evt) {
        var grapicAttributes = evt.graphic.attributes;
        console.log(grapicAttributes.JGID);
        dom.byId("name").innerHTML = grapicAttributes.NAME;
        dom.byId("DList").src = "/Map/Query?JGID=" + grapicAttributes.JGID;
        dom.byId("DChart").src = "/Map/Chart?JGID=" + grapicAttributes.JGID;
    });
    //医疗机构图例
    var Hrenderer = new SimpleRenderer(new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 5, new SimpleLineSymbol(SimpleFillSymbol.STYLE_SOLID, new Color([255, 255, 255]), 1), new Color([255, 255, 255])));

    HLayer.setRenderer(Hrenderer);
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
    var maptype = dojo.byId("MapType");
    dojo.connect(maptype, "onchange", function SelectChange() {
        var value = maptype.value;
        console.log(value);
        mapTypeChange();
        switch (value) {
            case "Place":
                HLayer.setVisibility(true);
                break;
            case "Situation":
                timeExtentChange();
                break;
            case "Heat":
                console.log("Heat");
                timeExtentChange();
                break;
            default: break;
        }
    });

    var chartmode = dom.byId("chartmode");
    connect.connect(chartmode, "onchange", function () {
        var value = chartmode.value;
        console.log(value);
        switch (value) {
            case "Day":

                break;
            case "Month":

                break;
            case "Year":

                break;
            default:
                break;
        }
    })

    var sicktype = dom.byId("SickType");
    connect.connect(sicktype, "onchange", function () {
        var value = sicktype.value;
        switch (value) {
            case "Rabies":
                break;
            case "AA":
                break;
            default: break;
        }
    })

    var mapTypeChange = function () {
        HLayer.setVisibility(false);
        if (current != undefined) {
            layers[current].setVisibility(false);
            layers[current].setOpacity(0);
            heatlayers[current].setVisibility(false);
            heatlayers[current].setOpacity(0);
        }
        if (line != undefined) {
            layers[line].setVisibility(false);
            layers[line].setOpacity(0);
            heatlayers[line].setVisibility(false);
            heatlayers[line].setOpacity(0);
        }
    }

    var timeSlider = new TimeSlider({
        style: "width:100%;",
        thumbMovingRate:1000
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
        console.log("Line:" + line + "  Current:" + current);
        if (current == undefined) {
            return;
        }
        var value = maptype.value;
        switch (value) {
            case "Place":
                return;
            case "Situation":
                layers[current].setVisibility(true);
                console.log("医疗疾病数据从图层编号：" + line + "切换到图层编号：" + current);
                ShowerSituation();
                console.log("医疗疾病数据渐变结束");
                break;
            case "Heat":
                heatlayers[current].setVisibility(true);
                console.log("热力图层从编号：" + line + "切换到图层编号为：" + current);
                ShowerHeat();
                console.log("热力图渐变结束");
                break;
            case "":
                break;
            default: break;
        }
        
        
        
       
    }

    var ShowerSituation = function () {
        
        var opacity = layers[current].opacity;
        if (opacity < 1) {
            opacity += 0.05;
            layers[current].setOpacity(opacity);
            if (line != undefined&&line!==current) {
                layers[line].setOpacity(1 - opacity);
                if (Number(1 - opacity) === 0) {
                    layers[line].setVisibility(false);
                }
                console.log("图层" + line + "透明度：" + layers[line].opacity+";  图层"+current+"透明度："+layers[current].opacity);
            }
            
            setTimeout(ShowerSituation, 50);
        }   
    }

    var ShowerHeat = function () {
        var opacity = heatlayers[current].opacity;
        if (opacity < 1) {
            opacity += 0.05;
            heatlayers[current].setOpacity(opacity);
            if (line != undefined && line !== current) {
                heatlayers[line].setOpacity(1 - opacity);
                if (Number(1 - opacity) === 0) {
                    heatlayers[line].setVisibility(false);
                }
                console.log("图层" + line + "透明度:" + heatlayers[line].opacity + "; 图层" + current + "透明度：" + heatlayers[current].opacity);
            }
            setTimeout(ShowerHeat, 20);
        }
    }

   
    //基础链接
    var featureLayerUrl = "http://"+host+"/arcgis/rest/services/Data/MapServer/";

    function AddAllFeatureLayers() {
        for (var i = 0; i < data.length; i++) {
            layers[i] = new FeatureLayer(featureLayerUrl + data[i].id, {
                mode: FeatureLayer.MODE_ONDEMAND,
                opacity: 0,
                visible: false,
                outFields: ["*"],
                infoTemplate: new InfoTemplate("疾病数据", "医疗机构：${JGID}<br/>名称：${NAME}<br/>疾病数据：${Data}<br/>时间：${Time}")
            });
            heatlayers[i] = new FeatureLayer(featureLayerUrl + data[i].id, {
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
    }

    function AddDynamicLayer() {
        console.log("开始加载动态图层");
        for (var i = 0; i < data.length; i++) {
            FBLayers[i] = new ArcGISDynamicMapServiceLayer("http://10.22.102.18:6080/arcgis/rest/services/FBT/MapServer");
            FBLayers.setVisibleLayers([data[i].FBT]);
            console.log(i);
        }
        console.log("加载动态图层结束");
    }

    //加载所有的疾病数据图层
    map.on("load", function () {
        AddAllFeatureLayers();
        AddDynamicLayer();
    })
    

    //搜索
    var s = new Search({
        sources: [{
            featureLayer: new FeatureLayer("http://10.22.102.18:6080/arcgis/rest/services/Data/MapServer/0", {
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