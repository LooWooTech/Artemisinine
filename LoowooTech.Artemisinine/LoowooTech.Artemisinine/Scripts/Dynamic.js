var g_alpha = 1;
var bHalf = false;
require([
       "esri/map", "esri/layers/ArcGISDynamicMapServiceLayer", "esri/layers/ImageParameters",
       "esri/layers/ArcGISTiledMapServiceLayer",
       "esri/dijit/TimeSlider","esri/TimeExtent","dojo/_base/array","dojo/dom",
       "esri/layers/FeatureLayer", "esri/InfoTemplate", "esri/dijit/Search",
       "esri/renderers/ClassBreaksRenderer", "esri/Color", "esri/renderers/BlendRenderer", "esri/renderers/SimpleRenderer", "esri/symbols/SimpleFillSymbol", "esri/symbols/SimpleLineSymbol", "esri/symbols/SimpleMarkerSymbol",
       "esri/dijit/HomeButton",
       "dojo/domReady!"
], function (
       Map, ArcGISDynamicMapServiceLayer, ImageParameters,
       Tiled,
       TimeSlider,TimeExtent,arrayUtils,dom,
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
    var tiled = new Tiled("http://10.22.102.18:6080/arcgis/rest/services/basemap/MapServer");
    map.addLayer(tiled);

   
    var featureLayerUrl = "http://10.22.102.18:6080/arcgis/rest/services/Data/MapServer/";
    //医疗点数据
    var HLayer = new FeatureLayer("http://10.22.102.18:6080/arcgis/rest/services/Data/MapServer/0", {
        mode: FeatureLayer.MODE_ONDEMAND,
        opacity: 1,
        outFields: ["*"],
        infoTemplate: new InfoTemplate("医疗机构", "医疗机构：${NAME}<br/>机构ID：${JGID}")
    });

    var Hrenderer = new SimpleRenderer(new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 5, new SimpleLineSymbol(SimpleFillSymbol.STYLE_SOLID, new Color([255, 255, 255]), 1), new Color([255, 255, 255])));

    HLayer.setRenderer(Hrenderer);
    map.addLayer(HLayer);

    var layer = new FeatureLayer("http://10.22.102.18:6080/arcgis/rest/services/Data/MapServer/10", {
        mode: FeatureLayer.MODE_ONDEMAND,
        opacity: 1,
        outFields: ["*"],
        infoTemplate: new InfoTemplate("疾病数据", "医疗机构：${JGID}<br/>名称：${NAME}<br/>疾病数据：${Data}")
    });
    var renderer = new SimpleRenderer(new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 10, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0, 255, 64]), 1), new Color([0, 255, 64])));
    renderer.setSizeInfo({
        field: "Data",
        minSize: 1,
        maxSize: 50,
        minDataValue: .01,
        maxDataValue: 100,
        valueUnit: "unknown"
    });
    layer.setRenderer(renderer);


    var maptype = dojo.byId("MapType");
    var yearbtn = dojo.byId("Year");
    var monthbtn = dojo.byId("Month");
    var daybtn = dojo.byId("Day");
    dojo.connect(yearbtn, "onchange", function () {
        Add();
    });
    dojo.connect(monthbtn, "onchange", function () {
        Add();
    });
    dojo.connect(daybtn, "onchange", function () {
        Add();
    });
    dojo.connect(maptype, "onchange", function SelectChange() {
        var value = maptype.value;
        map.removeAllLayers();
        map.addLayer(tiled);
        switch (value) {
            case "Place":
                map.addLayer(HLayer);
                break;
            case "Situation":
                Add();
                break;
            default: break;
        }
    });

    var Add = function () {
        console.log("inside");
        var key = daybtn.value;
        if (key == "" || key == "undefined" || key == null) {
            console.log("key:"+key);
            return;
        }
        var model = maptype.value;
        if (model != "Situation") {
            console.log("model:" + model);
            return;
        }
        var featurelayer = new FeatureLayer(featureLayerUrl + key, {
            mode: FeatureLayer.MODE_ONDEMAND,
            opacity: 1,
            outFields: ["*"],
            infoTemplate: new InfoTemplate("疾病数据", "医疗机构：${JGID}<br/>名称：${NAME}<br/>疾病数据：${Data}")
        });
        featurelayer.setRenderer(renderer);
        map.addLayer(featurelayer);
        console.log("Add");
    }

    var func = function () {  
        if (bHalf == false)
        {
            if (g_alpha >= 1.0) {
                bHalf = true;
               // setTimeout(func, 5);
            } else {
                g_alpha += 0.05;
                layer.setOpacity(g_alpha);
                console.log("KO" + g_alpha.toString());
                setTimeout(func, 5);
            }
        } else {
            if (g_alpha > 0) {
                g_alpha -= 0.05;
                layer.setOpacity(g_alpha);
                console.log("OK" + g_alpha.toString());
                setTimeout(func, 5);
            } else {
                bHalf = false;
               // setTimeout(func, 5);
            }
        }
    }



    

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