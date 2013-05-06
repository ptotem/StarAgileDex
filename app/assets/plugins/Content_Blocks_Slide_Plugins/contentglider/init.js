function init_widget() {
    $.each(images, function (index, elm) {
//        $('#canadaprovinces').append('<div class="glidecontent"><img src=" ' + elm + '"/></div>');
        $('.glidecontent').append('<div><img src="' + elm + '" /><p>' + captions[index] + '</p></div>');




    });
    $('#widget_wrap').show();

    featuredcontentglider.init({
        gliderid:"canadaprovinces", //ID of main glider container
        contentclass:"contentglider", //Shared CSS class name of each glider content
        togglerid:"p-select", //ID of toggler container
        remotecontent:"", //Get gliding contents from external file on server? "filename" or "" to disable
        selected:0, //Default selected content index (0=1st)
        persiststate:false, //Remember last content shown within browser session (true/false)?
        speed:500, //Glide animation duration (in milliseconds)
        direction:"downup", //set direction of glide: "updown", "downup", "leftright", or "rightleft"
        autorotate:true, //Auto rotate contents (true/false)?
        autorotateconfig:[3000, 2], //if auto rotate enabled, set [milliseconds_btw_rotations, cycles_before_stopping]
        onChange:function (previndex, curindex, $allcontents) { // fires when Glider changes slides
            //custom code here
        }
    })
}


