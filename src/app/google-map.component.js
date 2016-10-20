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
        var openPercent = station.available_bike_stands / station.bike_stands;
        var bikesPercent = availableBikes / station.bike_stands;
        var strokeDash = 'none';
        var labelColor = '\u0023020615';
        var fillColor = '\u002349c5ff';
        if (bikesPercent === 0) {
          strokeDash = '3,3';
        }
        if (bikesPercent === 1) {
          fillColor = '\u0023020615';
          labelColor = 'white';
        }
        var icon = {
          url: 'data:image/svg+xml;utf-8,<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:1.41421;"><g transform="matrix(-0.96,1.17566e-16,-1.22465e-16,-1,29.92,33)"><path d="M14.5,2C14.5,2 2,11 2,20C2,26.623 7.601,32 14.5,32C21.399,32 27,26.623 27,20C27,11 14.5,2 14.5,2Z" stroke-dasharray="' + strokeDash + '" style="fill:url(#_Linear1);stroke:\u0023020615;stroke-width:2px;"/></g><text x="16" y="20" text-anchor="middle" fill="' + labelColor + '" style="font: bold 14px Helvetica, Arial, sans-serif;">' + availableBikes + '</text><defs><linearGradient id="_Linear1" x1="0" x2="0" y1="1" y2="0"><stop offset="0%" stop-color="white"/><stop offset="' + openPercent + '" stop-color="white" /><stop offset="' + openPercent + '" stop-color="' + fillColor + '" /><stop offset="100%" stop-color="' + fillColor + '"/></linearGradient></defs></svg>'
        };
        return icon;
      };

      self.setOrigin = function (event) {
        self.origin = event.latLng;
      };
    }
  });
