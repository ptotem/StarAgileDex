function init_widget() {
    $.each(images, function (index, elm) {

        $('#controller').append('<span class="jFlowControl">' + "No" + index+1 +'</span>');
        $('#slides').append('<div><img src=" ' + elm + ' "/> <p> ' + captions[index] + ' </p> </div>');

    });
    $('#widget_wrap').show();
    $(function () {
        $("div#controller").jFlow({
            slides:"#slides",
            width:"980px",
            height:"313px"
        });
    });

}


