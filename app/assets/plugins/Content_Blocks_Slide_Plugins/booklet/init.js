function init_widget() {
    $.each(images, function (index, elm) {
        $('#mybook').append('<div><img src=" ' + elm + '" /><div class="squishy">' + captions[index] + '</div></div>');
    });
    $('#widget_wrap').show();


    $(function () {
        $("#mybook").booklet();

//        $(".squishy").squishy({maxWidth: 200, minSize: 20});
        $(".squishy").squishy({minWidth:200, maxWidth: 250, minSize: 10, maxSize :12});
    });


}


