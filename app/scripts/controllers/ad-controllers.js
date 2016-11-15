
(function(Controllers, undefined){
    "use strict";

    let adapp =  ADapp.Modules.ADapp;

    adapp.controller("MenuCtrl", ["$log", function($log) {
        $log.info('merge');
    }]);//end of MenuCtrl
}(ADapp.Controllers = ADapp.Controllers || {}))