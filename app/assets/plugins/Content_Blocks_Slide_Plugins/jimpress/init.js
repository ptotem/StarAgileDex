function init_widget() {

    $('#caption_wrap').hide();
    $('#caption_wrap_back').hide();

    $.each(images, function (index, elm) {
        $('#jms-slideshow').append('<div class="step" data-color="color-' + Math.round(Math.random() * 4) + '" data-x="-' + Math.round(Math.random() * 150) + '" data-y="-' + Math.round(Math.random() * 150) + '" data-z="' + Math.round(Math.random() * 1500) + '" data-rotate="' + Math.round(Math.random() * 180) + '"><div class="jms-content"><h3>' + captions[index] + '</h3></div><img src="' + elm + '"/></div>');

        if (index == images.length - 1) {
            var jmpressOpts = {
                animation: { transitionDuration: '0.8s' }
            };

            $('#jms-slideshow').jmslideshow($.extend(true, { jmpressOpts: jmpressOpts }, {
                autoplay: true,
                bgColorSpeed: '0.8s',
                arrows: false
            }));
        }
    });

    setTimeout(function () {
        $('#wrapper').fadeIn(function () {
            $('#widget_wrap').fadeIn('slow', function () {
                $('#title_wrap').fadeIn();
                $('#text_wrap_back').slideDown();
                $('#text_wrap').slideDown(1000, function () {
                    $('#text_wrap_back').slideDown();
                    $('.navbar').fadeIn(function () {
                        $('.ad-menu-item').slideToggle();
                    });
                });
            });
        });
    }, 1000);
}