function init_widget() {
    $.each(images, function (index, elm) {

        var this_caption = 'caption' + index;

        $('#slider').append('<li><img src="' + elm + '" title="' + captions[index] + '"/><div id=' + this_caption + ' class="caption_txt">' + captions[index] + '</div></li>');

        this_caption = '#' + this_caption;
        $(this_caption).boxfit({multiline:true, maximum_font_size:12});


//        $('.caption_txt').boxfit({multiline: true, maximum_font_size: 12});
    });

    $('#widget_wrap').show();

    $('#slider').movingBoxes({

        startPanel:1,
        wrap:false,
        buildNav:true,
        navFormatter:function () {
            return "&#9679;";
        }
    });
}


