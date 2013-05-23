function init_widget() {
    $.each(images, function (index, elm) {
        $('#carousel').append('<div class="carousel-feature"><img class="carousel-image" src="' + elm + '"><div class="carousel-caption"><p>' + captions[index] + ' </p></div></div>');




    });
    $('#widget_wrap').show();

    $(document).ready(function() {
        var carousel = $("#carousel").featureCarousel({

        });
    });

}


