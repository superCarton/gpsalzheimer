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
  $scope.outOfZoneAlert = new Array();
  $scope.heartFrequencyAlert = new Array();

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
      radius: constants.radius
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

        /**
         * Color treatment
         * @type {*}
         */
        var colorName = getBackColorFromID(userList.users[i]._color);
        var pathImage = 'img/' + colorName + '.png';
        $scope.$apply($scope.personList[i].pathImage = pathImage);

        /**
         * Alert treatment
         * @type {zeze}
         */

        var alertZone = false;
        if ($scope.outOfZoneAlert.indexOf(userList.users[i]._id) >= 0) alertZone = true;

        var alertHF = false;
        if ($scope.heartFrequencyAlert.indexOf(userList.users[i]._id) >= 0) alertHF = true;

        var marker = new google.maps.Marker({
          position: {lat: x2, lng: y2},
          map: map,
          icon: pathImage
        });
        allMarker.push(marker);

        /**
         * We multiply by 100000 to have a distance in meter.
         * @type {number}
         */
        var dist = 100000 * Distance(x1, y1, x2, y2);

        /**
         * Out of zone alert.
         */
        if (dist >= constants.radius && !alertZone) {
          var audio = new Audio('sound/alert.mp3');

          audio.loop = true;
          audio.play();
          $scope.$apply($scope.outOfZoneAlert.push(userList.users[i]._id));
          var color = getBackColorFromID(userList.users[i]._color);
          var colorInFrench = translateColor(color);

          var confirmPopup = $ionicPopup.confirm({
            title: 'Alerte',
            template: 'La personne en ' + colorInFrench + ' sur la carte est sortie de la zône'
          });

          confirmPopup.then(function (res) {
            if (res) {
              console.log('You are sure');
              //alert = true;
              audio.pause();
            } else {
              console.log('You are not sure');
              audio.pause();
            }
          });
        }

        /**
         * Heart Frequency alert.
         */
        if (userList.users[i]._frequency > constants.maxFrequency && !alertHF) {

          var audio = new Audio('sound/alert.mp3');

          audio.loop = true;
          audio.play();

          $scope.$apply($scope.heartFrequencyAlert.push(userList.users[i]._id));
          var color = getBackColorFromID(userList.users[i]._color);
          var colorInFrench = translateColor(color);

          var confirmPopup = $ionicPopup.confirm({
            title: 'Alerte',
            template: 'La personne ' + colorInFrench + ' a une fréquence cardiaque trop élevée'
          });

          confirmPopup.then(function (res) {
            if (res) {
              console.log('You are sure');
              alert = true;
              audio.pause();
            } else {
              console.log('You are not sure');
              audio.pause();
            }
          });
        }
      }
      $scope.markerList = allMarker;
    }

    /**
     * Function getBackColorFromID. This function returns the color string from its id (integer).
     * @param id
     * @returns {*}
     */
    function getBackColorFromID(id) {
      switch (id) {
        case 0:
          return "yellow";
        case 1:
          return "lightblue";
        case 2:
          return "blue";
        case 3:
          return "green";
        case 4:
          return "purple";
        case 5:
          return "pink";
        case 6:
          return "brown";
        default:
          console.log("Error of the color id");
      }
    }

    /**
     * Function translateColor. This function returns the translation of the color specifies in parameter.
     * @param color
     * @returns {*}
     */
    function translateColor(color) {
      switch (color) {
        case "yellow":
          return "jaune";
        case "lightblue" :
          return "bleu ciel";
        case "blue":
          return "bleu";
        case "green":
          return "vert";
        case "purple":
          return "violet";
        case "pink":
          return "rose";
        case "brown":
          return "marron";
        default:
          console.log("Error in the color translation");
      }

    }
  }, function (error) {
    console.log("Could not get location");
  });


});
