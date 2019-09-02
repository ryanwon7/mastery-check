//External Javascript file

function displayMasteryPage() {
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/mastery",
        data: "{}",
        dataType: "html",
        success: function(msg) {
            $("").html(msg)
        },
        error: function(xhr, ajaxOptions, thrownError) {
            $("").html("Error retrieving and displaying page.")
        }
    })
}

function getMastery() {
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/getMastery",
        data: "{}",
        dataType: "html",
        success: function(msg) {
            $("").html(msg);
        },
        error: function(xhr, ajaxOptions, thrownError) {
            $("").html("Error retrieving and displaying mastery.")
        }
    })
}
