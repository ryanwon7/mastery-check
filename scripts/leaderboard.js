//External client-side Javascript file
$(document).bind('pageinit', displayLeaderboard())

function displayLeaderboard() {
    var URL = 'http://localhost:8080/leaderboard'

    $.ajax({
        type: 'GET',
        url: URL,
        data: '{}',
        dataType: 'html',
        success: function(msg) {
            $('#board').html(msg).trigger('create');
            $('#board').addClass("centered");
            var newTableObject = document.getElementById('board');
            sorttable.makeSortable(newTableObject);
        },
        error: function(xhr, ajaxOptions, thrownError) {
            alert('Error retrieving and displaying leaderboard.')
        }
    })
}