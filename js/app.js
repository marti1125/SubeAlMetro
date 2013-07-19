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

	$('.active').addClass('active');	

	$('#btn-estacion').click(function (){
		$('#settings-view').removeClass('bajar');
		$('.active').removeClass('active');		
		$('#titulo').html($('#estacion').attr('alt'));		
	});

	$('#btn-twitter').click(function (){
		$('#settings-view').removeClass('bajar');
		$('.active').removeClass('active');
		$('#titulo').html($('#twitter').attr('alt'));
	});

	$('#btn-info').click(function (){
		$('#settings-view').removeClass('bajar');
		$('.active').removeClass('active');
		$('#titulo').html($('#info').attr('alt'));
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

	// Twitter -- Servidor de pruebas
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



	$(document).on("click", "#IdEstacion", function(){
		//alert($(this).data("estacion"))
		var estacion = $(this).data("estacion")
		
		$.getJSON('js/horarios.json', function(text){
			//console.log(text.estaciones.salida)
			//console.log(text.estaciones.estacion)
			//console.log(estacion)
			if(estacion == text.estaciones.estacion){
				$("#listHorarios").html("<li>"+text.estaciones.salida+"</li>")
			} else {
				$("#listHorarios").html('');
			}			
  			
		});

		$("#settings-view").removeClass("bajar");		
		$("#settings-view").addClass("subir");
	});

	$(document).on('click', '#settings-btn', function(){		
		$('#settings-view').removeClass('subir');
		$('#settings-view').addClass('bajar');
	});
		
});