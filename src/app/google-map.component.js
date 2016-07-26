/* global google */
'use strict';

angular
  .module('googleMap', [])
  .component('googleMap', {
    templateUrl: 'app/google-map.template.html',
    controller: function GetStations(NgMap, $http) {
      var self = this;

      $http.get('https://api.jcdecaux.com/vls/v1/stations?contract=dublin&apiKey=371210d83e4976258d109d993ededcc395bce09e').then(function (response) {
        self.stations = response.data;
      });

      NgMap.getMap().then(function (map) {
        var bounds = new google.maps.LatLngBounds();
        for (var i = 0; i < self.stations.length; i++) {
          var latlng = new google.maps.LatLng(self.stations[i].position.lat, self.stations[i].position.lng);
          bounds.extend(latlng);
          map.setCenter(bounds.getCenter());
          map.fitBounds(bounds);
        }
        self.map = map;
      });

      self.getIcon = function (station) {
        var bikesPercent = station.available_bikes / station.bike_stands;
        var strokeColor = '020615';
        var strokeDash = 'none';
        if (bikesPercent === 0) {
          strokeColor = '020615';
          strokeDash = '3,3';
        }
        var icon = {
          url: 'data:image/svg+xml;utf-8,<svg width="22" height="22" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:1.41421;"><circle cx="11" cy="11" r="10" stroke-dasharray="' + strokeDash + '" style="fill:url(#_Linear1);stroke-width:2px;stroke:\u0023' + strokeColor + ';"/><defs><linearGradient id="_Linear1" x1="0" x2="0" y1="1" y2="0"><stop offset="0%" stop-color="\u00230076ad"/><stop offset="' + bikesPercent + '" stop-color="\u00230076ad" /><stop offset="' + bikesPercent + '" stop-color="white" /><stop offset="100%" stop-color="white"/></linearGradient></defs></svg>'
        };
        return icon;
      };

      self.showStationInfo = function (event, index) {
        self.station = self.stations[index];
        self.map.showInfoWindow('stationInfo', this);
      };

      self.startChanged = function () {
        self.start = this.getPlace();
        console.log('latitude', self.start.geometry.location.lat());
        console.log('longitude', self.start.geometry.location.lng());
        console.log('formatted address', self.start.formatted_address);
        console.log('address', self.address);
        self.map.setCenter(self.start.geometry.location);
      };
    }
  });
