$(function () {
    load_bindings();
    initialize_deck_list();

    // If the user is coming here on an edit screen, we will get the slide id. We are transiting directly to the slide form
    if (gon.edit) {
        transitInDeck(gon.presentation);
        show_presentation(gon.presentation_id, gon.presentation);
        setTimeout(function () {
            transitInNewSlide(gon.slide_id, gon.presentation_id);
        }, 1000);
    }
});

// These functions manage the transitions between the Deck view, Slides view and New Slide View

function transitInDeck(name) {
    $('#writeup').hide();
    $('#waterwheel').fadeOut(function () {
        $('#right_panel').animate({
            'width':"240px",
            'marginRight':"0"
        });
        $('#deck_list').animate({
            'width':"280px"
        }, function () {
            $('#presentation_slides_index').fadeIn();
            $('#active_presentation').fadeIn();
        });
    });

}

function transitInNewSlide(slide_id, presentation_id) {

    if (slide_id == 0) {
        $.get("/slides/new/" + presentation_id, function (data) {
            $("#slide_form_panel").html("");
            $("#slide_form_panel").html(data);
            form_bindings();
        });
    } else {
        $.get("/slides/" + slide_id + "/edit/" + presentation_id, function (data) {
            $("#slide_form_panel").html(data);
            form_bindings();
        });
    }
    $(".main_form_body").niceScroll({cursorcolor:"#232836", cursorborder:"none", cursorwidth:"5px", autohidemode:false, horizrailenabled:false});

    // Remove the presentations panel and move the slide panel to the left
    $('#deck_list').hide();
    $('#presentation_slides_index').css({
        'float':'left',
        'marginLeft':'20px'
    }).animate({
            'width':"280px"
        }, function () {
            $('#slide_form_panel').fadeIn();
            $('#active_presentation').fadeOut(function () {
                $('#active_slide').fadeIn();
            });
        });
    $('.slide_layout').css({
        'marginLeft':'20px'
    });
}
function transitOut() {
    $('.main_panel').hide();
    $('#deck_list').show().animate({
        'width':"400px"
    });
    $('#right_panel').animate({
        'width':"480px",
        'marginRight':"30px"
    });
    $('#active_slide').fadeOut();
    $('#active_presentation').fadeOut(function () {
        $('#writeup').show();
        $('#waterwheel').fadeIn();
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
            guest = returning_data.split('|')[1] == 'guest' ? true : false;
            returning_data = returning_data.split('|')[0];
            $('#presentations_table').dataTable().fnAddData([
                '<a id="activate_presentation_' + returning_data + '" onclick="transitInDeck(\'' + prez_name + '\')" href="#?presentation' + returning_data + '"><button class="btn btn-inverse show_this_presentation" type="button"><input id="' + returning_data + '" type="hidden" name="' + returning_data + '">' + prez_name + '</button></a>', ""]
            );
            $('#presentations_table tbody tr:first').addClass('presentation_row');
            $('#new_deck_Modal').modal('hide');
            show_presentation(returning_data, prez_name);
            transitInDeck(prez_name);
            if (guest) {
                $('#not_signed_in').hide();
                $('#signed_in').show();
            }


        }
    });
}

// This function sets up dataTables for the deck list

