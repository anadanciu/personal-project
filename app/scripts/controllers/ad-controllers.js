
(function(Controllers, undefined) {
    "use strict";
    let adapp = ADapp.Modules.ADapp;
    let pselector = ADapp.Selectors.pages;

    adapp.controller("MenusCtrl", ["$scope", "$log", "$timeout", "LanguageService", "Scopes",
        function MenusCtrl($scope, $log, $timeout, LanguageService, Scopes) {
            $log.info('merge');

            $scope.getLanguageData = function(lang, callback) {
                let language = lang == 'en' ? LanguageService.getEnglish() : LanguageService.getRomanian();
                language.then(function(data) {
                    if (!data) {
                        toastr.error('No data!');
                        return false;
                    }
                    else {
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


            let startApp = (data) => {

                $scope.menu = data.menuItems;
                $scope.social = data.social;

                let transEndEventNames = {
                    'WebkitTransition': 'webkitTransitionEnd',
                    'MozTransition': 'transitionend',
                    'OTransition': 'oTransitionEnd',
                    'msTransition': 'MSTransitionEnd',
                    'transition': 'transitionend'
                };
                $scope.variables = {
                    support: {
                        transitions: Modernizr.csstransitions
                    },
                    // transition end event name                   
                    transEndEventName: transEndEventNames[Modernizr.prefixed('transition')],
                    // check if menu is open
                    isMenuOpen: false,
                    current: 0
                }

                $timeout(() => {
                });

                $scope.methods = {
                    buildStack() {
                        let scope = this;
                        let pages = angular.element(pselector.page);
                        let pagesTotal = pages.length;
                        let stackPagesIdxs = scope.getStackPagesIdxs(pagesTotal);
                        // total number of page elements

                        // set z-index, opacity, initial transforms to pages and add class page--inactive to all except the current one
                        for (var i = 0; i < pagesTotal; ++i) {
                            var page = pages[i],
                                posIdx = stackPagesIdxs.indexOf(i);

                            if ($scope.variables.current !== i) {
                                classie.add(page, 'page--inactive');

                                if (posIdx !== -1) {
                                    // visible pages in the stack
                                    page.style.WebkitTransform = 'translate3d(0,100%,0)';
                                    page.style.transform = 'translate3d(0,100%,0)';
                                    // page.style.WebkitTransform = 'translate3d(0,0,0)';
                                    // page.style.transform = 'translate3d(0,0,0)';
                                }
                                else {
                                    // invisible pages in the stack
                                    page.style.WebkitTransform = 'translate3d(0,75%,-300px)';
                                    page.style.transform = 'translate3d(0,75%,-300px)';
                                    // page.style.WebkitTransform = 'translate3d(0,0,0)';
                                    // page.style.transform = 'translate3d(0,0,0)';
                                }
                            }
                            else {
                                classie.remove(page, 'page--inactive');
                                page.style.WebkitTransform = 'translate3d(0,0,0)';
                                page.style.transform = 'translate3d(0,0,0)';
                            }

                            page.style.zIndex = i < $scope.variables.current ? parseInt($scope.variables.current - i) : parseInt(pagesTotal + $scope.variables.current - i);

                            if (posIdx !== -1) {
                                page.style.opacity = 1; //parseFloat(1 - 0.1 * posIdx);
                            }
                            else {
                                page.style.opacity = 0;
                            }
                        }
                    },
                    // event binding
                    initEvents() {
                        //     // menu button click
                        //     menuCtrl.addEventListener('click', toggleMenu);

                        //     // navigation menu clicks
                        //     navItems.forEach(function(item) {
                        //         // which page to open?
                        //         var pageid = item.getAttribute('href').slice(1);
                        //         item.addEventListener('click', function(ev) {
                        //             ev.preventDefault();
                        //             openPage(pageid);
                        //         });
                        //     });

                        // clicking on a page when the menu is open triggers the menu to close again and open the clicked page
                        pages.forEach(function(page) {
                            var pageid = page.getAttribute('id');
                            page.addEventListener('click', function(ev) {
                                if (isMenuOpen) {
                                    ev.preventDefault();
                                    openPage(pageid);
                                }
                            });
                        });

                        // keyboard navigation events
                        document.addEventListener('keydown', function(ev) {
                            if (!isMenuOpen) return;
                            var keyCode = ev.keyCode || ev.which;
                            if (keyCode === 27) {
                                closeMenu();
                            }
                        });
                    },
                    // toggle menu fn
                    toggleMenu(ev) {
                        let scope = this;
                        let menuCtrl = angular.element(ev.currentTarget);

                        if ($scope.variables.isMenuOpen) {
                            scope.closeMenu(menuCtrl);
                        }
                        else {
                            scope.openMenu(menuCtrl);
                            $scope.variables.isMenuOpen = true;
                        }
                    },
                    // opens the menu
                    openMenu(menuCtrl) {
                        let scope = this;
                        let pages = angular.element(pselector.page);
                        let pagesTotal = pages.length;
                        // the pages wrapper
                        let stack = angular.element('.pages-stack');

                        // the navigation wrapper
                        let nav = angular.element('.pages-nav');

                        // toggle the menu button
                        menuCtrl.addClass('menu-button--open');
                        // stack gets the class "pages-stack--open" to add the transitions
                        stack.addClass('pages-stack--open');
                        // reveal the menu
                        nav.addClass('pages-nav--open');

                        // now set the page transforms
                        var stackPagesIdxs = scope.getStackPagesIdxs(pagesTotal);
                        for (var i = 0, len = stackPagesIdxs.length; i < len; ++i) {
                            var page = pages[stackPagesIdxs[i]];
                            page.style.WebkitTransform = 'translate3d(0, 75%, ' + parseInt(-1 * 200 - 50 * i) + 'px)'; // -200px, -230px, -260px
                            page.style.transform = 'translate3d(0, 75%, ' + parseInt(-1 * 200 - 50 * i) + 'px)';
                        }
                    },
                    // closes the menu
                    closeMenu(id) {
                        let scope = this;
                        // same as opening the current page again
                        scope.openPage();
                    },
                    // opens a page
                    openPage(id) {
                        let scope = this;
                        let menuCtrl = angular.element('.js-menu-button');
                        let stack = angular.element('.pages-stack');
                        let nav = angular.element('.pages-nav');
                        let pages = angular.element(pselector.page);
                        let pagesTotal = pages.length;
                        let futurePage = id ? angular.element(id) : angular.element(pages[$scope.variables.current]);
                        let futureCurrent = +futurePage.attr('data-index');
                        let stackPagesIdxs = scope.getStackPagesIdxs(pagesTotal, futureCurrent);

                        // set transforms for the new current page
                        // futurePage[0].style.WebkitTransform = 'translate3d(0, 0, 0)';
                        futurePage.css({
                            transform: 'translate3d(0, 50%, 0)',
                            opacity: 1
                        });

                        // set transforms for the other items in the stack
                        for (var i = 0, len = stackPagesIdxs.length; i < len; ++i) {
                            var page = pages[stackPagesIdxs[i]];
                            page.style.WebkitTransform = 'translate3d(0,50%,0)';
                            page.style.transform = 'translate3d(0,50%,0)';
                            // page.style.WebkitTransform = 'translate3d(0,0,0)';
                            // page.style.transform = 'translate3d(0,0,0)';
                        }

                        // set current
                        if (id) {
                            $scope.variables.current = futureCurrent;
                        }

                        // close menu..
                        menuCtrl.removeClass('menu-button--open');
                        nav.removeClass('pages-nav--open');

                        stack.removeClass('pages-stack--open');
                        // reorganize stack
                        scope.buildStack();
                        $scope.variables.isMenuOpen = false;
                        // scope.onEndTransition(futurePage, function() {
                        //     stack.removeClass('pages-stack--open');
                        //     // reorganize stack
                        //     scope.buildStack();
                        //     $scope.variables.isMenuOpen = false;
                        // });
                    },
                    getStackPagesIdxs(pagesTotal, excludePageIdx) {
                        // gets the current stack pages indexes. If any of them is the excludePage then this one is not part of the returned array
                        let scope = this;
                        let nextStackPageIdx = $scope.variables.current + 1 < pagesTotal ? $scope.variables.current + 1 : 0;
                        let nextStackPageIdx_2 = $scope.variables.current + 2 < pagesTotal ? $scope.variables.current + 2 : 1;
                        let idxs = [];

                        let excludeIdx = excludePageIdx || -1;

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
                    onEndTransition(el, callback) {
                        let scope = this;
                        let onEndCallbackFn = function(ev) {
                            if ($scope.variables.support.transitions) {
                                if (ev.target != this) return;
                                this.removeEventListener($scope.variables.transEndEventName, onEndCallbackFn);
                            }
                            if (callback && typeof callback === 'function') { callback.call(this); }
                        };
                        if ($scope.variables.support.transitions) {
                            el[0].addEventListener($scope.variables.transEndEventName, onEndCallbackFn);
                        }
                        else {
                            onEndCallbackFn();
                        }
                    }

                };//end of methods

                $scope.methods.buildStack();
                //$scope.methods.initEvents();

            }//end of startApp


        }]);//end of MenuCtrl

} (ADapp.Controllers = ADapp.Controllers || {}));