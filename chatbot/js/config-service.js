angular.module('configFactory', []).factory('ConfigFactory', function($timeout, $http) {
    var dirs = {
        fetch: function() {
            return $timeout(function() {
                return $http.get('chatbot/config/config.json').then(function(response) {
                    return response.data;
                });
            }, 30);
        }
    }

    return dirs;
});
