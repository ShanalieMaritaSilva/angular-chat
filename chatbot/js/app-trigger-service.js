angular.module('appTriggerFactory', []).factory('AppTriggerFactory', function($timeout, $http) {
    var dirs = {
        fetch: function() {
            return $timeout(function() {
                return $http.get('chatbot/config/app-triggers.json').then(function(response) {
                    return response.data;
                });
            }, 30);
        }
    }

    return dirs;
});
