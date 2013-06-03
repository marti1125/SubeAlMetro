Zepto(function($){

	$('#tabstart').addClass('active');

	// Estaciones
	var estaciones = "https://subealmetro.herokuapp.com/stations.json";

	// Twitter
	var twitterTimeLine = "https://api.twitter.com/1/statuses/user_timeline/Lineaunope.json?&count=7&callback=?";

	$.getJSON(estaciones, function(text){
		console.log(text);		
	});

	$.getJSON(twitterTimeLine, function(text){
  		$.each(text, function(key, value){
  			$('#tweet').append('<li><div class="imgLeft"><img src="'+value.user.profile_image_url+'"/></div><h1 class="titleTwitter">'+value.user.name+' <span class="usertwitter">'+'@'+value.user.screen_name+'</span></h1><p>'+value.text+'</p></li>');
		});
	});
	

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

});

var dial = document.querySelector("#dial");
if (dial) {
dial.onclick = function () {
  var call = new MozActivity({
    name: "dial",
    data: {
    number: "0800-11121"
  }
  });
}
<<<<<<< HEAD
}
=======
}
>>>>>>> 96a401c293080b6a455971808d5d33d3282fd342
