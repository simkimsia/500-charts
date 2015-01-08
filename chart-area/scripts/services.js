var services = angular.module('MarketShare.services', ['ngResource', 'ngCookies']);

services.factory('Api', ['$resource',
  function($resource) {
    var resource = $resource('', {}, {
      getData: {
        method: 'GET',
        url: '/chart-area/data.json'
        //url: 'http://tamtech.ddns.net/mktshare/json/?minutes=60&display=#'
      }
    });
    return resource;
  }
]);