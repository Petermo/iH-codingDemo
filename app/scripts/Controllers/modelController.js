/**
 * Created by Peter on 9-8-2015.
 */
(function(){
  ngApp.controller('modelController',['$scope','modelDefinitions',function($scope, modelDefinitions) {
    $scope.items = modelDefinitions.getTypes();
  }]);
})();
