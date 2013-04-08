function init_widget() {
    $.each(images, function (index, elm) {
        if (elm != null) {
            $('#st-stack').append('<li><div class="st-item"><a><img src="' + elm + '" title="' + captions[index] + '"/></a></div><div class="st-title"><h2>'+ captions[index] +'</h2></div></li>');
        } else {

            $('#st-stack').append('<li><div class="st-item"></div><div class="st-title"><h2>'+ captions[index] +'</h2></div></li>');
        }


    });
    $('#widget_wrap').show();
    $( '#st-stack' ).stackslider();
}


