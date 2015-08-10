/**
 * Created by Peter on 9-8-2015.
 */
(function(){
  ngApp.factory('entityStore',['socketService','EntityFactory', function(socket, Entity) {
    var myStore = socket.data;
    var store = {
      get: function(id, newTypeIfNonExistent){
        if(!myStore[id]) {
          myStore[id] = new Entity(newTypeIfNonExistent, id);
          socket.findEntity(id);
        }
        return myStore[id];
      },
      set: function(entity) {

      }
    };
    return store;
  }]);
})();
