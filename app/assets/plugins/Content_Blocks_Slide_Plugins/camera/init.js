function init_widget() {
    $.each(images, function (index, elm) {
        $('#camera_wrap_1').append('<div data-src="' + elm + '"><div class="camera_caption fadeFromBottom">' + captions[index] + '</div></div>');


    });
    $('#widget_wrap').show();
    jQuery(function(){

        jQuery('#camera_wrap_1').camera({
            width: '460px',
            thumbnails: false
        });

        jQuery('#camera_wrap_2').camera({
            height: '200px',
            loader: 'bar',
            pagination: false,
            thumbnails: false
        });
    });



}


