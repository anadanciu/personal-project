"use strict";
(function(Services, undefined) {
  "use strict";
  var adapp = ADapp.Modules.ADapp;
  adapp.service("LanguageService", ['$http', '$q', function($http, $q) {
    this.getEnglish = function(params) {
      var deferred = $q.defer();
      $http.get("data/en/ad-en.json").success(function(data) {
        deferred.resolve(data);
      }).error(function(error) {
        deferred.resolve(error);
      });
      return deferred.promise;
    };
    this.getRomanian = function(params) {
      var deferred = $q.defer();
      $http.get("data/ro/ad-ro.json").success(function(data) {
        deferred.resolve(data);
      }).error(function(error) {
        deferred.resolve(error);
      });
      return deferred.promise;
    };
  }]);
  adapp.factory('Scopes', function($rootScope) {
    var mem = {};
    return {
      store: function(key, value) {
        $rootScope.$emit('scope.stored', key);
        mem[key] = value;
      },
      get: function(key) {
        return mem[key];
      }
    };
  });
  adapp.factory('LoaderService', ['$timeout', function($timeout) {
    return {
      message_timer: true,
      desired_delay: 100,
      setAjaxLoader: function() {
        var thisObjService = this;
        thisObjService.message_timer = $timeout(function() {
          $(".ajax-load").show();
          thisObjService.message_timer = false;
        }, thisObjService.desired_delay);
      },
      killAjaxLoader: function() {
        var thisObjService = this;
        if (thisObjService.message_timer)
          $timeout.cancel(thisObjService.message_timer);
        thisObjService.message_timer = false;
        $(".ajax-load").fadeOut(4000);
      }
    };
  }]);
}(ADapp.Services = ADapp.Services || {}));
