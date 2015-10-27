require([
       "esri/map", "esri/layers/ArcGISDynamicMapServiceLayer", "esri/layers/ImageParameters",
       "esri/layers/ArcGISTiledMapServiceLayer",
       "esri/layers/FeatureLayer", "esri/InfoTemplate", "esri/dijit/Search",
       "esri/renderers/ClassBreaksRenderer", "esri/Color", "esri/renderers/BlendRenderer", "esri/renderers/SimpleRenderer", "esri/symbols/SimpleFillSymbol", "esri/symbols/SimpleLineSymbol", "esri/symbols/SimpleMarkerSymbol",
       "dojo/domReady!"
], function (
       Map, ArcGISDynamicMapServiceLayer, ImageParameters,
       Tiled,
       FeatureLayer, InfoTemplate, Search,
       ClassBreaksRenderer, Color, BlendRenderer, SimpleRenderer, SimpleFillSymbol, SimpleLineSymbol, SimpleMarkerSymbol
       ) {
    var map = new Map("map", {
        logo: false
    });
    var imageParameters = new ImageParameters();
    imageParameters.format = "png24";
    var dynamicServiceLayer = new ArcGISDynamicMapServiceLayer("http://10.22.102.18:6080/arcgis/rest/services/basemap/MapServer", {
        "id": "basemap",
        "opacity": 1,
        "imageParameters": imageParameters
    });

    var tiled = new Tiled("http://10.22.102.18:6080/arcgis/rest/services/basemap/MapServer");
    map.addLayer(tiled);
    //map.addLayer(dynamicServiceLayer);

    var renderer = new SimpleRenderer(new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 10, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0, 255, 64]), 1), new Color([0, 255, 64])));
    renderer.setSizeInfo({
        field: "Data",
        minSize: 1,
        maxSize: 50,
        minDataValue: .01,
        maxDataValue: 100,
        valueUnit: "unknown"
    });

    var layer = new FeatureLayer("http://10.22.102.18:6080/arcgis/rest/services/Data/MapServer/10", {
        mode: FeatureLayer.MODE_ONDEMAND,
        opacity: 1,
        outFields: ["*"],
        infoTemplate: new InfoTemplate("疾病数据", "医疗机构：${JGID}<br/>名称：${NAME}<br/>疾病数据：${Data}")
    });
    layer.setRenderer(renderer);
    map.addLayer(layer);

    function sleep(milliSeconds) {
        var startTime = new Date().getTime();
        console.log("sleep");
        while (new Date().getTime() < (startTime + milliSeconds)) {
            console.log("sleep.....");
        }
    }


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