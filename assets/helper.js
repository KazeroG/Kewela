console.log('%c Foxic - Modern and Clean, Multipurpose Shopify Theme. Version 2.5 https://1.envato.market/jb3ze','background: #000; color: #bada55');
function getFormData($form) {
	var unindexed_array = $form.serializeArray();
	var indexed_array = {};
	$.map(unindexed_array, function (n, i) {
		indexed_array[n['name'].split('properties[').join('').split(']').join('')] = n['value'];
	});
	return indexed_array;
}
function add_to() {
	_this = $(this);
	THEME.checkOutModal.close();
	var if_in_select_popup = _this.closest('.js-popupSelectOptions').length;
	if (if_in_select_popup && THEME.selectModal.ifOpened()) THEME.selectModal.setTimer();
	THEME.shopify.frozenButon(_this, true);
	_this.html(js_helper.strings.adding);
	$form = _this.closest('form');
	id = $('[name=id]',$form).val();
	var line_properties = getFormData($('[name*=properties]', $form));
	$qty = $('[name=quantity]',$form);
	path = _this.attr('data-path');
	url = _this.attr('data-url');
	if ($qty.length) qty = $qty.val(); else qty = 1;
	CartJS.addItem(id, qty, line_properties, {
		"success": function (data, textStatus, jqXHR) {
			setTimeout(function () {
				cartPopupUpdate();
				if($('body').hasClass('minicart_auto_open'))
				{
					_this.html(js_helper.strings.added);
					THEME.selectModal && THEME.selectModal.ifOpened() && THEME.selectModal.close();
					THEME.checkOutModal && THEME.checkOutModal.ifOpened() && THEME.checkOutModal.close();
					THEME.selectSticky && THEME.selectSticky.hide();
					$.fancybox.close();
					$('.js-dropdn-link.minicart-link').click();
				} else {
					_this.html(js_helper.strings.added);
					THEME.checkOutModal.setData(_this.data('product'),path,url);
					THEME.checkOutModal.open();
				}
			}, 1200);
			setTimeout(function () {
				_this.html(js_helper.strings.addToCart);
				THEME.shopify.frozenButon(_this, false);
			}, 1400);
		},
		"error": function (data, textStatus, jqXHR) {
			if (data.responseJSON.description !== undefined){
				THEME.checkOutModal.setError(data.responseJSON.description);
			}
			THEME.checkOutModal.open();
			setTimeout(function () {
				_this.html(js_helper.strings.addToCart);
				THEME.shopify.frozenButon(_this, false);
			}, 1000);
		}
	});
	CartJS.clearAttributes();
	/*ie 11 fix ajax add to cart*/
}

function cartPopupUpdate() {
	$price_format = js_helper.moneyFormatWithCurrency;
	cart_list = '.minicart-list-prd';
	$updated_list = '';
	line_item = 1;
	$.each(CartJS.cart.items, function (index, item) {
		variant_title = '';
		properties = '';
		$.each(item.properties, function (a, b) {
			if (b != "") {
				properties = properties + '<div class="options_title">' + a + ': ' + b + '</div>';
			}
		});
		variant_title = '';
		if (item.variant_title != 'Default' && item.variant_title != undefined) {
			variant_title = '<div><a href="' + item.url + '" title="' + item.variant_title + '">' + item.variant_title + '</a></div>';
		}
		aspect_ratio = 1/item.featured_image.aspect_ratio*100;
		$item = '<div class="minicart-prd row"> <div class="minicart-prd-image col"> <a href="' + item.url + '" title="' + item.product_title + '" class="image-hover-scale image-container"  style="padding-bottom:'+aspect_ratio+'%"><img data-srcset="' + debute.Images.getSizedImageUrl(item.image, '280x') + '" class="lazyload"  alt="' + item.product_title + '"><div class="foxic-loader"></div></a> </div> <div class="minicart-prd-info col"> <div class="minicart-prd-tag">' + item.vendor + '</div> <h2 class="minicart-prd-name"><a href="' + item.url + '" title="' + item.product_title + '">' + item.product_title + '</a></h2>'+variant_title+properties+'<div class="minicart-prd-qty">' +
            '<div class="qty qty-changer" data-item-qty data-variant-id="' + item.variant_id + '" data-line-number="' + line_item + '">\n' +
            '   <button class="decrease js-qty-button-minus"></button>' +
            '   <input class="qty-input js-qty-input" type="number" value="' + item.quantity + '" data-min="1" data-max="1000" pattern="[0-9]*">\n' +
            '   <button class="increase js-qty-button-plus"></button>' +
            '</div>' +
            '</div> <div class="minicart-prd-price prd-price"> <div class="price-new">' + debute.Currency.formatMoney(item.price, $price_format) + '</div> </div> </div> <div class="minicart-prd-action"> <a href="#" data-variant-id="' + item.variant_id + '" data-line-number="' + line_item + '"    title="' + js_helper.strings.remove + '" class="icon-cross js-minicart-remove-item"><i class="icon-recycle"></i></a><a href="' + item.url + '" class="mt-1"><i class="icon-pencil"></i></a></div> </div>';
		$updated_list = $updated_list + $item;
		line_item = line_item + 1;
	});

	$('.js-minicart-empty').addClass('d-none').css({'opacity':0, 'height':0});
	$('.js-minicart-clear').removeClass('d-none');
	if($('.minicart-total').hasClass('d-none')){$('.minicart-link').removeClass('only-icon');}
	$('.minicart-list-prd ,.js-minicart-drop-total,.minicart-total,.minicart-drop-info,.minicart-drop-actions,.minicart-drop-fixed').removeClass('d-none');
	$('.js-minicart-drop-total').css({'opacity':1});
	$(cart_list).html($updated_list);
	currencyUpdate();
}
function currencyUpdate() {}

$(document).on('click', '[data-follow-up]', function (e) {
	inline_modal = $(this).attr('data-src');
	options = '';
	if($(this).attr('data-options') != 'Default Title')options = " <<>> " + "options: " + $(this).attr('data-options');
	sku = '';
	if($(this).attr('data-skuu') != '')sku = " <<>> " + "SKU: " + $(this).attr('data-skuu');
	$('textarea',$(inline_modal)).html(js_helper.strings.send_inform + ": " + $(this).attr('data-name') + options + sku);
	$.fancybox.open({
		src  : inline_modal,
		type : 'inline'
	});
	e.preventDefault();
})

$(document).on('click', '[data-grid-tab-title]', function (e) {
	var $section = $(this).closest('.section-name-products-grid');
	var $sectionId = $section.parent().attr('id');
	$section.addClass('disable-actions');
	$('[data-grid-tab-title]',$section).parent().removeClass('active');
	$(this).parent().addClass('active');
	$('[data-grid-tab-tags]',$section).removeClass('active');
	$('[data-grid-tab-tags][data-block-id='+$(this).attr('data-block-id')+']',$section).addClass('active');
	$('[data-grid-tab-tag]', '[data-grid-tab-tags][data-block-id='+$(this).attr('data-block-id')+']').removeClass('active');
	$('[data-grid-tab-tag]:first', '[data-grid-tab-tags][data-block-id='+$(this).attr('data-block-id')+']').addClass('active');
	THEME.loaderTab ? THEME.loaderTab.open($sectionId) : false;
	url = $(this).attr('href');
	$.get( url, function( data ) {
		$('[data-grid-tab-content]',$section).html('');
		$('[data-grid-tab-content]',$section).html(data);
		THEME.product.postAjaxProduct();
		wishlistPage ? wishlistPage.isWishlist() : false;
		THEME.loaderTab ? THEME.loaderTab.close($sectionId) : false
	}).done(function() {
		$section.removeClass('disable-actions');
	});
	e.preventDefault();
})

