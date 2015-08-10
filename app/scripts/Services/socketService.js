/**
 * Created by Peter on 9-8-2015.
 */
(function() {
  ngApp.factory('socketService', [function () {
    var socket = io("http://localhost:3100");
    socket.on('fn', function (body) {
      var fnName = body.fn;
      if (typeof myStore.fns[fnName] == 'function') {
        myStore.fns[fnName](body.parameters);
      }
    });
    var myStore = {
      fns: {
        // The update contains the new definition of an entity
        updateModel: function (update) {
          myStore.model[update.type] = update.model;
        },
        // Data updates come in the form of an identifier and a payload.
        updateData: function (update) {
          if(myStore.data[update.id].loadProperties)
            myStore.data[update.id].loadProperties(update.payload);
          else
            myStore.data[update.id] = update.payload;
        }
      },
      model: {},
      data: {}
    };
    var outgoingMsgId = 0;
    socket.updateData = function (update) {
      socket.emit("fn", {fn: "updateData", msgId: outgoingMsgId++, parameters: update});
    };
    socket.findEntity = function (id) {
      socket.emit("fn", {fn: "findEntity", parameters: id});
    };
    socket.data = myStore.data;

    return socket;
  }]);
})();
