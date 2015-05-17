/**
* myApp Module
*
* Vincent Website
*/
app = angular.module('myApp', ['ngRoute','ngSanitize']);
app.controller('mainController', ['$scope','$http', '$q', function ($scope, $http, $q) {

	$scope.murders = $scope.assaults = $scope.rapes = [];
	$scope.beatName = "";
	$scope.week = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
	var data = [];
	var mapOptions = {
		zoom: 12,
		center: new google.maps.LatLng(29.7604, -95.3698),
		mapTypeId: google.maps.MapTypeId.ROADMAP
	}



	$scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);
	/* Setup InputField*/
	var inputDiv = document.getElementById('searchDiv');
	var input = document.getElementById('pac-input');

	// Set InputField inside of Map
	$scope.map.controls[google.maps.ControlPosition.TOP_LEFT].push(inputDiv);
	var searchBox = new google.maps.places.SearchBox(input);

	var infoWindow = new google.maps.InfoWindow();
	$scope.map.data.loadGeoJson('js/beats.geojson');

	google.maps.event.addListener(searchBox, 'places_changed', function() {

		// Get Coordinates
		var places = searchBox.getPlaces();

		if (places.length == 0) return;

		// Clear out markers Array
		markers = [];

		var bounds = new google.maps.LatLngBounds();
		for (var i = 0, place; place = places[i]; i++) {

			// Set image if important
			var image = {
				url: place.icon,
				size: new google.maps.Size(71, 71),
				origin: new google.maps.Point(0, 0),
				anchor: new google.maps.Point(17, 34),
				scaledSize: new google.maps.Size(25, 25)
			};

			// Set Marker
			var marker = new google.maps.Marker({
				map: $scope.map,
				icon: image,
				animation: google.maps.Animation.DROP,
				title: place.name || input.value,
				position: place.geometry.location
			});

			// Add marker to markers Array
			markers.push(marker);

			// Change bounds of Map to marker
			bounds.extend(place.geometry.location);

			// Add Listener to marker
			google.maps.event.addListener(marker, 'click', function() {
				infoWindow = InfoWindow(marker.title);
				infoWindow.open($scope.map, marker);

			// Close Marker after 3 seconds
			setTimeout(function() {
				infoWindow.close();
			}, 3000);
		});
		}

		// Update map's bounds
		$scope.map.fitBounds(bounds);
	});
	//Add styles to Polygons
	$scope.map.data.setStyle(function(feature) {
		var fill = feature.getProperty('fill');
		var stroke = feature.getProperty('stroke');
		return {
			fillColor: '#FF0000',
			strokeColor: stroke
		};
	});

	$scope.map.data.addListener('mouseover', function(event) {
		$scope.map.data.overrideStyle(event.feature, {
			strokeWeight: 2.0,
			fillColor: 'green'
		});
	});

	$scope.map.data.addListener('mouseout', function(event) {
		$scope.map.data.overrideStyle(event.feature, {
			fillColor: '#FF0000'
		});
	});

	//display beat information
	$scope.map.data.addListener('click', function(event) {
		$scope.$apply(function () {
			getData();
			beat = event.feature.A.name.toUpperCase();
			var beatData = getBeatData(beat);

			$scope.beatName = beat;
			$scope.murders = beatData.murders;
			$scope.assaults = beatData.assaults;
			$scope.rapes = beatData.assaults;
		});
		console.log($scope.beatName);


	});

	var getData = function() {
		var deferred = $q.defer();
		if (data.length) {
			deferred.resolve(data);
		} else {
			$http.get('js/future.json').success(function(d) {
				data = d;
				deferred.resolve(data);
				console.log(data);
			});
		}
		return deferred.promise;
	};
	var getBeatData = function(_beat){
		return data[_beat];
	};

	///* Setup InfoWindow */
	var InfoWindow = function(content) {
        //Create InfoWindow
        var iWindow = new google.maps.InfoWindow({
        	content: 'The title of this marker is ' + content+ 'a maxWidth of 100 and it closes in 3 seconds',
        	maxWidth: 100
        });

        return iWindow;
    };

    getData();
}]);

app.directive('sideBar', function(){
	return {
		restrict: 'E',
		controller: 'mainController',
		templateUrl: './partials/sideBar.tpl.html'
	};
});


