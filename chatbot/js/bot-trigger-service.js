angular.module('botTriggerFactory', []).factory('BotTriggerFactory', function($timeout, $http) {
    var dirs = {
        fetch: function() {
            return $timeout(function() {
                return $http.get('chatbot/config/bot-triggers.json').then(function(response) {
                    return response.data;
                });
            }, 30);
        }
    }

    return dirs;
});
