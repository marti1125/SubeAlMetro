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