function init_widget() {
    $('#wrapper').addClass('none').css('font-family', gon.font);
//    $subtitle.find('img').attr('src',$subtitle.find('img').attr('src').replace(".png",".jpg"));

    $.each(images, function (index, elm) {
        $('#bb-bookblock').append('<div class="bb-item"><img src="' + elm + '" /></div>');
    });

    $('#widget_wrap').show();
    $('#caption_wrap').hide();
    $('#caption_wrap_back').hide();
    $('#title_wrap').hide();
    $('#subtitle_wrap').hide();
    $('#subtitle_wrap_back').hide();

    var Page = (function () {
        var config = {
                $bookBlock: $('#bb-bookblock'),
                $navNext: $('#bb-nav-next'),
                $navPrev: $('#bb-nav-prev'),
                $navJump: $('#bb-nav-jump'),
                bb: $('#bb-bookblock').bookblock({
                    speed: 800,
                    shadowSides: 0.8,
                    shadowFlip: 0.7
                })
            },
            init = function () {

                initEvents();

            },
            initEvents = function () {

                var $slides = config.$bookBlock.children(),
                    totalSlides = $slides.length;

                // add navigation events
                config.$navNext.on('click', function () {
                    config.bb.next();
                    return false;
                });

                config.$navPrev.on('click', function () {
                    config.bb.prev();
                    return false;
                });

                // add swipe events
                $slides.on({

                    'swipeleft': function (event) {

                        config.bb.next();
                        return false;

                    },
                    'swiperight': function (event) {

                        config.bb.prev();
                        return false;

                    }

                });

            };

        return { init: init };

    })();

    Page.init();


    setTimeout(function () {
        if (captions.length == 1 && captions[0] == '') {
            $('.bb-item p').hide();
        }
    }, 1000);
    layout4();

}