//Show / Hide Settings view
var btnSettings = document.querySelector("#settings-btn");

var viewSettings = document.querySelector("#settings-view");

btnSettings.addEventListener ('click', function () {
	viewSettings.classList.remove('move-down');
	viewSettings.classList.add('move-up');
});

var btnCloseSettings = document.querySelector("#close-btn");

btnCloseSettings.addEventListener ('click', function () {
	viewSettings.classList.remove('move-up');
	viewSettings.classList.add('move-down');
});
