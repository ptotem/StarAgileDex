function init_widget() {
    $.each(images, function (index, elm) {

        var this_caption = 'caption' + index;

        if (elm != null) {
            $('#bb-bookblock').append('<div class="bb-item"><a><img src="' + elm + '" title="' + captions[index] + '"/></a><div id=' + this_caption + ' class="xyz">' + captions[index] + '</div></div>');
        } else {
            $('#bb-bookblock').append('<div class="bb-item"><a></a><div id=' + this_caption + ' class="xyz">' + captions[index] + '</div></div>');
        }

//        this_caption = '#' + this_caption;
//        $(this_caption).boxfit({multiline:true, maximum_font_size:16});

    });

    $('#widget_wrap').show();

    var Page = (function () {

        var config = {
                $bookBlock:$('#bb-bookblock'),
                $navNext:$('#bb-nav-next'),
                $navPrev:$('#bb-nav-prev'),
                $navJump:$('#bb-nav-jump'),
                bb:$('#bb-bookblock').bookblock({
                    speed:800,
                    shadowSides:0.8,
                    shadowFlip:0.7
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

                config.$navJump.on('click', function () {

                    config.bb.jump(totalSlides);
                    return false;

                });

                // add swipe events
                $slides.on({

                    'swipeleft':function (event) {

                        config.bb.next();
                        return false;

                    },
                    'swiperight':function (event) {

                        config.bb.prev();
                        return false;

                    }

                });

            };

        return { init:init };


    })();

    Page.init();


    setTimeout(function () {

        if (captions.length == 1 && captions[0] == '') {
            $('.bb-item p').hide();
        }
    }, 1000);
    //layout1();


}