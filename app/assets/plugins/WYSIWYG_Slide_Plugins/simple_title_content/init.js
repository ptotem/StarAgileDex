function init_widget() {
    $('#widget_wrap').html(gon.main);
    $('#widget_wrap').show();
    if ($('#subtitle ul').length==0 && $('#subtitle ol').length==0){
        $('#subtitle').wrapInner('<span class="#subtitle_span"/>').textfill({ maxFontPixels: 150 });
    }else{
        $('#subtitle').wrapInner('<span class="#subtitle_span"/>').textfill({ maxFontPixels: 150 });
        $('#subtitle li').wrapInner('<span/>').textfill({ maxFontPixels: 30 });
    }
    $('#subtitle_back').fadeIn(2000,function(){
      $('#subtitle').fadeIn();
      $('#title_wrap').fadeIn();

  });
}