$(document).on('click', '[data-grid-tab-tag]', function (e) {
	var $section = $(this).closest('.section-name-products-grid');
	var $sectionId = $section.parent().attr('id');
	$section.addClass('disable-actions');
	$('[data-grid-tab-tag]',$section).removeClass('active');
	$(this).addClass('active');
	THEME.loaderTab ? THEME.loaderTab.open($sectionId) : false
	url = $(this).attr('href');
	$.get( url, function( data ) {
		$('[data-grid-tab-content]',$section).html(data);
		THEME.product.postAjaxProduct();
		wishlistPage ? wishlistPage.isWishlist() : false;
		THEME.loaderTab ? THEME.loaderTab.close($sectionId) : false;
	}).done(function() {
		$section.removeClass('disable-actions');
	});
	e.preventDefault();
})

$(document).on('click','[data-show-more-section-grid]',function(e){
	var $section = $(this).closest('.section-name-products-grid');
	var $sectionId = $section.parent().attr('id');
	url=$(this).attr('href').replace('#','');
	THEME.loaderTab ? THEME.loaderTab.open($sectionId,true) : false;
	$.get(url, function(data) {
		$('[data-show-more-wrapper]',$section).remove();
		$("[data-grid-tab-content]",$section).append(data);
		THEME.product.postAjaxProduct();
		wishlistPage ? wishlistPage.isWishlist() : false;
		THEME.loaderTab ? THEME.loaderTab.close($sectionId,true) : false;
	});
	e.preventDefault();
})

$(document).ready(function() {
	if($('.section-name-products-grid').length){
		loop = 0;
		start = 0;
		delay = 4000;
		$('.section-name-products-grid').each(function(){
			$el = $(this);
			if(loop == 0) {
				$('[data-grid-tab-title]:first',$el).click();
			} else {
				setTimeout(function(){
					$('[data-grid-tab-title]:first',$el).click();
				},start)
			}
			loop++;
			start+=delay;
		})
	}
});


$(document).on('click', '.js-minicart-clear', function (e) {
	CartJS.clear({
		"success": function() {
			THEME.productAction.clearAllAnimation();
			$('.js-minicart-clear').addClass('d-none');
			$('.minicart .minicart-qty').html('0');
		}
	});
	e.preventDefault();
})

$(document).on('click', '.js-minicart-remove-item', function (e) {
	$price_format = js_helper.moneyFormatWithCurrency;
	THEME.productAction.removeAnimation($(this));
	CartJS.removeItem($(this).data('line-number'),
		{
			"success": function (data, textStatus, jqXHR) {
				setTimeout(function () {
					$('.minicart .minicart-qty').html(CartJS.cart.item_count);
					if (CartJS.cart.item_count == 0) {
						THEME.productAction.removeAnimationAll();
						$('.minicart-total, .js-minicart-clear').addClass('d-none');
						$('.minicart-link').addClass('only-icon');
					}
					$('.minicart-total,.minicart-drop-total-price').html(debute.Currency.formatMoney(CartJS.cart.total_price, $price_format));
					currencyUpdate();
				}, 300)
			}
		}
	);
	e.preventDefault();
})

$(document).on('cart.requestComplete', function (event, cart) {
	currencyUpdate();
});


if ($('body').hasClass('ajax_cart')) {
	$(document).on('click', '.js-add-to-cart', function (e) {
		if(!$(this).attr('id'))
		{
			add_to.call(this);
			e.preventDefault();
		}
	});
	$(document).on('click', '.js-select-add-to-cart', function (e) {
		THEME.checkOutModal.close();
		THEME.selectModal.close();
		THEME.selectSticky ? THEME.selectSticky.close() : false;
		var $this = $(this);
		setTimeout(function(){
			THEME.selectModal.setData($this.data('product'));
			THEME.selectSticky && THEME.selectSticky.close();
			THEME.selectModal.open()
		},350)
		e.preventDefault();
	});
	$(document).on('click', '.js-follow-product', function (e) {
		THEME.checkOutModal.close();
		THEME.selectModal.close();
		e.preventDefault();
	});
}

$(function () {
	CartJS.init(js_helper.cart, {
		"dataAPI": false,
		"requestBodyClass": "loading",
		"moneyFormat": js_helper.moneyFormat,
		"moneyWithCurrencyFormat": js_helper.moneyFormatWithCurrency
	});
})

