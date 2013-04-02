

$(function () {
    $('#presentations_table').dataTable({
            "bPaginate":false,
            "sPaginationType":"false",
            "bLengthChange":true,
            "bFilter":true,
            "bSort":false,
            "bInfo":false,
            "oSearch":{"sSearch":""},
            "oLanguage": { "sSearch": "" },
            "sDom":'C<"clear">lfrtip',
            "bAutoWidth":false }
    );
    $('#presentations_table_filter').children().children().addClass('presentation_filter');
});

function transitIn(name) {

    $('.presentation_tools').hide();
    $('#left_panel').animate({
        'width':"240px"
    }, function () {
        $('#presentations_table_filter').css('margin-left','20px');
        $('.presentation_filter').css('width','155px');
        $('.presentation_search_ico').css('left','87px');

        $('#writeup').fadeOut(function () {
            $('#middle_panel').fadeIn();
            $('#active_presentation').fadeIn();
        });
    })
}

function transitOut() {
    $('#middle_panel').fadeOut(function () {
        $('#left_panel').animate({
            'width':"640px"
        }, function () {
            $('#presentations_table_filter').css('text-align','left');
            $('#presentations_table_filter').css('margin-left','152px');
            $('#presentations_table_filter').css('margin-top','-25px');

            $('.presentation_search_ico').css('left','20px');
            $('.presentation_search_ico').css('top','5px');
            $('.presentation_search_ico').css('position','relative');


            $('#active_presentation').fadeOut(function () {
                $('#writeup').fadeIn();
                $('.presentation_tools').fadeIn();
            });
        });
    });
}

$('.show_this_presentation').click(function(){
        this_presentation_name = $(this).text();
        this_presentation_id = ($(this).children().attr("id"));
        thid_pre_id='/slides/new/'+this_presentation_id
        var data = {this_presentation_id:[]};
        data["this_presentation_id"].push(this_presentation_id);

        $.ajax({
            url:"get_slides",
            type:"post",
            async:false,
            data:JSON.stringify(data),
            contentType:"application/json",
            success:function (data) {
                var slide = data.split(',');
                $('#middle_panel').html('');
                $('#middle_panel').append('<div id="active_presentation_name">'+this_presentation_name+'</div><a href='+thid_pre_id+' class="btn btn-info" id="new_slide_btn">Create a Slide<i class="icon-plus icon-white pull-right"></i></a> <hr>' +
                                          '<div style="margin: 10px 10px 10px 10px; min-height: 418px;" id=pres_'+this_presentation_id+'>'+'</div>');
                $.each (slide, function(d, ele){
                    ele=ele.toString().replace('[','').replace(']','').replace(/"/g,'');
                    if (ele!=''){
                        var my_slide = ele.split('|');
                        var this_id = 'slide'+my_slide[0];
                        this_id=this_id.replace(/ /g,'');
                        var cleaned_slide_title = my_slide[1].replace(/\\r/g, '').replace(/\\n/g,'').replace(/\\t/g,'').replace(/<\s*\w.*?>/g,'').replace(/<\s*\/\s*\w\s*.*?>|<\s*br\s*>/g,'');
                        $('#pres_'+this_presentation_id).append('<div class="slide_layout" id='+this_id+'><div class="del_slide">X</div>'+ '<div class="slide_contents">' + cleaned_slide_title + '</div></div>');

                    }

                });
            }
        });

    });



$(".del_slide").live("click", function(){

    var conf = confirm("Are you sure?");
    if (conf == true) {
        var slide_id_string = $(this).parent().attr('id');
        var this_slide_div = "#"+slide_id_string;
        var slide_id = (slide_id_string).replace(/\D*/g,'').match(/\d*/g).toString().replace(/\D*/g,'');
        var data = {slide_id:[]};
        data["slide_id"].push(slide_id);

        $.ajax({
            url:"del_slide",
            type:"post",
            async:false,
            data:JSON.stringify(data),
            contentType:"application/json",
            success:function (data) {
                $(this_slide_div).empty().remove();
            }
        });
    }

    }
);