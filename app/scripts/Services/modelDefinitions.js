/**
 * Created by Peter on 9-8-2015.
 */
(function() {
  'use strict';
  ngApp.factory('modelDefinitions',[function() {
    var definitionList = new Array();

      return {
        get: function(type){
          var baseEntity = {
            EntityType: { type: String },
            Id: { type: String },
            Version: { type: Number }
          }
          switch(type) {
            case "Entity":
                return baseEntity;
                  break;
            case "TextValue":
              var textValue = baseEntity;
              textValue.Value = { type: String };
              return textValue;
                  break;
            case "CV":
              var cv = baseEntity;
              cv.base = { type: Object };
              cv.personalia = { type: Object };
              cv.workhistory = { type: Object };
              return cv;
              break;
            default:
                  break;
          }
        },
        getTypes: function() {
          return ["Entity", "TextValue", "CV"];
        }
      }
  }]);
})();
