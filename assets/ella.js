(function($) {
  var body = $('body'),
      doc = $(document),
      html = $('html'),
      win = $(window);
  var wishListsArr = localStorage.getItem('items') ? JSON.parse(localStorage.getItem('items')) : [];

  localStorage.setItem('items', JSON.stringify(wishListsArr));

  if (wishListsArr.length) {
    wishListsArr = JSON.parse(localStorage.getItem('items'));
  };
  if ($(".collection-sidebar")) {
    //work only in collection page
    History.Adapter.bind(window, 'statechange', function() {
      var State = History.getState();
      if (!ella.isSidebarAjaxClick) {
        ella.sidebarParams();
        var newurl = ella.sidebarCreateUrl();
        ella.sidebarGetContent(newurl);
        ella.reActivateSidebar();
      }
      ella.isSidebarAjaxClick = false;
    });
  }

  if (window.use_color_swatch) {
    $('.swatch :radio').change(function() {
      var optionIndex = $(this).closest('.swatch').attr('data-option-index');
      var optionValue = $(this).val();
      $(this)
      .closest('form')
      .find('.single-option-selector')
      .eq(optionIndex)
      .val(optionValue)
      .trigger('change');
    });

    // (c) Copyright 2014 Caroline Schnapp. All Rights Reserved. Contact: mllegeorgesand@gmail.com
    // See http://docs.shopify.com/manual/configuration/store-customization/advanced-navigation/linked-product-options

    Shopify.productOptionsMap = {};
    Shopify.quickViewOptionsMap = {};

    Shopify.updateOptionsInSelector = function(selectorIndex, wrapperSlt) {

      Shopify.optionsMap = wrapperSlt === '.product' ? Shopify.productOptionsMap : Shopify.quickViewOptionsMap;

      switch (selectorIndex) {
        case 0:
          var key = 'root';
          var selector = $(wrapperSlt + '.single-option-selector:eq(0)');
          break;
        case 1:
          var key = $(wrapperSlt + ' .single-option-selector:eq(0)').val();
          var selector = $(wrapperSlt + ' .single-option-selector:eq(1)');
          break;
        case 2:
          var key = $(wrapperSlt + ' .single-option-selector:eq(0)').val();
          key += ' / ' + $(wrapperSlt + ' .single-option-selector:eq(1)').val();
          var selector = $(wrapperSlt + ' .single-option-selector:eq(2)');
      }

      var initialValue = selector.val();

      selector.empty();

      var availableOptions = Shopify.optionsMap[key];

      if (availableOptions && availableOptions.length) {
        for (var i = 0; i < availableOptions.length; i++) {
          var option = availableOptions[i];

          var newOption = $('<option></option>').val(option).html(option);

          selector.append(newOption);
        }

        $(wrapperSlt + ' .swatch[data-option-index="' + selectorIndex + '"] .swatch-element').each(function() {
          if ($.inArray($(this).attr('data-value'), availableOptions) !== -1) {
            $(this).removeClass('soldout').find(':radio').removeAttr('disabled', 'disabled').removeAttr('checked');
          }
          else {
            $(this).addClass('soldout').find(':radio').removeAttr('checked').attr('disabled', 'disabled');
          }
        });

        if ($.inArray(initialValue, availableOptions) !== -1) {
          selector.val(initialValue);
        }

        //         selector.trigger('change');
      };
    };

    Shopify.linkOptionSelectors = function(product, wrapperSlt) {
      // Building our mapping object.
      Shopify.optionsMap = wrapperSlt === '.product' ? Shopify.productOptionsMap : Shopify.quickViewOptionsMap;

      for (var i = 0; i < product.variants.length; i++) {
        var variant = product.variants[i];

        if (variant.available) {
          // Gathering values for the 1st drop-down.
          Shopify.optionsMap['root'] = Shopify.optionsMap['root'] || [];

          Shopify.optionsMap['root'].push(variant.option1);
          Shopify.optionsMap['root'] = Shopify.uniq(Shopify.optionsMap['root']);

          // Gathering values for the 2nd drop-down.
          if (product.options.length > 1) {
            var key = variant.option1;
            Shopify.optionsMap[key] = Shopify.optionsMap[key] || [];
            Shopify.optionsMap[key].push(variant.option2);
            Shopify.optionsMap[key] = Shopify.uniq(Shopify.optionsMap[key]);
          }

          // Gathering values for the 3rd drop-down.
          if (product.options.length === 3) {
            var key = variant.option1 + ' / ' + variant.option2;
            Shopify.optionsMap[key] = Shopify.optionsMap[key] || [];
            Shopify.optionsMap[key].push(variant.option3);
            Shopify.optionsMap[key] = Shopify.uniq(Shopify.optionsMap[key]);
          }
        }
      };

      // Update options right away.
      Shopify.updateOptionsInSelector(0, wrapperSlt);

      if (product.options.length > 1) Shopify.updateOptionsInSelector(1, wrapperSlt);
      if (product.options.length === 3) Shopify.updateOptionsInSelector(2, wrapperSlt);

      // When there is an update in the first dropdown.
      $(wrapperSlt + " .single-option-selector:eq(0)").change(function() {
        Shopify.updateOptionsInSelector(1, wrapperSlt);
        if (product.options.length === 3) Shopify.updateOptionsInSelector(2, wrapperSlt);
        return true;
      });

      // When there is an update in the second dropdown.
      $(wrapperSlt + " .single-option-selector:eq(1)").change(function() {
        if (product.options.length === 3) Shopify.updateOptionsInSelector(2, wrapperSlt);
        return true;
      });

    };
  }

  $(document).ready(function() {
    ella.init();
  });

  $(window).resize(function() {
    ella.initMobileMenu();
    //       ella.initDropdownAccount();
    //ella.initMobileSidebar();
    ella.initResizeImage();
  });

  $(window).scroll(function() {
    if ($(this).scrollTop() > 200) {
      $('#back-top').fadeIn();
    } else {
      $('#back-top').fadeOut();
    }
  });

  if (!$(".header-mobile").is(":visible")) {
    $(document).on('click touchstart', function(e) {
      var quickview = $(".quick-view");
      var dropdowncart = $(".dropdown-cart");
      var cartButton = $(".cartToggle");
      var newsletter = $("#email-modal .modal-window");
      var searchBar = $(".nav-search");
      //close quickview and dropdowncart when clicking outside
      if (!quickview.is(e.target) && quickview.has(e.target).length === 0 && !dropdowncart.is(e.target) && dropdowncart.has(e.target).length === 0 && !cartButton.is(e.target) && cartButton.has(e.target).length === 0 && !newsletter.is(e.target) && newsletter.has(e.target).length === 0 && !searchBar.is(e.target) && searchBar.has(e.target).length === 0) {
        ella.closeQuickViewPopup();
        ella.closeDropdownCart();
        ella.closeEmailModalWindow();
        ella.closeDropdownSearch();
      }
    });
  }

  $(document).keyup(function(e) {
    if (e.keyCode == 27) {
      ella.closeQuickViewPopup();
      ella.closeDropdownCart();
      ella.closeDropdownSearch();
      clearTimeout(ella.ellaTimeout);
      if ($('.modal').is(':visible')) {
        $('.modal').fadeOut(500);
      }
    }
  });

  var ella = {
    ellaTimeout: null,
    isSidebarAjaxClick: false,
    init: function() {
      this.initColorSwatchGrid();
      this.initResizeImage();
      //           	this.initDropdownAccount()
      this.initMobileMenu();
      if($('.template-index').length){
      	this.initNavigationscroll();
        this.initInfiniteScrollingHomepage();
      }
      
      this.initRecentlyFix();
      this.initMageMenu();
      this.initBackTop();
      this.initSidebar();
      this.sidebarMb();
      this.initMobileSidebar();
      this.initScrollTop();
      this.initQuickView();
      this.initCloudzoom();
      this.initProductMoreview();
      this.initAddToCart();
      this.initModal();
      this.initProductAddToCart();
      this.initDropDownCart();
      this.initToggleCollectionPanel();
      this.initInfiniteScrolling();
      this.initCartQty();
      this.hide_filter();
      this.initWishLists();
      this.initWishListIcons();
      this.doAddOrRemoveWishlish();
      this.checkbox_checkout();
      this.cookie_popup();
    },

    cookie_popup: function() {
      $('#accept-cookies').show();
      if ($.cookie('cookieMessage') == 'closed') {
        $('#accept-cookies').remove();
      }

      $('#accept-cookies .btn').bind('click',function(){
        $('#accept-cookies').remove();
        $.cookie('cookieMessage', 'closed', {expires:1, path:'/'});
      });

      $('#accept-cookies .close').bind('click',function(){
        $('#accept-cookies').remove();
      });
    },
    
    sidebarMapTagEvents: function() {
      $('.sidebar-tag a:not(".clear"), .sidebar-tag label').click(function(e) {
        var currentTags = [];
        if (Shopify.queryParams.constraint) {
          currentTags = Shopify.queryParams.constraint.split('+');
        }

        //one selection or multi selection
        if (!window.enable_sidebar_multiple_choice && !$(this).prev().is(":checked")) {
          //remove other selection first
          var otherTag = $(this).parents('.sidebar-tag').find("input:checked");
          if (otherTag.length > 0) {
            var tagName = otherTag.val();
            if (tagName) {
              var tagPos = currentTags.indexOf(tagName);
              if (tagPos >= 0) {
                //remove tag
                currentTags.splice(tagPos, 1);
              }
            }
          }
        }

        var tagName = $(this).prev().val();
        if (tagName) {
          var tagPos = currentTags.indexOf(tagName);
          if (tagPos >= 0) {
            //tag already existed, remove tag
            currentTags.splice(tagPos, 1);
          } else {
            //tag not existed
            currentTags.push(tagName);
          }
        }
        if (currentTags.length) {
          Shopify.queryParams.constraint = currentTags.join('+');
        } else {
          delete Shopify.queryParams.constraint;
        }
        ella.sidebarAjaxClick();
        e.preventDefault();
      });
    },
    initCartQty: function() {
      if (jQuery('body').hasClass('template-cart')) {
        $('.button .fa').click(function(event) {
          event.preventDefault();
          jQuery(this).each(function() {
            var productItem = jQuery(this).parents('.product-item');
            var productId = jQuery(productItem).attr('id');
            productId = productId.match(/\d+/g);

            var oldValue = jQuery('#updates_' + productId + '').val(),
                newVal = 1;

            if (jQuery(this).hasClass("fa-angle-up")) {
              newVal = parseInt(oldValue) + 1;
            } else if (oldValue > 1) {
              newVal = parseInt(oldValue) - 1;
            }

            jQuery('#updates_' + productId + '').val(newVal);

          });
          return false;
        });
      };
    },
    sidebarMapCategories: function() {
      $(".sidebar-links a").click(function(e) {
        if (!$(this).hasClass('active')) {
          delete Shopify.queryParams.q;
          ella.sidebarAjaxClick($(this).attr('href'));

          //activate selected category
          $(".sidebar-links a.active").removeClass("active");
          $(this).addClass("active");

          var par = $(this).parent();
          if (par.hasClass("dropdown") && !par.hasClass("click")) {
            $(".dropdown.click").removeClass("click");
            par.addClass("click");                  	  
          }
        }
        e.preventDefault();
      });
    },
    sidebarMapView: function() {
      $(".view-mode > span").click(function(e) {
        if (!$(this).hasClass("active")) {
          var paging = $(".filter-show > button span").text();
          if ($(this).hasClass("list")) {
            Shopify.queryParams.view = "list" + paging;
          } else {
            Shopify.queryParams.view = paging;
          }

          ella.sidebarAjaxClick();
          $(".view-mode span.active").removeClass("active");
          $(this).addClass("active");
        }
        e.preventDefault();
      });
    },
    sidebarMapShow: function() {
      $(".filter-show a").click(function(e) {
        if (!$(this).parent().hasClass("active")) {
          var thisPaging = $(this).attr('href');

          var view = $(".view-mode a.active").attr("href");
          if (view == "list") {
            Shopify.queryParams.view = "list" + thisPaging;
          } else {
            Shopify.queryParams.view = thisPaging;
          }

          ella.sidebarAjaxClick();
          $(".filter-show > button span").text(thisPaging);
          $(".filter-show li.active").removeClass("active");
          $(this).parent().addClass("active");
        }
        e.preventDefault();
      });
    },
    sidebarInitToggle: function() {
      if ($(window).width() > 991 && $(".sidebar-tag").length > 0 ) {
        $(".sidebar-tag .widget-title span").click(function() {
          var $title = $(this).parents('.widget-title');
          if ($title.hasClass('click')) {
            $title.removeClass('click');
          } else {
            $title.addClass('click');
          }
          $(this).parents(".sidebar-tag").find(".widget-content").slideToggle();
        });
      }
    },
    sidebarMapSorting: function(e) {
      $(".filter-sortby li span").click(function(e) {
        if (!$(this).parent().hasClass("active")) {
          Shopify.queryParams.sort_by = $(this).attr("data-href");
          ella.sidebarAjaxClick();
          var sortbyText = $(this).text();
          $(".filter-sortby > button span").text(sortbyText);
          $(".filter-sortby li.active").removeClass("active");
          $(this).parent().addClass("active");
        }
        e.preventDefault();
      });
    },
    sidebarMapPaging: function() {
      $(".pagination-page a").click(function(e) {
        var page = $(this).attr("href").match(/page=\d+/g);
        if (page) {
          Shopify.queryParams.page = parseInt(page[0].match(/\d+/g));
          if (Shopify.queryParams.page) {
            var newurl = ella.sidebarCreateUrl();
            ella.isSidebarAjaxClick = true;
            History.pushState({
              param: Shopify.queryParams
            }, newurl, newurl);
            ella.sidebarGetContent(newurl);
            //go to top
            $('body,html').animate({
              scrollTop: 500
            }, 600);
          }
        }
        e.preventDefault();
      });
    },
    sidebarMapClearAll: function() {
      //clear all selection
      $('.refined-widgets a.clear-all').click(function(e) {
        delete Shopify.queryParams.constraint;
        delete Shopify.queryParams.q;
        ella.sidebarAjaxClick();
        e.preventDefault();
      });
    },
    ClearSelected: function(){
      $('.selected-tag a').click(function(e) {
        var currentTags = [];
        if (Shopify.queryParams.constraint) {
          currentTags = Shopify.queryParams.constraint.split('+');
        }

        //one selection or multi selection
        if (!window.enable_sidebar_multiple_choice && !$(this).prev().is(":checked")) {
          //remove other selection first
          var otherTag = $(this).parents('.selected-tag').find("input:checked");
          if (otherTag.length > 0) {
            var tagName = otherTag.val();
            if (tagName) {
              var tagPos = currentTags.indexOf(tagName);
              if (tagPos >= 0) {
                //remove tag
                currentTags.splice(tagPos, 1);
              }
            }
          }
        }

        var tagName = $(this).prev().val();
        if (tagName) {
          var tagPos = currentTags.indexOf(tagName);
          if (tagPos >= 0) {
            //tag already existed, remove tag
            currentTags.splice(tagPos, 1);
          } else {
            //tag not existed
            currentTags.push(tagName);
          }
        }
        if (currentTags.length) {
          Shopify.queryParams.constraint = currentTags.join('+');
        } else {
          delete Shopify.queryParams.constraint;
        }
        ella.sidebarAjaxClick();
        e.preventDefault();
      });
    },      
    sidebarMapClear: function() {
      $(".sidebar-tag").each(function() {
        var sidebarTag = $(this);
        if (sidebarTag.find("input:checked").length > 0) {
          //has active tag
          sidebarTag.find(".clear").show().addClass('show-tag').click(function(e) {
            console.log("im clicked");
            var currentTags = [];
            if (Shopify.queryParams.constraint) {
              currentTags = Shopify.queryParams.constraint.split('+');
            }
            sidebarTag.find("input:checked").each(function() {
              var selectedTag = $(this);
              var tagName = selectedTag.val();
              if (tagName) {
                var tagPos = currentTags.indexOf(tagName);
                if (tagPos >= 0) {
                  //remove tag
                  currentTags.splice(tagPos, 1);
                }
              }
            });
            if (currentTags.length) {
              Shopify.queryParams.constraint = currentTags.join('+');
            } else {
              delete Shopify.queryParams.constraint;
            }
            ella.sidebarAjaxClick();
            e.preventDefault();
          });
        }
      });
    },
    sidebarMapEvents: function() {
      ella.sidebarMapTagEvents();
      ella.sidebarMapCategories();
      ella.sidebarMapView();
      ella.sidebarMapShow();
      ella.sidebarMapSorting();
    },
    reActivateSidebar: function() {
      $(".sidebar-custom .active, .sidebar-links .active").removeClass("active");
      $(".sidebar-tag input:checked").attr("checked", false);

      //category
      var cat = location.pathname.match(/\/collections\/(.*)(\?)?/);
      if (cat && cat[1]) {
        $(".sidebar-links a[href='" + cat[0] + "']").addClass("active");
      }

      //view mode and show filter
      if (Shopify.queryParams.view) {
        $(".view-mode .active").removeClass("active");
        var view = Shopify.queryParams.view;
        if (view.indexOf("list") >= 0) {
          $(".view-mode .list").addClass("active");
          //paging
          view = view.replace("list", "");
        } else {
          $(".view-mode .grid").addClass("active");
        }
        $(".filter-show > button span").text(view);
        $(".filter-show li.active").removeClass("active");
        $(".filter-show a[href='" + view + "']").parent().addClass("active");
      }
      ella.initSortby();
    },
    initSortby: function() {
      //sort by filter
      if (Shopify.queryParams.sort_by) {
        var sortby = Shopify.queryParams.sort_by;
        var sortbyText = $(".filter-sortby span[data-href='" + sortby + "']").text();
        $(".filter-sortby > button span").text(sortbyText);
        $(".filter-sortby li.active").removeClass("active");
        $(".filter-sortby span[data-href='" + sortby + "']").parent().addClass("active");
      }
    },
    sidebarMapData: function(data) {
      var currentList = $(".col-main .products-grid");
      if (currentList.length == 0) {
        currentList = $(".col-main .product-list");
      }
      var productList = $(data).find(".col-main .products-grid");
      if (productList.length == 0) {
        productList = $(data).find(".col-main .product-list");
      }
      if (productList.length > 0 && productList.hasClass("products-grid")) {
        if (window.product_image_resize) {
          productList.find('img').fakecrop({
            fill: window.images_size.is_crop,
            widthSelector: ".products-grid .grid-item .product-image",
            ratioWrapper: window.images_size
          });
        }
      }
      currentList.replaceWith(productList);
      //convert currency
      if (ella.checkNeedToConvertCurrency()) {
        Currency.convertAll(window.shop_currency, jQuery('.currencies').val(), '.col-main span.money', 'money_format');
      }

      //replace paging
      if ($(".padding").length > 0) {
        $(".padding").replaceWith($(data).find(".padding"));
      } else {
        $(".block-row.col-main").append($(data).find(".padding"));
      }

      //replace title & description
      var currentHeader = $(".page-header");
      var dataHeader = $(data).find(".page-header");
      if (currentHeader.find("h2").text() != dataHeader.find("h2").text()) {
        currentHeader.find("h2").replaceWith(dataHeader.find("h2"));

        var currentDes = $(".collection-des");
        var dataDes = $(data).find(".collection-des");

        if (currentDes.find(".rte").length) {
          if (dataDes.find(".rte").length) {
            currentDes.html(dataDes.find(".rte"));
          } else {
            currentDes.find(".rte").hide();
          }
        } else {
          currentDes.html(dataDes.find(".rte"));
        }

        var currentImg = $(".collection-img");
        var dataImg = $(data).find(".collection-img");
        if (currentImg.find("p").length) {
          if (dataImg.find("p").length) {
            currentImg.html(dataImg.find("p"));
          } else {
            currentImg.find("p").hide();
          }
        } else {
          currentImg.html(dataImg.find("p"));
        }
      }

      //replace refined
      $(".refined-widgets").replaceWith($(data).find(".refined-widgets"));

      //replace tags
      $(".sidebar-block").replaceWith($(data).find(".sidebar-block"));
      // breadcrumb
      $(".breadcrumb .bd-title").replaceWith($(data).find(".breadcrumb .bd-title"));

      ella.initColorSwatchGrid();

      //product review
      if ($(".spr-badge").length > 0) {
        return window.SPR.registerCallbacks(), window.SPR.initRatingHandler(), window.SPR.initDomEls(), window.SPR.loadProducts(), window.SPR.loadBadges();
      }
    },
    sidebarCreateUrl: function(baseLink) {
      var newQuery = $.param(Shopify.queryParams).replace(/%2B/g, '+');
      if (baseLink) {
        //location.href = baseLink + "?" + newQuery;
        if (newQuery != "")
          return baseLink + "?" + newQuery;
        else
          return baseLink;
      }
      return location.pathname + "?" + newQuery;
    },
    sidebarAjaxClick: function(baseLink) {
      delete Shopify.queryParams.page;
      var newurl = ella.sidebarCreateUrl(baseLink);
      ella.isSidebarAjaxClick = true;
      History.pushState({
        param: Shopify.queryParams
      }, newurl, newurl);
      ella.sidebarGetContent(newurl);
    },
    sidebarGetContent: function(newurl) {
      $.ajax({
        type: 'get',
        url: newurl,
        beforeSend: function() {
          ella.showLoading();
        },
        success: function(data) {
          ella.sidebarMapData(data);
          ella.sidebarMapPaging();
          ella.translateBlock(".main-content");
          ella.sidebarMapTagEvents();
          ella.sidebarInitToggle();
          ella.sidebarMapClear();
          ella.sidebarMapClearAll();
          ella.ClearSelected();
          ella.hideLoading();
          ella.sidebarMb();
          ella.initQuickView();
          ella.initAddToCart();
          ella.initInfiniteScrolling();
          ella.initWishLists();
          ella.initWishListIcons();
        },
        error: function(xhr, text) {
          ella.hideLoading();
          $('.loading-modal').hide();
          $('.ajax-error-message').text($.parseJSON(xhr.responseText).description);
          ella.showModal('.ajax-error-modal');
        }
      });
    },
    sidebarParams: function() {
      Shopify.queryParams = {};
      //get after ?...=> Object {q: "Acme"} 
      if (location.search.length) {
        for (var aKeyValue, i = 0, aCouples = location.search.substr(1).split('&'); i < aCouples.length; i++) {
          aKeyValue = aCouples[i].split('=');
          if (aKeyValue.length > 1) {
            Shopify.queryParams[decodeURIComponent(aKeyValue[0])] = decodeURIComponent(aKeyValue[1]);
          }
        }
      }
    },
    initMobileSidebar: function() {
      //if ($(".header-mobile").is(":visible")) {
      //             $('footer').append("<a class='option-sidebar left' id='displayTextLeft' href='javascript:void(0)' title='Show Sidebar'><span>Show Sidebar</span></a>");
      $('#displayTextLeft').click(
        function(event) {
          event.preventDefault();
          if ($('.sidebar').is(":hidden")) {
            //jQuery('.col-main').fadeOut(800);
            $('.sidebar').fadeIn(0);
            $('body,html').animate({
              scrollTop: 300
            }, 600);
            $('#displayTextLeft').toggleClass('hidden-arrow-left');
            $('#displayTextLeft .show_hide').html('<span>Hide<i class="fa fa-angle-up" aria-hidden="true"></i></span>');
          } else {
            $('.sidebar').fadeOut(0);
            $('#displayTextLeft').removeClass('hidden-arrow-left');
            $('#displayTextLeft .show_hide').html('<span>Show<i class="fa fa-angle-down" aria-hidden="true"></i></span>');
          }
        });
      //}
    },
    initSidebar: function() {
      //if category page then init sidebar
      if ($(".collection-sidebar").length > 0) {
        ella.sidebarParams();
        ella.initSortby();
        ella.sidebarMapEvents();
        ella.sidebarMapPaging();
        ella.sidebarInitToggle();
        //               ella.sidebarMb();
        ella.sidebarMapClear();
        ella.sidebarMapClearAll();
        ella.ClearSelected();
      }
    },
    sidebarMb: function() {
      if ($(window).width() < 1025 && $(".sidebarblock").length > 0) {
        $(".sidebar-tag .widget-content").hide();
        $('.show-tag').parent().parent().next().show();
        $(".sidebarblock .widget-title h3").off().on('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          var $title = $(this).parents('.widget-title');
          if ($title.hasClass('click')) {
            $title.removeClass('click');
            $(this).parents(".sidebarblock").find(".widget-content").slideToggle('fast');
            var timer;
            clearTimeout(timer);
            timer = setTimeout(function() {
              $('.widget-product .products-grid').slick('unslick');    
              $('.widget-product .products-grid').find('.slick-list').removeAttr('style');

              if(!$('.widget-product .products-grid').hasClass('slick-initialized')) {
                $('.widget-product .products-grid').slick({
                  slidesToScroll: 1,
                  nextArrow: '<button type="button" class="sidebar-product-slick-next"><i class="fa fa-chevron-right" aria-hidden="true"></i></button>',
                  prevArrow: '<button type="button" class="sidebar-product-slick-prev"><i class="fa fa-chevron-left" aria-hidden="true"></i></button>',
                });
              };
            }, 200);
          } else {
            $title.addClass('click');
            $(this).parents(".sidebarblock").find(".widget-content").slideToggle('fast');

          }
        });
      }
    },
    //       initDropdownAccount: function() {
    //             if ($('.menu-block').is(':visible')) {
    //                 $('.lang-block').appendTo(jQuery('.opt-area'));
    //                 $('.currency').appendTo(jQuery('.opt-area'));
    //             } else {
    //               $('.currency').prependTo(jQuery('.header-pull-left'));
    //               	$('.lang-block').prependTo(jQuery('.header-pull-left'));

    //             }
    //       },
    initMobileMenu: function() {
      if ($(".menu-block").is(':visible')) {
        $(".gf-menu-device-container ul.gf-menu li.dropdown").each(function() {
          if ($(this).find("> p.toogleClick").length == 0) {
            $(this).prepend('<p class="toogleClick"></p>');
          }
        });

        if ($(".menu-block").children().hasClass("gf-menu-device-wrapper") == false) {
          $(".menu-block").children().addClass("gf-menu-device-wrapper");
        }
        if ($(".gf-menu-device-container").find("ul.gf-menu").size() == 0) {
          $(".gf-menu-device-container").append($(".nav-bar .navPages-container").html());
          $(".gf-menu-device-container .site-nav").addClass("gf-menu");
          $(".gf-menu-device-container .site-nav").removeClass("nav")
        }
        $("p.toogleClick").click(function() {
          if ($(this).hasClass("mobile-toggle-open")) {
            $(this).next().next().hide();
            $(this).removeClass("mobile-toggle-open");
          } else {
            $(this).next().next().show();
            $(this).addClass("mobile-toggle-open")
          }
        });
        var w = window.innerWidth;
        if (w < 1025) {
          jQuery('.site-nav .dropdown .menu__moblie').bind('click', function(event) {
            if (currentEl != this) {
              $(this).next().show();
              $(this).prev().addClass('mobile-toggle-open');
              event.preventDefault();
              currentEl = this;
            }
          });
        }
        $("p.toogleClick").show();
        $("div.gf-menu-toggle").hide();
        $(".nav-bar .container").hide();
        if ($("ul.gf-menu").hasClass("clicked") == false) {
          //                     $(".gf-menu").hide();
          $(".gf-menu li.dropdown ul.site-nav-dropdown").hide();
        }


        $(".col-1 .inner ul.dropdown").parent().each(function() {
          if ($(this).find("> p.toogleClick").length == 0) {
            $(this).prepend('<p class="toogleClick"></p>');
          }
        });

        $(".cbp-spmenu span.icon-dropdown").remove();

        $("ul.gf-menu li.dropdown").each(function() {
          if ($(this).find("> p.toogleClick").length == 0) {
            $(this).prepend('<p class="toogleClick"></p>');
          }
        });

        $("p.toogleClick").click(function() {
          if ($(this).hasClass("mobile-toggle-open")) {
            $(this).next().next().hide();
            $(this).removeClass("mobile-toggle-open");
          } else {
            $(this).next().next().show();
            $(this).addClass("mobile-toggle-open");
          }
        });
        //                 $('.header-panel-bottom .hl-right-top ul.customer-links').prependTo($('.customer-area .dropdown-menu'));
      } else {
        $(".nav-bar .container").show();
        //                 $(".gf-menu").hide();

        $('.customer-area ul.customer-links').appendTo($('.header-panel-bottom .hl-right-top'));
      }
      if ($(".menu-block").children().hasClass("gf-menu-device-wrapper") == false) {
        $(".menu-block").children().addClass("resized");
      };
    },
    initNavigationscroll: function() {
      if($('.index-section').length > 0){
        var indexSection = $('.index-section.match-nav');
        var navScroll = $('.navigation_scroll ul');
        var destArr = [];
        // init item
        indexSection.each(function(){
          var thisOffsetTop = $(this).offset().top;
          navScroll.append('<li><a href="#" data-offset="'+thisOffsetTop+'"></a></li>');
          destArr.push(thisOffsetTop)
        })
        // click event handle
        var navItem = navScroll.find('a');
        navItem.off('click').on('click', function(e){
          e.preventDefault();
          var self = $(this);
          var dest = self.data('offset');

          // scroll to dest
          $('body, html').animate({
            scrollTop: dest
          },500)

          // active this item, but remove all active first
          navItem.removeClass('active');
          $(this).addClass('active');
        })
      }

      ella.navigationScrollonScrollHandle(destArr)
    },

    navigationScrollonScrollHandle: function(destArr){
      var position = $(window).scrollTop(); 
      if(destArr.length){
        $(window).off('scroll.navigationScrollonScrollHandle').on('scroll.navigationScrollonScrollHandle', function(){
          var scroll = $(window).scrollTop();
          var activeArr = [];

          activeArr = destArr.filter(function(el){
            return el < scroll;
          })

          if(activeArr.length){
            var activeVal = activeArr[activeArr.length -1];
            $('.navigation_scroll').find('a').removeClass('active');
            var activeItem = $('.navigation_scroll').find('a[data-offset="'+ activeVal +'"]');
            var activeIndex = activeArr.indexOf(activeVal);
            var activeSection = $('.index-section.match-nav').eq(activeIndex);
            var activeSectionHeight = activeSection.outerHeight();
            var activeHook = activeVal + activeSectionHeight - 20;
            var screenHeight = $(window).height()/2;

            if(scroll > activeHook){
              activeItem.parent().next().find('a').addClass('active');

            }else{
              activeItem.addClass('active');
            }
            if(scroll > position){
              // scroll up
              var nextSection = activeSection.next().hasClass('ignore-match') ? activeSection.next().next() : activeSection.next() ;
				var changeColorHook = nextSection.offset().top - screenHeight;
              if(nextSection.hasClass('change-color')){
                
                if(scroll > changeColorHook ){
                  $('.navigation_scroll').addClass('fade-out2'); 
                }
              }else{
//                 console.log('change soon')
                if(scroll > changeColorHook ){
                  $('.navigation_scroll').removeClass('fade-out2'); 
                }


              }
            }else{
              var changeColorHook = activeSection.offset().top + activeSectionHeight - screenHeight ;
              if(activeSection.hasClass('change-color')){


                if(scroll < changeColorHook ){
                  $('.navigation_scroll').addClass('fade-out2'); 
                }
              }else{
                if(scroll < changeColorHook ){
                  $('.navigation_scroll').removeClass('fade-out2'); 
                }


              }
            }


          }

          position = scroll;
        })
      }

    },
    initMageMenu: function() {
      var w = window.innerWidth;
      if (w > 1026) {
        var initLookbookItem = function() {
          var body = $('body');
          var listLookbookItem = $('.site-nav > li.mega-menu');
          var lookbookHead = $('.site-nav > li.mega-menu > a');
          var lookbookContent = listLookbookItem.find('.mega-menu-dropdown');
          lookbookHead.on('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            var self = $(this);
            var curLookbookContent = $(self.next());
            lookbookContent.removeClass('open_mega');
            curLookbookContent.addClass('open_mega');
            body.addClass("show__mega");
          });
        };
        initLookbookItem();
        $('.close_mega').click(function(e){

          $('.mega-menu-dropdown').removeClass('open_mega');
        });
        var body = $('body');
        $('.site-nav > li.mega-menu').on('click', function() {
          if ($(".mega-menu-dropdown").hasClass("open_mega")){
            body.addClass("show__mega");

          }else{
            body.removeClass("show__mega");
          }
        });
      }
    },
    initBackTop: function() {
      var slideShowHeight = $('.home-slideshow').outerHeight();
      var heightBanner2 = $('.banner-2').outerHeight();
      var heightBanner1 = $('.banner-1').outerHeight();
      var headerTopHeight = $('.header-top ').outerHeight();
      var backTopOffsetTop = (75*$(window).outerHeight()/100);
      var scrollpOffsetTop =(50*$(window).outerHeight()/100);
      var headersiteheader =$('.site-header').outerHeight();
      var heightMain = $('.main-content').outerHeight();
      var height1 = (heightMain + headersiteheader  - backTopOffsetTop);
      var height = (slideShowHeight + heightBanner2 + heightBanner1 + headerTopHeight - backTopOffsetTop);
      var height2 = (slideShowHeight + heightBanner2 + heightBanner1 + headerTopHeight - scrollpOffsetTop);
      $(window).off('scroll.toogleClass').on('scroll.toogleClass', function() {
        if($(this).scrollTop() > height) {
          $('#back-top').addClass("fade-out");

        }
        else {
          $('#back-top').removeClass("fade-out")

        }
      });
      $(window).scroll(function() {
        if($(this).scrollTop() > height1) {
          $('#back-top').removeClass("fade-out");
        }
        else {
          $('#back-top').removeClass("fade-out1");
        }

      });
    },
    initRecentlyFix: function() {
      var w = window.innerWidth;
      if (w > 1442) {
        $(".pull-right").stick_in_parent();
      }
    },
    
    createWishListTplItem: function(ProductHandle) {
      var wishListCotainer = $('[data-wishlist-container]');

      jQuery.getJSON(window.router + '/products/'+ProductHandle+'.js', function(product) {
        var productHTML = '',
            price_min = Shopify.formatMoney(product.price_min, window.money_format);

        productHTML += '<div class="grid-item" data-wishlist-added="wishlist-'+product.id+'">';
        productHTML += '<div class="inner product-item" data-product-id="product-'+product.handle+'">';
        productHTML += '<div class="column col-img"><div class="product-image">';
        productHTML +='<a href="'+product.url+'" class="product-grid-image" data-collections-related="/collections/all?view=related">';
        productHTML += '<img src="'+product.featured_image+'" alt="'+product.featured_image.alt+'">';
        productHTML += '</a></div></div>';
        productHTML += '<div class="column col-prod">';
        productHTML += '<a class="product-title" href="'+product.url+'" title="'+product.title+'">'+product.title+'</a>';
        productHTML += '<div class="product-vendor">';
        productHTML += '<a href="/collections/vendors?q='+product.vendor+'" title="'+product.vendor+'">'+product.vendor+'</a></div></div>';
        productHTML += '<div class="column col-price text-center"><div class="price-box">'+ price_min +'</div></div>';
        productHTML += '<div class="column col-options text-center">';
        productHTML += '<form action="/cart/add" method="post" class="variants" id="wishlist-product-form-' + product.id +'" data-id="product-actions-'+product.id+'" enctype="multipart/form-data">';

        if (product.available) {
          if (product.variants.length == 1) {
            productHTML += '<button data-btn-addToCart class="btn add-to-cart-btn" data-form-id="#wishlist-product-form-' + product.id +'" type="submit">'+window.inventory_text.add_to_cart+'</button><input type="hidden" name="id" value="'+ product.variants[0].id +'" />';
          }
          if (product.variants.length > 1){
            productHTML += '<a class="btn" title="'+product.title+'" href="' + product.url +'">'+window.inventory_text.select_options+'</a>';
          }
        } else {
          productHTML += '<button class="btn add-to-cart-btn" type="submit" disabled="disabled">'+window.inventory_text.unavailable+'</button>';
        }

        productHTML += '</form></div>';
        productHTML += '<div class="column col-remove text-center"><a class="whislist-added" href="#" data-product-handle="'+ product.handle +'" data-icon-wishlist data-id="'+ product.id +'"><svg class="closemnu" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 357 357" xml:space="preserve"><g><g><polygon points="357,35.7 321.3,0 178.5,142.8 35.7,0 0,35.7 142.8,178.5 0,321.3 35.7,357 178.5,214.2 321.3,357 357,321.3 214.2,178.5"></polygon></g></g></svg></a></div>';
        productHTML += '</div></div>';

        wishListCotainer.append(productHTML);
        var regex = /(<([^>]+)>)/ig;
        var href = $('.wrapper-wishlist a.share').attr("href");
        href += encodeURIComponent( product.title + '\nPrice: ' + price_min.replace(regex, "") + '\nLink: ' + window.location.protocol + '//' + window.location.hostname + product.url +'\n\n');
        $('.wrapper-wishlist a.share').attr("href", href );
      });
    },

    initWishListPagging: function() {
      var data = JSON.parse(localStorage.getItem('items'));

      var wlpaggingContainer = $('#wishlist-paginate');
      var paggingTpl = '<li class="text disabled prev"><a href="#" title="'+window.inventory_text.previous+'"><i class="fa fa-angle-left" aria-hidden="true"></i><span>'+window.inventory_text.previous+'</span></a></li>';
      var wishListCotainer = $('[data-wishlist-container]');

      wlpaggingContainer.children().remove();

      var totalPages = Math.ceil(data.length / 3);

      if (totalPages <= 1) {
        wishListCotainer.children().show();
        return;
      }

      for (var i = 0; i < totalPages; i++) {
        var pageNum = i + 1;
        if (i === 0) paggingTpl += '<li class="active"><a data-page="' + pageNum + '" href="'+ pageNum +'" title="'+ pageNum +'">' + pageNum + '</a></li>'
        else paggingTpl += '<li><a data-page="' + pageNum + '" href="'+ pageNum +'" title="'+ pageNum +'">' + pageNum + '</a></li>'
          }

      paggingTpl += '<li class="text next"><a href="#" title="'+window.inventory_text.next+'"><span>'+window.inventory_text.next+'</span><i class="fa fa-angle-right" aria-hidden="true"></i></a></li>';

      wlpaggingContainer.append(paggingTpl);

      wishListCotainer.children().each(function(idx, elm) {
        if (idx >= 0 && idx < 3) {
          $(elm).show();
        }
        else {
          $(elm).hide();
        }
      });

      wlpaggingContainer.off('click.wl-pagging').on('click.wl-pagging', 'li a', function(e) {
        e.preventDefault();

        var isPrev = $(this).parent().hasClass('prev');
        var isNext = $(this).parent().hasClass('next');
        var pageNumber = $(this).data('page');

        if (isPrev) {
          var curPage = parseInt($(this).parent().siblings('.active').children().data('page'));
          pageNumber = curPage - 1;
        }

        if (isNext) {
          var curPage = parseInt($(this).parent().siblings('.active').children().data('page'));
          pageNumber = curPage + 1;
        }

        wishListCotainer.children().each(function(idx, elm) {
          if (idx >= (pageNumber - 1) * 3 && idx < pageNumber * 3) {
            $(elm).show();
          }
          else {
            $(elm).hide();
          }
        });

        if (pageNumber === 1) {
          wlpaggingContainer.find('.prev').addClass('disabled');
          wlpaggingContainer.find('.next').removeClass('disabled');
        }
        else if (pageNumber === totalPages) {
          wlpaggingContainer.find('.next').addClass('disabled');
          wlpaggingContainer.find('.prev').removeClass('disabled');
        }
        else {
          wlpaggingContainer.find('.prev').removeClass('disabled');
          wlpaggingContainer.find('.next').removeClass('disabled');
        }

        $(this).parent().siblings('.active').removeClass('active');
        wlpaggingContainer.find('[data-page="' + pageNumber + '"]').parent().addClass('active');

      });
    },

    initWishLists: function() {
      if (typeof(Storage) !== 'undefined') {
        var data = JSON.parse(localStorage.getItem('items'));

        if (data.length <= 0) {
          return;
        }
        data.forEach(function(item) {

          ella.createWishListTplItem(item);
        });

        this.initWishListPagging();
        this.translateBlock('.wishlist-page');

      } else {
        alert('Sorry! No web storage support..');
      }
    },

    setAddedForWishlistIcon: function(ProductHandle) {
      var wishlistElm = $('[data-product-handle="'+ ProductHandle +'"]'),
          idxArr = wishListsArr.indexOf(ProductHandle);

      if(idxArr >= 0) {
        wishlistElm.addClass('whislist-added');
        wishlistElm.find('.wishlist-text').text(window.inventory_text.remove_wishlist);
      }
      else {
        wishlistElm.removeClass('whislist-added');
        wishlistElm.find('.wishlist-text').text(window.inventory_text.add_wishlist);
      };
    },

    doAddOrRemoveWishlish: function() {
      var iconWishListsSlt = '[data-icon-wishlist]';

      doc.off('click.addOrRemoveWishlist', iconWishListsSlt).on('click.addOrRemoveWishlist', iconWishListsSlt, function(e) {
        e.preventDefault();

        var self = $(this),
            productId = self.data('id'),
            ProductHandle = self.data('product-handle'),
            idxArr = wishListsArr.indexOf(ProductHandle);

        if(!self.hasClass('whislist-added')) {
          self.addClass('whislist-added');
          self.find('.wishlist-text').text(window.inventory_text.remove_wishlist);

          if($('[data-wishlist-container]').length) {
            ella.createWishListTplItem(ProductHandle);
          };

          wishListsArr.push(ProductHandle);
          localStorage.setItem('items', JSON.stringify(wishListsArr));
        } else {
          self.removeClass('whislist-added');
          self.find('.wishlist-text').text(window.inventory_text.add_wishlist);

          if($('[data-wishlist-added="wishlist-'+productId+'"]').length) {
            $('[data-wishlist-added="wishlist-'+productId+'"]').remove();
          }

          wishListsArr.splice(idxArr, 1);
          localStorage.setItem('items', JSON.stringify(wishListsArr));

          if($('[data-wishlist-container]').length) {
            ella.initWishListPagging();
          };
        };

        ella.setAddedForWishlistIcon(ProductHandle);
      });
    },

    initWishListIcons: function() {
      var wishListItems = localStorage.getItem('items') ? JSON.parse(localStorage.getItem('items')) : [];

      if (!wishListItems.length) {
        return;
      }

      for (var i = 0; i < wishListItems.length; i++) {
        var icon = $('[data-product-handle="'+ wishListItems[i] +'"]');
        icon.addClass('whislist-added');
        icon.find('.wishlist-text').text(window.inventory_text.remove_wishlist);
      };
    },

    
    initColorSwatchGrid: function() { 
      jQuery('.item-swatch li label').hover(function(){
        var newImage = jQuery(this).parent().find('.hidden a').attr('href');
        jQuery(this).parents('.grid-item').find('.product-grid-image img').attr({ src: newImage }); 
        return false;
      });
    },
    initResizeImage: function() {
      if (window.product_image_resize) {
        $('.products-grid .product-image img').fakecrop({
          fill: window.images_size.is_crop,
          widthSelector: ".products-grid .grid-item .product-image",
          ratioWrapper: window.images_size
        });
      }
    },
    initInfiniteScrolling: function() {
      if ($('.infinite-scrolling').length > 0) {
        $('.infinite-scrolling a').click(function(e) {
          e.preventDefault();
          if (!$(this).hasClass('disabled')) {
            ella.doInfiniteScrolling();
          }
        });
      }
    },
    doInfiniteScrolling: function() {
      var currentList = $('.block-row .products-grid');
      if (!currentList.length) {
        currentList = $('.block-row .product-list');
      }
      if (currentList) {
        var showMoreButton = $('.infinite-scrolling a').first();
        $.ajax({
          type: 'GET',
          url: showMoreButton.attr("href"),
          beforeSend: function() {
            ella.showLoading();
            $('.loading-modal').show();
          },
          success: function(data) {
            ella.hideLoading();
            var products = $(data).find(".block-row .products-grid");
            if (!products.length) {
              products = $(data).find(".block-row .product-list");
            }
            if (products.length) {
              if (products.hasClass('products-grid')) {
                /*fake crop*/
                if (window.product_image_resize) {
                  products.children().find('img').fakecrop({
                    fill: window.images_size.is_crop,
                    widthSelector: ".products-grid .grid-item .product-image",
                    ratioWrapper: window.images_size
                  });
                }
              }

              currentList.append(products.children());
              ella.translateBlock("." + currentList.attr("class"));
              ella.initQuickView();
              ella.initAddToCart();
              ella.initWishLists();
              ella.initWishListIcons();
              ella.translateBlock(".main-content");
              //get link of Show more
              if ($(data).find('.infinite-scrolling').length > 0) {
                showMoreButton.attr('href', $(data).find('.infinite-scrolling a').attr('href'));
              } else {
                //no more products
                showMoreButton.hide();
                showMoreButton.next().show();
              }

              //currency
              if (window.show_multiple_currencies && window.shop_currency != jQuery(".currencies").val())
              {
                Currency.convertAll(window.shop_currency, jQuery(".currencies").val(), "span.money", "money_format")
              }

              ella.initColorSwatchGrid();

              //product review
              if ($(".spr-badge").length > 0) {
                return window.SPR.registerCallbacks(), window.SPR.initRatingHandler(), window.SPR.initDomEls(), window.SPR.loadProducts(), window.SPR.loadBadges();
              }
            }
          },
          error: function(xhr, text) {
            ella.hideLoading();
            $('.loading-modal').hide();
            $('.ajax-error-message').text($.parseJSON(xhr.responseText).description);
            ella.showModal('.ajax-error-modal');
          },
          dataType: "html"
        });
      }
    },
    closeEmailModalWindow: function() {
      if ($('#email-modal').length > 0 && $('#email-modal').is(':visible')) {
        $('#email-modal .modal-window').fadeOut(600, function() {
          $('#email-modal .modal-overlay').fadeOut(600, function() {
            $('#email-modal').hide();
            $.cookie('emailSubcribeModal', 'closed', {
              expires: 1,
              path: '/'
            });
          });
        });
      }
    },
    showModal: function(selector) {
      $(selector).fadeIn(500)
      ella.ellaTimeout = setTimeout(function() {
        $(selector).fadeOut(500);
      }, 5000);
    },
    initToggleCollectionPanel: function() {
      if ($('.collection-sharing-btn').length > 0) {
        $('.collection-sharing-btn').click(function() {
          $('.collection-sharing-panel').toggle();
          if ($('.collection-sharing-panel').is(':visible')) {
            $('.collection-sharing-btn').addClass('btn-hover');
            $('.collection-filter-panel').hide();
            $('.collection-filter-btn').removeClass('btn-hover');
          } else {
            $('.collection-sharing-btn').removeClass('btn-hover');
          }
        });
      }
      if ($('.collection-filter-btn').length > 0) {
        $('.collection-filter-btn').click(function() {
          $('.collection-filter-panel').toggle();
          if ($('.collection-filter-panel').is(':visible')) {
            $('.collection-filter-btn').addClass('btn-hover');
            $('.collection-sharing-panel').hide();
            $('.collection-sharing-btn').removeClass('btn-hover');
          } else {
            $('.collection-filter-btn').removeClass('btn-hover');
          }
        });
        $('.collection-filter-panel select').change(function(index) {
          window.location = $(this).find('option:selected').val();
        });
      }
    },
    checkItemsInDropdownCart: function() {
      if ($('.dropdown-cart .mini-products-list').children().length > 0) {
        //Has item in dropdown cart
        $('.dropdown-cart .no-items').hide();
        $('.dropdown-cart .has-items').show();
      } else {
        //No item in dropdown cart                
        $('.dropdown-cart .has-items').hide();
        $('.dropdown-cart .no-items').show();
      }
    },
    initModal: function() {
      $('.continue-shopping').click(function() {
        clearTimeout(ella.ellaTimeout);
        $('.ajax-success-modal').fadeOut(300);
      });
      $('.close-modal, .overlay').click(function() {
        clearTimeout(ella.ellaTimeout);
        $('.ajax-success-modal').fadeOut(300);
      });
    },
    initDropDownCart: function() {
      if (window.dropdowncart_type == "click") {
        //click type  
        $('.cartToggle').click(function() {
          if ($('.dropdown-cart').is(':visible')) {
            $(".dropdown-cart").slideUp('fast');
            $(this).removeClass("Showcart");
          } else {
            $(".dropdown-cart").slideDown('fast');
            $(this).addClass("Showcart");
          }
        });
      } else {
        //hover type
        if (!('ontouchstart' in document)) {
          $('.cartToggle').hover(function() {
            if (!$('.dropdown-cart').is(':visible')) {
              $(".dropdown-cart").slideDown('fast');
            }
          });
          $('.wrapper-top-cart').mouseleave(function() {
            $(".dropdown-cart").slideUp('fast');
          });
        } else {
          //mobile
          $('.cartToggle').click(function() {
            if ($('.dropdown-cart').is(':visible')) {
              $(".dropdown-cart").slideUp('fast');
            } else {
              $(".dropdown-cart").slideDown('fast');
            }
          });
        }
      }

      ella.checkItemsInDropdownCart();

      $('.dropdown-cart .no-items a').click(function() {
        $(".dropdown-cart").slideUp('fast');
      });

      $('.dropdown-cart .btn-remove').click(function(event) {
        event.preventDefault();
        var productId = $(this).parents('.item').attr('id');
        productId = productId.match(/\d+/g);
        Shopify.removeItem(productId, function(cart) {
          ella.doUpdateDropdownCart(cart);
        });
      });
    },
    closeDropdownCart: function() {
      if ($('.dropdown-cart').is(':visible')) {
        $(".dropdown-cart").slideUp('fast');
      }
    },

    closeDropdownSearch: function() {
      if ($(".hl-right-top .search-bar").is(":visible")) {
        $('.hl-right-top .search-bar').removeClass('show_search');
        $('.hl-right-top .search-bar').next().show();
        $('.hl-right-top .input-group-btn').hide();
      }
    },
    initProductMoreview: function() {
      if ($('.more-view-wrapper-owlslider').length > 0) {
        this.initOwlMoreview();
      } else if ($('.more-view-wrapper-jcarousel').length > 0) {
        this.initJcarouselMoreview();
      }
    },
    initOwlMoreview: function() {
      $('.more-view-wrapper-owlslider ul').owlCarousel({
        navigation: true,
        items: 4,
        itemsDesktop: [1199, 4],
        itemsDesktopSmall: [979, 4],
        itemsTablet: [768, 4],
        itemsTabletSmall: [540, 4],
        itemsMobile: [360, 4]
      }).css('visibility', 'visible');
    },
    initJcarouselMoreview: function() {
      $('.more-view-wrapper-jcarousel ul').jcarousel({
        vertical: true
      }).css('visibility', 'visible');
      $('.product-img-box').addClass('has-jcarousel');
      $('.more-view-wrapper').css('visibility', 'visible');
    },
    initCloudzoom: function() {
      if ($(window).width() >= 992 && $('.zoomContainer').length === 0) {
        if ($("img[id|='product-featured-image']").length > 0) {
          if ($("img[id|='product-featured-image']").is(":visible")) {
            //mobile display
            $("img[id|='product-featured-image']").elevateZoom({

              cursor: "crosshair",
              galleryActiveClass: 'active',
              imageCrossfade: false,
              scrollZoom: false,
              onImageSwapComplete: function() {
                $(".zoomWrapper div").hide();
              },
              loadingIcon: window.loading_url
            });
            $(".fancybox").fancybox();
          } else {
            $("img[id|='product-featured-image']").elevateZoom({
              cursor: "crosshair",
              galleryActiveClass: 'active',
              imageCrossfade: true,
              scrollZoom: true,
              onImageSwapComplete: function() {
                $(".zoomWrapper div").hide();
              },
              loadingIcon: window.loading_url
            });

            $("img[id|='product-featured-image']").bind("click", function(e) {
              var ez = $("img[id|='product-featured-image']").data('elevateZoom');
              $.fancybox(ez.getGalleryList());
              return false;
            });
          }
        }
      }
      else if ($(window).width() < 992 && $('.zoomContainer').length >= 1) {
        var images = $("img[id|='product-featured-image']");
        images.off('touchmove');
        $.removeData(images, 'elevateZoom');

        $('.zoomContainer').remove();

      }
    },
    initScrollTop: function() {
      $('#back-top').click(function() {
        $('body,html').animate({
          scrollTop: 0
        }, 400);
        return false;
      });
    },
    initProductAddToCart: function() {
      if ($('#product-add-to-cart').length > 0) {
        $('#product-add-to-cart').click(function(event) {
          event.preventDefault();
          var self = $(this),
              data = self.closest('form').serialize();
          if ($(this).attr('disabled') != 'disabled') {
            if (!window.ajax_cart) {
              $(this).closest('form').submit();
            } else {
//               var variant_id = $('#add-to-cart-form select[name=id]').val();
//               if (!variant_id) {
//                 variant_id = $('#add-to-cart-form input[name=id]').val();
//               }
//               var quantity = $('#add-to-cart-form input[name=quantity]').val();
//               if (!quantity) {
//                 quantity = 1;
//               }
              var title = $('.product-title h2').html();
              var image = $(".slick-active img[id|='product-featured-image']").attr('src');
              ella.doAjaxAddToCart(data, title, image);
            }
          }
          return false;
        });
      }
    },
    initAddToCart: function() {
      if ($('.add-to-cart-btn').length > 0) {
        $('.add-to-cart-btn').click(function(event) {
          event.preventDefault();
          var self = $(this),
              data = self.closest('form').serialize();
          if ($(this).attr('disabled') != 'disabled') {
            var productItem = $(this).parents('.product-item');
            var productId = $(productItem).attr('id');
            productId = productId.match(/\d+/g);
            if (!window.ajax_cart) {
              $('#product-actions-' + productId).children('form').submit();
            } else {
//               var variant_id = $('#product-actions-' + productId + ' select[name=id]').val();
//               if (!variant_id) {
//                 variant_id = $('#product-actions-' + productId + ' input[name=id]').val();
//               }
//               var quantity = $('#product-actions-' + productId + ' input[name=quantity]').val();
//               if (!quantity) {
//                 quantity = 1;
//               }

              var title = $(productItem).find('.product-title').html();
              var image = $(productItem).find('.product-grid-image img').attr('src');
              ella.doAjaxAddToCart(data, title, image);
            }
          }
          return false;
        });
      }
    },
    showLoading: function() {
      $('.loading-modal').show();
    },
    hideLoading: function() {
      $('.loading-modal').hide();
    },
    doAjaxAddToCart: function(data, title, image) {
//       var vendor = $('.product-vendor > span').html();
      $.ajax({
        type: "post",
        url: window.router + "/cart/add.js",
        data: data,
        dataType: 'json',
        beforeSend: function() {
          ella.showLoading();
        },
        success: function(msg) {
          ella.hideLoading();
//           $('.ajax-success-modal').find('.ajax-product-vendor').html(ella.translateText(vendor));
          $('.ajax-success-modal').find('.ajax-product-title').html(ella.translateText(title));
          $('.ajax-success-modal').find('.ajax-product-image').attr('src', image);
          $('.ajax-success-modal').find('.btn-go-to-wishlist').hide();
          $('.ajax-success-modal').find('.btn-go-to-cart').show();

          ella.showModal('.ajax-success-modal');
          ella.updateDropdownCart();
        },
        error: function(xhr, text) {
          ella.hideLoading();
          $('.ajax-error-message').text($.parseJSON(xhr.responseText).description);
          ella.showModal('.ajax-error-modal');
        }
      });
    },

    initInfiniteScrollingHomepage: function () {
      var newArrivalsProduct = $('[data-new-arrivals-product]');

      newArrivalsProduct.each(function () {
        var self = $(this);
        var infiniteScrolling = self.find('.infinite-scrolling-homepage');
        var infiniteScrollingLinkSlt = self.find('.infinite-scrolling-homepage a');
            
        if (infiniteScrolling.length) {
          infiniteScrollingLinkSlt.off('click.showMoreProduct').on('click.showMoreProduct', function (e) {
            e.preventDefault();
            e.stopPropagation();
            if($(this).hasClass('ajax-loading') )
              return false;
            $(this).addClass('ajax-loading');
            var url = $(this).attr('data-collection'),
                limit = $(this).attr('data-limit'),
                page = parseInt($(this).attr('data-page'));

            if (!$(this).hasClass('disabled')) {
              ella.doAjaxInfiniteScrollingGetContentSection(url,limit,page,e,self);
            };
          });
        }
      });
    },
  
    doAjaxInfiniteScrollingGetContentSection(url,limit,page,e,self) {
      $.ajax({
        type: "get",
        url: window.router + '/collections/' + url,
        cache: false,
        data: {
          view: 'sorting',
          constraint: 'limit=' + limit + '+page=' + page
        },

        beforeSend: function () {
          ella.showLoading();
        },
        success: function (data) {
          self.find('.products-grid').append(data);
          if( $(data).length == limit ){
            $(e.currentTarget).attr('data-page', page + 1);
          }
          else{
            $(e.currentTarget).attr('disabled','disabled');
            $(e.currentTarget).addClass('disabled');
            $(e.currentTarget).text(window.inventory_text.no_more_product);
          }
          ella.initQuickView();
          ella.initAddToCart();
          ella.initWishLists();
          ella.initWishListIcons();
          if (ella.checkNeedToConvertCurrency()) {
            Currency.convertAll(window.shop_currency, jQuery('.currencies').val(), 'span.money', 'money_format');
          }
          if ($('.shopify-product-reviews-badge').length && $('.spr-badge').length) {
            return window.SPR.registerCallbacks(), window.SPR.initRatingHandler(), window.SPR.initDomEls(), window.SPR.loadProducts(), window.SPR.loadBadges();
          };

        },
        complete: function () {
          ella.hideLoading();
          $(e.currentTarget).removeClass('ajax-loading');
          $('.infinite-scrolling1').remove();
        }
      });
    },

    initQuickView: function() {
      $('.quickview-button a').click(function() {
        var product_handle = $(this).attr('id');
        jQuery.getJSON(window.router + '/products/'+product_handle+'.js', function(product) {
          var template = $('#quickview-template').html();
          $('.quick-view').html(template);
          var quickview = $('.quick-view');

          quickview.find('.product-title a').html(ella.translateText(product.title));
          quickview.find('.product-title a').attr('href', product.url);
          if (quickview.find('.product-vendor span').length > 0) {
            quickview.find('.product-vendor span').text(product.vendor);
          }
          if (quickview.find('.product-type span').length > 0) {
            quickview.find('.product-type span').text(product.type);
          }
          if (quickview.find('.product-inventory span').length > 0) {
            var variant = product.variants[0];
            var inventoryInfo = quickview.find('.product-inventory span');                      
            if (variant.available) {
              if (variant.inventory_management!=null) {
                inventoryInfo.text(variant.inventory_quantity + " " + window.inventory_text.in_stock);
              } else {
                inventoryInfo.text(window.inventory_text.many_in_stock);
              }
            } else {
              inventoryInfo.text(window.inventory_text.out_of_stock);
            }
          }
          //countdown for quickview
          if (product.description.indexOf("[countdown]") > 0) {
            var countdownTime = product.description.match(/\[countdown\](.*)\[\/countdown\]/);
            if (countdownTime && countdownTime.length > 0) {
              quickview.find(".countdown").hide();
              quickview.find(".quickview-clock").countdown(countdownTime[1], function(event) {
                $(this).html(event.strftime('%Dd %H:%M:%S'));
              });
            }
          }
          if (quickview.find('.product-description').length > 0) {
            var description = product.description.replace(/(<([^>]+)>)/ig, "");
            var description = description.replace(/\[countdown\](.*)\[\/countdown\]/g, "");
            if (window.multi_lang) {
              if (description.indexOf("[lang2]") > 0) {
                var descList = description.split("[lang2]");
                if (jQuery.cookie("language") != null) {
                  description = descList[translator.current_lang - 1];
                } else {
                  description = descList[0];
                }
              }
            }
            description = description.split(" ").splice(0, 20).join(" ") + "...";
            quickview.find('.product-description').text(description);
          } else {
            quickview.find('.product-description').remove();
          }

          quickview.find('#product_regular_price').val(product.price);
          
          quickview.find('.price').html(Shopify.formatMoney(product.price, window.money_format));
          quickview.find('.product-item').attr('id', 'product-' + product.id);
          quickview.find('.variants').attr('id', 'product-actions-' + product.id);
          quickview.find('.variants select').attr('id', 'product-select-' + product.id);
          quickview.find('.product-img-box').attr('id', 'product-' + product.id);
          // Sold Out 
          var in_fo = $('#product-'+ product.id +' .product-label').html();
          $('#product-'+ product.id +' .product-label-qiuck').html(in_fo);

          //if has compare price
          if (product.compare_at_price_max > product.price) {
            
            quickview.find('.compare-price').html(Shopify.formatMoney(product.compare_at_price_max, window.money_format)).show();
            quickview.find('.price').addClass('on-sale');
          } else {
            quickview.find('.compare-price').html('');
            quickview.find('.price').removeClass('on-sale');
          }

          //out of stock
          if (!product.available) {
            quickview.find("select, input, .total-price, .dec, .inc, .variants label, .extra").remove();
            quickview.find(".add-to-cart-btn").text(window.inventory_text.unavailable).addClass('disabled').attr("disabled", "disabled");;
          } else {
            quickview.find('.total-price span').html(Shopify.formatMoney(product.price, window.money_format));
            if (window.use_color_swatch) {
              ella.createQuickViewVariantsSwatch(product, quickview);
            } else {
              ella.createQuickViewVariants(product, quickview);
            }
          }

          //quantity
          quickview.find(".button .fa").on("click", function() {
            var oldValue = quickview.find(".quantity").val(),
                newVal = 1;
            if ($(this).hasClass("fa-angle-up")) {
              newVal = parseInt(oldValue) + 1;
            } else if (oldValue > 1) {
              newVal = parseInt(oldValue) - 1;
            }
            quickview.find(".quantity").val(newVal);

            if (quickview.find(".total-price").length > 0) {
              ella.updatePricingQuickview();
            }
          });

          if (ella.checkNeedToConvertCurrency()) {
            Currency.convertAll(window.shop_currency, jQuery('.currencies').val(), 'span.money', 'money_format');
          }

          ella.loadQuickViewSlider(product, quickview);
          ella.initQuickviewAddToCart();
          ella.translateBlock(".quick-view");                    

          $('.quick-view').fadeIn(500);
          if ($('.quick-view .total-price').length > 0) {
            $('.quick-view input[name=quantity]').on('change', ella.updatePricingQuickview);
          }
        });

        return false;
      });

      $(document).on("click", ".quick-view .overlay, .close-window", function() {
        ella.closeQuickViewPopup();
        return false;
      });
    },
    updatePricingQuickview: function() {
      //try pattern one before pattern 2
      var quantity = parseInt($('.quick-view input[name=quantity]').val());
      var p = $('.quick-view #product_regular_price').val();
      var totalPrice1 = p * quantity;
      var g = Shopify.formatMoney(totalPrice1, window.money_format);
      $('.quick-view .total-price span').html(g);

      if (ella.checkNeedToConvertCurrency()) {
        Currency.convertAll(window.shop_currency, jQuery('.currencies').val(), 'span.money', 'money_format');
      }
      //-------------------
//       var regex = /([0-9]+[.|,][0-9]+[.|,][0-9]+)/g;
//       var unitPriceTextMatch = $('.quick-view .price').text().match(regex);

//       if (!unitPriceTextMatch) {
//         regex = /([0-9]+[.|,][0-9]+)/g;
//         unitPriceTextMatch = $('.quick-view .price').text().match(regex);
//       }

//       if (unitPriceTextMatch) {
//         var unitPriceText = unitPriceTextMatch[0];
//         var unitPrice = unitPriceText.replace(/[.|,]/g, '');
//         var quantity = parseInt($('.quick-view input[name=quantity]').val());
//         var totalPrice = unitPrice * quantity;

//         var totalPriceText = Shopify.formatMoney(totalPrice, window.money_format);
//         if(typeof currencyCode !== "undefined"){
//           if( Currency.moneyFormats[currencyCode].money_format.indexOf("{{amount_no_decimals_with_comma_separator}}") != -1){
//             totalPrice = totalPrice * 100;
//           }
//           totalPriceText = Shopify.formatMoney(totalPrice, Currency.moneyFormats[currencyCode].money_format);
//         }
//         regex = /([0-9]+[.|,][0-9]+[.|,][0-9]+)/g;     
//         if (!totalPriceText.match(regex)) {
//           regex = /([0-9]+[.|,][0-9]+)/g;
//         } 
//         totalPriceText = totalPriceText.match(regex)[0];

//         var regInput = new RegExp(unitPriceText, "g");
//         var totalPriceHtml = $('.quick-view .price').html().replace(regInput, totalPriceText);

//         $('.quick-view .total-price span').html(totalPriceHtml);
//       }
    },
    initQuickviewAddToCart: function() {
      if ($('.quick-view .add-to-cart-btn').length > 0) {
        $('.quick-view .add-to-cart-btn').click(function() {
          var self = $(this),
              data = self.closest('form').serialize();
//           var variant_id = $('.quick-view select[name=id]').val();
//           if (!variant_id) {
//             variant_id = $('.quick-view input[name=id]').val();
//           }
//           var quantity = $('.quick-view input[name=quantity]').val();
//           if (!quantity) {
//             quantity = 1;
//           }

          var title = $('.quick-view .product-title a').html();
          var image = $('.quick-view .quickview-featured-image .thumb.slick-active img').attr('src');
          ella.doAjaxAddToCart(data, title, image);
          ella.closeQuickViewPopup();
        });
      }
    },
    updateDropdownCart: function() {
      Shopify.getCart(function(cart) {
        ella.doUpdateDropdownCart(cart);
      });
    },
    doUpdateDropdownCart: function(cart) {
      var template = '<li class="item" id="cart-item-{ID}"><a href="{URL}" title="{TITLE}" class="product-image"><img src="{IMAGE}" alt="{TITLE}"></a><div class="product-details"><p class="pro_vendor">{VENDOR}</p><a href="javascript:void(0)" title="Remove This Item" class="btn-remove"><svg viewBox="0 0 24 24" id="icon-close" width="100%" height="100%"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path></svg></a><p class="product-name"><a href="{URL}">{TITLE}</a></p><div class="cart-collateral"><span class="price">{PRICE} <b>x {QUANTITY}</b></span></div></div></li>';

      $('.cartCount').text(cart.item_count);
      $('.fixcartCount').text(cart.item_count);
      /*Total price*/
      $('.dropdown-cart .summary .price').html(Shopify.formatMoney(cart.total_price, window.money_format));
      /*Clear cart*/
      $('.dropdown-cart .mini-products-list').html('');
      /*Add product to cart*/
      if (cart.item_count > 0) {
        for (var i = 0; i < cart.items.length; i++) {
          var item = template;
          item = item.replace(/\{ID\}/g, cart.items[i].id);
          item = item.replace(/\{VENDOR\}/g, cart.items[i].vendor);
          item = item.replace(/\{URL\}/g, cart.items[i].url);
          item = item.replace(/\{TITLE\}/g, ella.translateText(cart.items[i].title));
          item = item.replace(/\{QUANTITY\}/g, cart.items[i].quantity);
          item = item.replace(/\{IMAGE\}/g, Shopify.resizeImage(cart.items[i].image, 'small'));
          item = item.replace(/\{PRICE\}/g, Shopify.formatMoney(cart.items[i].price, window.money_format));
          $('.dropdown-cart .mini-products-list').append(item);
        }
        $('.dropdown-cart .btn-remove').click(function(event) {
          event.preventDefault();
          var productId = $(this).parents('.item').attr('id');
          productId = productId.match(/\d+/g);
          Shopify.removeItem(productId, function(cart) {
            ella.doUpdateDropdownCart(cart);
          });
        });
        if (ella.checkNeedToConvertCurrency()) {
          Currency.convertAll(window.shop_currency, jQuery('.currencies').val(), '.dropdown-cart span.money', 'money_format');
        }
      }
      ella.checkItemsInDropdownCart();
    },
    checkNeedToConvertCurrency: function() {
      return (window.show_multiple_currencies && Currency.currentCurrency != shopCurrency) || window.show_auto_currency;
    },
    loadQuickViewSlider: function(product, quickviewTemplate) {

      var quickViewSliderFor = quickviewTemplate.find('.quickview-featured-image');
      var count = 0;
      for (i in product.images) {
        if (count < product.images.length) {
          var featuredImage = Shopify.resizeImage(product.images[i], 'large');

          var thumb = '<div class="thumb"><a href="' + product.url + '" title="' + product.title + '"><img src="' + featuredImage + '"  /></a></div>'

          quickViewSliderFor.append(thumb);
          count = count + 1;
        }
      }


      var quickViewsliderNav = quickviewTemplate.find('.product-photo-thumbs');
      var count_2 = 0;
      for (i in product.images) {
        if (count_2 < product.images.length) {
          var grande = Shopify.resizeImage(product.images[i], 'grande');
          var compact = Shopify.resizeImage(product.images[i], 'compact');
          var item = '<div class="item"><a href="javascript:void(0)" data-image="' + grande + '"><img src="' + compact + '"  /></a></div>'

          quickViewsliderNav.append(item);
          count_2 = count_2 + 1;
        }
      }
      var timer;
      clearTimeout(timer);
      var counter = 0;
      var imgTags = quickviewTemplate.find('.quickview-featured-image img, .product-photo-thumbs img');
      imgTags.on('load', function() {
        counter++;
        if (counter === imgTags.length) {
          timer = setTimeout(function() {
            var horizontal = $(".quickview-featured-image");
            if (horizontal.hasClass("horizontal")) {
              ella.initQuickViewCarousel(quickViewSliderFor, quickViewsliderNav);
            }
            else {
              ella.initQuickViewVerticalMoreview(quickViewSliderFor, quickViewsliderNav);
            }
          }, 500);
        }
      });



    },
    initQuickViewCarousel: function(quickViewSliderFor, quickViewsliderNav ) {

      if (!quickViewSliderFor.hasClass('slick-initialized') && !quickViewsliderNav.hasClass('slick-initialized')) {
        quickViewSliderFor.slick({
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
          fade:true,
          verticalSwiping: false,
          asNavFor: quickViewsliderNav
        });

        quickViewsliderNav.slick({
          infinite: true,
          slidesToShow: 4,
          slidesToScroll: 1,
          asNavFor: quickViewSliderFor,


          verticalSwiping: false,
          dots: false,
          focusOnSelect: true,
          nextArrow: '<div class="slick-next"><i class="fa fa-angle-right"></i></div>',
          prevArrow: '<div class="slick-prev"><i class="fa fa-angle-left"></i></div>',
          responsive: [
            {
              breakpoint: 1200,
              settings: {
                slidesToShow: 3,
                slidesToScroll: 1
              }
            },
            {
              breakpoint: 1024,
              settings: {
                slidesToShow: 2,
                slidesToScroll: 1
              }
            }
          ]
        });
      }

    },
    initQuickViewVerticalMoreview: function(quickViewSliderFor, quickViewsliderNav) {
      if (!quickViewSliderFor.hasClass('slick-initialized') && !quickViewsliderNav.hasClass('slick-initialized')) {
        quickViewSliderFor.slick({
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
          fade:true,
          verticalSwiping: false,
          asNavFor: quickViewsliderNav
        });

        quickViewsliderNav.slick({
          infinite: true,
          slidesToShow: 4,
          slidesToScroll: 1,
          asNavFor: quickViewSliderFor,
          vertical: true,
          verticalSwiping: false,
          dots: false,
          focusOnSelect: true,
          nextArrow: '<div class="slick-next"><i class="fa fa-angle-right"></i></div>',
          prevArrow: '<div class="slick-prev"><i class="fa fa-angle-left"></i></div>',
          responsive: [
            {
              breakpoint: 1200,
              settings: {
                slidesToShow: 3,
                slidesToScroll: 1
              }
            },
            {
              breakpoint: 1024,
              settings: {
                slidesToShow: 2,
                slidesToScroll: 1
              }
            }
          ]
        });
      }


    },
    convertToSlug: function(text) {
      return text
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '') // remove invalid chars
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
    },
    createQuickViewVariantsSwatch: function(product, quickviewTemplate) {
      if (product.variants.length > 1) { //multiple variants
        for (var i = 0; i < product.variants.length; i++) {
          var variant = product.variants[i];
          var option = '<option value="' + variant.id + '">' + variant.title + '</option>';
          quickviewTemplate.find('form.variants > select').append(option);
        }
        new Shopify.OptionSelectors("product-select-" + product.id, {
          product: product,
          onVariantSelected: selectCallbackQuickview
        });

        //start of quickview variant;
        var filePath = window.file_url.substring(0, window.file_url.lastIndexOf('?'));
        var assetUrl = window.asset_url.substring(0, window.asset_url.lastIndexOf('?'));
        var options = "";
        for (var i = 0; i < product.options.length; i++) {
          if (/Color|Colour|size/i.test(product.options[i].name)) {
            options += '<div class="swatch clearfix" data-option-index="' + i + '">';
            options += '<div class="header">' + product.options[i].name + '<em>*</em></div>';
            var is_color = false;
            if (/Color|Colour/i.test(product.options[i].name)) {
              is_color = true;
            }
            var optionValues = new Array();
            for (var j = 0; j < product.variants.length; j++) {
              var variant = product.variants[j];
              var value = variant.options[i];
              var valueHandle = this.convertToSlug(value);
              var forText = 'swatch-' + i + '-' + valueHandle;
              if (optionValues.indexOf(value) < 0) {
                //not yet inserted
                options += '<div data-value="' + value + '" class="swatch-element ' + (is_color ? "color" : "") + valueHandle + (variant.available ? ' available ' : ' soldout ') + '">';

                if (is_color) {
                  options += '<div class="tooltip">' + value + '</div>';
                }
                options += '<input id="' + forText + '" type="radio" name="option-' + i + '" value="' + value + '" ' + (j == 0 ? ' checked ' : '') + (variant.available ? '' : ' disabled') + ' />';

                if (is_color) {
                  options += '<label for="' + forText + '" style="background-color: ' + valueHandle + '; background-image: url(' + filePath + valueHandle + '.png)"><div class="crossed-out"></div></label>';
                } else {
                  options += '<label for="' + forText + '">' + value + '<div class="crossed-out"> </div></label>';
                }
                options += '</div>';
                if (variant.available) {
                  $('.quick-view .swatch[data-option-index="' + i + '"] .' + valueHandle).removeClass('soldout').addClass('available').find(':radio').removeAttr('disabled');
                }
                optionValues.push(value);
              }
            }
            options += '</div>';
          } else {
            quickviewTemplate.find('.selector-wrapper').show();
            quickviewTemplate.find('form.variants .selector-wrapper label').each(function(i, v) {
              $(this).html(product.options[i].name + '<em>*</em>');
              quickviewTemplate.find('.selector-wrapper label:contains(Color)').parent().hide();
              quickviewTemplate.find('.selector-wrapper label:contains(Size)').parent().hide();
            });
            if (product.options.length == 1) {
              quickviewTemplate.find('.selector-wrapper:eq(0)').prepend('<label>' + product.options[0].name + '<em>*</em></label>');
              for (var text = product.variants, r = 0; r < text.length; r++ ) {
                var s = text[r];
                if (!s.available) {
                  jQuery('.single-option-selector option').filter(function() { return jQuery(this).html() === s.title }).remove();
                }
              };
            }
          }
        }
        quickviewTemplate.find('form.variants .selector-wrapper:eq(0)').before(options);
        quickviewTemplate.find('.swatch :radio').change(function() {
          var optionIndex = $(this).closest('.swatch').attr('data-option-index');
          var optionValue = $(this).val();
          $(this)
          .closest('form')
          .find('.single-option-selector')
          .eq(optionIndex)
          .val(optionValue)
          .trigger('change');
        });
        if (product.available) {
          Shopify.quickViewOptionsMap = {};
          Shopify.linkOptionSelectors(product, '.quick-view');
        }

        //end of quickview variant
      } else { //single variant
        quickviewTemplate.find('form.variants > select').remove();
        var variant_field = '<input type="hidden" name="id" value="' + product.variants[0].id + '">';
        quickviewTemplate.find('form.variants').append(variant_field);
      }
    },
    createQuickViewVariants: function(product, quickviewTemplate) {
      if (product.variants.length > 1) { //multiple variants
        for (var i = 0; i < product.variants.length; i++) {
          var variant = product.variants[i];
          var option = '<option value="' + variant.id + '">' + variant.title + '</option>';
          quickviewTemplate.find('form.variants > select').append(option);
        }

        new Shopify.OptionSelectors("product-select-" + product.id, {
          product: product,
          onVariantSelected: selectCallbackQuickview
        });

        if (product.options.length == 1) {
          $('.selector-wrapper:eq(0)').prepend('<label>' + product.options[0].name + '</label>');
          for (var text = product.variants, r = 0; r < text.length; r++ ) {
            var s = text[r];
            if (!s.available) {
              jQuery('.single-option-selector option').filter(function() { return jQuery(this).html() === s.title }).remove();
            }
          };
        }

        $('.quick-view .single-option-selector').selectize();
        $('.quick-view .selectize-input input').attr("disabled", "disabled");

        quickviewTemplate.find('form.variants .selector-wrapper label').each(function(i, v) {
          $(this).html(product.options[i].name);
        });
      } else { //single variant
        quickviewTemplate.find('form.variants > select').remove();
        var variant_field = '<input type="hidden" name="id" value="' + product.variants[0].id + '">';
        quickviewTemplate.find('form.variants').append(variant_field);
      }

    },
    closeQuickViewPopup: function() {
      $('.quick-view').fadeOut(500);
    },
    translateText: function(str) {
      if (!window.multi_lang || str.indexOf("|") < 0)
        return str;

      if (window.multi_lang) {
        var textArr = str.split("|");
        if (translator.isLang2())
          return textArr[1];
        return textArr[0];
      }          
    },
    translateBlock: function(blockSelector) {
      if (window.multi_lang && translator.isLang2()) {
        translator.doTranslate(blockSelector);
      }
    },
    hide_filter: function(){
      $(".sidebar-custom .widget-content ul").each(function() {   
        if ($(this).children('li').length > 0) {
          $(this).parents('.sidebar-custom').show();
        } else { 
          $(this).parents('.sidebar-custom').hide();
        }
      });
    },
    checkbox_checkout: function(){
      var inputWrapper = $('.checkbox-group label');  

      var checkBox = $('.checkbox-group input[type="checkbox"]');

      setTimeout(function(){
        checkBox.each(function(){
          if ($(this).is(':checked')) {
            $(this).parent().parent().find('.btn-checkout').removeClass('show');
          } else {
            $(this).parent().parent().find('.btn-checkout').addClass('show');
          }
        });
      },300);

      inputWrapper.off('click').on('click', function (e) {
        var inputTrigger= $(this).parent().find('.conditions'),
            divAddClassbtn = $(this).parent().parent().find('.btn-checkout');

        if (!inputTrigger.is(':checked')) {
          divAddClassbtn.removeClass('show');
          inputTrigger.prop('checked', true);
        } else {
          divAddClassbtn.addClass('show');
          inputTrigger.prop('checked', false);
        }

      });
    }
  }
  })(jQuery);