/**
 * Created by Peter on 9-8-2015.
 */
var io = require('socket.io')(3100);

var cvObject = {"EntityType":"CV","Id":"petermoolenaar","Version":0};
cvObject.base = {"Peter Moolenaar": "Rotterdam"};
cvObject.personalia = {
  "Place of Birth": "'s - Gravendeel",
  "Date of Birth": "August 20, 1983",
  "Current home town": "Rotterdam",
  "Contact": ["peter@moolenaar.info", "06-13070009"]
};
cvObject.workhistory = [
  "President @ student society",
  "Student assistant @ TU Delft",
  "Software engineer @ Bitbybit",
  "Software engineer @ Poolmanager",
  "The future brings new challenges!"
];

var myStore = {
  fns: {
    // The update contains the new definition of an entity
    updateModel: function (update) {

      var validUpdate = true;
      var newModel = update;

      if(validUpdate) {
        io.emit('fn',{fn:'updateModel',parameters:newModel});
      };
    },
    // Data updates come in the form of an identifier and a payload.
    updateData: function (update, originatingSocket) {
      var validUpdate = false;

      var id = update.id;
      var payload = update.payload;
      if(!myStore.data[id]) {
        myStore.data[id] = payload;
        validUpdate = true;
      } else if(myStore.data[id].Version == payload.Version)
      {
        validUpdate = true;
        myStore.data[id] = payload;
        myStore.data[id].Version++;
      }
      if(validUpdate)
      {
        updateSubscribedClients(id, payload);
      } else {
        // We reject this update and send the truth back.
        originatingSocket.emit('fn',{fn:'updateData',parameters:{id:id, payload: myStore.data[id]}});
      }
    },
    subscribe: function (query, originatingSocket) {

    },
    findEntity: function(id, originatingSocket) {
      if(myStore.data[id])
        originatingSocket.emit('fn',{fn:'updateData',parameters:{id:id, payload: myStore.data[id]}});
    }
  },
  model: {},
  data: {"petermoolenaar": cvObject}
};

var updateSubscribedClients = function(id, payload) {
  // Look up the clients that are currently doing something with object with id = id
  io.emit('fn',{fn:'updateData',parameters:{id:id, payload: payload}});// For the sake of this demo we don't filter (yet)
}

// Basic handler for the socket
io.on('connection', function(socket){
  console.log('a user connected');
  socket.emit('hello',{ehlo: "Welcome."});
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

  socket.on('fn',function(body){
    var fnName = body.fn;
    if(typeof myStore.fns[fnName] == 'function')
    {
      myStore.fns[fnName](body.parameters, socket);
    }
  });
});
