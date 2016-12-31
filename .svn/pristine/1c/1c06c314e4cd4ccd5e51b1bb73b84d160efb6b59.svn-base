angular.module('varFactory', []).factory('VarFactory', function($timeout, $http) {
    var Webtest = {
        fetch: function() {
            return $timeout(function() {
                return $http.get('chatbot/config/vars.json').then(function(response) {
                    return response.data;
                });
            }, 30);
        }
    }

    return Webtest;
});