$(function () {
    load_bindings();
    initialize_deck_list();
});


// These functions manage the transitions between the Deck view, Slides view and New Slide View

function transitInDeck(name) {

    $('#presentations_table').animate({
        'marginLeft':"10px",
        'width':"220px"
    });
    $('#presentations_table_filter').animate({'margin-left':'15px'});
    $('#left_panel').animate({
        'width':"240px"
    }, function () {
        $('.presentation_filter').css('width', '185px');
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
function transitInNewSlide(slide_id, presentation_id) {

    if(slide_id==0){
    $.get("/slides/new/"+presentation_id, function (data) {
        $("#slide_form_panel").html("");
        $("#slide_form_panel").html(data);
        form_bindings();
    });
    }else{
        $.get("/slides/" + slide_id + "/edit/"+presentation_id, function (data) {
            $("#slide_form_panel").html(data);
            form_bindings();
        });
    }

    $(".main_form_body").niceScroll({cursorcolor:"#232836", cursorborder:"none", cursorwidth:"5px", autohidemode:false, horizrailenabled:false});


    // Remove the presentations panel and move the slide panel to the left
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
        }, function () {
            $('#slide_form_panel').fadeIn();
            $('#active_presentation').fadeOut(function () {
                $('#active_slide').fadeIn();
            });
        });
    });
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
                    'marginLeft':"218px",
                    'width':"220px"
                });
                $('#presentations_table_filter').css('margin-left', '222px');
                $('.presentation_tools').fadeIn();
            });
        });
    });
}

// This function creates a new deck

function create_new_deck() {
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
                '<a id="activate_presentation_' + returning_data + '" onclick="transitInDeck(\'' + prez_name + '\')" href="#?presentation' + returning_data + '"><button class="btn btn-inverse show_this_presentation" type="button"><input id="' + returning_data + '" type="hidden" name="' + returning_data + '">' + prez_name + '</button></a>', ""]
            );
            $('#presentations_table tbody tr:last').addClass('presentation_row');
            $('#presentations_table tbody tr:last').find('td:first').addClass('presentation_contents');
            $('#presentations_table tbody tr:last').find('td:last').addClass('presentation_tools');
            $('#new_deck_Modal').modal('hide');
            show_presentation(returning_data, prez_name);
            transitInDeck(prez_name);
        }
    });
}

// This function sets up dataTables for the deck list

function initialize_deck_list() {
    $('#presentations_table').dataTable({
            "iDisplayLength":10,
            "sScrollX":"100%",
            "sScrollY":"350",
            "aoColumns":[
                { "sClass":"center", "bSortable":false, "sWidth":"33%"} ,
                {}
            ],
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
    $('#presentations_table').css('margin-left', '218px');
    $('#presentations_table_filter').children().children().addClass('presentation_filter');
    $('#presentations_table tr td').css('padding', '5px');
    $('#presentations_table .presentation_tools').css('padding', '0px 5px 0px 5px');

    $('.presentation_filter').attr("placeholder", "Search Decks");
}

// This function sets up dataTables for the slide list
function initialize_slide_list() {
    $('#presentations_slides_table').dataTable({
            "iDisplayLength":10,
            "bPaginate":false,
            "sPaginationType":"false",
            "bLengthChange":true,
            "bFilter":true,
            "bSort":false,
            "bInfo":false,
            "bRetrieve":true,
            "oSearch":{"sSearch":""},
            "oLanguage":{ "sSearch":"" },
            "sDom":'C<"clear">lfrtip',
            "bAutoWidth":false }
    );
    $('#presentations_slides_table_filter').children().children().addClass('slide_filter');

    $('.slide_filter').attr("placeholder", "Search Slides");
}

// This function handles the opening of the presentation panel and population of slides in it.

function show_presentation(this_presentation_id, this_presentation_name) {

    $('#slide_presentation_id').val(this_presentation_id); // Set the current presentation as active till replaced
    // This creates the basic presentation panel for the middle panel and adds the new slide button

    // ----------------------------------------
    var slide_panel = '' +
        '<div id="active_presentation_name">' + this_presentation_name + '</div>' +
        '<a href="#" class="btn btn-info" id="new_slide_btn" onclick="transitInNewSlide(0,'+this_presentation_id+')">' +
        'Create a Slide <i class="icon-plus icon-white pull-right"></i>' +
        '</a> ' +
        '<hr>' +
        '<div class="active_presentation_panel" id=pres_' + this_presentation_id + '>' + '</div>';

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

            $('.active_presentation_panel').append('<table id="presentations_slides_table">' + '<thead> <tr> <th></th> </tr> </thead>' + '<tbody></tbody>');

            $.each(data.split(','), function (d, ele) {
                ele = ele.toString().replace('[', '').replace(']', '').replace(/"/g, '');
                if (ele != '') {
                    my_slide = ele.split('|');
                    this_id = 'slide' + my_slide[0];
                    this_id = this_id.replace(/ /g, '');
                    //Todo: Clean up the Regex here
                    cleaned_slide_title = my_slide[1].replace(/\\r/g, '').replace(/\\n/g, '').replace(/\\t/g, '').replace(/<\s*\w.*?>/g, '').replace(/<\s*\/\s*\w\s*.*?>|<\s*br\s*>/g, '');

                    slide_block = '' + '<tr class="slide_row">' +
                        '<td>' +
                        '<a href="#?slide' + my_slide[0].replace(/ /g, '') + '">' +
                        '<button class="btn btn-inverse show_this_slide" onclick="transitInNewSlide(' + my_slide[0].replace(/ /g, '') + ','+this_presentation_id+')" type="button">' +
                        cleaned_slide_title +
                        '<input id="' + my_slide[0].replace(/ /g, '') + '" type="hidden" name="' + "slide_" + my_slide[0].replace(/ /g, '') + '">' +
                        '</button>' +
                        '</a>' +
                        '</td>' +
                        '</tr>';

                    $('.active_presentation_panel').attr("id", "#pres_" + this_presentation_id);
                    $('#presentations_slides_table tbody').append(slide_block);
                }
            });
            initialize_slide_list();
        }
    });
}

