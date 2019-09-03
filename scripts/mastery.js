//External client-side Javascript file

function requestMastery() {
    var URL = 'http://localhost:8080/mastery'
    var summoner_name = $('#summoner').val()
    if (summoner_name == "") {
        alert('Please enter a valid Summoner Name.')
    } else {
        $.ajax({
            type: 'POST',
            url: URL,
            data: {
                'summoner_name': summoner_name
            },
            dataType: 'text',
            success: function(msg) {
                $('#filler').html(msg).trigger('create');
                $('#filler').addClass("scrollable");
                var newTableObject2 = document.getElementById('filler');
                sorttable.makeSortable(newTableObject2);
            },
            error: function(xhr, ajaxOptions, thrownError) {
                alert('Error retrieving and displaying mastery information.')
            }
        })
    }
}