/* FOR AJAX CART PAGE */

	var closeCartTimer,
		$popupError = $('.js-popupAddToCart');
	function updateCartTable() {
		$price_format = js_helper.moneyFormatWithCurrency;
		$('.js-cart-table-prd-price-total').each(function (i) {
			$(this).html(debute.Currency.formatMoney(CartJS.cart.items[i].original_line_price, $price_format));
		})
		$('.js-card-total-price').html(debute.Currency.formatMoney(CartJS.cart.total_price, $price_format));
		$('.js-card-discount').html(debute.Currency.formatMoney(CartJS.cart.total_discount, $price_format));
		$('.js-card-subtotal-price').html(debute.Currency.formatMoney(CartJS.cart.items_subtotal_price, $price_format));
		var $table = $('.cart-table'),
			$holder = $table.closest('.shopping-cart-holder');
		if (CartJS.cart.total_price == 0) {
			var showEmpty = anime.timeline({
				easing: 'linear'
			});
			showEmpty.add({
				targets: $('.shopping-cart-content')[0],
				opacity: 0,
				duration: 350,
				complete: function () {
					$table.remove();
					$holder.addClass('shopping-cart--empty')
				}
			})
				.add({
					targets: $('.shopping-cart-empty-text')[0],
					opacity: [0,1],
					duration: 350,
				});
		}
	}
	$(document).on('click', '.js-cart-clear', function (e) {
		THEME.checkOutModal.close();
		clearTimeout(closeCartTimer);
		var $table = $('.cart-table'),
			$holder = $table.closest('.shopping-cart-holder');
		$table.addClass('disable-actions');
		anime({
			targets: $table[0],
			opacity: 0,
			duration: 300,
			easing: 'linear',
			padding: '0',
			complete: function () {
				CartJS.clear({
					"success": function (data, textStatus, jqXHR) {
						$table.remove();
						$holder.addClass('shopping-cart--empty');
						$('.js-cart-clear').addClass('d-none');
					}
				})
			}
		})
		e.preventDefault();
	})

	function inputUpdate(that){
		$('#dropdnMinicart').addClass('is-loading');
		var $input = $(that).closest('[data-item-qty]').find('.js-qty-input');
		THEME.checkOutModal.close();
		clearTimeout(closeCartTimer);
		CartJS.updateItem($(that).closest('[data-item-qty]').data('line-number'), $input.val());


	}
	function openErrorMessage($that, $input){
		var productId = $input.closest('[data-item-qty]').data('variant-id'),
			popupId = $popupError.data('variant-id'),
			error = $that.closest('.cart-table').data('max-error');
		if(productId != popupId) {
			THEME.checkOutModal.close();
			clearTimeout(closeCartTimer);
			closeCartTimer = setTimeout(function () {
				THEME.checkOutModal.setError(error);
				$popupError.data('variant-id',$input.closest('[data-item-qty]').data('variant-id'));
				THEME.checkOutModal.open();
			}, 350);
		}
	}
	$(document).on('cart.requestComplete', function (event, cart) {
		updateCartTable();
		$('[data-header-cart-discount]').html(debute.Currency.formatMoney(CartJS.cart.total_discount, $price_format));
		$('[data-header-cart-subtotal]').html(debute.Currency.formatMoney(CartJS.cart.items_subtotal_price, $price_format));
		$('[data-header-cart-total]').html(debute.Currency.formatMoney(CartJS.cart.total_price, $price_format));
		$('#dropdnMinicart').removeClass('is-loading');
		$cart_count = $('.minicart .minicart-qty');
		$cart_subtotal = $('.minicart-drop-total-price');
		$cart_subtotal_2 = $('.minicart-total');
		$cart_subtotal.html(debute.Currency.formatMoney(CartJS.cart.total_price, $price_format));
		$cart_subtotal_2.html(debute.Currency.formatMoney(CartJS.cart.total_price, $price_format));
		$cart_count.html(CartJS.cart.item_count);
	}).on('click', '.js-qty-button-plus', function (e) {
		var $that = $(this),
			$input = $that.closest('[data-item-qty]').find('.js-qty-input');
		if((parseFloat($input.val()) + 1) > parseFloat($input.data('max'))) {
			openErrorMessage($that, $input)
		} else {
			$input.val(parseFloat($input.val()) + 1);
			inputUpdate($that);
			e.preventDefault();
		}
		e.preventDefault();
	}).on('click', '.js-qty-button-minus', function (e) {
		THEME.checkOutModal.close();
		var $that = $(this),
			$input = $that.closest('[data-item-qty]').find('.js-qty-input');
		if(parseFloat($input.val()) > 1) {
			$input.val(parseFloat($input.val()) - 1);
			inputUpdate(this);
		}
		e.preventDefault();
	}).on('input', '.js-qty-input', function (e) {
		THEME.checkOutModal.close();
		var $that = $(this),
			$input = $that.closest('[data-item-qty]').find('.js-qty-input'),
			val = parseFloat($input.val());
		if(val > 1 && val <= parseFloat($input.data('max'))) {
			$input.val(parseFloat($input.val()) - 1);
			inputUpdate(this);
		} else {
			openErrorMessage($that, $input)
		}
		e.preventDefault();
	}).on('click', '.js-cart-table-prd-remove', function (e) {
		THEME.checkOutModal.close();
		clearTimeout(closeCartTimer);
        var $item = $(this).closest('.cart-table-prd'),
            $table = $('.cart-table');
        $table.addClass('disable-actions');
        anime({
            targets: $item[0],
            height: '0',
            opacity: 0,
            duration: 300,
            easing: 'linear',
            padding: '0',
            complete: function () {
                CartJS.removeItem($item.data('line-number'),{
                    "success": function (data, textStatus, jqXHR) {
                        $item.remove();
                        $('.cart-table-prd:not(.cart-table-prd--head)').each(function (i) {
                            $(this).attr('data-line-number', i + 1);
                        })
                    }
                })
                setTimeout(function () {
                    $table.removeClass('disable-actions');
                }, 600);
                updateCartTable();
            }
        });
        e.preventDefault();
	})


/* CUSTOMER ADDRESSES */

var $newAddressForm = $('#AddressNewForm');
var $newAddressFormButton = $('#AddressNewButton');

if ($newAddressForm.length) {
	if (Shopify) {
		new Shopify.CountryProvinceSelector(
			'AddressCountryNew',
			'AddressProvinceNew',
			{
				hideElement: 'AddressProvinceContainerNew'
			}
		);
	}
	$('.address-country-option').each(function () {
		var formId = $(this).data('form-id');
		var countrySelector = 'AddressCountry_' + formId;
		var provinceSelector = 'AddressProvince_' + formId;
		var containerSelector = 'AddressProvinceContainer_' + formId;
		new Shopify.CountryProvinceSelector(countrySelector, provinceSelector, {
			hideElement: containerSelector
		});
	});
	$('.address-new-toggle').on('click', function () {
		var isExpanded = $newAddressFormButton.attr('aria-expanded') === 'true';
		$.fancybox.open({
			src: '#AddressNewForm',
			type: 'inline',
			btnTpl: {
				smallBtn: '<div data-fancybox-close class="fancybox-close-small modal-close"><i class="icon-close"></i></div>'
			}
		});
		$newAddressForm.removeClass('d-none');
		$newAddressFormButton.attr('aria-expanded', !isExpanded).focus();
	});
	$('.address-edit-toggle').on('click', function () {
		var formId = $(this).data('form-id');
		var $editButton = $('#EditFormButton_' + formId);
		var $editAddress = $('#EditAddress_' + formId);
		var isExpanded = $editButton.attr('aria-expanded') === 'true';
		$.fancybox.open({
			src: '#EditAddress_' + formId,
			type: 'inline',
			btnTpl: {
				smallBtn: '<div data-fancybox-close class="fancybox-close-small modal-close"><i class="icon-close"></i></div>'
			}
		});
		$editAddress.removeClass('d-none');
		$editButton.attr('aria-expanded', !isExpanded).focus();
	});
	$('.address-delete').on('click', function () {
		var $el = $(this);
		var target = $el.data('target');
		var confirmMessage = $el.data('confirm-message');
		if (
			confirm(
				confirmMessage || 'Are you sure you wish to delete this address?'
			)
		) {
			Shopify.postLink(target, {
				parameters: {_method: 'delete'}
			});
		}
	});
}

