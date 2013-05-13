// buttons
var btnHorario = document.querySelector("#horario-btn");
var btnTwitter = document.querySelector("#twitter-btn");
var btnInfo = document.querySelector("#info-btn");

// views
var viewInicio = document.querySelector("#home-view");
var viewHorario = document.querySelector("#horario-view");
var viewTwitter = document.querySelector("#twitter-view");
var viewInfo = document.querySelector("#info-view");

btnHorario.addEventListener('click', function () {
	viewHorario.classList.remove('back-horario-view');
	viewInicio.classList.add('back-inicio');	
	viewHorario.classList.add('move-horario-view');
});

btnTwitter.addEventListener('click', function() {
	viewTwitter.classList.remove('back-twitter-view');
	viewInicio.classList.add('back-inicio');	
	viewTwitter.classList.add('move-twitter-view');
});

btnInfo.addEventListener('click', function() {
	viewInfo.classList.remove('back-info-view');
	viewInicio.classList.add('back-inicio');	
	viewInfo.classList.add('move-info-view');
});

var btnback = document.querySelector("#back-btn");
var btnback2 = document.querySelector("#back-btn2");
var btnback3 = document.querySelector("#back-btn3");

btnback.addEventListener ('click', function () {
	viewInicio.classList.remove('back-inicio');
	viewHorario.classList.remove('move-horario-view');	
	viewHorario.classList.add('back-horario-view');
});

btnback2.addEventListener ('click', function () {
	viewInicio.classList.remove('back-inicio');
	viewTwitter.classList.remove('move-twitter-view');	
	viewTwitter.classList.add('back-twitter-view');
});

btnback3.addEventListener ('click', function () {
	viewInicio.classList.remove('back-inicio');
	viewInfo.classList.remove('move-info-view');	
	viewInfo.classList.add('back-info-view');
});