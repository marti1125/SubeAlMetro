/*nokia.Settings.set( "appId", "oXBdneZI8fw0fT9w6bmM");
nokia.Settings.set( "authenticationToken", "TyIkck-eTNU2_0dmAxEX6A");

var map = new nokia.maps.map.Display(
		document.getElementById("info-mapa"), {
		components: [
			new nokia.maps.map.component.Behavior(),
			new nokia.maps.map.component.ZoomBar(),
			new nokia.maps.map.component.Overview()
		],
	zoomLevel: 12,
	center: [-12.107227290349885, -76.99493408203125]
});*/

var coor_from = new OpenLayers.Projection("EPSG:4326");
var coor_to   = new OpenLayers.Projection("EPSG:900913");
map = new OpenLayers.Map("info-mapa");
map.addLayer(new OpenLayers.Layer.OSM());
map.zoomToMaxExtent();
var center    = new OpenLayers.LonLat(-77.0071244, -12.1160213);
center.transform(coor_from, coor_to);
map.addLayer(new OpenLayers.Layer.OSM());
map.setCenter(center, 12);