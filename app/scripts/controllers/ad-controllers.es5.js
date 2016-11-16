"use strict";
(function(Controllers, undefined) {
  "use strict";
  var adapp = ADapp.Modules.ADapp;
  adapp.controller("MenusCtrl", ["$scope", "$log", "LanguageService", "Scopes", function MenusCtrl($scope, $log, LanguageService, Scopes) {
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
        buildStack();
        initEvents();
      });
    };
    var support = {transitions: Modernizr.csstransitions},
        transEndEventNames = {
          'WebkitTransition': 'webkitTransitionEnd',
          'MozTransition': 'transitionend',
          'OTransition': 'oTransitionEnd',
          'msTransition': 'MSTransitionEnd',
          'transition': 'transitionend'
        },
        transEndEventName = transEndEventNames[Modernizr.prefixed('transition')],
        onEndTransition = function(el, callback) {
          var onEndCallbackFn = function(ev) {
            if (support.transitions) {
              if (ev.target != this)
                return;
              this.removeEventListener(transEndEventName, onEndCallbackFn);
            }
            if (callback && typeof callback === 'function') {
              callback.call(this);
            }
          };
          if (support.transitions) {
            el.addEventListener(transEndEventName, onEndCallbackFn);
          } else {
            onEndCallbackFn();
          }
        };
    var stack = document.querySelector('.pages-stack');
    var pages = [].slice.call(stack.children);
    var pagesTotal = pages.length;
    var current = 0;
    var menuCtrl = document.querySelector('button.menu-button');
    var nav = document.querySelector('.pages-nav');
    var navItems = [].slice.call(nav.querySelectorAll('.link--page'));
    var isMenuOpen = false;
    var startApp = function(data) {
      $scope.menu = data.menuItems;
      $scope.social = data.social;
    };
    function buildStack() {
      var stackPagesIdxs = getStackPagesIdxs();
      for (var i = 0; i < pagesTotal; ++i) {
        var page = pages[i],
            posIdx = stackPagesIdxs.indexOf(i);
        if (current !== i) {
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
        }
        page.style.zIndex = i < current ? parseInt(current - i) : parseInt(pagesTotal + current - i);
        if (posIdx !== -1) {
          page.style.opacity = parseFloat(1 - 0.1 * posIdx);
        } else {
          page.style.opacity = 0;
        }
      }
    }
    function initEvents() {
      menuCtrl.addEventListener('click', toggleMenu);
      navItems.forEach(function(item) {
        var pageid = item.getAttribute('href').slice(1);
        item.addEventListener('click', function(ev) {
          ev.preventDefault();
          openPage(pageid);
        });
      });
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
    }
    function toggleMenu() {
      if (isMenuOpen) {
        closeMenu();
      } else {
        openMenu();
        isMenuOpen = true;
      }
    }
    function openMenu() {
      classie.add(menuCtrl, 'menu-button--open');
      classie.add(stack, 'pages-stack--open');
      classie.add(nav, 'pages-nav--open');
      var stackPagesIdxs = getStackPagesIdxs();
      for (var i = 0,
          len = stackPagesIdxs.length; i < len; ++i) {
        var page = pages[stackPagesIdxs[i]];
        page.style.WebkitTransform = 'translate3d(0, 75%, ' + parseInt(-1 * 200 - 50 * i) + 'px)';
        page.style.transform = 'translate3d(0, 75%, ' + parseInt(-1 * 200 - 50 * i) + 'px)';
      }
    }
    function closeMenu() {
      openPage();
    }
    function openPage(id) {
      var futurePage = id ? document.getElementById(id) : pages[current],
          futureCurrent = pages.indexOf(futurePage),
          stackPagesIdxs = getStackPagesIdxs(futureCurrent);
      futurePage.style.WebkitTransform = 'translate3d(0, 0, 0)';
      futurePage.style.transform = 'translate3d(0, 0, 0)';
      futurePage.style.opacity = 1;
      for (var i = 0,
          len = stackPagesIdxs.length; i < len; ++i) {
        var page = pages[stackPagesIdxs[i]];
        page.style.WebkitTransform = 'translate3d(0,100%,0)';
        page.style.transform = 'translate3d(0,100%,0)';
      }
      if (id) {
        current = futureCurrent;
      }
      classie.remove(menuCtrl, 'menu-button--open');
      classie.remove(nav, 'pages-nav--open');
      onEndTransition(futurePage, function() {
        classie.remove(stack, 'pages-stack--open');
        buildStack();
        isMenuOpen = false;
      });
    }
    function getStackPagesIdxs(excludePageIdx) {
      var nextStackPageIdx = current + 1 < pagesTotal ? current + 1 : 0,
          nextStackPageIdx_2 = current + 2 < pagesTotal ? current + 2 : 1,
          idxs = [],
          excludeIdx = excludePageIdx || -1;
      if (excludePageIdx != current) {
        idxs.push(current);
      }
      if (excludePageIdx != nextStackPageIdx) {
        idxs.push(nextStackPageIdx);
      }
      if (excludePageIdx != nextStackPageIdx_2) {
        idxs.push(nextStackPageIdx_2);
      }
      return idxs;
    }
  }]);
}(ADapp.Controllers = ADapp.Controllers || {}));
