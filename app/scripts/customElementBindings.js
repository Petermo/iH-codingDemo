/**
 * Created by Peter on 9-8-2015.
 */
(function(){
  angular.module('ng-polymer-elements').constant('$ngPolymerMappings', {
    myGreeting: {
      ngGreet: '=greeting'
    },
    myList: {
      ngItems: '=items'
    }
  });
})();
