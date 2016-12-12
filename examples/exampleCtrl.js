
var example = angular.module('example', ['ngMaterial','ttcTchatRequesterModule']);

example.controller('ExampleCtrl', ['$scope','ttcTchatRequester', function ExampleCtrl($scope, ttcTchatRequester) {

    // init the service
    ttcTchatRequester.init({
        api_route:'http://91.134.241.60:3080/resources/tchatrequester/'
    });

    $scope.inputValue = "";


    $scope.onInputChange = function (input) {
        return ttcTchatRequester.complete(input);
    }

    $scope.submit = function (input) {
        this.inputValue = ttcTchatRequester.exec(input);

    }

}]);