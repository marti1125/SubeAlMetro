// Obtener posicion
function miPosicion(callback) {
			
	if (!navigator.geolocation){		
		return false;
	}
 
	function success(position) {
		var latitude  = position.coords.latitude;
		var longitude = position.coords.longitude;
		callback(latitude,longitude);			
	}
 
	function error() {
		alert("Unable to retrieve your location");
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

function btnEvents(btnName){
	$('#btn-' + btnName).click(function (){
		$('#settings-view').removeClass('bajar');
		$('.active').removeClass('active');		
		$('#titulo').html($('#' + btnName).attr('alt'));
        $('#estacion').attr('src','img/estacion.png');
        $('#mapa').attr('src','img/mapa.png');
        $('#twitter').attr('src','img/twitter.png');
        $('#info').attr('src','img/info.png');
        $('#'+btnName).attr('src','img/'+btnName+'2.png');
	});
}

$(document).ready(function(){
    
	// Estaciones
	$.getJSON('js/estaciones.json', function(response){
		$.each(response, function(index, item){
			$.each(item, function(index, result){
				$('.estaciones').append('<li id="IdEstacion" data-estacion="'+result.estacion+'"><aside class="pack-end"><img id="gethora" alt="placeholder" src="img/hora.png"></aside><p class="nombreEstacion">Estación <b>'+result.estacion+'</b></p></li>');
			});			  
		});
	});

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

    function guardarTweets(image,username,screen_name,message){
    	var store = window.localStorage;
    	store.setItem('image', image);
    	store.setItem('username', username);
    	store.setItem('screen_name', screen_name);
    	store.setItem('message', message); 	
    }

    $.getJSON(twitterTimeLine, function(text){
        $.each(text, function(key, value){
        	var image = value.user.profile_image_url;
        	var username = value.user.name;
        	var screen_name = value.user.screen_name;
        	var message = value.text;
        	guardarTweets(image,username,screen_name,message)	
      	});
    });
 
	// Acceso a internet
	var xhr = new XMLHttpRequest({
	    mozSystem: true
	});

	$('.active').addClass('active');
    $('#estacion').attr('src','img/estacion2.png');

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
	
	function verificar(result){
		var notification = navigator.mozNotification.createNotification(
                "La estación mas cercana es: ",
                "Estación "+result+""
            );
		//var resultados = [];
		$("li #IdEstacion").each(function( index ) {

			if($(this).text() == 'Estación '+ result){
				notification.show();
				$(this).addClass('estacionActiva');				
			}else {
				
			}

		});
		
		return result;
	}

	function obtenerHora(){		
		var hora = new Date();
    	var horaActual = moment('01/01/2013'+hora.getHours()+':'+hora.getMinutes(),'DD/MM/YYYY HH:mm').format('YYYY-MM-DD HH:mm');
    	return horaActual;
    	setTimeout("obtenerHora()",1000) 
	}

	$(document).on("click", "#IdEstacion", function(){

		obtenerHora();    	
        
        $("#listHorarios").html('');
		var estacion = $(this).data("estacion")
		$('#tituloNombreEstacion').html("<h2>"+estacion+"</h2>Horario: Lunes - Viernes");
		
		$.getJSON('js/horarios.json', function(text){

			$.each(text, function(key, value){

				$.each(value, function(index, result){
									
					if(result.nombre == estacion){
						for(i=0;i<result.GRAU.length;i++){                            	
							$("#listHorarios").append("<li id='contieneHoraSalida'><p id='horaSalida'>"+result.GRAU[i]+"</p><p id='horaRegreso'>"+result.VES[i]+"</p></li>");	
                            var horaSalida = moment('01/01/2013'+result.GRAU[i],'DD/MM/YYYY HH:mm').format('YYYY-MM-DD HH:mm');
                            var horaLlegada = moment('01/01/2013'+result.VES[i],'DD/MM/YYYY HH:mm').format('YYYY-MM-DD HH:mm');
                            
                            if(obtenerHora() == horaSalida){

                                console.log('ok')
                            }

                            if (obtenerHora() == horaLlegada){
                            	console.log('okLLegada')
                            }

                            
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
