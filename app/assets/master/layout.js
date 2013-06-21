/**
 * Created with JetBrains RubyMine.
 * User: arijitlahiri
 * Date: 15/04/13
 * Time: 12:10 PM
 * To change this template use File | Settings | File Templates.
 */

function layout1(){
    var $cube = $('#full3DCube');
    if (gon.no_subtitle && gon.no_titlepic) {
        $('#subtitle_back').removeClass('elements');
        $('#titlepic').removeClass('elements');
        $('#rotator').css({
            'height': "300px",
            'fontSize': "36px"
        }).find('h1').css({
                'lineHeight': "72px"
            });
    }else{
        if (gon.no_subtitle){
            $('#subtitle_back').removeClass('elements');
        }
    }
    setTimeout(function () {
        $('#wrapper').fadeIn(function () {
            $title.boxfit({multiline: true, maximum_font_size: 36});
            $subtitle.boxfit({multiline: true, maximum_font_size: 30});

            $('.elements').fade1by1();
        });
    }, 500);
    $caption.hide();
    $caption_back.hide();
    $caption.html($cube.find('img:first').attr('title'));
    $caption.boxfit({multiline: true, maximum_font_size: 36});

    if ((gon.no_subtitle==true) && (gon.no_titlepic==true)){
        $('#subtitle_back').hide();
        $('#subtitle').hide();
        $('#widget_wrap').css('width','775px');
    }

    if ((gon.nosub==false) && (gon.no_titlepic==true)){

    }

}

function layout2(){

    setTimeout(function () {
//in subtitle no subtitle and no subtitle pic
        if (gon.no_subtitle && gon.no_titlepic) {
            $title.css({width:"780px",left:"46px",padding:"20px"});
            $('#subtitle_back').removeClass('elements');
        }
        // if only subtitle is not mention
        else if(gon.no_subtitle){
            $title.css({width:"320px"});
            $('#subtitle_back').removeClass('elements');
        }
        else{
            $title.css({width:"320px"});
            $('#subtitle_back').addClass('elements');
        }

        $('#wrapper').fadeIn(function () {
            $title.boxfit({multiline: true, maximum_font_size: 36});
            $subtitle.boxfit({multiline: true, maximum_font_size: 30});
            $('.elements').fade1by1();
        });
    }, 500);

}
function layout3() {
    setTimeout(function () {
        $('#wrapper').fadeIn(function () {
            $('.elements').fade1by1();
        });
    }, 500);
}

function layout4() {
    setTimeout(function () {
        $('#wrapper').fadeIn(function () {
            $('.elements').fade1by1();
        });
    }, 500);
}

function layout5() {
    setTimeout(function () {
        $('#wrapper').fadeIn(function () {
            $('.elements').fade1by1();
        });
    }, 500);
    $title.boxfit({multiline: true, maximum_font_size: 36});
    $subtitle.boxfit({multiline: true, maximum_font_size: 30});
    if (gon.no_subtitle==true){
        $('#subtitle_back').css('background','transparent');
        $('#title_wrap').css('left','65px');
        $('#titlepic').css('top','-3px');
        $('#titlepic').css('left','510px');

        $('#titlepic img').css({
            marginBottom: "20px",
            maxHeight: "170px",
            maxWidth: "150px",
            position: "relative",
            zIndex: "1000"
        });
    }
    if ((gon.no_subtitle==true) && (gon.no_titlepic==true)){
        $('#widget_wrap').css('top','55px');
        $('#widget_wrap').css('height','465px');
        $('#widget_wrap').css('width','708px');
        $('#widget_wrap').css('background-color','rgba(0, 0, 0, 0.5)');

        $('#title_wrap').css('position','relative');
        $('#title_wrap').css('margin','0 auto');
        $('#title_wrap').css('left','0px');
        $('#title_wrap').css('top','45px');
        $('#title_wrap').css('background-color','rgba(0, 0, 0, 0.7)');
        $('#title_wrap').css('border-radius','0 0 15px 15px');
    }
}

