require("dotenv").config();
var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);
const concert = "concert-this"
const song = "spotify-this-song"
const movie = "movie-this"
const action = "do-what-it-says"