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

function marcarEstacion(result){
	var notification = navigator.mozNotification.createNotification(
            "La estación mas cercana es: ",
            "Estación "+result+""
        );
    notification.show();	
	$("li #IdEstacion").each(function( index ) {
		if(result == $(this).data("estacion")){				
			$(this).addClass('estacionActiva');
		}
	});
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
	map = L.mapbox.map('mapbox', 'osgux.g99506jm');

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

function mostrarUrl(tweet) {
	var url_regexp = /\b((?:https?:\/\/|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/gi;
  	return tweet.replace(url_regexp,"<a href='$1' class='tweetURL' target='_blank'>$1</a>");
}

$(document).ready(function(){

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

	$('.rTweets').hide();
	$('.rMap').hide();	

	/*function obtenerHora(){		
		var hora = new Date();
    	var horaActual = moment('01/01/2013'+hora.getHours()+':'+hora.getMinutes(),'DD/MM/YYYY HH:mm').format('YYYY-MM-DD HH:mm');
    	//setTimeout("obtenerHora()",1000) 
    	return horaActual;    	
	}*/

	/*$(document).on("click", "#IdEstacion", function(){

		var dia = new Date();
		var n = dia.getDay();

		if(n == 0){
			$("#listHorarios").html('');
			var estacion = $(this).data("estacion");
			$('#tituloNombreEstacion').html("<h2 class='tituloEstacion'>Estación "+estacion+"</h2><span class='condicionHorario'>Horario: Domingos y Feriados</span>");
			$.getJSON('js/horarios_domingo_y_feriados.json', function(text){
				$.each(text, function(key, value){
					$.each(value, function(index, result){		
						if(result.nombre == estacion){
							for(i=0;i<result.GRAU.length;i++){                            	
								$("#listHorarios").append("<li id='contieneHoraSalida'><p id='horaSalida'>"+result.GRAU[i]+"</p><p id='horaRegreso'>"+result.VES[i]+"</p></li>");	
	 						}											
						}
					});
				});	  			
			});			
		}

		if(n == 1 || n == 2 || n == 3 || n == 4 || n == 5){
			$("#listHorarios").html('');
			var estacion = $(this).data("estacion")
			$('#tituloNombreEstacion').html("<h2 class='tituloEstacion'>Estación "+estacion+"</h2><span class='condicionHorario'>Horario: Lunes - Viernes</span>");			
			$.getJSON('js/horarios.json', function(text){
				$.each(text, function(key, value){
					$.each(value, function(index, result){		
						if(result.nombre == estacion){
							for(i=0;i<result.GRAU.length;i++){                            	
								$("#listHorarios").append("<li id='contieneHoraSalida'><p id='horaSalida'>"+result.GRAU[i]+"</p><p id='horaRegreso'>"+result.VES[i]+"</p></li>");	
	 						}											
						}
					});
				});	  			
			});
		}

		if(n == 6){
			$("#listHorarios").html('');
			var estacion = $(this).data("estacion")
			$('#tituloNombreEstacion').html("<h2 class='tituloEstacion'>Estación "+estacion+"</h2><span class='condicionHorario'>Horario: Sabados</span>");
			$.getJSON('js/horarios_sabados.json', function(text){
				$.each(text, function(key, value){
					$.each(value, function(index, result){		
						if(result.nombre == estacion){
							for(i=0;i<result.VES.length;i++){
								if(result.GRAU[i] == undefined){
									$("#listHorarios").append("<li id='contieneHoraSalida'><p id='horaSalida'></p><p id='horaRegreso'>"+result.VES[i]+"</p></li>");	
								} else {
									$("#listHorarios").append("<li id='contieneHoraSalida'><p id='horaSalida'>"+result.GRAU[i]+"</p><p id='horaRegreso'>"+result.VES[i]+"</p></li>");	
								}								                            	
	 						}											
						}
					});
				});	  			
			});		
		}		

		$("#settings-view").removeClass("bajar");		
		$("#settings-view").addClass("subir");
	});

	$(document).on('click', '#settings-btn', function(){		
		$('#settings-view').removeClass('subir');
		$('#settings-view').addClass('bajar');
	});
	*/

	// Horarios
	Horario = Backbone.Model.extend({});

	HorarioCollection = Backbone.Collection.extend({		
		model: Horario,
		url: 'js/horarios_domingo_y_feriados.json',
		initialize: function(estacionNumero) {
	    	this.estacion = estacionNumero;
	  	},
		parse: function(response) {
			//console.log(JSON.stringify(response[this.estacion]))			
			return response[this.estacion];
		}
	});

	HorarioView = Backbone.View.extend({		
		events: {
	        "click #settings-btn": "cerrarHorario"
	    },
		cerrarHorario: function(){		
			$('#settings-view').removeClass('subir');
			$('#settings-view').addClass('bajar');
		},
		initialize: function(){
			this.listenTo(this.collection, 'change', this.render);				
			this.template = _.template( $("#HorarioView").html() );			
		},
		render: function () {			
			console.log(JSON.stringify(this.collection))
			this.$el.html(this.template({ horarios: this.collection.toJSON() }));
			return this;	    
		}
	});

	//var horarioView = new HorarioView({ el: $("#horarios-page") });	

	/*var horarioView = new HorarioView({ el: $("#horarios-page") });
	
	var horarioCollection = new HorarioCollection();	

	var horarioView = new HorarioView({collection: horarioCollection});

	horarioCollection.fetch({reset: true});

	horarioCollection.bind('reset', function () {				
		$("#horarios-page").append(horarioView.render().$el);
	});*/
	
	// Estaciones
	Estacion = Backbone.Model.extend({});

	EstacionCollection = Backbone.Collection.extend({		
		model: Estacion,
		url: 'js/estaciones.json',		
		parse: function(response) {
			return response;
		}
	});

	EstacionView = Backbone.View.extend({
		events: {
	        "click #IdEstacion": "obtenerHorario"
	    },
	    obtenerHorario: function(ev){
	     
	    	$("#settings-view").removeClass("bajar");		
			$("#settings-view").addClass("subir");

	    	var estacion = $(ev.currentTarget).text().replace("Estación ","").trim();
	    	var value = $(ev.currentTarget).data("value");	    	

	    	var horarioCollection = new HorarioCollection(value);

	    	var horarioView = new HorarioView({collection: horarioCollection});

	    	horarioCollection.fetch({reset: true});    	

	    	horarioCollection.bind('reset', function () {						
				$("#horarios-page").append(horarioView.render().$el);
			});

	    	var dia = new Date();
			var n = dia.getDay();			
	    	$("#tituloNombreEstacion").html(" Estación " + estacion);
	    	/*if(n == 0){
	    		$("#horariosDiaSemana").html("Domingos y Feriados");
			}
			if(n == 1 || n == 2 || n == 3 || n == 4 || n == 5){
				$("#horariosDiaSemana").html("Lunes - Viernes");
			}
	    	if(n == 6){
	    		$("#horariosDiaSemana").html("Sabados");
	    	}*/
	    	
	    },
		initialize: function(){		 		
			this.template = _.template( $("#EstacionView").html() );						
		},
		render: function () {

			this.$el.html(this.template({estacionMetro: this.collection.toJSON()}));			
	        this.afterRender();
			return this;
		},
		afterRender: function() {
			var miLatitud;
			var miLongitud;
			var collection = this.collection;		
			miPosicion(function(latitude,longitude){	
				miLatitud = latitude;
				miLongitud = longitude;
				var resultados = [];		
				collection.each(function(model) {
					var lat = model.get("latitud")
					var lon = model.get("longitud")
					var est = model.get("estacion")
					resultados.push(distaciaMenor(miLatitud, miLongitud, lat, lon, est));
				});
				var distaciaMinimo = Math.min.apply(Math, resultados.map(function(i) {
				    return i[0];
				}));
				estacionCercana = $.grep(resultados, function(v,i) {
				    return v[0] === distaciaMinimo;
				});
				var resultado = estacionCercana[0][1]
				marcarEstacion(resultado)
			});								
		}
	});

	var estacionCollection = new EstacionCollection();

	var estacionView = new EstacionView({collection: estacionCollection});

	estacionCollection.fetch({reset: true});

	estacionCollection.bind('reset', function () {	
		$("#estacion-page").append(estacionView.render().$el);
	});	

	// Mapa de ubicaciones de las estaciones
	MapView = Backbone.View.extend({
		events: {
        	"click .rMap": "actualizarMapa"
    	},
    	actualizarMapa: function(event){
	        if(navigator.onLine){
				$('.mensajeConexionM').hide();
				$('.rMap').hide();
				mostrarMapa();
			}
	    },
	    initialize: function(){	        	
	        this.render();
	    },
	    render: function(){
	      	var template = _.template( $("#MapView").html(), {} );	      
	      	this.$el.html( template );
	      	this.afterRender();	      	
	    },
		afterRender: function() {
			if(navigator.onLine){
				$('.rMap').hide();	
				mostrarMapa();
			} else {		
				$('#mapbox').append(
					'<h1 class="mensajeConexionM">Necesita conexión a internet<h1>'
				);
				$('.mensajeConexionM').show();
				$('.rMap').show();
			}			
		}
  	});

  	var mapView = new MapView({ el: $("#mapa-page") });

  	// Twitter
  	Tweet = Backbone.Model.extend({});

	TweetCollection = Backbone.Collection.extend({		
		model: Tweet,		
		url: 'http://glacial-gorge-2029.herokuapp.com/lineaunope',
		parse: function(response) {
			return response;
		}
	});

	TweetView = Backbone.View.extend({
		initialize: function(){
			this.template = _.template( $("#TweetView").html() );
		},
		render: function () {	
			this.$el.html(this.template({tweet: this.model.toJSON()}));
			return this;
		}
	});

	var tweetCollection = new TweetCollection();	

	var tweetView = new TweetView({model: tweetCollection});

	tweetCollection.bind('reset', function () {						
		$("#tweet-page").append(tweetView.render().$el);
	});

	tweetCollection.fetch({reset: true});		

	/*if(navigator.onLine){		
		
	} else {
		$('.preload').hide();		
		$('#info-tweet').append('<h1 class="mensajeConexionT">Necesita conexión a internet<h1>');
		$('.mensajeConexionT').show();
		$('.rTweets').show();
	}*/

	/*$('.rTweets').click(function(){		
		if(navigator.onLine){
			$('.preload').show();
			$('.mensajeConexionT').hide();
			$('.rTweets').hide();
			tweetCollection.bind('reset', function () {
				$('.preload').hide();							
				$("#tweets").append(tweetView.render().$el);
			});
			tweetCollection.fetch({reset: true});
		} else {
			
		}
	});*/

	// Info
  	InfoView = Backbone.View.extend({
	    initialize: function(){
	        this.render();
	    },
	    render: function(){
	      var template = _.template( $("#InfoView").html(), {} );
	      this.$el.html( template );
	    }
  	});
  	
  	var infoView = new InfoView({ el: $("#info-page") });

});