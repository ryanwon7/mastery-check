//Node.js server file

var express = require('express')
var fs = require('fs')
var mysql = require('mysql')
var bodyParser = require("body-parser")

var app = express()
var mysql_password = fs.readFileSync('../settings/password.txt', 'utf8')
var api_key = fs.readFileSync('../settings/key.txt', 'utf8')
var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: mysql_password,
    database: 'CS275_final_project'
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

app.post("/mastery", function(req,res) {
    var encrypted_summoner_id = ''

    var summoner_URL = 'https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/'
    summoner_URL += req.body.summoner_name
    summoner_URL += '?api_key=' + api_key

    request.get(summoner_URL, function(error, response, body) {
        var json = JSON.parse(body)
        encrypted_summoner_id = json.id
    })

    var mastery_URL = 'https://na1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/'
    mastery_URL += encrypted_summoner_id
    mastery_URL += '?api_key=' + api_key

    request.get(mastery_URL, function(error, response, body) {
        var json = JSON.parse(body)
        html_string = ''
    })
})

app.post("/account", function(req,res) {
    var summoner_URL = 'https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/'
    summoner_URL += req.body.summoner_name
    summoner_URL += '?api_key=' + api_key

    request.get(summoner_URL, function(error, response, body) {
        var json = JSON.parse(body)
        html_string = 'http://ddragon.leagueoflegends.com/cdn/9.17.1/img/profileicon/' + json.profileIconId + '.png'
        return
    })
})

app.listen(8080, function() {
    console.log("Server started...")
})