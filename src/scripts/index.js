(function (window, $) {

    var IndexModule = {
        init() {
            var map = new BMap.Map("map-wrap");
            // 创建地图实例  
            var point = new BMap.Point(116.404, 39.915);
            var mapStyle = {
                style: "grayscale"
            }
            map.setMapStyle(mapStyle);
            // 创建点坐标  
            map.centerAndZoom(point, 15);
        }
    };
    window.IndexModule = IndexModule;
}(window, jQuery));
$(function () {
    window.IndexModule.init();
});