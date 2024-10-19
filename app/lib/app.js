let pennyWiseApp = angular.module("pennyWiseApp", ["ngRoute"]);

pennyWiseApp.config([
  "$routeProvider",
  function ($routeProvider) {
    $routeProvider
      .when("/home", {
        templateUrl: "views/home.html",
      })
      .when("/bills", {
        templateUrl: "views/billsInput.html",
      })
      .otherwise({ redirectTo: "/home" });
  },
]);

// STATE CONTROLLER
pennyWiseApp.controller("IncomeController", [
  "$scope",
  "$http",
  function ($scope, $http) {
    $http.get("../../data/statesData.json").then( (response) => {
        $scope.states = response.data
    })


    $scope.addIncome = function () {
      console.log("Adding income for state:", $scope.selectedState);

    };

    $http.get("../../data/incomeData.json").then(function (response) {
      $scope.income = response.data;
      console.log($scope.income);
    });
  },
]);

// BILL CONTROLLER
pennyWiseApp.controller("BillController", [
  "$scope",
  "$http",
  function ($scope, $http) {
    // Get JSON Data
    $http.get("../../data/billData.json").then(function (response) {
      $scope.bills = response.data;
    });

    // Add bill functionality
    $scope.addBill = function () {
      $scope.bills.push({
        name: $scope.newBill.name,
        dollarAmount: parseInt(Math.ceil($scope.newBill.dollarAmount)),
      });
      //   reset inputs back to an empty string so user does not have to backspace out old entry after sumbit
      $scope.newBill = { name: "", dollarAmount: "" };
    };

    // remove listed bill functionality
    $scope.removeBill = (bill) => {
        let removedBill = $scope.bills.indexOf(bill)
        console.log(removedBill)
        $scope.bills.splice(removedBill, 1)
    }
  },
]);

pennyWiseApp.controller("BudgetController"['$scope', ($scope) => {

}])
