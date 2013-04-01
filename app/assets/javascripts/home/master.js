

/* Global Variables*/

var current_widget = 0;
var widget_list = ['imagecube/imagecube.html',"scrollpath/scrollpath.html",'jimpress/jimpress.html','roundabout/roundabout.html'];
var text_list = [ "shuffleLetters","textualizer", "airport",  "typist"];
var current_text_widget = 0;
var content = '';
var elements;
var captions = new Array();
var images = new Array();
var bimage = "";
var theme;
var font_style;

/* Loads the widget into the Widget Container (#widget_wrap) */

function load_widget(index) {
    $('#title_wrap').show();
    $('#text_wrap').show();
    $('.text_buttons').show();

    /* Cycle through the plugins array*/
    if (index < 0)
        index = widget_list.length - 1;
    if (index == widget_list.length)
        index = 0;

    /* Empty out the current Widget Container*/
    $('#widget_head').empty().remove();
    $('#widget_wrap').html('');

    /* Load the new Widget */
    $("#widget_wrap").load('home_widgets/'+widget_list[index], function (responseTxt, statusTxt, xhr) {
        if (statusTxt == "success") {
            load_data();
            include_scripts();
            init_widget();
        } else {
            alert("Error: " + xhr.status + ": " + xhr.statusText);
        }
    });

    /* Set current_widget to the Current Widget index in the widget_list array*/
    current_widget = index;
}

//loading text widget
function load_text_widget(index) {
    if (index < 0)
        index = text_list.length - 1;
    if (index == text_list.length)
        index = 0;

    $('#text_wrap').html('');
    $("#text_wrap").load(text_list[index] + '/' + text_list[index] + '.html', function (responseTxt, statusTxt, xhr) {
        if (statusTxt == "success")
            if (index < 2) {
                init(content.split("(?!^)"));
            }
            else {
                init(content.split("(?!^)"));
            }

    });

    current_text_widget = index;
}


// load the data from slide_data.js
function load_data() {
    $('#title_wrap').html('<h1>'+bimage+'</h1>');
    $('#text_wrap').html(content);
}