function layout6(){
    var $cube = $('#full3DCube');
    if (gon.no_subtitle && gon.no_titlepic) {
        $('#subtitle_back').removeClass('elements');
        $('#titlepic').removeClass('elements');
        $('#rotator').css({
            'height': "300px",
            'fontSize': "36px"
        }).find('h1').css({
                'lineHeight': "72px"
            });
    }else{
        if (gon.no_subtitle==true){
            $('#subtitle_back').removeClass('elements');
        }
    }
    setTimeout(function () {
        $('#wrapper').fadeIn(function () {
            $title.boxfit({multiline: true, maximum_font_size: 36});
            $subtitle.boxfit({multiline: true, maximum_font_size: 36});

            $('.elements').fade1by1();
        });
    }, 500);
    $caption.hide();
    $caption_back.hide();
    $caption.html($cube.find('img:first').attr('title'));
    $caption.boxfit({multiline: true, maximum_font_size: 36});

}

function layout7() {
    setTimeout(function () {
        $('#wrapper').fadeIn(function () {
            $('.elements').fade1by1();
        });
    }, 500);
    $title.boxfit({multiline: true, maximum_font_size: 36});
    $subtitle.boxfit({multiline: true, maximum_font_size: 30});
    if (gon.no_subtitle==true){
        $('#subtitle_back').css('background','transparent');
    }
    if ((gon.no_subtitle==true) && (gon.no_titlepic==true)){
        $('#subtitle_back').hide();
        $('#subtitle').hide();
        $('#widget_wrap').css('width','775px');
    }
}

function layout8() {
    setTimeout(function () {
        $('#wrapper').fadeIn(function () {
            $('.elements').fade1by1();
        });
    }, 500);
    $title.boxfit({multiline: true, maximum_font_size: 48});
    $subtitle.boxfit({multiline: true, maximum_font_size: 36});
}

function layout9() {
    setTimeout(function () {
        $('#wrapper').fadeIn(function () {
            $('.elements').fade1by1();
        });
    }, 500);
    $title.boxfit({multiline: true, maximum_font_size: 48});
    $subtitle.boxfit({multiline: true, maximum_font_size: 36});
}

function layout10() {
    setTimeout(function () {
        $('#wrapper').fadeIn(function () {
            $('.elements').fade1by1();
        });
    }, 500);
    $title.boxfit({multiline: true, maximum_font_size: 48});
    $subtitle.boxfit({multiline: true, maximum_font_size: 36});
}

function layout11() {
    setTimeout(function () {
        $('#wrapper').fadeIn(function () {
            $('.elements').fade1by1();
        });
    }, 500);
    $title.boxfit({multiline: true, maximum_font_size: 48});
    $subtitle.boxfit({multiline: true, maximum_font_size: 36});
}

function layout12() {
    setTimeout(function () {
        $('#wrapper').fadeIn(function () {
            $('.elements').fade1by1();
        });
    }, 500);
    $title.boxfit({multiline: true, maximum_font_size: 48});
    $subtitle.boxfit({multiline: true, maximum_font_size: 36});
}


function title_plugin_slide(){
    if (subtitle) {
        $subtitle.css({left:"300px"});
        $('#subtitle_back').css({left:"300px"});
    }
    else if(gon.no_subtitle){
        (titlepic).css({left:"300px"});
        $('#subtitle_back').css({left:"300px",top:"10px"});

    }

    if ((gon.nosub==false) && (gon.no_titlepic==true)){
        $('#title_wrap').css({marginTop:"165px"});
        $('#subtitle_back').css({maxHeight:"75px",padding:"25px"});
        $('#subtitle_back').css('top','289px');
        $('#subtitle_back').css('left','178px');
        $('#subtitle_back').css('width','524px');
        $subtitle.boxfit({multiline: true, maximum_font_size: 30, align_center: true, align_middle:true});
    }


}
