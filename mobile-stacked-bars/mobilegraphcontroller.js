// declare app module                            
var app = angular.module('app', ['wj']);

// app controller provides data
app.controller('appCtrl', function appCtrl($scope) {

    // generate some random data
    var countries = 'US, Germany, UK, Japan, Italy, Greece'.split(','),
        data = [];
    for (var i = 0; i < countries.length; i++) {
        data.push({
            country: countries[i],
            downloads: Math.round(Math.random() * 20000),
            sales: Math.random() * 10000,
            expenses: Math.random() * 5000,
        });
    }

    // add data array to scope
    $scope.data = data;
    $scope.financialYear = "FY 11/12";

    // add chart properties to scope
    $scope.chartProps = {
        chartType: wijmo.chart.ChartType.Bar,
        stacking: wijmo.chart.Stacking.Stacked100pc,
        legendPosition: wijmo.chart.Position.None
    };

    // the date/time being edited
    var StartDate = new Date();
    var EndDate = new Date();

    // create InputDate control
    $scope.startDate = new wijmo.input.InputDate('#startDate', {
        min: new Date(2014, 8, 1),
        format: 'd/M/yyyy',
        value: StartDate
    });
    $scope.endDate = new wijmo.input.InputDate('#endDate', {
        min: new Date(2014, 8, 1),
        format: 'd/M/yyyy',
        value: EndDate
    });

    // $scope.inputDate.valueChanged.addHandler(valueChanged);

    $scope.chart = null;
    $scope.$watch("chart", function() {
        if ($scope.chart) {
            var chart = $scope.chart;
            chart.rendered.addHandler( function (sender,event) {
                // move y-axis labels
                $(chart.hostElement).find('.wj-axis-y .wj-label').each(function() {
                    this.setAttribute('x', 0);
                });
            });
        }
    }); 

});