$(function () {
    $('#presentations_table').dataTable({
            "iDisplayLength": 10,
            "sScrollX": "100%",
            "sScrollY": "350",
        "aoColumns": [ { "sClass": "center", "bSortable": false, "sWidth": "33%"} , {}],
            "bPaginate":false,
            "sPaginationType":"false",
            "bLengthChange":true,
            "bFilter":true,
            "bSort":false,
            "bInfo":false,
            "oSearch":{"sSearch":""},
            "oLanguage":{ "sSearch":"" },
            "sDom":'C<"clear">lfrtip',
            "bAutoWidth":false }
    );
    $('#presentations_table').css('margin-left','218px');
    $('#presentations_table_filter').children().children().addClass('presentation_filter');
    $('#presentations_table tr td').css('padding', '5px');
    $('#presentations_table .presentation_tools').css('padding', '0px 5px 0px 5px');



    $('.presentation_filter').attr("placeholder", "Search Decks");
    $('.show_this_presentation').live('click', function () {
        show_presentation($(this).find(':input').attr("id"), $(this).text());
    });

    $(".middle_panel").niceScroll({cursorcolor:"#232836", cursorborder:"none", cursorwidth:"5px", autohidemode:false, horizrailenabled:false});
    $("#presentation_slides_index").niceScroll({cursorcolor:"#232836", cursorborder:"none", cursorwidth:"5px", autohidemode:true, horizrailenabled:false});


});

$(".sortable").sortable({ axis: "x" });

$('#add_images_and_cap').live('click', function () {
    $(".slide_contents_block").niceScroll({cursorcolor:"#232836", cursorborder:"none", cursorwidth:"5px", autohidemode:false, horizrailenabled:false});
    $('.slide_contents_block').animate({ scrollTop: $("#add_images_and_cap").position().top}, 'slow');
});



function transitIn(name) {

    $('.presentation_tools').hide();
    $('#left_panel').animate({
        'width':"240px"
    }, function () {
        $('#presentations_table_filter').css('margin-left', '15px');
        $('.presentation_filter').css('width', '185px');
        $('#presentations_table').css({
            'marginLeft': "10px",
            'width': "220px"
        });
        $('.dataTables_scrollBody').css({
            'overflow-x':"hidden",
            'overflow-y':"auto"
        });

        $('#writeup').fadeOut(function () {
            $('#presentation_slides_index').fadeIn();
            $('#active_presentation').fadeIn();
        });
    })
}

function transitOut() {
    $('.middle_panel').fadeOut(function () {
        $('#left_panel').show().animate({
            'width':"640px"
        }, function () {

            $('#presentation_slides_index').css({
                'float':'right',
                'marginLeft':'0',
                'width':'400px'
            });

            $('#active_slide').fadeOut();

            $('#active_presentation').fadeOut(function () {
                $('#writeup').fadeIn();
                $('#presentations_table').css({
                    'marginLeft': "218px",
                    'width': "220px"
                });
                $('#presentations_table_filter').css('margin-left', '222px');
                $('.presentation_tools').fadeIn();
            });
        });
    });
}

// This function handles the creation of a new deck

$('#new_deck_Modal_create_btn').live('click', function () {

    var prez_name = $('#presentation_name').val();
    var data = {presentation_name:[]};
    data["presentation_name"].push(prez_name);

    $.ajax({
        url:"/presentations/new",
        type:"post",
        async:false,
        data:JSON.stringify(data),
        contentType:"application/json",
        success:function (returning_data) {
            $('#presentations_table').dataTable().fnAddData([
                '<a id="activate_presentation_' + returning_data + '" onclick="transitIn(\'' + prez_name + '\')" href="#?presentation' + returning_data + '"><button class="btn btn-inverse show_this_presentation" type="button"><input id="' + returning_data + '" type="hidden" name="' + returning_data + '">' + prez_name + '</button></a>',""]
            );// TODO: Add the presentations tools td content once finalized
            $('#presentations_table tbody tr:last').addClass('presentation_row');
            $('#presentations_table tbody tr:last').find('td:first').addClass('presentation_contents');
            $('#presentations_table tbody tr:last').find('td:last').addClass('presentation_tools');
            $('#new_deck_Modal').modal('hide');
            show_presentation(returning_data, prez_name);
            transitIn(prez_name);
        }
    });
});

// This function handles the opening of the presentation panel and population of slides in it.

function show_presentation(this_presentation_id, this_presentation_name) {

    $('#slide_presentation_id').val(this_presentation_id); // Set the current presentation as active till replaced
    // This creates the basic presentation panel for the middle panel and adds the new slide button
    // ----------------------------------------
    var slide_panel = '' +
        '<div id="active_presentation_name">' + this_presentation_name + '</div>' +
        '<a href="#" class="btn btn-info" id="new_slide_btn">' +
        'Create a Slide <i class="icon-plus icon-white pull-right"></i>' +
        '</a> ' +
        '<hr>' +
        '<div class="active_presentation_panel sortable" id=pres_' + this_presentation_id + '>' + '</div>';

    $('#presentation_slides_index').html('').append(slide_panel);

    // ----------------------------------------

    var data = {this_presentation_id:[]};
    data["this_presentation_id"].push(this_presentation_id);

    $.ajax({ // This function gets the set of slides in the current presentation and populates them in the active presentation panel
        url:"get_slides",
        type:"post",
        async:false,
        data:JSON.stringify(data),
        contentType:"application/json",
        success:function (data) {
            var slide_block, my_slide, this_id, cleaned_slide_title;
            $.each(data.split(','), function (d, ele) {
                ele = ele.toString().replace('[', '').replace(']', '').replace(/"/g, '');
                if (ele != '') {
                    my_slide = ele.split('|');
                    this_id = 'slide' + my_slide[0];
                    this_id = this_id.replace(/ /g, '');
                    //Todo: Clean up the Regex here
                    cleaned_slide_title = my_slide[1].replace(/\\r/g, '').replace(/\\n/g, '').replace(/\\t/g, '').replace(/<\s*\w.*?>/g, '').replace(/<\s*\/\s*\w\s*.*?>|<\s*br\s*>/g, '');
                    slide_block = '' +
                        '<div class="slide_layout" id=' + this_id + '>' +
                        '<div class="del_slide">&times;</div>' +
                        '<div class="slide_contents">' + cleaned_slide_title + '</div>' +
                        '</div>';
                    $('#pres_' + this_presentation_id).append(slide_block);
                }
            });
        }
    });
}

// This function handles the deletion of the slide

$(".del_slide").live("click", function () {
    var conf = confirm("Are you sure?");
    if (conf == true) {
        var slide_id_string = $(this).parent().attr('id');
        var this_slide_div = "#" + slide_id_string;
        var slide_id = (slide_id_string).replace(/\D*/g, '').match(/\d*/g).toString().replace(/\D*/g, '');
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
});

// This function handles the new slide form

$('#new_slide_btn').live('click', function () {

    // Remove the presentations panel and move the slide panel to the left
    $(this).hide();
    $('#left_panel').fadeOut(function () {
        $('#presentation_slides_index').css({
            'float':'left',
            'marginLeft':'40px'
        });
        $('.slide_layout').css({
            'marginLeft':'20px'
        });
        $('#presentation_slides_index').animate({
            'width':"240px"
        }, function(){
            $('#slide_form_panel').fadeIn();
            $('#active_presentation').fadeOut(function () {
                $('#active_slide').fadeIn();
            });
        });
    });
});
