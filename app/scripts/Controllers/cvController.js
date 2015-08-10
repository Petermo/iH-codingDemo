/**
 * Created by Peter on 9-8-2015.
 */
(function(){
  ngApp.controller('cvController',['$scope', 'entityStore', function($scope, entityStore) {
    var cvObject = entityStore.get("petermoolenaar","CV");

    $scope.angularValue = cvObject;

    $scope.edit = false;
    $scope.$watch('edit',function(){
      $scope.editValue = JSON.stringify({workhistory: cvObject.workhistory, base: cvObject.base, personalia: cvObject.personalia});
    });

    $scope.saveResume = function() {
        var updatedResume = JSON.parse($scope.editValue);
        for (var name in updatedResume) {
          cvObject[name] = updatedResume[name];
        }
        cvObject.save();
    }
  }]);
})();
