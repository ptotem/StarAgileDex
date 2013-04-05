function init_widget() {
    $.each(images, function (index, elm) {

        if (elm != null) {
            $('#slider').append('<img src="' + elm + '" title="' + captions[index] + '"/>');
        } else {
            $('#slider').append('<img src="/assets/adlogo.png"' + elm + '" title="' + captions[index] + '"/>');
        }



    });
    $('#widget_wrap').show();
    $('#slider').nivoSlider();
}


