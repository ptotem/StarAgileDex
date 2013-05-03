function init_widget() {
    $.each(images, function (index, elm) {
        $('#presentation_container').append(' <div class="pc_item"><div class="desc">' + captions[index] + '</div><img src="' + elm + '"/></div>');



    });
    $('#widget_wrap').show();

    presentationCycle.init();
}


