//Show / Hide Settings view
var btnHorario = document.querySelector("#horario-btn");
var viewHorario = document.querySelector("#horario-view");
var viewInicio = document.querySelector("#home-view");

btnHorario.addEventListener ('click', function () {
	viewHorario.classList.remove('back-horario-view');
	viewInicio.classList.add('back-inicio');	
	viewHorario.classList.add('move-horario-view');
});

var btnback = document.querySelector("#back-btn");

btnback.addEventListener ('click', function () {
	viewInicio.classList.remove('back-inicio');
	viewHorario.classList.remove('move-horario-view');	
	viewHorario.classList.add('back-horario-view');
});