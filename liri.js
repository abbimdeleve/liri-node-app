require("dotenv").config();
var axios = require("axios");
var keys = require("./keys.js");
var moment = require("moment");
var Spotify = require('node-spotify-api')
var spotify = new Spotify(keys.spotify);

var action = process.argv[2]

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
}

function concert() {
    let artist = process.argv.slice(3, process.argv.length).join();
    axios.get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp").then(function (response) {
        for (let i = 0; i < 1; i++) {
            console.log("Venue: ", response.data[i].venue.name);
            console.log("Location: ", response.data[i].venue.city, "-", response.data[i].venue.country);
            console.log("Date: ", moment(response.data[i].datetime).format("MM-DD-YYYY"));
        };
    });
};

function song() {

    let songName = process.argv.slice(3, process.argv.length).join();
    if (!songName) { songName = "the sign ace of base" };
    console.log(songName);
    console.log("song");
    spotify
        .search({ type: 'track', query: songName })
        .then(function (response) {
            for (let i = 0; i < response.tracks.items.length; i++) {
                console.log("Artist: ", response.tracks.items[i].album.artists[0].name);
                console.log("Song: ", response.tracks.items[i].name);
                console.log("Album: ", response.tracks.items[i].album.name);
                console.log("Preview: ", response.tracks.items[i].preview_url);
            }
        })
        .catch(function (err) {
            console.log(err);
        });
};

function movie() {
    let movieName = process.argv.slice(3, process.argv.length).join();
    if (!movieName) { movieName = "mr nobody" };
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
