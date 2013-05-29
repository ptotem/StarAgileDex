function init_widget() {
    $('#widget_wrap').html(gon.main);
    $('#widget_wrap').show();
//    TODO: Needs to be checked
//    if ($('#subtitle ul').length==0 && $('#subtitle ol').length==0){
//        $('#subtitle').wrapInner('<span class="#subtitle_span"/>').textfill({ maxFontPixels: 150 });
//    }else{
//        $('#subtitle').wrapInner('<span class="#subtitle_span"/>').textfill({ maxFontPixels: 150 });
//        $('#subtitle li').wrapInner('<span/>').textfill({ maxFontPixels: 30 });
//    }
    $('#subtitle_back').fadeIn(2000,function(){
      $('#subtitle').fadeIn();
      $('#title_wrap').fadeIn();
        $widget.boxfit({multiline:true, maximum_font_size:36})

  });
    layout1();
}