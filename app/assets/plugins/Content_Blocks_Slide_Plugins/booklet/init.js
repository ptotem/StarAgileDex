function init_widget() {
    $.each(images, function (index, elm) {
        $('#mybook').append('<div><img src=" ' + elm + ' " style="width:280px; height:160px;" /><p style="color:#000">' + captions[index] + '</p></div>');
    });
    $('#widget_wrap').show();

    $(function () {
        $("#mybook").booklet();
    });



}


