function init_widget() {
    var main = gon.main;
//    var cleaned_main = gon.main.replace(/\[(.*?)\]/g,"");
//    alert(cleaned_main);
    $('#widget_wrap').html(main);
//    $('#widget_wrap').html(cleaned_main);
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
        $widget.boxfit({multiline:true, maximum_font_size:24})

  });
    layout7();
}