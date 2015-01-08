// declare app module
var app = angular.module('app', [
    'wj', 
    'ngRoute',
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
    request.$promise.then(function(response) {
        var data = [];
        for (var i = 0; i < response.data.length; i++) {
            data.push({
                timestamp: wijmo.Globalize.parseDate(response.data[i].timestamp, 'yyyy-MM-dd HH:mm:ss.ffffff'),
                os: response.data[i].os,
                sg: response.data[i].sg
            });
        }
        $scope.data = data;
        console.log($scope.data);

    });

    // add chart properties to scope
    $scope.chartProps = {
        chartType: wijmo.chart.ChartType.Area,
        stacking: wijmo.chart.Stacking.Stacked,
        rotated: false
    };

}]);