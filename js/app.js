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

function noNetworkConnection(el){
	var message = 'Necesitas conexión a internet.';
	$(el).html('<div><p>' + message + '</p></div>');
}

function setMarker(estacion, map){
	var marker = new nokia.maps.map.Marker(
    new nokia.maps.geo.Coordinate(estacion.latitud, estacion.longitud),
    {icon: estacion.icon});
	map.objects.add(marker);
}

function btnEvents(btnName){
	$('#btn-' + btnName).click(function (){
		$('#settings-view').removeClass('bajar');
		$('.active').removeClass('active');		
		$('#titulo').html($('#' + btnName).attr('alt'));		
	});
}

Zepto(function($){

	var twitterTimeLine = "http://subealmetro.willyaguirre.me/lineauno.php";

    $.getJSON(twitterTimeLine, function(text){
        $.each(text, function(key, value){
          $('#tweet').append(
              '<li>'
            +   	'<div class="imgLeft">'
            +			'<img src="'+value.user.profile_image_url+'"/>'
            +		'</div>'
            +		'<h1 class="titleTwitter">'+value.user.name+'<span class="usertwitter"> @' + value.user.screen_name +'</span></h1>' 
            +		'<p>'+value.text+'</p>'  				
            +	'</li>'
            );  			
      	});
    });

 	nokia.Settings.set( "appId", "oXBdneZI8fw0fT9w6bmM");
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
	});

	$.getJSON('js/estaciones.json', function(response){
  		var estaciones = response.estaciones;
  		$.map(estaciones, function(estacion){
    		setMarker(estacion, map);
  		});
	});

	// Acceso a internet
	var xhr = new XMLHttpRequest({
	    mozSystem: true
	});

	$('.active').addClass('active');	

  	var buttons = ['estacion', 'mapa', 'twitter', 'info'];
  		$.map(buttons, function(button){
    		btnEvents(button);
  		});

	var miLatitud;
	var miLongitud;
	
	var result;

	var estacionCercana;

	miPosicion(function(latitude,longitude,result){

		miLatitud = latitude;
		miLongitud = longitude;
		//result = result

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

		estacionCercana = $.grep(resultados, function(v,i) {
		    return v[0] === distaciaMinimo;
		});

		result = estacionCercana[0][1]

		verificar(result);		

	});
	
	$.ajax({
		async: false
	});

	// Estaciones
	$.getJSON('js/estaciones.json', function(response){
		$.each(response, function(index, item){
			$.each(item, function(index, result){
				$('.estaciones').append('<li id="IdEstacion" data-estacion="'+result.estacion+'"><aside class="pack-end"><img id="gethora" alt="placeholder" src="img/hora.png"></aside><p class="nombreEstacion">Estación <b>'+result.estacion+'</b></p></li>');
			});			  
		});
	});

	$.ajax({
		async: true
	});

	function verificar(result){
		//var resultados = [];
		$("li #IdEstacion").each(function( index ) {
			
			console.log('Estación '+ result)
			console.log($(this).text())

			if($(this).text() == 'Estación '+ result){
				$(this).addClass('estacionActiva')
				console.log('si')
			}else {
				console.log('si')
			}

		});
		
		return result;
	}

	$(document).on("click", "#IdEstacion", function(){

		var fechaActual = new Date();

		var hora = fechaActual.getHours() + ":"  
                 + fechaActual.getMinutes();

		var estacion = $(this).data("estacion")
		$('#tituloNombreEstacion').html(estacion);
		
		$.getJSON('js/horarios.json', function(text){

			$.each(text, function(key, value){

				$.each(value, function(index, result){
					var validar = false					
					if(result.nombre == estacion){
						validar = true
						$("#listHorarios").html('')	
					}
					if(validar){
						for(i=0;i<result.GRAU.length;i++){

							$("#listHorarios").append("<li id='contieneHoraSalida'><p id='horaSalida'>"+result.GRAU[i]+"</p><p id='horaRegreso'>"+result.VES[i]+"</p></li>");
							
						}
					}					

				});

			});	
  			
		});

		$("#settings-view").removeClass("bajar");		
		$("#settings-view").addClass("subir");
	});

	$(document).on('click', '#settings-btn', function(){		
		$('#settings-view').removeClass('subir');
		$('#settings-view').addClass('bajar');
	});
		
});
