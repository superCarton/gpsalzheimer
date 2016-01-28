'use strict';

/**
 * Ce service contient la liste des constantes de l'application.
 * Pour l'utiliser il suffit d'inclure le service <i>constants</i>.
 *
 * @example
 * angular.module('monModule')
 *  .controller('MonCtrl', ['constants', function (constants) {
 *    var serverAdress = constants.backendUrl;
 *  }]);
 *
 * @ngdoc service
 * @name frontEndOpenEatApp.constants
 * @description
 * # constants
 * Constant in the frontEndOpenEatApp.
 */
angular.module('starter')
  .constant('constants', {
    backendUrl : 'http://sparks-vm19.i3s.unice.fr/gpsalzheimer/tablet', // L'adresse du serveur.
   // backendUrl :'http://192.168.1.4:3000/tablet',
    radius:1,
    maxFrequency:110
  });


