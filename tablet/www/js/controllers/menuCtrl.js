/**
 * Created by Remi on 27/01/2016.
 */
'use strict';

angular.module('starter').
  controller('MenuCtrl', function ($scope) {
    console.log("le scope: ", $scope.$parent);
    console.log("menu ctrl 1: ",$scope.$parent.personList);
    this.personList = $scope.$parent.personList;
    console.log("menu ctrl 2: ",$scope.$parent.personList);

    $scope.$parent.$watch('personList',function(){ console.log("coucou")});
  });
