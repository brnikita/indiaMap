'use strict';
angular.module('myApp.directives', []).directive('indiaMap', function () {
    return {
        scope: {
            districts: '=',
            states: '=',
            districtsColors: '=',
            showTooltips: '='
        },
        templateUrl: 'templates/india-map.html',
        link: function (scope, $element) {
            var width = 380,
                height = 460,
                bounds = [
                    [68, 38],
                    [97, 8]
                ],
                projection = d3.geo.mercator().
                    scale(800).
                    translate([width / 2, height / 2]).
                    rotate([(bounds[0][0] + bounds[1][0]) / -2, (bounds[0][1] + bounds[1][1]) / -2]),
                path = d3.geo.path().projection(projection),
                $states = $('.js-map-states'),
                $districts = $('.js-map-districts'),
                $blocks = $('.js-map-blocks');

            scope.$watch('districts', function (districts) {
                $districts.selectAll("path")
                    .data(districts)
                    .enter()
                    .append("path")
                    .attr("d", path);
            });

            scope.$watch('states', function () {
                console.log(arguments);
            });
        }
    }
});
