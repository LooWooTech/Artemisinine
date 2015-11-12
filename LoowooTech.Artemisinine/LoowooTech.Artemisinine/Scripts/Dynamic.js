﻿var host = "http://" + arcgisServer + ":6080";
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
    { id: 23, Time: new Date("10/08/2015"), hid: 20, FBT: 30,Ellipse:22 }, { id: 22, Time: new Date("10/09/2015"), hid: 21, FBT: 31,Ellipse:21 },
    { id: 21, Time: new Date("10/10/2015"), hid: 22, FBT: 32,Ellipse:20 }, { id: 20, Time: new Date("10/11/2015"), hid: 23, FBT: 33,Ellipse:19 },
    { id: 19, Time: new Date("10/12/2015"), hid: 24, FBT: 34,Ellipse:18 }
]//当前疾病数据配置信息

var sicktypes = new Array("Rabies", "AA");
var datas = new Array();//记录当前使用数据
var dates = new Array();//时间进度条设置时间数组
var TimeSliders = new Array();//所有时间进度条数组
var AATimeSlider;
var RabiesSlider;

var AllLayers = new Array();//所有时间段各种疾病的疾病数据图层
var AllHeatLayers = new Array();//所有时间段各种疾病的热度图数据图层
var AllEllipseLayers = new Array();//所有时间段各种疾病的椭圆图数据
var AllFBLayers = new Array();//所有时间段各种疾病的发病图数据

