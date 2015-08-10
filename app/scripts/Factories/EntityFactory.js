/**
 * Created by Peter on 9-8-2015.
 */
(function() {
  'use strict';

  ngApp.factory('EntityFactory', ['$timeout','$rootScope','modelDefinitions','socketService', function ($timeout, $rootScope, modelDefinitions, socket) {
    function Entity(newType, id) {
      var entity = {};

      // Here we define the internal properties.
      entity._structure = null;
      entity._metadata = null;
      entity._internalPropertyList = {};
      entity._loaded = false;
      entity._originalValues = {}; // Values as set by loadProperties
      entity._currentChanges = []; // Values as set by a setter() call on a property

      // Add all the class methods to the collection.
      Entity.injectClassMethods(entity);

      if (typeof newType != "undefined" && newType != null) {
        if (!id)
          id = createUUID();
        entity.EntityType = newType;
        entity.updateDefinition();
        entity.Id = id;
        entity.Version = 0;
        // Reset changes
        entity._currentChanges.length = 0;
      }
      // Return the new collection object.
      return (entity);
    }

    // Define the static methods.
    Entity.injectClassMethods = function (collection) {
      // Loop over all the prototype methods and add them
      // to the new collection.
      for (var method in Entity.prototype) {
        // Make sure this is a local method.
        if (Entity.prototype.hasOwnProperty(method)) {
          // Add the method to the collection.
          collection[method] = Entity.prototype[method];
        }
      }
      // Return the updated collection.
      return (collection);
    };
    // I determine if the given object is an Entity.
    Entity.isEntity = function (value) {
      if (value === null || typeof value != "object" || Array.isArray(value))
        return false;

      // Get it's stringified version.
      var stringValue = value.toString.call(value);
      // Check to see if the string representation denotes entity.
      return (stringValue.toLowerCase() === "[object entity]");
    };
    // Define the class methods.
    Entity.prototype = {
      toString: function () {
        return "[object Entity]";
      },
      updateDefinition: function () {
        var self = this;

        self._structure = modelDefinitions.get(self.EntityType);
        for (var propertyName in self._structure)
          self._createOrUpdateProperty(propertyName, undefined);
      },
      loadProperties: function (propertyObject) {
        var self = this;

        if (propertyObject.$meta) {
          self._metadata = propertyObject.$meta;
        }
        for (var propertyName in propertyObject) {
          if (typeof self._structure[propertyName] == "undefined")
            continue; // This one doesn't contain that property

          // This will use the setter defined in _createOrUpdateProperty
          self[propertyName] = propertyObject[propertyName];
          if(!$rootScope.$$phase)
            $rootScope.$digest();
        }
      },
      _createOrUpdateProperty: function (name, value) {
        var self = this;
        if(this[name])
          self._internalPropertyList[name] = this[name];
        Object.defineProperty(this, name, {
          enumerable: true,
          configurable: true,
          get: function () {
            // ToDo: getter when the property is a relation
            return self._internalPropertyList[name];
          },
          set: function (newVal) { // Keep in mind; as little complexity as possible should be in the set function! Only use this for normal properties.
            if(typeof newVal != 'undefined' && newVal != self._internalPropertyList[name]) {
              self._internalPropertyList[name] = newVal;
              self._currentChanges.push({property: name, value: newVal});
            }
          }
        });
      },
      save: function (callback) {
        var self = this;
        if(self._currentChanges.length > 0) {
          socket.updateData({id: self._internalPropertyList.Id, payload: self._internalPropertyList});
          self._currentChanges.length = 0;
        }
      },
      // Delete this entity, push a delete call to the backend and wait. (Allowing an optional callback for the calling controller?)
      del: function () {
        Object.freeze(this);
        return;
      }
    };
    return Entity;
  }]);
})();
