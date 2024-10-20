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
        templateUrl: "views/budget.html",
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
      $window.localStorage.setItem(
        "postTaxIncome",
        JSON.stringify($scope.postTaxIncome)
      );
      $location.path("/bills");
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
  "$location",
  ($scope, $http, $window, $location) => {
    $scope.postTaxIncome =
      JSON.parse($window.localStorage.getItem("postTaxIncome")) || 0;

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
      } else $scope.errorMessage = "";

      // Clear any previous error message
      $scope.formError = "";

      // calculate percentage
      let billAmount = parseInt(Math.ceil($scope.newBill.dollarAmount));
      let billPercentage = (
        (billAmount / ($scope.postTaxIncome / 12)) *
        100
      ).toFixed(2);

      // Add the bill
      $scope.bills.push({
        name: $scope.newBill.name,
        dollarAmount: billAmount,
        // percentage: billPercentage,
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

    $scope.$watch(
      function () {
        return $window.localStorage.getItem("postTaxIncome");
      },
      function (newValue) {
        $scope.postTaxIncome = parseFloat(newValue) || 0;
        // Recalculate percentages or update view as needed
      }
    );

    // finished btn functionality need to grab totals of all bill items and either store total in local storage or indivual key and totals. Easier and better for device storage just to store total
    $scope.finished = () => {
        let totalAmountOfBills = 0
        $scope.bills.map((bill) => {
            totalAmountOfBills += bill.dollarAmount
        })
        console.log(totalAmountOfBills)
        $window.localStorage.setItem('totalAmountOfBills', JSON.stringify(totalAmountOfBills))
        $location.path('/budget')
    }
  },
]);

pennyWiseApp.controller(
  "BudgetController"[("$scope", "$window", ($scope, $window) => {})]
);
