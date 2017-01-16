/*-------------------------------------------------------------------------------------------------------------------------------*/
/*This is main JS file that contains custom style rules used in this template*/
/*-------------------------------------------------------------------------------------------------------------------------------*/
/* Template Name: "EX ZO"*/
/* Version: 1.0 Initial Release*/
/* Build Date: 06-02-2016*/
/* Author: UnionAgency*/
/* Copyright: (C) 2016 */
/*-------------------------------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------------*/
/* TABLE OF CONTENTS: */
/*--------------------------------------------------------*/
/* 01 - VARIABLES */
/* 02 - page calculations */
/* 03 - function on document ready */
/* 04 - function on page load */
/* 05 - function on page resize */
/* 06 - function on page scroll */
/* 07 - swiper sliders */
/* 08 - buttons, clicks, hovers */

var _functions = {};

$(function() {

    "use strict";

    /*================*/
    /* 01 - VARIABLES */
    /*================*/
    var swipers = [],
        winW, winH, headerH, winScr, footerTop, _isresponsive, _ismobile = navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i);

    /*========================*/
    /* 02 - page calculations */
    /*========================*/
    _functions.pageCalculations = function() {
        winW = $(window).width();
        winH = $(window).height();
        headerH = $('.header-empty-space').height();
        $('.page-height').css({
            'height': (winH - headerH <= 500) ? 500 : (winH - headerH)
        });
    };
    /*=================================*/
    /* 03 - function on document ready */
    /*=================================*/
    if (_ismobile) $('body').addClass('mobile');
    _functions.pageCalculations();

    /*============================*/
    /* 04 - function on page load */
    /*============================*/
    $(window).load(function() {
        $('body').addClass('loaded');
        $('#loader-wrapper').fadeOut();
    });

    /*==============================*/
    /* 05 - function on page resize */
    /*==============================*/
    _functions.resizeCall = function() {
        _functions.pageCalculations();
    };
    if (!_ismobile) {
        $(window).resize(function() {
            _functions.resizeCall();
        });
    } else {
        window.addEventListener("orientationchange", function() {
            _functions.resizeCall();
        }, false);
    }

    /*==============================*/
    /* 06 - function on page scroll */
    /*==============================*/
    $(window).scroll(function() {
        _functions.scrollCall();
    });

    _functions.scrollCall = function() {
        winScr = $(window).scrollTop();
        if (winScr > 300) $('header').addClass('scrolled');
        else $('header').removeClass('scrolled');
    };

    /*==============================*/
    /* 08 - buttons, clicks, hovers */
    /*==============================*/

    //open and close responsive menu
    $('.hamburger-icon, .nav-close-layer').on('click', function() {
        $('.nav-wrapper').toggleClass('active');
    });

    //toggle menu in responsive mode
    $('.menu-toggle').on('click', function() {
        $(this).toggleClass('active').next().slideToggle();
    });

    //toggle geader search
    $('.toggle-search, .header-search-wrapper .button-close').on('click', function() {
        $('.header-search-wrapper').toggleClass('active');
    });

    //open and close popup
    $(document).on('click', '.open-popup', function(e) {
        e.preventDefault();
        $('.popup-content').removeClass('active');
        $('.popup-wrapper, .popup-content[data-rel="' + $(this).data('rel') + '"]').addClass('active');
        $('html').addClass('overflow-hidden');
        return false;
    });

    $(document).on('click', '.popup-wrapper .button-close, .popup-wrapper .layer-close', function(e) {
        e.preventDefault();
        if ($('.video-popup').hasClass('active')) $('.video-popup .popup-iframe').html('');
        $('.popup-wrapper, .popup-content').removeClass('active');
        $('html').removeClass('overflow-hidden');
        return false;
    });

    //open ajax product popup
    //preload
    function showprogress() {
        if (document.images.length === 0) {
            return false;
        }
        var loaded = 0;
        for (var i = 0; i < document.images.length; i++) {
            if (document.images[i].complete) {
                loaded++;
            }
        }
        percentage = (loaded / document.images.length);
    }
    var ID, percentage;

    $(document).on('click', '.open-popup-ajax', function(e) {
        e.preventDefault();
        $('html').addClass('overflow-hidden');
        $('.popup-content').removeClass('active');
        $('.popup-wrapper').addClass('active');
        var url = $(this).attr('href');
        $.ajax({
            type: "GET",
            async: true,
            url: url,
            success: function(response) {
                var responseObject = $($.parseHTML(response));
                $('.ajax-popup .swiper-container').each(function() {
                    swipers['swiper-' + $(this).attr('id')].destroy();
                    delete swipers['swiper-' + $(this).attr('id')];
                });
                $('.ajax-popup').remove();
                $('.popup-wrapper').append(responseObject.addClass('ajax-popup'));
                ID = window.setInterval(function() {
                    showprogress();
                    if (percentage == 1) {
                        window.clearInterval(ID);
                        percentage = 0;
                        responseObject.addClass('active');
                    }
                }, 300);
            }
        });
        return false;
    });

    //video popup
    $('.open-video').on('click', function(e) {
        e.preventDefault();
        $('.video-popup .popup-iframe').html('<iframe src="' + $(this).data('src') + '"></iframe>');
        $('.popup-wrapper').addClass('active');
        $('.video-popup').addClass('active');
    });

    //slider - product preview shortcode
    $(document).on('click', '.product-preview-shortcode .sidebar .entry', function() {
        var index = $(this).closest('.sidebar').find('.entry').index(this);
        $(this).closest('.sidebar').find('.active').removeClass('active');
        $(this).addClass('active');
        $(this).closest('.product-preview-shortcode').find('.preview .entry.active').removeClass('active');
        $(this).closest('.product-preview-shortcode').find('.preview .entry').eq(index).addClass('active');
    });

    //product shortcode 1 color click
    $(document).on('click', '.color-selection .entry', function() {
        $(this).parent().find('.entry').removeClass('active');
        $(this).addClass('active');
    });

    //tabs
    var tabsFinish = 0;
    $(document).on('click', '.tabs-block .tab-menu', function() {
        if ($(this).hasClass('active') || tabsFinish) return false;
        tabsFinish = 1;
        var tabsWrapper = $(this).closest('.tabs-block'),
            tabsMenu = tabsWrapper.find('.tab-menu'),
            tabsItem = tabsWrapper.find('.tab-entry'),
            index = tabsMenu.index(this);
        tabsWrapper.find('.tabulation-title').text($(this).text());
        tabsItem.filter(':visible').fadeOut(function() {
            tabsItem.eq(index).css({
                'display': 'block',
                'opacity': '0'
            });
            tabsItem.eq(index).find('.swiper-container').each(function() {
                swipers['swiper-' + $(this).attr('id')].update();
            });
            $(window).resize();
            tabsItem.eq(index).animate({
                'opacity': '1'
            }, function() {
                tabsFinish = 0;
            });
        });
        tabsMenu.removeClass('active');
        $(this).addClass('active');
    });

    $(document).on('click', '.tabulation-title', function() {
        $(this).toggleClass('active');
    });

    //categories
    $('.categories-menu .toggle').on('click', function() {
        $(this).toggleClass('active').next().slideToggle();
    });

    //products view toggle
    $('.toggle-products-view').on('click', function() {
        if ($(this).hasClass('active')) return false;
        $(this).parent().find('.active').removeClass('active');
        $(this).addClass('active');
        $('.products-content').addClass('notransition');
        $('.products-content').toggleClass('view-inline');
        setTimeout(function() {
            $('.products-content').removeClass('notransition');
        }, 0);
    });

    //rating
    $(document).on('click', '.rate-wrapper.set .fa', function() {
        $(this).parent().find('.fa-star').removeClass('fa-star').addClass('fa-star-o');
        $(this).removeClass('fa-star-o').prevAll().removeClass('fa-star-o');
        $(this).addClass('fa-star').prevAll().addClass('fa-star');
    });

    //remove item from cart
    $('.cart-entry-description .button-close').on('click', function() {
        if ($(this).closest('.cart-overflow').find('.cart-entry').length == 1) $(this).closest('.cart-entry').replaceWith('<h4 class="h4">Your shopping cart is empty</h4>');
        else $(this).closest('.cart-entry').remove();
    });

    //file remove button in input file block
    $('.input-file-wrapper .file-remove').on('click', function() {
        var filewrapper = $(this).closest('.input-file-wrapper'),
            textwrapper = filewrapper.find('.simple-input');
        filewrapper.removeClass('active');
        textwrapper.text(textwrapper.data('placeholder'));
        filewrapper.find('input').val('');
    });

    //checkout - toggle wrapper checkbox
    $('.checkbox-toggle-title input').on('change', function() {
        $('.checkbox-toggle-wrapper').slideToggle();
    });

});
