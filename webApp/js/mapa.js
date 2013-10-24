function agregarUbicacion(longitud, latitud, icon, w, h, change){
	var coor_from = new OpenLayers.Projection("EPSG:4326");
	var coor_to   = new OpenLayers.Projection("EPSG:900913");
	var size = new OpenLayers.Size(w,h);
	var offset = new OpenLayers.Pixel(-(size.w), -size.h);
	var icon = new OpenLayers.Icon(icon,size,offset);
	var mark = new OpenLayers.LonLat(longitud,latitud);
	var markers = change;
	return markers.addMarker(new OpenLayers.Marker(mark.transform(coor_from, coor_to),icon));
}

$('.rMap').hide();

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

	var markers1 = new OpenLayers.Layer.Markers( "Markers" );
	map.addLayer(markers1);

	$.getJSON('js/estaciones.json', function(response){
		$.each(response, function(index, item){
			agregarUbicacion(item.longitud, item.latitud, item.icon, item.w, item.h, markers1);					  
		});
	});
} else {
	$('.preloadMap').hide();
	$('#info-mapa').append('<h1 class="mensajeConexionM">Necesita conexión a internet<h1>');
	$('.mensajeConexionM').show();
	$('.rMap').show();
}

$('.rMap').click(function(){
	$('.preloadMap').hide();
	$('.rMap').hide();
	$('.mensajeConexionM').hide();
	var coor_from = new OpenLayers.Projection("EPSG:4326");
	var coor_to   = new OpenLayers.Projection("EPSG:900913");

	map = new OpenLayers.Map("info-mapa");

	map.addLayer(new OpenLayers.Layer.OSM());
	map.zoomToMaxExtent();
	var center    = new OpenLayers.LonLat(-77.0071244, -12.1160213);
	center.transform(coor_from, coor_to);
	map.addLayer(new OpenLayers.Layer.OSM());
	map.setCenter(center, 12);

	var markers2 = new OpenLayers.Layer.Markers( "Markers" );
	map.addLayer(markers2);

	$.getJSON('js/estaciones.json', function(response){
		$.each(response, function(index, item){
			agregarUbicacion(item.longitud, item.latitud, item.icon, item.w, item.h, markers2);					  
		});
	});
});