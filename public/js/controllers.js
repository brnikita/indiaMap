'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
    controller('AppCtrl', function ($scope, $http) {
        function getStates(data) {
            var states = [];

            angular.forEach(data, function (item) {
                if (item.properties['ENGTYPE_1']) {
                    states.push(item);
                }
            });

            return states;
        }

        function getDistricts(data) {
            var districts = [];

            angular.forEach(data, function (item) {
                if (item.properties['ENGTYPE_2']) {
                    districts.push(item);
                }
            });

            return districts;
        }

        $http({
            method: 'GET',
            url: 'states.json'
        }).
            success(function (data) {
                $scope.states = getStates(data);
            });
        $http({
            method: 'GET',
            url: 'districts.json'
        }).
            success(function (data) {
                $scope.districts = getDistricts(data);
            });

        $scope.districtsColors = 'green';

    });
