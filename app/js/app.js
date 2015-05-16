/**
* myApp Module
*
* Vincent Website
*/
app = angular.module('myApp', ['ngRoute','ngSanitize']);
app.controller('mainController', ['$scope', function ($scope) {

    var mapOptions = {
        zoom: 12,
        center: new google.maps.LatLng(29.7604, -95.3698),
        mapTypeId: google.maps.MapTypeId.TERRAIN
    }

    $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);
            /* Setup InputField*/
        var inputDiv = document.getElementById('searchDiv');
        var input = document.getElementById('pac-input');

        // Set InputField inside of Map
        $scope.map.controls[google.maps.ControlPosition.TOP_LEFT].push(inputDiv);
        var searchBox = new google.maps.places.SearchBox(input);
    $scope.markers = [];

    var infoWindow = new google.maps.InfoWindow();
    $scope.map.data.loadGeoJson('js/beats.geojson');

    var createMarker = function (info){

        var marker = new google.maps.Marker({
            map: $scope.map,
            position: new google.maps.LatLng(info.lat, info.long),
            title: info.city
        });
        marker.content = '<div class="infoWindowContent">' + info.desc + '</div>';

        google.maps.event.addListener(marker, 'click', function(){
            infoWindow.setContent('<h2>' + marker.title + '</h2>' + marker.content);
            infoWindow.open($scope.map, marker);
        });

        $scope.markers.push(marker);

    }

    $scope.openInfoWindow = function(e, selectedMarker){
        e.preventDefault();
        google.maps.event.trigger(selectedMarker, 'click');
    }

}]);



app.directive('sideBar', function(){
	return {
		restrict: 'E',
		controller: 'mainController',
		templateUrl: './partials/sideBar.tpl.html',
	};
});







