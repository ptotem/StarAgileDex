function init_widget() {
    $.each(images, function (index, elm) {
        $('#fs-slider').append('<figure><img style="height: 449px;" src="'+elm+'"  /><figcaption><h3>'+captions[index]+'</h3><p>'+captions[index]+'</p></figcaption></figure>');
    });

    $("#widget_wrap").show();

    $( '#fs-slider' ).imgslider();
}