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
    var highest_mastery = 0
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

    var html_string = '<table><tr><th>Mastery</th><th>Champion Name</th><th>Mastery Points</th><th>% to Next Level</th></tr>'

    request.get(mastery_URL, function(error, response, body) {
        var json = JSON.parse(body)

        highest_mastery = json[0].championPoints
        champion_id = json[0].championId

        for (i=0; i<json.list.length; i++) {
            html_string += '<tr><td>' + json[i].championLevel + '</td><td>' + champion[json[i].championId] + '</td><td>' + json[i].championPoints + '</td><td>' + json[i].championPointsUntilNextLevel + '</td></tr>'
        }
    })

    html_string += '</table>'
    res.send(html_string)

    var total_mastery_URL = 'https://na1.api.riotgames.com/lol/champion-mastery/v4/scores/by-summoner/'
    total_mastery_URL += encrypted_summoner_id
    mastery_URL += '?api_key=' + api_key

    request.get(total_mastery_URL, function (error, response, body) {
        total_mastery = JSON.parse(body)
    })

    con.query('INSERT INTO mastery (summoner, champion, total_mastery, highest_mastery) VALUES (' + summoner_name + ', ' + champion[champion_id] + ', ' + total_mastery + ', ' + highest_mastery + ');'),
        function(err,rows,fields) {
            if (err) {
                console.log('Error during query processing')
            }
            else {
                console.log('Summoner successfully added')
            }
        }
})

app.post("/account", function(req,res) {
    var summoner_URL = 'https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/'
    summoner_URL += req.body.summoner_name
    summoner_URL += '?api_key=' + api_key


    request.get(summoner_URL, function(error, response, body) {
        var json = JSON.parse(body)
        html_string = '<img src="http://ddragon.leagueoflegends.com/cdn/9.17.1/img/profileicon/' + json.profileIconId + '.png">\n' + json.name + '\n' + json.summonerLevel
        res.send(html_string)
    })
})

app.get('/home', function (req,res) {
    res.redirect('./views/index.html')
})

app.listen(8080, function() {
    console.log("Server started...")
})