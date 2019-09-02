//Node.js server file

var express = require('express')
var fs = require("fs")
var mysql = require('mysql')
var bodyParser = require("body-parser")

var app = express()
var password = fs.readFileSync("./password.txt", "utf8")
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: password,
    database: "hw5"
})

app.use(express.static("."))
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

con.connect(function (err) {
    if (err) {
        console.log("Error connecting to database" + err)
    }
    else {
        console.log("Database successfully connected")
    }
})

app.get("/mastery", function(req,res) {
    return
})

app.get("/getMastery", function(req,res) {
    return
})

app.get('/home', function (req,res) {
    res.redirect("./sk3665_HW5.html")
})

app.listen(8080, function() {
    console.log("Server started...")
})