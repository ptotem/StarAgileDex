/**
 * Created with JetBrains RubyMine.
 * User: arijitlahiri
 * Date: 15/04/13
 * Time: 12:10 PM
 * To change this template use File | Settings | File Templates.
 */

function layout1(){
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
            $subtitle.boxfit({multiline: true, maximum_font_size: 36});
//            $caption.html($cube.find('img:first').attr('title'));
            $('.elements').fade1by1();
        });
    }, 500);
}

function layout2(){

    setTimeout(function () {
//in subtitle no subtitle and no subtitle pic
        if (gon.no_subtitle && gon.no_titlepic) {
            $title.css({width:"776px"});
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
            $subtitle.boxfit({multiline: true, maximum_font_size: 36});
            $('.elements').fade1by1();
        });
    }, 500);



}
