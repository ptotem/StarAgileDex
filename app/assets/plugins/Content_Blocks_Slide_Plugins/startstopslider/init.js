function init_widget() {
    $.each(images, function (index, elm) {
        $('#mover').append('<div id="slide-1" class="slide"><img src="' + elm + '" title="' + captions[index] + '"/><p>' + captions[index] + '</p></div>');


    });
    $('#widget_wrap').show();


}


