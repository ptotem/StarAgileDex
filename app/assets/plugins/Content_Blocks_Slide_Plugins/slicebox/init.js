function init_widget() {
    $.each(images, function (index, elm) {
        $('#sb-slider').append('<li><a><img src="' + elm + '" title="' + captions[index] + '"/></a><div class="sb-description"><h3>' + captions[index] + '</h3></div></li>');

        if (elm != null) {

            $('#sb-slider').append('<li><a><img src="' + elm + '" title="' + captions[index] + '"/></a><div class="sb-description">' + captions[index] + '</div></li>');
        } else {

            $('#sb-slider').append('<li><a><img src="/assets/adlogo.png" title="' + captions[index] + '"/></a><div class="sb-description">' + captions[index] + '</div></li>');


        }


    });



    $('#widget_wrap').show();
    var Page = (function() {

        var $navArrows = $( '#nav-arrows' ).hide(),
            $shadow = $( '#shadow' ).hide(),
            slicebox = $( '#sb-slider' ).slicebox( {
                onReady : function() {

                    $navArrows.show();
                    $shadow.show();

                },
                orientation : 'r',
                cuboidsRandom : true,
                disperseFactor : 30
            } ),

            init = function() {

                initEvents();

            },
            initEvents = function() {

                // add navigation events
                $navArrows.children( ':first' ).on( 'click', function() {

                    slicebox.next();
                    return false;

                } );

                $navArrows.children( ':last' ).on( 'click', function() {

                    slicebox.previous();
                    return false;

                } );

            };

        return { init : init };

    })();

    Page.init();

    setTimeout(function () {
        if (captions.length == 1 && captions[0]=="") {
            $('.sb-description').hide();
        }
    }, 300);

}


