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
	$("li [data-view-name='estacion']").each(function( index ) {
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

	// Horarios
	Horario = Backbone.Model.extend({});

	HorarioCollection = Backbone.Collection.extend({		
		model: Horario,
		parse: function(response) {
			return response;		
		}
	});

	var HorarioView = Backbone.View.extend({		
		events: {
	        "click #settings-btn": "cerrarHorario"
	    },
		cerrarHorario: function(){		
			$('#settings-view').removeClass('subir');
			$('#settings-view').addClass('bajar');
		},
		initialize: function(attrs){
			this.estacionNombre = attrs;
			this.listenTo(this.collection, 'change', this.render);				
			this.template = _.template( $("#HorarioView").html() );			
		},
		render: function () {			
			this.$el.html(this.template({ horarios: _.where(this.collection.toJSON(), {nombre: this.estacionNombre.attrs }) }));  
			return this;	    
		}
	});
	
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
	        'click [data-view-name="estacion"]': 'obtenerHorario'
	    },
	    obtenerHorario: function(ev){

	    	var estacion = $(ev.currentTarget).text().replace("Estación ","").trim();	    	

	    	var dia = new Date();
			var n = dia.getDay();

			if(n == 0){
				var horarioCollection = new HorarioCollection();

		    	horarioCollection.fetch({url: 'js/horarios_domingo_y_feriados.json', reset: true});  

		    	var horarioView = new HorarioView({collection: horarioCollection, attrs: estacion});

		    	horarioCollection.bind('reset', function () {						
					$("#horarios-page").html(horarioView.render().$el);
					horarioView.$("#settings-view").removeClass("bajar");		
					horarioView.$("#settings-view").addClass("subir");
					horarioView.$("#tituloNombreEstacion").html(" Estación " + estacion);
					horarioView.$("#horariosDiaSemana").html("Domingos y Feriados");
				});	    		
			}
			if(n == 1 || n == 2 || n == 3 || n == 4 || n == 5){
				var horarioCollection = new HorarioCollection();

		    	horarioCollection.fetch({url: 'js/horarios.json', reset: true});  

		    	var horarioView = new HorarioView({collection: horarioCollection, attrs: estacion});

		    	horarioCollection.bind('reset', function () {						
					$("#horarios-page").html(horarioView.render().$el);
					horarioView.$("#settings-view").removeClass("bajar");		
					horarioView.$("#settings-view").addClass("subir");
					horarioView.$("#tituloNombreEstacion").html(" Estación " + estacion);
					horarioView.$("#horariosDiaSemana").html("Lunes - Viernes");
				});				
			}
	    	if(n == 6){
	    		var horarioCollection = new HorarioCollection();

		    	horarioCollection.fetch({url: 'js/horarios_sabados.json', reset: true});  

		    	var horarioView = new HorarioView({collection: horarioCollection, attrs: estacion});

		    	horarioCollection.bind('reset', function () {						
					$("#horarios-page").html(horarioView.render().$el);
					horarioView.$("#settings-view").removeClass("bajar");		
					horarioView.$("#settings-view").addClass("subir");
					horarioView.$("#tituloNombreEstacion").html(" Estación " + estacion);
					horarioView.$("#horariosDiaSemana").html("Sabados");
				});	    		
	    	} 

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