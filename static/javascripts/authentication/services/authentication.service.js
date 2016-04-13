/**
* Authentication
 * @namespace thinkster.authentication.services
 */
(function () {
    'use strict';

    angular
        .module('thinkster.authentication.services')
        .factory('Authentication', Authentication);

    Authentication.$inject = ['$cookies', '$http'];

    /**
     * @namespace Authentication
     * @returns {Factory}
     */
    function Authentication($cookies, $http) {
        /**
         * @name Authentication
         * @desc The Factory to be returned
         */
        var Authentication = {
            register:                   register,
            login:                      login,
            logout:                     logout,
            getAuthenticatedAccount:    getAuthenticatedAccount,
            isAuthenticated:            isAuthenticated,
            setAuthenticatedAccount:    setAuthenticatedAccount,
            unauthenticate:             unauthenticate
        };

        return Authentication;

        /////////////////////

        /**
         * @name logout
         * @desc Try to log the user out
         * @returns {Promise}
         * @memberOf thinkster.authentication.services.Authentication
         */
        function logout() {
            return $http.post('/api/v1/auth/logout/')
                .then(logoutSuccessFn, logoutErrorFn);
        }

        /**
         * @name logoutSuccessFn
         * @desc Unauthenticate and redirect to index with page reload
         * @param data {Object} Incoming data object from the logout API call
         * @param status {String} Incoming status from the logout API call
         * @param headers {Object} Incoming header object from the logout API call
         * @param config {Object} Incoming config object from the logout API call
         */
        function logoutSuccessFn(data, status, headers, config) {
            Authentication.unauthenticate();

            window.location = '/';
        }

        /**
         * @name logoutErrorFn
         * @desc Log the error to the console
         * @param data {Object} Incoming data object from the logout API call. Has the error.
         * @param status {String} Incoming status from the logout API call.
         * @param headers {Object} Incoming header object from the logout API call
         * @param config {Object} Incoming config object from the logout API call
         */
        function logoutErrorFn(data, status, headers, config) {
            console.error("There was an error logging out. Error: " + data);
        }

        /**
         * @name register
         * @desc Try to register a new user
         * @param {string} username The username entered by the user
         * @param {string} password The password entered by the user
         * @param {string} email The email entered by the user
         * @returns {Promise}
         * @memberOf thinkster.authentication.services.Authentication
         */
        function register(email, password, username) {
            return $http.post('/api/v1/accounts/', {
                username: username,
                password: password,
                email: email
            }).then(registerSuccessFn, registerErrorFn);
        }

        /**
         * @name registerSuccessFn
         * @desc Log the new user in
         * @param data {Object} Incoming data object from the register API call
         * @param status {String} Incoming status from the register API call
         * @param headers {Object} Incoming header object from the register API call
         * @param config {Object} Incoming config object from the register API call
         */
        function registerSuccessFn(data, status, headers, config) {
            Authentication.login(data.email, data.password);
        }

        /**
         * @name registerErrorFn
         * @desc Log the error to the console.
         * @param data {Object} Incoming data object from the register API call. Has the error
         * @param status {String} Incoming status from the register API call.
         * @param headers {Object} Incoming header object from the register API call
         * @param config {Object} Incoming config object from the register API call
         */
        function registerErrorFn(data, status, headers, config) {
            console.error("There was an error registering. Error: " + data);
        }

        /**
         * @name login
         * @desc Try to log in with email 'email' and password 'password'
         * @param email {string} The email entered by the user
         * @param password {string} The password entered by the user
         * @returns {Promise}
         * @memberOf thinkster.authentication.services.Authentication
         */
        function login(email, password) {
            return $http.post('api/v1/auth/login/', {
                email: email,
                password:password
            }).then(loginSuccessFn, loginErrorFn);
        }

        /**
         * @name loginSuccessFn
         * @desc Set the authenticated account and redirect to index
         * @param data {Object} incoming data object from the login API call
         * @param status {String} incoming status from the login API call
         * @param headers {Object} incoming header object from the login API call
         * @param config {Object} incoming config object from the login API call
         */
        function loginSuccessFn(data, status, headers, config) {
            Authentication.setAuthenticatedAccount(data.data);
            window.location = '/';
        }

        /**
         * @name loginErrorFn
         * @desc Log the error to the console.
         * @param data {Object} Incoming data object from the login API call. Will have the error
         * @param status {String} Incoming status from the login API call
         * @param headers {Object} incoming header object from the login API call
         * @param config {Object} incoming config object from the login API call
         */
        function loginErrorFn(data, status, headers, config) {
            console.error("There was an error logging in. Error: " + data);
        }

        /**
         * @name getAuthenticatedAccount
         * @desc Return the currently authenticated account
         * @returns {object|undefined} Account if authenticated, else 'undefined'
         * @memberOf thinkster.authentication.services.Authentication
         */
        function getAuthenticatedAccount() {
            if (!$cookies.authenticatedAccount) {
                return;
            }

            return JSON.parse($cookies.authenticatedAccount);
        }

        /**
         * @name isAuthenticated
         * @desc Check if the current user is authenticated
         * @returns {boolean} True if user is authenticated, else false.
         * @memberOf thinkster.authentication.services.Authentication
         */
        function isAuthenticated() {
            return !!$cookies.authenticatedAccount;
        }

        /**
         * @name setAuthenticatedAccount
         * @desc Stringify the account object and store it in a cookie
         * @param account {Object} The account object to be stored
         * @returns {undefined}
         * @memberOf thinkster.authentication.services.Authentication
         */
        function setAuthenticatedAccount(account) {
            $cookies.authenticatedAccount = JSON.stringify(account);
        }

        /**
         * @name unathenticate
         * @desc Delete the cookie where the user object is stored
         * @returns {undefined}
         * @memberOf thinkster.authentication.services.Authentication
         */
        function unauthenticate() {
            delete $cookies.authenticatedAccount;
        }
    }
})();