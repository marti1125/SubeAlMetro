function agregarUbicacion(longitud, latitud, icon, w, h){
	var coor_from = new OpenLayers.Projection("EPSG:4326");
	var coor_to   = new OpenLayers.Projection("EPSG:900913");
	var size = new OpenLayers.Size(w,h);
	var offset = new OpenLayers.Pixel(-(size.w), -size.h);
	var icon = new OpenLayers.Icon(icon,size,offset);
	var mark = new OpenLayers.LonLat(longitud,latitud);
	return markers.addMarker(new OpenLayers.Marker(mark.transform(coor_from, coor_to),icon));
}


if(navigator.onLine){
	$('.preloadMap').hide();
	var coor_from = new OpenLayers.Projection("EPSG:4326");
	var coor_to   = new OpenLayers.Projection("EPSG:900913");

	map = new OpenLayers.Map("info-mapa");

	map.addLayer(new OpenLayers.Layer.OSM());
	map.zoomToMaxExtent();
	var center    = new OpenLayers.LonLat(-77.0071244, -12.1160213);
	center.transform(coor_from, coor_to);
	map.addLayer(new OpenLayers.Layer.OSM());
	map.setCenter(center, 12);

	var markers = new OpenLayers.Layer.Markers( "Markers" );
	map.addLayer(markers);

	$.getJSON('js/estaciones.json', function(response){
		$.each(response, function(index, item){
			agregarUbicacion(item.longitud, item.latitud, item.icon, item.w, item.h);					  
		});
	});
} else {
	$('#info-mapa').html('<br/><h1 class="mensajeConexion">Necesita conexión a internet<h1>');
}
