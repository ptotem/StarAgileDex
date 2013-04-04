function init_widget() {
    $.each(images, function (index, elm) {
        $('#full3DCube').append('<img src="' + elm + '" title="' + captions[index] + '"/>');
    });

    if (images.length > 1) {
        $('#full3DCube').imagecube({
            direction:'random', // Direction of rotation: random|up|down|left|right
            randomSelection:['up', 'down', 'left', 'right'],
            // If direction is random, select one of these
            speed:2000, // Time taken (milliseconds) to transition
            easing:'swing', // Name of the easing to use during transitions
            repeat:true, // True to automatically trigger a new transition after a pause
            pause:5000, // Time (milliseconds) between transitions
            selection:'forward', // How to choose the next item to show:
            // 'forward', 'backward', 'random'
            shading:false, // True to add shading effects, false for no effects
            opacity:0.8, // Maximum opacity (0.0 - 1.0) for highlights and shadows
            imagePath:'', // Any extra path to locate the highlight/shadow images
            full3D:true, // True to add cubic perspective, false for 2D rotation
            segments:20, // The number of segments that make up each 3D face
            reduction:30, // The amount (pixels) of reduction for far edges of the cube
            expansion:10, // The amount (pixels) of expansion for the near edge of the cube
            lineHeight:[0.0, 1.25], // Hidden and normal line height (em) for text
            letterSpacing:[-0.4, 0.0], // Hidden and normal letter spacing (em) for text
            beforeRotate:remove_caption, // Callback before rotating
            afterRotate:set_caption // Callback after rotating
        });
    }
    else {
        $('#full3DCube').imagecube({
            repeat:false
        });
    }

    //alert($(next).attr('src'));
    if($('#full3DCube').children().attr('src')=="null") {
        $('#caption_wrap').css('top','102px');
        $('#caption_wrap').css('right','111px');
        $('#caption_wrap_back').css('top','102px');
        $('#caption_wrap_back').css('right','111px');

        $('#caption_wrap').width('408px');
        $('#caption_wrap').height('368px');
        $('#caption_wrap_back').height('448px');
        $('#caption_wrap_back').width('448px');
    }
    else if($('#full3DCube').children().attr('title')==""){
        $('#caption_wrap').width('0px');
        $('#caption_wrap').height('0px');
        $('#caption_wrap_back').height('0px');
        $('#caption_wrap_back').width('0px');
    }
    else{
        $('#caption_wrap').css('top','350px');
        $('#caption_wrap').css('right','160px');
        $('#caption_wrap').width('310px');
        $('#caption_wrap').height('80px');
        $('#caption_wrap').css('text-align','center');

        $('#caption_wrap_back').css('top','350px');
        $('#caption_wrap_back').css('right','160px');
        $('#caption_wrap_back').height('160px');
        $('#caption_wrap_back').width('350px');
    }


    setTimeout(function () {
        $('#wrapper').fadeIn(function () {
            $('#widget_wrap').fadeIn('slow', function () {
                $('#title_wrap').fadeIn();
                $('#text_wrap_back').slideDown();
                $('#caption_wrap_back').fadeIn();
                $('#caption_wrap').html($('#full3DCube img:first').attr('title')).fadeIn();
                $('#text_wrap').slideDown(1000, function () {
                    $('#text_wrap_back').slideDown();
                    $('.navbar').fadeIn(function () {
                        $('.ad-menu-item').slideToggle();
                    });
                });
            });
        });
    }, 1000);


    setTimeout(function () {


        if (captions.length==1 && captions[0]=="") {

            $('#caption_wrap_back').hide();
            $('#caption_wrap').hide();

        }
    }, 1700);





}

function remove_caption(current, next) {
    $('#caption_wrap_back').hide();
    $('#caption_wrap').hide();
}
function set_caption(current, next) {

    //alert($(next).attr('src'));
    if($(next).attr('src')=="null") {
        $('#caption_wrap').css('top','102px');
        $('#caption_wrap').css('right','111px');
        $('#caption_wrap_back').css('top','102px');
        $('#caption_wrap_back').css('right','111px');

        $('#caption_wrap').width('408px');
        $('#caption_wrap').height('368px');
        $('#caption_wrap_back').height('448px');
        $('#caption_wrap_back').width('448px');
    }
    else if($(next).attr('title')==""){
        $('#caption_wrap').width('0px');
        $('#caption_wrap').height('0px');
        $('#caption_wrap_back').height('0px');
        $('#caption_wrap_back').width('0px');
    }
    else{
        $('#caption_wrap').css('top','350px');
        $('#caption_wrap').css('right','160px');
        $('#caption_wrap').width('310px');
        $('#caption_wrap').height('80px');
        $('#caption_wrap').css('text-align','center');

        $('#caption_wrap_back').css('top','350px');
        $('#caption_wrap_back').css('right','160px');
        $('#caption_wrap_back').height('160px');
        $('#caption_wrap_back').width('350px');
    }

    $('#caption_wrap').html($(next).attr('title'));
    $('#caption_wrap_back').fadeIn();
    $('#caption_wrap').fadeIn();
}
