var coor_from = new OpenLayers.Projection("EPSG:4326");
var coor_to   = new OpenLayers.Projection("EPSG:900913");

map = new OpenLayers.Map("info-mapa");

map.addControl(new OpenLayers.Control.PanZoomBar());
map.addLayer(new OpenLayers.Layer.OSM());
map.zoomToMaxExtent();
var center    = new OpenLayers.LonLat(-77.0071244, -12.1160213);
center.transform(coor_from, coor_to);
map.addLayer(new OpenLayers.Layer.OSM());
map.setCenter(center, 12);

var markers = new OpenLayers.Layer.Markers( "Markers" );
map.addLayer(markers);

// agregar markers!!
var size = new OpenLayers.Size(40,45);
var offset = new OpenLayers.Pixel(-(size.w/2), -size.h);
var ves = new OpenLayers.Icon('img/ves.png',size,offset);
var vesPos = new OpenLayers.LonLat(-77.0071244, -12.1160213);
markers.addMarker(new OpenLayers.Marker(vesPos.transform(coor_from, coor_to),ves));