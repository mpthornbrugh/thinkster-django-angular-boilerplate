/**
 * PostsController
 * @namespace thinkster.posts.controllers
 */
(function () {
    'use strict';

    angular
        .module('thinkster.posts.controllers')
        .controller('PostsController', PostsController);

    PostsController.$inject = ['$scope'];

    function PostsController($scope) {
        var vm = this;

        vm.columns = [];

        activate();

        /**
         * @name activate
         * @desc Actions to be performed when this controller is instantiated
         * @memberOf thinkster.posts.controllers.PostsController
         */
        function activate() {
            $scope.$watchCollection(function () { return $scope.posts; }, render);
            $scope.$watch(function () { return $(window).width(); }, render);
        }

        /**
         * @name calculateNumberOfColumns
         * @desc Calculate number of columns based on screen width
         * @returns {number} The number of columns containing Posts
         * @memberOf thinkster.posts.controllers.PostsController
         */
        function calculateNumberOfColumns() {
            var width = $(window).width();

            if (width >= 1200) {
                return 4;
            }
            else if (width >= 992) {
                return 3;
            }
            else if (width >= 768) {
                return 2;
            }
            else {
                return 1;
            }
        }

        /**
         * @name approximateShortestColumn
         * @desc An algorithm for approximating which column is shortest
         * @returns {number} The index of the shortest column
         * @memberOf thinkster.posts.controllers.PostsController
         */
        function approximateShortestColumn() {
            var scores = vm.columns.map(columnMapFn);

            return scores.indexOf(Math.min.apply(this, scores));

            /**
             * @name columnMapFn
             * @desc A map funcion for scoring column heights
             * @param column {object} The column that needs to be mapped
             * @returns {number} The approximately normalized height of a given column
             */
            function columnMapFn(column) {
                var lengths = column.map(function (element) {
                    return element.content.length;
                });

                return lengths.reduce(sum, 0) * column.length;
            }

            /**
             * @name sum
             * @desc Sums two numbers
             * @param m {Number} The first number to be summed
             * @param n {Number} The second number to be summed
             * @returns {Number} The sum of two numbers
             */
            function sum(m, n) {
                return m + n;
            }
        }

        /**
         * @name render
         * @desc Renders Posts into columns of approximately equal height
         * @param current {Array} The current value of vm.posts
         * @param original {Array} The value of vm.posts before it was updated
         * @memberOf thinkster.posts.controllers.PostsController
         */
        function render(current, original) {
            if (current !== original) {
                vm.columns = [];

                for (var i = 0; i < calculateNumberOfColumns(); ++i) {
                    vm.columns.push([]);
                }

                for (var i = 0; i < current.length; ++i) {
                    var column = approximateShortestColumn();

                    vm.columns[column].push(current[i]);
                }
            }
        }
    }
})();