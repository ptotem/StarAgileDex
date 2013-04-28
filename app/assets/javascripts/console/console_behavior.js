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
    $('#headline').hide();
    $('#logo').animate({
        'marginLeft': "+=15px"
    });
    $('#writeup').fadeOut(function () {
        $('#right_panel').animate({
            'width': "240px",
            'marginRight': "0"
        });
        $('#deck_list').animate({
            'width': "280px"
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
    $(".main_form_body").niceScroll({cursorcolor: "#232836", cursorborder: "none", cursorwidth: "5px", autohidemode: false, horizrailenabled: false});

    // Remove the presentations panel and move the slide panel to the left
    $('#deck_list').hide();
    $('#presentation_slides_index').css({
        'float': 'left',
        'marginLeft': '20px'
    }).animate({
            'width': "280px"
        }, function () {
            $('#right_panel').fadeOut(function () {
                $('#slide_form_panel').fadeIn();
            });
        });
    $('.slide_layout').css({
        'marginLeft': '20px'
    });
}
function transitOut() {
    $('.main_panel').hide();
    $('#presentation_slides_index').css({
        'width': '400px',
        'marginLeft': '0px'
    });
    $('#deck_list').show().animate({
        'width': "400px"
    });
    $('#right_panel').show().animate({
        'width': "480px",
        'marginRight': "30px"
    });
    $('#logo').css({
        'marginLeft': "20px"
    });
    $('#active_slide').fadeOut();
    $('#active_presentation').fadeOut(function () {
        $('#writeup').fadeIn(function () {
            $('#headline').fadeIn();
        });
    });
}

// This function creates a new deck

function create_new_deck() {
    var prez_name = $('#presentation_name').val();
    var data = {presentation_name: []};
    data["presentation_name"].push(prez_name);

    $.ajax({
        url: "/presentations/new",
        type: "post",
        async: false,
        data: JSON.stringify(data),
        contentType: "application/json",
        success: function (returning_data) {
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
            "iDisplayLength": 10,
            "aaSorting": [
                [ 0, "desc" ]
            ],
            "sScrollX": "100%",
            "sScrollY": "350",
            "aoColumns": [
                { "sClass": "center", "bSortable": false, "sWidth": "220px"}
            ],
            "bPaginate": false,
            "sPaginationType": "false",
            "bLengthChange": true,
            "bFilter": true,
            "bSort": true,
            "bInfo": false,
            "oSearch": {"sSearch": ""},
            "oLanguage": { "sSearch": "" },
            "sDom": 'C<"clear">lfrtip',
            "bAutoWidth": false }
    );
    $('#presentations_table_filter').children().children().addClass('presentation_filter');
    $('.presentation_filter').attr("placeholder", "Search Decks");

}

// This function sets up dataTables for the slide list
function initialize_slide_list() {
    $('#presentations_slides_table').dataTable({
            "iDisplayLength": 10,
            "bPaginate": false,
            "sPaginationType": "false",
            "bLengthChange": true,
            "bFilter": true,
            "bSort": false,
            "bInfo": false,
            "bRetrieve": true,
            "oSearch": {"sSearch": ""},
            "oLanguage": { "sSearch": "" },
            "sDom": 'C<"clear">lfrtip',
            "bAutoWidth": false }
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
        '<a href="#" class="btn btn-inverse" id="new_slide_btn" onclick="transitInNewSlide(0,' + this_presentation_id + ')">' +
        'Create a Slide <i class="icon-plus icon-white pull-right"></i>' +
        '</a> ' +
        '<hr>' +
        '<div class="active_presentation_panel" id=pres_' + this_presentation_id + '>' + '</div>';

    $('#presentation_slides_index').html('').append(slide_panel);

    // ----------------------------------------

    var data = {this_presentation_id: []};
    data["this_presentation_id"].push(this_presentation_id);

    $.ajax({ // This function gets the set of slides in the current presentation and populates them in the active presentation panel
        url: "/get_slides",
        type: "post",
        async: false,
        data: JSON.stringify(data),
        contentType: "application/json",
        success: function (data) {
            var slide_block, my_slide, this_id, cleaned_slide_title;

//            $('.active_presentation_panel').append('<table id="presentations_slides_table">' + '<thead> <tr> <th></th> </tr> </thead>' + '<tbody></tbody>');
            $('.active_presentation_panel').append('<ul id="presentations_slides_list"></ul>');

            $.each(data.split(','), function (d, ele) {
                if (data != "[]") {
                    $('#export_html_btn').show();
                    $('#export_scorm_btn').show();
                    $('#view_deck').show();
                }
                else {
                    $('#export_html_btn').hide();
                    $('#export_scorm_btn').hide();
                    $('#view_deck').hide();

                }
                ele = ele.toString().replace('[', '').replace(']', '').replace(/"/g, '');
                if (ele != '') {
                    my_slide = ele.split('|');
                    this_id = 'slide' + my_slide[0];
                    this_id = this_id.replace(/ /g, '');

                    // Regex to clean slide title, i.e. to clear if slide title contains/formatted with html tags, then remove html tags
                    // \ Escapes character, \r matches carriage return, \n matches linefeed, \t matches horizontal tab,
                    cleaned_slide_title = my_slide[1].replace(/\\r/g, '').replace(/\\n/g, '').replace(/\\t/g, '').replace(/<\s*\w.*?>/g, '').replace(/<\s*\/\s*\w\s*.*?>|<\s*br\s*>/g, '');

//                    slide_block = '' + '<tr class="slide_row">' +
//                        '<td>' +
//                        '<a href="#?slide' + my_slide[0].replace(/ /g, '') + '">' +
//                        '<button class="btn btn-inverse show_this_slide" onclick="transitInNewSlide(' + my_slide[0].replace(/ /g, '') + ',' + this_presentation_id + ')" type="button">' +
//                        cleaned_slide_title +
//                        '<input id="' + my_slide[0].replace(/ /g, '') + '" type="hidden" name="' + "slide_" + my_slide[0].replace(/ /g, '') + '">' +
//                        '</button>' +
//                        '</a>' +
//                        '</td>' +
//                        '</tr>';


                    slide_block = '' + '<li id="slide_' + my_slide[0].replace(/ /g, '') + '">' +
                        '<a href="#?slide' + my_slide[0].replace(/ /g, '') + '" style="float:left;">' +
                        '<button class="btn btn-inverse show_this_slide" onclick="transitInNewSlide(' + my_slide[0].replace(/ /g, '') + ',' + this_presentation_id + ')" type="button">' +
                        cleaned_slide_title +
                        '<input id="' + my_slide[0].replace(/ /g, '') + '" type="hidden" name="' + "slide_" + my_slide[0].replace(/ /g, '') + '">' +
                        '</button>' +
                        '</a>' +
                        '<div class="slide_controls" style="float:right; padding-top: 3px;">' +
                        '<span style="font-weight:normal; cursor: pointer; font-size: 20px; position: relative; left: -15px;" id="delete_slide_' + my_slide[0].replace(/ /g, '') + '">' + "&times;" + '</span>' +
                        '<span style="font-weight:bold; cursor: pointer; font-size: 22px;" id="move_up_slide_' + my_slide[0].replace(/ /g, '') + '">' + "&uarr;" + '</span>' +
                        '<span style="font-weight: bold; cursor: pointer; font-size: 22px;" id="move_down_slide_' + my_slide[0].replace(/ /g, '') + '">' + "&darr;" + '</span>' +
                        '</div>' +
                        '</li>';


                    $('.active_presentation_panel').attr("id", "#pres_" + this_presentation_id);
//                    $('#presentations_slides_table tbody').append(slide_block);
                    $('#presentations_slides_list').append(slide_block);


                    function move_slide_up() {
                        var slide_id = $(this).parent().prev().find('input').attr('id');
                        var thisLine = $(this).parent().parent();

                        var data = {slide_id: []};
                        data["slide_id"].push(slide_id);
                        $.ajax({
                            url: "move_slide_up",
                            type: "post",
                            async: false,
                            data: JSON.stringify(data),
                            contentType: "application/json",
                            success: function (data) {
                                //var thisLine = $(this).parent().parent();
                                var prevLine = thisLine.prev();
                                prevLine.before(thisLine);
                            }
                        });

                    }

                    function move_slide_down() {
                        var slide_id = $(this).parent().prev().find('input').attr('id');
                        var thisLine = $(this).parent().parent();

                        var data = {slide_id: []};
                        data["slide_id"].push(slide_id);
                        $.ajax({
                            url: "move_slide_down",
                            type: "post",
                            async: false,
                            data: JSON.stringify(data),
                            contentType: "application/json",
                            success: function (data) {
                                //var thisLine = $(this).parent().parent();
                                var prevLine = thisLine.next();
                                prevLine.after(thisLine);
                            }
                        });

                    }

                    function delete_slide() {
                        var conf = confirm("Are you sure?");
                        if (conf == true) {
                            var slide_id = $(this).parent().prev().find('input').attr('id');
                            var presentation_id = this_presentation_id;
                            var thisLine = $(this).parent().parent();

                            var data = {slide_id: [], presentation_id: []};
                            data["slide_id"].push(slide_id);
                            data["presentation_id"].push(presentation_id);
                            $.ajax({
                                url: "delete_slide",
                                type: "post",
                                async: false,
                                data: JSON.stringify(data),
                                contentType: "application/json",
                                success: function (data) {
//                                    alert(data);
                                    $(thisLine).empty().remove();
                                }
                            });
                        }

                    }

                    $('#move_up_slide_' + my_slide[0].replace(/ /g, '')).on('click', move_slide_up);
                    $('#move_down_slide_' + my_slide[0].replace(/ /g, '')).on('click', move_slide_down);
                    $('#delete_slide_' + my_slide[0].replace(/ /g, '')).on('click', delete_slide);


                }
            });
//            $("#view_deck").attr("href", '/view_prez/' + this_presentation_id);
            $("#view_deck").attr("href", '/view_deck/' + this_presentation_id);

            initialize_slide_list();
        }
    });

}

// These functions manage the deletion of a presentation or a slide and all its dependencies

function delete_presentation() {

    var data = {this_presentation_id: []};
    data["this_presentation_id"].push($('#slide_presentation_id').val());

    $.ajax({
        url: "delete_presentation",
        type: "post",
        async: false,
        data: JSON.stringify(data),
        contentType: "application/json",
        success: function (data) {
            var $pres_row_id = $('.show_this_presentation').find('input[id=' + $('#slide_presentation_id').val() + ']');
            $pres_row_id.parent().parent().parent().parent().empty().remove();
            transitOut();
        }
    });

}
function export_as_html() {
    window.location = '/export/' + $('#slide_presentation_id').val();
}


// This function creates the live bindings for buttons, links and scrolling

function load_bindings() {
    $('#signed_in').hide();

    //This sets the focus to the presentation name text-field on modal load
    $("#new_deck_Modal").on('shown', function () {
        $(this).find("input[type='text']:first").focus();
    });

    //This creates the presentation on pressing enter key in new deck modal form
    $("#new_deck_Modal").find("input[type='text']:first").keypress(function (event) {
        if (event.which == 13) {
            event.preventDefault();
            $('#new_deck_Modal_create_btn').click();
        }
    });

    // This function handles the creation of a new deck
    $('#new_deck_Modal_create_btn').on('click', create_new_deck);

    //This clears the text-field value after the modal is hidden, so next time when u load modal text-field gets cleared
    $('#new_deck_Modal').on('hidden', function () {
        $(this).find("input[type='text']:first").val('');
    });

    // This function handles the deletion of a deck
    $('#del_deck_btn').on('click', delete_presentation);

    // This function handles the presentation slides index
    $('.show_this_presentation').on('click', function () {
        show_presentation($(this).find(':input').attr("id"), $(this).text());
    });

    // This function handles the export as html of a deck
    $('#export_html_btn').on('click', export_as_html);


    // These functions manage the scroll bindings for the panels
    //    $(".main_panel").niceScroll({cursorcolor:"#232836", cursorborder:"none", cursorwidth:"5px", autohidemode:false, horizrailenabled:false});
//    $("#presentation_slides_index").niceScroll({cursorcolor:"#232836", cursorborder:"none", cursorwidth:"5px", autohidemode:true, horizrailenabled:false});

    // This function activates the Waterwheel
    init_widget();

}


function form_bindings() {

    //This validates Title presence
    $('#slide_title').focusout(function () {
        if ($('#slide_title').val() == "")
            $('#slide_title').attr("placeholder", "Title cannot be blank");
    });

    $('#slide_title').focusin(function () {
        if ($('#slide_title').val() == "")
            $('#slide_title').attr("placeholder", "Title");
    });

    //This validates Content Blocks caption word length
    $('.content_block_caption_txt').focusout(function () {
        if ($(this).val().split(/ /).length - 1 > 20) {
            $(this).val('');
            $(this).attr("placeholder", "Only twenty words are allowed as title");
        }
    });

    $('#show_titlepic').click(switch_to_titlepic);
    $('#clear_titlepic').click(switch_to_subtitle);

    $('#slide_titlepic').change(function () {
        $('#title_picture img').attr('src', '/assets/upload.png');
//        $('#titlepic_name').html($(this).val());
        var full_name = $(this).val();
        var rem_ext_from_file_name = full_name.substr(0, full_name.lastIndexOf('.'));
        var display_first_12_char = rem_ext_from_file_name.substring(0, 12);
        if (display_first_12_char.length >= 12) {
            var add_dots = display_first_12_char + "...";
            $('#titlepic_name').html(add_dots);
        }
        else {
            $('#titlepic_name').html(display_first_12_char);
        }
        //$('#titlepic_name').html($(this).val().substr(0, $(this).val().lastIndexOf('.'))).substring(0,15)+"...";
        return false;
    });

    $('#show_wysiwyg').on('click', open_blocks_mode);
    $('#clear_wysiwyg').on('click', open_wysiwyg_mode);
    $('#upload_ppt').click(open_ppt_mode);

    $(':file').on("change", function () {
        $this = $(this);
        if ($this.val() != "") {
            $this.parent().find('.overlap_file_field').hide();
            $this.parent().find(':checkbox').attr("checked", false);
        }
    });

    //This scrolls the contents blocks to the end on adding new field (new content block)
    $('.custom_scroll').on("click", function () {
        $('#content_block_section').animate({scrollTop: $('#content_block_section').prop("scrollHeight")}, 500);
    });

    // Form validation
    // Source : http://docs.jquery.com/Plugins/validation#Validate_forms_like_you.27ve_never_been_validating_before.21
    // Source : http://jzaefferer.github.com/jquery-validation/jquery.validate.js
    // js source included in console
    var slide_form_id = $('form').attr('id'); //This is the form id
    $("#" + slide_form_id).validate();

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
function open_ppt_mode(this_obj) {

    $(this_obj).hide();
    $('.fields').hide();

    $('#import_ppt_block').show();
//    $('#upload_ppt').hide();
//    $('#show_wysiwyg').show();
//    $('#clear_wysiwyg').show();
//    $('#content_block_section').hide();
//    $('#text_block_section').hide();
//    $('.extra').show();
    $('#slide_mode').val("PPT");
}

// This function toggles from subtitle to titlepic
function switch_to_titlepic() {
    $('#show_titlepic').hide();
    $('#clear_titlepic').show();
    $('#titlepic_Modal_btn').show();
    $('#titlepic_block').show();
    $('#title_picture').show();
    $('#existing_titlepic').show();
    $('#slide_titlepic').hide();
    $('#change_titlepic').hide();
    $('#slide_subtitle').hide();
    $('#slide_nosub').val(true);
}

// This function toggles from titlepic to subtitle
function switch_to_subtitle() {
    $('#subtitle_block').css('backgroundImage', 'url("")');
    $('#show_titlepic').show();
    $('#clear_titlepic').hide();
    $('#titlepic_Modal_btn').hide();
    $('#titlepic_block').hide();
    $('#slide_titlepic').show();
    $('#slide_subtitle').show();
    $('#slide_nosub').val(false);
}

function init_widget() {
    var jmpressOpts = {
        viewPort: {
            height: 400,
            width: 1300,
            maxScale: 1
        },
        animation: { transitionDuration: '0.8s' }
    };

    $('#jms-slideshow').jmslideshow($.extend(true, { jmpressOpts: jmpressOpts }, {
        autoplay: true,
        bgColorSpeed: '0.8s',
        arrows: false,
        interval: 6000
    }));
}

