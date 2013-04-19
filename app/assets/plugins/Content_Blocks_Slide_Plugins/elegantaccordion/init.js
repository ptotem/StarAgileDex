function init_widget() {
    $.each(images, function (index, elm) {
        $('.accordion').append('<li class="jj bg1" style="background-image:url('+elm+') ;"><div class="heading"></div><div class="bgDescription"></div><div class="description"><h2></h2><p>'+captions[index]+'</p></div></li>');
    });





    $('#widget_wrap').show();

    $('.jj').click(
        function(){
            var $this = $(this);

            $('.jj').animate({'width':'100px'},1000);
            $('.heading',$this).stop(true,true).fadeIn();
            $('.description').hide();
            $('.bgDescription').show();
            $('.heading').show();

            $this.stop().animate({'width':'400px'},500);
            $('.heading',$this).stop(true,true).fadeOut();
            $('.bgDescription',$this).stop(true,true).slideDown(500);
            $('.description',$this).stop(true,true).fadeIn();
        }
    );

    if (images.length==1)
    {
        $('.jj').click();
    }

    if (captions.length==0)
    {
        $('#caption_wrap_back').hide();
        $('#caption_wrap').hide();
    }

}


