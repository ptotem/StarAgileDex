
var $cube = $('#full3DCube');

function init_widget() {

    $.each(images, function (index, elm) {
        $cube.append('<img src="' + elm + '" title="' + captions[index] + '"/>');
    });

    $cube.imagecube({
        direction: 'random', // Direction of rotation: random|up|down|left|right
        randomSelection: ['up', 'down', 'left', 'right'],
        // If direction is random, select one of these
        speed: 2000, // Time taken (milliseconds) to transition
        easing: 'swing', // Name of the easing to use during transitions
        repeat: false, // True to automatically trigger a new transition after a pause
        pause: 5000, // Time (milliseconds) between transitions
        selection: 'forward', // How to choose the next item to show:
        // 'forward', 'backward', 'random'
        shading: false, // True to add shading effects, false for no effects
        opacity: 0.8, // Maximum opacity (0.0 - 1.0) for highlights and shadows
        imagePath: '', // Any extra path to locate the highlight/shadow images
        full3D: true, // True to add cubic perspective, false for 2D rotation
        segments: 20, // The number of segments that make up each 3D face
        reduction: 30, // The amount (pixels) of reduction for far edges of the cube
        expansion: 10, // The amount (pixels) of expansion for the near edge of the cube
        lineHeight: [0.0, 1.25], // Hidden and normal line height (em) for text
        letterSpacing: [-0.4, 0.0], // Hidden and normal letter spacing (em) for text
        beforeRotate: remove_caption, // Callback before rotating
        afterRotate: set_caption // Callback after rotating
    });
    $subtitle.append('<br/><br/><a href="#" class="btn btn-inverse" id="rotator" onclick="$(\'#full3DCube\').imagecube(\'rotate\')"><h1>Spin the Cube</h1></a>');

    if ($cube.children().attr('title') == "") {
        $caption.width('0px');
        $caption.height('0px');
        $caption_back.height('0px');
        $caption_back.width('0px');
    }
    else {
        $caption.css('top', '474px');
        $caption.css('right', '108px');
        $caption.width('452px');
        $caption.height('117px');
        $caption.css('text-align', 'center');

        $caption_back.css('top', '462px');
        $caption_back.css('right', '108px');
        $caption_back.height('117px');
        $caption_back.width('452px');
    }

    setTimeout(function () {
        if (captions.length == 1 && captions[0] == "") {
            $caption_back.hide();
            $caption.hide();
        }
    }, 1700);

    //layout1();

}

function remove_caption(current, next) {
    $caption_back.hide();
    $caption.hide();
}
function set_caption(current, next) {
    //Show caption if after rotate the face has both image and caption.
    if (($(next).attr('title') != '') && ($(next).attr('src') != null)) {
        $caption.html($(next).attr('title'));
        $caption_back.fadeIn();
        $caption.fadeIn();
    }
}
