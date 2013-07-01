// Obtener posicion
function miPosicion(callback) {
			
	if (!navigator.geolocation){
		console.log("Geolocation is not supported by your browser");
		return false;
	}
 
	function success(position) {
		var latitude  = position.coords.latitude;
		var longitude = position.coords.longitude;
		callback(latitude,longitude);			
	}
 
	function error() {
		console.log("Unable to retrieve your location");
	}	

	navigator.geolocation.getCurrentPosition(success, error);			
}

function distaciaMenor(miLatitud, miLongitud, estacionLatitud, estacionLongitud, estacion){

	var R = 6371; // km
	var dLat = (estacionLatitud-miLatitud).toRad();
	var dLon = (estacionLongitud-miLongitud).toRad();
	var lat1 = miLatitud.toRad();
	var lat2 = estacionLatitud.toRad();

	var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
	var d = R * c;

	return [d,estacion];

}

Zepto(function($){

	// Acceso a internet
	var xhr = new XMLHttpRequest({
	    mozSystem: true
	});

	$('#panel1').addClass('active');	

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

	$('.miUbicacion').click(function(){
		var miLatitud;
		var miLongitud;

		miPosicion(function(latitude,longitude){

			miLatitud = latitude;
			miLongitud = longitude;

			var resultados = [];
			var distancia;

			$.ajax({ //zeptojs
			async: true
			});

			$.getJSON('js/estaciones.json', function(response){
				$.each(response, function(index, item){
					$.each(item, function(index, result){											
						distancia = distaciaMenor(miLatitud, miLongitud, result.latitud, result.longitud, result.estacion)
						resultados.push(distancia);
						//console.log(distancia);					
					});			  
				});
			});

			$.ajax({
			async: false
			});			

			var distaciaMinimo = Math.min.apply(Math, resultados.map(function(i) {
			    return i[0];
			}));

			var estacionCercana = $.grep(resultados, function(v,i) {
			    return v[0] === distaciaMinimo;
			});

			console.log(estacionCercana[0][1])

			$('.estacionCercana').html(estacionCercana[0][1]);
			//console.log(resultados.filter(isBigEnough);)

			//console.log(resultados);
			//console.log(resultados[0]);
			//console.log(Math.min.apply(Math, resultados));

		});

	});	

	// Estaciones
	//var estaciones = "https://subealmetro.herokuapp.com/stations.json";
	//var estacionesOffline = "js/stations.json";

	// Twitter
	//var twitterTimeLine = "https://api.twitter.com/1/statuses/user_timeline/Lineaunope.json?&count=7&callback=?";

	/*$.getJSON(estacionesOffline, function(text){
		$.each(text.stations, function(key, value){
			$('#estaciones').append('<option>'+value.name+'</option>');
		});		
		console.log(text.stations);		
	});*/

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