// declare app module
var app = angular.module('app', [
    'wj', 
    'ngRoute',
    'MarketShare.services'
]);

// app controller provides data
app.controller('appCtrl', ['$scope', 'Api', function ($scope, Api) {
    var request = Api.getData();
    
    request.$promise.then(function(response) {
        var data = [];
        for (var i = 0; i < response.data.length; i++) {
            data.push({
                timestamp: wijmo.Globalize.parseDate(response.data[i].timestamp, 'yyyy-MM-dd HH:mm:ss.ffffff'),
                sg: response.data[i].sg,
                os: response.data[i].os
            });
        }
        $scope.data = data;
    });

    // add chart properties to scope
    $scope.chartProps = {
        chartType: wijmo.chart.ChartType.Area,
        stacking: wijmo.chart.Stacking.Stacked,
        rotated: false
    };

}]);