//External Javascript file

function getMastery() {
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/mastery",
        data: "{}",
        dataType: "html",
        success: function(msg) {
            $("").html(msg);
        },
        error: function(xhr, ajaxOptions, thrownError) {
            $("").html("Error retrieving and displaying mastery information.")
        }
    })
}

function getAccount() {
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/account",
        data: "{}",
        dataType: "html",
        success: function(msg) {
            $("").html(msg);
        },
        error: function(xhr, ajaxOptions, thrownError) {
            $("").html("Error retrieving and displaying account information.")
        }
    })
}
