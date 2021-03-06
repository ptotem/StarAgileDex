
/* Global Variables*/
var captions = gon.caption;
var images = gon.image_list;

var $caption = $('#caption_wrap');
var $caption_back = $('#caption_wrap_back');
var $title = $('#title_wrap');
var $subtitle;
var $widget = $('#widget_wrap');

$(function () {

    // Set up the Title and the Subtitle
//    $title.html((gon.title).charAt(0).toUpperCase() + (gon.title).substr(1).toLowerCase());
    $title.html((gon.title));

    if (gon.no_subtitle && !gon.no_titlepic) {
        $subtitle=$('#titlepic');
        $subtitle.html('<img src=' + gon.titlepic + '>');
    } else {
        $subtitle=$('#subtitle');
        $subtitle.html(gon.subtitle);
    }
    // Initialize Widget
    $('#wrapper').addClass(gon.background);
    $('#wrapper > div:not(.nav)').css('font-family', gon.font);
    init_widget();
//    alert(gon.font);
    load_menu_bindings();
});






// TODO: Clean up this code

function load_menu_bindings(){
    $('.ad-menu-item').slideToggle();


    if (gon.view_deck) {
        if (gon.prev_slide!=null){
            $('#slide_prev').attr('href','/view_deck/'+gon.presentation_id+'/'+gon.prev_slide);
        }else{
            $('#slide_prev').attr('href','');
        }
        if (gon.next_slide!=null){
            $('#slide_next').attr('href','/view_deck/'+gon.presentation_id+'/'+gon.next_slide);
        }else{
            $('#slide_next').attr('href','');
        }

    } else {
        if(gon.prev_slide!=null)  {
            $('#slide_prev').attr('href',gon.prev_slide+'.html');
        }
        if(gon.next_slide!=null)  {
            $('#slide_next').attr('href',gon.next_slide+'.html');
        }
    }




    eval(gon.plugin_layout);

    //change class of a wrapper (i.e. bg, theme) based on theme selection drop-down from theme modal, and display currently selected theme in theme modal
    $("#ts").live("change", function () {
        var selected_theme = $('#ts').val();
        $wrapper = $('#wrapper');
        $wrapper.removeClass($wrapper.attr('class')).addClass(selected_theme);
        $("#current_theme_name").html("Current Theme " + ': ' + $('#ts option:selected').text());
        gon.background = selected_theme;
    });

    $('#theme_Modal').bind('show', function () {
        $("#current_theme_name").html("Current Theme : ").append($('#ts option:selected').text());
    });

    //change font of each block i.e. wrapper, title_wrap, text_wrap, caption_wrap block and display currently selected font in font modal
    $("#fs").live("change", function () {
        var $font = $('#fs option:selected').text();
        $('#wrapper > div:not(.nav)').css('font-family', $font);
        $("#current_font_name").html("Current Font " + ': ' + $font);
//        var fontsize, h1fontsize;
//        $.each($('.text_block'), function (index, elm) {
//            fontsize = (parseInt($(elm).css("font-size").replace("px", "")) - gon.fontadjustment[index]) + "px";
//            h1fontsize = (parseInt($(elm).children(elm).css("font-size").replace("px", "")) - gon.fontadjustment[index]) + "px";
//            $(elm).css("font-family", gon.fontarray[font_style]);
//            $(elm).css("font-size", fontsize);
//            $(elm).find('h1').css("font-size", h1fontsize);
//        });
        gon.font = $font;
    });

    $("#select_plugin_btn").on("click",function(){
        var layout=$('input:radio[name=plugin]:checked').val();
        window.location="/slides/"+gon.slide_id+"/"+layout+"/"+gon.font+"/"+gon.background;
    });
}

function load_widget(index) {
    if (index < 0)
        index = gon.widget_list.length - 1;
    if (index == gon.widget_list.length)
        index = 0;
    gon.plugin = index;
    window.location = '/slides/' + gon.slide_id + '/' + index + '/' + gon.font + '/' + gon.background;
}


$.fn.fade1by1 = function (ops) {
    var
        o = $.extend({
            delay: 200,
            speed: 500,
            ease: 'swing' // Other requires easing plugin
        }, ops),
        $el = this
    for (var i=0, d=0, l=$el.length; i<l; i++, d+=o.delay)
        $el.eq(i).delay(d).fadeIn(o.speed, o.ease);
    return $el
};


