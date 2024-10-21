let pennyWiseApp = angular.module("pennyWiseApp", ["ngRoute", "ngAnimate"]);

pennyWiseApp.config([
  "$routeProvider",
  ($routeProvider) => {
    $routeProvider
      .when("/income", {
        templateUrl: "app/content/views/income.html",
      })
      .when("/bills", {
        templateUrl: "app/content/views/billsInput.html",
      })
      .when("/budget", {
        templateUrl: "app/content/views/budget.html",
      })
      .otherwise({ redirectTo: "/income" });
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

    // Initialize bills and totalAmountOfBills
    $scope.bills = [];
    $scope.totalAmountOfBills = 0;

    // Function to calculate total amount of bills
    $scope.calculateTotalBills = function () {
      $scope.totalAmountOfBills = $scope.bills.reduce((total, bill) => {
        return total + (parseFloat(bill.dollarAmount) || 0);
      }, 0);

      // Update localStorage
      $window.localStorage.setItem(
        "totalAmountOfBills",
        JSON.stringify($scope.totalAmountOfBills)
      );
    };

    // Watch for changes in the bills array
    $scope.$watch(
      "bills",
      function (newValue, oldValue) {
        if (newValue !== oldValue) {
          $scope.calculateTotalBills();
        }
      },
      true
    );

    // Get JSON Data
    $http.get("../../data/billData.json").then((response) => {
      $scope.bills = response.data;
      $scope.calculateTotalBills(); // Calculate initial total
    });

    // Add bill functionality
    $scope.addBill = () => {
      // Check if both fields are filled
      if (!$scope.newBill.name || !$scope.newBill.dollarAmount) {
        $scope.errorMessage = "Both fields are required!";
        return; // Exit the function early
      } else {
        $scope.errorMessage = "";
      }

      // Clear any previous error message
      $scope.formError = "";

      // calculate percentage
      let billAmount = parseInt(Math.ceil($scope.newBill.dollarAmount));
      let billPercentage = Math.ceil(
        (billAmount / ($scope.postTaxIncome / 12)) * 100
      );

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

    // finished btn functionality
    $scope.finished = () => {
      $location.path("/budget");
    };
  },
]);

pennyWiseApp.controller("BudgetController", [
  "$scope",
  "$window",
  "$http",
  ($scope, $window, $http) => {
    // get goalData
    $http.get("../../data/goalData.json").then((response) => {
      $scope.goals = response.data;
    });
    // get bills total and posttax income from local storage
    $scope.postTaxIncome =
      JSON.parse($window.localStorage.getItem("postTaxIncome")) || 0;
    $scope.totalAmountOfBills =
      JSON.parse($window.localStorage.getItem("totalAmountOfBills")) || 0;
    $scope.remainingSalary =
      $scope.postTaxIncome - $scope.totalAmountOfBills * 12;

    // set variables for pay frequency
    $scope.payFrequencies = ["Monthly", "Semimonthly", "Biweekly", "Weekly"];

    $scope.selectedPayFrequency = "";
    $scope.frequencyMessage = "";
    $scope.billTransfer = 0;
    $scope.weeklyMessage = "";
    $scope.amountOfPays = 0;

    // watch for change in frequency
    $scope.$watch("selectedPayFrequency", (newValue, oldValue) => {
      if (newValue !== oldValue) $scope.selectedPayFrequency = newValue;

      //   frequency logic
      switch (newValue) {
        case "Monthly":
          $scope.billTransfer = $scope.totalAmountOfBills;
          $scope.amountOfPays = 12;
          break;
        case "Semimonthly":
          $scope.billTransfer = $scope.totalAmountOfBills / 2;
          $scope.amountOfPays = 24;
          break;
        case "Biweekly":
          $scope.billTransfer = ($scope.totalAmountOfBills * 12) / 26;
          $scope.amountOfPays = 26;
          break;
        case "Weekly":
          $scope.billTransfer = ($scope.totalAmountOfBills * 12) / 48;
          $scope.weeklyMessage =
            "PennyWise calculates your weekly transfers based on a 48-week year. This approach ensures you'll always be ahead on your bills, providing a buffer for months with extra weeks and helping you build a small reserve over time.";
          $scope.amountOfPays = 48;
          break;
      }

      if (!newValue) {
        $scope.frequencyMessage = "";
        $scope.remainingPaycheck;
      } else {
        $scope.frequencyMessage = `To ensure you cover your bills, please transfer $${Math.ceil(
          $scope.billTransfer
        )} into a dedicated bills account with each paycheck.`;
        $scope.remainingPaycheckMessage =
          "Your estimated remaining balance per paycheck is: ";
        $scope.remainingPaycheck =
          $scope.remainingSalary / $scope.amountOfPays - $scope.billTransfer;
      }
      $scope.remainingPaycheck = $scope.remainingSalary / $scope.amountOfPays;

      $scope.calculateTotalGoalAmount = function () {
        return $scope.goals.reduce((total, goal) => {
          return total + $scope.calculateTransferAmount(goal);
        }, 0);
      };
      //   end of watch
    });

    $scope.calculateTransferAmount = (goal) => {
      if (!$scope.remainingPaycheck || !goal.percentage) {
        return 0;
      }
      return $scope.remainingPaycheck * (parseFloat(goal.percentage) / 100);
    };

    $scope.addGoal = () => {
      if (!$scope.newGoal.name || !$scope.newGoal.percentage) {
        $scope.totalPercentageMessage =
          "Please fill in both name and percentage.";
        return;
      }

      let newTotalPercentage =
        $scope.goals.reduce(
          (total, goal) => total + parseFloat(goal.percentage),
          0
        ) + parseFloat($scope.newGoal.percentage);

      if (newTotalPercentage > 100) {
        $scope.totalPercentageMessage =
          "You have selected over 100% of the remaining balance, please make an adjustment.";
        return;
      }

      $scope.goals.push({
        name: $scope.newGoal.name,
        percentage: parseFloat($scope.newGoal.percentage),
      });

      $scope.totalPercentageMessage = "";
      $scope.newGoal = { name: "", percentage: "" };
    };

    $scope.removeGoal = (goal) => {
      let index = $scope.goals.indexOf(goal);
      $scope.goals.splice(index, 1);
    };
  },
]);
