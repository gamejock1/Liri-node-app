

require("dotenv").config();
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var omdb = require('omdb');
var request = require("request");
var fs = require("fs");
var keys = require("./keys.js");


var arg = process.argv;
var argString = '';
for (let i = 3; i < arg.length; i++) {
  argString += arg[i] + "+";
};

let omdbcall = () => {
  request("http://www.omdbapi.com/?t=" + argString + "&y=&plot=short&apikey=6deb4006", (error, response, body) => {
    if (!error && response.statusCode === 200) {
      var jsonData = JSON.parse(body);
      console.log("Title: " + jsonData.Title);
      console.log("Year: " + jsonData.Year);
      console.log("Rated: " + jsonData.Rated);
      console.log("IMDB Rating: " + jsonData.imdbRating);
      console.log("Country: " + jsonData.Country);
      console.log("Language: " + jsonData.Language);
      console.log("Plot: " + jsonData.Plot);
      console.log("Actors: " + jsonData.Actors);
      console.log("Rotten Tomatoes Rating: " + jsonData.Ratings[1].Value);
    }
  });
};

let getTweets = () => {
  var client = new Twitter(keys.twitter);
  var params = {
    screen_name: "YeagerThomas"
  };

  client.get("statuses/user_timeline", params, (error, tweets, response) => {
    if (!error) {
      for (var i = 0; i < tweets.length; i++) {
        console.log(tweets[i].created_at);
        console.log("");
        console.log(tweets[i].text);
      }
    }
  });
};

let spotifyCall = (argString) => {
  var spotify = new Spotify(keys.spotify);
  if (argString === '') {
    argString = "The Sign Ace of Base";
  };
  spotify.search(
    {
      type: "track",
      query: argString
    },
    (err, data) => {
      if (err) {
        console.log("Error occurred: " + err);
        return;
      }
      var songs = data.tracks.items;
      for (var i = 0; i < songs.length; i++) {
        console.log(i);
        // console.log("artist(s): " + songs[i].artists.name);
        console.log("song name: " + songs[i].name);
        console.log("preview song: " + songs[i].preview_url);
        console.log("album: " + songs[i].album.name);
        console.log("=========");
      }
    });
};

let songDefault = () => {
  fs.readFile("random.txt", "utf8", function (error, data) {
    if (error) {
      return console.log(error);
    }
    console.log(data);
    var dataArr = data.split(",");
    console.log(dataArr);
    spotifyCall(dataArr[1]);
  });
};

if (process.argv[2] === "movie-this") {
  omdbcall();
};

if (process.argv[2] === "spotify-this-song") {
  spotifyCall(argString);
};

if (process.argv[2] === "my-tweets") {
  getTweets();
};

if (process.argv[2] === "do-what-it-says") {
  songDefault();
};