function init_widget() {
    $.each(images, function (index, elm) {
        $('#slider').append('<img src="' + elm + '" title="' + captions[index] + '"/>');
    });
    $('#widget_wrap').show();
    $('#slider').nivoSlider();
}


