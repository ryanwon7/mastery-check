//Node.js server file

var express = require('express')
var fs = require('fs')
var mysql = require('mysql')
var bodyParser = require("body-parser")
var champion = require('./data/champion.json')

var app = express()
var mysql_password = fs.readFileSync('./settings/password.txt', 'utf8')
var api_key = fs.readFileSync('./settings/key.txt', 'utf8')
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
    var summoner_name = req.body.summoner_name
    var encrypted_summoner_id = ''
    var champion_mastery = 0
    var total_mastery = 0
    var champion_id = 0

    var summoner_URL = 'https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/'
    summoner_URL += summoner_name
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
        champion_mastery = json[0].championPoints
        champion_id = json[0].championId
        html_string = ''
    })

    var total_mastery_URL = 'https://na1.api.riotgames.com/lol/champion-mastery/v4/scores/by-summoner/'
    total_mastery_URL += encrypted_summoner_id
    mastery_URL += '?api_key=' + api_key

    request.get(total_mastery_URL, function (error, response, body) {
        total_mastery = JSON.parse(body)
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

app.get('/home', function (req,res) {
    res.redirect('./views/index.html')
})

app.listen(8080, function() {
    console.log("Server started...")
})