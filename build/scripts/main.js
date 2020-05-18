requirejs.config({
    paths: [{
        "jquery": "vendors/jquery.ven.js",
        "angular": "vendors/angular.ven.js",
        "appjs": "app.es5.js",
        "module": "module.es5.js",
        "controllers": "controllers/ad-controllers.es5.js",
        "directives": "directives/ad-directives.es5.js",
        "services": "services/ad-services.es5.js"
    }],

    shims: {
        "angular": {
            "deps": ["jquery"]
        },
        "appjs": {
            "deps": ["angular"]
        },
        "module": {
            "deps": ["angular"]
        },
        "directives": {
            "deps": ["module"]
        },
        "services": {
            "deps": ["module"]
        },
        "controllers": {
            "deps": ["module", "services", "directives"]
        }
    }
});

requirejs([
    'scripts/vendors/jquery.ven.js',
    'scripts/vendors/angular.ven.js',
    'scripts/controllers/ad-controllers.es5.js'], function () {
        let myApp = angular.module('myApp', []);

        myApp.controller("MenusCtrl", ["$scope", "$log", "LanguageService", "Scopes",
            function MenusCtrl($scope, $log, LanguageService, Scopes) {
                $log.info('merge');
            }]);
    });