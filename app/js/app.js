/**
 * myApp Module
 *
 * Vincent Website
 */
 app = angular.module('myApp', ['ngRoute','ui.bootstrap']);
 app.controller('mainController', ['$scope', '$http', '$q', '$modal', function($scope, $http, $q, $modal) {

 	$scope.beatName = "";
 	$scope.enableSideBar = true;
 	$scope.week = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
 	var data = [];
 	var mapOptions = {
 		zoom: 12,
 		center: new google.maps.LatLng(29.7604, -95.3698),
 		mapTypeId: google.maps.MapTypeId.ROADMAP
 	}

    $scope.open = function (size) {

        var modalInstance = $modal.open({
          animation: true,
          templateUrl: 'myModalContent.html',
          controller: 'ModalInstanceCtrl',
          size: 'lg',
          resolve: {
            items: function () {
              return $scope.items;
          }
      }
  });

        modalInstance.result.then(function (selectedItem) {
          $scope.selected = selectedItem;
      }, function () {
          console.log('Modal dismissed at: ' + new Date());
      });
    };

    $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);
    
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


    	$scope.$apply(function() {
    		if($scope.enableSideBar) {
    			$scope.openSB = true;
    		}

    		getData();
    		beat = event.feature.A.name.toUpperCase();
    		$scope.beatName = beat;
    		$scope.crimes = getBeatData(beat);
    	});

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

    $scope.map.data.addListener('rightclick', function(event) {
    	$scope.$apply(function() {
    		if ($scope.enableSideBar) {
    			$scope.openSB = false;
    			$scope.enableSideBar = false;
    		} else {
    			$scope.enableSideBar = true;
    		}
    	});


    });

    //display beat information
    $scope.map.data.addListener('click', function(event) {
    	$scope.$apply(function() {
    		$scope.openSB = false;
    	});
    });

    var getData = function() {
    	var deferred = $q.defer();
    	if (data.length) {
    		deferred.resolve(data);
    	} else {
    		$http.get('js/future.json').success(function(d) {
    			data = d;
    			deferred.resolve(data);
    		});
    	}
    	return deferred.promise;
    };
    var getBeatData = function(_beat) {
    	return data[_beat];
    };

    ///* Setup InfoWindow */
    var InfoWindow = function(content) {
        //Create InfoWindow
        var iWindow = new google.maps.InfoWindow({
        	content: 'The title of this marker is ' + content + 'a maxWidth of 100 and it closes in 3 seconds',
        	maxWidth: 100
        });

        return iWindow;
    };

    getData();
}]);

app.controller('ModalInstanceCtrl', function ($scope, $modalInstance, items) {

  $scope.items = items;
  $scope.selected = {

  };

  $scope.ok = function () {
    $modalInstance.close($scope.selected.item);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});
app.directive('sideBar', function() {
	return {
		restrict: 'E',
		controller: 'mainController',
		templateUrl: './partials/sideBar.tpl.html'
	};
});
