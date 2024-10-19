let pennyWiseApp = angular.module("pennyWiseApp", ["ngRoute"]);

pennyWiseApp.config([
  "$routeProvider",
  function ($routeProvider) {
    $routeProvider
      .when("/home", {
        templateUrl: "views/home.html",
      })
      .otherwise({ redirectTo: "/home" });
  },
]);
