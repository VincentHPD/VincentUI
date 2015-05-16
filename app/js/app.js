/**
* myApp Module
*
* Fabians Personal Website
*/
app = angular.module('myApp', ['ngRoute','ngSanitize']);
app.controller('mainController', ['$scope', function($scope){

}]);



app.directive('sideBar', function(){
	return {
		restrict: 'E',
		controller: 'mainController',
		templateUrl: './partials/sideBar.tpl.html',
	};
});







