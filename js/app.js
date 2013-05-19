Zepto(function($){

	// Twitter
	var twitterTimeLine = "https://api.twitter.com/1/statuses/user_timeline/Lineaunope.json?&count=7&callback=?";

	$.getJSON(twitterTimeLine, function(text){
  		$.each(text, function(key, value){
  			$('#tweet').append('<li><p>'+value.text+'</p></li>');
		});
	});

});

// buttons
var btnHorario = document.getElementById("btn-horario");
var btnTwitter = document.getElementById("btn-twitter");
var btnInfo = document.getElementById("btn-info");

btnHorario.onclick = function() {
	var titulo = document.getElementById("hora").getAttribute("alt");
	document.getElementById("titulo").innerHTML = titulo;
};

btnTwitter.onclick = function() {
	var titulo = document.getElementById("twitter").getAttribute("alt");
	document.getElementById("titulo").innerHTML = titulo;
};

btnInfo.onclick = function() {
	var titulo = document.getElementById("info").getAttribute("alt");
	document.getElementById("titulo").innerHTML = titulo;
};



