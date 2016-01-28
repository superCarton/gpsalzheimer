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

    var x1 = position.coords.latitude;
    var y1 = position.coords.longitude;

    var latLng = new google.maps.LatLng(x1, y1);

    //$scope.map;
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 20,
      center: latLng
    });

    var image1 = 'img/markerblue.png';
    var image2 = 'img/markerbrown.png';
    var image3 = 'img/markeryellow.png';
    var imageList = [image1, image2, image3];

    var optionsCercle = {
      map: map,
      center: map.getCenter(),
      fillOpacity: 0,
      radius:70
    };

    var monCercle = new google.maps.Circle(optionsCercle);

    //Wait until the map is loaded
    google.maps.event.addListenerOnce(map, 'idle', function () {


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
      console.log('in initmarker');
      console.log("user list", userList);
      var allMarker = new Array();

      if ($scope.markerList.length > 0) {
        cleanMarkers(null);
      }
      // console.log("user list 0", userList.users[0]);
      $scope.markerList = new Array();
      for (var i = 0; i < userList.users.length; i++) {

        //console.log("--------------------- I ", i, "------------------------");
        // console.log("latitude", userList.users[i]._position._latitude);
        // console.log("longitude", userList.users[i]._position._longitude);
        // console.log("----------------------------------------------------");
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
        console.log("x1 = ", x1);
        console.log("y1 = ", y1);
        console.log("x2 = ", x2);
        console.log("y2  =", y2);
        console.log("Distance = ", dist);
        if (dist >= 70 && alert) {

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


    function connect(socket) {
      //socket = io.connect(constants.backendUrl, {"path":"/gpsalzheimer/socket.io"}, function(){
      socket = io.connect(constants.backendUrl, function () {
        console.log("Connection success");
      });

      socket.io.on('connect_error', function (err) {
        console.log('Error connecting to server');
      });
    }

    /* function listenPerson(socket) {
     socket.on("updateGpsData", function (params) {
     if (params !== {}) {
     console.log('listenPerson', params);
     $scope.personList = params;
     }
     });
     }
     */

  }, function (error) {
    console.log("Could not get location");
  });


});
