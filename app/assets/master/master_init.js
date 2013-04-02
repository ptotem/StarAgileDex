/* Global Variables*/
var captions = gon.caption;
var images = gon.image_list;

$(function () {
    $('#title_wrap').html('<h1>' + gon.title + '</h1>');
    $('#text_wrap').html(gon.subtitle);
    $('#title_wrap').show();
    $('#text_wrap').show();
    $('.text_buttons').show();
    $(".navbar").hide();
    $("#wrapper").show();
    $('#wrapper').addClass(gon.background);
    $('#wrapper').css('font-family', gon.font);
    init_widget();

    //change class of a wrapper (i.e. bg, theme) based on theme selection drop-down from theme modal, and display currently selected theme in theme modal
    $("#ts").live("change", function () {
        var selected_theme = $('#ts').val();
        $('#wrapper').removeClass($('#wrapper').attr('class')).addClass(selected_theme);
        $("#current_theme_name").html("Current Theme " + ': ' + $('#ts option:selected').text());
        gon.background=selected_theme;
    });

    $('#theme_Modal').bind('show', function () {
        $("#current_theme_name").html("Current Theme : ");
        $("#current_theme_name").append($('#ts option:selected').text());
    });

    //change font of each block i.e. wrapper, title_wrap, text_wrap, caption_wrap block and display currently selected font in font modal
    $("#fs").live("change", function () {
        var font_style = $('#fs').val();
        $('#wrapper').css('font-family', font_style);
        $("#current_font_name").html("Current Font " + ': ' + $('#fs option:selected').text());
        var fontsize, h1fontsize;
        $.each($('.text_block'), function (index, elm) {
            fontsize = (parseInt($(elm).css("font-size").replace("px", "")) - gon.fontadjustment[index]) + "px";
            h1fontsize = (parseInt($(elm).children(elm).css("font-size").replace("px", "")) - gon.fontadjustment[index]) + "px";
            $(elm).css("font-family", gon.fontarray[font_style]);
            $(elm).css("font-size", fontsize);
            $(elm).find('h1').css("font-size", h1fontsize);
        });
        gon.font=font_style;
    });
});

function load_widget(index) {
    if (index < 0)
        index = gon.widget_list.length - 1;
    if (index == gon.widget_list.length)
        index = 0;
    window.location='/slides/'+gon.slide_id+'/'+index+'/'+gon.font+'/'+gon.background;
}
