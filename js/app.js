Zepto(function($){

	// Acceso a internet
	var xhr = new XMLHttpRequest({
	    mozSystem: true
	});

	$('#panel1').addClass('active');	

	var latitude;			
	var longitude;		

	// Obtener posicion
	function geoFindMe() {				
				
		if (!navigator.geolocation){
			console.log("Geolocation is not supported by your browser");
			return false;
		}
	 
		function success(position) {
			latitude  = position.coords.latitude;
			longitude = position.coords.longitude;
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