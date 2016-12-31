angular.module('dirFactory', []).factory('DirFactory', function($timeout, $http) {
    var dirs = {
        fetch: function() {
            return $timeout(function() {
                return $http.get('chatbot/config/dirs.json').then(function(response) {
                    return response.data;
                });
            }, 30);
        }
    }

    return dirs;
});