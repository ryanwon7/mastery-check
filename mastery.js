//External client-side Javascript file

function requestMastery() {
    var URL = 'http://localhost:8080/mastery'
    var summoner_name = $('#summoner').val()

    $.ajax({
        type: 'POST',
        url: URL,
        data: {
            'summoner_name': summoner_name
        },
        dataType: 'text',
        success: function(msg) {
            $('').html(msg);
        },
        error: function(xhr, ajaxOptions, thrownError) {
            $('').html('Error retrieving and displaying mastery information.')
        }
    })
}