/* WISHLIST */
var WishlistPage = {
	options: {
		wishlistGrid: '[data-wishlist-grid]',
		storageWishlist: 'foxicShopifyWishList'
	},
	init: function (options) {
		$.extend(this.options, options);
		var that = this,
			storageWishlist = that.options.storageWishlist,
			wishlistArray;
		that._handlers(that);
		that.isWishlist();
		if (window.localStorage.getItem(storageWishlist) === null) {
			wishlistArray = []
		} else wishlistArray = window.localStorage.getItem(storageWishlist).split(',');
		that._updateWishlist(wishlistArray, that);
		that.buildWishlistPage(wishlistArray, that);
	},
	buildWishlistPage: function(wishlistArray, that) {
		$price_format = js_helper.moneyFormatWithCurrency;
		var $wishlistGrid = $(that.options.wishlistGrid),
			$empty = $('.js-empty-wishlist');
		if (!$wishlistGrid.length || wishlistArray.length<1){
			$empty.removeClass('d-none');
			anime({
				targets: $empty[0],
				opacity: 1,
				duration: 350,
				easing: 'linear'
			})
			return false;
		}
		$wishlistGrid.empty();
		wishlistArray.forEach(function (item) {
			if (item == '') return false;
			$.getJSON(item, function (product) {
				product_card = '' +
					'<div class="prd prd--in-wishlist prd--style1 '+$wishlistGrid.data('product-style')+'" data-prd-handle="/products/'+product.product.handle+'"><div class="prd-inside">\n' +
					'    <div class="prd-img-area">\n' +
					'        <a title="'+product.product.title+'" href="/products/'+product.product.handle+'" class="prd-img image-hover-scale">\n' +
					'            <img src="'+debute.Images.getSizedImageUrl(product.product.image.src, '288x')+'" alt="'+product.product.title+'">\n' +
					'            <div class="foxic-loader"></div>\n' +
					'        </a>\n' +
					' <div class="prd-circle-labels">' +
					'<a href="#" class="circle-label-compare circle-label-wishlist--off js-remove-wishlist mt-0" title="'+js_helper.strings.remove_from_wishlist+'"><i class="icon-recycle"></i></a><a href="#" class="circle-label-qview js-prd-quickview" data-src="/products/'+product.product.handle+'?view=quick-view&output=embed"> <i class="icon-eye"></i> <span>'+js_helper.strings.quick_view+'</span></a>' +
					'</div>\n' +
					'    </div>' +
					'            <div class="prd-info">\n' +
					'                <div class="prd-info-wrap">\n' +
					'                    <h2 class="prd-title"><a title="'+product.title+'" href="/products/'+product.product.handle+'">'+product.product.title+'</a></h2>\n' +
					'                </div>\n' +
					' <div class="prd-hovers">\n' +
					'       <div class="prd-price">\n' +
					'            <div class="price-new">' + debute.Currency.formatMoney(product.product.variants[0].price, $price_format) + '</div>\n' +
					' 		</div>\n' +
					'	<div class="prd-action"><a class="btn" href="/products/'+product.product.handle+'">'+js_helper.strings.view_full_info+'</a>\n' +
					' </div>\n' +
					'            </div>\n' +
					'</div></div>';
				$wishlistGrid.append(product_card);
				THEME.product.postAjaxProduct();
			})
		});
	},
	_updateWishlist: function (wishlistArray, that) {
		if (wishlistArray.length) {
			window.localStorage.setItem(this.options.storageWishlist, wishlistArray);
			wishlistArray = window.localStorage.getItem(this.options.storageWishlist).split(',');
			//wishlistArray.forEach(that.buildWishlistPage(that,wishlistArray));
		} else {
			window.localStorage.removeItem(this.options.storageWishlist, '');
			$(that.options.wishlistTable).empty();
		}
	},
	_appendToWishlist: function (data, that) {
		if (window.localStorage.getItem(that.options.storageWishlist) === null) {
			wishlistArray = []
		} else wishlistArray = window.localStorage.getItem(that.options.storageWishlist).split(',');
		if (wishlistArray.indexOf(data) === -1) {
			wishlistArray.push(data);
			that._updateWishlist(wishlistArray, that)
		}
		that._updateCount(wishlistArray);
	},
	_removeFromWishlist: function (data, that) {
		if (window.localStorage.getItem(that.options.storageWishlist) === null) {
			wishlistArray = []
		} else wishlistArray = window.localStorage.getItem(that.options.storageWishlist).split(',');
		for (var i = wishlistArray.length - 1; i >= 0; i--) {
			if (wishlistArray[i].split('?').shift() === data) {
				wishlistArray.splice(i, 1);
				that._updateWishlist(wishlistArray, that)
			}
		}
		that._updateCount(wishlistArray);
		if(wishlistArray.length<1) {
			var $empty = $('.js-empty-wishlist');
			if ($empty.length) {
				$empty.removeClass('d-none');
				anime({
					targets: $empty[0],
					opacity: 1,
					duration: 300,
					easing: 'linear'
				})
			}
		}
	},
	_handlers: function (that) {
		$(document).on('click', '.js-add-wishlist', function (e) {
			if($(this).closest('[data-prd-handle]').data('prd-handle') == "") return false;
			that._appendToWishlist($(this).closest('[data-prd-handle]').data('prd-handle'), that);
			$(this).closest('[data-prd-handle]').addClass('prd--in-wishlist');
			e.preventDefault();
		})
		$(document).on('click', '.js-remove-wishlist', function (e) {
			var $product = $(this).closest('[data-prd-handle]'),
				$grid = $('.prd-grid--wishlist');
			if($product.data('prd-handle') == "") return false;
			if($grid.length){
				if($product.closest('.modal--quickview').length){
					var $toRemoveProduct = $grid.find("[data-prd-handle='" + $product.data('prd-handle') + "']");
					$toRemoveProduct.remove();
					that._removeFromWishlist($product.data('prd-handle'), that);
					$product.removeClass('prd--in-wishlist');
				} else {
					$grid.addClass('disable-actions');
					anime({
						targets: $product[0],
						opacity: 0,
						duration: 300,
						easing: 'linear',
						complete: function () {
							$product.remove();
							that._removeFromWishlist($product.data('prd-handle'), that);
							$product.removeClass('prd--in-wishlist');
							$grid.removeClass('disable-actions');
						}
					})
				}
			} else {
				that._removeFromWishlist($product.data('prd-handle'), that);
				$product.removeClass('prd--in-wishlist');
			}
			e.preventDefault();
		})
	},
	_updateCount: function (wishlistArray) {
		if(wishlistArray.length == 0){
			$('.js-wishlist-qty').html('');
		} else $('.js-wishlist-qty').html(wishlistArray.length);
	},
	isWishlist: function () {
		var that = this,
			storageWishlist = that.options.storageWishlist,
			wishlistArray;
		if (window.localStorage.getItem(storageWishlist) !== null) {
			var wishlistArray = window.localStorage.getItem(storageWishlist).split(',');
			that._updateCount(wishlistArray);
			$('[data-prd-handle]').each(function () {
				if (wishlistArray.includes($(this).data('prd-handle'))) {
					$(this).addClass('prd--in-wishlist')
				} else {
					$(this).removeClass('prd--in-wishlist')
				}
			})
		}
	}
};
var wishlistPage = Object.create(WishlistPage);
wishlistPage.init();

