function init_widget() {
    $.each(images, function (index, elm) {
        $('.flow').append('<div class="item"><img class="content" src="' + elm + '"/><div class="caption">' + captions[index] + '</div></div>');


    });
    $('#widget_wrap').show();

    var cf = new ContentFlow('contentFlow', {reflectionColor: "#000000"});
}


