'use strict';

angular
  .module('googleMap', [])
  .component('googleMap', {
    templateUrl: 'app/google-map.template.html',
    controller: function GetStations(NgMap, $http) {
      var self = this;
      NgMap.getMap().then(function (map) {
        self.map = map;
      });
      self.zoom = 13;
      self.center = '53.349819,-6.2609523';

      $http.get('https://api.jcdecaux.com/vls/v1/stations?contract=dublin&apiKey=371210d83e4976258d109d993ededcc395bce09e').then(function (response) {
        self.stations = response.data;
      });

      self.getIcon = function (station) {
        var iconsTable = {
          0: 'http://www.googlemapsmarkers.com/v1/ffffff/',
          1: 'http://www.googlemapsmarkers.com/v1/000000/'
        };

        var iconUrl = iconsTable[station.available_bikes / station.bike_stands];
        if (iconUrl) {
          return iconUrl;
        }
        return "http://www.googlemapsmarkers.com/v1/aaaaaa/";
      };

      self.showStationInfo = function (event, index) {
        self.station = self.stations[index];
        self.map.showInfoWindow('stationInfo', this);
      };
    }
  });