function initialize_deck_list() {
    $('#presentations_table').dataTable({
            "iDisplayLength":10,
            "aaSorting":[
                [ 0, "desc" ]
            ],
            "sScrollX":"100%",
            "sScrollY":"350",
            "aoColumns":[
                { "sClass":"center", "bSortable":false, "sWidth":"220px"}
            ],
            "bPaginate":false,
            "sPaginationType":"false",
            "bLengthChange":true,
            "bFilter":true,
            "bSort":true,
            "bInfo":false,
            "oSearch":{"sSearch":""},
            "oLanguage":{ "sSearch":"" },
            "sDom":'C<"clear">lfrtip',
            "bAutoWidth":false }
    );
    $('#presentations_table_filter').children().children().addClass('presentation_filter');
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
    $.get("/slides/new/", function (data) {
        $("#slide_form_panel").html("");
        $("#slide_form_panel").html(data);
        $('#slide_presentation_id').val(this_presentation_id); // Set the current presentation as active till replaced
    });


    // This creates the basic presentation panel for the middle panel and adds the new slide button

    // ----------------------------------------
    var slide_panel = '' +
        '<h3>' + this_presentation_name + '</h3>' +
        '<a href="#" class="btn btn-info" id="new_slide_btn" onclick="transitInNewSlide(0,' + this_presentation_id + ')">' +
        'Create a Slide <i class="icon-plus icon-white pull-right"></i>' +
        '</a> ' +
        '<hr>' +
        '<div class="active_presentation_panel" id=pres_' + this_presentation_id + '>' + '</div>';

    $('#presentation_slides_index').html('').append(slide_panel);

    // ----------------------------------------

    var data = {this_presentation_id:[]};
    data["this_presentation_id"].push(this_presentation_id);

    $.ajax({ // This function gets the set of slides in the current presentation and populates them in the active presentation panel
        url:"/get_slides",
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

                    // Regex to clean slide title, i.e. to clear if slide title contains/formatted with html tags, then remove html tags
                    // \ Escapes character, \r matches carriage return, \n matches linefeed, \t matches horizontal tab,
                    cleaned_slide_title = my_slide[1].replace(/\\r/g, '').replace(/\\n/g, '').replace(/\\t/g, '').replace(/<\s*\w.*?>/g, '').replace(/<\s*\/\s*\w\s*.*?>|<\s*br\s*>/g, '');

                    slide_block = '' + '<tr class="slide_row">' +
                        '<td>' +
                        '<a href="#?slide' + my_slide[0].replace(/ /g, '') + '">' +
                        '<button class="btn btn-info show_this_slide" onclick="transitInNewSlide(' + my_slide[0].replace(/ /g, '') + ',' + this_presentation_id + ')" type="button">' +
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
            var $pres_row_id = $('.show_this_presentation').find('input[id=' + $('#slide_presentation_id').val() + ']');
            $pres_row_id.parent().parent().parent().parent().empty().remove();
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
    $('#signed_in').hide();

//    This creates the presentation on pressing enter key in new deck modal form
    $("input").keypress(function (event) {
        if (event.which == 13) {
            event.preventDefault();
            $('#new_deck_Modal_create_btn').click();
        }
    });

// This function handles the creation of a new deck
    $('#new_deck_Modal_create_btn').on('click', create_new_deck);

// This function handles the deletion of a deck
    $('#del_deck_btn').on('click', delete_presentation);

// This function handles the presentation slides index
    $('.show_this_presentation').on('click', function () {
        show_presentation($(this).find(':input').attr("id"), $(this).text());
    });

// These functions manage the scroll bindings for the panels
//    $(".main_panel").niceScroll({cursorcolor:"#232836", cursorborder:"none", cursorwidth:"5px", autohidemode:false, horizrailenabled:false});
    $("#presentation_slides_index").niceScroll({cursorcolor:"#232836", cursorborder:"none", cursorwidth:"5px", autohidemode:true, horizrailenabled:false});

// This function activates the Waterwheel
    $('#waterwheel').roundabout({
        shape:"waterWheel",
        autoPlay:true,
        autoplayDuration:500
    }).fadeIn("slow");
}

//TODO: Change such that the hidden fields get cleared on switching

function form_bindings() {

//    These functions validates Title presence
    $('#slide_title').focusout(function () {
        if ($('#slide_title').val() == "")
            $('#slide_title').attr("placeholder", "Title cannot be blank");
    });
    $('#slide_title').focusin(function () {
        if ($('#slide_title').val() == "")
            $('#slide_title').attr("placeholder", "Title");
    });
    $('#show_titlepic').click(switch_to_titlepic);
    $('#clear_titlepic').click(switch_to_subtitle);

    $('#show_wysiwyg').click(open_blocks_mode);
    $('#clear_wysiwyg').click(open_wysiwyg_mode);
    $('#upload_ppt').click(open_ppt_mode);

}

// This function switches the form to WYSIWYG editor
function open_wysiwyg_mode() {
    $('#upload_ppt').show();
    $('#show_wysiwyg').show();
    $('#clear_wysiwyg').hide();
    $('#content_block_section').hide();
    $('#text_block_section').show();
    $('#import_ppt_block').hide();
    $('.extra').show();
    $('#slide_mode').val("HTML");
}

// This function switches the form to Content blocks
function open_blocks_mode() {
    $('#show_wysiwyg').hide();
    $('#clear_wysiwyg').show();
    $('#upload_ppt').show();
    $('#content_block_section').show();
    $('#text_block_section').hide();
    $('#import_ppt_block').hide();
    $('.extra').hide();
    $('#slide_mode').val("Blocks");
}

// This function switches the form to Upload PPT
function open_ppt_mode() {
    $('#import_ppt_block').show();
    $('#upload_ppt').hide();
    $('#show_wysiwyg').show();
    $('#clear_wysiwyg').show();
    $('#content_block_section').hide();
    $('#text_block_section').hide();
    $('.extra').show();
    $('#slide_mode').val("PPT");
}

// This function toggles from subtitle to titlepic
function switch_to_titlepic() {
    $('#show_titlepic').hide();
    $('#clear_titlepic').show();
    $('#titlepic_block').show();
    $('#slide_titlepic').show();
    $('#existing_titlepic').show();
    $('#change_titlepic').hide();
    $('#slide_subtitle').hide();
    $('#slide_nosub').val(true);
}

// This function toggles from titlepic to subtitle
function switch_to_subtitle() {
    $('#show_titlepic').show();
    $('#clear_titlepic').hide();
    $('#titlepic_block').hide();
    $('#slide_subtitle').show();
    $('#slide_nosub').val(false);
}


