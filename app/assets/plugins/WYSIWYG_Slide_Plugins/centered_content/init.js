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
    $('#subtitle_back').fadeIn(2000, function () {

        $('#title_wrap').fadeIn();
        $('#title_wrap').spanize('anim',1);
        animateit2();
        function animateit2(){
            $('#title_wrap').textscan({
                spanize:-1,
                unspanize:-1,
                spanClass:'anim',
                initColor:'FFF',
                endColor:'FFF',
                transColor:'FF0000',
                cb:function(){
                    $('#title_wrap').textscan({
                        spanize:-1,
                        unspanize:-1,
                        amplitude:20,
                        step:10,
                        spanClass:'anim',
                        initColor:'FFF',
                        direction:'<-',
                        endColor:'FFF',
                        transColor:'00FF00',
                        cb:function(){
                            $('#subtitle').fadeIn();
                            $("#subtitle").scrambledWriter();
                        }
                    });
                }});
        }

        $widget.boxfit({multiline:true, maximum_font_size:36});

        var content_len = $('#widget_wrap').find('p').val().length;
        alert(content_len);

    });
    layout5();
}