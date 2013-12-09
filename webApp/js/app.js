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
		$("#btn-estacion").removeClass('selectedTab');
		$("#btn-mapa").removeClass('selectedTab');
		$("#btn-twitter").removeClass('selectedTab');
		$("#btn-info").removeClass('selectedTab');
		$(this).addClass('selectedTab');		
		$('#settings-view').removeClass('bajar');
		$('.active').removeClass('active');
		//Cambiar Titulo
		$('#titulo').html($('#'+btnName).attr('alt'));				
	});
}

var map;
var geoJson = [];
function mostrarMapa(){
	map = L.mapbox.map('info-mapa', 'osgux.g99506jm');

	$.getJSON('js/estaciones.json', function(response){		
		$.each(response, function(index, item){			
			geoJson.push({
			    "type": "Feature",
			    "geometry": {
			        "type": "Point",
			        "coordinates": [item.longitud,item.latitud]
			    },
			    "properties": {
			        "title": "Estación " + item.estacion,
			        "icon": {
			            "iconUrl": "./js/train.png",
			            "iconSize": [32, 37]
			        }
			    }
			});
			map.markerLayer.on('layeradd', function(e) {
			    var marker = e.layer,
			        feature = marker.feature;

			    marker.setIcon(L.icon(feature.properties.icon));
			});	
			map.markerLayer.setGeoJSON(geoJson);							 
		});				
	});	
}

$(document).ready(function(){

	$('.rTweets').hide();
	$('.rMap').hide();

	var Estacion = Backbone.Model.extend({});

	var Estaciones = Backbone.Collection.extend({
		model: Estacion,
		url: 'js/estaciones.json',
		parse: function(response) {
			return response;
		}
	});

	var viewEstaciones = Backbone.View.extend({
		tagName: "ul",
		className: "",
		initialize: function(){
			this.template = _.template( $("#templateEstaciones").html() );
		},
		render: function () {	
			this.$el.html(this.template({estacionMetro: this.model.toJSON()}));
			return this;
		}
	});

	var listEstaciones = new Estaciones();

	var estacionesView = new viewEstaciones({model: listEstaciones});

	listEstaciones.bind('reset', function () {	
		$(".estacionesMetro").append(estacionesView.render().$el);			
	}); 

	listEstaciones.fetch({reset: true});

	var Tweet = Backbone.Model.extend({});

	var TweetList = Backbone.Collection.extend({		
		model: Tweet,		
		url: 'http://glacial-gorge-2029.herokuapp.com/lineaunope',
		parse: function(response) {
			return response;
		}
	});

	var viewTweets = Backbone.View.extend({
		tagName: "ul",
		className: "",
		initialize: function(){
			this.template = _.template( $("#templateTwitter").html() );
		},
		render: function () {	
			this.$el.html(this.template({tweet: this.model.toJSON()}));
			return this;
		}
	});

	var tweetList = new TweetList();	

	var tweetView = new viewTweets({model: tweetList});		

	if(navigator.onLine){		
		tweetList.bind('reset', function () {
			$('.preload').hide();					
			$("#tweets").append(tweetView.render().$el);
		});
		tweetList.fetch({reset: true});
	} else {
		$('.preload').hide();		
		$('#info-tweet').append('<h1 class="mensajeConexionT">Necesita conexión a internet<h1>');
		$('.mensajeConexionT').show();
		$('.rTweets').show();
	}

	$('.rTweets').click(function(){		
		if(navigator.onLine){
			$('.preload').show();
			$('.mensajeConexionT').hide();
			$('.rTweets').hide();
			tweetList.bind('reset', function () {
				$('.preload').hide();							
				$("#tweets").append(tweetView.render().$el);
			});
			tweetList.fetch({reset: true});
		} else {
			
		}
	});

	// Acceso a internet
	var xhr = new XMLHttpRequest({
	    mozSystem: true
	});

	$('.active').addClass('active');
	$("#btn-estacion").addClass('selectedTab');

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
				distancia = distaciaMenor(miLatitud, miLongitud, item.latitud, item.longitud, item.estacion);
				resultados.push(distancia);					 
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

        notification.show();
		
		$("li #IdEstacion").each(function( index ) {			

			if(result == $(this).data("estacion")){				
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
		$('#tituloNombreEstacion').html("<h2 class='tituloEstacion'>Estación "+estacion+"</h2><span class='condicionHorario'>Horario: Lunes - Viernes</span>");
		
		$.getJSON('js/horarios.json', function(text){

			$.each(text, function(key, value){

				$.each(value, function(index, result){
					// Por Implementar				
					if(result.nombre == estacion){
						for(i=0;i<result.GRAU.length;i++){                            	
							$("#listHorarios").append("<li id='contieneHoraSalida'><p id='horaSalida'>"+result.GRAU[i]+"</p><p id='horaRegreso'>"+result.VES[i]+"</p></li>");	
                            var horaSalida = moment('01/01/2013'+result.GRAU[i],'DD/MM/YYYY HH:mm').format('YYYY-MM-DD HH:mm');
                            var horaLlegada = moment('01/01/2013'+result.VES[i],'DD/MM/YYYY HH:mm').format('YYYY-MM-DD HH:mm');
                            
                            if(obtenerHora() == horaSalida){                               
                            }

                            if (obtenerHora() == horaLlegada){                            	
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

	// Seccion de Mapas
	if(navigator.onLine){		
		mostrarMapa();
	} else {		
		$('#info-mapa').append('<h1 class="mensajeConexionM">Necesita conexión a internet<h1>');
		$('.mensajeConexionM').show();
		$('.rMap').show();
	}

	$('.rMap').click(function(){
		if(navigator.onLine){
			$('.mensajeConexionM').hide();
			$('.rMap').hide();
			mostrarMapa();
		} else {

		}
	});

});
