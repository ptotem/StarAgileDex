$(function () {
    $('#presentations_table').dataTable({
            "bPaginate":false,
            "sPaginationType":"false",
            "bLengthChange":true,
            "bFilter":true,
            "bSort":false,
            "bInfo":false,
            "oSearch":{"sSearch":""},
            "sDom":'C<"clear">lfrtip',
            "bAutoWidth":false }
    );
});
function transitIn(name) {
    $('.presentation_tools').hide();
    $('#left_panel').animate({
        'width':"240px"
    }, function () {
        $('#writeup').fadeOut(function () {
            $('#middle_panel').fadeIn();
            $('#active_presentation').fadeIn();
            $('#active_presentation_name').append(name);
        });
    })
}
function transitOut() {
    $('#middle_panel').fadeOut(function () {
        $('#left_panel').animate({
            'width':"640px"
        }, function () {
            $('#active_presentation').fadeOut(function () {
                $('#writeup').fadeIn();
                $('#active_presentation_name').html('');
                $('.presentation_tools').fadeIn();
            });
        });
    });
}