/**
 * Service for requesting images or url from a database. Could be use in a tchat
 * @version v1.0.0-dev-2016-12-11
 * @link 
 */

'use strict';

angular.module('ttcTchatRequesterModule', [])
    .factory('ttcTchatRequester', ['$http', function ($http) {

    var cmds = [];
    return {

        init:function(opts) {
            // INIT
            $http({
                method: 'GET',
                url: opts.api_route
            }).then(function successCallback(response) {
                for (var i = 0; i < response.data.length; i++) {
                   cmds.push(JSON.parse(response.data[i].json));
                }
            }, function errorCallback(response) {
                $log.info('Get actions : Unable to reach server');
            });
        },

        complete: function (input) {
            var matchedCmds = [];

            if (input == "")
                return matchedCmds;

            
            for (var i = 0; i < cmds.length; ++i) {
                if (cmds[i].cmd.indexOf(input) == 0) {
                    matchedCmds.push(cmds[i].cmd);
                }
            }
            return matchedCmds.sort();
        },
        exec: function(cmd) {
            // test the / and replace it by nothing
            for (var i = 0; i < cmds.length; ++i) {
                if (cmds[i].cmd == cmd) {
                    switch (cmds[i].type) {
                        case "image":
                            return cmds[i].url;
                        case "service":
                            // return promise
                            return $http({
                                method: cmds[i].method,
                                url: cmds[i].url
                            });
                        default:
                            return cmd;
                    }
                }
            }

            return "This action is not registered";
        }
    };
}]);