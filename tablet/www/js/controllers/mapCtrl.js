'use strict';

angular.module('starter').controller('MapCtrl', function ($scope, constants, $ionicLoading, $cordovaGeolocation, $ionicPopup) {
  var options = {timeout: 10000, enableHighAccuracy: true};
  // Setup the loader
  $ionicLoading.show({
    content: 'Loading',
    animation: 'fade-in',
    showBackdrop: true,
    maxWidth: 200,
    showDelay: 0
  });


  $scope.personList = new Array();
  $scope.markerList = new Array();

  $cordovaGeolocation.getCurrentPosition(options).then(function (position) {

    $ionicLoading.hide();

    /**
     * Part to connect to the server with socket IO
     */
    var socket;

    socket = io.connect(constants.backendUrl, {"path": "/gpsalzheimer/socket.io"});

    socket.io.on('connect_error', function (err) {
      console.log('Error connecting to server');
    });

    socket.on("updateUsers", function (params) {
      //console.log(params.users);
      if (params !== {}) {
        $scope.$apply(function () {
          $scope.personList = params.users;
        });
        initMarkers(params);
      }
    });

    /**
     * Initialisation of the current position.
     */
    var x1 = position.coords.latitude;
    var y1 = position.coords.longitude;

    var latLng = new google.maps.LatLng(x1, y1);

    /**
     * Initialisation of the map
     */
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 20,
      center: latLng
    });

    /**
     * Initialisation images for the map and the menu.
     * @type {string}
     */
    var image1 = 'img/markerblue.png';
    var image2 = 'img/markerbrown.png';
    var image3 = 'img/markeryellow.png';
    var imageList = [image1, image2, image3];

    /**
     * Create circle
     * @type {google.maps.Circle}
     */

    var optionsCercle = {
      map: map,
      center: map.getCenter(),
      fillOpacity: 0,
      radius:constants.radius
    };

    var monCercle = new google.maps.Circle(optionsCercle);

    /**
     * Wait until the map is loaded
     */
    google.maps.event.addListenerOnce(map, 'idle', function () {

      var socket;
      socket = io.connect(constants.backendUrl, function () {
        console.log("Connection success");
      });

      socket.io.on('connect_error', function (err) {
        console.log('Error connecting to server');
      });

      socket.on("updateUsers", function (params) {
        if (params !== {}) {
          //$scope.$apply($scope.personList = new Array("check", "autre"));
          $scope.$apply($scope.personList = params.users);
          initMarkers(params);
        }
      });
      
      /**
       * Initialisation of the marker of our current position
       * @type {google.maps.Marker}
       */
      var mar = new google.maps.Marker({
        map: map,
        animation: google.maps.Animation.DROP,
        position: latLng
      });

      var infoWindow = new google.maps.InfoWindow({
        content: "Here I am!"
      });

      google.maps.event.addListener(mar, 'click', function () {
        infoWindow.open(map, mar);
      });

    });

    /**
     * Function Distance. This function returns the distance between two point A and B with A(x1,y1) and B(x2,y2)
     * @param x1
     * @param y1
     * @param x2
     * @param y2
     * @returns {number}
     * @constructor
     */
    function Distance(x1, y1, x2, y2) {
      return Math.sqrt(Math.pow((y2 - y1), 2) + Math.pow((x2 - x1), 2));
    }

    /**
     * Function cleanMarkers. This function is used to clean our marker (make them disapear on the map). To ensure this action,
     * the parameter map has to be null.
     * @param map
     **/
    function cleanMarkers(map) {
      for (var i = 0; i < $scope.markerList.length; i++) {
        $scope.markerList[i].setMap(map);
      }
    }

    var alert = true;

    /**
     * Function initMarkers. This function initializes the marker on the map (used to see user localisation) according to the
     * list of people we have.
     **/
    function initMarkers(userList) {
      var allMarker = new Array();

      if ($scope.markerList.length > 0) {
        cleanMarkers(null);
      }

      $scope.markerList = new Array();
      for (var i = 0; i < userList.users.length; i++) {
        var x2 = userList.users[i]._position._latitude;
        var y2 = userList.users[i]._position._longitude;
        var marker = new google.maps.Marker({
          position: {lat: x2, lng: y2},
          map: map,
          icon: imageList[i]
        });
        allMarker.push(marker);

        // 100000 pour le transformer en mettre
        var dist = 100000 * Distance(x1, y1, x2, y2);

        if (dist >= constants.radius && alert) {

          alert = false;

          var confirmPopup = $ionicPopup.confirm({
            title: 'ALERT DANER',
            template: 'SORTIE ZONE'
          });

          confirmPopup.then(function (res) {
            if (res) {
              console.log('You are sure');
              alert = true;
            } else {
              console.log('You are not sure');
            }
          });
        }
      }
      $scope.markerList = allMarker;
    }

  }, function (error) {
    console.log("Could not get location");
  });


});
