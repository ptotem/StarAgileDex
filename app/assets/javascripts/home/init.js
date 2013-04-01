$(function () {
    $(".navbar").hide();

    //change class of a wrapper (i.e. bg, theme) based on theme selection drop-down from theme modal
    $('#wrapper').removeClass($('#wrapper').attr('class')).addClass(theme);
    $('#wrapper').css('font-family', font_style);

    //call load_widget() from master.js which loads the widget selected widget
    load_widget(current_widget);

    //when guest modal is displayed fade out everything else except right menu
    $(".guest").live("click", function () {
        $("#wrapper>:not(.menu_select)").fadeTo("slow", 0.1);
        $(".modal").hide();
        $(".menu_select").show();
    });

    //when guest modal is hidden show everything else that was faded out
    $("#guest_Modal").on('hidden', function () {
        $("#wrapper>:not(.menu_select)").fadeTo("slow", 0.9);
        $(".modal").hide();
    });

    //change class of a wrapper (i.e. bg, theme) based on theme selection drop-down from theme modal, and display currently selected theme in theme modal
    $("#ts").live("change", function () {
        var selected_theme = $('#ts').val();
        $('#wrapper').removeClass($('#wrapper').attr('class')).addClass(selected_theme);
        $("#current_theme_name").html("Current Theme " + ': ' + $('#ts option:selected').text());
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
    });

    $('#font_Modal').bind('show', function () {
        $("#current_font_name").html("Current Font : ");
        $("#current_font_name").append($('#fs option:selected').text());
    });
});