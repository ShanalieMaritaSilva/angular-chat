/**
 * AngularJS Tutorial 1
 * @author Nick Kaye <nick.c.kaye@gmail.com>
 */

/**
 * Main AngularJS Web Application
 */
var app = angular.module('tutorialWebApp', [ 'ngRoute', 'chatbox', 'ngAnimate', 'luegg.directives', 'dirFactory', 'varFactory', 'botTriggerFactory', 'appTriggerFactory', 'configFactory']);



/**
 * Configure the Routes
 */
app.config(['$routeProvider', function ($routeProvider) {
  $routeProvider
    // Home
    .when("/", {templateUrl: "partials/home.html", controller: "PageCtrl"})
    // Pages
    .when("/about", {templateUrl: "partials/about.html", controller: "PageCtrl"})
    .when("/faq", {templateUrl: "partials/faq.html", controller: "PageCtrl"})
    .when("/pricing", {templateUrl: "partials/pricing.html", controller: "PageCtrl"})
    .when("/services", {templateUrl: "partials/services.html", controller: "PageCtrl"})
    .when("/contact", {templateUrl: "partials/contact.html", controller: "PageCtrl"})
    // Blog
    .when("/blog", {templateUrl: "partials/blog.html", controller: "BlogCtrl"})
    .when("/blog/post", {templateUrl: "partials/blog_item.html", controller: "BlogCtrl"})
    // else 404
    .otherwise("/404", {templateUrl: "partials/404.html", controller: "PageCtrl"});
}]);

/**
 * Controls the Blog
 */
app.controller('BlogCtrl', function (/* $scope, $location, $http */) {
  console.log("Blog Controller reporting for duty.");
});

/**
 * Controls all other Pages
 */
app.controller('PageCtrl', function (/* $scope, $location, $http */) {
  console.log("Page Controller reporting for duty.");

  // Activates the Carousel
  $('.carousel').carousel({
    interval: 5000
  });

  // Activates Tooltips for Social Links
  $('.tooltip-social').tooltip({
    selector: "a[data-toggle=tooltip]"
  })
});

app.controller('MainCtrl', ['$scope', '$rootScope' , 'AppTriggerFactory', function ($scope, $rootScope, AppTriggerFactory) {

  //Fetch your app triggers  here
  /*AppTriggerFactory.fetch().then(function(data) {
    console.log("[APPConsole] AppTriggerFactory.fetch: Loading app triggers");
    console.log("[APPConsole] AppTriggerFactory.fetch: Data");
    console.log(data);
    $rootScope.appTriggers = data.appTriggers;
  });*/

  /*//Handle app triggers here
  $rootScope.$on('appTrigger', function(event, e) {
    console.log("sdasdasdsadsa");
    ($rootScope.appTriggers).forEach(function(obj) {
        if(e == obj.ID){
          console.log("fuck me an dto[APPConsole] $rootScope.$on: Executing app trigger action for " + obj.ID);
          eval(obj.action);
        }
    });
  });*/

}]);


//Handle your events in app.run
app.run(['$rootScope' , 'AppTriggerFactory', function($rootScope, AppTriggerFactory) {

  //Fetch your app triggers  here
  AppTriggerFactory.fetch().then(function(data) {
    console.log("[APPConsole] AppTriggerFactory.fetch: Loading app triggers");
    console.log("[APPConsole] AppTriggerFactory.fetch: Data");
    console.log(data);
    $rootScope.appTriggers = data.appTriggers;
  });

  //Handle app triggers here
  $rootScope.$on('appTrigger', function(event, e) {
    console.log("[APPConsole] AppTriggerFactory.fetch: App trigger detected");
    ($rootScope.appTriggers).forEach(function(obj) {
        if(e == obj.ID){
          console.log("[APPConsole] $rootScope.$on: Executing app trigger action for " + obj.ID);
          eval(obj.action);
        }
    });
  });

}]);
