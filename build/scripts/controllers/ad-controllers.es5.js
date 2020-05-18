"use strict";
(function(Controllers, undefined) {
  "use strict";
  var adapp = ADapp.Modules.ADapp;
  var pselector = ADapp.Selectors.pages;
  adapp.controller("MenusCtrl", ["$scope", "$log", "$timeout", "LanguageService", "Scopes", "LoaderService", function MenusCtrl($scope, $log, $timeout, LanguageService, Scopes, LoaderService) {
    $log.info('merge');
    $scope.getLanguageData = function(lang, callback) {
      var language = lang == 'en' ? LanguageService.getEnglish() : LanguageService.getRomanian();
      language.then(function(data) {
        if (!data) {
          toastr.error('No data!');
          return false;
        } else {
          if (typeof callback == "function") {
            callback(data);
          }
          return data;
        }
      });
    };
    $scope.init = function() {
      $scope.getLanguageData('ro', function(data) {
        startApp(data);
      });
    };
    var startApp = function(data) {
      $scope.menu = data.menuItems;
      $scope.social = data.social;
      $scope.backgroundImages = data.backgroundImage;
      $scope.pages = data.pages;
      var transEndEventNames = {
        'WebkitTransition': 'webkitTransitionEnd',
        'MozTransition': 'transitionend',
        'OTransition': 'oTransitionEnd',
        'msTransition': 'MSTransitionEnd',
        'transition': 'transitionend'
      };
      $scope.variables = {
        support: {transitions: Modernizr.csstransitions},
        transEndEventName: transEndEventNames[Modernizr.prefixed('transition')],
        isMenuOpen: false,
        current: 0
      };
      $timeout(function() {
        $scope.methods.buildStack();
        LoaderService.killAjaxLoader();
      });
      $scope.methods = {
        getOtherLanguage: function(lang) {
          $scope.getLanguageData(lang, function(data) {
            var stack = angular.element('.pages-stack');
            var menuCtrl = angular.element('.js-menu-button');
            var nav = angular.element('.pages-nav');
            menuCtrl.removeClass('menu-button--open');
            nav.removeClass('pages-nav--open');
            stack.removeClass('pages-stack--open');
            startApp(data);
          });
        },
        buildStack: function() {
          var scope = this;
          var pages = angular.element(pselector.page);
          var pagesTotal = pages.length;
          var stackPagesIdxs = scope.getStackPagesIdxs(pagesTotal);
          for (var i = 0; i < pagesTotal; ++i) {
            var page = pages[i],
                posIdx = stackPagesIdxs.indexOf(i);
            if ($scope.variables.current !== i) {
              classie.add(page, 'page--inactive');
              if (posIdx !== -1) {
                page.style.WebkitTransform = 'translate3d(0,100%,0)';
                page.style.transform = 'translate3d(0,100%,0)';
              } else {
                page.style.WebkitTransform = 'translate3d(0,75%,-300px)';
                page.style.transform = 'translate3d(0,75%,-300px)';
              }
            } else {
              classie.remove(page, 'page--inactive');
              page.style.WebkitTransform = 'translate3d(0,0,0)';
              page.style.transform = 'translate3d(0,0,0)';
            }
            page.style.zIndex = i < $scope.variables.current ? parseInt($scope.variables.current - i) : parseInt(pagesTotal + $scope.variables.current - i);
            if (posIdx !== -1) {
              page.style.opacity = 1;
            } else {
              page.style.opacity = 0;
            }
          }
        },
        initEvents: function() {
          pages.forEach(function(page) {
            var pageid = page.getAttribute('id');
            page.addEventListener('click', function(ev) {
              if (isMenuOpen) {
                ev.preventDefault();
                openPage(pageid);
              }
            });
          });
          document.addEventListener('keydown', function(ev) {
            if (!isMenuOpen)
              return;
            var keyCode = ev.keyCode || ev.which;
            if (keyCode === 27) {
              closeMenu();
            }
          });
        },
        toggleMenu: function(ev) {
          var scope = this;
          var menuCtrl = angular.element(ev.currentTarget);
          if ($scope.variables.isMenuOpen) {
            scope.closeMenu(menuCtrl);
            $scope.variables.isMenuOpen = false;
          } else {
            scope.openMenu(menuCtrl);
            $scope.variables.isMenuOpen = true;
          }
        },
        openMenu: function(menuCtrl) {
          var scope = this;
          var pages = angular.element(pselector.page);
          var pagesTotal = pages.length;
          var stack = angular.element('.pages-stack');
          var nav = angular.element('.pages-nav');
          menuCtrl.addClass('menu-button--open');
          stack.addClass('pages-stack--open');
          nav.addClass('pages-nav--open');
          var stackPagesIdxs = scope.getStackPagesIdxs(pagesTotal);
          for (var i = 0,
              len = stackPagesIdxs.length; i < len; ++i) {
            var page = pages[stackPagesIdxs[i]];
            page.style.WebkitTransform = 'translate3d(0, 75%, ' + parseInt(-1 * 200 - 50 * i) + 'px)';
            page.style.transform = 'translate3d(0, 75%, ' + parseInt(-1 * 200 - 50 * i) + 'px)';
          }
        },
        closeMenu: function(id) {
          var scope = this;
          scope.openPage();
        },
        openPage: function(id) {
          var scope = this;
          var menuCtrl = angular.element('.js-menu-button');
          var stack = angular.element('.pages-stack');
          var nav = angular.element('.pages-nav');
          var pages = angular.element(pselector.page);
          var pagesTotal = pages.length;
          var futurePage = id ? angular.element(id) : angular.element(pages[$scope.variables.current]);
          var futureCurrent = +futurePage.attr('data-index');
          var stackPagesIdxs = scope.getStackPagesIdxs(pagesTotal, futureCurrent);
          futurePage.css({
            transform: 'translate3d(0, 0, 0)',
            opacity: 1
          });
          for (var i = 0,
              len = stackPagesIdxs.length; i < len; ++i) {
            var page = pages[stackPagesIdxs[i]];
            page.style.WebkitTransform = 'translate3d(0,0,0)';
            page.style.transform = 'translate3d(0,0,0)';
          }
          if (id) {
            $scope.variables.current = futureCurrent;
          }
          menuCtrl.removeClass('menu-button--open');
          nav.removeClass('pages-nav--open');
          stack.removeClass('pages-stack--open');
          scope.buildStack();
          $scope.variables.isMenuOpen = false;
        },
        getStackPagesIdxs: function(pagesTotal, excludePageIdx) {
          var scope = this;
          var nextStackPageIdx = $scope.variables.current + 1 < pagesTotal ? $scope.variables.current + 1 : 0;
          var nextStackPageIdx_2 = $scope.variables.current + 2 < pagesTotal ? $scope.variables.current + 2 : 1;
          var idxs = [];
          var excludeIdx = excludePageIdx || -1;
          if (excludePageIdx != $scope.variables.current) {
            idxs.push($scope.variables.current);
          }
          if (excludePageIdx != nextStackPageIdx) {
            idxs.push(nextStackPageIdx);
          }
          if (excludePageIdx != nextStackPageIdx_2) {
            idxs.push(nextStackPageIdx_2);
          }
          return idxs;
        },
        onEndTransition: function(el, callback) {
          var scope = this;
          var onEndCallbackFn = function(ev) {
            if ($scope.variables.support.transitions) {
              if (ev.target != this)
                return;
              this.removeEventListener($scope.variables.transEndEventName, onEndCallbackFn);
            }
            if (callback && typeof callback === 'function') {
              callback.call(this);
            }
          };
          if ($scope.variables.support.transitions) {
            el[0].addEventListener($scope.variables.transEndEventName, onEndCallbackFn);
          } else {
            onEndCallbackFn();
          }
        }
      };
    };
  }]);
}(ADapp.Controllers = ADapp.Controllers || {}));
