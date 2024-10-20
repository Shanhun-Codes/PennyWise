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
    $scope.totalAmountOfBills = 0; // Initialize on the $scope

    $scope.finished = () => {
      $scope.totalAmountOfBills = $scope.bills.reduce((total, bill) => {
        return total + (parseFloat(bill.dollarAmount) || 0);
      }, 0);

      console.log($scope.totalAmountOfBills);
      $window.localStorage.setItem(
        "totalAmountOfBills",
        JSON.stringify($scope.totalAmountOfBills)
      );
      $location.path("/budget");
    };

    // When the controller initializes, retrieve the stored value
    $scope.totalAmountOfBills =
      JSON.parse($window.localStorage.getItem("totalAmountOfBills")) || 0;
  },
]);

pennyWiseApp.controller("BudgetController", [
  "$scope",
  "$window",
  ($scope, $window) => {
    // get bills total and posttax income from local storage
    $scope.postTaxIncome =
      JSON.parse($window.localStorage.getItem("postTaxIncome")) || 0;
    $scope.totalAmountOfBills =
      JSON.parse($window.localStorage.getItem("totalAmountOfBills")) || 0;
    $scope.remainingSalary =
      $scope.postTaxIncome - $scope.totalAmountOfBills * 12;
    console.log($scope.remainingSalary);

    // set variables for pay frequency
    $scope.payFrequencies = ["Monthly", "Semimonthly", "Biweekly", "Weekly"];

    $scope.selectedPayFrequency = "";
    $scope.frequencyMessage = "";
    $scope.billTransfer = 0;
    $scope.weeklyMessage = ""

    // watch for change in frequency
    $scope.$watch("selectedPayFrequency", (newValue, oldValue) => {
      if (newValue !== oldValue) $scope.selectedPayFrequency = newValue;
      console.log($scope.selectedPayFrequency);

      //   frequency logic
      switch (newValue) {
        case "Monthly":
          $scope.billTransfer = $scope.totalAmountOfBills;
          break;
        case "Semimonthly":
          $scope.billTransfer = $scope.totalAmountOfBills / 2;
          break;
        case "Biweekly":
          $scope.billTransfer = ($scope.totalAmountOfBills * 12) / 26;
          break;
        case "Weekly":
          $scope.billTransfer = $scope.totalAmountOfBills / 4;
          $scope.weeklyMessage = "PennyWise calculates your weekly transfers based on a 50-week year. This approach ensures you'll always be ahead on your bills, providing a buffer for months with extra weeks and helping you build a small reserve over time.";
          break;
      }

      if (!newValue) {
        $scope.frequencyMessage = "";
      } else
        $scope.frequencyMessage = `To ensure you cover your bills, please transfer $${$scope.billTransfer.toFixed(
          2
        )} into a dedicated bills account with each paycheck.`;
    });
  },
]);
