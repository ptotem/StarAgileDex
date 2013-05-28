function init_widget() {
    $.each(images, function (index, elm) {
        $('#slider-three').append('<div><img src="' + elm + '" /><p>' + captions[index] + '</p></div>');




    });
    $('#widget_wrap').show();

    $(document).ready(function() {
        /*
         *   Examples - images
         */

        $("a.pop1").fancybox();

        $("a.pop2").fancybox({
            'overlayShow'	: false,
            'transitionIn'	: 'elastic',
            'transitionOut'	: 'elastic'
        });

        $("a.pop3").fancybox({
            'transitionIn'	: 'none',
            'transitionOut'	: 'none',
            'overlayColor'		: '#000',
            'overlayOpacity'	: 0.7
        });

        $("a.pop4").fancybox({
            'opacity'		: true,
            'overlayShow'	: false,
            'transitionIn'	: 'elastic',
            'transitionOut'	: 'none'
        });

        $("a.pop5").fancybox();

        $("a#example6").fancybox({
            'titlePosition'		: 'outside',
            'overlayColor'		: '#000',
            'overlayOpacity'	: 0.9
        });

        $("a.pop6").fancybox({
            'titlePosition'	: 'inside'
        });

        $("a.pop7").fancybox({
            'titlePosition'	: 'over'
        });

    });

}


