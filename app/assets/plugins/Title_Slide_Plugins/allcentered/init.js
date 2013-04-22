function init_widget() {
    $('#title_wrap').wrapInner('<span class="text_wrap_span"/>').boxfit({multiline: true, maximum_font_size: 36});
    if ($('#text_wrap ul').length == 0 && $('#text_wrap ol').length == 0) {
        $('#text_wrap').wrapInner('<span class="text_wrap_span"/>').boxfit({multiline: true, maximum_font_size: 36});
    } else {
        $('#text_wrap').wrapInner('<span class="text_wrap_span"/>').boxfit({multiline: true, maximum_font_size: 36});
        $('#text_wrap li').wrapInner('<span/>').boxfit({multiline: true, maximum_font_size: 36});
    }
    $('#text_wrap_back').fadeIn(2000, function () {
        $('#text_wrap').fadeIn();
        $('#title_wrap').fadeIn();

    });
}