function init_widget() {
    if ($('#text_wrap ul').length==0 && $('#text_wrap ol').length==0){
        $('#text_wrap').wrapInner('<span class="#text_wrap_span"/>').textfill({ maxFontPixels: 150 });
    }else{
        $('#text_wrap').wrapInner('<span class="#text_wrap_span"/>').textfill({ maxFontPixels: 150 });
        $('#text_wrap li').wrapInner('<span/>').textfill({ maxFontPixels: 30 });
    }
    $('#text_wrap_back').fadeIn(2000,function(){
      $('#text_wrap').fadeIn();
      $('#title_wrap').fadeIn();

  });
}