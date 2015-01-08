// declare app module
var app = angular.module('app', [
    'wj', 
    'MarketShare.services'
]);

// app controller provides data
app.controller('appCtrl', ['$scope', 'Api', function ($scope, Api) {
    var request = Api.getData();
    console.log(request);
    // generate some random data
    // var countries = 'US,Germany,UK,Japan,Italy,Greece'.split(','),
    //     data = [];

    // for (var i = 0; i < countries.length; i++) {
    //     data.push({
    //         country: countries[i],
    //         downloads: Math.round(Math.random() * 20000),
    //         sales: Math.random() * 10000,
    //         expenses: Math.random() * 5000
    //     });
    // }

    // add data array to scope
    $scope.data = request.data;

    // add chart properties to scope
    $scope.chartProps = {
        chartType: wijmo.chart.ChartType.Area,
        stacking: wijmo.chart.Stacking.Stacked,
        rotated: false
    };

}]);