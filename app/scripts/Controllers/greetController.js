/**
 * Created by Peter on 9-8-2015.
 */
(function(){
  ngApp.controller('greetController',['$scope','entityStore',function($scope, entityStore) {
    var greetObject = entityStore.get("greeting","TextValue");
    $scope.angularValue = greetObject;

    $scope.$watch('angularValue.Value',function(newValue, oldValue) {
      //greetObject.Value = newValue;
      greetObject.save();
    });
    /*$scope.$watch(function(){
      if(greetObject.Value != $scope.angularValue)
        return greetObject.Value;
      else
        return;
    },function(newValue, oldValue){
      $scope.angularValue = newValue;
    })*/
  }]);
})();
