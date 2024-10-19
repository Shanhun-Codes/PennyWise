let pennyWiseApp = angular.module("pennyWiseApp", ["ngRoute"]);

pennyWiseApp.config([
  "$routeProvider",
  function ($routeProvider) {
    $routeProvider
      .when("/home", {
        templateUrl: "views/home.html",
      })
      .when('/budgetInput', {
        templateUrl:'views/budgetInput.html'
      })
      .otherwise({ redirectTo: "/home" });
  },
]);

// STATE CONTROLLER
pennyWiseApp.controller('StateController', function($scope) {
  $scope.states = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia',
    'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland',
    'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey',
    'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina',
    'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
  ];

  $scope.addIncome = function() {
    console.log('Adding income for state:', $scope.selectedState);
  };
});

// BILL CONTROLLER 
pennyWiseApp.controller('BillController', ['$scope', '$http', function($scope, $http){
    // Get JSON Data 
    $http.get('../../data/billData.json').then(function(response){
        $scope.bills = response.data
    })

    $scope.addBill = function () {
        $scope.bills.push({
            name: $scope.newBill.name,
            dollarAmount: parseInt(Math.ceil($scope.newBill.dollarAmount))
        })
    }
}])