Zepto(function($){

	// Acceso a internet
	var xhr = new XMLHttpRequest({
	    mozSystem: true
	});

	nokia.Settings.set( "appId", "oXBdneZI8fw0fT9w6bmM");
	nokia.Settings.set( "authenticationToken", "TyIkck-eTNU2_0dmAxEX6A");

	var latitude;			
	var longitude;
	
	var map = new nokia.maps.map.Display(
	document.getElementById("map"), {
		components: [
			new nokia.maps.map.component.Behavior()],
		zoomLevel: 10,
		center: [-12.050065023002462, -77.069091796875]
	});

	// Obtener posicion
	function geoFindMe() {				
				
		if (!navigator.geolocation){
			console.log("Geolocation is not supported by your browser");
			return false;
		}
	 
		function success(position) {
			latitude  = position.coords.latitude;
			longitude = position.coords.longitude;
			// No borrar
			/*var marker = new nokia.maps.map.StandardMarker([latitude, longitude], {
				text: "Aquí", 
				draggable: false
			});			
			
			map.objects.add(marker);*/

			// Create a route manager
			var router = new nokia.maps.routing.Manager();

			// Create waypoints
			var waypoints = new nokia.maps.routing.WaypointParameterList();
			// No borrar
			/*waypoints.addCoordinate(
				// Estacion Angamos
			    new nokia.maps.geo.Coordinate(-12.111075, -77.000208)
			);*/

			waypoints.addCoordinate(
			    new nokia.maps.geo.Coordinate(latitude, longitude)
			);

			waypoints.addCoordinate(
				// Estacion Cabitos
			    new nokia.maps.geo.Coordinate(-12.127667, -77.000669)
			);
			
			var modes = [{
			    type: "shortest",
			    transportModes: ["car"],
			    options: "avoidTollroad",
			    trafficMode: "default"
			}];

			var onRouteCalculated = function (observedRouter, key, value) {
			    if (value == "finished") {
			        var routes = observedRouter.getRoutes();
			        
			        // Create the default map representation of a route
			        var mapRoute = new nokia.maps.routing.component.RouteResultSet(routes[0]).container;
			        map.objects.add(mapRoute);
			        
			        // Zoom to the bounding box of the route
			        map.zoomTo(mapRoute.getBoundingBox(), false, "default");
			    } else if (value == "failed") { 
			        alert("The routing request failed.");
			    }
			};

			// Add the observer function to the router's "state" property
			router.addObserver("state", onRouteCalculated);

			// Calculate the route (and call onRouteCalculated afterwards)
			router.calculateRoute(waypoints, modes);
												
		}
	 
		function error() {
			console.log("Unable to retrieve your location");
		}
				 
		navigator.geolocation.getCurrentPosition(success, error);
	}

	$('.miUbicacion').click(function(){
		geoFindMe();
	});
	
	$('#tabstart').addClass('active');

	$('#btn-horario').click(function (){
		$('#tabstart').removeClass('active');
		$('#titulo').html($('#hora').attr('alt'));
	});

	$('#btn-twitter').click(function (){
		$('#tabstart').removeClass('active');
		$('#titulo').html($('#twitter').attr('alt'));
	});

	$('#btn-info').click(function (){
		$('#tabstart').removeClass('active');
		$('#titulo').html($('#info').attr('alt'));
	});	

	// Estaciones
	var estaciones = "https://subealmetro.herokuapp.com/stations.json";
	var estacionesOffline = "js/stations.json";

	// Twitter
	//var twitterTimeLine = "https://api.twitter.com/1/statuses/user_timeline/Lineaunope.json?&count=7&callback=?";

	$.getJSON(estacionesOffline, function(text){
		$.each(text.stations, function(key, value){
			$('#estaciones').append('<option>'+value.name+'</option>');
		});		
		console.log(text.stations);		
	});

	/*$.getJSON(twitterTimeLine, function(text){
  		$.each(text, function(key, value){
  			$('#tweet').append('<li><div class="imgLeft"><img src="'+value.user.profile_image_url+'"/></div><h1 class="titleTwitter">'+value.user.name+' <span class="usertwitter">'+'@'+value.user.screen_name+'</span></h1><p>'+value.text+'</p></li>');
		});
	});*/
	
	// No borrar
	/*marker.addListener("click", function () {
				alert('hola');				
			});*/

});