function init_widget() {

    $.each(images, function (index, elm) {
        var this_caption='caption'+index;
        $('#jms-slideshow').append('<div class="step" data-color="color-' + Math.round(Math.random() * 4) + '" data-x="-' + Math.round(Math.random() * 150) + '" data-y="-' + Math.round(Math.random() * 150) + '" data-z="' + Math.round(Math.random() * 1500) + '" data-rotate="' + Math.round(Math.random() * 180) + '"><div id='+this_caption+' class="jms-content">'+ captions[index] + '</div><img src="' + elm + '"/></div>');

        if (index == images.length - 1) {
            var jmpressOpts = {
                animation: { transitionDuration: '0.8s' }
            };

            $('#jms-slideshow').jmslideshow($.extend(true, { jmpressOpts: jmpressOpts }, {
                autoplay: false,
                bgColorSpeed: '0.8s',
                arrows: true
            }));
            this_caption='#'+this_caption;
            $(this_caption).boxfit({multiline: true, maximum_font_size: 36});

        }

    });




}