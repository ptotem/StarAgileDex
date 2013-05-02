function init_widget() {
    $.each(images, function (index, elm) {
        $('#slider').append('<li><img src="' + elm + '" title="' + captions[index] + '"/><div class="caption_txt">' + captions[index] + '</div></li>');

        $('.caption_txt').boxfit({multiline: true, maximum_font_size: 12});

    });
    $('#widget_wrap').show();

    $('#slider').movingBoxes({

        startPanel   : 1,
        wrap         : false,
        buildNav     : true,
        navFormatter : function(){ return "&#9679;"; }
    });
}


