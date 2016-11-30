'use strict';

angular.module('eklabs.angularStarterPack.jsonEditor')
    .directive('demoJsonEditor', ['$log',function($log){
        return {
            templateUrl : 'eklabs.angularStarterPack/modules/json-editor/directives/editor/view.html',
            scope : {
                json        : '=?',
                callback    : '=?',
                options     : '=?',
                listeners   : '=?',
                height      : '=?'
            },link : function(scope){

                // -------------------------------------------------------------------------------------------------
                // --- OPTIONS
                // -------------------------------------------------------------------------------------------------
                scope.$watch('options', function(options){
                    // TODO - NO OPTIONS YET
                });

                // -------------------------------------------------------------------------------------------------
                // --- CALLBACK
                // -------------------------------------------------------------------------------------------------
                /**
                 * Default action of our directive
                 * @type {{valid: default_actions.valid}}
                 */
                var default_actions = {
                    valid : function(json){
                        $log.info('Valid JSON on demoJsonEditor directive',json);
                    }
                };
                /**
                 * Check if callback in params
                 */
                scope.$watch('callback', function(callback){
                    if(callback){
                        scope.actions = angular.extend({},default_actions,callback);
                    }else{
                        scope.actions = default_actions
                    }
                });

                // -------------------------------------------------------------------------------------------------
                // --- LISTENERS
                // -------------------------------------------------------------------------------------------------
                /**
                 * Default listeners for the directive
                 * @type {{onErrors: default_listeners.onErrors}}
                 */
                var default_listeners = {
                    onError : function(editorError){
                        //$log.error(editorError);
                    }
                };

                /**
                 * Check if a listener as params
                 */
                scope.$watch('listeners', function(listeners){
                    if(listeners){
                        scope.listener = angular.extend({},default_listeners,listeners);
                    }else{
                        scope.listener = default_listeners;
                    }
                });

                /**
                 * Errors
                 * Catch Error and send back
                 */
                scope.$watch('editorError', function(errors){
                    if(errors){
                        scope.listener.onError(errors);
                    }
                });

                // -------------------------------------------------------------------------------------------------
                // --- JSON
                // -------------------------------------------------------------------------------------------------
                scope.$watch('json', function(json){
                    scope.aceAvailable = false;

                    if(!json){
                        // --- Default json
                        scope.aceModel =  '{\n\t\n}';
                    }else{
                        scope.aceModel = scope.convertRequestParamsToJson(json);
                    }
                    scope.loadAce = moment().valueOf();
                });

                // -------------------------------------------------------------------------------------------------
                // --- JSON EDITOR
                // -------------------------------------------------------------------------------------------------
                /**
                 * Trigger to load ace editor
                 */
                scope.$watch('loadAce',function(loadAce){
                    scope.aceOption = {
                        mode: 'json',
                        require: ['ace/ext/language_tools'],
                        theme: 'chrome',
                        onLoad: function (_ace) {
                            var _session = _ace.getSession();

                            _session.on('changeAnnotation', function(){

                                var annot = _ace.getSession().getAnnotations();

                                if(!annot.length){
                                    scope.editorError = false;
                                    // --- transform and send to temp variable
                                    scope.currentJson = scope.convertToJson(_ace.getValue());
                                }else{
                                    // ---- Error on the model
                                    scope.editorError = annot[0];
                                }
                            } )
                        }
                    };
                    scope.aceAvailable = true;
                });

                /**
                 * Transforms params request attribute as valid json ;)
                 * @param params
                 * @returns {string}
                 */
                scope.convertRequestParamsToJson = function(params){

                    if(Array.isArray(params)){
                        var myJson = {};

                        angular.forEach(params, function(element){
                            myJson[element.key] = element.value;
                        });

                        return scope.convertToAce(myJson);

                    }else{
                        return scope.convertToAce(params);
                    }
                };
                /**
                 * Build params for functionality from ace
                 * @param json
                 */
                scope.convertAceToParams    = function(json,parent){

                    var myParams = [];

                    angular.forEach(json, function(value,key){
                        if(value instanceof Object){
                            myParams = myParams.concat(scope.convertAceToParams(value),parent+'.'+key);
                        }else{
                            myParams.push({
                                key :  (parent) ? parent+key : key,
                                value : value
                            })
                        }
                    });

                    return myParams;

                };


                /**
                 * Method to render well or params
                 * @param json
                 * @returns {string}
                 */
                scope.convertToAce = function(json){

                    var transform       = "",
                        previousChar    = "",
                        tabs            = [],
                        jsonString      = JSON.stringify(json);

                    angular.forEach(jsonString, function(char){
                        if(char == '{'){
                            tabs.push("\t");
                            transform += char + '\n'+tabs.join("");
                        }else if(char == ',' && (previousChar == '"'|| previousChar == 'e' || previousChar == 'd')){
                            transform += char + '\n'+tabs.join("");
                        }else if(char == '}'){
                            tabs.splice(0,1);
                            transform += '\n' +tabs.join("")+ char;
                        }else{
                            transform += char
                        }
                        previousChar = char;
                    });

                    return transform;
                };

                /**
                 * Little method to transform edited
                 * @param value
                 * @returns {*}
                 */
                scope.convertToJson = function(value){
                    if(!value){
                        return undefined
                    }else if(value instanceof Object){
                        return value;
                    }else{
                        return JSON.parse(value);
                    }
                };

                // -------------------------------------------------------------------------------------------------
                //                                                                                               CSS
                // -------------------------------------------------------------------------------------------------
                scope.$watch('height', function(height){
                    scope.currentHeight        = (height-20) || 800;
                    scope.maxHeightContainer    = height - 45;
                });
                //scope.aceMaxHeight = 260; //todo
                
                
            }
        }
    }]);