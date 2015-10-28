var g_alpha = 1;
var bHalf = false;
var host = "";
var data = [
    { id: 35, Time: new Date("09/09/2014") }, { id: 34, Time: new Date("09/10/2014") },
    { id: 33, Time: new Date("09/11/2014") }, { id: 32, Time: new Date("09/12/2014") },
    { id: 31, Time: new Date("10/01/2014") }, { id: 30, Time: new Date("10/02/2014") },
    { id: 29, Time: new Date("10/03/2014") }, { id: 28, Time: new Date("10/04/2014") },
    { id: 27, Time: new Date("10/05/2014") }, { id: 17, Time: new Date("09/01/2015") },
    { id: 16, Time: new Date("09/02/2015") }, { id: 15, Time: new Date("09/03/2015") },
    { id: 14, Time: new Date("09/04/2015") }, { id: 13, Time: new Date("09/05/2015") },
    { id: 12, Time: new Date("09/06/2015") }, { id: 11, Time: new Date("09/07/2015") },
    { id: 18, Time: new Date("09/08/2015") }, { id: 10, Time: new Date("09/09/2015") },
    { id: 9, Time: new Date("09/10/2015") }, { id: 8, Time: new Date("09/11/2015") },
    { id: 7, Time: new Date("09/12/2015") }, { id: 6, Time: new Date("10/01/2015") },
    { id: 5, Time: new Date("10/02/2015") }, { id: 4, Time: new Date("10/03/2015") },
    { id: 3, Time: new Date("10/04/2015") }, { id: 2, Time: new Date("10/05/2015") },
    { id: 25, Time: new Date("10/06/2015") }, { id: 24, Time: new Date("10/07/2015") },
    { id: 23, Time: new Date("10/08/2015") }, { id: 22, Time: new Date("10/09/2015") },
    { id: 21, Time: new Date("10/10/2015") }, { id: 20, Time: new Date("10/11/2015") },
    { id: 19, Time: new Date("10/12/2015") }
];
var dates = new Array();
var indexs = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 27, 28, 29, 30, 31, 32, 33, 34, 35];
var layers = new Array();
var layer;
var line;
require([
       "esri/map", "esri/layers/ArcGISDynamicMapServiceLayer", "esri/layers/ImageParameters",
       "esri/layers/ArcGISTiledMapServiceLayer",
       "esri/dijit/TimeSlider","esri/TimeExtent","dojo/_base/array","dojo/dom","dojo/_base/connect",
       "esri/layers/FeatureLayer", "esri/InfoTemplate", "esri/dijit/Search",
       "esri/renderers/ClassBreaksRenderer", "esri/Color", "esri/renderers/BlendRenderer", "esri/renderers/SimpleRenderer", "esri/symbols/SimpleFillSymbol", "esri/symbols/SimpleLineSymbol", "esri/symbols/SimpleMarkerSymbol",
       "esri/dijit/HomeButton",
       "dojo/domReady!"
], function (
       Map, ArcGISDynamicMapServiceLayer, ImageParameters,
       Tiled,
       TimeSlider,TimeExtent,arrayUtils,dom,connect,
       FeatureLayer, InfoTemplate, Search,
       ClassBreaksRenderer, Color, BlendRenderer, SimpleRenderer, SimpleFillSymbol, SimpleLineSymbol, SimpleMarkerSymbol,
       HomeButton
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
    //地图加载
    var tiled = new Tiled("http://10.22.102.18:6080/arcgis/rest/services/basemap/MapServer", {
        id:"XZQ"
    });
    map.addLayer(tiled);
    //医疗点数据
    var HLayer = new FeatureLayer("http://10.22.102.18:6080/arcgis/rest/services/Data/MapServer/0", {
        mode: FeatureLayer.MODE_ONDEMAND,
        opacity: 1,
        outFields: ["*"],
        infoTemplate: new InfoTemplate("医疗机构", "医疗机构：${NAME}<br/>机构ID：${JGID}")
    });
    //医疗机构图例
    var Hrenderer = new SimpleRenderer(new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 5, new SimpleLineSymbol(SimpleFillSymbol.STYLE_SOLID, new Color([255, 255, 255]), 1), new Color([255, 255, 255])));

    HLayer.setRenderer(Hrenderer);
    map.addLayer(HLayer);

    //疾病数据图例
    var renderer = new SimpleRenderer(new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 10, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0, 255, 64]), 1), new Color([0, 255, 64])));
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
        mapTypeChange();
        switch (value) {
            case "Place":
                HLayer.setVisibility(true);
                break;
            case "Situation":
                timeExtentChange();
                break;
            default: break;
        }
    });

    var mapTypeChange = function () {
        HLayer.setVisibility(false);
        if (line != undefined) {
            layers[line].setVisibility(false);
            layers[line].setOpacity(0);
        }
    }

    var timeSlider = new TimeSlider({
        style: "width:100%;"
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
        var Serial = undefined;
        for (var i = 0; i < data.length; i++) {
            if (data[i].Time.toString() == currentTime.toString()) {
                Serial = i;
                console.log(Serial);
                break;
            }
        }
        var value = maptype.value;
        if (value != "Situation") {
            return;
        }
        if (Serial == undefined) {
            return;
        }
        if (line != undefined) {
            layers[line].setVisibility(false);
            layers[line].setOpacity(0);
        }
        layers[Serial].setVisibility(true);
        console.log("从图层编号：" + line + "切换到图层编号：" + Serial);
        line = Serial;
        Shower();
    }

    var Shower = function () {
        
        var opacity = layers[line].opacity;
        if (opacity >= 1.0) {
            return;
        } else {
            opacity += 0.005;
            layers[line].setOpacity(opacity);
            setTimeout(Shower, 5);
        }
    }
    //基础链接
    var featureLayerUrl = "http://10.22.102.18:6080/arcgis/rest/services/Data/MapServer/";

    function AddAllFeatureLayers() {
        for (var i = 0; i < data.length; i++) {
            layers[i] = new FeatureLayer(featureLayerUrl + data[i].id, {
                mode: FeatureLayer.MODE_ONDEMAND,
                opacity: 0,
                visible: false,
                outFields: ["*"],
                infoTemplate: new InfoTemplate("疾病数据", "医疗机构：${JGID}<br/>名称：${NAME}<br/>疾病数据：${Data}<br/>时间：${Time}")
            });
            layers[i].setRenderer(renderer);
        }
        map.addLayers(layers);
    }

    //加载所有的疾病数据图层
    map.on("load", function () {
        AddAllFeatureLayers();
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