function init_widget() {
    $.each(images, function (index, elm) {
        $('#slide').append('<li><a href="#cube'+index+'"><img src="'+elm+'" class="cube'+index+'" /></a><div class="label_text"><p>'+captions[index]+'</p></div></li>');
    });

    $("#widget_wrap").show();

    $('.box_skitter_large').skitter({fullscreen:false});
}
