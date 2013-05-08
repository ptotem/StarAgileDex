function init_widget() {
    $.each(images, function (index, elm) {
        $('#games').append('<img src="' + elm + '" /><span> ' + captions[index] + '</span>');


    });
    $('#widget_wrap').show();

    $('#games').coinslider();
}


