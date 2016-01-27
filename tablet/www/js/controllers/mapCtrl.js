'use strict';

angular.module('starter').controller('MapCtrl', function ($scope, $state, $cordovaGeolocation, $ionicLoading, constants) {
  var options = {timeout: 10000, enableHighAccuracy: true};
  // Setup the loader
  $ionicLoading.show({
    content: 'Loading',
    animation: 'fade-in',
    showBackdrop: true,
    maxWidth: 200,
    showDelay: 0
  });

  $cordovaGeolocation.getCurrentPosition(options).then(function (position) {

    $ionicLoading.hide();

    var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

    //$scope.map;
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 18,
      center: latLng
    });

    var image1 = 'img/localisation1.png';
    var image2 = 'img/localisation2.png';
    var image3 = 'img/localisation3.png';
    var imageList = [image1, image2, image3];

    $scope.personList=new Array();
    $scope.markerList=new Array();

    var socket;
    socket = io.connect(constants.backendUrl, function () {
      console.log("Connection success");
    });

    socket.io.on('connect_error', function (err) {
      console.log('Error connecting to server');
    });

    socket.on("updateUsers", function (params) {
      if (params !== {}) {
        console.log('listenPerson: ', params);
        $scope.personList = params;
        console.log('scope person list:', $scope.personList);
        initMarkers(params);
      }
    });
    /**
     * We start the connection
     *
     socket=connect(socket);

     listenPerson(socket);
     /**
     * We get back the person list from the server.

     socket.getPerson().then(
     function(data){
        console.log("data person list: ",data);
        $scope.personList=data;
        initMarkers();
      },
     function (msg){
        console.log("error getbackscore homepage",msg);
      }
     );*/

    /**
     * Function initMarkers. This function initializes the marker on the map (used to see user localisation) according to the
     * list of people we have.
     *
     $scope.initMarkers= function(){
      var allMarker= new Array();
      $scope.cleanMarkers(null);
      for(var i=0; i<$scope.personList.length;i++){
        var marker = new google.maps.Marker({
          position: {lat: $scope.personList[i]._position._latitude, lng: $scope.personList[i]._position._longitude},
          map: map,
          icon: imageList[i]
        });
        allMarker.push(marker);
      }
      $scope.markerList=allMarker;
    }


     /**
     * Function cleanMarkers. This function is used to clean our marker (make them disapear on the map). To ensure this action,
     * the parameter map has to be null.
     * @param map

    $scope.cleanMarkers = function (map) {
      for (var i = 0; i < $scope.markerList.length; i++) {
        $scope.markerList[i].setMap(map);
      }
    }*/



    /* $scope.connect=function(){
     //socket = io.connect(constants.backendUrl, {"path":"/gpsalzheimer/socket.io"}, function(){
     socket = io.connect(constants.backendUrl, function(){
     console.log("Connection success");
     });

     socket.io.on('connect_error', function (err) {
     console.log('Error connecting to server');
     });
     }

     $scope.listenPerson=function(){
     socket.on("updateGpsData", function(params){
     if(params !=={}){
     console.log('listenPerson',params);
     $scope.personList=params;
     }
     });
     }

     */

    /*

     var marker = new google.maps.Marker({
     position: {lat: 43.615377, lng: 7.07185},
     animation: google.maps.Animation.DROP,
     map: map,
     icon: image
     });
     //marker.addListener('click', toggleBounce);


     var marker2 = new google.maps.Marker({
     position: {lat: 43.6154, lng: 7.07189},
     animation: google.maps.Animation.DROP,
     map: map,
     icon: image
     });
     // marker2.addListener('click', toggleBounce);

     var marker3 = new google.maps.Marker({
     position: {lat: 43.6155, lng: 7.0719},
     animation: google.maps.Animation.DROP,
     map: map,
     icon: image
     });
     // marker3.addListener('click', toggleBounce);

     */

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

    function cleanMarkers(map) {
      for (var i = 0; i < $scope.markerList.length; i++) {
        $scope.markerList[i].setMap(map);
      }
    }

    function initMarkers(userList) {
      console.log('in initmarker');
      console.log("user list", userList);
      var allMarker = new Array();

      if($scope.markerList.length>0){
        cleanMarkers(null);
      }
      console.log("user list 0", userList.users[0]);
      $scope.markerList=new Array();
      for (var i = 0; i < userList.users.length; i++) {

        console.log("--------------------- I ",i,"------------------------");
        console.log("latitude", userList.users[i]._position._latitude);
        console.log("longitude", userList.users[i]._position._longitude);
        console.log("----------------------------------------------------");
        var marker = new google.maps.Marker({
          position: {lat: userList.users[i]._position._latitude, lng: userList.users[i]._position._longitude},
          map: map,
          icon: imageList[i]
        });
        allMarker.push(marker);
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

    function listenPerson(socket) {
      socket.on("updateGpsData", function (params) {
        if (params !== {}) {
          console.log('listenPerson', params);
          $scope.personList = params;
        }
      });
    }


  }, function (error) {
    console.log("Could not get location");
  });


});
