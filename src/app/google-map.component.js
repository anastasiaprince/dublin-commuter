'use strict';

angular
  .module('googleMap', [])
  .component('googleMap', {
    templateUrl: 'app/google-map.template.html',
    controller: function MyController(NgMap, $http) {
      var self = this;
      self.zoom = 13;
      self.center = '53.349819,-6.2609523';
      $http.get('https://api.jcdecaux.com/vls/v1/stations?contract=dublin&apiKey=371210d83e4976258d109d993ededcc395bce09e').then(function (response) {
        self.stations = response.data;
      });
    }
  });
