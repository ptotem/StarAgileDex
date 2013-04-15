function init_widget() {

    $.each(images, function (index, elm) {
        $('#jms-slideshow').append('<div class="step" data-color="color-' + Math.round(Math.random() * 4) + '" data-x="-' + Math.round(Math.random() * 150) + '" data-y="-' + Math.round(Math.random() * 150) + '" data-z="' + Math.round(Math.random() * 1500) + '" data-rotate="' + Math.round(Math.random() * 180) + '"><div class="jms-content"><h3>' + captions[index] + '</h3></div><img src="' + elm + '"/></div>');

        if (index == images.length - 1) {
            var jmpressOpts = {
                animation: { transitionDuration: '0.8s' }
            };

            $('#jms-slideshow').jmslideshow($.extend(true, { jmpressOpts: jmpressOpts }, {
                autoplay: false,
                bgColorSpeed: '0.8s',
                arrows: true
            }));
        }
    });

    setTimeout(function () {
        if (gon.no_subtitle) {
            $('#subtitle_back').removeClass('elements');
            $title.css({width:"760px"});
        }
        $('#wrapper').fadeIn(function () {
            $title.boxfit({multiline: true, maximum_font_size: 36});
            $subtitle.boxfit({multiline: true, maximum_font_size: 36});
            $('.elements').fade1by1();
        });
    }, 500);
}