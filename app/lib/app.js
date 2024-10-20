let pennyWiseApp = angular.module("pennyWiseApp", ["ngRoute"]);

pennyWiseApp.config([
  "$routeProvider",
  ($routeProvider) => {
    $routeProvider
      .when("/income", {
        templateUrl: "views/income.html",
      })
      .when("/bills", {
        templateUrl: "views/billsInput.html",
      })
      .when("/budget", {
        templateUrl: "views/budget.html"
      })
      .otherwise({ redirectTo: "/home" });
  },
]);

// INCOME CONTROLLER
pennyWiseApp.controller("IncomeController", [
  "$scope",
  "$http",
  "$window",
  "$location",
  ($scope, $http, $window, $location) => {
    $http.get("../../data/statesData.json").then((response) => {
      $scope.states = response.data;
    });

    $scope.newIncome;
    $scope.income = 0;
    $scope.postTaxIncome = 0;

    $scope.addIncome = () => {
      $scope.income = $scope.newIncome;
      $scope.postTaxIncome = $scope.income - $scope.income * 0.22;
      // Store in local storage
      $window.localStorage.setItem("postTaxIncome", JSON.stringify($scope.postTaxIncome));      
      $location.path("/bills")
    };


    $scope.$watch("newIncome", function (newValue, oldValue) {
      if (newValue !== oldValue) {
        $scope.postTaxIncome = newValue - newValue * 0.22;
      }
    });

  },
]);

// BILL CONTROLLER
pennyWiseApp.controller("BillController", [
  "$scope",
  "$http",
  "$window",
  ($scope, $http, $window) => {

    $scope.postTaxIncome = JSON.parse($window.localStorage.getItem("postTaxIncome")) || 0;

    // Get JSON Data
    $http.get("../../data/billData.json").then((response) => {
      $scope.bills = response.data;
    });

    // Add bill functionality
    $scope.addBill = () => {
        // Check if both fields are filled
        if (!$scope.newBill.name || !$scope.newBill.dollarAmount) {
            $scope.errorMessage = "Both fields are required!";
            return; // Exit the function early
        } else $scope.errorMessage = ""
    
        // Clear any previous error message
        $scope.formError = "";
    
        // Add the bill
        $scope.bills.push({
            name: $scope.newBill.name,
            dollarAmount: parseInt(Math.ceil($scope.newBill.dollarAmount)),
        });
    
        // Reset inputs
        $scope.newBill = { name: "", dollarAmount: "" };
    
    };

    // remove listed bill functionality
    $scope.removeBill = (bill) => {
      let removedBill = $scope.bills.indexOf(bill);
      console.log(removedBill);
      $scope.bills.splice(removedBill, 1);
    };

    $scope.$watch(function() {
        return $window.localStorage.getItem('postTaxIncome');
    }, function(newValue) {
        $scope.postTaxIncome = parseFloat(newValue) || 0;
        // Recalculate percentages or update view as needed
    });
  },
]);

pennyWiseApp.controller("BudgetController"[("$scope", ($scope) => {})]);
