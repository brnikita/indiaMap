'use strict';
angular.module('myApp.directives', []).directive('indiaMap', function () {
    return {
        scope: {
            states: '=',
            districts: '=',
            blocks: '=',
            statesColors: '=',
            districtsColors: '=',
            blocksColors: '=',
            statesTooltips: '=',
            districtsTooltips: '=',
            blockTooltips: '=',
            stateClickHandler: '=',
            districtClickHandler: '=',
            blockClickHandler: '='
        },
        link: function (scope, $element) {
            var htmlElement = $element[0],
                $svg = d3.select(htmlElement).append('svg'),
                width = 380,
                height = 460,
                bounds = [[68, 38], [97, 8]],
                projection = d3.geo.mercator().
                    scale(800).
                    translate([width / 2, height / 2]).
                    rotate([(bounds[0][0] + bounds[1][0]) / -2, (bounds[0][1] + bounds[1][1]) / -2]),
                path = d3.geo.path().projection(projection),
                $states = $svg.append('g'),
                $districts = $svg.append('g'),
                $blocks = $svg.append('g');

            function setMapSize() {
                var containerWidth = $(htmlElement).width();

                $svg.attr('preserveAspectRatio', 'xMidYMid')
                    .attr('viewBox', '0 0 ' + width + ' ' + height)
                    .attr('width', containerWidth + 'px')
                    .attr('height', containerWidth * height / width + 'px')
                    .style('width', containerWidth + 'px')
                    .style('height', containerWidth * height / width + 'px');
            }

            function zoom(xyz) {
                var duration = 750,
                    strokeWidth = 0.25 / xyz[2] + 'px',
                    transform = 'translate(' + projection.translate() + ')scale(' + xyz[2] + ')translate(-' + xyz[0] + ',-' + xyz[1] + ')';

                $states.transition()
                    .duration(duration)
                    .attr('transform', transform)
                    .selectAll('path')
                    .style('stroke-width', strokeWidth);

                $districts.transition()
                    .duration(duration)
                    .attr('transform', transform)
                    .selectAll('path')
                    .style('stroke-width', strokeWidth);

                $blocks.transition()
                    .duration(duration)
                    .attr('transform', transform)
                    .selectAll('path')
                    .style('stroke-width', strokeWidth);
            }

            function getCoordinates(element) {
                var bounds = path.bounds(element),
                    widthScale = (bounds[1][0] - bounds[0][0]) / width,
                    heightScale = (bounds[1][1] - bounds[0][1]) / height,
                    z = 0.9 * 0.75 / Math.max(widthScale, heightScale),
                    x = (bounds[1][0] + bounds[0][0]) / 2,
                    y = (bounds[1][1] + bounds[0][1]) / 2 + (height / z / 20);

                return [x, y, z];
            }

            function zoomDistrict(district) {
                var stateName = district.properties['NAME_1'],
                    state = getStateByName(stateName),
                    stateCoordinates;

                if (state === null) {
                    return;
                }

                stateCoordinates = getCoordinates(state);
                zoom(stateCoordinates);
            }

            function getStateByName(stateName) {
                var state = null,
                    states = scope.states;

                if (!angular.isArray(states)) {
                    return state;
                }

                angular.forEach(states, function (stateItem) {
                    var properties = stateItem.properties;

                    if (!angular.isDefined(properties['ENGTYPE_1'])) {
                        return;
                    }

                    if (properties.state === stateName) {
                        state = stateItem;
                    }
                });

                return state;
            }

            function stateClickHandler(state) {
                if (!angular.isDefined(state)) {
                    return;
                }

                if (angular.isFunction(scope.stateClickHandler)) {
                    scope.stateClickHandler(state);
                }
            }

            function districtClickHandler(district) {
                if (!angular.isDefined(district)) {
                    return;
                }

                if (angular.isFunction(scope.districtClickHandler)) {
                    scope.districtClickHandler(district);
                }

                zoomDistrict(district);
            }

            function blockClickHandler(block) {
                if (!angular.isDefined(block)) {
                    return;
                }

                if (angular.isFunction(scope.blockClickHandler)) {
                    scope.blockClickHandler(block);
                }
            }

            scope.$watch('states', function (states) {
                if (angular.isArray(states)) {
                    $states.selectAll('path')
                        .data(states)
                        .enter()
                        .append('path')
                        .attr('d', path)
                        .on('click', stateClickHandler);
                }
            });

            scope.$watch('districts', function (districts) {
                if (angular.isArray(districts)) {
                    $districts.selectAll('path')
                        .data(districts)
                        .enter()
                        .append('path')
                        .attr('d', path)
                        .on('click', districtClickHandler);
                }
            });

            scope.$watch('blocks', function (blocks) {
                if (angular.isArray(blocks)) {
                    $blocks.selectAll('path')
                        .data(states)
                        .enter()
                        .append('path')
                        .attr('d', path)
                        .on('click', blockClickHandler);
                }
            });

            setMapSize();
        }
    }
});
