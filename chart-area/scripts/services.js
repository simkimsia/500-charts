var services = angular.module('MarketShare.services', [
    'ngResource', 'ngCookies'
]);

services.factory('Api', ['$resource',
  function($resource) {
    var resource = $resource('', {}, {
      getData: {
        method: 'GET',
        url: 'http://simkimsia.github.io/500-charts/chart-area/data.json'
      }
    });
    return resource;
  }
]);