// These functions manage the deletion of a presentation or a slide and all its dependencies

function delete_presentation() {

    var data = {this_presentation_id:[]};
    data["this_presentation_id"].push($('#slide_presentation_id').val());

    $.ajax({
        url:"delete_presentation",
        type:"post",
        async:false,
        data:JSON.stringify(data),
        contentType:"application/json",
        success:function (data) {
            // TODO: remove the row functionality not working
            var pres_row_id = "#activate_presentation_" + $('#slide_presentation_id').val();
            nTr = $(pres_row_id).parent().parent();
            $('#presentations_table').dataTable().fnDeleteRow($('#presentations_table').dataTable().fnGetPosition(nTr));
            transitOut();
        }
    });

}
function delete_slide(slide_id_string) {
    var conf = confirm("Are you sure?");
    if (conf == true) {
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

}

// This function creates the live bindings for buttons, links and scrolling

function load_bindings() {

// This function handles the creation of a new deck
    $('#new_deck_Modal_create_btn').on('click', create_new_deck);

// This function handles the deletion of a deck
    $('#del_deck_btn').on('click', delete_presentation);

// This function handles the presentation slides index
    $('.show_this_presentation').on('click', function () {
        show_presentation($(this).find(':input').attr("id"), $(this).text());
    });

// These functions manage the scroll bindings for the panels
//    $(".middle_panel").niceScroll({cursorcolor:"#232836", cursorborder:"none", cursorwidth:"5px", autohidemode:false, horizrailenabled:false});
    $("#presentation_slides_index").niceScroll({cursorcolor:"#232836", cursorborder:"none", cursorwidth:"5px", autohidemode:true, horizrailenabled:false});

}

//TODO: Change such that the hidden fields get cleared on switching
//TODO: Put in jquery validation for Title presence

function form_bindings(){

// This function toggles from subtitle to titlepic
    $('#show_titlepic').click(function () {
        $('#show_titlepic').hide();
        $('#clear_titlepic').show();
        $('#slide_titlepic').show();
        $('#slide_subtitle').hide();
    });

// This function toggles from titlepic to subtitle
    $('#clear_titlepic').click(function () {
        $('#show_titlepic').show();
        $('#clear_titlepic').hide();
        $('#slide_titlepic').hide();
        $('#slide_subtitle').show();
    });

// This function toggles from WYSIWYG editor to Content blocks
    $('#show_wysiwyg').click(function () {
        $('#show_wysiwyg').hide();
        $('#clear_wysiwyg').show();
        $('#upload_ppt').show();
        $('#content_block_section').show();
        $('#text_block_section').hide();
        $('#import_ppt_block').hide();
        $('.extra').hide();
    });

// This function toggles from Content blocks to WYSIWYG editor
    $('#clear_wysiwyg').click(function () {
        $('#upload_ppt').show();
        $('#show_wysiwyg').show();
        $('#clear_wysiwyg').hide();
        $('#content_block_section').hide();
        $('#text_block_section').show();
        $('#import_ppt_block').hide();
        $('.extra').show();
    });

// This function toggles from Content blocks to WYSIWYG editor
    $('#upload_ppt').click(function () {
        $('#import_ppt_block').show();
        $('#upload_ppt').hide();
        $('#show_wysiwyg').show();
        $('#clear_wysiwyg').show();
        $('#content_block_section').hide();
        $('#text_block_section').hide();
        $('.extra').show();
    });

}





