'use strict';

angular.module('eklabs.angularStarterPack')
    .factory('$config', ['WEBAPP_CONFIG',function(WEBAPP_CONFIG){

        var parameters = angular.extend({}, WEBAPP_CONFIG);

        return {
            get: function (name) {
                return parameters[name];
            }
        }
    }]);