// declare app module                            
var app = angular.module('app', ['wj']);

// app controller provides data
app.controller('appCtrl', function appCtrl($scope) {

    // generate some random data
    var countries = 'Product area 5, Product area 4, Product area 3, Product area 2, Product area 1'.split(','),
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

    function getQueryStringParams(sParam) {
        var sPageURL = window.location.search.substring(1);
        var sURLVariables = sPageURL.split('&');
        for (var i = 0; i < sURLVariables.length; i++) 
        {
            var sParameterName = sURLVariables[i].split('=');
            if (sParameterName[0] == sParam) 
            {
                return sParameterName[1];
            }
        }
        return null;
    }

    $scope.chart = null;
    $scope.$watch("chart", function() {
        if ($scope.chart) {
            var chart = $scope.chart;
            // no gaps between bars
            chart._barPlotter.width = 1;
            
            var fixedBarHeight = getQueryStringParams('fixed');
            if (fixedBarHeight) {
                // set each bar to be no more than 20px
                $(chart.hostElement).height( data.length * 20);
            }

            chart.rendered.addHandler( function (sender,event) {
                // move y-axis labels
                $(chart.hostElement).find('.wj-axis-y .wj-label').each(function() {
                    this.setAttribute('x', 0);
                });
            });
        }
    });

});
