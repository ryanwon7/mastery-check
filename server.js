//Node.js server file

var express = require('express')
var mysql = require('mysql')
var app = express()

app.get('/home', function (req,res) {
    res.redirect("./sk3665_HW5.html")
})

app.listen(8080, function() {
    console.log("Server started...")
})