var layers = new Array();//每个时间段的疾病数据图层
var heatlayers = new Array();//每个时间段的热度图图层
var FBLayers = new Array();//每个时间段的发病图图层
var Ellipses = new Array();//每个时间段的椭圆图
var line;//当前一个图层序号
var current;//即将切换到的图层序号
var Serial=0;//当前查看疾病序号（指向哪种疾病）
var Type = "Place";//记录当前图层类型
var sickType = "Rabies";//记录当前疾病类型
var PlayFlag = false;//播放标记
require([
       "esri/map", "esri/layers/ArcGISDynamicMapServiceLayer", "esri/layers/ImageParameters", "esri/layers/RasterLayer",
       "esri/layers/ArcGISTiledMapServiceLayer", "esri/renderers/HeatmapRenderer",
       "esri/dijit/TimeSlider", "esri/TimeExtent", "dojo/_base/array", "dojo/dom", "dojo/_base/connect",
       "esri/layers/FeatureLayer", "esri/InfoTemplate", "esri/dijit/Search",
       "esri/renderers/ClassBreaksRenderer", "esri/Color","esri/renderers/UniqueValueRenderer", "esri/renderers/BlendRenderer", "esri/renderers/SimpleRenderer", "esri/symbols/SimpleFillSymbol", "esri/symbols/SimpleLineSymbol", "esri/symbols/SimpleMarkerSymbol",
       "esri/dijit/HomeButton",
       "esri/dijit/Popup","esri/dijit/PopupTemplate","dojo/dom-class","dojo/dom-construct","dojox/charting/Chart","dojox/charting/themes/Dollar",
       "esri/tasks/RelationshipQuery", "esri/domUtils", "dojo/parser",
       "esri/dijit/Legend",
       "dojo/domReady!"
], function (
       Map, ArcGISDynamicMapServiceLayer, ImageParameters, RasterLayer,
       Tiled, HeatmapRenderer,
       TimeSlider, TimeExtent, arrayUtils, dom, connect,
       FeatureLayer, InfoTemplate, Search,
       ClassBreaksRenderer, Color,UniqueValueRenderer, BlendRenderer, SimpleRenderer, SimpleFillSymbol, SimpleLineSymbol, SimpleMarkerSymbol,
       HomeButton,
       Popup,PopupTemplate,domClass,domConstruct,Chart,theme,
       RelationshipQuery,domUtils,parser,
       Legend
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

    var fill = new SimpleFillSymbol("solid", null, new Color("#A4CE67"));
    var popup = new Popup({
        fillSymbol: fill,
        titleInBody: false
    }, domConstruct.create("div"));
    domClass.add(popup.domNode, "dark");

    var template = new PopupTemplate({
        title: "各疾病发病率",
        description: "医疗机构：{NAME}<br/>机构ID：{JGID}<br/>ZZJGDM:{ZZJGDM}<br/>XZDM:{XZDM}",
        fieldInfos: [{
            fieldName: "Rabies00",
            label: "00"
        }, {
            fieldName: "AA01",
            label: "01"
        }],
        mediaInfos: [{
            caption: "",
            type: "barchart",
            value: {
                theme: "Dollar",
                fields: ["Rabies00", "AA01"]
            }
        }]
    });
    //var barLayer = new FeatureLayer("http://10.22.102.18:6080/arcgis/rest/services/HOSPITAL/MapServer/0", {
    //    mode: FeatureLayer.MODE_SNAPSHOT,
    //    //outFields: ["*"],
    //    //infoTemplate: new InfoTemplate("医疗机构", "医疗机构：${NAME}<br/>机构ID：${JGID}<br/>ZZJGDM:${ZZJGDM}<br/>XZDM:${XZDM}" )
    //});
   


    //医疗点数据
    //var HLayer = new FeatureLayer(host + "/arcgis/rest/services/Data/MapServer/0", {
    //    mode: FeatureLayer.MODE_SNAPSHOT,
    //    opacity: 1,
    //    outFields: ["*"],
    //    infoTemplate:template
    //    //infoTemplate: new InfoTemplate("医疗机构", "医疗机构：${NAME}<br/>机构ID：${JGID}<br/>ZZJGDM:${ZZJGDM}<br/>XZDM:${XZDM}" )
    //});
    //点击医疗机构图层事件
    //HLayer.on("click", function (evt) {
    //    var grapicAttributes = evt.graphic.attributes;
    //    console.log(grapicAttributes.JGID);
    //})
    //医疗机构图例
    var Hrenderer = new SimpleRenderer(new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 5, new SimpleLineSymbol(SimpleFillSymbol.STYLE_SOLID, new Color([255, 255, 255]), 1), new Color([255, 255, 255])));
    // HLayer.setRenderer(Hrenderer);

    var HLayer = new ArcGISDynamicMapServiceLayer(host+"/arcgis/rest/services/HOSPITAL/MapServer");
    HLayer.setInfoTemplates({
        0: { infoTemplate: new InfoTemplate("医疗机构", "医疗机构：${NAME}<br/>机构ID：${JGID}<br/>ZZJGDM:${ZZJGDM}<br/>XZDM:${XZDM}") }
    });
    map.addLayer(HLayer);
    var legend = new Legend({
        map: map
    }, "legendDiv");
    legend.startup();
    legend.refresh([{ layer: HLayer, title: '疾病图例' }]);
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
    var ellipsesymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([128, 255, 128]), 4), new Color([0, 0, 0, 0.25]));
    var ellipseRenderer = new UniqueValueRenderer(ellipsesymbol);

    var ellipseLocusLayer = new FeatureLayer(GetLayerUrl("Ellipse2") + "36", {
        mode: FeatureLayer.MODE_SNAPSHOT,
        opacity:0.8
    });

    //切换图层
    var maptype = dojo.byId("MapType");
    dojo.connect(maptype, "onchange", function SelectChange() {
        var value = maptype.value;
        console.log(value);
        mapTypeChange();
        Type = value;
        var time = GetTime();
        timeExtentChange(time);
    });
    var mapTypeChange = function () {
        //当切换图层的时候，首先获取之前的图层模式，根据之前的图层模式，处理相应的数据设置
        var count = 0;
        switch (Type) {
            case "Place":
                HLayer.setVisibility(false);
                $("#chart3").hide();
                break;
            case "Situation":
                count = layers.length;
                for (var i = 0; i < count; i++) {
                    layers[i].setVisibility(false);
                    layers[i].setOpacity(0);
                }
                break;
            case "Heat":
                count = heatlayers.length;
                for (var i = 0; i < count; i++) {
                    heatlayers[i].setVisibility(false);
                    heatlayers[i].setOpacity(0);
                }
                domUtils.hide(blurDiv);
                break;
            case "Onset":
                ClearFBLayers();
                break;
            case "Ellipse":
                map.removeLayer(ellipseLocusLayer);
                ClearEllipseLayers();
                break;
            default: break;
        }
    }
    //疾病类型切换
    var sickbtn = dom.byId("SickType");
    dojo.connect(sickbtn, "onchange", function () {
        Loading();
        console.log("疾病类型切换");
        ClearFeatureLayers();
        ClearHeatLayers();
        ClearEllipseLayers();
        ClearFBLayers();
        SickChange();
        AddAllFeatureLayers();
        AddDynamicLayer();
        var time = GetTime();
        timeExtentChange(time);
        Loaded();
    });
    //疾病类型切换
    function SickChange() {
        $("#timeSliderDiv" + sickType).hide();
        $("#" + sickType + "Button").hide();
        sickType = sickbtn.value;
        $("#timeSliderDiv" + sickType).show();
        $("#" + sickType + "Button").show();
        switch (sickType) {
            case "AA":
                data = Info.AA;
                break;
            case "Rabies":
                data = Info.Rabies;
                break;
        }
    }
    //获取当前选中疾病类型中的当前时间点
    function GetTime() {
        console.log(sickType);
        var slider;
        switch (sickType) {
            case "AA":
                slider = AATimeSlider;
                break;
            case "Rabies":
                console.log("GetTime 进入Rabies");
                slider = RabiesSlider;
                break;
        }
        var timeExtent = slider.getCurrentTimeExtent();
        console.log("startTime:" + timeExtent.startTime + " EndTime:" + timeExtent.endTime);
        var time = slider.getCurrentTimeExtent().endTime;
        //console.log(time);
        return time;
    }
    //时间进度条发生改变时间
    function timeExtentChange(currentTime) {
        dom.byId("modern").innerHTML = "<i>" + currentTime.getFullYear() + "年" + (currentTime.getMonth() + 1) + "月" + currentTime.getDate() + "日";
        for (var i = 0; i < data.length; i++) {
            if (data[i].Time.toString() == currentTime.toString()) {
                line = current;
                current = i;
                console.log(current);
                break;
            }
        }
        console.log("Line:" + line + "  Current:" + current + "Serial:" + Serial);
        if (current == undefined) {
            return;
        }
        var value = maptype.value;
        switch (value) {
            case "Place"://医疗机构
                $("#chart3").show();
                HLayer.setVisibility(true);
                return;
            case "Situation"://疾病数据
                layers[current].setVisibility(true);
                layers[current].opacityCount = 20;
                //console.log("医疗疾病数据从图层编号：" + line + "切换到图层编号：" + current);
                ShowerSituation(function () {
                    console.log("医疗疾病数据渐变结束");
                    layers[line].setOpacity(0);
                    layers[line].setVisibility(false);
                    
                    if (current == (data.length - 1)) {
                        console.log("到达最后一个时间点");
                        TimeSliderStop();

                    } else {
                        if (PlayFlag) {
                            TimeSliderPlay();
                        }
                    }
                    
                });
                
                break;
            case "Heat"://热度图
                domUtils.show(blurDiv);
                heatlayers[current].setVisibility(true);
                heatlayers[current].opacityCount = 20;
                console.log("热力图层从编号：" + line + "切换到图层编号为：" + current);
                ShowerHeat(function () {
                    console.log("热度图渐变结束");
                    if (current == (data.length - 1)) {
                        console.log("达到最后一个时间点");
                        TimeSliderStop();
                    } else {
                        if (PlayFlag) {
                            TimeSliderPlay();
                        }
                    }
                });
                break;
            case "Onset"://发病图
                if (current != undefined) {
                    FBLayers[current].setVisibility(true);
                    FBLayers[current].opacityCount = 20;
                    map.addLayer(FBLayers[current]);
                    FBLayers[current].setOpacity(0);
                }

                ShowerOnset(function () {
                    console.log("发病图渐变结束");
                    if (current == (data.length - 1)) {
                        console.log("到达最后一个时间点");
                        TimeSliderStop();
                    } else {
                        if (PlayFlag) {
                            TimeSliderPlay();
                        }
                    }
                });
                break;
            case "Ellipse"://椭圆图
                map.addLayer(ellipseLocusLayer);
                if (current != undefined) {
                    map.addLayer(Ellipses[current]);
                    Ellipses[current].setOpacity(0);
                    Ellipses[current].opacityCount = 20;
                }
                ShowEllipse(function () {
                    console.log("椭圆图渐变结束");
                    if (current == (data.length - 1)) {
                        console.log("到达最后一个时间点");
                        TimeSliderStop();
                    } else {
                        if (PlayFlag) {
                            TimeSliderPlay();
                        }
                    }
                });
                break;
            default: break;
        }
    }
    //疾病数据渐变
    var ShowerSituation = function (completefunc) {
        
        var lyr = layers[current];
        if (lyr.opacityCount == undefined) lyr.opacityCount = 20;
        if (lyr.opacityCount && lyr.opacityCount > 0) {
            lyr.opacityCount--;
            lyr.setOpacity(1 - lyr.opacityCount * 0.05);
            
            if (line && line != current) {
                var lyr2 = layers[line];
                lyr2.setOpacity(lyr.opacityCount * 0.05);
                console.log("图层" + line + "透明度：" + layers[line].opacity + ";  图层" + current + "透明度：" + layers[current].opacity);
                if (lyr.opacityCount == 0) lyr2.setVisibility(false);
            }
            setTimeout(function () { ShowerSituation(completefunc); }, 50);
        } else {
            completefunc();
        }
    }
    //热度图数据渐变
    var ShowerHeat = function (completefunc) {
        var lyr = heatlayers[current];
        if (lyr.opacityCount == undefined) lyr.opacityCount = 20;
        if (lyr.opacityCount && lyr.opacityCount > 0) {
            lyr.opacityCount--;
            lyr.setOpacity(1 - lyr.opacityCount * 0.05);

            if (line!=undefined && line != current) {
                var lyr2 = heatlayers[line];
                lyr2.setOpacity(lyr.opacityCount * 0.05);
                console.log("图层" + line + "透明度:" + heatlayers[line].opacity + "; 图层" + current + "透明度：" + heatlayers[current].opacity);
                if (lyr.opacityCount == 0) {
                    lyr2.setOpacity(0);
                    lyr2.setVisibility(false);
                }
                    
            }
            setTimeout(function () { ShowerHeat(completefunc); }, 50);
        } else {
            completefunc();
        }
        //var opacity = heatlayers[current].opacity;
        //if (opacity < 1) {
        //    opacity += 0.05;
        //    heatlayers[current].setOpacity(opacity);
        //    if (line != undefined && line !== current) {
        //        heatlayers[line].setOpacity(1 - opacity);
        //        if (Number(1 - opacity) === 0) {
        //            heatlayers[line].setVisibility(false);
        //        }
        //        console.log("图层" + line + "透明度:" + heatlayers[line].opacity + "; 图层" + current + "透明度：" + heatlayers[current].opacity);
        //    }
        //    setTimeout(ShowerHeat, 20);
        //}
        
    }
    //发病图数据渐变
    var ShowerOnset = function (completefunc) {
        var lyr = FBLayers[current];
        if (lyr.opacityCount == undefined) lyr.opacityCount = 20;
        if (lyr.opacityCount && lyr.opacityCount > 0) {
            lyr.opacityCount--;
            lyr.setOpacity(1 - lyr.opacityCount * 0.05);
            if (line!=undefined && line != current) {
                var lyr2 = FBLayers[line];
                lyr2.setOpacity(lyr.opacityCount * 0.05);
                if (lyr.opacityCount == 0) {
                    lyr2.setVisibility(false);
                    map.removeLayer(lyr2);
                }
            }
            setTimeout(function () { ShowerOnset(completefunc); }, 50);
        } else {
            completefunc();
        }



        //var opacity = FBLayers[current].opacity;
        //if (opacity < 1) {
        //    opacity += 0.05;
        //    FBLayers[current].setOpacity(opacity);
        //    if (line != undefined && line !== current) {
        //        FBLayers[line].setOpacity(1 - opacity);
        //        if (Number(1 - opacity) === 0) {
        //            FBLayers[line].setVisibility(false);
        //            map.removeLayer(FBLayers[line]);
        //        }
        //    }
        //    setTimeout(ShowerOnset, 20);
        //}
    }
    //椭圆图数据渐变
    var ShowEllipse = function (completefunc) {
        var lyr = Ellipses[current];
        if (lyr.opacityCount == undefined) lyr.opacityCount = 20;
        if (lyr.opacityCount && lyr.opacityCount > 0) {
            lyr.opacityCount--;
            lyr.setOpacity(1 - lyr.opacityCount * 0.05);
            if (line!=undefined && line != current) {
                var lyr2 = Ellipses[line];
                lyr2.setOpacity(lyr.opacityCount * 0.05);
                if (lyr.opacityCount == 0) {
                    //lyr2.setVisibility(false);
                    map.removeLayer(lyr2);
                }
            }
            setTimeout(function () { ShowEllipse(completefunc); }, 50);
        } else {
            completefunc();
        }
        //var opacity = Ellipses[current].opacity;
        //if (opacity < 1) {
        //    opacity += 0.05;
        //    Ellipses[current].setOpacity(opacity);
        //    if (line != undefined && line !== current) {
        //        Ellipses[line].setOpacity(1 - opacity);
        //        if (Number(1 - opacity) === 0) {
        //            map.removeLayer(Ellipses[line]);
        //        }
        //    }
        //    setTimeout(ShowEllipse, 20);
        //}
    }
    //获取服务链接
    function GetLayerUrl(MapService) {
        return host + "/arcgis/rest/services/" + MapService + "/MapServer/";
    }
    //清除疾病数据图层
    function ClearFeatureLayers() {
        var count = layers.length;
        for (var i = 0; i < count; i++) {
            map.removeLayer(layers[i]);
        }
    }
    //清除热度图数据图层
    function ClearHeatLayers() {
        var count = heatlayers.length;
        for (var i = 0; i < count; i++) {
            map.removeLayer(heatlayers[i]);
        }
    }
    //清除椭圆图数据图层
    function ClearEllipseLayers() {
        var count = Ellipses.length;
        for (var i = 0; i < count; i++) {
            map.removeLayer(Ellipses[i]);
        }
    }
    //清除发病图数据图层
    function ClearFBLayers() {
        var count = FBLayers.length;
        for (var i = 0; i < count; i++) {
            map.removeLayer(FBLayers[i]);
        }
    }
    //添加疾病数据和热力图
    function AddAllFeatureLayers() {
        
        for (var i = 0; i < data.length; i++) {
            console.log(GetLayerUrl("Data") + data[i].id);
            layers[i] = new FeatureLayer(GetLayerUrl("Data") + data[i].id, {
                mode: FeatureLayer.MODE_ONDEMAND,
                opacity: 0,
                visible: false,
                outFields: ["*"],
                infoTemplate: new InfoTemplate("疾病数据", "医疗机构：${JGID}<br/>名称：${NAME}<br/>疾病数据：${Data}<br/>")
            });
            heatlayers[i] = new FeatureLayer(GetLayerUrl("Data") + data[i].id, {
                mode: FeatureLayer.MODE_SNAPSHOT,
                opacity: 0,
                visible: false,
                outFields: ["*"],
                infoTemplate: new InfoTemplate("疾病数据", "医疗机构：${JGID}<br/>名称：${NAME}<br/>疾病数据：${Data}<br/>")
            });

            layers[i].setRenderer(renderer);
            heatlayers[i].setRenderer(heatmapRenderer);
        }
        map.addLayers(layers);
        map.addLayers(heatlayers);
    }
    //添加椭圆图和发病图
    function AddDynamicLayer() {
        
        for (var i = 0; i < data.length; i++) {
            FBLayers[i] = new ArcGISDynamicMapServiceLayer(GetLayerUrl("FBT"), {
                opacity: 0,
                visible:false
            });
            FBLayers[i].setVisibleLayers([data[i].FBT]);
            Ellipses[i] = new FeatureLayer(GetLayerUrl("Ellipse2") + data[i].Ellipse, {
                opacity: 0,
            });
            Ellipses[i].setRenderer(ellipseRenderer);
        }
        
    }
    //根据不同疾病数据，创建不同的时间进度条
    function CreateTimeSlider() {
       
        var AADate = new Array();
        AATimeSlider = new TimeSlider({
            style: "width:100%"
        }, dom.byId("timeSliderDivAA"));
        var count = Info.AA.length;
        for (var i = 0; i < count; i++) {
            AADate[i] = Info.AA[i].Time;
        }
        AATimeSlider.setTimeStops(AADate);
        AATimeSlider.startup();
        $("#timeSliderDivAA").hide();
        AATimeSlider.on("time-extent-change", function () {
            console.log("AA");
            var timeExtent = AATimeSlider.getCurrentTimeExtent();
            console.log("StartTime:" + timeExtent.startTime + "EndTime:" + timeExtent.endTime);
            timeExtentChange(timeExtent.endTime);
        })
        var RabiesDate = new Array();
        RabiesSlider = new TimeSlider({
            style: "width:100%"
        }, dom.byId("timeSliderDivRabies"));
        count = Info.Rabies.length;
        for (var i = 0; i < count; i++) {
            RabiesDate[i] = Info.Rabies[i].Time;
        }
        RabiesSlider.setTimeStops(RabiesDate);
        RabiesSlider.startup();
        $("#timeSliderDivRabies").hide();
        RabiesSlider.on("time-extent-change", function () {
            console.log("Rabies");
            var timeExtent = RabiesSlider.getCurrentTimeExtent();
            console.log("StartTime:" + timeExtent.startTime + "EndTime:" + timeExtent.endTime);
            timeExtentChange(timeExtent.endTime);
        })
    }
    //时间进度条播放
    function TimeSliderPlay() {
        var sicktype = sickbtn.value;
        switch (sicktype) {
            case "AA":
                AATimeSlider.next();
                break;
            case "Rabies":
                RabiesSlider.next();
                break;
        }
    }

    
    //时间进度条点击事件
    var AAPlay = dom.byId("AAButton");
    var RabiesPlay = dom.byId("RabiesButton");

    dojo.connect(AAPlay, "click", function () {
        if (PlayFlag) {//true->false 暂停
            PlayFlag = false;
            AAPlay.innerHTML = "<i class='glyphicon glyphicon-play'></i>";
            
        } else {//false->true  播放
            PlayFlag = true;
            AAPlay.innerHTML = "<i class='glyphicon glyphicon-pause'></i>";
            AATimeSlider.next();
        }
        console.log(PlayFlag);     
    });
    dojo.connect(RabiesPlay, "click", function () {
        console.log(PlayFlag);
        if (PlayFlag) {
            PlayFlag = false;
            RabiesPlay.innerHTML = "<i class='glyphicon glyphicon-play'></i>";
        } else {
            PlayFlag = true;
            RabiesPlay.innerHTML = "<i class='glyphicon glyphicon-pause'></i>";
            RabiesSlider.next();
        }
        console.log(PlayFlag);
    });

    function TimeSliderStop() {
        var sicktype = sickbtn.value;
        PlayFlag = false;
        switch (sicktype) {
            case "AA":
                AAPlay.innerHTML = "<i class='glyphicon glyphicon-play'></i>";
                break;
            case "Rabies":
                RabiesPlay.innerHTML = "<i class='glyphicon glyphicon-play'></i>";
                break;
        }
    }


    //加载所有的疾病数据图层
    map.on("load", function () {
        //创建所有疾病的时间进度条
        console.log("load结束");
        Loading();
        CreateTimeSlider();
        console.log("创建时间进度条OK了");
        SickChange();
        for (var i = 0; i < data.length; i++) {
            console.log("id:" + data[i].id + "Time:" + data[i].Time + "FBT:" + data[i].FBT + "Ellipse:" + data[i].Ellipse + "hid:" + data[i].hid);
        }
        AddAllFeatureLayers();
        AddDynamicLayer();
        Loaded();
        $(".tsPlayButton").hide();
        
    });

    function Loading() {
        $("#masker").show();
    }

    function Loaded() {
        $("#masker").hide();
    }

    var chartTime = dom.byId("btn-chart-time");
    var chartXzc = dom.byId("btn-chart-xzc");
    var chartSick = dom.byId("btn-chart-sick");

    dojo.connect(chartXzc, "click", function () {
        var xzc = dom.byId("XZC").value;
        var sickType = sickbtn.value;
        var beginTime = dom.byId("BeginTime").value;
        var endTime = dom.byId("EndTime").value;
        console.log("XZC:" + xzc + "sicktype:" + sickType + "beginTime:" + beginTime + "endTime:" + endTime);
        $("#chart").append("<div class='alert alert-dismissable WJL col-lg-3' role='alert'><button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button><h5>" + beginTime + "到" + endTime + sickType + "区域发病对比图</h5><iframe src='/map/Chart?type=xzc&&xzc=" + xzc + "&&sickType=" + sickType + "&&beginTime=" + beginTime + "&&endTime=" + endTime + "' class='iframe'></iframe></div>");

    });
    dojo.connect(chartTime, "click", function () {
        var xzc = dom.byId("XZC").value;
        var sickType = sickbtn.value;
        $("#chart").append("<div class='alert alert-dismissable WJL col-lg-3' role='alert'><button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button><h5>" + xzc + sickType + "发病趋势图</h5><iframe src='/map/Chart?type=time&&xzc=" + xzc + "&&sickType=" + sickType + "' class='iframe'></iframe></div>");

    });

    dojo.connect(chartSick, "click", function () {
        var beginTime = dom.byId("BeginTime").value;
        var xzc = dom.byId("XZC").value;
        $("#chart").append("<div class='alert alert-dismissable WJL col-lg-3' role='alert'><button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button><h5>" + beginTime + xzc + "多种疾病对比图</h5><iframe src='/map/Chart?type=sick&&xzc=" + xzc + "&&beginTime=" + beginTime + "' class='iframe'></iframe></div>");
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