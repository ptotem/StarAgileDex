function init_widget() {
    $.each(images, function (index, elm) {
        if (elm != null) {
            $('#wi-el').append('<li><img src="' + elm + '" title="' + captions[index] + '"/><p>'+captions[index]+'</p></li>');

        } else {

            $('#wi-el').append('<li><p style="background-color: rgba(0,0,0,0.5);height: 80%;font-size: 1em;padding: 25px;">'+captions[index]+'</p></li>');
        }





    });

    layout1();
    $('#widget_wrap').show();


    var $el = $( '#wi-el' ),
        windy = $el.windy(),
        allownavnext = false,
        allownavprev = false;

    $( '#nav-prev' ).on( 'mousedown', function( event ) {

        allownavprev = true;
        navprev();

    } ).on( 'mouseup mouseleave', function( event ) {

            allownavprev = false;

        } );

    $( '#nav-next' ).on( 'mousedown', function( event ) {

        allownavnext = true;
        navnext();

    } ).on( 'mouseup mouseleave', function( event ) {

            allownavnext = false;

        } );

    function navnext() {
        if( allownavnext ) {
            windy.next();
            setTimeout( function() {
                navnext();
            }, 150 );
        }
    }

    function navprev() {
        if( allownavprev ) {
            windy.prev();
            setTimeout( function() {
                navprev();
            }, 150 );
        }
    }

}