/*THEME.JS DEBUTE*/
window.debute = window.debute || {};
window.slate = window.slate || {};
debute.Sections = function Sections() {
	this.constructors = {};
	this.instances = [];

	$(document)
		.on('shopify:section:load', this._onSectionLoad.bind(this))
		.on('shopify:section:unload', this._onSectionUnload.bind(this))
		.on('shopify:section:select', this._onSelect.bind(this))
		.on('shopify:section:deselect', this._onDeselect.bind(this))
		.on('shopify:block:select', this._onBlockSelect.bind(this))
		.on('shopify:block:deselect', this._onBlockDeselect.bind(this));
};
debute.Sections.prototype = _.assignIn({}, debute.Sections.prototype, {
	_createInstance: function(container, constructor) {
		var $container = $(container);
		var id = $container.attr('data-section-id');
		var type = $container.attr('data-section-type');

		constructor = constructor || this.constructors[type];
		if (_.isUndefined(constructor)) {
			return;
		}
		var instance = _.assignIn(new constructor(container), {
			id: id,
			type: type,
			container: container
		});

		this.instances.push(instance);
	},

	_onSectionLoad: function(evt) {
		var container = $('[data-section-id]', evt.target)[0];
		if (container) {
			this._createInstance(container);
		}
	},

	_onSectionUnload: function(evt) {
		this.instances = _.filter(this.instances, function(instance) {
			var isEventInstance = instance.id === evt.detail.sectionId;

			if (isEventInstance) {
				if (_.isFunction(instance.onUnload)) {
					instance.onUnload(evt);
				}
			}

			return !isEventInstance;
		});
	},

	_onSelect: function(evt) {
		// eslint-disable-next-line no-shadow
		var instance = _.find(this.instances, function(instance) {
			return instance.id === evt.detail.sectionId;
		});

		if (!_.isUndefined(instance) && _.isFunction(instance.onSelect)) {
			instance.onSelect(evt);
		}
	},

	_onDeselect: function(evt) {
		// eslint-disable-next-line no-shadow
		var instance = _.find(this.instances, function(instance) {
			return instance.id === evt.detail.sectionId;
		});

		if (!_.isUndefined(instance) && _.isFunction(instance.onDeselect)) {
			instance.onDeselect(evt);
		}
	},

	_onBlockSelect: function(evt) {
		// eslint-disable-next-line no-shadow
		var instance = _.find(this.instances, function(instance) {
			return instance.id === evt.detail.sectionId;
		});

		if (!_.isUndefined(instance) && _.isFunction(instance.onBlockSelect)) {
			instance.onBlockSelect(evt);
		}
	},

	_onBlockDeselect: function(evt) {
		// eslint-disable-next-line no-shadow
		var instance = _.find(this.instances, function(instance) {
			return instance.id === evt.detail.sectionId;
		});

		if (!_.isUndefined(instance) && _.isFunction(instance.onBlockDeselect)) {
			instance.onBlockDeselect(evt);
		}
	},

	register: function(type, constructor) {
		this.constructors[type] = constructor;
		$('[data-section-type=' + type + ']').each(
			function(index, container) {
				this._createInstance(container, constructor);
			}.bind(this)
		);
	}
});
debute.Currency = (function () {
	var moneyFormat = '${{amount}}'; // eslint-disable-line camelcase

	function formatMoney(cents, format) {
		if (typeof cents === 'string') {
			cents = cents.replace('.', '');
		}
		var value = '';
		var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
		var formatString = format || moneyFormat;

		function formatWithDelimiters(number, precision, thousands, decimal) {
			thousands = thousands || ',';
			decimal = decimal || '.';

			if (isNaN(number) || number === null) {
				return 0;
			}

			number = (number / 100.0).toFixed(precision);

			var parts = number.split('.');
			var dollarsAmount = parts[0].replace(
				/(\d)(?=(\d\d\d)+(?!\d))/g,
				'$1' + thousands
			);
			var centsAmount = parts[1] ? decimal + parts[1] : '';

			return dollarsAmount + centsAmount;
		}

		switch (formatString.match(placeholderRegex)[1]) {
			case 'amount':
				value = formatWithDelimiters(cents, 2);
				break;
			case 'amount_no_decimals':
				value = formatWithDelimiters(cents, 0);
				break;
			case 'amount_with_comma_separator':
				value = formatWithDelimiters(cents, 2, '.', ',');
				break;
			case 'amount_no_decimals_with_comma_separator':
				value = formatWithDelimiters(cents, 0, '.', ',');
				break;
			case 'amount_no_decimals_with_space_separator':
				value = formatWithDelimiters(cents, 0, ' ');
				break;
			case 'amount_with_apostrophe_separator':
				value = formatWithDelimiters(cents, 2, "'");
				break;
		}

		return formatString.replace(placeholderRegex, value);
	}

	return {
		formatMoney: formatMoney
	};
})();
debute.Images = (function () {
	/**
	 * Preloads an image in memory and uses the browsers cache to store it until needed.
	 *
	 * @param {Array} images - A list of image urls
	 * @param {String} size - A shopify image size attribute
	 */

	function preload(images, size) {
		if (typeof images === 'string') {
			images = [images];
		}

		for (var i = 0; i < images.length; i++) {
			var image = images[i];
			this.loadImage(this.getSizedImageUrl(image, size));
		}
	}

	/**
	 * Loads and caches an image in the browsers cache.
	 * @param {string} path - An image url
	 */
	function loadImage(path) {
		new Image().src = path;
	}

	/**
	 * Swaps the src of an image for another OR returns the imageURL to the callback function
	 * @param image
	 * @param element
	 * @param callback
	 */
	function switchImage(image, element, callback) {
		var size = this.imageSize(element.src);
		var imageUrl = this.getSizedImageUrl(image.src, size);

		if (callback) {
			callback(imageUrl, image, element); // eslint-disable-line callback-return
		} else {
			element.src = imageUrl;
		}
	}

	/**
	 * +++ Useful
	 * Find the Shopify image attribute size
	 *
	 * @param {string} src
	 * @returns {null}
	 */
	function imageSize(src) {
		var match = src.match(
			/.+_((?:pico|icon|thumb|small|compact|medium|large|grande)|\d{1,4}x\d{0,4}|x\d{1,4})[_\\.@]/
		);

		if (match !== null) {
			if (match[2] !== undefined) {
				return match[1] + match[2];
			} else {
				return match[1];
			}
		} else {
			return null;
		}
	}

	/**
	 * +++ Useful
	 * Adds a Shopify size attribute to a URL
	 *
	 * @param src
	 * @param size
	 * @returns {*}
	 */
	function getSizedImageUrl(src, size) {
		if (size === null) {
			return src;
		}

		if (size === 'master') {
			return this.removeProtocol(src);
		}

		if (src === null) {
			return null;
		}

		var match = src.match(
			/\.(jpg|jpeg|gif|png|bmp|bitmap|tiff|tif)(\?v=\d+)?$/i
		);

		if (match !== null) {
			var prefix = src.split(match[0]);
			var suffix = match[0];

			return this.removeProtocol(prefix[0] + '_' + size + suffix);
		}

		return null;
	}

	function removeProtocol(path) {
		return path.replace(/http(s)?:/, '');
	}

	return {
		preload: preload,
		loadImage: loadImage,
		switchImage: switchImage,
		imageSize: imageSize,
		getSizedImageUrl: getSizedImageUrl,
		removeProtocol: removeProtocol
	};
})();
debute.Product = (function() {
	function Product(container) {
		var $container = (this.$container = $(container));
		var sectionId = $container.attr('data-section-id');

		this.settings = {
			// Breakpoints from src/stylesheets/global/variables.scss.liquid
			mediaQueryMediumUp: 'screen and (min-width: 750px)',
			mediaQuerySmall: 'screen and (max-width: 749px)',
			bpSmall: false,
			enableHistoryState: $container.data('enable-history-state') || false,
			namespace: '.slideshow-' + sectionId,
			sectionId: sectionId,
			sliderActive: false,
			zoomEnabled: false
		};

		this.selectors = {
			addToCart: '[data-add-to-cart]:first',
			addToCartText: '[data-add-to-cart-text]:first',
			cartCount: '[data-cart-count]',
			cartCountBubble: '[data-cart-count-bubble]',
			cartPopup: '[data-cart-popup]',
			cartPopupCartQuantity: '[data-cart-popup-cart-quantity]',
			cartPopupClose: '[data-cart-popup-close]',
			cartPopupDismiss: '[data-cart-popup-dismiss]',
			cartPopupImage: '[data-cart-popup-image]',
			cartPopupImageWrapper: '[data-cart-popup-image-wrapper]',
			cartPopupImagePlaceholder: '[data-cart-popup-image-placeholder]',
			cartPopupPlaceholderSize: '[data-placeholder-size]',
			cartPopupProductDetails: '[data-cart-popup-product-details]',
			cartPopupQuantity: '[data-cart-popup-quantity]',
			cartPopupQuantityLabel: '[data-cart-popup-quantity-label]',
			cartPopupTitle: '[data-cart-popup-title]',
			cartPopupWrapper: '[data-cart-popup-wrapper]',
			loader: '[data-loader]',
			loaderStatus: '[data-loader-status]',
			quantity: '[data-quantity-input]',
			SKU: '[data-sku]',
			stockStatus: '[data-stock-status]',
			productStatus: '[data-product-status]',
			originalSelectorId: '#ProductSelect-' + sectionId,
			productForm: '[data-product-form]',
			errorMessage: '[data-error-message]',
			errorMessageWrapper: '[data-error-message-wrapper]',
			productImageWraps: '.prd-block_main-image',
			productThumbImages: '.product-single__thumbnail--' + sectionId,
			productThumbs: '.product-single__thumbnails-' + sectionId,
			productThumbListItem: '.product-single__thumbnails-item',
			productFeaturedImage: '.product-featured-img',
			productThumbsWrapper: '.thumbnails-wrapper',
			singleOptionSelector: '.single-option-selector-' + sectionId,
			shopifyPaymentButton: '.shopify-payment-button',
			priceContainer: '[data-price]',
			regularPrice: '[data-regular-price]',
			salePrice: '[data-sale-price]',
			unitPrice: '[data-unit-price]',
			unitPriceBaseUnit: '[data-unit-price-base-unit]',
			youSave: '[data-you-save]',
			youSaveAmount: '[data-save-money]',
			youSavePercent: '[data-percent]',
			saleLabel: '[data-sale-label]',
			newLabel: '[data-new-label]',
			soldOutLabel: '[data-sold-out-label]',
			orderTime: '[data-order-time]',
			whenArrives: '[data-when-arrives]',
			buyNow: '[data-buy-now]',
			buyNowButton: '.shopify-payment-button__button',
			agree: '[data-agree]',
			followUp: '[data-follow-up]'
		};

		this.classes = {
			cartPopupWrapperHidden: 'cart-popup-wrapper--hidden',
			hidden: 'hide',
			inputError: 'input--error',
			productOnSale: 'price--on-sale',
			productUnitAvailable: 'price--unit-available',
			productUnavailable: 'price--unavailable',
			cartImage: 'cart-popup-item__image',
			productFormErrorMessageWrapperHidden:
				'product-form__error-message-wrapper--hidden',
			activeClass: 'active-thumb'
		};


		this.$addToCart = $(this.selectors.addToCart, $container);
		this.$followUp = $(this.selectors.followUp, $container);
		this.$shopifyPayment= $(this.selectors.buyNow, $container);
		this.$shopifyPaymentButton = $(this.selectors.buyNowButton, $container);
		this.$agree = $(this.selectors.agree, $container);

		// Stop parsing if we don't have the product json script tag when loading
		// section in the Theme Editor
		if (!$('#ProductJson-' + sectionId).html()) {
			return;
		}

		this.productSingleObject = JSON.parse(
			document.getElementById('ProductJson-' + sectionId).innerHTML
		);

		this._initVariants();
		this._initImageSwitch();
		this._setActiveThumbnail();
	}

	Product.prototype = _.assignIn({}, Product.prototype, {
		_initVariants: function() {
			var options = {
				$container: this.$container,
				enableHistoryState:
				this.$container.data('enable-history-state') || false,
				singleOptionSelector: this.selectors.singleOptionSelector,
				originalSelectorId: this.selectors.originalSelectorId,
				product: this.productSingleObject
			};

			this.variants = new slate.Variants(options);

			this.$container.on(
				'variantChange' + this.settings.namespace,
				this._updateAvailability.bind(this)
			);
			this.$container.on(
				'variantImageChange' + this.settings.namespace,
				this._updateImages.bind(this)
			);
			this.$container.on(
				'variantPriceChange' + this.settings.namespace,
				this._updatePrice.bind(this)
			);
			this.$container.on(
				'variantSKUChange' + this.settings.namespace,
				this._updateSKU.bind(this)
			);
		},

		_initImageSwitch: function() {
			if (!$(this.selectors.productThumbImages).length) {
				return;
			}

			var self = this;

			$(this.selectors.productThumbImages)
				.on('click', function(evt) {
					evt.preventDefault();
					var $el = $(this);

					var imageId = $el.data('thumbnail-id');

					self._switchImage(imageId);
					self._setActiveThumbnail(imageId);
				})
				.on('keyup', self._handleImageFocus.bind(self));
		},

		_setActiveThumbnail: function(imageId) {
			!$(this.$container).hasClass('modal--quickview') ? THEME.productpagegallery.switchImage(imageId) : (THEME.productpagegallery_qw ? THEME.productpagegallery_qw.switchImage(imageId) : false);
		},

		_switchImage: function(imageId) {
			if ($(this.$container).find('.prd-block_images-grid').length) return false;
			!$(this.$container).hasClass('modal--quickview') ? THEME.productpagegallery.switchImage(imageId) : (THEME.productpagegallery_qw ? THEME.productpagegallery_qw.switchImage(imageId) : false);
		},

		_handleImageFocus: function(evt) {
			if (evt.keyCode !== slate.utils.keyboardKeys.ENTER) return;

			$(this.selectors.productFeaturedImage + ':visible').focus();
		},

		_setDataVariantAddToCart: function(evt) {
			var variant = evt.variant;
			if (variant) {
				data = {}
				data.id = variant.id;
				data.name = variant.name;
				data.variant_name = '';
				data.url = '';
				data.main_image = debute.Images.getSizedImageUrl(this.productSingleObject.featured_image, '116x');
				if(variant.featured_image)
				{
					data.aspect_ratio = variant.featured_media.preview_image.aspect_ratio;
                    data.path = debute.Images.getSizedImageUrl(variant.featured_image.src, '116x');
				} else {
					data.path = data.main_image;
					if(this.productSingleObject.media)
					{
						data.aspect_ratio = this.productSingleObject.media[0].aspect_ratio;
					} else {
						data.aspect_ratio = 1;
					}

				}
				this.$addToCart.data('product', data);
			}
		},
		_youSave: function(evt) {
			var variant = evt.variant;

			var $priceContainer = $(this.selectors.priceContainer, this.$container);
			var $youSave = $(this.selectors.youSave, $priceContainer);
			var $youSaveAmount = $(this.selectors.youSaveAmount, $priceContainer);
			var $youSavePercent = $(this.selectors.youSavePercent, $priceContainer);

			/*// Reset product price state*/
			$priceContainer
				.removeClass(this.classes.productUnavailable)
				.removeClass(this.classes.productOnSale)
				.removeClass(this.classes.productUnitAvailable)
				.removeAttr('aria-hidden');


			/*// Unavailable*/
			if (!variant) {
				$priceContainer
					.addClass(this.classes.productUnavailable)
					.attr('aria-hidden', true);
				return;
			}

			if($youSave.data('you-save'))
			{
				$youSave.removeClass('d-none');
				if (variant.compare_at_price > variant.price) {
					$youSaveAmount.html(
						debute.Currency.formatMoney(
							(variant.compare_at_price - variant.price),
							js_helper.moneyFormat
						)
					);
					$youSavePercent.html(Math.floor(((variant.compare_at_price - variant.price)/variant.compare_at_price)*100));
					$youSave.removeClass('d-none');
				} else {
					$youSave.addClass('d-none');
				}
			}
		},
		_sale_new_Label: function(evt) {
			var variant = evt.variant;
			var $priceContainer = $(this.selectors.priceContainer, this.$container);
			var $saleLabel = $(this.selectors.saleLabel, this.$container);
			var $newLabel = $(this.selectors.newLabel, this.$container);
            show_sale_label = false;
            show_new_label = false;
            show_soldout_label = false;

			if (!variant) {
				$priceContainer
					.addClass(this.classes.productUnavailable)
					.attr('aria-hidden', true);
				return;
			}

            if (variant.compare_at_price > variant.price) show_sale_label = true;
            if (!variant.available) show_soldout_label = true;
            if($newLabel.length) show_new_label = true;
            if(show_soldout_label && show_sale_label)show_sale_label = false;
            $newLabel.removeClass('prd-block_label--single');
            if (show_sale_label) {
                $saleLabel.removeClass('d-none');
            } else {
                $saleLabel.addClass('d-none');
            }
            if(show_new_label)
            {
                if(show_soldout_label || (!show_sale_label && !show_soldout_label))$newLabel.addClass('prd-block_label--single');
                if(show_sale_label)$newLabel.removeClass('prd-block_label--single');
            }
		},
		_updateAddToCart: function(evt) {
			var variant = evt.variant;
			this.$shopifyPayment.removeClass('d-none');
			this.$agree.removeClass('d-none');
			if (variant) {
				if (variant.available) {
					this.$addToCart.removeClass('d-none');
					this.$followUp.addClass('d-none');
					this._setDataVariantAddToCart(evt);

					this.$addToCart
						.removeAttr('aria-disabled')
						.attr('aria-label', js_helper.strings.addToCart);
					$(this.selectors.addToCartText, this.$container).text(
						js_helper.strings.addToCart
					);
					this.$shopifyPayment.removeClass('d-none');
					this.$agree.removeClass('d-none');
				} else {
					this.$addToCart.addClass('d-none');
					this.$followUp.removeClass('d-none');
					this.$followUp.attr('data-skuu',variant.sku);
					this.$followUp.attr('data-options',variant.options);
					/*// The variant doesn't exist, disable submit button and change the text.
					 // This may be an error or notice that a specific variant is not available.*/
					this.$addToCart
						.attr('aria-disabled', true)
						.attr('aria-label', js_helper.strings.soldOut);
					$(this.selectors.addToCartText, this.$container).text(
						js_helper.strings.soldOut
					);
					this.$shopifyPayment.addClass('d-none');
					this.$agree.addClass('d-none');
				}
			} else {
				this.$addToCart.removeClass('d-none');
				this.$followUp.addClass('d-none');
				this.$addToCart
					.attr('aria-disabled', true)
					.attr('aria-label', js_helper.strings.unavailable);
				$(this.selectors.addToCartText, this.$container).text(
					js_helper.strings.unavailable
				);
				this.$shopifyPayment.addClass('d-none');
				this.$agree.addClass('d-none');
			}
		},
		_updateStockStatus: function(evt) {
			var variant = evt.variant;
			$(this.selectors.stockStatus, this.$container).removeClass('prd-in-stock').removeClass('prd-sold-out');
			$(this.selectors.soldOutLabel, this.$container).removeClass('d-none');
			$(this.selectors.orderTime, this.$container).removeClass('d-none');
			$(this.selectors.orderTime, this.$container).removeClass('d-none');
			if (variant) {
				if (variant.available) {
					$(this.selectors.stockStatus, this.$container).text(js_helper.strings.in_stock);
					$(this.selectors.stockStatus, this.$container).addClass('prd-in-stock');
					$(this.selectors.soldOutLabel, this.$container).addClass('d-none');
					$(this.selectors.orderTime, this.$container).removeClass('d-none');
					$(this.selectors.whenArrives, this.$container).addClass('d-none');
					if(this.settings.sectionId != 'modalQuickView' && THEME.progressbar) THEME.progressbar.resetNull()
				} else {
					$(this.selectors.stockStatus, this.$container).text(js_helper.strings.soldOut);
					$(this.selectors.stockStatus, this.$container).addClass('prd-sold-out');
					$(this.selectors.soldOutLabel, this.$container).removeClass('d-none');
					$(this.selectors.orderTime, this.$container).addClass('d-none');
					$(this.selectors.whenArrives, this.$container).removeClass('d-none');
					if(this.settings.sectionId != 'modalQuickView' && THEME.progressbar) THEME.progressbar.setNull(js_helper.strings.ufortunately_left+'<span class="prd-progress-text-left">0</span> '+js_helper.strings.left_in_stock_2);
				}
			} else {
				$(this.selectors.stockStatus, this.$container).text(js_helper.strings.unavailable);
				$(this.selectors.stockStatus, this.$container).addClass('prd-sold-out');
				$(this.selectors.orderTime, this.$container).addClass('d-none');
				$(this.selectors.whenArrives, this.$container).removeClass('d-none');
				if(this.settings.sectionId != 'modalQuickView' && THEME.progressbar) THEME.progressbar.setNull(js_helper.strings.ufortunately_left+'<span class="prd-progress-text-left">0</span> '+js_helper.strings.left_in_stock_2);
			}
		},

		_updateAvailability: function(evt) {
			this._updateAddToCart(evt);
			this._youSave(evt);
			this._sale_new_Label(evt);
			this._updateStockStatus(evt);
			//this._newLabel(evt);
			this._updatePrice(evt);
		},

		_updateImages: function(evt) {
			var variant = evt.variant;
			/*var imageId = variant.featured_image.id;*/
			if(variant.featured_media)
			{
				var imageId = variant.featured_media.id;
			} else {
				var imageId = 1;
			}


			this._switchImage(imageId);
			this._setActiveThumbnail(imageId);
		},

		_updatePrice: function(evt) {
			var variant = evt.variant;

			var $priceContainer = $(this.selectors.priceContainer, this.$container);
			var $regularPrice = $(this.selectors.regularPrice, $priceContainer);
			var $salePrice = $(this.selectors.salePrice, $priceContainer);
			var $unitPrice = $(this.selectors.unitPrice, $priceContainer);
			var $unitPriceBaseUnit = $(
				this.selectors.unitPriceBaseUnit,
				$priceContainer
			);

			/*// Reset product price state*/
			$priceContainer
				.removeClass(this.classes.productUnavailable)
				.removeClass(this.classes.productOnSale)
				.removeClass(this.classes.productUnitAvailable)
				.removeAttr('aria-hidden');

			/*// Unavailable*/
			if (!variant) {
				$priceContainer
					.addClass(this.classes.productUnavailable)
					.attr('aria-hidden', true);
				return;
			}

			/*// On sale*/
			if (variant.compare_at_price > variant.price) {
				$salePrice.html(
					debute.Currency.formatMoney(
						variant.compare_at_price,
						js_helper.moneyFormat
					)
				);
				$regularPrice.html(
					debute.Currency.formatMoney(variant.price, js_helper.moneyFormat)
				);
				$priceContainer.addClass(this.classes.productOnSale);

				/*update you save*/


			} else {
				/*// Regular price*/
				$salePrice.html('');
				$regularPrice.html(
					debute.Currency.formatMoney(variant.price, js_helper.moneyFormat)
				);
			}
		},

		_updateSKU: function(evt) {
			var variant = evt.variant;
			// Update the sku
			if(variant.sku){
				$(this.selectors.SKU).html(variant.sku);
			} else {
				$(this.selectors.SKU).html('-');
			}
		},

		onUnload: function() {
			this.$container.off(this.settings.namespace);
		}
	});
	return Product;
})();
debute.ProductRecommendations = (function() {
	function ProductRecommendations(container) {
		this.$container = $(container);

		var productId = this.$container.data('productId');
		var recommendationsSectionUrl =
			'/recommendations/products?&section_id=product-recommendations&product_id=' +
			productId +
			'&limit=6';

		$.get(recommendationsSectionUrl).then(
			function(section) {
				var recommendationsMarkup = $(section).html();
				if (recommendationsMarkup.trim() !== '') {
					this.$container.html(recommendationsMarkup);
				}
			}.bind(this)
		);
	}

	return ProductRecommendations;
})();
slate.Variants = (function() {
	/**
	 * Variant constructor
	 *
	 * @param {object} options - Settings from `product.js`
	 */
	function Variants(options) {
		this.$container = options.$container;
		this.product = options.product;
		this.singleOptionSelector = options.singleOptionSelector;
		this.originalSelectorId = options.originalSelectorId;
		this.enableHistoryState = options.enableHistoryState;
		this.currentVariant = this._getVariantFromOptions();

		$(this.singleOptionSelector, this.$container).on(
			'change',
			this._onSelectChange.bind(this)
		);
	}

	Variants.prototype = _.assignIn({}, Variants.prototype, {
		/**
		 * Get the currently selected options from add-to-cart form. Works with all
		 * form input elements.
		 *
		 * @return {array} options - Values of currently selected variants
		 */
		_getCurrentOptions: function() {
			var currentOptions = _.map(
				$(this.singleOptionSelector, this.$container),
				function(element) {
					var $element = $(element);
					var type = $element.attr('type');
					var currentOption = {};

					if (type === 'radio' || type === 'checkbox') {
						if ($element[0].checked) {
							currentOption.value = $element.val();
							currentOption.index = $element.data('index');

							return currentOption;
						} else {
							return false;
						}
					} else {
						currentOption.value = $element.val();
						currentOption.index = $element.data('index');

						return currentOption;
					}
				}
			);

			// remove any unchecked input values if using radio buttons or checkboxes
			currentOptions = _.compact(currentOptions);

			return currentOptions;
		},

		/**
		 * Find variant based on selected values.
		 *
		 * @param  {array} selectedValues - Values of variant inputs
		 * @return {object || undefined} found - Variant object from product.variants
		 */
		_getVariantFromOptions: function() {
			var selectedValues = this._getCurrentOptions();
			var variants = this.product.variants;

			var found = _.find(variants, function(variant) {
				return selectedValues.every(function(values) {
					return _.isEqual(variant[values.index], values.value);
				});
			});

			return found;
		},

		/**
		 * Event handler for when a variant input changes.
		 */
		_onSelectChange: function() {
			var variant = this._getVariantFromOptions();

			this.$container.trigger({
				type: 'variantChange',
				variant: variant
			});

			if (!variant) {
				return;
			}
			this._updateMasterSelect(variant);
			this._updateImages(variant);
			this._updatePrice(variant);
			this._updateSKU(variant);
			this.currentVariant = variant;

			if (this.enableHistoryState) {
				this._updateHistoryState(variant);
			}
		},

		/**
		 * Trigger event when variant image changes
		 *
		 * @param  {object} variant - Currently selected variant
		 * @return {event}  variantImageChange
		 */
		_updateImages: function(variant) {
			var variantImage = variant.featured_image || {};
			var currentVariantImage = this.currentVariant.featured_image || {};

			/*if (
				!variant.featured_image ||
				variantImage.src === currentVariantImage.src
			) {
				return;
			}*/

			this.$container.trigger({
				type: 'variantImageChange',
				variant: variant
			});
		},

		/**
		 * Trigger event when variant price changes.
		 *
		 * @param  {object} variant - Currently selected variant
		 * @return {event} variantPriceChange
		 */
		_updatePrice: function(variant) {
			if (
				variant.price === this.currentVariant.price &&
				variant.compare_at_price === this.currentVariant.compare_at_price
			) {
				return;
			}

			this.$container.trigger({
				type: 'variantPriceChange',
				variant: variant
			});
		},

		/**
		 * Trigger event when variant sku changes.
		 *
		 * @param  {object} variant - Currently selected variant
		 * @return {event} variantSKUChange
		 */
		_updateSKU: function(variant) {
			if (variant.sku === this.currentVariant.sku) {
				return;
			}

			this.$container.trigger({
				type: 'variantSKUChange',
				variant: variant
			});
		},

		/**
		 * Update history state for product deeplinking
		 *
		 * @param  {variant} variant - Currently selected variant
		 * @return {k}         [description]
		 */
		_updateHistoryState: function(variant) {
			if (!history.replaceState || !variant) {
				return;
			}

			var newurl =
				window.location.protocol +
				'//' +
				window.location.host +
				window.location.pathname +
				'?variant=' +
				variant.id;
			window.history.replaceState({ path: newurl }, '', newurl);
		},

		/**
		 * Update hidden master select of variant change
		 *
		 * @param  {variant} variant - Currently selected variant
		 */


		_updateMasterSelect: function(variant) {
			$(this.originalSelectorId, this.$container).val(variant.id);
		}
	});

	return Variants;
})();

$(document).ready(function() {
	var sections = new debute.Sections();
	sections.register('product', debute.Product);
	sections.register('product-recommendations', debute.ProductRecommendations);
});



