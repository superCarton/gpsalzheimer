'use strict';


angular.module('starter').controller('MapCtrl', function ($scope, $state, $cordovaGeolocation) {
  var options = {timeout: 10000, enableHighAccuracy: true};

  $cordovaGeolocation.getCurrentPosition(options).then(function (position) {

    var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
/*
    var mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    var map = new google.maps.Map(document.getElementById("map"), mapOptions);
    */$scope.map;
      var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 18,
        center: latLng//{lat: 43.615377, lng: 7.07184}
      });

    var image = 'img/b.png';
    var image2 = 'img/bleu.png';
    var image3 = 'img/ionic.png';

    /*var image = {
      url: 'img/b.png',
      // This marker is 20 pixels wide by 32 pixels high.
      size: new google.maps.Size(20, 32),
      // The origin for this image is (0, 0).
      origin: new google.maps.Point(0, 0),
      // The anchor for this image is the base of the flagpole at (0, 32).
      anchor: new google.maps.Point(0, 32)
    };*/

      var marker = new google.maps.Marker({
        position: {lat: 43.615377, lng: 7.07185},
        animation: google.maps.Animation.DROP,
        map: map,
        icon: image
      });
    marker.addListener('click', toggleBounce);


    var marker2 = new google.maps.Marker({
      position: {lat: 43.6154, lng: 7.07189},
      animation: google.maps.Animation.DROP,
      map: map,
      icon: image
    });
    marker2.addListener('click', toggleBounce);

    var marker3 = new google.maps.Marker({
      position: {lat: 43.6155, lng: 7.0719},
      animation: google.maps.Animation.DROP,
      map: map,
      icon: image
    });
    marker3.addListener('click', toggleBounce);

    function toggleBounce() {
      if (marker.getAnimation() !== null) {
        marker.setAnimation(null);
      } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
      }
    }

    function drop() {
      clearMarkers();
      for (var i = 0; i < neighborhoods.length; i++) {
        addMarkerWithTimeout(neighborhoods[i], i * 200);
      }
    }


  }, function (error) {
    console.log("Could not get location");
  });



});
