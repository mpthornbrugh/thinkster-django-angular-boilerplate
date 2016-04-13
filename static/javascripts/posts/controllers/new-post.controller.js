(function () {
    'use strict';

    angular
        .module('thinkster.posts.controllers')
        .controller('NewPostController', NewPostController);

    NewPostController.$inject = ['$rootScope', '$scope', 'Authentication', 'Snackbar', 'Posts'];

    function NewPostController($rootScope, $scope, Authentication, Snackbar, Posts) {
        var vm = this;

        vm.submit = submit;

        ////////////////////////

        /**
         * @name submit
         * @desc Create a new Post
         * @memberOf thinkster.posts.controllers.NewPostController
         */
        function submit() {
            $rootScope.$broadcast('post.created', {
                content: vm.content,
                author: {
                    username: Authentication.getAuthenticatedAccount().username
                }
            });

            $scope.closeThisDialog();

            Posts.create(vm.content).then(createPostSuccessFn, createPostErrorFn);

            /**
             * @name createPostSuccessFn
             * @desc Show snackbar with success message
             */
            function createPostSuccessFn(data, status, headers, config) {
                Snackbar.show('Success! Post created.');
            }

            /**
             * @name createPostErrorFn
             * @desc Propogate error event and show a snackbar error message
             * @param data {Object} The data object passed from the post create function. Contains the error
             */
            function createPostErrorFn(data, status, headers, config) {
                $rootScope.$broadcast('post.created.error');
                Snackbar.error(data.error);
            }
        }
    }
})();