//Node.js server file

var express = require('express')
var fs = require('fs')
var mysql = require('mysql')
var bodyParser = require('body-parser')
var champion = require('./data/champion.json')
var request = require('request-promise')

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

app.post("/mastery", function(req,resp) {
    var summoner_name = req.body.summoner_name
    var encrypted_summoner_id = ''
    var highest_mastery = 0
    var total_mastery = 0
    var champion_id = 0

    var summoner_URL = 'https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/'
    summoner_URL += summoner_name
    summoner_URL += '?api_key=' + api_key
    var html_string = '<tr><th>Mastery</th><th>Champion Name</th><th>Mastery Points</th><th>Points to Next Level</th></tr>'

    request(summoner_URL).then(res => {
        obj = JSON.parse(res)
        encrypted_summoner_id = obj.id
        var mastery_URL = 'https://na1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/'
        mastery_URL += encrypted_summoner_id
        mastery_URL += '?api_key=' + api_key
        return request(mastery_URL)
    }).then(res => {
        obj = JSON.parse(res)
        highest_mastery = obj[0].championPoints
        champion_id = obj[0].championId
        for (i=0; i<obj.length; i++) {
            curr_champ = obj[i].championId
            html_string += '<tr><td>' + obj[i].championLevel + '</td><td>' + champion.data[curr_champ].id + '</td><td>' + obj[i].championPoints + '</td><td>' + obj[i].championPointsUntilNextLevel + '</td></tr>'
        }
        var total_mastery_URL = 'https://na1.api.riotgames.com/lol/champion-mastery/v4/scores/by-summoner/'
        total_mastery_URL += encrypted_summoner_id
        total_mastery_URL += '?api_key=' + api_key
        resp.write(html_string)
        return request(total_mastery_URL)
    }).then(res => {
        obj = JSON.parse(res)
        total_mastery = obj
        resp.end()
        con.query("INSERT IGNORE INTO mastery (summoner, champion, total_mastery, highest_mastery) VALUES ('" + summoner_name + "', '" + champion.data[champion_id].id + "', '" + total_mastery + "', '" + highest_mastery + "');"),
        function(err,rows,fields) {
            if (err) {
                console.log('Error during query processing')
            }
            else {
                console.log('Summoner successfully added')
            }
        }
    }).catch(err => console.log)  
    })

app.post("/account", function(reqs,res) {
    var summoners_URL = 'https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/'
    summoners_URL += reqs.body.summoner_name
    summoners_URL += '?api_key=' + api_key
    request.get(summoners_URL, function(error, response, body) {
        var json = JSON.parse(body)
        if (json.status != undefined) {
            res.write('<p>We could not find a summoner with that name. Please check your input and try again.</p>')
            res.end()
        } else {
            html_string = '<p>Summoner Icon:</p><br><img src="http://ddragon.leagueoflegends.com/cdn/9.17.1/img/profileicon/' + json.profileIconId + '.png" width="10%">\n<p>Summoner Name: ' + json.name + '</p>\n<p>Summoner Level: ' + json.summonerLevel + '</p>'
            res.write(html_string)
            res.end()
        }
    })
})

app.get('/leaderboard', function(req,res) {
    con.query('SELECT summoner, total_mastery, highest_mastery, champion FROM mastery ORDER BY total_mastery DESC',
        function(err,rows,fields) {
            if (err) {
                console.log('Error during query processing')
            }
            else {
                html_string = '<tr><th>Summoner Name</th><th>Total Mastery</th><th>Highest Mastery</th><th>Champion</th>'

                var columns = []

                for (i=0; i<fields.length; i++) {
                    columns.push(fields[i].name)
                }

                html_string += '</tr>'

                for (j=0; j<rows.length; j++) {
                    html_string += '<tr>'

                    for (k=0; k<fields.length; k++) {
                        html_string += '<td>' + rows[j][columns[k]] + '</td>'
                    }

                    html_string += '</tr>'
                }

                res.write(html_string)
                res.end()
            }
        })
})

app.get('/home', function (req,res) {
    res.redirect('./views/index.html')
})

app.listen(8080, function() {
    console.log("Server started...")
})