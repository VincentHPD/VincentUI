var fs = require('fs');


var crimes = JSON.parse(fs.readFileSync("app/js/future.json", "UTF-8"))["crimes"];
var beats = {};
for (var i = crimes.length - 1; i >= 0; i--) {
    var beat = crimes[i]["beat"];
    if (beats[beat] == null)
        beats[beat] = []
    beats[beat].push(crimes[i]["type"]);
};
fs.writeFile("app/js/future.json", JSON.stringify(beats), "UTF-8");
