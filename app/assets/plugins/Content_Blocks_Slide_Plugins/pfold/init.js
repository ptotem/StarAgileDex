function init_widget() {
    $.each(images, function (index, elm) {


//            $('#grid').append('<img src="' + elm + '" title="' + captions[index] + '"/>');
        $('#grid').append('<div class="uc-container"><div class="uc-initial-content"><img src="' + elm + '" /><span class="icon-eye" style=""></span></div>' +
            '<div class="uc-final-content"><img src="' + elm + '" alt="image_' + index + '-large" />' +
            '<div class="title">' + captions[index] + '</div>' +
            '<span class="icon-cancel"></span>' +
            '</div>' +
            '</div>');


    });

    $('#widget_wrap').show();

    $(function () {

        // say we want to have only one item opened at one moment
        var opened = false;

        $('#grid > div.uc-container').each(function (i) {

            var $item = $(this), direction;

            switch (i) {
                case 0 :
                    direction = ['right', 'bottom'];
                    break;
                case 1 :
                    direction = ['left', 'bottom'];
                    break;
                case 2 :
                    direction = ['right', 'top'];
                    break;
                case 3 :
                    direction = ['left', 'top'];
                    break;
            }

            var pfold = $item.pfold({
                folddirection:direction,
                speed:300,
                onEndFolding:function () {
                    opened = false;
                }
            });

            $item.find('span.icon-eye').on('click',function () {

                if (!opened) {
                    opened = true;
                    pfold.unfold();
                }


            }).end().find('span.icon-cancel').on('click', function () {

                    pfold.fold();

                });

        });

    });

}


