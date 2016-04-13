/**
 * Posts
 * @namespace thinkster.posts.services
 */
(function () {
    'use strict';

    angular
        .module('thinkster.posts.services')
        .factory('Posts', Posts);

    Posts.$inject = ['$http'];

    /**
     * @namespace Posts
     * @returns {Factory}
     * @param $http {Dependency}
     */
    function Posts($http) {
        var Posts = {
            all: all,
            create: create,
            get: get
        };

        return Posts;

        ////////////////////

        /**
         * @name all
         * @desc Get all posts
         * @returns {Promise}
         * @memberOf thinkster.posts.services.Posts
         */
        function all() {
            return $http.get('api/v1/posts/');
        }

        /**
         * @name create
         * @desc Create a new Post
         * @param content {String} The content of the new Post
         * @returns {Promise}
         * @memberOf thinkster.posts.services.Posts
         */
        function create(content) {
            return $http.post('/api/v1/posts/', {
                content: content
            });
        }

        /**
         * @name get
         * @desc Get the posts of a given user
         * @param username {String} The username to get posts for
         * @returns {Promise}
         * @memberOf thinkster.posts.services.Posts
         */
        function get(username) {
            return $http.get('/api/v1/accounts/' + username + '/posts/');
        }
    }
})();