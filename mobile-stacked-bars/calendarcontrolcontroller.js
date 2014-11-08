// declare app module                            
var app = angular.module('app', ['wj']);

// app controller provides data
app.controller('appCtrl', function appCtrl($scope) {

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

    $("#startDate").wijgrid("option", "allowKeyboardNavigation", false);

});