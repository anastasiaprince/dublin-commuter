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
        var availableBikes = station.available_bikes;
        var bikesPercent = availableBikes / station.bike_stands;
        var strokeDash = 'none';
        var labelColor = '\u0023020615';
        var fillColor = '\u00230076ad';
        if (bikesPercent === 0) {
          strokeDash = '3,3';
        }
        if (bikesPercent === 1) {
          fillColor = '\u0023020615';
          labelColor = 'white';
        }
        var icon = {
          url: 'data:image/svg+xml;utf-8,<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:1.41421;"><circle cx="16" cy="16" r="15" stroke-dasharray="' + strokeDash + '" style="fill:url(#_Linear1);stroke-width:2px;stroke:\u0023020615;"/><text x="16" y="22" text-anchor="middle" fill="' + labelColor + '" style="font: bold 16px Helvetica, Arial, sans-serif;">' + availableBikes + '</text><defs><linearGradient id="_Linear1" x1="0" x2="0" y1="1" y2="0"><stop offset="0%" stop-color="' + fillColor + '"/><stop offset="' + bikesPercent + '" stop-color="' + fillColor + '" /><stop offset="' + bikesPercent + '" stop-color="white" /><stop offset="100%" stop-color="white"/></linearGradient></defs></svg>'
        };
        return icon;
      };

      self.setOrigin = function (event) {
        self.origin = event.latLng;
      };
    }
  });
