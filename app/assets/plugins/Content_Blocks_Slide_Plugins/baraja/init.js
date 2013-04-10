function init_widget() {
    $.each(images, function (index, elm) {
        $('#baraja-el').append('<li><img src="' + elm + '" title="' + captions[index] + '"/><p>' + captions[index] + '</p></li>');
    });
    $('#widget_wrap').show();

    var $el = $('#baraja-el'),
        baraja = $el.baraja();

    // navigation
    $('#nav-prev').on('click', function (event) {

        baraja.previous();

    });

    $('#nav-next').on('click', function (event) {

        baraja.next();

    });


}

								
				
