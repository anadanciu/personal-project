"use strict";
(function(ADapp, undefined) {
  "use strict";
  ADapp.Version = "1.0.0";
  ADapp.PartialsPath = "app/scripts/views";
  ADapp.Services = {};
  ADapp.Configs = {};
  ADapp.Modules = {};
  ADapp.Controllers = {};
  ADapp.Directives = {};
  ADapp.Storage = {
    set: function(name, value) {
      localStorage.setItem(name, JSON.stringify(value));
    },
    get: function(name) {
      var nameObj = localStorage.getItem(name);
      if (nameObj && nameObj != "undefined") {
        return JSON.parse(nameObj);
      }
      return false;
    },
    remove: function(name) {
      localStorage.removeItem(name);
    }
  };
  ADapp.Utils = {searchObj: function(arr, prop, name) {
      for (var i = 0; i < arr.length; i++) {
        if (arr[i][prop] == name) {
          return arr[i];
        }
      }
      return false;
    }};
  Array.prototype.move = function(from, to) {
    this.splice(to, 0, this.splice(from, 1)[0]);
  };
  ADapp.Selectors = {
    basic: {
      container: '.container',
      bodyPage: 'body',
      nameHiddenClass: "hidden",
      nameDisabledClass: "vrui-is-disabled",
      nameTransparentClass: "vrui-is-transparent",
      nameInsetBorderClass: 'has-inset-border'
    },
    pages: {
      stack: '.js-stack',
      page: '.js-page'
    }
  };
}(window.ADapp = window.ADapp || {}));
