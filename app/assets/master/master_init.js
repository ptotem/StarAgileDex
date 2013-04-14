/* Global Variables*/
var captions = gon.caption;
var images = gon.image_list;

$(function () {
    $('.ad-menu-item').slideToggle();
    var $title = $('#title_wrap');
    $title.html('<span>' + gon.title + '</span>');
    $title.textfill();
    $title.fadeIn();
    if (!gon.no_subtitle) {
        $('#subtitle').html(gon.subtitle).show();
    } else {
        $('#subtitle_back').html('<img src=' + gon.titlepic + '>').show();
    }

    $('.text_buttons').show();
    $(".navbar").hide();
    $("#wrapper").show();
    $('#wrapper').addClass(gon.background).css('font-family', gon.font);
    init_widget();

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
        var font_style = $('#fs').val();
        $('#wrapper').css('font-family', font_style);
        $("#current_font_name").html("Current Font " + ': ' + $font);
        var fontsize, h1fontsize;
        $.each($('.text_block'), function (index, elm) {
            fontsize = (parseInt($(elm).css("font-size").replace("px", "")) - gon.fontadjustment[index]) + "px";
            h1fontsize = (parseInt($(elm).children(elm).css("font-size").replace("px", "")) - gon.fontadjustment[index]) + "px";
            $(elm).css("font-family", gon.fontarray[font_style]);
            $(elm).css("font-size", fontsize);
            $(elm).find('h1').css("font-size", h1fontsize);
        });
        gon.font = $font;
    });
});

function load_widget(index) {
    if (index < 0)
        index = gon.widget_list.length - 1;
    if (index == gon.widget_list.length)
        index = 0;
    gon.plugin = index;
    window.location = '/slides/' + gon.slide_id + '/' + index + '/' + gon.font + '/' + gon.background;
}


