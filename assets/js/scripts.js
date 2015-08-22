$(document).ready(function() { /* google maps ----*/

    // Set global Variables
    var map, markers = [];

    var data, beatDisplay = $(".beat-name");

    $.getJSON("../assets/js/future.json", function(d) {
        data = d;
    })

    var displayBeatData = function(event) {
        var beatName = event.feature.G.name.toUpperCase()
        beatDisplay.html(beatName)
        if (data != null) {
            if (beatName in data) {
                var i, arr = data[beatName];
                for (i = 0; i < 7; ++i) {
                    var crimeVar = ".crime-" + i.toString()
                    $(crimeVar).html(arr[i])
                }
            } else {
                for (i = 0; i < 7; ++i) {
                    var crimeVar = ".crime-" + i.toString()
                    $(crimeVar).html("")
                }
            }
        }
    }

    var initialize = function() {

        var houstonLocation = new google.maps.LatLng(29.757150, -95.363903);


        /* Setup initial configuration */
        map = new google.maps.Map(document.getElementById('map-canvas'), {
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            zoom: 11,
            center: houstonLocation
        });

        map.data.loadGeoJson('../assets/js/beats.geojson');
        map.data.setStyle(function(feature) {
            var fill = feature.getProperty('fill');
            var stroke = feature.getProperty('stroke');
            return {
                fillColor: '#FF0000',
                strokeColor: stroke
            };
        });
        map.data.addListener('click', displayBeatData);



        map.data.addListener('mouseover', function(event) {
            map.data.overrideStyle(event.feature, {
                strokeWeight: 2.0,
                fillColor: 'green'
            });
        });

        map.data.addListener('mouseout', function(event) {
            map.data.overrideStyle(event.feature, {
                fillColor: '#FF0000'
            });
        });
    };

    ///* Setup InfoWindow */
    var InfoWindow = function(content) {
        //Create InfoWindow
        var iWindow = new google.maps.InfoWindow({
            content: setDummyText(content),
            maxWidth: 100
        });

        return iWindow;
    };

    ///* Setup Dummy Text for infoWindow */
    var setDummyText = function(title) {
        var str = 'The title of this marker is ' + title + 'a maxWidth of 100 and it closes in 3 seconds';
        return str;
    };

    /* Wait till initialize() finishes */
    google.maps.event.addDomListener(window, 'load', initialize);
}); /* end google maps -----------------------*/
