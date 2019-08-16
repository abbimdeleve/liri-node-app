require("dotenv").config();
var axios = require("axios");
var keys = require("./keys.js");
var moment = require("moment");
var Spotify = require('node-spotify-api')
var spotify = new Spotify(keys.spotify);
var fs = require("fs");

var action = process.argv[2] //stores action for switch case below in variable, uses third argument in command line
var userInput = process.argv.slice(3, process.argv.length).join(); //stores input for each action function, allows input of more than one word

fs.appendFile(__dirname + "/log.txt", `\n${action} ${userInput}`, function(err) {
    if (err) return console.log(err);
}); //writes information for each user entry to log.txt file (appends so it doesn't rewrite each time)

switch (action) {
    case "concert-this":
        concert();
        break;
    case "spotify-this-song":
        song();
        break;
    case "movie-this":
        movie();
        break;
    case "do-what-it-says":
        doIt();
        break;
} //switch case for different functions, cleaner than if else statements

function concert() {
    let artist = userInput;
    axios.get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp").then(function (response) {
        for (let i = 0; i < 1; i++) {
            console.log("Venue: ", response.data[i].venue.name);
            console.log("Location: ", response.data[i].venue.city, "-", response.data[i].venue.country);
            console.log("Date: ", moment(response.data[i].datetime).format("MM-DD-YYYY"));
        };
    });
}; //uses axios to access bandsintown api and get venue, location and date of concert for input artists

function song() {
    let songName = userInput;
    if (!songName) { songName = "the sign ace of base" }; //short circuit conditional for if user does not input a song
    spotify
        .search({ type: 'track', query: songName })
        .then(function (response) {
            for (let i = 0; i < 1; i++) {
                console.log("Artist: ", response.tracks.items[i].album.artists[0].name);
                console.log("Song: ", response.tracks.items[i].name);
                console.log("Album: ", response.tracks.items[i].album.name);
                console.log("Preview: ", response.tracks.items[i].preview_url);
            }
        })
        .catch(function (err) {
            console.log(err);
        });
}; //spotify has its own node process, doesn't require axios or url build

function movie() {
    let movieName = userInput;
    if (!movieName) { movieName = "mr nobody" }; //just like the song function, short circuit conditional if no user input
    axios.get("http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy").then(
        function (response) {
            console.log("Title: ", response.data.Title);
            console.log("Release Year: ", response.data.Year);
            console.log("IMDB Rating: ", response.data.Ratings[0].Value);
            console.log("Rotten Tomatoes Rating: ", response.data.Ratings[1].Value);
            console.log("Production Country/ies: ", response.data.Country);
            console.log("Language/s: ", response.data.Language);
            console.log("Plot: ", response.data.Plot);
            console.log("Actors: ", response.data.Actors);
        });
};

function doIt() {
    fs.readFile("random.txt", "utf8", function (err, data) {
        if(err) {return console.log(err);}
        else {
            var doItAction = data.split(",")[0];
            var doItUserInput = data.split(",")[1]; //new variables for process.argv[2] and [3], split random.txt at comma and used each index for new variables
            
            userInput = doItUserInput

            switch (doItAction) {
                case "concert-this":
                    concert();
                    break;
                case "spotify-this-song":
                    song();
                    break;
                case "do-what-it-says":
                    doIt();
                    break;
            }
        } 
    })
}
