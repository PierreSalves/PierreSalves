$(document).ready(function () {

	$('.datepicker').datepicker({
		format: 'dd/mm/yyyy',
	});
});

function openModal(url, id) {

	$.ajax({
		type: "GET",
		url: url,
	}).done(function (data) {
		$(id).append(data);
	});

}


function addElements(url, id) {

	if (!window.sessionStorage['i']) {
		window.sessionStorage['i'] = 0;
	}

	i = parseInt(window.sessionStorage['i']) + 1;

	$.ajax({
		type: "GET",
		url: url + '/' + i,
	}).done(function (data) {
		$(id).append(data);
		window.sessionStorage['i'] = parseInt(i + 1);
	});

}

function removeElements(id) {

	$(id).remove();
}

function escolherCor(color, id) {

	$(`#${id}`).val(color);
	$(`#${id}`).css('backgroundColor', color);
	$(`#${id}`).css('color', color);
}
