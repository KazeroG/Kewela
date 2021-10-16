window.theme = window.theme || {};

/* ================ SLATE ================ */
window.theme = window.theme || {};

theme.Sections = function Sections() {
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

theme.Sections.prototype = _.assignIn({}, theme.Sections.prototype, {
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

window.slate = window.slate || {};

/**
 * Slate utilities
 * -----------------------------------------------------------------------------
 * A collection of useful utilities to help build your theme
 *
 *
 * @namespace utils
 */

slate.utils = {
    /**
     * Get the query params in a Url
     * Ex
     * https://mysite.com/search?q=noodles&b
     * getParameterByName('q') = "noodles"
     * getParameterByName('b') = "" (empty value)
     * getParameterByName('test') = null (absent)
     */
    getParameterByName: function(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    },

    keyboardKeys: {
        TAB: 9,
        ENTER: 13,
        ESCAPE: 27,
        LEFTARROW: 37,
        RIGHTARROW: 39
    }
};

window.slate = window.slate || {};

/**
 * iFrames
 * -----------------------------------------------------------------------------
 * Wrap videos in div to force responsive layout.
 *
 * @namespace iframes
 */

slate.rte = {
    /**
     * Wrap tables in a container div to make them scrollable when needed
     *
     * @param {object} options - Options to be used
     * @param {jquery} options.$tables - jquery object(s) of the table(s) to wrap
     * @param {string} options.tableWrapperClass - table wrapper class name
     */
    wrapTable: function(options) {
        options.$tables.wrap(
            '<div class="' + options.tableWrapperClass + '"></div>'
        );
    },

    /**
     * Wrap iframes in a container div to make them responsive
     *
     * @param {object} options - Options to be used
     * @param {jquery} options.$iframes - jquery object(s) of the iframe(s) to wrap
     * @param {string} options.iframeWrapperClass - class name used on the wrapping div
     */
    wrapIframe: function(options) {
        options.$iframes.each(function() {
            // Add wrapper to make video responsive
            $(this).wrap('<div class="' + options.iframeWrapperClass + '"></div>');

            // Re-set the src attribute on each iframe after page load
            // for Chrome's "incorrect iFrame content on 'back'" bug.
            // https://code.google.com/p/chromium/issues/detail?id=395791
            // Need to specifically target video and admin bar
            this.src = this.src;
        });
    }
};

window.slate = window.slate || {};

/**
 * A11y Helpers
 * -----------------------------------------------------------------------------
 * A collection of useful functions that help make your theme more accessible
 * to users with visual impairments.
 *
 *
 * @namespace a11y
 */

slate.a11y = {
    /**
     * For use when focus shifts to a container rather than a link
     * eg for In-page links, after scroll, focus shifts to content area so that
     * next `tab` is where user expects if focusing a link, just $link.focus();
     *
     * @param {JQuery} $element - The element to be acted upon
     */
    pageLinkFocus: function($element) {
        var focusClass = 'js-focus-hidden';

        $element
            .first()
            .attr('tabIndex', '-1')
            .focus()
            .addClass(focusClass)
            .one('blur', callback);

        function callback() {
            $element
                .first()
                .removeClass(focusClass)
                .removeAttr('tabindex');
        }
    },

    /**
     * If there's a hash in the url, focus the appropriate element
     */
    focusHash: function() {
        var hash = window.location.hash;

        // is there a hash in the url? is it an element on the page?
        if (hash && document.getElementById(hash.slice(1))) {
            this.pageLinkFocus($(hash));
        }
    },

    /**
     * When an in-page (url w/hash) link is clicked, focus the appropriate element
     */
    bindInPageLinks: function() {
        $('a[href*=#]').on(
            'click',
            function(evt) {
                this.pageLinkFocus($(evt.currentTarget.hash));
            }.bind(this)
        );
    },

    /**
     * Traps the focus in a particular container
     *
     * @param {object} options - Options to be used
     * @param {jQuery} options.$container - Container to trap focus within
     * @param {jQuery} options.$elementToFocus - Element to be focused when focus leaves container
     * @param {string} options.namespace - Namespace used for new focus event handler
     */
    trapFocus: function(options) {
        var eventsName = {
            focusin: options.namespace ? 'focusin.' + options.namespace : 'focusin',
            focusout: options.namespace
                ? 'focusout.' + options.namespace
                : 'focusout',
            keydown: options.namespace
                ? 'keydown.' + options.namespace
                : 'keydown.handleFocus'
        };

        /**
         * Get every possible visible focusable element
         */
        var $focusableElements = options.$container.find(
            $(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex^="-"])'
            ).filter(':visible')
        );
        var firstFocusable = $focusableElements[0];
        var lastFocusable = $focusableElements[$focusableElements.length - 1];

        if (!options.$elementToFocus) {
            options.$elementToFocus = options.$container;
        }

        function _manageFocus(evt) {
            if (evt.keyCode !== slate.utils.keyboardKeys.TAB) return;

            /**
             * On the last focusable element and tab forward,
             * focus the first element.
             */
            if (evt.target === lastFocusable && !evt.shiftKey) {
                evt.preventDefault();
                firstFocusable.focus();
            }
            /**
             * On the first focusable element and tab backward,
             * focus the last element.
             */
            if (evt.target === firstFocusable && evt.shiftKey) {
                evt.preventDefault();
                lastFocusable.focus();
            }
        }

        options.$container.attr('tabindex', '-1');
        options.$elementToFocus.focus();

        $(document).off('focusin');

        $(document).on(eventsName.focusout, function() {
            $(document).off(eventsName.keydown);
        });

        $(document).on(eventsName.focusin, function(evt) {
            if (evt.target !== lastFocusable && evt.target !== firstFocusable) return;

            $(document).on(eventsName.keydown, function(evt) {
                _manageFocus(evt);
            });
        });
    },

    /**
     * Removes the trap of focus in a particular container
     *
     * @param {object} options - Options to be used
     * @param {jQuery} options.$container - Container to trap focus within
     * @param {string} options.namespace - Namespace used for new focus event handler
     */
    removeTrapFocus: function(options) {
        var eventName = options.namespace
            ? 'focusin.' + options.namespace
            : 'focusin';

        if (options.$container && options.$container.length) {
            options.$container.removeAttr('tabindex');
        }

        $(document).off(eventName);
    },

    /**
     * Add aria-describedby attribute to external and new window links
     *
     * @param {object} options - Options to be used
     * @param {object} options.messages - Custom messages to be used
     * @param {jQuery} options.$links - Specific links to be targeted
     */
    accessibleLinks: function(options) {
        var body = document.querySelector('body');

        var idSelectors = {
            newWindow: 'a11y-new-window-message',
            external: 'a11y-external-message',
            newWindowExternal: 'a11y-new-window-external-message'
        };

        if (options.$links === undefined || !options.$links.jquery) {
            options.$links = $('a[href]:not([aria-describedby])');
        }

        function generateHTML(customMessages) {
            if (typeof customMessages !== 'object') {
                customMessages = {};
            }

            var messages = $.extend(
                {
                    newWindow: 'Opens in a new window.',
                    external: 'Opens external website.',
                    newWindowExternal: 'Opens external website in a new window.'
                },
                customMessages
            );

            var container = document.createElement('ul');
            var htmlMessages = '';

            for (var message in messages) {
                htmlMessages +=
                    '<li id=' + idSelectors[message] + '>' + messages[message] + '</li>';
            }

            container.setAttribute('hidden', true);
            container.innerHTML = htmlMessages;

            body.appendChild(container);
        }

        function _externalSite($link) {
            var hostname = window.location.hostname;

            return $link[0].hostname !== hostname;
        }

        $.each(options.$links, function() {
            var $link = $(this);
            var target = $link.attr('target');
            var rel = $link.attr('rel');
            var isExternal = _externalSite($link);
            var isTargetBlank = target === '_blank';

            if (isExternal) {
                $link.attr('aria-describedby', idSelectors.external);
            }
            if (isTargetBlank) {
                if (rel === undefined || rel.indexOf('noopener') === -1) {
                    $link.attr('rel', function(i, val) {
                        var relValue = val === undefined ? '' : val + ' ';
                        return relValue + 'noopener';
                    });
                }
                $link.attr('aria-describedby', idSelectors.newWindow);
            }
            if (isExternal && isTargetBlank) {
                $link.attr('aria-describedby', idSelectors.newWindowExternal);
            }
        });

        generateHTML(options.messages);
    }
};


/**
 * Image Helper Functions
 * -----------------------------------------------------------------------------
 * A collection of functions that help with basic image operations.
 *
 */

theme.Images = (function() {
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

/**
 * Currency Helpers
 * -----------------------------------------------------------------------------
 * A collection of useful functions that help with currency formatting
 *
 * Current contents
 * - formatMoney - Takes an amount in cents and returns it as a formatted dollar value.
 *
 * Alternatives
 * - Accounting.js - http://openexchangerates.github.io/accounting.js/
 *
 */

theme.Currency = (function() {
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

/**
 * Variant Selection scripts
 * ------------------------------------------------------------------------------
 *
 * Handles change events from the variant inputs in any `cart/add` forms that may
 * exist.  Also updates the master select and triggers updates when the variants
 * price or image changes.
 *
 * @namespace variants
 */

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
        this._firstupdateVariant(this.currentVariant);

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
            // debugger;
            var selectedValues = this._getCurrentOptions();
            var variants = this.product.variants;
            var selectedOption1;
            var selectedOption2;
            var selectedOption3;
            var check_swatch_option = false;

            if ($('.selector-wrapper-1', this.$container).hasClass('swatch')) {
                check_swatch_option = true;
            }
            
            var found = _.find(variants, function(variant) {
                return selectedValues.every(function(values) {
                    return _.isEqual(variant[values.index], values.value);
                });
            });

            if (found == undefined || found.available == false) {

                if (check_swatch_option == true) {
                    selectedOption1 = $('.selector-wrapper-1', this.$container).find('input:checked').val();
                    selectedOption2 = $('.selector-wrapper-2', this.$container).find('input:checked').val();
                    selectedOption3 = $('.selector-wrapper-3', this.$container).find('input:checked').val();

                    $('.selector-wrapper-3 .swatch-element', this.$container).each(function(){
                        var swatchVal = $(this).data('value');
                        var optionSoldout = variants.find(function(variant){
                            return variant.option1 == selectedOption1 && variant.option2 == selectedOption2 && variant.option3 == swatchVal && variant.available;
                        });

                        if(optionSoldout == undefined){
                            $(this).addClass('soldout');
                            $(this).find(':radio').prop('disabled',true);
                        } else {
                            $(this).removeClass('soldout');
                            $(this).find(':radio').prop('disabled',false);
                            $(this).find(':radio').prop('checked',true);
                            $('.label-value-3', this.$container).html(optionSoldout.option3);
                        }
                    })

                    selectedValues = this._getCurrentOptions();
                    found = _.find(variants, function(variant) {
                        return selectedValues.every(function(values) {
                            return _.isEqual(variant[values.index], values.value);
                        });
                    });

                    if (found == undefined || found.available == false) {
                        $('.selector-wrapper-3 .swatch-element', this.$container).each(function(){
                            var swatchVal = $(this).data('value');
                            var optionSoldout = variants.find(function(variant){
                                return variant.option1 == selectedOption1 && variant.option3 == swatchVal && variant.available;
                            });

                            if(optionSoldout == undefined){
                                $(this).addClass('soldout');
                                $(this).find(':radio').prop('disabled',true);
                            } else {
                                $(this).removeClass('soldout');
                                $(this).find(':radio').prop('disabled',false);
                                $(this).find(':radio').prop('checked',true);
                                $('.label-value-3', this.$container).html(optionSoldout.option3);
                            }
                        })

                        selectedOption3 = $('.selector-wrapper-3', this.$container).find('input:checked').val();

                        $('.selector-wrapper-2 .swatch-element', this.$container).each(function(){
                            var swatchVal = $(this).data('value');
                            var optionSoldout = variants.find(function(variant){
                                return variant.option1 == selectedOption1 && variant.option3 == selectedOption3 && variant.option2 == swatchVal && variant.available;
                            });

                            if(optionSoldout == undefined){
                                $(this).addClass('soldout');
                                $(this).find(':radio').prop('disabled',true);
                            } else {
                                $(this).removeClass('soldout');
                                $(this).find(':radio').prop('disabled',false);
                                $(this).find(':radio').prop('checked',true);
                                $('.label-value-2', this.$container).html(optionSoldout.option2);
                            } 
                        })

                        selectedValues = this._getCurrentOptions();
                        found = _.find(variants, function(variant) {
                            return selectedValues.every(function(values) {
                                return _.isEqual(variant[values.index], values.value);
                            });
                        });
                    }
                } else {
                    selectedOption1 = $('.selector-wrapper-1', this.$container).find('option:selected').val();
                    selectedOption2 = $('.selector-wrapper-2', this.$container).find('option:selected').val();
                    selectedOption3 = $('.selector-wrapper-3', this.$container).find('option:selected').val();

                    $('.selector-wrapper-3 .single-option-selector option', this.$container).each(function(){
                        var swatchVal = $(this).val();
                        var optionSoldout = variants.find(function(variant){
                            return variant.option1 == selectedOption1 && variant.option2 == selectedOption2 && variant.option3 == swatchVal && variant.available;
                        });

                        if(optionSoldout == undefined){
                            $(this).attr('disabled','disabled').removeAttr('selected','selected').prop('selected', false);
                        } else {
                            $(this).removeAttr('disabled','disabled').attr('selected','selected').prop('selected', true);
                            $('.label-value-3', this.$container).html(optionSoldout.option3);
                        }
                    })

                    selectedValues = this._getCurrentOptions();
                    found = _.find(variants, function(variant) {
                        return selectedValues.every(function(values) {
                            return _.isEqual(variant[values.index], values.value);
                        });
                    });

                    if (found == undefined || found.available == false) {

                        $('.selector-wrapper-3 .single-option-selector option', this.$container).each(function(){
                            var swatchVal = $(this).val();
                            var optionSoldout = variants.find(function(variant){
                                return variant.option1 == selectedOption1 && variant.option3 == swatchVal && variant.available;
                            });

                            if(optionSoldout == undefined){
                                $(this).attr('disabled','disabled').removeAttr('selected','selected').prop('selected', false);
                            } else {
                                $(this).removeAttr('disabled','disabled').attr('selected','selected').prop('selected', true);
                                $('.label-value-3', this.$container).html(optionSoldout.option3);
                            }
                        })

                        selectedOption3 = $('.selector-wrapper-3', this.$container).find('option:selected').val();


                        $('.selector-wrapper-2 .single-option-selector option', this.$container).each(function(){
                            var swatchVal = $(this).val();
                            var optionSoldout = variants.find(function(variant){
                                return variant.option1 == selectedOption1 && variant.option3 == selectedOption3 && variant.option2 == swatchVal && variant.available;
                            });

                            if(optionSoldout == undefined){
                                $(this).attr('disabled','disabled').removeAttr('selected','selected').prop('selected', false);
                            } else {
                                $(this).removeAttr('disabled','disabled').attr('selected','selected').prop('selected', true);
                                $('.label-value-2', this.$container).html(optionSoldout.option2);
                            }
                        })

                        selectedValues = this._getCurrentOptions();
                        found = _.find(variants, function(variant) {
                            return selectedValues.every(function(values) {
                                return _.isEqual(variant[values.index], values.value);
                            });
                        });
                    }
                }
            }

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
            this._updatePrice(variant);
            if($('[data-change-group-image]').length == 0) {
               this._updateImages(variant);
            }
            if($('[data-change-group-image]').length) {
                var $inputChecked = $('[data-change-group-image]').find('.swatch-element.color :radio:checked');
                var className = $inputChecked.data('filter');
                if (className == undefined) {
                  if ($('input[data-filter]').is(':checked')) {
                    var checked = $('input[data-filter]:checked').data('filter');
                    className = checked;
                  }
                }
            
                if(className !== undefined) {
                    var $carousel_nav = $("#ProductSection-product-template .product_layout .product_photos .product-slider").find('.slider-nav'),
                        $carousel_for = $("#ProductSection-product-template .product_layout .product_photos .product-slider").find('.slider-for');

                    if(className !== undefined) {
                      $carousel_nav.slick('slickUnfilter');
                      $carousel_for.slick('slickUnfilter');
                      if($carousel_nav.find(className).length && $carousel_for.find(className).length) {
                          // alert('1');
                        $carousel_nav.slick('slickFilter', className).slick('refresh');
                        $carousel_for.slick('slickFilter', className).slick('refresh');          
                      }else{
                          // alert('2');
                      }

                      var demo = $inputChecked.data('image-input');
                      $('.slider-nav .item').each(function(){
                        var demo_t = $(this).find('img').attr('src');
                        if (demo == demo_t) {
                            $('.product-single__thumbnail--product-template').removeClass('active-thumb');
                            $(this).trigger('click');
                        }
                      });
                    };
                }
                this._updateImages(variant);
            }
            this._updateSKU(variant);
            this._updateVariant(variant);
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

            if (
                !variant.featured_image ||
                variantImage.src === currentVariantImage.src
            ) {
                return;
            }

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

        _firstupdateVariant: function(_variant){
            var self = this;
            var check_swatch_option = false;

            if ($('.selector-wrapper-1', this.$container).hasClass('swatch')) {
                check_swatch_option = true;
            }

            if (_variant) {
                if (check_swatch_option == true) {
                    var variants = this.product.variants;
                    var options = $('.selector-wrapper', this.$container);
                    var selectedOption1 = $('.selector-wrapper-1', this.$container).find('input:checked').val();
                    var selectedOption2 = $('.selector-wrapper-2', this.$container).find('input:checked').val();
                    var selectedOption3 = $('.selector-wrapper-3', this.$container).find('input:checked').val();

                    options.each(function(){
                        var optionIndex = $(this).data('option-index');
                        var swatch = $(this).find('.swatch-element');
                        switch (optionIndex) {
                            case 1:
                                swatch.each(function(){
                                    var swatchVal = $(this).data('value');
                                    var optionSoldout = variants.find(function(variant){
                                        return variant.option1 == swatchVal && variant.available;
                                    });
                                    if(optionSoldout == undefined){
                                        $(this).addClass('soldout');
                                        $(this).find(':radio').prop('disabled',true);
                                    } else {
                                        $(this).removeClass('soldout');
                                        $(this).find(':radio').prop('disabled',false);
                                    }
                                })
                                break;
                            case 2:
                                swatch.each(function(){
                                    var swatchVal = $(this).data('value');
                                    var optionSoldout = variants.find(function(variant){
                                        return variant.option1 == selectedOption1 && variant.option2 == swatchVal && variant.available;
                                    });
                                    if(optionSoldout == undefined){
                                        $(this).addClass('soldout');
                                        $(this).find(':radio').prop('disabled',true);
                                    } else {
                                        $(this).removeClass('soldout');
                                        $(this).find(':radio').prop('disabled',false);
                                    }
                                })
                                break;
                            case 3:
                                swatch.each(function(){
                                    var swatchVal = $(this).data('value');
                                    var optionSoldout = variants.find(function(variant){
                                        return variant.option1 == selectedOption1 && variant.option2 == selectedOption2 && variant.option3 == swatchVal && variant.available;
                                    });
                                    if(optionSoldout == undefined){
                                        $(this).addClass('soldout');
                                        $(this).find(':radio').prop('disabled',true);
                                    } else {
                                        $(this).removeClass('soldout');
                                        $(this).find(':radio').prop('disabled',false);
                                    }
                                })
                                break;
                        }
                    });
                } else {
                    var variants = this.product.variants;
                    var options = $('.selector-wrapper', this.$container);
                    var selectedOption1 = $('.selector-wrapper-1', this.$container).find('option:selected').val();
                    var selectedOption2 = $('.selector-wrapper-2', this.$container).find('option:selected').val();
                    var selectedOption3 = $('.selector-wrapper-3', this.$container).find('option:selected').val();

                    options.each(function(){
                        var optionIndex = $(this).data('option-index');
                        var option = $(this).find('option');
                        switch (optionIndex) {
                            case 1:
                                option.each(function(){
                                    var optionVal = $(this).val();
                                    var optionSoldout = variants.find(function(variant){
                                        return variant.option1 == optionVal && variant.available;
                                    });
                                    if(optionSoldout == undefined){
                                        $(this).attr('disabled','disabled');
                                    } else {
                                        $(this).removeAttr('disabled','disabled');
                                    }
                                })
                                break;
                            case 2:
                                option.each(function(){
                                    var optionVal = $(this).val();
                                    var optionSoldout = variants.find(function(variant){
                                        return variant.option1 == selectedOption1 && variant.option2 == optionVal && variant.available;
                                    });
                                    if(optionSoldout == undefined){
                                        $(this).attr('disabled','disabled');
                                    } else {
                                        $(this).removeAttr('disabled','disabled');
                                    }
                                })
                                break;
                            case 3:
                                option.each(function(){
                                    var optionVal = $(this).val();
                                    var optionSoldout = variants.find(function(variant){
                                        return variant.option1 == selectedOption1 && variant.option2 == selectedOption2 && variant.option3 == optionVal && variant.available;
                                    });
                                    
                                    if(optionSoldout == undefined){
                                        $(this).attr('disabled','disabled');
                                    } else {
                                        $(this).removeAttr('disabled','disabled');
                                    }
                                })
                                break;
                        }
                    });
                }
                if (_variant.featured_media == null) {
                    return;
                } else {
                    var imageId = _variant.featured_media.id;
                    $(document).ready(function() {
                        self._switchImage(imageId);
                        self._setActiveThumbnail(imageId);
                    })
                }
            }
        },

        _updateVariant: function(_variant) {
            var self = this;
            var check_swatch_option = false;

            if ($('.selector-wrapper-1', this.$container).hasClass('swatch')) {
                check_swatch_option = true;
            }

            if (_variant) {

                var option1 = _variant.option1;
                var option2 = _variant.option2;
                var option3 = _variant.option3;
                var option_change = '';
                var option_value = '';
                
                if (check_swatch_option == true) {
                    var variants = this.product.variants;
                    var options = $('.selector-wrapper', this.$container);
                    var selectedOption1 = $('.selector-wrapper-1', this.$container).find('input:checked').val();
                    var selectedOption2 = $('.selector-wrapper-2', this.$container).find('input:checked').val();
                    var selectedOption3 = $('.selector-wrapper-3', this.$container).find('input:checked').val();

                    options.each(function(){
                        var optionIndex = $(this).data('option-index');
                        var swatch = $(this).find('.swatch-element');
                        switch (optionIndex) {
                            case 1:
                                swatch.each(function(){
                                    var swatchVal = $(this).data('value');
                                    var optionSoldout = variants.find(function(variant){
                                        return variant.option1 == swatchVal && variant.available;
                                    });
                                    if(optionSoldout == undefined){
                                        $(this).addClass('soldout');
                                        $(this).find(':radio').prop('disabled',true);
                                    } else {
                                        $(this).removeClass('soldout');
                                        $(this).find(':radio').prop('disabled',false);
                                    }
                                })
                                break;
                            case 2:
                                swatch.each(function(){
                                    var swatchVal = $(this).data('value');
                                    var optionSoldout = variants.find(function(variant){
                                        return variant.option1 == selectedOption1 && variant.option2 == swatchVal && variant.available;
                                    });
                                    if(optionSoldout == undefined){
                                        $(this).addClass('soldout');
                                        $(this).find(':radio').prop('disabled',true);
                                    } else {
                                        $(this).removeClass('soldout');
                                        $(this).find(':radio').prop('disabled',false);
                                    }
                                })
                                break;
                            case 3:
                                swatch.each(function(){
                                    var swatchVal = $(this).data('value');
                                    var optionSoldout = variants.find(function(variant){
                                        return variant.option1 == selectedOption1 && variant.option2 == selectedOption2 && variant.option3 == swatchVal && variant.available;
                                    });
                                    if(optionSoldout == undefined){
                                        $(this).addClass('soldout');
                                        $(this).find(':radio').prop('disabled',true);
                                    } else {
                                        $(this).removeClass('soldout');
                                        $(this).find(':radio').prop('disabled',false);
                                    }
                                })
                                break;
                        }
                    });
                } else {
                    var variants = this.product.variants;
                    var options = $('.selector-wrapper', this.$container);
                    var selectedOption1 = $('.selector-wrapper-1', this.$container).find('option:selected').val();
                    var selectedOption2 = $('.selector-wrapper-2', this.$container).find('option:selected').val();
                    var selectedOption3 = $('.selector-wrapper-3', this.$container).find('option:selected').val();

                    options.each(function(){
                        var optionIndex = $(this).data('option-index');
                        var option = $(this).find('option');
                        switch (optionIndex) {
                            case 1:
                                option.each(function(){
                                    var optionVal = $(this).val();
                                    var optionSoldout = variants.find(function(variant){
                                        return variant.option1 == optionVal && variant.available;
                                    });
                                    if(optionSoldout == undefined){
                                        $(this).attr('disabled','disabled');
                                    } else {
                                        $(this).removeAttr('disabled','disabled');
                                    }
                                })
                                break;
                            case 2:
                                option.each(function(){
                                    var optionVal = $(this).val();
                                    var optionSoldout = variants.find(function(variant){
                                        return variant.option1 == selectedOption1 && variant.option2 == optionVal && variant.available;
                                    });
                                    if(optionSoldout == undefined){
                                        $(this).attr('disabled','disabled');
                                    } else {
                                        $(this).removeAttr('disabled','disabled');
                                    }
                                })
                                break;
                            case 3:
                                option.each(function(){
                                    var optionVal = $(this).val();
                                    var optionSoldout = variants.find(function(variant){
                                        return variant.option1 == selectedOption1 && variant.option2 == selectedOption2 && variant.option3 == optionVal && variant.available;
                                    });
                                    
                                    if(optionSoldout == undefined){
                                        $(this).attr('disabled','disabled');
                                    } else {
                                        $(this).removeAttr('disabled','disabled');
                                    }
                                })
                                break;
                        }
                    });
                }
            }
        },

        _switchImage: function(imageId) {
            var $newImage = $(".product_template .product-single__photo[data-image-id='" + imageId + "']");
            var $otherImages = $(".product_template .product-single__photo:not([data-image-id='" + imageId + "'])");
        },

        _setActiveThumbnail: function(imageId) {
            // If there is no element passed, find it by the current product image
            if (typeof imageId === 'undefined') {
                imageId = $('.product_template .product-single__photo:not(.hide)').data('image-id');
            }

            var $thumbnailWrappers = $('.product_template .product-single__thumbnails-item:not(.slick-cloned)');

            var $activeThumbnail = $thumbnailWrappers.find(".product-single__thumbnail--product-template[data-thumbnail-id='" + imageId + "']");

            $('.product-single__thumbnail--product-template')
                .removeClass('active-thumb')
                .removeAttr('aria-current');

            $activeThumbnail.addClass('active-thumb');
            $activeThumbnail.attr('aria-current', true);

            if (!$thumbnailWrappers.hasClass('slick-slide')) {
                return;
            }
            var slideIndex = $activeThumbnail.parent().data('slick-index');
            $('.product-single__thumbnails-product-template').slick('slickGoTo', slideIndex);
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

slate.Variants2 = (function() {
    /**
     * Variant constructor
     *
     * @param {object} options - Settings from `product.js`
     */
    function Variants2(options) {
        this.$container = options.$container;
        this.product = options.product;
        this.singleOptionSelector = options.singleOptionSelector;
        this.originalSelectorId = options.originalSelectorId;
        this.enableHistoryState = options.enableHistoryState;
        this.currentVariant = this._getVariantFromOptions();
        this._firstupdateVariant(this.currentVariant);

        $(this.singleOptionSelector, this.$container).on(
            'change',
            this._onSelectChange.bind(this)
        );
    }

    Variants2.prototype = _.assignIn({}, Variants2.prototype, {
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
            var selectedOption1;
            var selectedOption2;
            var selectedOption3;
            var check_swatch_option = false;

            if ($('.selector-wrapper-1', this.$container).hasClass('swatch')) {
                check_swatch_option = true;
            }
            
            var found = _.find(variants, function(variant) {
                return selectedValues.every(function(values) {
                    return _.isEqual(variant[values.index], values.value);
                });
            });

            if (found == undefined || found.available == false) {

                if (check_swatch_option == true) {
                    selectedOption1 = $('.selector-wrapper-1', this.$container).find('input:checked').val();
                    selectedOption2 = $('.selector-wrapper-2', this.$container).find('input:checked').val();
                    selectedOption3 = $('.selector-wrapper-3', this.$container).find('input:checked').val();

                    $('.selector-wrapper-3 .swatch-element', this.$container).each(function(){
                        var swatchVal = $(this).data('value');
                        var optionSoldout = variants.find(function(variant){
                            return variant.option1 == selectedOption1 && variant.option2 == selectedOption2 && variant.option3 == swatchVal && variant.available;
                        });

                        if(optionSoldout == undefined){
                            $(this).addClass('soldout');
                            $(this).find(':radio').prop('disabled',true);
                        } else {
                            $(this).removeClass('soldout');
                            $(this).find(':radio').prop('disabled',false);
                            $(this).find(':radio').prop('checked',true);
                            $('.label-value-3', this.$container).html(optionSoldout.option3);
                        }
                    })

                    selectedValues = this._getCurrentOptions();
                    found = _.find(variants, function(variant) {
                        return selectedValues.every(function(values) {
                            return _.isEqual(variant[values.index], values.value);
                        });
                    });

                    if (found == undefined || found.available == false) {
                        $('.selector-wrapper-3 .swatch-element', this.$container).each(function(){
                            var swatchVal = $(this).data('value');
                            var optionSoldout = variants.find(function(variant){
                                return variant.option1 == selectedOption1 && variant.option3 == swatchVal && variant.available;
                            });

                            if(optionSoldout == undefined){
                                $(this).addClass('soldout');
                                $(this).find(':radio').prop('disabled',true);
                            } else {
                                $(this).removeClass('soldout');
                                $(this).find(':radio').prop('disabled',false);
                                $(this).find(':radio').prop('checked',true);
                                $('.label-value-3', this.$container).html(optionSoldout.option3);
                            }
                        })

                        selectedOption3 = $('.selector-wrapper-3', this.$container).find('input:checked').val();

                        $('.selector-wrapper-2 .swatch-element', this.$container).each(function(){
                            var swatchVal = $(this).data('value');
                            var optionSoldout = variants.find(function(variant){
                                return variant.option1 == selectedOption1 && variant.option3 == selectedOption3 && variant.option2 == swatchVal && variant.available;
                            });

                            if(optionSoldout == undefined){
                                $(this).addClass('soldout');
                                $(this).find(':radio').prop('disabled',true);
                            } else {
                                $(this).removeClass('soldout');
                                $(this).find(':radio').prop('disabled',false);
                                $(this).find(':radio').prop('checked',true);
                                $('.label-value-2', this.$container).html(optionSoldout.option2);
                            } 
                        })

                        selectedValues = this._getCurrentOptions();
                        found = _.find(variants, function(variant) {
                            return selectedValues.every(function(values) {
                                return _.isEqual(variant[values.index], values.value);
                            });
                        });
                    }
                } else {
                    selectedOption1 = $('.selector-wrapper-1', this.$container).find('option:selected').val();
                    selectedOption2 = $('.selector-wrapper-2', this.$container).find('option:selected').val();
                    selectedOption3 = $('.selector-wrapper-3', this.$container).find('option:selected').val();

                    $('.selector-wrapper-3 .single-option-selector option', this.$container).each(function(){
                        var swatchVal = $(this).val();
                        var optionSoldout = variants.find(function(variant){
                            return variant.option1 == selectedOption1 && variant.option2 == selectedOption2 && variant.option3 == swatchVal && variant.available;
                        });

                        if(optionSoldout == undefined){
                            $(this).attr('disabled','disabled').removeAttr('selected','selected').prop('selected', false);
                        } else {
                            $(this).removeAttr('disabled','disabled').attr('selected','selected').prop('selected', true);
                            $('.label-value-3', this.$container).html(optionSoldout.option3);
                        }
                    })

                    selectedValues = this._getCurrentOptions();
                    found = _.find(variants, function(variant) {
                        return selectedValues.every(function(values) {
                            return _.isEqual(variant[values.index], values.value);
                        });
                    });

                    if (found == undefined || found.available == false) {

                        $('.selector-wrapper-3 .single-option-selector option', this.$container).each(function(){
                            var swatchVal = $(this).val();
                            var optionSoldout = variants.find(function(variant){
                                return variant.option1 == selectedOption1 && variant.option3 == swatchVal && variant.available;
                            });

                            if(optionSoldout == undefined){
                                $(this).attr('disabled','disabled').removeAttr('selected','selected').prop('selected', false);
                            } else {
                                $(this).removeAttr('disabled','disabled').attr('selected','selected').prop('selected', true);
                                $('.label-value-3', this.$container).html(optionSoldout.option3);
                            }
                        })

                        selectedOption3 = $('.selector-wrapper-3', this.$container).find('option:selected').val();


                        $('.selector-wrapper-2 .single-option-selector option', this.$container).each(function(){
                            var swatchVal = $(this).val();
                            var optionSoldout = variants.find(function(variant){
                                return variant.option1 == selectedOption1 && variant.option3 == selectedOption3 && variant.option2 == swatchVal && variant.available;
                            });

                            if(optionSoldout == undefined){
                                $(this).attr('disabled','disabled').removeAttr('selected','selected').prop('selected', false);
                            } else {
                                $(this).removeAttr('disabled','disabled').attr('selected','selected').prop('selected', true);
                                $('.label-value-2', this.$container).html(optionSoldout.option2);
                            }
                        })

                        selectedValues = this._getCurrentOptions();
                        found = _.find(variants, function(variant) {
                            return selectedValues.every(function(values) {
                                return _.isEqual(variant[values.index], values.value);
                            });
                        });
                    }
                }
            }

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
            if($('[data-change-group-image]').length == 0) {
               this._updateImages(variant);
            }
            this._updatePrice(variant);
            this._updateSKU(variant);
            this._updateVariant(variant);
            this.currentVariant = variant;

            if (this.enableHistoryState) {
                this._updateHistoryState(variant);
            }

            var $inputChecked = $('[data-change-group-image-qv]').find('.swatch-element.color :radio:checked');
            var className = $inputChecked.data('filter');

            if (className == undefined) {
              if ($('input[data-filter]').is(':checked')) {
                var checked = $('input[data-filter]:checked').data('filter');
                className = checked;
              }
            }

            if($('[data-change-group-image-qv]').length && className !== undefined) {
                var $carousel_nav = $('[data-change-group-image-qv]').find('.slider-nav'),
                    $carousel_for = $('[data-change-group-image-qv]').find('.slider-for');
                if($inputChecked.length) {
                    var className = $inputChecked.data('filter');

                    if(className !== undefined) {
                      $carousel_nav.slick('slickUnfilter');
                      $carousel_for.slick('slickUnfilter');
                      if($carousel_nav.find(className).length && $carousel_for.find(className).length) {
                        $carousel_nav.slick('slickFilter', className).slick('refresh');
                        $carousel_for.slick('slickFilter', className).slick('refresh');           
                      }
                      var demo = $inputChecked.data('image-input');
                      $('[data-change-group-image-qv] .slider-nav .item').each(function(){

                        var demo_t = $(this).find('img').attr('src');
                        if (demo == demo_t) {
                            $('.product-single__thumbnail').removeClass('active-thumb');
                            $(this).trigger('click');
                        }
                      });
                    };
                };
                this._updateImages(variant);
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

            if (
                !variant.featured_image ||
                variantImage.src === currentVariantImage.src
            ) {
                return;
            }

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
                window.location.pathname;
            window.history.replaceState({ path: newurl }, '', newurl);
        },

        _firstupdateVariant: function(_variant){
            var self = this;
            var check_swatch_option = false;

            if ($('.selector-wrapper-1', this.$container).hasClass('swatch')) {
                check_swatch_option = true;
            }

            if (_variant) {
                if (check_swatch_option == true) {
                    var variants = this.product.variants;
                    var options = $('.selector-wrapper', this.$container);
                    var selectedOption1 = $('.selector-wrapper-1', this.$container).find('input:checked').val();
                    var selectedOption2 = $('.selector-wrapper-2', this.$container).find('input:checked').val();
                    var selectedOption3 = $('.selector-wrapper-3', this.$container).find('input:checked').val();

                    options.each(function(){
                        var optionIndex = $(this).data('option-index');
                        var swatch = $(this).find('.swatch-element');
                        switch (optionIndex) {
                            case 1:
                                swatch.each(function(){
                                    var swatchVal = $(this).data('value');
                                    var optionSoldout = variants.find(function(variant){
                                        return variant.option1 == swatchVal && variant.available;
                                    });
                                    if(optionSoldout == undefined){
                                        $(this).addClass('soldout');
                                        $(this).find(':radio').prop('disabled',true);
                                    } else {
                                        $(this).removeClass('soldout');
                                        $(this).find(':radio').prop('disabled',false);
                                    }
                                })
                                break;
                            case 2:
                                swatch.each(function(){
                                    var swatchVal = $(this).data('value');
                                    var optionSoldout = variants.find(function(variant){
                                        return variant.option1 == selectedOption1 && variant.option2 == swatchVal && variant.available;
                                    });
                                    if(optionSoldout == undefined){
                                        $(this).addClass('soldout');
                                        $(this).find(':radio').prop('disabled',true);
                                    } else {
                                        $(this).removeClass('soldout');
                                        $(this).find(':radio').prop('disabled',false);
                                    }
                                })
                                break;
                            case 3:
                                swatch.each(function(){
                                    var swatchVal = $(this).data('value');
                                    var optionSoldout = variants.find(function(variant){
                                        return variant.option1 == selectedOption1 && variant.option2 == selectedOption2 && variant.option3 == swatchVal && variant.available;
                                    });
                                    if(optionSoldout == undefined){
                                        $(this).addClass('soldout');
                                        $(this).find(':radio').prop('disabled',true);
                                    } else {
                                        $(this).removeClass('soldout');
                                        $(this).find(':radio').prop('disabled',false);
                                    }
                                })
                                break;
                        }
                    });
                } else {
                    var variants = this.product.variants;
                    var options = $('.selector-wrapper', this.$container);
                    var selectedOption1 = $('.selector-wrapper-1', this.$container).find('option:selected').val();
                    var selectedOption2 = $('.selector-wrapper-2', this.$container).find('option:selected').val();
                    var selectedOption3 = $('.selector-wrapper-3', this.$container).find('option:selected').val();

                    options.each(function(){
                        var optionIndex = $(this).data('option-index');
                        var option = $(this).find('option');
                        switch (optionIndex) {
                            case 1:
                                option.each(function(){
                                    var optionVal = $(this).val();
                                    var optionSoldout = variants.find(function(variant){
                                        return variant.option1 == optionVal && variant.available;
                                    });
                                    if(optionSoldout == undefined){
                                        $(this).attr('disabled','disabled');
                                    } else {
                                        $(this).removeAttr('disabled','disabled');
                                    }
                                })
                                break;
                            case 2:
                                option.each(function(){
                                    var optionVal = $(this).val();
                                    var optionSoldout = variants.find(function(variant){
                                        return variant.option1 == selectedOption1 && variant.option2 == optionVal && variant.available;
                                    });
                                    if(optionSoldout == undefined){
                                        $(this).attr('disabled','disabled');
                                    } else {
                                        $(this).removeAttr('disabled','disabled');
                                    }
                                })
                                break;
                            case 3:
                                option.each(function(){
                                    var optionVal = $(this).val();
                                    var optionSoldout = variants.find(function(variant){
                                        return variant.option1 == selectedOption1 && variant.option2 == selectedOption2 && variant.option3 == optionVal && variant.available;
                                    });
                                    
                                    if(optionSoldout == undefined){
                                        $(this).attr('disabled','disabled');
                                    } else {
                                        $(this).removeAttr('disabled','disabled');
                                    }
                                })
                                break;
                        }
                    });
                }
            }
        },

        _updateVariant: function(_variant) {
            var self = this;
            var check_swatch_option = false;

            if ($('.selector-wrapper-1', this.$container).hasClass('swatch')) {
                check_swatch_option = true;
            }

            if (_variant) {

                var option1 = _variant.option1;
                var option2 = _variant.option2;
                var option3 = _variant.option3;
                var option_change = '';
                var option_value = '';
                
                if (check_swatch_option == true) {
                    var variants = this.product.variants;
                    var options = $('.selector-wrapper', this.$container);
                    var selectedOption1 = $('.selector-wrapper-1', this.$container).find('input:checked').val();
                    var selectedOption2 = $('.selector-wrapper-2', this.$container).find('input:checked').val();
                    var selectedOption3 = $('.selector-wrapper-3', this.$container).find('input:checked').val();

                    options.each(function(){
                        var optionIndex = $(this).data('option-index');
                        var swatch = $(this).find('.swatch-element');
                        switch (optionIndex) {
                            case 1:
                                swatch.each(function(){
                                    var swatchVal = $(this).data('value');
                                    var optionSoldout = variants.find(function(variant){
                                        return variant.option1 == swatchVal && variant.available;
                                    });
                                    if(optionSoldout == undefined){
                                        $(this).addClass('soldout');
                                        $(this).find(':radio').prop('disabled',true);
                                    } else {
                                        $(this).removeClass('soldout');
                                        $(this).find(':radio').prop('disabled',false);
                                    }
                                })
                                break;
                            case 2:
                                swatch.each(function(){
                                    var swatchVal = $(this).data('value');
                                    var optionSoldout = variants.find(function(variant){
                                        return variant.option1 == selectedOption1 && variant.option2 == swatchVal && variant.available;
                                    });
                                    if(optionSoldout == undefined){
                                        $(this).addClass('soldout');
                                        $(this).find(':radio').prop('disabled',true);
                                    } else {
                                        $(this).removeClass('soldout');
                                        $(this).find(':radio').prop('disabled',false);
                                    }
                                })
                                break;
                            case 3:
                                swatch.each(function(){
                                    var swatchVal = $(this).data('value');
                                    var optionSoldout = variants.find(function(variant){
                                        return variant.option1 == selectedOption1 && variant.option2 == selectedOption2 && variant.option3 == swatchVal && variant.available;
                                    });
                                    if(optionSoldout == undefined){
                                        $(this).addClass('soldout');
                                        $(this).find(':radio').prop('disabled',true);
                                    } else {
                                        $(this).removeClass('soldout');
                                        $(this).find(':radio').prop('disabled',false);
                                    }
                                })
                                break;
                        }
                    });
                } else {
                    var variants = this.product.variants;
                    var options = $('.selector-wrapper', this.$container);
                    var selectedOption1 = $('.selector-wrapper-1', this.$container).find('option:selected').val();
                    var selectedOption2 = $('.selector-wrapper-2', this.$container).find('option:selected').val();
                    var selectedOption3 = $('.selector-wrapper-3', this.$container).find('option:selected').val();

                    options.each(function(){
                        var optionIndex = $(this).data('option-index');
                        var option = $(this).find('option');
                        switch (optionIndex) {
                            case 1:
                                option.each(function(){
                                    var optionVal = $(this).val();
                                    var optionSoldout = variants.find(function(variant){
                                        return variant.option1 == optionVal && variant.available;
                                    });
                                    if(optionSoldout == undefined){
                                        $(this).attr('disabled','disabled');
                                    } else {
                                        $(this).removeAttr('disabled','disabled');
                                    }
                                })
                                break;
                            case 2:
                                option.each(function(){
                                    var optionVal = $(this).val();
                                    var optionSoldout = variants.find(function(variant){
                                        return variant.option1 == selectedOption1 && variant.option2 == optionVal && variant.available;
                                    });
                                    if(optionSoldout == undefined){
                                        $(this).attr('disabled','disabled');
                                    } else {
                                        $(this).removeAttr('disabled','disabled');
                                    }
                                })
                                break;
                            case 3:
                                option.each(function(){
                                    var optionVal = $(this).val();
                                    var optionSoldout = variants.find(function(variant){
                                        return variant.option1 == selectedOption1 && variant.option2 == selectedOption2 && variant.option3 == optionVal && variant.available;
                                    });
                                    
                                    if(optionSoldout == undefined){
                                        $(this).attr('disabled','disabled');
                                    } else {
                                        $(this).removeAttr('disabled','disabled');
                                    }
                                })
                                break;
                        }
                    });
                }
            }
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

    return Variants2;
})();


/* ================ GLOBAL ================ */
/*============================================================================
    Drawer modules
==============================================================================*/
theme.Drawers = (function() {
    function Drawer(id, position, options) {
        var defaults = {
            close: '.js-drawer-close',
            open: '.js-drawer-open-' + position,
            openClass: 'js-drawer-open',
            dirOpenClass: 'js-drawer-open-' + position
        };

        this.nodes = {
            $parent: $('html').add('body'),
            $page: $('#PageContainer')
        };

        this.config = $.extend(defaults, options);
        this.position = position;

        this.$drawer = $('#' + id);

        if (!this.$drawer.length) {
            return false;
        }

        this.drawerIsOpen = false;
        this.init();
    }

    Drawer.prototype.init = function() {
        $(this.config.open).on('click', $.proxy(this.open, this));
        this.$drawer.on('click', this.config.close, $.proxy(this.close, this));
    };

    Drawer.prototype.open = function(evt) {
        // Keep track if drawer was opened from a click, or called by another function
        var externalCall = false;

        // Prevent following href if link is clicked
        if (evt) {
            evt.preventDefault();
        } else {
            externalCall = true;
        }

        // Without this, the drawer opens, the click event bubbles up to nodes.$page
        // which closes the drawer.
        if (evt && evt.stopPropagation) {
            evt.stopPropagation();
            // save the source of the click, we'll focus to this on close
            this.$activeSource = $(evt.currentTarget);
        }

        if (this.drawerIsOpen && !externalCall) {
            return this.close();
        }

        // Add is-transitioning class to moved elements on open so drawer can have
        // transition for close animation
        this.$drawer.prepareTransition();

        this.nodes.$parent.addClass(
            this.config.openClass + ' ' + this.config.dirOpenClass
        );
        this.drawerIsOpen = true;

        // Set focus on drawer
        slate.a11y.trapFocus({
            $container: this.$drawer,
            namespace: 'drawer_focus'
        });

        // Run function when draw opens if set
        if (
            this.config.onDrawerOpen &&
            typeof this.config.onDrawerOpen === 'function'
        ) {
            if (!externalCall) {
                this.config.onDrawerOpen();
            }
        }

        if (this.$activeSource && this.$activeSource.attr('aria-expanded')) {
            this.$activeSource.attr('aria-expanded', 'true');
        }

        this.bindEvents();

        return this;
    };

    Drawer.prototype.close = function() {
        if (!this.drawerIsOpen) {
            // don't close a closed drawer
            return;
        }

        // deselect any focused form elements
        $(document.activeElement).trigger('blur');

        // Ensure closing transition is applied to moved elements, like the nav
        this.$drawer.prepareTransition();

        this.nodes.$parent.removeClass(
            this.config.dirOpenClass + ' ' + this.config.openClass
        );

        if (this.$activeSource && this.$activeSource.attr('aria-expanded')) {
            this.$activeSource.attr('aria-expanded', 'false');
        }

        this.drawerIsOpen = false;

        // Remove focus on drawer
        slate.a11y.removeTrapFocus({
            $container: this.$drawer,
            namespace: 'drawer_focus'
        });

        this.unbindEvents();

        // Run function when draw closes if set
        if (
            this.config.onDrawerClose &&
            typeof this.config.onDrawerClose === 'function'
        ) {
            this.config.onDrawerClose();
        }
    };

    Drawer.prototype.bindEvents = function() {
        this.nodes.$parent.on(
            'keyup.drawer',
            $.proxy(function(evt) {
                // close on 'esc' keypress
                if (evt.keyCode === 27) {
                    this.close();
                    return false;
                } else {
                    return true;
                }
            }, this)
        );

        // Lock scrolling on mobile
        this.nodes.$page.on('touchmove.drawer', function() {
            return false;
        });

        this.nodes.$page.on(
            'click.drawer',
            $.proxy(function() {
                this.close();
                return false;
            }, this)
        );
    };

    Drawer.prototype.unbindEvents = function() {
        this.nodes.$page.off('.drawer');
        this.nodes.$parent.off('.drawer');
    };

    return Drawer;
})();


/* ================ MODULES ================ */

window.theme = window.theme || {};

theme.Search = (function() {
    var selectors = {
        search: '.search',
        searchSubmit: '.search__submit',
        searchInput: '.search__input',

        siteHeader: '.site-header',
        siteHeaderSearchToggle: '.site-header__search-toggle',
        siteHeaderSearch: '.site-header__search',

        searchDrawer: '.search-bar',
        searchDrawerInput: '.search-bar__input',

        searchHeader: '.search-header',
        searchHeaderInput: '.search-header__input',
        searchHeaderSubmit: '.search-header__submit',

        searchResultSubmit: '#SearchResultSubmit',
        searchResultInput: '#SearchInput',
        searchResultMessage: '[data-search-error-message]',

        mobileNavWrapper: '.mobile-nav-wrapper'
    };

    var classes = {
        focus: 'search--focus',
        hidden: 'hide',
        mobileNavIsOpen: 'js-menu--is-open',
        searchTemplate: 'template-search'
    };

    function init() {
        if (!$(selectors.siteHeader).length) {
            return;
        }

        this.$searchResultInput = $(selectors.searchResultInput);
        this.$searchErrorMessage = $(selectors.searchResultMessage);

        initDrawer();

        var isSearchPage =
            slate.utils.getParameterByName('q') !== null &&
            $('body').hasClass(classes.searchTemplate);

        if (isSearchPage) {
            validateSearchResultForm.call(this);
        }

        $(selectors.searchResultSubmit).on(
            'click',
            validateSearchResultForm.bind(this)
        );

        $(selectors.searchHeaderInput)
            .add(selectors.searchHeaderSubmit)
            .on('focus blur', function() {
                $(selectors.searchHeader).toggleClass(classes.focus);
            });

        $(selectors.siteHeaderSearchToggle).on('click', function() {
            var searchHeight = $(selectors.siteHeader).outerHeight();
            var searchOffset = $(selectors.siteHeader).offset().top - searchHeight;

            $(selectors.searchDrawer).css({
                height: searchHeight + 'px',
                top: searchOffset + 'px'
            });
        });
    }

    function initDrawer() {
        // Add required classes to HTML
        $('#PageContainer').addClass('drawer-page-content');
        $('.js-drawer-open-top')
            .attr('aria-controls', 'SearchDrawer')
            .attr('aria-expanded', 'false')
            .attr('aria-haspopup', 'dialog');

        theme.SearchDrawer = new theme.Drawers('SearchDrawer', 'top', {
            onDrawerOpen: searchDrawerFocus,
            onDrawerClose: searchDrawerFocusClose
        });
    }

    function searchDrawerFocus() {
        searchFocus($(selectors.searchDrawerInput));
    }

    function searchFocus($el) {
        $el.focus();
        // set selection range hack for iOS
        $el[0].setSelectionRange(0, $el[0].value.length);
    }

    function searchDrawerFocusClose() {
        $(selectors.siteHeaderSearchToggle).focus();
    }

    /**
     * Remove the aria-attributes and hide the error messages
     */
    function hideErrorMessage() {
        this.$searchErrorMessage.addClass(classes.hidden);
        this.$searchResultInput
            .removeAttr('aria-describedby')
            .removeAttr('aria-invalid');
    }

    /**
     * Add the aria-attributes and show the error messages
     */
    function showErrorMessage() {
        this.$searchErrorMessage.removeClass(classes.hidden);
        this.$searchResultInput
            .attr('aria-describedby', 'error-search-form')
            .attr('aria-invalid', true);
    }

    function validateSearchResultForm(evt) {
        var isInputValueEmpty = this.$searchResultInput.val().trim().length === 0;

        if (!isInputValueEmpty) {
            hideErrorMessage.call(this);
            return;
        }

        if (typeof evt !== 'undefined') {
            evt.preventDefault();
        }

        searchFocus(this.$searchResultInput);
        showErrorMessage.call(this);
    }

    return {
        init: init
    };
})();

(function() {
    var selectors = {
        backButton: '.return-link'
    };

    var $backButton = $(selectors.backButton);

    if (!document.referrer || !$backButton.length || !window.history.length) {
        return;
    }

    $backButton.one('click', function(evt) {
        evt.preventDefault();

        var referrerDomain = urlDomain(document.referrer);
        var shopDomain = urlDomain(window.location.href);

        if (shopDomain === referrerDomain) {
            history.back();
        }

        return false;
    });

    function urlDomain(url) {
        var anchor = document.createElement('a');
        anchor.ref = url;

        return anchor.hostname;
    }
})();

// Youtube API callback
// eslint-disable-next-line no-unused-vars
function onYouTubeIframeAPIReady() {
    theme.Video.loadVideos();
}

theme.Video = (function() {
    var autoplayCheckComplete = false;
    var playOnClickChecked = false;
    var playOnClick = false;
    var youtubeLoaded = false;
    var videos = {};
    var videoPlayers = [];
    var videoOptions = {
        ratio: 16 / 9,
        scrollAnimationDuration: 400,
        playerVars: {
            // eslint-disable-next-line camelcase
            iv_load_policy: 3,
            modestbranding: 1,
            autoplay: 0,
            controls: 0,
            wmode: 'opaque',
            branding: 0,
            autohide: 0,
            rel: 0
        },
        events: {
            onReady: onPlayerReady,
            onStateChange: onPlayerChange
        }
    };
    var classes = {
        playing: 'video-is-playing',
        paused: 'video-is-paused',
        loading: 'video-is-loading',
        loaded: 'video-is-loaded',
        backgroundVideoWrapper: 'video-background-wrapper',
        videoWithImage: 'video--image_with_play',
        backgroundVideo: 'video--background',
        userPaused: 'is-paused',
        supportsAutoplay: 'autoplay',
        supportsNoAutoplay: 'no-autoplay',
        wrapperMinHeight: 'video-section-wrapper--min-height'
    };

    var selectors = {
        section: '.video-section',
        videoWrapper: '.video-section-wrapper',
        playVideoBtn: '.video-control__play',
        closeVideoBtn: '.video-control__close-wrapper',
        pauseVideoBtn: '.video__pause'
    };

    /**
     * Public functions
     */
    function init($video) {
        if (!$video.length) {
            return;
        }

        videos[$video.attr('id')] = {
            id: $video.attr('id'),
            videoId: $video.data('id'),
            type: $video.data('type'),
            status:
                $video.data('type') === 'image_with_play' ? 'closed' : 'background', // closed, open, background
            $video: $video,
            $videoWrapper: $video.closest(selectors.videoWrapper),
            $section: $video.closest(selectors.section),
            controls: $video.data('type') === 'background' ? 0 : 1
        };

        if (!youtubeLoaded) {
            // This code loads the IFrame Player API code asynchronously.
            var tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            var firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        }

        playOnClickCheck();
    }

    function customPlayVideo(playerId) {
        // Make sure we have carried out the playOnClick check first
        if (!playOnClickChecked && !playOnClick) {
            return;
        }

        if (playerId && typeof videoPlayers[playerId].playVideo === 'function') {
            privatePlayVideo(playerId);
        }
    }

    function pauseVideo(playerId) {
        if (
            videoPlayers[playerId] &&
            typeof videoPlayers[playerId].pauseVideo === 'function'
        ) {
            videoPlayers[playerId].pauseVideo();
        }
    }

    function loadVideos() {
        for (var key in videos) {
            if (videos.hasOwnProperty(key)) {
                createPlayer(key);
            }
        }

        initEvents();
        youtubeLoaded = true;
    }

    function editorLoadVideo(key) {
        if (!youtubeLoaded) {
            return;
        }
        createPlayer(key);

        initEvents();
    }

    /**
     * Private functions
     */

    function privatePlayVideo(id, clicked) {
        var videoData = videos[id];
        var player = videoPlayers[id];
        var $videoWrapper = videoData.$videoWrapper;

        if (playOnClick) {
            // playOnClick means we are probably on mobile (no autoplay).
            // setAsPlaying will show the iframe, requiring another click
            // to play the video.
            setAsPlaying(videoData);
        } else if (clicked || autoplayCheckComplete) {
            // Play if autoplay is available or clicked to play
            $videoWrapper.removeClass(classes.loading);
            setAsPlaying(videoData);
            player.playVideo();
            return;
        } else {
            player.playVideo();
        }
    }

    function setAutoplaySupport(supported) {
        var supportClass = supported
            ? classes.supportsAutoplay
            : classes.supportsNoAutoplay;
        $(document.documentElement)
            .removeClass(classes.supportsAutoplay)
            .removeClass(classes.supportsNoAutoplay)
            .addClass(supportClass);

        if (!supported) {
            playOnClick = true;
        }

        autoplayCheckComplete = true;
    }

    function playOnClickCheck() {
        // Bail early for a few instances:
        // - small screen
        // - device sniff mobile browser

        if (playOnClickChecked) {
            return;
        }

        if (isMobile()) {
            playOnClick = true;
        }

        if (playOnClick) {
            // No need to also do the autoplay check
            setAutoplaySupport(false);
        }

        playOnClickChecked = true;
    }

    // The API will call this function when each video player is ready
    function onPlayerReady(evt) {
        evt.target.setPlaybackQuality('hd1080');
        var videoData = getVideoOptions(evt);
        playOnClickCheck();

        // Prevent tabbing through YouTube player controls until visible
        $('#' + videoData.id).attr('tabindex', '-1');

        sizeBackgroundVideos();

        // Customize based on options from the video ID
        if (videoData.type === 'background') {
            evt.target.mute();
            privatePlayVideo(videoData.id);
        }

        videoData.$videoWrapper.addClass(classes.loaded);
    }

    function onPlayerChange(evt) {
        var videoData = getVideoOptions(evt);
        if (
            videoData.status === 'background' &&
            !isMobile() &&
            !autoplayCheckComplete &&
            (evt.data === YT.PlayerState.PLAYING ||
                evt.data === YT.PlayerState.BUFFERING)
        ) {
            setAutoplaySupport(true);
            autoplayCheckComplete = true;
            videoData.$videoWrapper.removeClass(classes.loading);
        }
        switch (evt.data) {
            case YT.PlayerState.ENDED:
                setAsFinished(videoData);
                break;
            case YT.PlayerState.PAUSED:
                // Seeking on a YouTube video also fires a PAUSED state change,
                // checking the state after a delay prevents us pausing the video when
                // the user is seeking instead of pausing
                setTimeout(function() {
                    if (evt.target.getPlayerState() === YT.PlayerState.PAUSED) {
                        setAsPaused(videoData);
                    }
                }, 200);
                break;
        }
    }

    function setAsFinished(videoData) {
        switch (videoData.type) {
            case 'background':
                videoPlayers[videoData.id].seekTo(0);
                break;
            case 'image_with_play':
                closeVideo(videoData.id);
                toggleExpandVideo(videoData.id, false);
                break;
        }
    }

    function setAsPlaying(videoData) {
        var $videoWrapper = videoData.$videoWrapper;
        var $pauseButton = $videoWrapper.find(selectors.pauseVideoBtn);

        $videoWrapper.removeClass(classes.loading);

        if ($pauseButton.hasClass(classes.userPaused)) {
            $pauseButton.removeClass(classes.userPaused);
        }

        // Do not change element visibility if it is a background video
        if (videoData.status === 'background') {
            return;
        }

        $('#' + videoData.id).attr('tabindex', '0');

        if (videoData.type === 'image_with_play') {
            $videoWrapper.removeClass(classes.paused).addClass(classes.playing);
        }

        // Update focus to the close button so we stay within the video wrapper,
        // allowing time for the scroll animation
        setTimeout(function() {
            $videoWrapper.find(selectors.closeVideoBtn).focus();
        }, videoOptions.scrollAnimationDuration);
    }

    function setAsPaused(videoData) {
        var $videoWrapper = videoData.$videoWrapper;

        // YT's events fire after our click event. This status flag ensures
        // we don't interact with a closed or background video.
        if (videoData.type === 'image_with_play') {
            if (videoData.status === 'closed') {
                $videoWrapper.removeClass(classes.paused);
            } else {
                $videoWrapper.addClass(classes.paused);
            }
        }

        $videoWrapper.removeClass(classes.playing);
    }

    function closeVideo(playerId) {
        var videoData = videos[playerId];
        var $videoWrapper = videoData.$videoWrapper;
        var classesToRemove = [classes.paused, classes.playing].join(' ');

        if (isMobile()) {
            $videoWrapper.removeAttr('style');
        }

        $('#' + videoData.id).attr('tabindex', '-1');

        videoData.status = 'closed';

        switch (videoData.type) {
            case 'image_with_play':
                videoPlayers[playerId].stopVideo();
                setAsPaused(videoData); // in case the video is already paused
                break;
            case 'background':
                videoPlayers[playerId].mute();
                setBackgroundVideo(playerId);
                break;
        }

        $videoWrapper.removeClass(classesToRemove);
    }

    function getVideoOptions(evt) {
        return videos[evt.target.a.id];
    }

    function toggleExpandVideo(playerId, expand) {
        var video = videos[playerId];
        var elementTop = video.$videoWrapper.offset().top;
        var $playButton = video.$videoWrapper.find(selectors.playVideoBtn);
        var offset = 0;
        var newHeight = 0;

        if (isMobile()) {
            video.$videoWrapper.parent().toggleClass('page-width', !expand);
        }

        if (expand) {
            if (isMobile()) {
                newHeight = $(window).width() / videoOptions.ratio;
            } else {
                newHeight = video.$videoWrapper.width() / videoOptions.ratio;
            }
            offset = ($(window).height() - newHeight) / 2;

            video.$videoWrapper
                .removeClass(classes.wrapperMinHeight)
                .animate({ height: newHeight }, 600);

            // Animate doesn't work in mobile editor, so we don't use it
            if (!(isMobile() && Shopify.designMode)) {
                $('html, body').animate(
                    {
                        scrollTop: elementTop - offset
                    },
                    videoOptions.scrollAnimationDuration
                );
            }
        } else {
            if (isMobile()) {
                newHeight = video.$videoWrapper.data('mobile-height');
            } else {
                newHeight = video.$videoWrapper.data('desktop-height');
            }

            video.$videoWrapper
                .height(video.$videoWrapper.width() / videoOptions.ratio)
                .animate({ height: newHeight }, 600);
            setTimeout(function() {
                video.$videoWrapper.addClass(classes.wrapperMinHeight);
            }, 600);
            $playButton.focus();
        }
    }

    function togglePause(playerId) {
        var $pauseButton = videos[playerId].$videoWrapper.find(
            selectors.pauseVideoBtn
        );
        var paused = $pauseButton.hasClass(classes.userPaused);
        if (paused) {
            $pauseButton.removeClass(classes.userPaused);
            customPlayVideo(playerId);
        } else {
            $pauseButton.addClass(classes.userPaused);
            pauseVideo(playerId);
        }
        $pauseButton.attr('aria-pressed', !paused);
    }

    function startVideoOnClick(playerId) {
        var video = videos[playerId];

        // add loading class to wrapper
        video.$videoWrapper.addClass(classes.loading);

        // Explicity set the video wrapper height (needed for height transition)
        video.$videoWrapper.attr(
            'style',
            'height: ' + video.$videoWrapper.height() + 'px'
        );

        video.status = 'open';

        switch (video.type) {
            case 'image_with_play':
                privatePlayVideo(playerId, true);
                break;
            case 'background':
                unsetBackgroundVideo(playerId, video);
                videoPlayers[playerId].unMute();
                privatePlayVideo(playerId, true);
                break;
        }

        toggleExpandVideo(playerId, true);

        // esc to close video player
        $(document).on('keydown.videoPlayer', function(evt) {
            var playerId = $(document.activeElement).data('controls');
            if (evt.keyCode !== slate.utils.keyboardKeys.ESCAPE || !playerId) {
                return;
            }

            closeVideo(playerId);
            toggleExpandVideo(playerId, false);
        });
    }

    function sizeBackgroundVideos() {
        $('.' + classes.backgroundVideo).each(function(index, el) {
            sizeBackgroundVideo($(el));
        });
    }

    function sizeBackgroundVideo($videoPlayer) {
        if (!youtubeLoaded) {
            return;
        }

        if (isMobile()) {
            $videoPlayer.removeAttr('style');
        } else {
            var $videoWrapper = $videoPlayer.closest(selectors.videoWrapper);
            var videoWidth = $videoWrapper.width();
            var playerWidth = $videoPlayer.width();
            var desktopHeight = $videoWrapper.data('desktop-height');

            // when screen aspect ratio differs from video, video must center and underlay one dimension
            if (videoWidth / videoOptions.ratio < desktopHeight) {
                playerWidth = Math.ceil(desktopHeight * videoOptions.ratio); // get new player width
                $videoPlayer
                    .width(playerWidth)
                    .height(desktopHeight)
                    .css({
                        left: (videoWidth - playerWidth) / 2,
                        top: 0
                    }); // player width is greater, offset left; reset top
            } else {
                // new video width < window width (gap to right)
                desktopHeight = Math.ceil(videoWidth / videoOptions.ratio); // get new player height
                $videoPlayer
                    .width(videoWidth)
                    .height(desktopHeight)
                    .css({
                        left: 0,
                        top: (desktopHeight - desktopHeight) / 2
                    }); // player height is greater, offset top; reset left
            }

            $videoPlayer.prepareTransition();
            $videoWrapper.addClass(classes.loaded);
        }
    }

    function unsetBackgroundVideo(playerId) {
        // Switch the background video to a chrome-only player once played
        $('#' + playerId)
            .removeClass(classes.backgroundVideo)
            .addClass(classes.videoWithImage);

        setTimeout(function() {
            $('#' + playerId).removeAttr('style');
        }, 600);

        videos[playerId].$videoWrapper
            .removeClass(classes.backgroundVideoWrapper)
            .addClass(classes.playing);

        videos[playerId].status = 'open';
    }

    function setBackgroundVideo(playerId) {
        $('#' + playerId)
            .removeClass(classes.videoWithImage)
            .addClass(classes.backgroundVideo);

        videos[playerId].$videoWrapper.addClass(classes.backgroundVideoWrapper);

        videos[playerId].status = 'background';
        sizeBackgroundVideo($('#' + playerId));
    }

    function isMobile() {
        return $(window).width() < 750 || window.mobileCheck();
    }

    function initEvents() {
        $(document).on('click.videoPlayer', selectors.playVideoBtn, function(evt) {
            var playerId = $(evt.currentTarget).data('controls');

            startVideoOnClick(playerId);
        });

        $(document).on('click.videoPlayer', selectors.closeVideoBtn, function(evt) {
            var playerId = $(evt.currentTarget).data('controls');

            $(evt.currentTarget).blur();
            closeVideo(playerId);
            toggleExpandVideo(playerId, false);
        });

        $(document).on('click.videoPlayer', selectors.pauseVideoBtn, function(evt) {
            var playerId = $(evt.currentTarget).data('controls');
            togglePause(playerId);
        });

        // Listen to resize to keep a background-size:cover-like layout
        $(window).on(
            'resize.videoPlayer',
            $.debounce(200, function() {
                if (!youtubeLoaded) return;
                var key;
                var fullscreen = window.innerHeight === screen.height;

                sizeBackgroundVideos();

                if (isMobile()) {
                    for (key in videos) {
                        if (videos.hasOwnProperty(key)) {
                            if (videos[key].$videoWrapper.hasClass(classes.playing)) {
                                if (!fullscreen) {
                                    pauseVideo(key);
                                    setAsPaused(videos[key]);
                                }
                            }
                            videos[key].$videoWrapper.height(
                                $(document).width() / videoOptions.ratio
                            );
                        }
                    }
                    setAutoplaySupport(false);
                } else {
                    setAutoplaySupport(true);
                    for (key in videos) {
                        if (
                            videos[key].$videoWrapper.find('.' + classes.videoWithImage)
                                .length
                        ) {
                            continue;
                        }
                        videoPlayers[key].playVideo();
                        setAsPlaying(videos[key]);
                    }
                }
            })
        );

        $(window).on(
            'scroll.videoPlayer',
            $.debounce(50, function() {
                if (!youtubeLoaded) return;

                for (var key in videos) {
                    if (videos.hasOwnProperty(key)) {
                        var $videoWrapper = videos[key].$videoWrapper;

                        // Close the video if more than 75% of it is scrolled out of view
                        if (
                            $videoWrapper.hasClass(classes.playing) &&
                            ($videoWrapper.offset().top + $videoWrapper.height() * 0.75 <
                                $(window).scrollTop() ||
                                $videoWrapper.offset().top + $videoWrapper.height() * 0.25 >
                                    $(window).scrollTop() + $(window).height())
                        ) {
                            closeVideo(key);
                            toggleExpandVideo(key, false);
                        }
                    }
                }
            })
        );
    }

    function createPlayer(key) {
        var args = $.extend({}, videoOptions, videos[key]);
        args.playerVars.controls = args.controls;
        videoPlayers[key] = new YT.Player(key, args);
    }

    function removeEvents() {
        $(document).off('.videoPlayer');
        $(window).off('.videoPlayer');
    }

    return {
        init: init,
        editorLoadVideo: editorLoadVideo,
        loadVideos: loadVideos,
        playVideo: customPlayVideo,
        pauseVideo: pauseVideo,
        removeEvents: removeEvents
    };
})();

window.theme = window.theme || {};

theme.FormStatus = (function() {
    var selectors = {
        statusMessage: '[data-form-status]'
    };

    function init() {
        this.$statusMessage = $(selectors.statusMessage);

        if (!this.$statusMessage) return;

        this.$statusMessage.attr('tabindex', -1).focus();

        this.$statusMessage.on('blur', handleBlur.bind(this));
    }

    function handleBlur() {
        this.$statusMessage.removeAttr('tabindex');
    }

    return {
        init: init
    };
})();


/* ================ TEMPLATES ================ */
(function() {
    var $filterBy = $('#BlogTagFilter');

    if (!$filterBy.length) {
        return;
    }

    $filterBy.on('change', function() {
        location.href = $(this).val();
    });
})();

window.theme = theme || {};

theme.customerTemplates = (function() {
    var selectors = {
        RecoverHeading: '#RecoverHeading',
        RecoverEmail: '#RecoverEmail',
        LoginHeading: '#LoginHeading'
    };

    function initEventListeners() {
        this.$RecoverHeading = $(selectors.RecoverHeading);
        this.$RecoverEmail = $(selectors.RecoverEmail);
        this.$LoginHeading = $(selectors.LoginHeading);

        // Show reset password form
        $('#RecoverPassword').on(
            'click',
            function(evt) {
                evt.preventDefault();
                showRecoverPasswordForm();
                this.$RecoverHeading.attr('tabindex', '-1').focus();
            }.bind(this)
        );

        // Hide reset password form
        $('#HideRecoverPasswordLink').on(
            'click',
            function(evt) {
                evt.preventDefault();
                hideRecoverPasswordForm();
                this.$LoginHeading.attr('tabindex', '-1').focus();
            }.bind(this)
        );

        this.$RecoverHeading.on('blur', function() {
            $(this).removeAttr('tabindex');
        });

        this.$LoginHeading.on('blur', function() {
            $(this).removeAttr('tabindex');
        });
    }

    /**
     *
     *  Show/Hide recover password form
     *
     */

    function showRecoverPasswordForm() {
        $('#RecoverPasswordForm').removeClass('hide');
        $('#CustomerLoginForm').addClass('hide');
        $('#CustomerRegisterForm').addClass('hide');

        if (this.$RecoverEmail.attr('aria-invalid') === 'true') {
            this.$RecoverEmail.focus();
        }
    }

    function hideRecoverPasswordForm() {
        $('#RecoverPasswordForm').addClass('hide');
        $('#CustomerLoginForm').removeClass('hide');
        $('#CustomerRegisterForm').removeClass('hide');
    }

    /**
     *
     *  Show reset password success message
     *
     */
    function resetPasswordSuccess() {
        var $formState = $('.reset-password-success');

        // check if reset password form was successfully submited.
        if (!$formState.length) {
            return;
        }

        // show success message
        $('#ResetSuccess')
            .removeClass('hide')
            .focus();
    }

    /**
     *
     *  Show/hide customer address forms
     *
     */
    function customerAddressForm() {
        var $newAddressForm = $('#AddressNewForm');
        var $newAddressFormButton = $('#AddressNewButton');

        if (!$newAddressForm.length) {
            return;
        }

        // Initialize observers on address selectors, defined in shopify_common.js
        if (Shopify) {
            // eslint-disable-next-line no-new
            new Shopify.CountryProvinceSelector(
                'AddressCountryNew',
                'AddressProvinceNew',
                {
                    hideElement: 'AddressProvinceContainerNew'
                }
            );
        }

        // Initialize each edit form's country/province selector
        $('.address-country-option').each(function() {
            var formId = $(this).data('form-id');
            var countrySelector = 'AddressCountry_' + formId;
            var provinceSelector = 'AddressProvince_' + formId;
            var containerSelector = 'AddressProvinceContainer_' + formId;

            // eslint-disable-next-line no-new
            new Shopify.CountryProvinceSelector(countrySelector, provinceSelector, {
                hideElement: containerSelector
            });
        });

        // Toggle new/edit address forms
        $('.address-new-toggle').on('click', function() {
            var isExpanded = $newAddressFormButton.attr('aria-expanded') === 'true';

            $newAddressForm.toggleClass('hide');
            $newAddressFormButton.attr('aria-expanded', !isExpanded).focus();
        });

        $('.address-edit-toggle').on('click', function() {
            var formId = $(this).data('form-id');
            var $editButton = $('#EditFormButton_' + formId);
            var $editAddress = $('#EditAddress_' + formId);
            var isExpanded = $editButton.attr('aria-expanded') === 'true';

            $editAddress.toggleClass('hide');
            $editButton.attr('aria-expanded', !isExpanded).focus();
        });

        $('.address-delete').on('click', function() {
            var $el = $(this);
            var target = $el.data('target');
            var confirmMessage = $el.data('confirm-message');

            // eslint-disable-next-line no-alert
            if (
                confirm(
                    confirmMessage || 'Are you sure you wish to delete this address?'
                )
            ) {
                Shopify.postLink(target, {
                    parameters: { _method: 'delete' }
                });
            }
        });
    }

    /**
     *
     *  Check URL for reset password hash
     *
     */
    function checkUrlHash() {
        var hash = window.location.hash;

        // Allow deep linking to recover password form
        if (hash === '#recover') {
            showRecoverPasswordForm.bind(this)();
        }
    }

    return {
        init: function() {
            initEventListeners();
            checkUrlHash();
            resetPasswordSuccess();
            customerAddressForm();
        }
    };
})();


/*================ SECTIONS ================*/
window.theme = window.theme || {};

theme.Cart = (function() {
    var selectors = {
        cartCount: '[data-cart-count]',
        cartCountBubble: '[data-cart-count-bubble]',
        cartDiscount: '[data-cart-discount]',
        cartDiscountTitle: '[data-cart-discount-title]',
        cartDiscountAmount: '[data-cart-discount-amount]',
        cartDiscountWrapper: '[data-cart-discount-wrapper]',
        cartErrorMessage: '[data-cart-error-message]',
        cartErrorMessageWrapper: '[data-cart-error-message-wrapper]',
        cartItem: '[data-cart-item]',
        cartItemDetails: '[data-cart-item-details]',
        cartItemDiscount: '[data-cart-item-discount]',
        cartItemDiscountedPriceGroup: '[data-cart-item-discounted-price-group]',
        cartItemDiscountTitle: '[data-cart-item-discount-title]',
        cartItemDiscountAmount: '[data-cart-item-discount-amount]',
        cartItemDiscountList: '[data-cart-item-discount-list]',
        cartItemFinalPrice: '[data-cart-item-final-price]',
        cartItemImage: '[data-cart-item-image]',
        cartItemLinePrice: '[data-cart-item-line-price]',
        cartItemOriginalPrice: '[data-cart-item-original-price]',
        cartItemPrice: '[data-cart-item-price]',
        cartItemPriceList: '[data-cart-item-price-list]',
        cartItemProperty: '[data-cart-item-property]',
        cartItemPropertyName: '[data-cart-item-property-name]',
        cartItemPropertyValue: '[data-cart-item-property-value]',
        cartItemRegularPriceGroup: '[data-cart-item-regular-price-group]',
        cartItemRegularPrice: '[data-cart-item-regular-price]',
        cartItemTitle: '[data-cart-item-title]',
        cartItemOption: '[data-cart-item-option]',
        cartLineItems: '[data-cart-line-items]',
        cartNote: '[data-cart-notes]',
        cartQuantityErrorMessage: '[data-cart-quantity-error-message]',
        cartQuantityErrorMessageWrapper:
            '[data-cart-quantity-error-message-wrapper]',
        cartRemove: '[data-cart-remove]',
        cartRemoveAll: '[data-cart-remove-all]',
        cartupdate: '[data-qtt]',
        cartStatus: '[data-cart-status]',
        cartSubtotal: '[data-cart-subtotal]',
        cartTableCell: '[data-cart-table-cell]',
        cartWrapper: '[data-cart-wrapper]',
        emptyPageContent: '[data-empty-page-content]',
        quantityInput: '[data-quantity-input]',
        quantityInputMobile: '[data-quantity-input-mobile]',
        quantityInputDesktop: '[data-quantity-input-desktop]',
        quantityLabelMobile: '[data-quantity-label-mobile]',
        quantityLabelDesktop: '[data-quantity-label-desktop]',
        inputQty: '[data-quantity-input]',
        thumbnails: '.cart__image',
        unitPrice: '[data-unit-price]',
        unitPriceBaseUnit: '[data-unit-price-base-unit]',
        unitPriceGroup: '[data-unit-price-group]',
        editCart: '[data-cart-edit]',
        termsConditions: '[data-terms-conditions]',
        updateCartPC: '[data-cart-preview-pc]',
        updateCartMB: '[data-cart-preview]'
    };

    var classes = {
        cartNoCookies: 'cart--no-cookies',
        cartRemovedProduct: 'cart__removed-product',
        hide: 'hide',
        inputError: 'input--error'
    };

    var attributes = {
        cartItemIndex: 'data-cart-item-index',
        cartItemKey: 'data-cart-item-key',
        cartItemQuantity: 'data-cart-item-quantity',
        cartItemTitle: 'data-cart-item-title',
        cartItemUrl: 'data-cart-item-url',
        quantityItem: 'data-quantity-item'
    };

    theme.breakpoints = theme.breakpoints || {};

    if (
        isNaN(theme.breakpoints.medium) ||
        theme.breakpoints.medium === undefined
    ) {
        theme.breakpoints.medium = 768;
    }

    var mediumUpQuery = '(min-width: ' + theme.breakpoints.medium + 'px)';

    function Cart(container) {
        this.$container = $(container);
        this.$thumbnails = $(selectors.thumbnails, this.$container);
        this.ajaxEnabled = this.$container.data('ajax-enabled');

        if (!this.cookiesEnabled()) {
            this.$container.addClass(classes.cartNoCookies);
        }

        this.$thumbnails.css('cursor', 'pointer');

        this.$container.on(
            'click',
            selectors.thumbnails,
            this._handleThumbnailClick
        );

        this.$container.on(
            'change',
            selectors.inputQty,
            $.debounce(500, this._handleInputQty.bind(this))
        );

        this.mql = window.matchMedia(mediumUpQuery);

        this.mql.addListener(this.setQuantityFormControllers.bind(this));
        this.setQuantityFormControllers();

        if (this.ajaxEnabled) {
            /**
             * Because the entire cart is recreated when a cart item is updated,
             * we cannot cache the elements in the cart. Instead, we add the event
             * listeners on the cart's container to allow us to retain the event
             * listeners after rebuilding the cart when an item is updated.
             */

            this.$container.on(
                'change',
                selectors.cartNote,
                this._onNoteChange.bind(this)
            );

            this.$container.on(
                'click',
                selectors.cartRemove,
                this._onRemoveItem.bind(this)
            );

            this.$container.on(
                'click',
                selectors.cartRemoveAll,
                this._onRemoveItemAll.bind(this)
            );

            this._setupCartTemplates();
        }

        this.$container.on(
            'click',
            selectors.editCart,
            this._editCart.bind(this)
        );

        this._cartTermsConditions();
        
        var _ = this;

        $(document).on('click', selectors.updateCartPC, function(event) {
            const $target = $(event.currentTarget);
            // theme.HaloAddOn.showLoading();
            $.getJSON( window.router + '/cart.js').then(

                function(cart) {
                    if (cart.item_count === 0) {
                        _._emptyCart();
                        // theme.HaloAddOn.hideLoading();
                        if ($target.hasClass('is-open')) {
                            $target.removeClass('is-open');
                            $('#cart-dropdown').slideUp();
                        } else {
                            $target.addClass('is-open');
                            $('.cart-quickview_header--no-item').addClass('hide');
                            $('#cart-dropdown').slideDown();
                        }

                    } else {
                        _._createCart(cart);
                        theme.HaloAddOn.progressBarShipping();
                        // theme.HaloAddOn.hideLoading();
                        if ($target.hasClass('is-open')) {
                            $target.removeClass('is-open');
                            $('#cart-dropdown').slideUp();
                        } else {
                            $target.addClass('is-open');
                            $('.cart-quickview_header--no-item').removeClass('hide');
                            $('.cart-quickview_header').removeClass('hide');
                            $('#cart-dropdown').slideDown();
                        }
                    }
                }.bind(this)
            )
        });

        $(document).on('click', selectors.updateCartMB, function(event) {
            const $target = $(event.currentTarget);
            $.getJSON( window.router + '/cart.js').then(

                function(cart) {
                    if (cart.item_count === 0) {
                        _._emptyCart();
                            $('body').addClass('open_Cart');

                    } else {
                        _._createCart(cart);
                        theme.HaloAddOn.progressBarShipping();
                            $('body').addClass('open_Cart');
                    }
                }.bind(this)
            )
        });

        $(document).on('click', function(event) {
            if ($('[data-cart-preview-pc]').hasClass('is-open')) {
                if (($(event.target).closest('[data-cart-preview-pc]').length === 0) && ($(event.target).closest('#cart-dropdown').length === 0) && ($(event.target).closest('#cart-edit-modal').length === 0)) {
                    $('[data-cart-preview-pc]').removeClass('is-open');
                    $('#cart-dropdown').slideUp();
                }
            }
        });

        $(document).on('click', function(event) {
            if ($('body').hasClass('open_Cart')) {
                if (($(event.target).closest('[data-cart-preview]').length === 0) && ($(event.target).closest('#cart-mobile').length === 0) && ($(event.target).closest('#cart-edit-modal').length === 0)) {
                    $('body').removeClass('open_Cart');
                }
            }
        });

        $('[data-close-cart-preview]').on('click', function(event) {
            $('body').removeClass('open_Cart');
        });

    }

    Cart.prototype = _.assignIn({}, Cart.prototype, {
        _showErrorMessage: function(errorMessage, $container) {
            $('[data-error-message]', $container).html(errorMessage);

            $('[data-error-message-wrapper]', $container)
                .removeClass('product-form__error-message-wrapper--hidden')
                .attr('aria-hidden', true)
                .removeAttr('aria-hidden');
        },

        _hideErrorMessage: function($container) {
            $('[data-error-message-wrapper]', $container).addClass(
                'product-form__error-message-wrapper--hidden'
            );
        },

        _editCart: function(e) {
            var $cart_item = $(e.currentTarget).parents('[data-cart-item]'),
                item_url = $cart_item.data('cart-item-url'),
                item_qty = $cart_item.data('cart-item-quantity'),
                $themeCart = this;

            $.urlParam = function(name){
                var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(item_url);
                return results[1] || 0;
            }

            // theme.HaloAddOn.loadingPopup();
            
            // setTimeout(function() {
            //     theme.HaloAddOn.removeLoadingPopup();
            //     theme.HaloAddOn.editCartPopup();
            // }, 500)

            var $editCart = '#cart-edit-modal',
                $Close = $($editCart).find('.close'),
                $editCartContent = $($editCart).find('.cart-edit-modal'),
                current_variant = $.urlParam('variant'),
                new_variant = current_variant;

            $('[data-cart-edit-item-quantity] input', $editCart).val(item_qty);

            var xhr = $.ajax({
                type: 'GET',
                url: item_url,
                data: {
                view: 'get_json'
                },
                cache: false,
                dataType: 'html',
                success: function (data) {
                    window._json = JSON.parse(data);
                    
                    $('[data-product-vendor-edit]', $editCartContent).text(window._json.vendor);
                    $('[data-product-title-edit]', $editCartContent).text(window._json.title);
                    var index = 0,
                        imageSrc = window._json.featured_image,
                        selected = '';
                    $('[data-cart-edit-item-template] option', $editCart).remove();
                    $.each(window._json.variants, function(i, e){
                        selected = '';
                        if(current_variant == e.id){
                            index = i;
                            selected = 'selected="selected"';
                            if(e.featured_image) {
                                imageSrc = e.featured_image.src;
                            }
                        }
                        $('[data-cart-edit-item-template]', $editCart).append('<option '+(e.available ? 'value="'+e.id+'" ' : 'disabled="disabled" ')+ selected +'>'+e.title+ (e.available ? '' : ' - Sold out')+'</option>');
                    });

                    $('[data-product-image-edit] img', $editCart).attr('src', imageSrc);
                    var currentVariant = window._json.variants[index],
                        _options = '', _option1 = [], _option2 = [], _option3 = [];

                    $.each(window._json.options, function(i, e){
                        _options += '<th class="text-center" scope="col" data-option> '+e+' </th>';
                        $.each(window._json.variants, function(j, el){
                            if( i == 0 ){
                                if($.inArray(el.options[i], _option1) === -1)
                                    _option1.push(el.options[i]);
                            }
                            else if( i == 1 ) {
                                if($.inArray(el.options[i], _option2) === -1)
                                    _option2.push(el.options[i]);
                            }
                            else {
                                if($.inArray(el.options[i], _option3) === -1)
                                    _option3.push(el.options[i]);
                            }
                        });
                    });

                    $('[data-cart-edit-head] tr', $editCart).find('[data-option]').remove();
                    $('[data-cart-edit-head] tr', $editCart).prepend(_options);

                    var _opt = '';
                    if( _option1.length ) {
                        _opt += '<td class="cart-edit__option text-center" data-cart-edit-item-option><select class="cart-edit-option-selector product-form__input form-control" id="CartEditOptionSelector-1" data-index="option1" data-option-index="1">';
                        $.each(_option1, function(i, e){
                            selected = '';
                            if ( currentVariant.option1 == e ) {
                                selected = 'selected="selected"';
                            }
                            _opt += '<option value="'+e+'" '+selected+'>'+e+'</option>';
                        });
                        _opt += '</select></td>';
                    }
                    if( _option2.length ) {
                        _opt += '<td class="cart-edit__option text-center" data-cart-edit-item-option><select class="cart-edit-option-selector product-form__input form-control" id="CartEditOptionSelector-2" data-index="option2" data-option-index="2">';
                        $.each(_option2, function(i, e){
                            selected = '';
                            if ( currentVariant.option2 == e ) {
                                selected = 'selected="selected"';
                            }
                            _opt += '<option value="'+e+'" '+selected+'>'+e+'</option>';
                        });
                        _opt += '</select></td>';
                    }
                    if( _option3.length ) {
                        _opt += '<td class="cart-edit__option text-center" data-cart-edit-item-option><select class="cart-edit-option-selector product-form__input form-control" id="CartEditOptionSelector-3" data-index="option3" data-option-index="3">';
                        $.each(_option3, function(i, e){
                            selected = '';
                            if ( currentVariant.option3 == e ) {
                                selected = 'selected="selected"';
                            }
                            _opt += '<option value="'+e+'" '+selected+'>'+e+'</option>';
                        });
                        _opt += '</select></td>';
                    }
                    var $tr = $('[data-cart-edit-body] tr:eq(0)', $editCart).clone();
                    $('[data-cart-edit-body] tr', $editCart).remove();
                    $('[data-cart-edit-body]', $editCart).append($tr);
                    $('[data-cart-edit-body] tr', $editCart).find('[data-cart-edit-item-option]').remove();
                    $('[data-cart-edit-body] tr', $editCart).prepend(_opt);
                    $('[data-cart-edit-body] tr', $editCart).find('[data-cart-edit-remove]').hide();
                        
                    //----------------------
                        
                    if( _option1.length ) {
                        $themeCart._updateVariant( window._json, $editCart, currentVariant, currentVariant.option1, 'option1');
                    }

                    $themeCart._updatePrice(currentVariant, $editCart);
                    
                    var $product_clone = $('[data-cart-edit-item]:last-child', $editCart).clone();

                    $(document).off('change', '.cart-edit-option-selector').on('change', '.cart-edit-option-selector', function(e){
                        var $row = $(e.currentTarget).parents('[data-cart-edit-item]');
                        var currentOptions = _.map(
                            $('.cart-edit-option-selector', $row),
                            function(element) {
                                var $element = $(element);
                                var currentOption = {};

                                currentOption.value = $element.val();
                                currentOption.index = $element.data('index');

                                return currentOption;
                            }
                        );

                        currentOptions = _.compact(currentOptions);


                        var variants = window._json.variants;

                        var found = _.find(variants, function(variant) {

                            return currentOptions.every(function(values) {
                                return _.isEqual(variant[values.index], values.value);
                            });
                        });

                        if (found) {
                            $('[data-cart-edit-item-template]', $row).val(found.id);
                            $themeCart._updatePrice(found, $row);
                        }

                        var selectedOption1;
                        var selectedOption2;
                        var selectedOption3;

                        if (found == undefined || found.available == false) {
                            selectedOption1 = $('#CartEditOptionSelector-1', $row).find('option:selected').val();
                            selectedOption2 = $('#CartEditOptionSelector-2', $row).find('option:selected').val();
                            selectedOption3 = $('#CartEditOptionSelector-3', $row).find('option:selected').val();

                            $('#CartEditOptionSelector-3 option', $row).each(function(){
                                var swatchVal = $(this).val();
                                var optionSoldout = variants.find(function(variant){
                                    return variant.option1 == selectedOption1 && variant.option2 == selectedOption2 && variant.option3 == swatchVal && variant.available;
                                });

                                if(optionSoldout == undefined){
                                    $(this).attr('disabled','disabled').prop('selected', false);
                                } else {
                                    $(this).removeAttr('disabled','disabled').prop('selected', true);
                                }
                            })

                            currentOptions = _.map(
                                $('.cart-edit-option-selector', $row),
                                function(element) {
                                    var $element = $(element);
                                    var currentOption = {};

                                    currentOption.value = $element.val();
                                    currentOption.index = $element.data('index');

                                    return currentOption;
                                }
                            );

                            currentOptions = _.compact(currentOptions);

                            found = _.find(variants, function(variant) {

                                return currentOptions.every(function(values) {
                                    return _.isEqual(variant[values.index], values.value);
                                });
                            });

                            if (found) {
                                $('[data-cart-edit-item-template]', $row).val(found.id);
                                $themeCart._updatePrice(found, $row);
                            }

                            if (found == undefined || found.available == false) {

                                $('#CartEditOptionSelector-3 option', $row).each(function(){
                                    var swatchVal = $(this).val();
                                    var optionSoldout = variants.find(function(variant){
                                        return variant.option1 == selectedOption1 && variant.option3 == swatchVal && variant.available;
                                    });

                                    if(optionSoldout == undefined){
                                        $(this).attr('disabled','disabled').prop('selected', false);
                                    } else {
                                        $(this).removeAttr('disabled','disabled').prop('selected', true);
                                    }
                                })

                                selectedOption3 = $('#CartEditOptionSelector-3', $row).find('option:selected').val();


                                $('#CartEditOptionSelector-2 option', $row).each(function(){
                                    var swatchVal = $(this).val();
                                    var optionSoldout = variants.find(function(variant){
                                        return variant.option1 == selectedOption1 && variant.option3 == selectedOption3 && variant.option2 == swatchVal && variant.available;
                                    });

                                    if(optionSoldout == undefined){
                                        $(this).attr('disabled','disabled').prop('selected', false);
                                    } else {
                                        $(this).removeAttr('disabled','disabled').prop('selected', true);
                                    }
                                })

                                currentOptions = _.map(
                                    $('.cart-edit-option-selector', $row),
                                    function(element) {
                                        var $element = $(element);
                                        var currentOption = {};

                                        currentOption.value = $element.val();
                                        currentOption.index = $element.data('index');

                                        return currentOption;
                                    }
                                );

                                currentOptions = _.compact(currentOptions);

                                found = _.find(variants, function(variant) {

                                    return currentOptions.every(function(values) {
                                        return _.isEqual(variant[values.index], values.value);
                                    });
                                });

                                console.log(found);

                                if (found) {
                                    $('[data-cart-edit-item-template]', $row).val(found.id);
                                    $themeCart._updatePrice(found, $row);
                                }
                            }
                        }

                        $themeCart._updateVariant( window._json, $row, found, $(e.currentTarget).val(), $(e.currentTarget).data('index'));
                    });
                        
                    $('form[data-edit-cart-form]', $editCart).off('submit').on('submit', function(e){
                        e.preventDefault();
                        var arrVariant = [];
                        $('[data-cart-edit-item]', $editCart).each(function(i, el){
                            var variant = $('[data-cart-edit-item-template]', $(el) ).val();
                            var qty = parseInt( $('[data-cart-edit-item-quantity] input', $(el) ).val() );
                            var currentOption = {};
                            currentOption.value = variant;
                            currentOption.qty = qty;
                            var k = 0;
                            $.each(arrVariant, function(j, v){
                                if( variant == v.value ){
                                    k = 1;
                                    if( qty > v.qty){
                                        v.qty = qty;
                                    }
                                }
                            });
                            if( k == 0 )
                            arrVariant.push(currentOption);
                        });
                      
                        var k = 0;
                        $.each(arrVariant, function(j, v){
                            if( current_variant == v.value) {
                                k = 1;
                            }
                        });
                      
                        if( k == 0 ){
                            //remove
                            var key = $cart_item.attr(attributes.cartItemKey);
                            var index = parseInt($cart_item.attr(attributes.cartItemIndex) );

                            var params = {
                                url: '/cart/change.js',
                                data: { quantity: 0, line: index },
                                dataType: 'json',
                                async: false
                            };

                            $.post(params)
                                .done(
                                    function(cart) {

                                    }.bind(this)
                                );          
                        }
                      
                        k = 0;
                        $.each(arrVariant, function(j, v){
                            if( current_variant == v.value) {
                                if( item_qty != v.qty ){
                                    if ( v.qty >= 0 ) {
                                        $themeCart._updateItemQuantity(
                                            $cart_item.find('[data-quantity-input]').data('quantity-item'),
                                            $cart_item,
                                            $('[data-cart-edit-item-quantity] input', $('[data-cart-edit-body] tr:eq(0)', $editCart) ),
                                            v.qty);
                                        k++;
                                  
                                        if( k == arrVariant.length){
                                            //get new cart
                                            $.getJSON( window.router + '/cart.js').then(
                                            function(cart) {
                                                $themeCart._setCartCountBubble(cart.item_count);
                                                $themeCart._createCart(cart);
                                                theme.HaloAddOn.progressBarShipping();
                                                // theme.HaloAddOn.removeLoadingPopup();
                                                $('a.close', $editCart).trigger('click');
                                            });
                                        }
                                    }
                                } else {
                                    k++;
                                    if( k == arrVariant.length){
                                        //get new cart
                                        $.getJSON( window.router + '/cart.js').then(
                                        function(cart) {
                                            $themeCart._setCartCountBubble(cart.item_count);
                                            $themeCart._createCart(cart);
                                            theme.HaloAddOn.progressBarShipping();
                                            // theme.HaloAddOn.removeLoadingPopup();
                                            $('a.close', $editCart).trigger('click');
                                        });
                                    }
                                }
                            }
                            else {
                                if ( v.qty > 0 ) {
                                    var params = {
                                        url: '/cart/add.js',
                                        data: 'form_type=product&quantity='+v.qty+'&utf8=✓&id=' + v.value,
                                        dataType: 'json',
                                        async: false
                                    };
                                    
                                    $.post(params)
                                        .done(
                                            function(item) {
                                                $themeCart._hideErrorMessage($editCart);
                                                // theme.HaloAddOn.loadingPopup();
                                                k++;
                                                if( k == arrVariant.length){
                                                    //get new cart
                                                    $.getJSON( window.router + '/cart.js').then(
                                                    function(cart) {
                                                        $themeCart._setCartCountBubble(cart.item_count);
                                                        $themeCart._createCart(cart);
                                                        theme.HaloAddOn.progressBarShipping();
                                                        // theme.HaloAddOn.removeLoadingPopup();
                                                        $('a.close', $editCart).trigger('click');
                                                    });
                                                }
                                    
                                            }.bind(this)
                                        )
                                        .fail(
                                            function(response) {
                                                var errorMessage = response.responseJSON
                                                ? response.responseJSON.description
                                                : theme.strings.cartError;
                                                // theme.HaloAddOn.removeLoadingPopup();
                                                $themeCart._showErrorMessage(errorMessage, $editCart);
                                        }.bind(this)
                                    );
                                }
                            }
                        });
                        return false;
                    });
                        
                    $(document).off('click', '[data-cart-edit-remove]').on('click', '[data-cart-edit-remove]',  function(e){
                        e.preventDefault();
                        var $row = $(e.currentTarget).parents('[data-cart-edit-item]');
                      
                        $row.remove();
                        return false;
                    });
                  
                    $('.product-addmore-button', $editCart).off('click').on('click', function(e){
                        var $tr = $product_clone.clone();
                        $tr.find('[data-cart-edit-remove]').show();
                        $('[data-cart-edit-body]', $editCart).append($tr);
                    });

                    if (theme.HaloAddOn.checkNeedToConvertCurrency()) {
                        Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
                    }
                },
                complete: function () {}
            });
        },

        _updateVariant: function( json, $editCart, currentOption, option_value, option_change) {

            var variants = json.variants;
            var options = $('.cart-edit-option-selector', $editCart);
            var selectedOption1 = $('#CartEditOptionSelector-1', $editCart).find('option:selected').val();
            var selectedOption2 = $('#CartEditOptionSelector-2', $editCart).find('option:selected').val();
            var selectedOption3 = $('#CartEditOptionSelector-3', $editCart).find('option:selected').val();

            options.each(function(){
                var optionIndex = $(this).data('option-index');
                var option = $(this).find('option');
                switch (optionIndex) {
                    case 1:
                        option.each(function(){
                            var optionVal = $(this).val();
                            var optionSoldout = variants.find(function(variant){
                                return variant.option1 == optionVal && variant.available;
                            });
                            if(optionSoldout == undefined){
                                $(this).attr('disabled','disabled');
                            } else {
                                $(this).removeAttr('disabled','disabled');
                            }
                        })
                        break;
                    case 2:
                        option.each(function(){
                            var optionVal = $(this).val();
                            var optionSoldout = variants.find(function(variant){
                                return variant.option1 == selectedOption1 && variant.option2 == optionVal && variant.available;
                            });
                            if(optionSoldout == undefined){
                                $(this).attr('disabled','disabled');
                            } else {
                                $(this).removeAttr('disabled','disabled');
                            }
                        })
                        break;
                    case 3:
                        option.each(function(){
                            var optionVal = $(this).val();
                            var optionSoldout = variants.find(function(variant){
                                return variant.option1 == selectedOption1 && variant.option2 == selectedOption2 && variant.option3 == optionVal && variant.available;
                            });
                            
                            if(optionSoldout == undefined){
                                $(this).attr('disabled','disabled');
                            } else {
                                $(this).removeAttr('disabled','disabled');
                            }
                        })
                        break;
                }
            });
        },

        _updatePrice: function(variant, $container) {
            var $priceContainer = $('[data-price]', $container);
            var $regularPrice = $('[data-regular-price]', $priceContainer);
            var $salePrice = $('[data-sale-price]', $priceContainer);
            var $unitPrice = $('[data-unit-price]', $priceContainer);
            var $unitPriceBaseUnit = $(
                '[data-unit-price-base-unit]',
                $priceContainer
            );

            // Reset product price state
            $priceContainer
                .removeClass('price--unavailable')
                .removeClass('price--on-sale')
                .removeClass('price--unit-available')
                .removeAttr('aria-hidden');

            // Unavailable
            if (!variant) {
                $priceContainer
                    .addClass('price--unavailable')
                    .attr('aria-hidden', true);

                return;
            }

            // On sale
            var quantity = $('[data-cart-edit-item-quantity] input', $container).val();
            if (variant.compare_at_price > variant.price) {
                // Regular price
                $regularPrice.html(
                    theme.Currency.formatMoney(
                        variant.compare_at_price,
                        theme.moneyFormat
                    )
                );
                // Sale price
                $salePrice.html(
                    theme.Currency.formatMoney(variant.price, theme.moneyFormat)
                );
                $priceContainer.addClass('price--on-sale');
            } else {
                // Regular price
                $regularPrice.html(
                    theme.Currency.formatMoney(variant.price, theme.moneyFormat)
                );
                // Sale price
                $salePrice.html("");
            }

            // Unit price
            if (variant.unit_price) {
                $unitPrice.html(
                    theme.Currency.formatMoney(variant.unit_price, theme.moneyFormat)
                );
                $unitPriceBaseUnit.html( variant.unit_price_measurement.reference_value === 1
                                          ? variant.unit_price_measurement.reference_unit
                                          : variant.unit_price_measurement.reference_value +
                                                  variant.unit_price_measurement.reference_unit
                                       );
                $priceContainer.addClass('price--unit-available');
            }

            if (theme.HaloAddOn.checkNeedToConvertCurrency()) {
                Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
            }

        },

        _setupCartTemplates: function() {
            this.$itemTemplate = $(selectors.cartItem, this.$container)
                .first()
                .clone();
            this.$itemDiscountTemplate = $(
                selectors.cartItemDiscount,
                this.$itemTemplate
            ).clone();
            this.$itemOptionTemplate = $(
                selectors.cartItemOption,
                this.$itemTemplate
            ).clone();
            this.$itemPropertyTemplate = $(
                selectors.cartItemProperty,
                this.$itemTemplate
            ).clone();
            this.$itemPriceListTemplate = $(
                selectors.cartItemPriceList,
                this.$itemTemplate
            ).clone();
            this.$itemLinePriceTemplate = $(
                selectors.cartItemLinePrice,
                this.$itemTemplate
            ).clone();
            this.$cartDiscountTemplate = $(
                selectors.cartDiscount,
                this.$container
            ).clone();

            if (theme.HaloAddOn.checkNeedToConvertCurrency()) {
                Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
            }
        },

        _handleInputQty: function(evt) {
            var $input = $(evt.target);
            var itemIndex = $input.data('quantity-item');
            var $itemElement = $input.closest(selectors.cartItem);
            var $itemQtyInputs = $('[data-quantity-item=' + itemIndex + ']');
            var value = parseInt($input.val());
            var isValidValue = !(value < 0 || isNaN(value));
            $itemQtyInputs.val(value);

            this._hideCartError();
            this._hideQuantityErrorMessage();

            if (!isValidValue) {
                this._showQuantityErrorMessages($itemElement);
                return;
            }

            if (isValidValue && this.ajaxEnabled) {
                this._updateItemQuantity(
                    itemIndex,
                    $itemElement,
                    $itemQtyInputs,
                    value
                );
            }
        },

        _updateItemQuantity: function(
            itemIndex,
            $itemElement,
            $itemQtyInputs,
            value
        ) {
            var key = $itemElement.attr(attributes.cartItemKey);
            var index = $itemElement.attr(attributes.cartItemIndex);

            var params = {
                url: '/cart/change.js',
                data: { quantity: value, line: index },
                dataType: 'json',
                async: false
            };

            $.post(params)
                .done(
                    function(state) {
                        if (state.item_count === 0) {
                            this._emptyCart();
                        } else {
                            this._createCart(state);
                            if (value === 0) {
                                this._showRemoveMessage($itemElement.clone());
                            } else {
                                var $lineItem = $('[data-cart-item-key="' + key + '"]');
                                var item = this.getItem(key, state);

                                if (value != item.quantity) {
                                    this._showQuantityErrorMessages2(item.quantity, $lineItem);
                                }

                                $(selectors.quantityInput, $lineItem).focus();
                                this._updateLiveRegion(item);
                                theme.HaloAddOn.progressBarShipping();
                            }
                        }
                        this._setCartCountBubble(state.item_count);
                    }.bind(this)
                )
                .fail(
                    function() {
                        this._showCartError($itemQtyInputs);
                    }.bind(this)
                );
        },

        getItem: function(key, state) {
            return state.items.find(function(item) {
                return item.key === key;
            });
        },

        _liveRegionText: function(item) {
            // Dummy content for live region
            var liveRegionText =
                theme.strings.update +
                ': [QuantityLabel]: [Quantity], [Regular] [$$] [DiscountedPrice] [$]. [PriceInformation]';

            // Update Quantity
            liveRegionText = liveRegionText
                .replace('[QuantityLabel]', theme.strings.quantity)
                .replace('[Quantity]', item.quantity);

            // Update pricing information
            var regularLabel = '';
            var regularPrice = theme.Currency.formatMoney(
                item.original_line_price,
                theme.moneyFormat
            );
            var discountLabel = '';
            var discountPrice = '';
            var discountInformation = '';

            if (item.original_line_price > item.final_line_price) {
                regularLabel = theme.strings.regularTotal;

                discountLabel = theme.strings.discountedTotal;
                discountPrice = theme.Currency.formatMoney(
                    item.final_line_price,
                    theme.moneyFormat
                );

                discountInformation = theme.strings.priceColumn;
            }

            liveRegionText = liveRegionText
                .replace('[Regular]', regularLabel)
                .replace('[$$]', regularPrice)
                .replace('[DiscountedPrice]', discountLabel)
                .replace('[$]', discountPrice)
                .replace('[PriceInformation]', discountInformation)
                .trim();

            return liveRegionText;
        },

        _updateLiveRegion: function(item) {
            var $liveRegion = $(selectors.cartStatus);
            $liveRegion.html(this._liveRegionText(item)).attr('aria-hidden', false);

            // hide content from accessibility tree after announcement
            setTimeout(function() {
                $liveRegion.attr('aria-hidden', true);
            }, 1000);
        },

        _createCart: function(state) {
            var cartDiscountList = this._createCartDiscountList(state);

            $(selectors.emptyPageContent).addClass(classes.hide);
            $(selectors.cartWrapper).removeClass(classes.hide);

            $(selectors.cartLineItems, this.$container).html(
                this._createLineItemList(state)
            );

            this.setQuantityFormControllers();

            $(selectors.cartNote, this.$container).val(state.note);

            if (cartDiscountList.length === 0) {
                $(selectors.cartDiscountWrapper, this.$container)
                    .html('')
                    .addClass(classes.hide);
            } else {
                $(selectors.cartDiscountWrapper, this.$container)
                    .html(cartDiscountList)
                    .removeClass(classes.hide);
            }

            $(selectors.cartSubtotal, this.$container).html(
                theme.Currency.formatMoney(
                    state.total_price,
                    theme.moneyFormatWithCurrency
                )
            );

            if (theme.HaloAddOn.checkNeedToConvertCurrency()) {
                Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
            }

            
        },

        _createCartDiscountList: function(cart) {
            return $.map(
                cart.cart_level_discount_applications,
                function(discount) {
                    var $discount = this.$cartDiscountTemplate.clone();
                    $discount.find(selectors.cartDiscountTitle).text(discount.title);
                    $discount
                        .find(selectors.cartDiscountAmount)
                        .html(
                            theme.Currency.formatMoney(
                                discount.total_allocated_amount,
                                theme.moneyFormat
                            )
                        );
                    return $discount[0];
                }.bind(this)
            );
        },

        _createLineItemList: function(state) {
            return $.map(
                state.items,
                function(item, index) {
                    var $item = this.$itemTemplate.clone();
                    var $itemPriceList = this.$itemPriceListTemplate.clone();

                    this._setLineItemAttributes($item, item, index);
                    this._setLineItemImage($item, item.featured_image);

                    $(selectors.cartItemTitle, $item)
                        .text(item.product_title)
                        .attr('href', item.url);

                    var productDetailsList = this._createProductDetailsList(
                        item.product_has_only_default_variant,
                        item.options_with_values,
                        item.properties
                    );
                    this._setProductDetailsList($item, productDetailsList);

                    this._setItemRemove($item, item.title);

                    $itemPriceList.html(
                        this._createItemPrice(
                            item.original_price,
                            item.final_price,
                            this.$itemPriceListTemplate
                        )
                    );

                    if (item.unit_price_measurement) {
                        $itemPriceList.append(
                            this._createUnitPrice(
                                item.unit_price,
                                item.unit_price_measurement,
                                this.$itemPriceListTemplate
                            )
                        );
                    }

                    this._setItemPrice($item, $itemPriceList);

                    var itemDiscountList = this._createItemDiscountList(item);
                    this._setItemDiscountList($item, itemDiscountList);

                    this._setQuantityInputs($item, item, index);

                    var itemLinePrice = this._createItemPrice(
                        item.original_line_price,
                        item.final_line_price,
                        this.$itemLinePriceTemplate
                    );
                    this._setItemLinePrice($item, itemLinePrice);

                    return $item[0];
                }.bind(this)
            );
        },

        _setLineItemAttributes: function($item, item, index) {
            $item
                .attr(attributes.cartItemKey, item.key)
                .attr(attributes.cartItemUrl, item.url)
                .attr(attributes.cartItemTitle, item.title)
                .attr(attributes.cartItemIndex, index + 1)
                .attr(attributes.cartItemQuantity, item.quantity);
        },

        _setLineItemImage: function($item, featuredImage) {
            var $image = $(selectors.cartItemImage, $item);

            var sizedImageUrl =
                featuredImage.url !== null
                    ? theme.Images.getSizedImageUrl(featuredImage.url, 'x190')
                    : null;

            if (sizedImageUrl) {
                $image
                    .attr('alt', featuredImage.alt)
                    .attr('src', sizedImageUrl)
                    .removeClass(classes.hide);
            } else {
                $image.remove();
            }
        },

        _setProductDetailsList: function($item, productDetailsList) {
            var $itemDetails = $(selectors.cartItemDetails, $item);

            if (productDetailsList.length === 0) {
                $itemDetails.addClass(classes.hide).text('');
            } else {
                $itemDetails.removeClass(classes.hide).html(productDetailsList);
            }
        },

        _setItemPrice: function($item, price) {
            $(selectors.cartItemPrice, $item).html(price);
        },

        _setItemDiscountList: function($item, discountList) {
            var $itemDiscountList = $(selectors.cartItemDiscountList, $item);

            if (discountList.length === 0) {
                $itemDiscountList.html('').addClass(classes.hide);
            } else {
                $itemDiscountList.html(discountList).removeClass(classes.hide);
            }
        },

        _setItemRemove: function($item, title) {
            $(selectors.cartRemove, $item).attr(
                'aria-label',
                theme.strings.removeLabel.replace('[product]', title)
            );
        },

        _setQuantityInputs: function($item, item, index) {
            $(selectors.quantityInputMobile, $item)
                .attr('id', 'updates_' + item.key)
                .attr(attributes.quantityItem, index + 1)
                .val(item.quantity);

            $(selectors.quantityInputDesktop, $item)
                .attr('id', 'updates_large_' + item.key)
                .attr(attributes.quantityItem, index + 1)
                .val(item.quantity);

            $(selectors.quantityLabelMobile, $item).attr(
                'for',
                'updates_' + item.key
            );

            $(selectors.quantityLabelDesktop, $item).attr(
                'for',
                'updates_large_' + item.key
            );
        },

        setQuantityFormControllers: function() {
            if (this.mql.matches) {
                $(selectors.quantityInputDesktop).attr('name', 'updates[]');
                $(selectors.quantityInputMobile).removeAttr('name');
            } else {
                $(selectors.quantityInputMobile).attr('name', 'updates[]');
                $(selectors.quantityInputDesktop).removeAttr('name');
            }
        },

        _setItemLinePrice: function($item, price) {
            $(selectors.cartItemLinePrice, $item).html(price);
        },

        _createProductDetailsList: function(
            product_has_only_default_variant,
            options,
            properties
        ) {
            var optionsPropertiesHTML = [];

            if (!product_has_only_default_variant) {
                optionsPropertiesHTML = optionsPropertiesHTML.concat(
                    this._getOptionList(options)
                );
            }

            if (properties !== null && Object.keys(properties).length !== 0) {
                optionsPropertiesHTML = optionsPropertiesHTML.concat(
                    this._getPropertyList(properties)
                );
            }

            return optionsPropertiesHTML;
        },

        _getOptionList: function(options) {
            return $.map(
                options,
                function(option) {
                    var $optionElement = this.$itemOptionTemplate.clone();

                    $optionElement
                        .text(option.value)
                        .removeClass(classes.hide);

                    return $optionElement[0];
                }.bind(this)
            );
        },

        _getPropertyList: function(properties) {
            var propertiesArray =
                properties !== null ? Object.entries(properties) : [];

            return $.map(
                propertiesArray,
                function(property) {
                    var $propertyElement = this.$itemPropertyTemplate.clone();

                    // Line item properties prefixed with an underscore are not to be displayed
                    if (property[0].charAt(0) === '_') return;

                    // if the property value has a length of 0 (empty), don't display it
                    if (property[1].length === 0) return;

                    $propertyElement
                        .find(selectors.cartItemPropertyName)
                        .text(property[0]);

                    if (property[0].indexOf('/uploads/') === -1) {
                        $propertyElement
                            .find(selectors.cartItemPropertyValue)
                            .text(': ' + property[1]);
                    } else {
                        $propertyElement
                            .find(selectors.cartItemPropertyValue)
                            .html(
                                ': <a href="' +
                                    property[1] +
                                    '"> ' +
                                    property[1].split('/').pop() +
                                    '</a>'
                            );
                    }

                    $propertyElement.removeClass(classes.hide);

                    return $propertyElement[0];
                }.bind(this)
            );
        },

        _createItemPrice: function(original_price, final_price, $priceTemplate) {
            if (original_price !== final_price) {
                var $discountedPrice = $(
                    selectors.cartItemDiscountedPriceGroup,
                    $priceTemplate
                ).clone();

                $(selectors.cartItemOriginalPrice, $discountedPrice).html(
                    theme.Currency.formatMoney(original_price, theme.moneyFormat)
                );
                $(selectors.cartItemFinalPrice, $discountedPrice).html(
                    theme.Currency.formatMoney(final_price, theme.moneyFormat)
                );
                $discountedPrice.removeClass(classes.hide);

                return $discountedPrice[0];
            } else {
                var $regularPrice = $(
                    selectors.cartItemRegularPriceGroup,
                    $priceTemplate
                ).clone();

                $(selectors.cartItemRegularPrice, $regularPrice).html(
                    theme.Currency.formatMoney(original_price, theme.moneyFormat)
                );

                $regularPrice.removeClass(classes.hide);

                return $regularPrice[0];
            }
        },

        _createUnitPrice: function(
            unitPrice,
            unitPriceMeasurement,
            $itemPriceGroup
        ) {
            var $unitPriceGroup = $(
                selectors.unitPriceGroup,
                $itemPriceGroup
            ).clone();

            var unitPriceBaseUnit =
                (unitPriceMeasurement.reference_value !== 1
                    ? unitPriceMeasurement.reference_value
                    : '') + unitPriceMeasurement.reference_unit;

            $(selectors.unitPriceBaseUnit, $unitPriceGroup).text(unitPriceBaseUnit);
            $(selectors.unitPrice, $unitPriceGroup).html(
                theme.Currency.formatMoney(unitPrice, theme.moneyFormat)
            );

            $unitPriceGroup.removeClass(classes.hide);

            return $unitPriceGroup[0];
        },

        _createItemDiscountList: function(item) {
            return $.map(
                item.line_level_discount_allocations,
                function(discount) {
                    var $discount = this.$itemDiscountTemplate.clone();
                    $discount
                        .find(selectors.cartItemDiscountTitle)
                        .text(discount.discount_application.title);
                    $discount
                        .find(selectors.cartItemDiscountAmount)
                        .html(
                            theme.Currency.formatMoney(discount.amount, theme.moneyFormat)
                        );
                    return $discount[0];
                }.bind(this)
            );
        },

        _showQuantityErrorMessages: function(itemElement) {
            $(selectors.cartQuantityErrorMessage, itemElement).text(
                theme.strings.quantityMinimumMessage
            );

            $(selectors.cartQuantityErrorMessageWrapper, itemElement).removeClass(
                classes.hide
            );

            $(selectors.inputQty, itemElement)
                .addClass(classes.inputError)
                .focus();
        },

        _showQuantityErrorMessages2: function(quantity, itemElement) {
            
            $(selectors.cartQuantityErrorMessage, itemElement).text(
                theme.strings.cartErrorMaximum.replace('[quantity]', quantity)
            );

            $(selectors.cartQuantityErrorMessageWrapper, itemElement).removeClass(
                classes.hide
            );

            $(selectors.inputQty, itemElement)
                .addClass(classes.inputError)
                .focus();
        },

        _hideQuantityErrorMessage: function() {
            var $errorMessages = $(
                selectors.cartQuantityErrorMessageWrapper
            ).addClass(classes.hide);

            $(selectors.cartQuantityErrorMessage, $errorMessages).text('');

            $(selectors.inputQty, this.$container).removeClass(classes.inputError);
        },

        _handleThumbnailClick: function(evt) {
            var url = $(evt.target)
                .closest(selectors.cartItem)
                .data('cart-item-url');

            window.location.href = url;
        },

        _onNoteChange: function(evt) {
            var note = evt.currentTarget.value;
            this._hideCartError();
            this._hideQuantityErrorMessage();

            var params = {
                url: '/cart/update.js',
                data: { note: note },
                dataType: 'json'
            };

            $.post(params).fail(
                function() {
                    this._showCartError(evt.currentTarget);
                }.bind(this)
            );
        },

        _showCartError: function(elementToFocus) {
            $(selectors.cartErrorMessage).text(theme.strings.cartError);

            $(selectors.cartErrorMessageWrapper).removeClass(classes.hide);

            elementToFocus.focus();
        },

        _hideCartError: function() {
            $(selectors.cartErrorMessageWrapper).addClass(classes.hide);
            $(selectors.cartErrorMessage).text('');
        },

        _onRemoveItem: function(evt) {
            evt.preventDefault();
            var $remove = $(evt.target);
            var $lineItem = $remove.closest(selectors.cartItem);
            var index = $lineItem.attr(attributes.cartItemIndex);
            this._hideCartError();

            var params = {
                url: '/cart/change.js',
                data: { quantity: 0, line: index },
                dataType: 'json'
            };

            $.post(params)
                .done(
                    function(state) {
                        if (state.item_count === 0) {
                            $('.cart-quickview_header').addClass('hide');
                            this._emptyCart();
                        } else {
                            this._createCart(state);
                            this._showRemoveMessage($lineItem.clone());
                            theme.HaloAddOn.progressBarShipping();
                        }

                        this._setCartCountBubble(state.item_count);
                        
                    }.bind(this)
                )
                .fail(
                    function() {
                        this._showCartError(null);
                    }.bind(this)
                );
        },

        _onRemoveItemAll: function(evt) {
            evt.preventDefault();
            this._hideCartError();

            var params = {
                url: '/cart/clear.js',
                dataType: 'json'
            };

            $.post(params)
                .done(
                    function() {
                        this._setCartCountBubble(0);
                        this._emptyCart();
                    }.bind(this)
                )
                .fail(
                    function() {
                        this._showCartError(null);
                    }.bind(this)
                );
        },

        _showRemoveMessage: function(lineItem) {
            var index = lineItem.data('cart-item-index');
            var removeMessage = this._getRemoveMessage(lineItem);
            var $lineItemAtIndex;

            if (index - 1 === 0) {
                $lineItemAtIndex = $('[data-cart-item-index="1"]', this.$container);
                $(removeMessage).insertBefore($lineItemAtIndex);
            } else {
                $lineItemAtIndex = $(
                    '[data-cart-item-index="' + (index - 1) + '"]',
                    this.$container
                );
                removeMessage.insertAfter($lineItemAtIndex);
            }
            removeMessage.focus();
        },

        _getRemoveMessage: function(lineItem) {
            var formattedMessage = this._formatRemoveMessage(lineItem);

            var $tableCell = $(selectors.cartTableCell, lineItem).clone();
            $tableCell
                .removeClass()
                .addClass(classes.cartRemovedProduct)
                .attr('colspan', '4')
                .html(formattedMessage);

            lineItem
                .attr('role', 'alert')
                .html($tableCell)
                .attr('tabindex', '-1');

            return lineItem;
        },

        _formatRemoveMessage: function(lineItem) {
            var quantity = lineItem.data('cart-item-quantity');
            var url = lineItem.attr(attributes.cartItemUrl);
            var title = lineItem.attr(attributes.cartItemTitle);

            return theme.strings.removedItemMessage
                .replace('[quantity]', quantity)
                .replace(
                    '[link]',
                    '<a ' +
                        'href="' +
                        url +
                        '" class="text-link text-link--accent">' +
                        title +
                        '</a>'
                );
        },

        _setCartCountBubble: function(quantity) {
            this.$cartCountBubble =
                this.$cartCountBubble || $(selectors.cartCountBubble);
            this.$cartCount = this.$cartCount || $(selectors.cartCount);
            if (quantity > 0) {
                this.$cartCountBubble.removeClass(classes.hide);
                this.$cartCount.html( quantity );

            } else {
                this.$cartCountBubble.addClass(classes.hide);
                this.$cartCount.html('0');
            }
        },

        _emptyCart: function() {
            this.$emptyPageContent =
                this.$emptyPageContent ||
                $(selectors.emptyPageContent, this.$container);
            this.$cartWrapper =
                this.$cartWrapper || $(selectors.cartWrapper, this.$container);

            // this.$emptyPageContent.removeClass(classes.hide);
            // this.$cartWrapper.addClass('classes.hide');
            $(selectors.emptyPageContent).removeClass(classes.hide);
            $(selectors.cartWrapper).addClass(classes.hide);
        },

        _cartTermsConditions: function() {
            if($('.cart__submit-controls .product__terms-conditions').length) {
                var checkBox = $('.cart__submit-controls .product__terms-conditions input[type="checkbox"]');

                checkBox.each(function(){
                    if ($(this).prop('checked')) {
                        $(this).parent().prev().removeClass('disabled');
                    } else {
                        $(this).parent().prev().addClass('disabled');
                    }
                });

                $(document).on('click', '.cart__submit-controls .product__terms-conditions .title', function(event) {
                    event.preventDefault();
                    var self = $(this),
                        ipt = self.prev();

                    if(!ipt.prop('checked')) {
                        ipt.prop('checked', true);
                        self.parent().prev().removeClass('disabled');
                    } else {
                        ipt.prop('checked', false);
                        self.parent().prev().addClass('disabled');
                    };
                })
            }
        },

        cookiesEnabled: function() {
            var cookieEnabled = navigator.cookieEnabled;

            if (!cookieEnabled) {
                document.cookie = 'testcookie';
                cookieEnabled = document.cookie.indexOf('testcookie') !== -1;
            }
            return cookieEnabled;
        }
       

    });

    return Cart;
})();

window.theme = window.theme || {};

theme.Filters = (function() {
    var settings = {
        // Breakpoints from src/stylesheets/global/variables.scss.liquid
        mediaQueryMediumUp: 'screen and (min-width: 750px)'
    };

    var constants = {
        SORT_BY: 'sort_by'
    };

    var selectors = {
        mainContent: '#MainContent',
        filterSelection: '#FilterTags',
        sortSelection: '#SortBy',
        pagination: "#showPagination"
    };

    var data = {
        sortBy: 'data-default-sortby'
    };

    function Filters(container) {
        var $container = (this.$container = $(container));

        this.$pagination = $(selectors.pagination, $container);
        this.$filterSelect = $(selectors.filterSelection, $container);
        this.$sortSelect = $(selectors.sortSelection, $container);
        this.$selects = $(selectors.pagination, $container).add(
            $(selectors.sortSelection, $container)
        );

        this.defaultSort = this._getDefaultSortValue();
        this.$selects.removeClass('hidden');

        // this.$filterSelect.on('change', this._onFilterChange.bind(this));
        // this.$sortSelect.on('change', this._onSortChange.bind(this));
        this.$pagination.on('change', this._onPaginationChange.bind(this));
        this._initBreakpoints();
    }

    Filters.prototype = _.assignIn({}, Filters.prototype, {
        _initBreakpoints: function() {
            var self = this;

            enquire.register(settings.mediaQueryMediumUp, {
                match: function() {
                    self._resizeSelect(self.$selects);
                }
            });
        },

        _onPaginationChange: function() {
            var number = this._getPaginationValue();
            $.ajax({
                type: "Post",
                url: window.router + '/cart.js',
                data: {
                    "attributes[pagination]": number
                },
                success: function (data) {
                    window.location.reload();
                },
                dataType: 'json'
            });
        },

        _getPaginationValue: function() {
            return this.$pagination.val();
        },

        _onSortChange: function() {
            var sort = this._sortValue();
            var url = window.location.href.replace(window.location.search, '');
            var queryStringValue = slate.utils.getParameterByName('q');
            var query = queryStringValue !== null ? queryStringValue : '';

            if (sort.length) {
                var urlStripped = url.replace(window.location.hash, '');
                query = query !== '' ? '?q=' + query + '&' : '?';

                window.location.href =
                    urlStripped + query + sort + selectors.mainContent;
            } else {
                // clean up our url if the sort value is blank for default
                window.location.href = url;
            }
        },

        _onFilterChange: function() {
            var filter = this._getFilterValue();

            // remove the 'page' parameter to go to the first page of results
            var search = document.location.search.replace(/\?(page=\w+)?&?/, '');

            // only add the search parameters to the url if they exist
            search = search !== '' ? '?' + search : '';

            document.location.href = filter + search + selectors.mainContent;
        },

        _getFilterValue: function() {
            return this.$filterSelect.val();
        },

        _getSortValue: function() {
            return this.$sortSelect.val() || this.defaultSort;
        },

        _getDefaultSortValue: function() {
            return this.$sortSelect.attr(data.sortBy);
        },

        _sortValue: function() {
            var sort = this._getSortValue();
            var query = '';

            if (sort !== this.defaultSort) {
                query = constants.SORT_BY + '=' + sort;
            }

            return query;
        },

        _resizeSelect: function($selection) {
            $selection.each(function() {
                var $this = $(this);
                var arrowWidth = 10;
                // create test element
                var text = $this.find('option:selected').text();
                var $test = $('<span>').html(text);

                // add to body, get width, and get out
                $test.appendTo('body');
                var width = $test.width();
                $test.remove();

                // set select width
                // $this.width(width + arrowWidth);
            });
        },

        onUnload: function() {
            // this.$filterSelect.off('change', this._onFilterChange);
            this.$sortSelect.off('change', this._onSortChange);
        }
    });

    return Filters;
})();

theme.Maps = (function() {
    var config = {
        zoom: 14
    };
    var apiStatus = null;
    var mapsToLoad = [];

    var errors = {
        addressNoResults: theme.strings.addressNoResults,
        addressQueryLimit: theme.strings.addressQueryLimit,
        addressError: theme.strings.addressError,
        authError: theme.strings.authError
    };

    var selectors = {
        section: '[data-section-type="map"]',
        map: '[data-map]',
        mapOverlay: '[data-map-overlay]'
    };

    var classes = {
        mapError: 'map-section--load-error',
        errorMsg: 'map-section__error errors text-center'
    };

    // Global function called by Google on auth errors.
    // Show an auto error message on all map instances.
    // eslint-disable-next-line camelcase, no-unused-vars
    window.gm_authFailure = function() {
        if (!Shopify.designMode) {
            return;
        }

        $(selectors.section).addClass(classes.mapError);
        $(selectors.map).remove();
        $(selectors.mapOverlay).after(
            '<div class="' +
                classes.errorMsg +
                '">' +
                theme.strings.authError +
                '</div>'
        );
    };

    function Map(container) {
        this.$container = $(container);
        this.$map = this.$container.find(selectors.map);
        this.key = this.$map.data('api-key');

        if (typeof this.key === 'undefined') {
            return;
        }

        if (apiStatus === 'loaded') {
            this.createMap();
        } else {
            mapsToLoad.push(this);

            if (apiStatus !== 'loading') {
                apiStatus = 'loading';
                if (typeof window.google === 'undefined') {
                    $.getScript(
                        'https://maps.googleapis.com/maps/api/js?key=' + this.key
                    ).then(function() {
                        apiStatus = 'loaded';
                        initAllMaps();
                    });
                }
            }
        }
    }

    function initAllMaps() {
        // API has loaded, load all Map instances in queue
        $.each(mapsToLoad, function(index, instance) {
            instance.createMap();
        });
    }

    function geolocate($map) {
        var deferred = $.Deferred();
        var geocoder = new google.maps.Geocoder();
        var address = $map.data('address-setting');

        geocoder.geocode({ address: address }, function(results, status) {
            if (status !== google.maps.GeocoderStatus.OK) {
                deferred.reject(status);
            }

            deferred.resolve(results);
        });

        return deferred;
    }

    Map.prototype = _.assignIn({}, Map.prototype, {
        createMap: function() {
            var $map = this.$map;

            return geolocate($map)
                .then(
                    function(results) {
                        var mapOptions = {
                            zoom: config.zoom,
                            center: results[0].geometry.location,
                            draggable: false,
                            clickableIcons: false,
                            scrollwheel: false,
                            disableDoubleClickZoom: true,
                            disableDefaultUI: true
                        };

                        var map = (this.map = new google.maps.Map($map[0], mapOptions));
                        var center = (this.center = map.getCenter());

                        //eslint-disable-next-line no-unused-vars
                        var marker = new google.maps.Marker({
                            map: map,
                            position: map.getCenter()
                        });

                        google.maps.event.addDomListener(
                            window,
                            'resize',
                            $.debounce(250, function() {
                                google.maps.event.trigger(map, 'resize');
                                map.setCenter(center);
                                $map.removeAttr('style');
                            })
                        );
                    }.bind(this)
                )
                .fail(function() {
                    var errorMessage;

                    switch (status) {
                        case 'ZERO_RESULTS':
                            errorMessage = errors.addressNoResults;
                            break;
                        case 'OVER_QUERY_LIMIT':
                            errorMessage = errors.addressQueryLimit;
                            break;
                        case 'REQUEST_DENIED':
                            errorMessage = errors.authError;
                            break;
                        default:
                            errorMessage = errors.addressError;
                            break;
                    }

                    // Show errors only to merchant in the editor.
                    if (Shopify.designMode) {
                        $map
                            .parent()
                            .addClass(classes.mapError)
                            .html(
                                '<div class="' +
                                    classes.errorMsg +
                                    '">' +
                                    errorMessage +
                                    '</div>'
                            );
                    }
                });
        },

        onUnload: function() {
            if (this.$map.length === 0) {
                return;
            }
            google.maps.event.clearListeners(this.map, 'resize');
        }
    });

    return Map;
})();

theme.Product = (function() {
    function Product(container) {
        var $container = (this.$container = $(container));
        var sectionId = $container.attr('data-section-id');

        this.settings = {
            // Breakpoints from src/stylesheets/global/variables.scss.liquid
            mediaQueryMediumUp: 'screen and (min-width: 1025px)',
            mediaQuerySmall: 'screen and (max-width: 1024px)',
            bpSmall: false,
            enableHistoryState: $container.data('enable-history-state') || false,
            namespace: '.slideshow-' + sectionId,
            sectionId: sectionId,
            sliderActive: false,
            zoomEnabled: false
        };

        this.selectors = {
            addToCart: '[data-add-to-cart]',
            addToCartText: '[data-add-to-cart-text]',
            cartCount: '[data-cart-count]',
            cartCountBubble: '[data-cart-count-bubble]',
            cartPopup: '[data-cart-popup]',
            cartPopupCartQuantity: '[data-cart-popup-cart-quantity]',
            cartPopupClose: '[data-cart-popup-close]',
            cartPopupDismiss: '[data-cart-popup-dismiss]',
            cartPopupImage: '[data-cart-popup-image]',
            cartPopupImageWrapper: '[data-cart-popup-image-wrapper]',
            cartPopupImagePlaceholder: '[data-cart-popup-image-placeholder]',
            cartPopupProductDetails: '[data-cart-popup-product-details]',
            cartPopupQuantity: '[data-cart-popup-quantity]',
            cartPopupQuantityLabel: '[data-cart-popup-quantity-label]',
            cartPopupTitle: '[data-cart-popup-title]',
            cartPopupWrapper: '[data-cart-popup-wrapper]',
            loader: '[data-loader]',
            loaderStatus: '[data-loader-status]',
            quantity: '[data-quantity-input]',
            quantitybtn: '[data-qtt]',
            SKU: '.variant-sku',
            productStatus: '[data-product-status]',
            originalSelectorId: '#ProductSelect-' + sectionId,
            productForm: '[data-product-form]',
            errorMessage: '[data-error-message]',
            errorMessageWrapper: '[data-error-message-wrapper]',
            productImage: '.product-single__photo img',
            productImageWraps: '.product-single__photo',
            productMainImageWraps: '.product-single__photo.number__1',
            productThumbImages: '.product-single__thumbnail--' + sectionId,
            productThumbs: '.product-single__thumbnails-' + sectionId,
            productThumbListItem: '.product-single__thumbnails-item',
            productFeaturedImage: '.product-featured-img',
            productThumbsWrapper: '.thumbnails-wrapper',
            saleLabel: '.product-price__sale-label-' + sectionId,
            singleOptionSelector: '.single-option-selector-' + sectionId,
            shopifyPaymentButton: '.shopify-payment-button',
            priceContainer: '[data-price]',
            regularPrice: '[data-regular-price]',
            salePrice: '[data-sale-price]',
            unitPrice: '[data-unit-price]',
            labelSale: '[data-label-sale]',
            totalPrice: '[data-total-price]',
            productChangeGroupImage: '[data-change-group-image]',
            productSwatch: '[data-filter]',
            unitPriceBaseUnit: '[data-unit-price-base-unit]'
        };

        this.classes = {
            cartPopupWrapperHidden: 'cart-popup-wrapper--hidden',
            hidden: 'hide',
            inputError: 'input--error',
            productOnSale: 'price--on-sale',
            productUnitAvailable: 'price--unit-available',
            productUnavailable: 'price--unavailable',
            productFormErrorMessageWrapperHidden:
                'product-form__error-message-wrapper--hidden',
            activeClass: 'active-thumb'
        };

        this.$quantityInput = $(this.selectors.quantity, $container);
        this.$errorMessageWrapper = $(
            this.selectors.errorMessageWrapper,
            $container
        );
        this.$addToCart = $(this.selectors.addToCart, $container);
        this.$addToCartText = $(this.selectors.addToCartText, this.$addToCart);
        this.$loader = $(this.selectors.loader, this.$addToCart);
        this.$loaderStatus = $(this.selectors.loaderStatus, $container);
        this.$shopifyPaymentButton = $(
            this.selectors.shopifyPaymentButton,
            $container
        );

        // Stop parsing if we don't have the product json script tag when loading
        // section in the Theme Editor
        if (!$('#ProductJson-' + sectionId).html()) {
            return;
        }

        this.productSingleObject = JSON.parse(
            document.getElementById('ProductJson-' + sectionId).innerHTML
        );

        this.settings.zoomEnabled = $(this.selectors.productImageWraps).hasClass(
            'js-zoom-enabled'
        );

        this._initBreakpoints();
        this._stringOverrides();
        this._initVariants();
        this._initImageSwitch();
        this._initAddToCart();
        this._initsetMainImage();
        this._setActiveThumbnail();
        this._next_prev_button();
        this._setNumberQuantity();

        this._setProductCarousel();
        this._initSoldOutProductShop();
        this._setShowmore_description();
        this._initCustomerViewProductShop();
        this._initCountdown();
        this._scrollToReview();
        this._productVideo();
    }

    Product.prototype = _.assignIn({}, Product.prototype, {
        _productVideo: function() {
            if(!$('#video_product.halo_modal').length) {
                return;
            }

            var src = $('#video_product .popup-video').children('iframe').attr('src');

            $('#video_product').on('click', function() {
                if (($(event.target).closest('#video_product .popup-video').length === 0)) {
                    $('#video_product .popup-video').children('iframe').attr('src', '');
                }
            });

            $('.video-link[data-target="#video_product"]').on('click', function() {
                $('#video_product .popup-video').children('iframe').attr('src', src);
            });
        },

        _stringOverrides: function() {
            theme.productStrings = theme.productStrings || {};
            $.extend(theme.strings, theme.productStrings);
        },

        _initBreakpoints: function() {
            var self = this;

            enquire.register(this.settings.mediaQuerySmall, {
                match: function() {

                    // destroy image zooming if enabled
                    if (self.settings.zoomEnabled) {
                        $(self.selectors.productImageWraps).each(function() {
                            _destroyZoom(this);
                        });
                    }

                    self.settings.bpSmall = true;
                },
                unmatch: function() {

                    self.settings.bpSmall = false;
                }
            });

            enquire.register(this.settings.mediaQueryMediumUp, {
                match: function() {
                    if (self.settings.zoomEnabled) {
                        $(self.selectors.productImageWraps).each(function() {
                            _enableZoom(this);
                        });
                    }
                }
            });
        },

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

            var variant = this.variants._getVariantFromOptions();

            if (variant != null && variant.featured_media != null) {
                var imageId = variant.featured_media.id;
                this._switchImage(imageId);
                this._setActiveThumbnail(imageId);
            }

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

        _initsetMainImage: function() {
            if (!$('.product-slider').hasClass('custom')) {
                return;
            }

            var $newImage = $(this.selectors.productMainImageWraps,this.$container);
            var $otherImages = $(this.selectors.productImageWraps,this.$container);
            if ($('.product-slider').hasClass('custom')) {
                $otherImages.addClass(this.classes.hidden);
                $newImage.removeClass(this.classes.hidden);
            }
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

        _initAddToCart: function() {
            $(this.selectors.productForm, this.$container).on(
                'submit',
                function(evt) {
                    evt.preventDefault();
                    this.$previouslyFocusedElement = $(':focus');

                    var isInvalidQuantity = this.$quantityInput.val() <= 0;

                    if (this.$addToCart.is('[aria-disabled]')) return;

                    if (isInvalidQuantity) {
                        
                        this._showErrorMessage(theme.strings.quantityMinimumMessage);
                        
                    } else {
                        // disable the addToCart and dynamic checkout button while
                        // request/cart popup is loading and handle loading state
                        this._handleButtonLoadingState(true);
                        var $data = $(this.selectors.productForm, this.$container);
                        this._addItemToCart($data);
                    }
                }.bind(this)
            );
        },

        _addItemToCart: function(data) {
            var params = {
                url: '/cart/add.js',
                data: $(data).serialize(),
                dataType: 'json'
            };

            $.post(params)
                .done(
                    function(item) {
                        this._hideErrorMessage();
                        this._setupCartPopup(item);
                        this._updateTotalPrice();
                    }.bind(this)
                )
                .fail(
                    function(response) {
                        this.$previouslyFocusedElement.focus();
                        this._showErrorMessage(response.responseJSON.description);
                        this._handleButtonLoadingState(false);
                    }.bind(this)
                );
        },

        _handleButtonLoadingState: function(isLoading) {
            if (isLoading) {
                this.$addToCart.attr('aria-disabled', true);
                this.$addToCartText.addClass(this.classes.hidden);
                this.$loader.removeClass(this.classes.hidden);
                this.$shopifyPaymentButton.attr('disabled', true);
                this.$loaderStatus.attr('aria-hidden', false);
            } else {
                this.$addToCart.removeAttr('aria-disabled');
                this.$addToCartText.removeClass(this.classes.hidden);
                this.$loader.addClass(this.classes.hidden);
                this.$shopifyPaymentButton.removeAttr('disabled');
                this.$loaderStatus.attr('aria-hidden', true);
            }
        },

        _showErrorMessage: function(errorMessage) {
            $(this.selectors.errorMessage, this.$container).html(errorMessage);

            if (this.$quantityInput.length !== 0) {
                this.$quantityInput.addClass(this.classes.inputError);
            }

            this.$errorMessageWrapper
                .removeClass(this.classes.productFormErrorMessageWrapperHidden)
                .attr('aria-hidden', true)
                .removeAttr('aria-hidden');
        },

        _hideErrorMessage: function() {
            this.$errorMessageWrapper.addClass(
                this.classes.productFormErrorMessageWrapperHidden
            );

            if (this.$quantityInput.length !== 0) {
                this.$quantityInput.removeClass(this.classes.inputError);
            }
        },

        _updateTotalPrice: function() {
            if(!$('.navUser-action-total-price').length) {
                return;
            }
            Shopify.getCart(function (cart) {
                $('.navUser-action-total-price .total-price').html(theme.Currency.formatMoney(cart.total_price, theme.moneyFormat));
            });

        },

        _setupCartPopup: function(item) {
            this.$cartPopup = this.$cartPopup || $(this.selectors.cartPopup);
            this.$cartPopupWrapper =
                this.$cartPopupWrapper || $(this.selectors.cartPopupWrapper);
            this.$cartPopupTitle =
                this.$cartPopupTitle || $(this.selectors.cartPopupTitle);
            this.$cartPopupQuantity =
                this.$cartPopupQuantity || $(this.selectors.cartPopupQuantity);
            this.$cartPopupQuantityLabel =
                this.$cartPopupQuantityLabel ||
                $(this.selectors.cartPopupQuantityLabel);
            this.$cartPopupClose =
                this.$cartPopupClose || $(this.selectors.cartPopupClose);
            this.$cartPopupDismiss =
                this.cartPopupDismiss || $(this.selectors.cartPopupDismiss);

            this._setupCartPopupEventListeners();

            this._updateCartPopupContent(item);
        },

        _updateCartPopupContent: function(item) {
            var quantity = this.$quantityInput.length ? this.$quantityInput.val() : 1;

            this.$cartPopupTitle.text(item.product_title);
            this.$cartPopupQuantity.text(quantity);
            this.$cartPopupQuantityLabel.text(
                theme.strings.quantityLabel.replace('[count]', quantity)
            );

            this._setCartPopupImage(item.image, item.title);
            this._setCartPopupProductDetails(item.variant_options, item.properties);

            $.getJSON('/cart.js').then(
                function(cart) {
                    this._setCartQuantity(cart.item_count);
                    this._setCartCountBubble(cart.item_count);
                    this._showCartPopup();
                }.bind(this)
            );


            setTimeout(function() {

                $(this.selectors.cartPopupDismiss).trigger('click');

            }, 2000)
        },

        _setupCartPopupEventListeners: function() {
            this.$cartPopupWrapper.on(
                'keyup',
                function(event) {
                    if (event.keyCode === slate.utils.keyboardKeys.ESCAPE) {
                        this._hideCartPopup(event);
                    }
                }.bind(this)
            );

            this.$cartPopupClose.on('click', this._hideCartPopup.bind(this));
            this.$cartPopupDismiss.on('click', this._hideCartPopup.bind(this));
            $('body').on('click', this._onBodyClick.bind(this));
            
        },

        _setCartPopupImage: function(imageUrl, productTitle) {
            this.$cartPopupImageWrapper =
                this.$cartPopupImageWrapper || $(this.selectors.cartPopupImageWrapper);

            this.$cartPopupImagePlaceholder =
                this.$cartPopupImagePlaceholder ||
                $(this.selectors.cartPopupImagePlaceholder);

            if (imageUrl === null) {
                this.$cartPopupImageWrapper.addClass(this.classes.hidden);
                return;
            }

            this.$cartPopupImageWrapper.removeClass(this.classes.hidden);
            var sizedImageUrl = theme.Images.getSizedImageUrl(imageUrl, '200x');
            var image = document.createElement('img');
            image.src = sizedImageUrl;
            image.alt = productTitle;
            image.dataset.cartPopupImage = '';

            image.onload = function() {
                this.$cartPopupImagePlaceholder.addClass(this.classes.hidden);
                this.$cartPopupImageWrapper.append(image);
            }.bind(this);
        },

        _setCartPopupProductDetails: function(variantOptions, properties) {
            this.$cartPopupProductDetails =
                this.$cartPopupProductDetails ||
                $(this.selectors.cartPopupProductDetails);
            var variantPropertiesHTML = '';

            if (variantOptions[0] !== 'Default Title') {
                variantPropertiesHTML =
                    variantPropertiesHTML + this._getVariantOptionList(variantOptions);
            }

            if (properties !== null && Object.keys(properties).length !== 0) {
                variantPropertiesHTML =
                    variantPropertiesHTML + this._getPropertyList(properties);
            }

            if (variantPropertiesHTML.length === 0) {
                this.$cartPopupProductDetails.html('');
                this.$cartPopupProductDetails.attr('hidden', '');
            } else {
                this.$cartPopupProductDetails.html(variantPropertiesHTML);
                this.$cartPopupProductDetails.removeAttr('hidden');
            }
        },

        _getVariantOptionList: function(variantOptions) {
            var variantOptionListHTML = '';

            variantOptions.forEach(function(variantOption) {
                variantOptionListHTML =
                    variantOptionListHTML +
                    '<li class="product-details__item product-details__item--variant-option">' +
                    variantOption +
                    '</li>';
            });

            return variantOptionListHTML;
        },

        _getPropertyList: function(properties) {
            var propertyListHTML = '';
            var propertiesArray = Object.entries(properties);

            propertiesArray.forEach(function(property) {
                // Line item properties prefixed with an underscore are not to be displayed
                if (property[0].charAt(0) === '_') return;

                // if the property value has a length of 0 (empty), don't display it
                if (property[1].length === 0) return;

                propertyListHTML =
                    propertyListHTML +
                    '<li class="product-details__item product-details__item--property">' +
                    '<span class="product-details__property-label">' +
                    property[0] +
                    ': </span>' +
                    property[1];
                ': ' + '</li>';
            });

            return propertyListHTML;
        },

        _setCartQuantity: function(quantity) {
            this.$cartPopupCartQuantity =
                this.$cartPopupCartQuantity || $(this.selectors.cartPopupCartQuantity);
            var ariaLabel;

            if (quantity === 1) {
                ariaLabel = theme.strings.oneCartCount;
            } else if (quantity > 1) {
                ariaLabel = theme.strings.otherCartCount.replace('[count]', quantity);
            }

            this.$cartPopupCartQuantity.text(quantity).attr('aria-label', ariaLabel);
        },

        _setNumberQuantity: function() {

            if (!$('.template-product').length) {
                return;
            }

            var buttonSlt = '[data-qtt]',
            buttonElm = $(buttonSlt);
           
            $(document).on('click', buttonSlt, function(e) {
                e.preventDefault();
                e.stopPropagation();

                var self = $(this),
                    input = $('#shopify-section-product-template [data-quantity-input]'),
                    oldVal = parseInt(input.val()),
                    newVal = 1;

                switch (true) {
                    case (self.hasClass('plus')): {
                        newVal = oldVal + 1;
                        break;
                    }
                    case (self.hasClass('minus') && oldVal > 1): {
                        newVal = oldVal - 1;
                        break;
                    }
                }
                input.val(newVal).trigger('change');

                var $totalPrice = $('[data-total-price]');
                var oldPrice = $('[data-total-price]').attr('data-price-value');
                $totalPrice.html(
                    theme.Currency.formatMoney(oldPrice*newVal, theme.moneyFormat)
                );

                if (checkNeedToConvertCurrency()) {
                    Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
                }
            });

        },

        _setCartCountBubble: function(quantity) {
            this.$cartCountBubble =
                this.$cartCountBubble || $(this.selectors.cartCountBubble);
            this.$cartCount = this.$cartCount || $(this.selectors.cartCount);

            this.$cartCountBubble.removeClass(this.classes.hidden);
            this.$cartCount.text(quantity);
        },

        _showCartPopup: function() {
            this.$cartPopupWrapper
                .prepareTransition()
                .removeClass(this.classes.cartPopupWrapperHidden);
            this._handleButtonLoadingState(false);

            slate.a11y.trapFocus({
                $container: this.$cartPopupWrapper,
                $elementToFocus: this.$cartPopup,
                namespace: 'cartPopupFocus'
            });
        },

        _hideCartPopup: function(event) {
            var setFocus = event.detail === 0 ? true : false;
            this.$cartPopupWrapper
                .prepareTransition()
                .addClass(this.classes.cartPopupWrapperHidden);

            if($('.cart-popup-wrapper').hasClass('cart-popup-wrapper--hidden')){
                $('.cart-popup-wrapper').removeClass('is-transitioning');
            }

            $(this.selectors.cartPopupImage).remove();
            this.$cartPopupImagePlaceholder.removeClass(this.classes.hidden);

            slate.a11y.removeTrapFocus({
                $container: this.$cartPopupWrapper,
                namespace: 'cartPopupFocus'
            });

            if (setFocus) this.$previouslyFocusedElement[0].focus();

            this.$cartPopupWrapper.off('keyup');
            this.$cartPopupClose.off('click');
            this.$cartPopupDismiss.off('click');
            $('body').off('click');
        },

        _onBodyClick: function(event) {
            var $target = $(event.target);

            if (
                $target[0] !== this.$cartPopupWrapper[0] &&
                !$target.parents(this.selectors.cartPopup).length
            ) {
                this._hideCartPopup(event);
            }
        },

        _setActiveThumbnail: function(imageId) {
            // If there is no element passed, find it by the current product image
            if (typeof imageId === 'undefined') {
                imageId = $(
                    this.selectors.productImageWraps + ':not(.hide)',
                    this.$container
                ).data('image-id');
            }

            var $thumbnailWrappers = $(
                this.selectors.productThumbListItem + ':not(.slick-cloned)',
                this.$container
            );

            var $activeThumbnail = $thumbnailWrappers.find(
                this.selectors.productThumbImages +
                    "[data-thumbnail-id='" +
                    imageId +
                    "']"
            );

            $(this.selectors.productThumbImages)
                .removeClass(this.classes.activeClass)
                .removeAttr('aria-current');

            $activeThumbnail.addClass(this.classes.activeClass);
            $activeThumbnail.attr('aria-current', true);

            if (!$thumbnailWrappers.hasClass('slick-slide')) {
                return;
            }
            var slideIndex = $activeThumbnail.parent().data('slick-index');
            $(this.selectors.productThumbs).slick('slickGoTo', slideIndex);

        },

        _next_prev_button: function() {
            if ($('.product-slider').hasClass('custom')) {
                return;
            }

            var $buttonPrevNext = $(this.selectors.productThumbs).find('.slick-arrow'),
                $productThumbImages = $(this.selectors.productThumbImages);

            $(document).on('click', $buttonPrevNext, function() {
                
                var $activeThumbnail = $('.product-single__thumbnails').find('.slick-current');

                $productThumbImages
                    .removeClass('active-thumb')
                    .removeAttr('aria-current');

                $activeThumbnail.children().addClass('active-thumb');
                $activeThumbnail.children().attr('aria-current', true);
            });
        },

        _switchImage: function(imageId) {
            var $newImage = $(
                this.selectors.productImageWraps + "[data-image-id='" + imageId + "']",
                this.$container
            );
            var $otherImages = $(
                this.selectors.productImageWraps +
                    ":not([data-image-id='" +
                    imageId +
                    "'])",
                this.$container
            );
           
        },

        _handleImageFocus: function(evt) {
            if (evt.keyCode !== slate.utils.keyboardKeys.ENTER) return;

            $(this.selectors.productFeaturedImage + ':visible').focus();
        },

        _liveRegionText: function(variant) {
            // Dummy content for live region
            var liveRegionText =
                '[Availability] [Regular] [$$] [Sale] [$]. [UnitPrice] [$$$]';

            // Update availability
            
            if (!variant) {
                liveRegionText = theme.strings.unavailable;
                return liveRegionText;
            }

            var availability = variant.available ? '' : theme.strings.soldOut + ',';

            liveRegionText = liveRegionText.replace('[Availability]', availability);

            // Update pricing information
            var regularLabel = '';
            var regularPrice = theme.Currency.formatMoney(
                variant.price,
                theme.moneyFormat
            );
            var saleLabel = '';
            var salePrice = '';
            var unitLabel = '';
            var unitPrice = '';

            if (variant.compare_at_price > variant.price) {
                regularLabel = theme.strings.regularPrice;
                regularPrice =
                    theme.Currency.formatMoney(
                        variant.compare_at_price,
                        theme.moneyFormat
                    ) + ',';
                saleLabel = theme.strings.sale;
                salePrice = theme.Currency.formatMoney(
                    variant.price,
                    theme.moneyFormat
                );
            }

            if (variant.unit_price) {
                unitLabel = theme.strings.unitPrice;
                unitPrice =
                    theme.Currency.formatMoney(variant.unit_price, theme.moneyFormat) +
                    ' ' +
                    theme.strings.unitPriceSeparator +
                    ' ' +
                    this._getBaseUnit(variant);
            }

            liveRegionText = liveRegionText
                .replace('[Regular]', regularLabel)
                .replace('[$$]', regularPrice)
                .replace('[Sale]', saleLabel)
                .replace('[$]', salePrice)
                .replace('[UnitPrice]', unitLabel)
                .replace('[$$$]', unitPrice)
                .trim();

            return liveRegionText;
        },

        _updateLiveRegion: function(evt) {
            var variant = evt.variant;
            var liveRegion = this.container.querySelector(
                this.selectors.productStatus
            );
            liveRegion.textContent = this._liveRegionText(variant);
            liveRegion.setAttribute('aria-hidden', false);

            // hide content from accessibility tree after announcement
            setTimeout(function() {
                liveRegion.setAttribute('aria-hidden', true);
            }, 1000);
        },

        _updateAddToCart: function(evt) {
            var variant = evt.variant;
         
            if (variant) {
                if (variant.available) {
                    this.$addToCart
                        .removeAttr('aria-disabled')
                        .attr('aria-label', theme.strings.addToCart);
                    $(this.selectors.addToCartText, this.$container).text(
                        theme.strings.addToCart
                    );
                    this.$shopifyPaymentButton.show();
                } else {
                    // The variant doesn't exist, disable submit button and change the text.
                    // This may be an error or notice that a specific variant is not available.
                    this.$addToCart
                        .attr('aria-disabled', true)
                        .attr('aria-label', theme.strings.soldOut);
                    $(this.selectors.addToCartText, this.$container).text(
                        theme.strings.soldOut
                    );
                    this.$shopifyPaymentButton.hide();
                }
            } else {
                this.$addToCart
                    .attr('aria-disabled', true)
                    .attr('aria-label', theme.strings.unavailable);
                $(this.selectors.addToCartText, this.$container).text(
                    theme.strings.unavailable
                );
                this.$shopifyPaymentButton.hide();
            }
        },

        _updateAvailability: function(evt) {
            // remove error message if one is showing
            this._hideErrorMessage();

            // update form submit
            this._updateAddToCart(evt);
            // update live region
            this._updateLiveRegion(evt);

            this._updatePrice(evt);
        },

        _updateImages: function(evt) {
            var variant = evt.variant;
            var imageId = variant.featured_media.id;

            this._switchImage(imageId);
            this._setActiveThumbnail(imageId);
        },

        _updatePrice: function(evt) {
            var variant = evt.variant;

            var $priceContainer = $(this.selectors.priceContainer, this.$container);
            var $regularPrice = $(this.selectors.regularPrice, $priceContainer);
            var $salePrice = $(this.selectors.salePrice, $priceContainer);
            var $unitPrice = $(this.selectors.unitPrice, $priceContainer);
            var $totalPrice = $(this.selectors.totalPrice, $priceContainer);
            var $labelSale = $(this.selectors.labelSale, this.$priceContainer);

            var $unitPriceBaseUnit = $(
                this.selectors.unitPriceBaseUnit,
                $priceContainer
            );

            // Reset product price state
            $priceContainer
                .removeClass(this.classes.productUnavailable)
                .removeClass(this.classes.productOnSale)
                .removeClass(this.classes.productUnitAvailable)
                .removeAttr('aria-hidden');

            // Unavailable
            if (!variant) {
                $priceContainer
                    .addClass(this.classes.productUnavailable)
                    .attr('aria-hidden', true);
                return;
            }

            // On sale
            var quantity = parseInt($('[data-quantity-input]').val());
            if (variant.compare_at_price > variant.price) {
                $regularPrice.html(
                    theme.Currency.formatMoney(
                        variant.compare_at_price,
                        theme.moneyFormat
                    )
                );
                $salePrice.html(
                    theme.Currency.formatMoney(variant.price, theme.moneyFormat)
                );
                $('[data-total-price]').attr('data-price-value', variant.price)
                $('[data-total-price]').html(
                    theme.Currency.formatMoney(variant.price*quantity, theme.moneyFormat)
                );
                $priceContainer.addClass(this.classes.productOnSale);

                // label Sale
                $labelSale.show();
                $labelSale.html('-' + Math.floor(((variant.compare_at_price - variant.price)/variant.compare_at_price)*100) + '%' );
            } else {
                // Regular price
                $regularPrice.html(
                    theme.Currency.formatMoney(variant.price, theme.moneyFormat)
                );
                $salePrice.html("");
                $('[data-total-price]').attr('data-price-value', variant.price)
                $('[data-total-price]').html(
                    theme.Currency.formatMoney(variant.price*quantity, theme.moneyFormat)
                );
                $labelSale.hide();
            }

            if (checkNeedToConvertCurrency()) {
                Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
            }

            // Unit price
            // if (variant.unit_price) {
            //     $unitPrice.html(
            //         theme.Currency.formatMoney(variant.unit_price, theme.moneyFormat)
            //     );
            //     $unitPriceBaseUnit.html(this._getBaseUnit(variant));
            //     $priceContainer.addClass(this.classes.productUnitAvailable);
            // }
        },

        _getBaseUnit: function(variant) {
            return variant.unit_price_measurement.reference_value === 1
                ? variant.unit_price_measurement.reference_unit
                : variant.unit_price_measurement.reference_value +
                        variant.unit_price_measurement.reference_unit;
        },

        _updateSKU: function(evt) {
            var variant = evt.variant;

            // Update the sku
            $(this.selectors.SKU).html(variant.sku);
        },

        _setProductCarousel: function() {
            if (!$('.product-slider').length) {
                return
            }

            var $carousel_nav = $("#ProductSection-product-template .product_layout .product_photos .product-slider").find('.slider-nav'),
                $carousel_for = $("#ProductSection-product-template .product_layout .product_photos .product-slider").find('.slider-for'),
                $column = $carousel_nav.data('rows');

            if ($carousel_for.length) {
                $carousel_for.slick({
                    rows: 0,
                    fade: true,
                    arrows: false,
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    asNavFor: $carousel_nav,
                    adaptiveHeight:true
                });

                $carousel_nav.slick({
                    infinite: true,
                    slidesToShow: $column,
                    slidesToScroll: 1,
                    arrows: true,
                    rows: 0,
                    focusOnSelect: true,
                    asNavFor: $carousel_for,
                    prevArrow: '<div class="slick-prev slick-arrow"><svg class="icon"><use xlink:href="#icon-chevron-left"></svg></div>',
                    nextArrow: '<div class="slick-next slick-arrow"><svg class="icon"><use xlink:href="#icon-chevron-right"></svg></div>',
                    responsive: [
                        {
                            breakpoint: 992,
                            settings: {
                                slidesToShow: 4,
                                slidesToScroll: 1
                            }
                        },
                        {
                            breakpoint: 550,
                            settings: {
                                slidesToShow: 3,
                                slidesToScroll: 1
                            }
                        }
                    ]
                });
            }

            if($(this.selectors.productChangeGroupImage).length) {
                var $inputChecked = $(this.selectors.productChangeGroupImage).find('.swatch-element.color :radio:checked');
                if ($(this.selectors.productChangeGroupImage, this.$container).find('.product_shop .swatch-element.color').length) {
                    if($inputChecked.length) {
                        var className = $inputChecked.data('filter');

                        if(className !== undefined) {
                            $carousel_nav.slick('slickUnfilter');
                            $carousel_for.slick('slickUnfilter');

                            if($carousel_nav.find(className).length && $carousel_for.find(className).length) {
                                $carousel_nav.slick('slickFilter', className).slick('refresh');
                                $carousel_for.slick('slickFilter', className).slick('refresh');
                            }
                        };
                    };
                } else {
                    if ($inputChecked.length == 0) {
                        $inputChecked = $(this.selectors.productChangeGroupImage, this.$container).find('.product_shop .selector-wrapper.color .form-label');
                    }
                    if($inputChecked.length) {
                        var className = $inputChecked.data('filter');
                                    
                        if(className !== undefined) {
                            $carousel_nav.slick('slickUnfilter');
                            $carousel_for.slick('slickUnfilter');

                            if($carousel_nav.find(className).length && $carousel_for.find(className).length) {
                                $carousel_nav.slick('slickFilter', className).slick('refresh');
                                $carousel_for.slick('slickFilter', className).slick('refresh');
                            }
                        };
                    };
                    $(this.selectors.productChangeGroupImage, this.$container).find('.product_shop .selector-wrapper.color .single-option-selector').on('change', function() {
                        var $str_filter = ".filter-";
                        var $colorName = $(this).val().replace(/\s/g, '-').toLowerCase();
                        var className = $str_filter.concat($colorName);

                        if(className !== undefined) {
                            $carousel_nav.slick('slickUnfilter');
                            $carousel_for.slick('slickUnfilter');

                            if($carousel_nav.find(className).length && $carousel_for.find(className).length) {
                                $carousel_nav.slick('slickFilter', className).slick('refresh');
                                $carousel_for.slick('slickFilter', className).slick('refresh');
                            }
                        };

                        var $inputChecked = $('[data-change-group-image]').find('.product_shop .selector-wrapper.color option:selected');
                        var demo = $inputChecked.data('image-input');
                        $('.slider-nav .item').each(function(){
                            var demo_t = $(this).find('img').attr('src');
                            if (demo == demo_t) {
                                $('.product-single__thumbnail--product-template').removeClass('active-thumb');
                                $(this).trigger('click');
                            }
                        });
                    });
                }
            }
        },

        _initSoldOutProductShop: function() {

            var soldProduct = $('[data-soldOut-product]');

            if (soldProduct.length) {
                soldProduct.each(function () {
                    var self = $(this);

                    var items = self.data('items').toString().split(","),
                        hours = self.data('hours').toString().split(","),
                        i = Math.floor(Math.random() * items.length),
                        j = Math.floor(Math.random() * hours.length);

                    self.find('.items-count').text(items[i]);
                    self.find('.hours-num').text(hours[j]);
                });
            }
        },

        _initCustomerViewProductShop: function() {
            var customerView = $('[data-customer-view]');

            if (customerView.length) {
                customerView.each(function () {
                    var self = $(this);

                    setInterval(function () {
                        var views = self.data('customer-view').split(","),
                            i = Math.floor(Math.random() * views.length);

                        self.find('label').text(views[i]);
                    }, 5000);
                });
            }
        },

        _setShowmore_description: function() {
            if (!$('.description_showmore').length) {
                return
            }

            if ($(window).width() <= 767) {

                var $showmore = $('.showmore'),
                    $showless = $('.showless'),
                    $showmore_wrapper = $('.description_showmore').parent();

                $showmore_wrapper.css('max-height', 370);

                $showmore.on('click', function() {
                    $showmore_wrapper.css('max-height', 'none');
                    $showmore.removeClass('show').addClass('hide');
                    $showless.removeClass('hide').addClass('show');
                });

                $showless.on('click', function() {
                    $showmore_wrapper.css('max-height', 370);
                    $showless.removeClass('show').addClass('hide');
                    $showmore.removeClass('hide').addClass('show');
                });
            }
        },

        _initCountdown: function() {
            var countdownElm = $('.product-countdown[data-countdown]');
            countdownElm.each(function () {
                // Set the date we're counting down to
                if ($(this).hasClass('has-value')) {
                    return;
                }

                var self = $(this),
                    countDownDate = new Date( self.attr('data-countdown-value')).getTime();
                // Update the count down every 1 second
                var countdownfunction = setInterval(function() {

                    // Get todays date and time
                    var now = new Date().getTime();
            
                    // Find the distance between now an the count down date
                    var distance = countDownDate - now;
            
                    // If the count down is over, write some text 
                    if (distance < 0) {
                        clearInterval(countdownfunction);
                        document.getElementById("product-countdown").innerHTML = "";
                    } else {
                        // Time calculations for days, hours, minutes and seconds
                        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
                        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                        var seconds = Math.floor((distance % (1000 * 60)) / 1000);
                        
                        // days = this.$container.on( this._setShowDateFormat(days).bind(this));
                        // Output the result in an element with id="countDowntimer"
                        var strCountDown = "<span class='block-time'>"+ _setShowDateFormat(days) + "<span class='block-label'>days</span></span><span class='block-time'>"+ _setShowTime(hours) + "<span class='block-label'>hours</span></span><span class='block-time'>" + _setShowTime(minutes) + "<span class='block-label'>mins</span></span><span class='block-time'>" + _setShowTime(seconds) + "<span class='block-label'>secs</span></span>";
                        self.html(strCountDown);
                        self.addClass('has-value');
                    }
                }, 1000);
            });
        },

        _scrollToReview: function() {
            // if(!$('.product_template .product_shop .spr-badge').length) {
            //     return;
            // }

            $(document).on('click', '.product_template .product_shop .spr-badge', function(event) {
                event.preventDefault();
                if ($('.product_layout').length) {
                    var offset = $('.product-review__inner').offset();
                    
                }else {
                    if ($('.tab-pane-review').length) {
                        var offset = $('.productView-description').offset();
                        if ($(window).width() > 767) {
                            $('.tab_review .tab-title').trigger('click');
                            offset.top = offset.top - 70;
                        } else {
                            $('.tab-content .toggle-content.show').prev().find('.toggleLink').trigger('click');
                            $('.tab-pane-review .toggleLink').trigger('click');
                        }
                    }
                }
                $('body,html').animate({
                    scrollTop: offset.top - 70
                }, 1000);
            })
        },

        onUnload: function() {
            this.$container.off(this.settings.namespace);
        }
    });
    
    function checkNeedToConvertCurrency() {
        return (window.show_multiple_currencies && Currency.currentCurrency != shopCurrency) || window.show_auto_currency;
    }

    function _enableZoom(el) {
        var zoomUrl = $(el).data('zoom');
        $(el).zoom({
            url: zoomUrl,
            magnify: 1.5
        });
        // setTimeout(function(){
        // $(el).elevateZoom({
        //     // zoomType: "inner",
        //     // zoomType: "lens",
        //     scrollZoom: true,
        //     cursor: "crosshair"
        // });
        // }, 100);
    }

    function _destroyZoom(el) {
        $(el).trigger('zoom.destroy');
    }

    function _setShowTime(t){
        if(t < 10){
            return "<span class='num'>0</span><span class='num'>"+t+"</span>";
        }
        return "<span class='num'>"+parseInt(t/10)+"</span><span class='num'>"+(t%10)+"</span>";
    }

    function _setShowDateFormat(t){
        if(t < 10){
            return "<span class='num'>0</span><span class='num'>"+t+"</span>";
        }
        if(t > 100){
            return _setShowDateFormat(parseInt(t/10))+"<span class='num'>"+(t%10)+"</span>";
        }
        return "<span class='num'>"+parseInt(t/10)+"</span><span class='num'>"+(t%10)+"</span>";
    }

    return Product;
})();

theme.product_quickview = (function() {
    function product_quickview() {
        var $container = $('.product_quickview');
        var sectionId = $container.attr('data-section-id');

        this.settings = {
            mediaQueryMediumUp: 'screen and (min-width: 1025px)',
            mediaQuerySmall: 'screen and (max-width: 1024px)',
            bpSmall: false,
            enableHistoryState: $container.data('enable-history-state') || false,
            namespace: '.slideshow-' + sectionId,
            sectionId: sectionId,
            sliderActive: false,
            zoomEnabled: false
        };

        this.selectors = {
            addToCart: '[data-add-to-cart]',
            addToCartText: '[data-add-to-cart-text]',
            cartCount: '[data-cart-count]',
            cartCountBubble: '[data-cart-count-bubble]',
            cartPopup: '[data-cart-popup]',
            cartPopupCartQuantity: '[data-cart-popup-cart-quantity]',
            cartPopupClose: '[data-cart-popup-close]',
            cartPopupDismiss: '[data-cart-popup-dismiss]',
            cartPopupImage: '[data-cart-popup-image]',
            cartPopupImageWrapper: '[data-cart-popup-image-wrapper]',
            cartPopupImagePlaceholder: '[data-cart-popup-image-placeholder]',
            cartPopupProductDetails: '[data-cart-popup-product-details]',
            cartPopupQuantity: '[data-cart-popup-quantity]',
            cartPopupQuantityLabel: '[data-cart-popup-quantity-label]',
            cartPopupTitle: '[data-cart-popup-title]',
            cartPopupWrapper: '[data-cart-popup-wrapper]',
            labelSale: '[data-label-sale]',
            loader: '[data-loader]',
            loaderStatus: '[data-loader-status]',
            quantity: '[data-quantity-input]',
            SKU: '.variant-sku',
            productStatus: '[data-product-status]',
            originalSelectorId: '#ProductSelect-' + sectionId,
            productForm: '[data-product-form]',
            errorMessage: '[data-error-message]',
            errorMessageWrapper: '[data-error-message-wrapper]',
            productImageWraps: '.product-single__photo',
            productMainImageWraps: '.product-single__photo.number__1',
            productThumbImages: '.product-single__thumbnail--' + sectionId,
            productThumbs: '.product-single__thumbnails-' + sectionId,
            productThumbListItem: '.product-single__thumbnails-item',
            productFeaturedImage: '.product-featured-img',
            productThumbsWrapper: '.thumbnails-wrapper',
            saleLabel: '.product-price__sale-label-' + sectionId,
            singleOptionSelector: '.single-option-selector-' + sectionId,
            shopifyPaymentButton: '.shopify-payment-button',
            priceContainer: '[data-price-qv]',
            productChangeGroupImage: '[data-change-group-image]',
            productSwatch: '[data-filter]',

            regularPrice: '[data-regular-price-qv]',
            salePrice: '[data-sale-price-qv]',
            unitPrice: '[data-unit-price]',
            unitPriceBaseUnit: '[data-unit-price-base-unit]'
        };

        this.classes = {
            cartPopupWrapperHidden: 'cart-popup-wrapper--hidden',
            hidden: 'hide',
            inputError: 'input--error',
            productOnSale: 'price--on-sale',
            productUnitAvailable: 'price--unit-available',
            productUnavailable: 'price--unavailable',
            productFormErrorMessageWrapperHidden:
                'product-form__error-message-wrapper--hidden',
            activeClass: 'active-thumb'
        };

        this.$quantityInput = $(this.selectors.quantity, $container);
        this.$errorMessageWrapper = $(
            this.selectors.errorMessageWrapper,
            $container
        );
        this.$addToCart = $(this.selectors.addToCart, $container);
        this.$addToCartText = $(this.selectors.addToCartText, this.$addToCart);
        this.$loader = $(this.selectors.loader, this.$addToCart);
        this.$loaderStatus = $(this.selectors.loaderStatus, $container);
        this.$shopifyPaymentButton = $(
            this.selectors.shopifyPaymentButton,
            $container
        );

        // Stop parsing if we don't have the product json script tag when loading
        // section in the Theme Editor
        if (!$('#ProductJson-' + sectionId).html()) {
            return;
        }

        this.productSingleObject = JSON.parse(
            document.getElementById('ProductJson-' + sectionId).innerHTML
        );

        this.settings.zoomEnabled = $(this.selectors.productImageWraps).hasClass(
            'js-zoom-enabled'
        );

        _initBreakpoints();
        _stringOverrides();
        _initVariants();
        _initImageSwitch();
        _initAddToCart();
        // _next_prev_button();
        _setNumberQuantity();

        _setProductCarousel();
        _setActiveThumbnail();
        _initCountdown();
        _initSoldOutProductShop();
        _initCustomerViewProductShop();
        _addonSocial();

        if ($('.shopify-product-reviews-badge').length && $('.spr-badge').length) {
            return window.SPR.registerCallbacks(), window.SPR.initRatingHandler(), window.SPR.initDomEls(), window.SPR.loadProducts(), window.SPR.loadBadges();
        };
    }

    function checkNeedToConvertCurrency() {
        return (window.show_multiple_currencies && Currency.currentCurrency != shopCurrency) || window.show_auto_currency;
    }

    function _initQuickView() {
        var quickview = '[data-quickview]';
        $(document).on('click', quickview, function(evt) {
            evt.preventDefault();
            evt.stopPropagation();

            var href = $(this).attr('id');
            _doAjaxShowQuickView(href);
            if($('.page-product-detail').length){
                $('.page-product-detail #video_product .modal-body').find('#video-youtube').remove();
            }
        });
    }

    function _doAjaxShowQuickView(href) {
        $.ajax({
            type: "get",
            url: window.router + '/products/' + href + '?view=quickview',

            beforeSend: function () {
                _initShowLoading();
            },

            success: function (data) {
                var quickviewModal = $('#product_quickview'),
                    modalContent = quickviewModal.find('.product_template');

                modalContent.html(data);

                setTimeout(function () {
                    product_quickview()
                }, 1000);


                _initHideLoading();

                theme.wishlist.init();

                $('#product_quickview').modal('show');

                _setupQuickViewPopupEventListeners();
                if (checkNeedToConvertCurrency()) {
                    Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
                }
                if ($('.shopify-product-reviews-badge').length) {
                    return window.SPR.registerCallbacks(), window.SPR.initRatingHandler(), window.SPR.initDomEls(), window.SPR.loadProducts(), window.SPR.loadBadges();
                };
            }
        });
    }

    function _setupQuickViewPopupEventListeners() {
        $('#product_quickview').on(
            'keyup',
            function(event) {
                if (event.keyCode === slate.utils.keyboardKeys.ESCAPE) {
                    _hideQuickviewPopup();
                }
            }.bind(this)
        );

        $('#product_quickview .close-modal').on('click', _hideQuickviewPopup.bind(this));
        $('#product_quickview').on('click', function(event) {
            if ($(event.target).closest('#product_quickview .modal-quickview').length === 0) {
                _hideQuickviewPopup();
            }
        });

        $('#video_product').on('click', function(event) {
           
            if($('#video_product .popup-video #video-youtube').length){
                $('#video_product').modal('hide');
                $('#video-youtube').remove();
            }
        });

        $('.product_quickview .video-link').on('click', function(event) {
            var data_video = $(this).parent().data('video-qv');
            $('#video_product .popup-video').append(data_video);
        });

    }

    function _hideQuickviewPopup() {
        $('#product_quickview').modal('hide');

        setTimeout(function () {
            $('#product_quickview .product_template').html("");
        }, 500);
    }

    function _initShowLoading() {
        $('.loading-modal').show();
    }

    function _initHideLoading() {
        $('.loading-modal').hide();
    }

    function _setProductCarousel() {
        if (!$('.product_quickview .product-slider').length) {
            return
        }

        var $carousel_nav = $(".product_quickview .product-slider").find('.slider-nav'),
            $carousel_for = $(".product_quickview .product-slider").find('.slider-for'),
            $column = $carousel_nav.data('rows');

        if ($carousel_for.length) {
            $carousel_for.slick({
                fade: true,
                arrows: false,
                rows: 0,
                slidesToShow: 1,
                slidesToScroll: 1,
                asNavFor: $carousel_nav
            });
            $carousel_nav.slick({
                rows: 0,
                infinite: true,
                slidesToShow: $column,
                slidesToScroll: 1,
                arrows: true,
                focusOnSelect: true,
                asNavFor: $carousel_for,
                prevArrow: '<div class="slick-prev slick-arrow"><svg class="icon"><use xlink:href="#icon-chevron-left"></svg></div>',
                nextArrow: '<div class="slick-next slick-arrow"><svg class="icon"><use xlink:href="#icon-chevron-right"></svg></div>',
                responsive: [
                    {
                        breakpoint: 992,
                        settings: {
                            slidesToShow: 4,
                            slidesToScroll: 1
                        }
                    },
                    {
                        breakpoint: 550,
                        settings: {
                            slidesToShow: 3,
                            slidesToScroll: 1
                        }
                    }
                ]
            });
        }
       
        if($(this.selectors.productChangeGroupImage).length) {
            var $inputChecked = $(this.selectors.productChangeGroupImage).find('.swatch-element.color :radio:checked');
            if ($(this.selectors.productChangeGroupImage, this.$container).find('.product_shop .swatch-element.color').length) {
                if($inputChecked.length) {
                    var className = $inputChecked.data('filter');

                    if(className !== undefined) {
                        $carousel_nav.slick('slickUnfilter');
                        $carousel_for.slick('slickUnfilter');

                        if($carousel_nav.find(className).length && $carousel_for.find(className).length) {
                            $carousel_nav.slick('slickFilter', className).slick('refresh');
                            $carousel_for.slick('slickFilter', className).slick('refresh');
                        }
                    };
                };
            } else {
                if ($inputChecked.length == 0) {
                    $inputChecked = $(this.selectors.productChangeGroupImage, this.$container).find('.product_shop .selector-wrapper.color .form-label');
                }
                if($inputChecked.length) {
                    var className = $inputChecked.data('filter');
                                
                    if(className !== undefined) {
                        $carousel_nav.slick('slickUnfilter');
                        $carousel_for.slick('slickUnfilter');

                        if($carousel_nav.find(className).length && $carousel_for.find(className).length) {
                            $carousel_nav.slick('slickFilter', className).slick('refresh');
                            $carousel_for.slick('slickFilter', className).slick('refresh');
                        }
                    };
                };
                $(this.selectors.productChangeGroupImage, this.$container).find('.product_shop .selector-wrapper.color .single-option-selector').on('change', function() {
                    var $str_filter = ".filter-";
                    var $colorName = $(this).val().replace(/\s/g, '-').toLowerCase();
                    var className = $str_filter.concat($colorName);

                    if(className !== undefined) {
                        $carousel_nav.slick('slickUnfilter');
                        $carousel_for.slick('slickUnfilter');

                        if($carousel_nav.find(className).length && $carousel_for.find(className).length) {
                            $carousel_nav.slick('slickFilter', className).slick('refresh');
                            $carousel_for.slick('slickFilter', className).slick('refresh');
                        }
                    };

                    var $inputChecked = $('[data-change-group-image-qv]').find('.product_shop .selector-wrapper.color option:selected');
                    var demo = $inputChecked.data('image-input');
                    $('.slider-nav .item').each(function(){
                        var demo_t = $(this).find('img').attr('src');
                        if (demo == demo_t) {
                            $('.product-single__thumbnail--product-template').removeClass('active-thumb');
                            $(this).trigger('click');
                        }
                    });
                });
            }
        }
    }

    function _initCountdown() {
        var countdownElm = $('.product-countdown[data-countdown]');
        countdownElm.each(function () {
            // Set the date we're counting down to
            if ($(this).hasClass('has-value')) {
                return;
            }

            var self = $(this),
                countDownDate = new Date( self.attr('data-countdown-value')).getTime();
            // Update the count down every 1 second
            var countdownfunction = setInterval(function() {

                // Get todays date and time
                var now = new Date().getTime();
        
                // Find the distance between now an the count down date
                var distance = countDownDate - now;
        
                // If the count down is over, write some text 
                if (distance < 0) {
                    clearInterval(countdownfunction);
                    document.getElementById("product-countdown").innerHTML = "";
                } else {
                    // Time calculations for days, hours, minutes and seconds
                    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
                    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
                    
                    // days = this.$container.on( this._setShowDateFormat(days).bind(this));

                    // Output the result in an element with id="countDowntimer"
                    var strCountDown = "<span class='block-time'>"+ _setShowDateFormat(days) + "<span class='block-label'>days</span></span><span class='block-time'>"+ _setShowTime(hours) + "<span class='block-label'>hours</span></span><span class='block-time'>" + _setShowTime(minutes) + "<span class='block-label'>mins</span></span><span class='block-time'>" + _setShowTime(seconds) + "<span class='block-label'>secs</span></span>";
                    self.html(strCountDown);
                    self.addClass('has-value');
                }
            }, 1000);
        });
    }

    function _initSoldOutProductShop() {

        var soldProduct = $('[data-soldOut-product]');

        if (soldProduct.length) {
            soldProduct.each(function () {
                var self = $(this);

                var items = self.data('items').toString().split(","),
                    hours = self.data('hours').toString().split(","),
                    i = Math.floor(Math.random() * items.length),
                    j = Math.floor(Math.random() * hours.length);

                self.find('.items-count').text(items[i]);
                self.find('.hours-num').text(hours[j]);
            });
        }
    }

    function _initCustomerViewProductShop() {
        var customerView = $('[data-customer-view]');

        if (customerView.length) {
            customerView.each(function () {
                var self = $(this);

                setInterval(function () {
                    var views = self.data('customer-view').split(","),
                        i = Math.floor(Math.random() * views.length);

                    self.find('label').text(views[i]);
                }, 5000);
            });
        }
    }

    function _stringOverrides() {
        theme.productStrings = theme.productStrings || {};
        $.extend(theme.strings, theme.productStrings);
    }

    function _initBreakpoints() {
        var self = this;

        enquire.register(this.settings.mediaQuerySmall, {
            match: function() {

                // destroy image zooming if enabled
                if (self.settings.zoomEnabled) {
                    $(self.selectors.productImageWraps).each(function() {
                        _destroyZoom(this);
                    });
                }

                self.settings.bpSmall = true;
            },
            unmatch: function() {

                self.settings.bpSmall = false;
            }
        });

        enquire.register(this.settings.mediaQueryMediumUp, {
            match: function() {
                if (self.settings.zoomEnabled) {
                    $(self.selectors.productImageWraps).each(function() {
                        _enableZoom(this);
                    });
                }
            }
        });
    }

    function _initVariants() {
        var options = {
            $container: $('.product_quickview'),
            enableHistoryState:
                $('.product_quickview').data('enable-history-state') || false,
            singleOptionSelector: this.selectors.singleOptionSelector,
            originalSelectorId: this.selectors.originalSelectorId,
            product: this.productSingleObject
        };

        this.variants = new slate.Variants2(options);

        $('.product_quickview').on(
            'variantChange' + this.settings.namespace,
            _updateAvailability.bind(this)
        );
        $('.product_quickview').on(
            'variantImageChange' + this.settings.namespace,
            _updateImages.bind(this)
        );
        $('.product_quickview').on(
            'variantPriceChange' + this.settings.namespace,
            _updatePrice.bind(this)
        );
        $('.product_quickview').on(
            'variantSKUChange' + this.settings.namespace,
            _updateSKU.bind(this)
        );
    }

    function _initImageSwitch() {
        if (!$(this.selectors.productThumbImages).length) {
            return;
        }

        var self = this;

        $(this.selectors.productThumbImages)
            .on('click', function(evt) {
                evt.preventDefault();
                var $el = $(this);

                var imageId = $el.data('thumbnail-id');
                _switchImage(imageId);
                _setActiveThumbnail(imageId);

            })
            .on('keyup', _handleImageFocus.bind(self));
    }

    function _initAddToCart() {
        $(this.selectors.productForm, this.$container).on(
            'submit',
            function(evt) {
                evt.preventDefault();
                this.$previouslyFocusedElement = $(':focus');

                var isInvalidQuantity = this.$quantityInput.val() <= 0;

                if (this.$addToCart.is('[aria-disabled]')) return;

                if (isInvalidQuantity) {
                    this._showErrorMessage(theme.strings.quantityMinimumMessage);
                } else {
                    // disable the addToCart and dynamic checkout button while
                    // request/cart popup is loading and handle loading state
                    _handleButtonLoadingState(true);
                    var $data = $(this.selectors.productForm, this.$container);
                    _addItemToCart($data);
                }
            }.bind(this)
        );
    }

    function _addItemToCart(data) {
        var params = {
            url: window.router + '/cart/add.js',
            data: $(data).serialize(),
            dataType: 'json'
        };

        $.post(params)
            .done(
                function(item) {
                    _hideErrorMessage();
                    _setupCartPopup(item);
                    _updateTotalPrice();
                    _hideQuickviewPopup();
                    if($('.template-cart').length){
                        window.location.reload();
                    }
                }.bind(this)
            )
            .fail(
                function(response) {
                    this.$previouslyFocusedElement.focus();
                    _showErrorMessage(response.responseJSON.description);
                    _handleButtonLoadingState(false);
                }.bind(this)
            );
    }

    function _handleButtonLoadingState(isLoading) {
        if (isLoading) {
            this.$addToCart.attr('aria-disabled', true);
            this.$addToCartText.addClass(this.classes.hidden);
            this.$loader.removeClass(this.classes.hidden);
            this.$shopifyPaymentButton.attr('disabled', true);
            this.$loaderStatus.attr('aria-hidden', false);
        } else {
            this.$addToCart.removeAttr('aria-disabled');
            this.$addToCartText.removeClass(this.classes.hidden);
            this.$loader.addClass(this.classes.hidden);
            this.$shopifyPaymentButton.removeAttr('disabled');
            this.$loaderStatus.attr('aria-hidden', true);
        }
    }

    function _showErrorMessage(errorMessage) {
        $(this.selectors.errorMessage, this.$container).html(errorMessage);

        if (this.$quantityInput.length !== 0) {
            this.$quantityInput.addClass(this.classes.inputError);
        }

        this.$errorMessageWrapper
            .removeClass(this.classes.productFormErrorMessageWrapperHidden)
            .attr('aria-hidden', true)
            .removeAttr('aria-hidden');
    }

    function _hideErrorMessage() {
        this.$errorMessageWrapper.addClass(
            this.classes.productFormErrorMessageWrapperHidden
        );

        if (this.$quantityInput.length !== 0) {
            this.$quantityInput.removeClass(this.classes.inputError);
        }
    }

    function _updateTotalPrice() {
        if(!$('.navUser-action-total-price').length) {
            return;
        }
        Shopify.getCart(function (cart) {
            $('.navUser-action-total-price .total-price').html(theme.Currency.formatMoney(cart.total_price, theme.moneyFormat));
        });
    }

    function _setupCartPopup(item) {
        this.$cartPopup = this.$cartPopup || $(this.selectors.cartPopup);
        this.$cartPopupWrapper =
            this.$cartPopupWrapper || $(this.selectors.cartPopupWrapper);
        this.$cartPopupTitle =
            this.$cartPopupTitle || $(this.selectors.cartPopupTitle);
        this.$cartPopupQuantity =
            this.$cartPopupQuantity || $(this.selectors.cartPopupQuantity);
        this.$cartPopupQuantityLabel =
            this.$cartPopupQuantityLabel ||
            $(this.selectors.cartPopupQuantityLabel);
        this.$cartPopupClose =
            this.$cartPopupClose || $(this.selectors.cartPopupClose);
        this.$cartPopupDismiss =
            this.cartPopupDismiss || $(this.selectors.cartPopupDismiss);

        _setupCartPopupEventListeners();
        _updateCartPopupContent(item);
    }

    function _updateCartPopupContent(item) {
        var quantity = this.$quantityInput.length ? this.$quantityInput.val() : 1;

        this.$cartPopupTitle.text(item.product_title);
        this.$cartPopupQuantity.text(quantity);
        this.$cartPopupQuantityLabel.text(
            theme.strings.quantityLabel.replace('[count]', quantity)
        );

        _setCartPopupImage(item.image, item.title);
        _setCartPopupProductDetails(item.variant_options, item.properties);

        $.getJSON('/cart.js').then(
            function(cart) {
                _setCartQuantity(cart.item_count);
                _setCartCountBubble(cart.item_count);
                _showCartPopup();
            }.bind(this)
        );
    }

    function _setupCartPopupEventListeners() {
        this.$cartPopupWrapper.on(
            'keyup',
            function(event) {
                if (event.keyCode === slate.utils.keyboardKeys.ESCAPE) {
                    _hideCartPopup(event);
                }
            }.bind(this)
        );

        this.$cartPopupClose.on('click', _hideCartPopup.bind(this));
        this.$cartPopupDismiss.on('click', _hideCartPopup.bind(this));
        $('body').on('click', _onBodyClick.bind(this));
        setTimeout(function() {
            _hideCartPopup(true);
        }, 3000);
    }

    function _setCartPopupImage(imageUrl, productTitle) {
        this.$cartPopupImageWrapper =
            this.$cartPopupImageWrapper || $(this.selectors.cartPopupImageWrapper);

        this.$cartPopupImagePlaceholder =
            this.$cartPopupImagePlaceholder ||
            $(this.selectors.cartPopupImagePlaceholder);

        if (imageUrl === null) {
            this.$cartPopupImageWrapper.addClass(this.classes.hidden);
            return;
        }

        this.$cartPopupImageWrapper.removeClass(this.classes.hidden);
        var sizedImageUrl = theme.Images.getSizedImageUrl(imageUrl, '200x');
        var image = document.createElement('img');
        image.src = sizedImageUrl;
        image.alt = productTitle;
        image.dataset.cartPopupImage = '';

        image.onload = function() {
            this.$cartPopupImagePlaceholder.addClass(this.classes.hidden);
            this.$cartPopupImageWrapper.append(image);
        }.bind(this);
    }

    function _setCartPopupProductDetails(variantOptions, properties) {
        this.$cartPopupProductDetails =
            this.$cartPopupProductDetails ||
            $(this.selectors.cartPopupProductDetails);
        var variantPropertiesHTML = '';

        if (variantOptions[0] !== 'Default Title') {
            variantPropertiesHTML =
                variantPropertiesHTML + _getVariantOptionList(variantOptions);
        }

        if (properties !== null && Object.keys(properties).length !== 0) {
            variantPropertiesHTML =
                variantPropertiesHTML + _getPropertyList(properties);
        }

        if (variantPropertiesHTML.length === 0) {
            this.$cartPopupProductDetails.html('');
            this.$cartPopupProductDetails.attr('hidden', '');
        } else {
            this.$cartPopupProductDetails.html(variantPropertiesHTML);
            this.$cartPopupProductDetails.removeAttr('hidden');
        }
    }

    function _getVariantOptionList(variantOptions) {
        var variantOptionListHTML = '';

        variantOptions.forEach(function(variantOption) {
            variantOptionListHTML =
                variantOptionListHTML +
                '<li class="product-details__item product-details__item--variant-option">' +
                variantOption +
                '</li>';
        });

        return variantOptionListHTML;
    }

    function _getPropertyList(properties) {
        var propertyListHTML = '';
        var propertiesArray = Object.entries(properties);

        propertiesArray.forEach(function(property) {
            // Line item properties prefixed with an underscore are not to be displayed
            if (property[0].charAt(0) === '_') return;

            // if the property value has a length of 0 (empty), don't display it
            if (property[1].length === 0) return;

            propertyListHTML =
                propertyListHTML +
                '<li class="product-details__item product-details__item--property">' +
                '<span class="product-details__property-label">' +
                property[0] +
                ': </span>' +
                property[1];
            ': ' + '</li>';
        });

        return propertyListHTML;
    }

    function _setCartQuantity(quantity) {
        this.$cartPopupCartQuantity =
            this.$cartPopupCartQuantity || $(this.selectors.cartPopupCartQuantity);
        var ariaLabel;

        if (quantity === 1) {
            ariaLabel = theme.strings.oneCartCount;
        } else if (quantity > 1) {
            ariaLabel = theme.strings.otherCartCount.replace('[count]', quantity);
        }

        this.$cartPopupCartQuantity.text(quantity).attr('aria-label', ariaLabel);
    }

    function _setNumberQuantity() {
        var buttonSlt = '[data-qtt-qv]',
            buttonElm = $(buttonSlt);

        var input = $('#product_quickview [data-quantity-input]'),
            oldVal = 1,
            newVal = 1;
        if (checkNeedToConvertCurrency()) {
            Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
        }
        $(document).on('click', buttonSlt, function(e) {
            e.preventDefault();
            e.stopPropagation();
            var self = $(this);

            switch (true) {
                case (self.hasClass('plus')): {
                    newVal = oldVal + 1;
                    break;
                }
                case (self.hasClass('minus') && oldVal > 1): {
                    newVal = oldVal - 1;
                    break;
                }
            }
            oldVal = newVal;
            input.val(newVal).trigger('change');

            var $totalPrice = $('[data-total-price-qv]');
            var oldPrice = $('[data-total-price-qv]').attr('data-price-value');
            $totalPrice.html(
                theme.Currency.formatMoney(oldPrice*newVal, theme.moneyFormat)
            );

            if (checkNeedToConvertCurrency()) {
                Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
            }
        });
    }

    function _setCartCountBubble(quantity) {
        this.$cartCountBubble =
            this.$cartCountBubble || $(this.selectors.cartCountBubble);
        this.$cartCount = this.$cartCount || $(this.selectors.cartCount);

        this.$cartCountBubble.removeClass(this.classes.hidden);
        this.$cartCount.text(quantity);
    }

    function _showCartPopup() {
        this.$cartPopupWrapper
            .prepareTransition()
            .removeClass(this.classes.cartPopupWrapperHidden);
        _handleButtonLoadingState(false);

        slate.a11y.trapFocus({
            $container: this.$cartPopupWrapper,
            $elementToFocus: this.$cartPopup,
            namespace: 'cartPopupFocus'
        });
    }

    function _hideCartPopup(event) {
        var setFocus = event.detail === 0 ? true : false;
        this.$cartPopupWrapper
            .prepareTransition()
            .addClass(this.classes.cartPopupWrapperHidden);

        if($('.cart-popup-wrapper').hasClass('cart-popup-wrapper--hidden')){
            $('.cart-popup-wrapper').removeClass('is-transitioning');
        }

        $(this.selectors.cartPopupImage).remove();
        this.$cartPopupImagePlaceholder.removeClass(this.classes.hidden);

        slate.a11y.removeTrapFocus({
            $container: this.$cartPopupWrapper,
            namespace: 'cartPopupFocus'
        });

        if (setFocus) this.$previouslyFocusedElement[0].focus();

        this.$cartPopupWrapper.off('keyup');
        this.$cartPopupClose.off('click');
        this.$cartPopupDismiss.off('click');
        $('body').off('click');
    }

    function _onBodyClick(event) {
        var $target = $(event.target);

        if ( $target[0] !== this.$cartPopupWrapper[0] && !$target.parents(this.selectors.cartPopup).length ) {
            _hideCartPopup(event);
        }
    }

    function _addonSocial() {
        $.getScript("https://s7.addthis.com/js/300/addthis_widget.js#pubid=ra-595b0ea2fb9c5869")
        .done(function() {
            if(typeof addthis !== 'undefined') {
                addthis.init();
                addthis.layers.refresh();
            }
        })
    }

    function _setActiveThumbnail(imageId) {
        // If there is no element passed, find it by the current product image
        if (typeof imageId === 'undefined') {
            imageId = $(
                this.selectors.productImageWraps + ':not(.hide)',
                this.$container
            ).data('image-id');
        }

        var $thumbnailWrappers = $(
            this.selectors.productThumbListItem + ':not(.slick-cloned)',
            this.$container
        );

        var $activeThumbnail = $thumbnailWrappers.find(
            this.selectors.productThumbImages +
                "[data-thumbnail-id='" +
                imageId +
                "']"
        );

        $(this.selectors.productThumbImages)
            .removeClass(this.classes.activeClass)
            .removeAttr('aria-current');

        $activeThumbnail.addClass(this.classes.activeClass);
        $activeThumbnail.attr('aria-current', true);

        if (!$thumbnailWrappers.hasClass('slick-slide')) {
            return;
        }

        var slideIndex = $activeThumbnail.parent().data('slick-index');
        if (slideIndex == undefined) {
            slideIndex = 0;
        }
        if($(this.selectors.productThumbs).length){
           $(this.selectors.productThumbs).slick('slickGoTo', slideIndex);
        }
        
    }

    function _switchImage(imageId) {
        var $newImage = $(
            this.selectors.productImageWraps + "[data-image-id='" + imageId + "']",
            this.$container
        );
        var $otherImages = $(
            this.selectors.productImageWraps +
                ":not([data-image-id='" +
                imageId +
                "'])",
            this.$container
        );
        if ($('.product-slider').hasClass('custom')) {
            $newImage.removeClass(this.classes.hidden);
            $otherImages.addClass(this.classes.hidden);
        }
    }

    function _handleImageFocus(evt) {
        if (evt.keyCode !== slate.utils.keyboardKeys.ENTER) return;

        $(this.selectors.productFeaturedImage + ':visible').focus();
    }

    function _liveRegionText(variant) {
        // Dummy content for live region
        var liveRegionText =
            '[Availability] [Regular] [$$] [Sale] [$]. [UnitPrice] [$$$]';

        // Update availability
        
        if (!variant) {
            liveRegionText = theme.strings.unavailable;
            return liveRegionText;
        }

        var availability = variant.available ? '' : theme.strings.soldOut + ',';
        

        liveRegionText = liveRegionText.replace('[Availability]', availability);

        // Update pricing information
        var regularLabel = '';
        var regularPrice = theme.Currency.formatMoney(
            variant.price,
            theme.moneyFormat
        );
        var saleLabel = '';
        var salePrice = '';
        var unitLabel = '';
        var unitPrice = '';

        if (variant.compare_at_price > variant.price) {
            regularLabel = theme.strings.regularPrice;
            regularPrice =
                theme.Currency.formatMoney(
                    variant.compare_at_price,
                    theme.moneyFormat
                ) + ',';
            saleLabel = theme.strings.sale;
            salePrice = theme.Currency.formatMoney(
                variant.price,
                theme.moneyFormat
            );
        }

        if (variant.unit_price) {
            unitLabel = theme.strings.unitPrice;
            unitPrice =
                theme.Currency.formatMoney(variant.unit_price, theme.moneyFormat) +
                ' ' +
                theme.strings.unitPriceSeparator +
                ' ' +
                _getBaseUnit(variant);
        }

        liveRegionText = liveRegionText
            .replace('[Regular]', regularLabel)
            .replace('[$$]', regularPrice)
            .replace('[Sale]', saleLabel)
            .replace('[$]', salePrice)
            .replace('[UnitPrice]', unitLabel)
            .replace('[$$$]', unitPrice)
            .trim();

        return liveRegionText;
    }

    function _updateLiveRegion(evt) {
        var variant = evt.variant;
        var liveRegion = $('.product_quickview').querySelector(
            this.selectors.productStatus
        );
        liveRegion.textContent = _liveRegionText(variant);
        liveRegion.setAttribute('aria-hidden', false);

        // hide content from accessibility tree after announcement
        setTimeout(function() {
            liveRegion.setAttribute('aria-hidden', true);
        }, 1000);
    }

    function _updateAddToCart(evt) {
        var variant = evt.variant;

        if (variant) {
            if (variant.available) {
                this.$addToCart
                    .removeAttr('aria-disabled')
                    .attr('aria-label', theme.strings.addToCart);
                $(this.selectors.addToCartText, this.$container).text(
                    theme.strings.addToCart
                );
                this.$shopifyPaymentButton.show();
            } else {
                // The variant doesn't exist, disable submit button and change the text.
                // This may be an error or notice that a specific variant is not available.
                this.$addToCart
                    .attr('aria-disabled', true)
                    .attr('aria-label', theme.strings.soldOut);
                $(this.selectors.addToCartText, this.$container).text(
                    theme.strings.soldOut
                );
                this.$shopifyPaymentButton.hide();
            }
        } else {
            this.$addToCart
                .attr('aria-disabled', true)
                .attr('aria-label', theme.strings.unavailable);
            $(this.selectors.addToCartText, this.$container).text(
                theme.strings.unavailable
            );
            this.$shopifyPaymentButton.hide();
        }
    }

    function _updateAvailability(evt) {
        // remove error message if one is showing
        _hideErrorMessage();

        // update form submit
        _updateAddToCart(evt);

        // update live region
        // _updateLiveRegion(evt);

        _updatePrice(evt);
    }

    function _updateImages(evt) {
        var variant = evt.variant;
        var imageId = variant.featured_media.id;

        _switchImage(imageId);
        _setActiveThumbnail(imageId);
    }

    function _updatePrice(evt) {
        var variant = evt.variant;

        var $priceContainer = $(this.selectors.priceContainer, this.$container);
        var $regularPrice = $(this.selectors.regularPrice, $priceContainer);
        var $salePrice = $(this.selectors.salePrice, $priceContainer);
        var $unitPrice = $(this.selectors.unitPrice, $priceContainer);
        var $labelSale = $('.product_quickview').find(this.selectors.labelSale);
        var $unitPriceBaseUnit = $(
            this.selectors.unitPriceBaseUnit,
            $priceContainer
        );

        // Reset product price state
        $priceContainer
            .removeClass(this.classes.productUnavailable)
            .removeClass(this.classes.productOnSale)
            .removeClass(this.classes.productUnitAvailable)
            .removeAttr('aria-hidden');

        // Unavailable
        if (!variant) {
            $priceContainer
                .addClass(this.classes.productUnavailable)
                .attr('aria-hidden', true);
            return;
        }

        var quantity = parseInt($('.product_quickview [data-quantity-input]').val());
        if (variant.compare_at_price > variant.price) {
            $regularPrice.html(
                theme.Currency.formatMoney(
                    variant.compare_at_price,
                    theme.moneyFormat
                )
            );
            $salePrice.html(
                theme.Currency.formatMoney(variant.price, theme.moneyFormat)
            );
            $('[data-total-price-qv]').attr('data-price-value', variant.price)
            $('[data-total-price-qv]').html(
                theme.Currency.formatMoney(variant.price*quantity, theme.moneyFormat)
            );
            $priceContainer.addClass(this.classes.productOnSale);
            $labelSale.show();
            $labelSale.html('-' + Math.floor(((variant.compare_at_price - variant.price)/variant.compare_at_price)*100) + '%' );
        } else {
            // Regular price
            $regularPrice.html(
                theme.Currency.formatMoney(variant.price, theme.moneyFormat)
            );
            $salePrice.html("");
            $('[data-total-price-qv]').attr('data-price-value', variant.price)
            $('[data-total-price-qv]').html(
                theme.Currency.formatMoney(variant.price*quantity, theme.moneyFormat)
            );
            $labelSale.hide();
        }

        if (checkNeedToConvertCurrency()) {
            Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
        }

        // Unit price
        // if (variant.unit_price) {
        //     $unitPrice.html(
        //         theme.Currency.formatMoney(variant.unit_price, theme.moneyFormat)
        //     );
        //     $unitPriceBaseUnit.html(this._getBaseUnit(variant));
        //     $priceContainer.addClass(this.classes.productUnitAvailable);
        // }
    }

    function _getBaseUnit(variant) {
        return variant.unit_price_measurement.reference_value === 1
            ? variant.unit_price_measurement.reference_unit
            : variant.unit_price_measurement.reference_value +
                    variant.unit_price_measurement.reference_unit;
    }

    function _updateSKU(evt) {
        var variant = evt.variant;

        // Update the sku
        $(this.selectors.SKU).html(variant.sku);
    }

    function _enableZoom(el) {
        var zoomUrl = $(el).data('zoom');
        $(el).zoom({
            url: zoomUrl
        });
    }

    function _destroyZoom(el) {
        $(el).trigger('zoom.destroy');
    }

    function _setShowTime(t){
        if(t < 10){
            return "<span class='num'>0</span><span class='num'>"+t+"</span>";
        }
        return "<span class='num'>"+parseInt(t/10)+"</span><span class='num'>"+(t%10)+"</span>";
    }

    function _setShowDateFormat(t){
        if(t < 10){
            return "<span class='num'>0</span><span class='num'>"+t+"</span>";
        }
        if(t > 100){
            return _setShowDateFormat(parseInt(t/10))+"<span class='num'>"+(t%10)+"</span>";
        }
        return "<span class='num'>"+parseInt(t/10)+"</span><span class='num'>"+(t%10)+"</span>";
    }

    return {
        init: function() {
            _initQuickView();
        }
    }
})();

theme.product_card =(function() {
    function _initAddToCart_quick() {
        this.selectors = {
            cartCount: '[data-cart-count]',
            cartCountBubble: '[data-cart-count-bubble]',
            cartPopup: '[data-cart-popup]',
            cartPopupCartQuantity: '[data-cart-popup-cart-quantity]',
            cartPopupClose: '[data-cart-popup-close]',
            cartPopupDismiss: '[data-cart-popup-dismiss]',
            cartPopupImage: '[data-cart-popup-image]',
            cartPopupImageWrapper: '[data-cart-popup-image-wrapper]',
            cartPopupImagePlaceholder: '[data-cart-popup-image-placeholder]',
            cartPopupProductDetails: '[data-cart-popup-product-details]',
            cartPopupQuantity: '[data-cart-popup-quantity]',
            cartPopupQuantityLabel: '[data-cart-popup-quantity-label]',
            cartPopupTitle: '[data-cart-popup-title]',
            cartPopupWrapper: '[data-cart-popup-wrapper]',
            errorMessage: '.product-card__error-message'
        };

        this.classes = {
            cartPopupWrapperHidden: 'cart-popup-wrapper--hidden',
            productFormErrorMessageWrapperHidden:
                'product-form__error-message-wrapper--hidden',
            hidden: 'hide'
        };


        var addToCart_quick = '[data-btn-addToCart]';
        $(document).on('click', addToCart_quick, function(event) {
            event.preventDefault();
            event.stopPropagation();
            var self = $(this),
                thisForm = $(self.data('form-id')),
                $data = thisForm.serialize();

            var params = {
                url: '/cart/add.js',
                data: $data,
                dataType: 'json'
            };

            var $product = self.parents('.product-card');

            $.post(params)
                .done(
                    function(item) {
                        _setupCartPopup(item);
                        if($('.template-cart').length){
                            window.location.reload();
                        }
                    }.bind(this)
                )
                .fail(
                    function(response) {
                      _showErrorMessage(response.responseJSON.description, $product);
                    }.bind(this)
                );
        })
    }

    function _showErrorMessage(errorMessage, $product) {
        $('.product-card__error-message .product-form__error-message', $product).html(errorMessage);
        $('.product-card__error-message', $product).removeClass('product-form__error-message-wrapper--hidden');
    }

    function _setupCartPopup(item) {
        this.$cartPopup = this.$cartPopup || $(this.selectors.cartPopup);
        this.$cartPopupWrapper =
            this.$cartPopupWrapper || $(this.selectors.cartPopupWrapper);
        this.$cartPopupTitle =
            this.$cartPopupTitle || $(this.selectors.cartPopupTitle);
        this.$cartPopupQuantity =
            this.$cartPopupQuantity || $(this.selectors.cartPopupQuantity);
        this.$cartPopupQuantityLabel =
            this.$cartPopupQuantityLabel || $(this.selectors.cartPopupQuantityLabel);
        this.$cartPopupClose =
            this.$cartPopupClose || $(this.selectors.cartPopupClose);
        this.$cartPopupDismiss =
            this.cartPopupDismiss || $(this.selectors.cartPopupDismiss);

        _setupCartPopupEventListeners();

        _updateCartPopupContent(item);
    }

    function _updateCartPopupContent(item) {
        var quantity = 1;

        this.$cartPopupTitle.text(item.product_title);
        this.$cartPopupQuantity.text(quantity);
        this.$cartPopupQuantityLabel.text(
            theme.strings.quantityLabel.replace('[count]', quantity)
        );

        _setCartPopupImage(item.image, item.title);
        _setCartPopupProductDetails(item.properties);

        $.getJSON('/cart.js').then(
            function(cart) {
                _setCartQuantity(cart.item_count);
                _setCartCountBubble(cart.item_count);
                _showCartPopup();
            }.bind(this)
        );
    }

    function _setupCartPopupEventListeners() {
        this.$cartPopupWrapper.on(
            'keyup',
            function(event) {
                if (event.keyCode === slate.utils.keyboardKeys.ESCAPE) {
                    this._hideCartPopup(event);
                }
            }.bind(this)
        );

        this.$cartPopupClose.on('click', _hideCartPopup.bind(this));
        this.$cartPopupDismiss.on('click', _hideCartPopup.bind(this));
        $('body').on('click', _onBodyClick.bind(this));
        setTimeout(function() {
            _hideCartPopup(true);
        }, 3000);
    }

    function _setCartPopupImage(imageUrl, productTitle) {
        this.$cartPopupImageWrapper =
            this.$cartPopupImageWrapper || $(this.selectors.cartPopupImageWrapper);

        this.$cartPopupImagePlaceholder =
            this.$cartPopupImagePlaceholder ||
            $(this.selectors.cartPopupImagePlaceholder);

        if (imageUrl === null) {
            this.$cartPopupImageWrapper.addClass(this.classes.hidden);
            return;
        }

        this.$cartPopupImageWrapper.removeClass(this.classes.hidden);
        var sizedImageUrl = theme.Images.getSizedImageUrl(imageUrl, '200x');
        var image = document.createElement('img');
        image.src = sizedImageUrl;
        image.alt = productTitle;
        image.dataset.cartPopupImage = '';

        image.onload = function() {
            this.$cartPopupImagePlaceholder.addClass(this.classes.hidden);
            this.$cartPopupImageWrapper.append(image);
        }.bind(this);
    }

    function _setCartPopupProductDetails(properties) {
        this.$cartPopupProductDetails =
            this.$cartPopupProductDetails ||
            $(this.selectors.cartPopupProductDetails);
        var variantPropertiesHTML = '';

        if (properties !== null && Object.keys(properties).length !== 0) {
            variantPropertiesHTML =
                variantPropertiesHTML + _getPropertyList(properties);
        }

        if (variantPropertiesHTML.length === 0) {
            this.$cartPopupProductDetails.html('');
            this.$cartPopupProductDetails.attr('hidden', '');
        } else {
            this.$cartPopupProductDetails.html(variantPropertiesHTML);
            this.$cartPopupProductDetails.removeAttr('hidden');
        }
    }

    function _getPropertyList(properties) {
        var propertyListHTML = '';
        var propertiesArray = Object.entries(properties);

        propertiesArray.forEach(function(property) {
            // Line item properties prefixed with an underscore are not to be displayed
            if (property[0].charAt(0) === '_') return;

            // if the property value has a length of 0 (empty), don't display it
            if (property[1].length === 0) return;

            propertyListHTML =
                propertyListHTML +
                '<li class="product-details__item product-details__item--property">' +
                '<span class="product-details__property-label">' +
                property[0] +
                ': </span>' +
                property[1];
            ': ' + '</li>';
        });

        return propertyListHTML;
    }

    function _setCartQuantity(quantity) {
        this.$cartPopupCartQuantity =
            this.$cartPopupCartQuantity || $(this.selectors.cartPopupCartQuantity);
        var ariaLabel;

        if (quantity === 1) {
            ariaLabel = theme.strings.oneCartCount;
        } else if (quantity > 1) {
            ariaLabel = theme.strings.otherCartCount.replace('[count]', quantity);
        }

        this.$cartPopupCartQuantity.text(quantity).attr('aria-label', ariaLabel);
    }

    function _setCartCountBubble(quantity) {
        this.$cartCountBubble =
            this.$cartCountBubble || $(this.selectors.cartCountBubble);
        this.$cartCount = this.$cartCount || $(this.selectors.cartCount);

        this.$cartCountBubble.removeClass(this.classes.hidden);
        this.$cartCount.text(quantity);
    }

    function _showCartPopup() {
        this.$cartPopupWrapper
            .prepareTransition()
            .removeClass(this.classes.cartPopupWrapperHidden);

        slate.a11y.trapFocus({
            $container: this.$cartPopupWrapper,
            $elementToFocus: this.$cartPopup,
            namespace: 'cartPopupFocus'
        });
    }

    function _hideCartPopup(event) {
        var setFocus = event.detail === 0 ? true : false;
        this.$cartPopupWrapper
            .prepareTransition()
            .addClass(this.classes.cartPopupWrapperHidden);

        if($('.cart-popup-wrapper').hasClass('cart-popup-wrapper--hidden')){
            $('.cart-popup-wrapper').removeClass('is-transitioning');
        }

        $(this.selectors.cartPopupImage).remove();
        this.$cartPopupImagePlaceholder.removeClass(this.classes.hidden);

        slate.a11y.removeTrapFocus({
            $container: this.$cartPopupWrapper,
            namespace: 'cartPopupFocus'
        });

        if (setFocus) this.$previouslyFocusedElement[0].focus();

        this.$cartPopupWrapper.off('keyup');
        this.$cartPopupClose.off('click');
        this.$cartPopupDismiss.off('click');
        $('body').off('click');
    }

    function _onBodyClick(event) {
        var $target = $(event.target);

        if ( $target[0] !== this.$cartPopupWrapper[0] && !$target.parents(this.selectors.cartPopup).length ) {
            _hideCartPopup(event);
        }
    }

    return {
        init: function() {
            _initAddToCart_quick();
        }
    }
})();

theme.product_sticky_atc = (function(){

    function showHideVariantsOptions() {
        var blockSticky = $('[data-sticky-add-to-cart]'),
            sltVariantActive = blockSticky.find('.pr-active'),
            variantElm = blockSticky.find('.pr-swatch');

        sltVariantActive.off('click.showListVariant').on('click.showListVariant', function(e) {
            e.preventDefault();

            blockSticky.toggleClass('open-sticky');
        }); 

        $(document).off('click.hideVariantsOption').on('click.hideVariantsOption', function(e) {
            if (!sltVariantActive.is(e.target) && sltVariantActive.has(e.target).length === 0){
                blockSticky.removeClass('open-sticky');
            };
        })
    };

    function handleActiveVariant() {
        var blockSticky = $('[data-sticky-add-to-cart]'),
            sltVariantActive = blockSticky.find('.pr-active'),
            variantElm = blockSticky.find('.pr-swatch');

        variantElm.on('click', function(e) {

            var self = $(this),
                text = self.text(),
                value = self.data('value'),
                title = self.data('title'),
                newImage = self.data('img'),
                option1 = self.data('option1');
                option2 = self.data('option2');
                option3 = self.data('option3');

            variantElm.removeClass('active');
            self.addClass('active');
            blockSticky.toggleClass('open-sticky');

            blockSticky.find('.action-wrapper input[type=hidden]').val(value);
            sltVariantActive.attr('data-value', value).text(text);

            if(self.hasClass('sold-out')) {
                blockSticky.find('.btn-sticky-add-to-cart').val(theme.strings.soldOut).addClass('disabled').attr('disabled', 'disabled');
            }
            else {
                blockSticky.find('.btn-sticky-add-to-cart').removeClass('disabled').removeAttr('disabled').val(theme.strings.addToCart);
            }

            $('.sticky-add-to-cart .product-on-cart .product-image img').attr({ src: newImage });

            if ($('.selector-wrapper-1').hasClass('swatch')) {
                $('#ProductSection-product-template .selector-wrapper-1 .single-option-selector-product-template[value="'+option1+'"]').click();
                $('#ProductSection-product-template .selector-wrapper-2 .single-option-selector-product-template[value="'+option2+'"]').click();
                $('#ProductSection-product-template .selector-wrapper-3 .single-option-selector-product-template[value="'+option3+'"]').click();
            }
            else {
                $('#ProductSection-product-template .selector-wrapper-1 .single-option-selector-product-template').val(option1).change();
                $('#ProductSection-product-template .selector-wrapper-2 .single-option-selector-product-template').val(option2).change();
                $('#ProductSection-product-template .selector-wrapper-3 .single-option-selector-product-template').val(option3).change();
            }       

            return false;
        });
    };

    function stickyAddToCart() {
        $(document).on('click', '[data-sticky-btn-addToCart]', function(e) {
            e.preventDefault();

            if($('[data-product-form] [data-add-to-cart]').length) {
                $('[data-product-form] [data-add-to-cart]').click();     
            }
        });
    };

    function activeVariantSelected() {
        var blockSticky = $('[data-sticky-add-to-cart]'),
            sltVariantActive = blockSticky.find('.pr-active'),
            variantElm = blockSticky.find('.pr-swatch');

        var optionSelected = $('.product-form__variants option:selected'),
            value = optionSelected.val(),
            stickyActive = blockSticky.find('.pr-swatch[data-value="'+value+'"]'),
            stickyText = stickyActive.html();

        sltVariantActive.html(stickyText);
        stickyActive.addClass('active');

        var str = stickyActive.data('img');

        $('.sticky-add-to-cart .product-on-cart .product-image img').attr({ src: str });


        $('.selector-wrapper').change(function() {
            var n = $('.product-form__variants').val(),
                image;

            $('.sticky_form .pr-selectors li').each(function(e) {
                var t = $(this).find('a').data('value');

                if(t == n){
                    $(this).find('a').addClass('active')
                    image = $(this).find('a').data('img');
                } else{
                    $(this).find('a').removeClass('active')
                }
            });

            if (image != null) {
                $('.sticky-add-to-cart .product-on-cart .product-image img').attr({ src: image });
            }

            if(variantElm.hasClass('active')) {
                var h = $('.sticky_form .pr-swatch.active').html();

                $('.sticky_form .action input[type=hidden]').val(n);
                sltVariantActive.html(h);
                sltVariantActive.attr('data-value', n);

            };
        });
    };

    function ShowSickyAtc() {
        if (!$('[data-sticky-add-to-cart]').length) {
            return
        }

        var offSetTop = $('[data-add-to-cart]').offset().top + $('[data-add-to-cart]').height();

        $(window).scroll(function () {
            var scrollTop = $(this).scrollTop();

            if (scrollTop > offSetTop) {
                $('body').addClass('show_sticky');
            }
            else {
                $('body').removeClass('show_sticky');
            }
        }); 
    }

    return {
        init: function() {
            activeVariantSelected();
            showHideVariantsOptions();
            handleActiveVariant();
            stickyAddToCart();
            ShowSickyAtc();
        }
    }
})();

theme.products_frequently_by_together = (function() {

    var btnAddToCartSlt = '[data-bundle-addToCart]',
        bundleImagesSlide = $('[data-bundle-images-slider]'),
        btnToggleOptionsSlt = '.fbt-toogle-options',
        bundlePrice = $('.products-grouped-action .bundle-price'),
        carousel = $('.products-grouped-info[data-slick]'),
        bundleCheckbox = '.fbt-checkbox label',
        bundleCheckbox2 = '.fbt-checkbox input',
        $bundleContainer = $('.frequently-bought-together-block'),
        cartCount = $('[data-cart-count]'),
        cartCountBubble = $('[data-cart-count-bubble]'),
        cartPopup = $('[data-cart-popup-frequently]'),
        cartPopupCartQuantity = $('[data-cart-popup-cart-quantity]'),
        cartPopupClose = $('[data-cart-popup-close-frequently]'),
        cartPopupDismiss = $('[data-cart-popup-dismiss-frequently]'),
        cartPopupImage = $('[data-cart-popup-image]'),
        cartPopupImageWrapper = $('[data-cart-popup-image-wrapper]'),
        cartPopupImagePlaceholder = $('[data-cart-popup-image-placeholder]'),
        cartPopupProductDetails = $('[data-cart-popup-product-details]'),
        cartPopupQuantity = $('[data-cart-popup-quantity]'),
        cartPopupQuantityLabel = $('[data-cart-popup-quantity-label]'),
        cartPopupTitle = $('[data-cart-popup-title]'),
        cartPopupWrapper = $('[data-cart-popup-frequently-wrapper]');

    var $addToCart = $('[data-bundle-addtocart]', $bundleContainer);
    var $addToCartText = $('[data-add-to-cart-text]', $bundleContainer);
    var classes = {
            cartPopupWrapperHidden: 'cart-popup-wrapper--hidden',
            hidden: 'hide',
            inputError: 'input--error',
            productOnSale: 'price--on-sale',
            productUnitAvailable: 'price--unit-available',
            productUnavailable: 'price--unavailable',
            productFormErrorMessageWrapperHidden:
                'product-form__error-message-wrapper--hidden',
            activeClass: 'active-thumb'
        };
    var $errorMessageWrapper = $('[data-error-message-wrapper]', $bundleContainer);
    var $loader = $('[data-loader]', $addToCart);
    var $loaderStatus = $('[data-loader-status]', $bundleContainer);

    function checkNeedToConvertCurrency() {
        return (window.show_multiple_currencies && Currency.currentCurrency != shopCurrency) || window.show_auto_currency;
    }

    function bundleSlider() {
        if (!carousel.length) {
            return
        }
        if (!carousel.hasClass('slick-slider')) {
            carousel.slick();
        }
    };

    function toggleVariantOptions() {
        $(document).on('click', btnToggleOptionsSlt, function(e) {
            e.preventDefault();
            $(this).parents('.product-content').next().slideToggle();
        })

        $(document).on('click', '.close-options', function(e) {
            e.preventDefault();
            $(this).parent().slideToggle();
        })
    };

    function replaceDiscountRate(){
        if(bundlePrice.length > 0){
            var discountRate = bundlePrice.data('discount-rate')*100;
            var discountText = $('.products-grouped-action .discount-text');
            if(discountText.length > 0){
                discountText.each(function(){
                    $(this).text($(this).text().replace('[discount]',discountRate));
                })
            }

        }
    };

    function handleCheckedProduct() {

        $(document).on('click', bundleCheckbox, function(e) {
            e.preventDefault();

            var self = $(this),
                ipt = self.prev(),
                dataId = self.closest('.fbt-item').data('bundle-product-id');

            if(!ipt.prop('checked')) {
                ipt.prop('checked', true);
                $('[data-bundle-product-id="'+ dataId +'"]').addClass('isChecked');
            } else {
                ipt.prop('checked', false);

                $('[data-bundle-product-id="'+ dataId +'"]').removeClass('isChecked');
            };
            updateTotalPrice();
        })
    };

    function updateTotalPrice() {
        var bundleProItem = $bundleContainer.find('.fbt-item.isChecked');
        var bundlePrice = $('.products-grouped-action .bundle-price');
        var oldPrice = $('.products-grouped-action .old-price');
        var regularPrice = $('.products-grouped-action .price-item--regular.price');
        var discountRate = bundlePrice.data('discount-rate');
        var totalPrice = 0;
        var checkedProductLength = $('.fbt-item.isChecked').length;
        var maxProduct = $('.fbt-item').length;

        bundleProItem.each(function() {
            var price = parseFloat($(this).find('[data-fbt-price-change]').attr('data-price'));

            if(price) {
                totalPrice += price;
            };
        });
        
      
        if($(bundleCheckbox).length == bundleProItem.length){
            window.bundleMatch = true;
            oldPrice.html(theme.Currency.formatMoney(totalPrice, theme.moneyFormat)).show();
            bundlePrice.html(theme.Currency.formatMoney(totalPrice*(1 - discountRate), theme.moneyFormat));
        } else {
            window.bundleMatch = false;
            oldPrice.html('').hide();
            bundlePrice.html(theme.Currency.formatMoney(totalPrice, theme.moneyFormat));
        }

        if (checkNeedToConvertCurrency()) {
            Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
        }
    };
  
    /*============================*/
  
    function _getCurrentOptionsFBT(productId) {
        var $bundle_product = $bundleContainer.find('[data-bundle-product-id="'+productId+'"]');
      
        var currentOptions = _.map(
            $('.single-option-selector-frequently', $bundle_product),
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
    }
  
    function _getVariantFromOptionsFBT(productId){
        var check_swatch_option = false;
        var $bundle_product = $bundleContainer.find('[data-bundle-product-id="'+productId+'"]');
        if ($bundle_product.find('.fbt-selector-wrapper-1').hasClass('swatch')) {
            check_swatch_option = true;
        }

        var selectedValues = _getCurrentOptionsFBT(productId);
        var variants = window.productVariants[productId];
        var selectedOption1;
        var selectedOption2;
        var selectedOption3;
        
        var found = _.find(variants, function(variant) {
            return selectedValues.every(function(values) {
                return _.isEqual(variant[values.index], values.value);
            });
        });

        if (found == undefined || found.available == false) {
            if (check_swatch_option == true) {
                selectedOption1 = $bundle_product.find('.fbt-selector-wrapper-1 input:checked').val();
                selectedOption2 = $bundle_product.find('.fbt-selector-wrapper-2 input:checked').val();
                selectedOption3 = $bundle_product.find('.fbt-selector-wrapper-3 input:checked').val();
                $bundle_product.find('.fbt-selector-wrapper-3 .swatch-element').each(function(){
                    var swatchVal = $(this).data('value');
                    console.log(swatchVal);
                    var optionSoldout = variants.find(function(variant){
                        return variant.option1 == selectedOption1 && variant.option2 == selectedOption2 && variant.option3 == swatchVal && variant.available;
                    });

                    if(optionSoldout == undefined){
                        $(this).addClass('soldout');
                        $(this).find(':radio').prop('disabled',true);
                    } else {
                        $(this).removeClass('soldout');
                        $(this).find(':radio').prop('disabled',false);
                        $(this).find(':radio').prop('checked',true);
                    }
                });

                selectedValues = _getCurrentOptionsFBT(productId);
                found = _.find(variants, function(variant) {
                    return selectedValues.every(function(values) {
                        return _.isEqual(variant[values.index], values.value);
                    });
                });

                if (found == undefined || found.available == false) {
                    $bundle_product.find('.fbt-selector-wrapper-3 .swatch-element').each(function(){
                        var swatchVal = $(this).data('value');
                        var optionSoldout = variants.find(function(variant){
                            return variant.option1 == selectedOption1 && variant.option3 == swatchVal && variant.available;
                        });

                        if(optionSoldout == undefined){
                            $(this).addClass('soldout');
                            $(this).find(':radio').prop('disabled',true);
                        } else {
                            $(this).removeClass('soldout');
                            $(this).find(':radio').prop('disabled',false);
                            $(this).find(':radio').prop('checked',true);
                        }
                    });

                    selectedOption3 = $bundle_product.find('.fbt-selector-wrapper-3 input:checked').val();

                    $bundle_product.find('.fbt-selector-wrapper-2 .swatch-element').each(function(){
                        var swatchVal = $(this).data('value');
                        var optionSoldout = variants.find(function(variant){
                            return variant.option1 == selectedOption1 && variant.option3 == selectedOption3 && variant.option2 == swatchVal && variant.available;
                        });

                        if(optionSoldout == undefined){
                            $(this).addClass('soldout');
                            $(this).find(':radio').prop('disabled',true);
                        } else {
                            $(this).removeClass('soldout');
                            $(this).find(':radio').prop('disabled',false);
                            $(this).find(':radio').prop('checked',true);
                        } 
                    });

                    selectedValues = _getCurrentOptionsFBT(productId);
                    found = _.find(variants, function(variant) {
                        return selectedValues.every(function(values) {
                            return _.isEqual(variant[values.index], values.value);
                        });
                    });
                }

            } else {
                selectedOption1 = $bundle_product.find('.fbt-selector-wrapper-1 option:selected').val();
                selectedOption2 = $bundle_product.find('.fbt-selector-wrapper-2 option:selected').val();
                selectedOption3 = $bundle_product.find('.fbt-selector-wrapper-3 option:selected').val();

                $('.fbt-selector-wrapper-3 .single-option-selector option', this.$container).each(function(){
                    var swatchVal = $(this).val();
                    var optionSoldout = variants.find(function(variant){
                        return variant.option1 == selectedOption1 && variant.option2 == selectedOption2 && variant.option3 == swatchVal && variant.available;
                    });

                    if(optionSoldout == undefined){
                        $(this).attr('disabled','disabled').removeAttr('selected','selected').prop('selected', false);
                    } else {
                        $(this).removeAttr('disabled','disabled').attr('selected','selected').prop('selected', true);
                        $('.label-value-3', this.$container).html(optionSoldout.option3);
                    }
                })

                selectedValues = _getCurrentOptionsFBT(productId);
                found = _.find(variants, function(variant) {
                    return selectedValues.every(function(values) {
                        return _.isEqual(variant[values.index], values.value);
                    });
                });

                if (found == undefined || found.available == false) {

                    $('.fbt-selector-wrapper-3 .single-option-selector option', this.$container).each(function(){
                        var swatchVal = $(this).val();
                        var optionSoldout = variants.find(function(variant){
                            return variant.option1 == selectedOption1 && variant.option3 == swatchVal && variant.available;
                        });

                        if(optionSoldout == undefined){
                            $(this).attr('disabled','disabled').removeAttr('selected','selected').prop('selected', false);
                        } else {
                            $(this).removeAttr('disabled','disabled').attr('selected','selected').prop('selected', true);
                            $('.label-value-3', this.$container).html(optionSoldout.option3);
                        }
                    })

                    selectedOption3 = $('.fbt-selector-wrapper-3', this.$container).find('option:selected').val();


                    $('.fbt-selector-wrapper-2 .single-option-selector option', this.$container).each(function(){
                        var swatchVal = $(this).val();
                        var optionSoldout = variants.find(function(variant){
                            return variant.option1 == selectedOption1 && variant.option3 == selectedOption3 && variant.option2 == swatchVal && variant.available;
                        });

                        if(optionSoldout == undefined){
                            $(this).attr('disabled','disabled').removeAttr('selected','selected').prop('selected', false);
                        } else {
                            $(this).removeAttr('disabled','disabled').attr('selected','selected').prop('selected', true);
                            $('.label-value-2', this.$container).html(optionSoldout.option2);
                        }
                    })

                    selectedValues = _getCurrentOptionsFBT(productId);
                    found = _.find(variants, function(variant) {
                        return selectedValues.every(function(values) {
                            return _.isEqual(variant[values.index], values.value);
                        });
                    });
                }
            }
        }

        return found;
    }

    function _firstupdateVariantFBT(){
        var $bundle_product_list = $bundleContainer.find('[data-bundle-product-id]');     
        $bundle_product_list.each(function() {
            var productId = $(this).data('bundle-product-id');
            var $bundle_product = $bundleContainer.find('[data-bundle-product-id="'+productId+'"]');
            var check_swatch_option = false;
            if ($bundle_product.find('.fbt-selector-wrapper-1').hasClass('swatch')) {
                check_swatch_option = true;
            }

            if (check_swatch_option == true) {
                var variants = window.productVariants[productId];
                var options = $bundle_product.find('.selector-wrapper');
                var selectedOption1 = $bundle_product.find('.fbt-selector-wrapper-1 input:checked').val();
                var selectedOption2 = $bundle_product.find('.fbt-selector-wrapper-2 input:checked').val();
                var selectedOption3 = $bundle_product.find('.fbt-selector-wrapper-3 input:checked').val();

                options.each(function(){
                    var optionIndex = $(this).data('option-index');
                    var swatch = $(this).find('.swatch-element');
                    switch (optionIndex) {
                        case 1:
                            swatch.each(function(){
                                var swatchVal = $(this).data('value');
                                var optionSoldout = variants.find(function(variant){
                                    return variant.option1 == swatchVal && variant.available;
                                });
                                if(optionSoldout == undefined){
                                    $(this).addClass('soldout');
                                    $(this).find(':radio').prop('disabled',true);
                                } else {
                                    $(this).removeClass('soldout');
                                    $(this).find(':radio').prop('disabled',false);
                                }
                            })
                            break;
                        case 2:
                            swatch.each(function(){
                                var swatchVal = $(this).data('value');
                                var optionSoldout = variants.find(function(variant){
                                    return variant.option1 == selectedOption1 && variant.option2 == swatchVal && variant.available;
                                });
                                if(optionSoldout == undefined){
                                    $(this).addClass('soldout');
                                    $(this).find(':radio').prop('disabled',true);
                                } else {
                                    $(this).removeClass('soldout');
                                    $(this).find(':radio').prop('disabled',false);
                                }
                            })
                            break;
                        case 3:
                            swatch.each(function(){
                                var swatchVal = $(this).data('value');
                                var optionSoldout = variants.find(function(variant){
                                    return variant.option1 == selectedOption1 && variant.option2 == selectedOption2 && variant.option3 == swatchVal && variant.available;
                                });
                                if(optionSoldout == undefined){
                                    $(this).addClass('soldout');
                                    $(this).find(':radio').prop('disabled',true);
                                } else {
                                    $(this).removeClass('soldout');
                                    $(this).find(':radio').prop('disabled',false);
                                }
                            })
                            break;
                        }
                });
            }
            else {
                var variants = window.productVariants[productId];
                var options = $bundle_product.find('.selector-wrapper');
                var selectedOption1 = $bundle_product.find('.fbt-selector-wrapper-1 option:selected').val();
                var selectedOption2 = $bundle_product.find('.fbt-selector-wrapper-2 option:selected').val();
                var selectedOption3 = $bundle_product.find('.fbt-selector-wrapper-3 option:selected').val();

                options.each(function(){
                    var optionIndex = $(this).data('option-index');
                    var option = $(this).find('option');
                    switch (optionIndex) {
                        case 1:
                            option.each(function(){
                                var optionVal = $(this).val();
                                var optionSoldout = variants.find(function(variant){
                                    return variant.option1 == optionVal && variant.available;
                                });
                                if(optionSoldout == undefined){
                                    $(this).attr('disabled','disabled');
                                } else {
                                    $(this).removeAttr('disabled','disabled');
                                }
                            })
                            break;
                        case 2:
                            option.each(function(){
                                var optionVal = $(this).val();
                                var optionSoldout = variants.find(function(variant){
                                    return variant.option1 == selectedOption1 && variant.option2 == optionVal && variant.available;
                                });
                                if(optionSoldout == undefined){
                                    $(this).attr('disabled','disabled');
                                } else {
                                    $(this).removeAttr('disabled','disabled');
                                }
                            })
                            break;
                        case 3:
                            option.each(function(){
                                var optionVal = $(this).val();
                                var optionSoldout = variants.find(function(variant){
                                    return variant.option1 == selectedOption1 && variant.option2 == selectedOption2 && variant.option3 == optionVal && variant.available;
                                });
                                
                                if(optionSoldout == undefined){
                                    $(this).attr('disabled','disabled');
                                } else {
                                    $(this).removeAttr('disabled','disabled');
                                }
                            })
                            break;
                    }
                });
            }
        });
    }

    function _updateVariantFBT(productId, variant, option_change, option_value) {
        var check_swatch_option = false;
        var $bundle_product = $bundleContainer.find('[data-bundle-product-id="'+productId+'"]');
        if ($bundle_product.find('.fbt-selector-wrapper-1').hasClass('swatch')) {
            check_swatch_option = true;
        }

        if (variant && productId) {
            if (check_swatch_option == true) {
                var variants = window.productVariants[productId];
                var options = $bundle_product.find('.selector-wrapper');
                var selectedOption1 = $bundle_product.find('.fbt-selector-wrapper-1 input:checked').val();
                var selectedOption2 = $bundle_product.find('.fbt-selector-wrapper-2 input:checked').val();
                var selectedOption3 = $bundle_product.find('.fbt-selector-wrapper-3 input:checked').val();
                
                options.each(function(){
                    var optionIndex = $(this).data('option-index');
                    var swatch = $(this).find('.swatch-element');
                    switch (optionIndex) {
                        case 1:
                            swatch.each(function(){
                                var swatchVal = $(this).data('value');
                                var optionSoldout = variants.find(function(variant){
                                    return variant.option1 == swatchVal && variant.available;
                                });
                                if(optionSoldout == undefined){
                                    $(this).addClass('soldout');
                                    $(this).find(':radio').prop('disabled',true);
                                } else {
                                    $(this).removeClass('soldout');
                                    $(this).find(':radio').prop('disabled',false);
                                }
                            })
                            break;
                        case 2:
                            swatch.each(function(){
                                var swatchVal = $(this).data('value');
                                var optionSoldout = variants.find(function(variant){
                                    return variant.option1 == selectedOption1 && variant.option2 == swatchVal && variant.available;
                                });
                                if(optionSoldout == undefined){
                                    $(this).addClass('soldout');
                                    $(this).find(':radio').prop('disabled',true);
                                } else {
                                    $(this).removeClass('soldout');
                                    $(this).find(':radio').prop('disabled',false);
                                }
                            })
                            break;
                        case 3:
                            swatch.each(function(){
                                var swatchVal = $(this).data('value');
                                var optionSoldout = variants.find(function(variant){
                                    return variant.option1 == selectedOption1 && variant.option2 == selectedOption2 && variant.option3 == swatchVal && variant.available;
                                });
                                if(optionSoldout == undefined){
                                    $(this).addClass('soldout');
                                    $(this).find(':radio').prop('disabled',true);
                                } else {
                                    $(this).removeClass('soldout');
                                    $(this).find(':radio').prop('disabled',false);
                                }
                            })
                            break;
                        }
                });
            } else {
                    var variants = window.productVariants[productId];
                    var options = $bundle_product.find('.selector-wrapper');
                    var selectedOption1 = $bundle_product.find('.fbt-selector-wrapper-1 option:selected').val();
                    var selectedOption2 = $bundle_product.find('.fbt-selector-wrapper-2 option:selected').val();
                    var selectedOption3 = $bundle_product.find('.fbt-selector-wrapper-3 option:selected').val();

                    options.each(function(){
                        var optionIndex = $(this).data('option-index');
                        var option = $(this).find('option');
                        switch (optionIndex) {
                            case 1:
                                option.each(function(){
                                    var optionVal = $(this).val();
                                    var optionSoldout = variants.find(function(variant){
                                        return variant.option1 == optionVal && variant.available;
                                    });
                                    if(optionSoldout == undefined){
                                        $(this).attr('disabled','disabled');
                                    } else {
                                        $(this).removeAttr('disabled','disabled');
                                    }
                                })
                                break;
                            case 2:
                                option.each(function(){
                                    var optionVal = $(this).val();
                                    var optionSoldout = variants.find(function(variant){
                                        return variant.option1 == selectedOption1 && variant.option2 == optionVal && variant.available;
                                    });
                                    if(optionSoldout == undefined){
                                        $(this).attr('disabled','disabled');
                                    } else {
                                        $(this).removeAttr('disabled','disabled');
                                    }
                                })
                                break;
                            case 3:
                                option.each(function(){
                                    var optionVal = $(this).val();
                                    var optionSoldout = variants.find(function(variant){
                                        return variant.option1 == selectedOption1 && variant.option2 == selectedOption2 && variant.option3 == optionVal && variant.available;
                                    });
                                    
                                    if(optionSoldout == undefined){
                                        $(this).attr('disabled','disabled');
                                    } else {
                                        $(this).removeAttr('disabled','disabled');
                                    }
                                })
                                break;
                        }
                    });
            }
        }
    }
  
    /**
     * Update hidden master select of variant change
     *
     * @param  {variant} variant - Currently selected variant
     */
    function _updateMasterSelectFBT(productId, variant) {
      $bundleContainer.find('#ProductSelect-'+productId).val(variant.id).trigger('change');
    }
  
    /**
    * Trigger event when variant image changes
    *
    * @param  {object} variant - Currently selected variant
    * @return {event}  variantImageChange
    */

    var currentVariantFBT = {};
  
    function _updateImagesFBT(productId, variant) {
        var variantImage = variant.featured_image || {};
        var currentVariantImage = currentVariantFBT.featured_image || {};

        if ( !variant.featured_image || variantImage.src === currentVariantImage.src ) {
            return;
        }
        $bundleContainer.find('[data-bundle-product-id="'+productId+'"] img').attr('src', variantImage.src);
    }
  
    function _getBaseUnit (variant) {
        return variant.unit_price_measurement.reference_value === 1
        ? variant.unit_price_measurement.reference_unit
        : variant.unit_price_measurement.reference_value +
            variant.unit_price_measurement.reference_unit;
    }
  
    /**
     * Trigger event when variant price changes.
     *
     * @param  {object} variant - Currently selected variant
     * @return {event} variantPriceChange
     */
    function _updatePriceFBT(productId, variant) {
        if (
            variant.price === currentVariantFBT.price &&
            variant.compare_at_price === currentVariantFBT.compare_at_price
        ) {
          return;
        }

        var $priceContainer = $('.product-price', $bundleContainer.find('[data-bundle-product-id="'+productId+'"]') );
        var $regularPrice = $('.price-item--regular', $priceContainer);
        var $salePrice = $('.price-item--sale', $priceContainer);
        var $unitPrice = $('[data-unit-price]', $priceContainer);
        var $unitPriceBaseUnit = $(
            '[data-unit-price-base-unit]',
            $priceContainer
        );

        // Reset product price state
        $priceContainer
            .removeClass(classes.productUnavailable)
            .removeClass(classes.productOnSale)
            .removeClass(classes.productUnitAvailable)
            .removeAttr('aria-hidden');

        // Unavailable
        if (!variant) {
            $priceContainer
                .addClass(classes.productUnavailable)
                .attr('aria-hidden', true);
            return;
        }

        // On sale
        if (variant.compare_at_price > variant.price) {
            $regularPrice.html(
                theme.Currency.formatMoney(
                    variant.compare_at_price,
                    theme.moneyFormat
                )
            );
            $salePrice.html(
                theme.Currency.formatMoney(variant.price, theme.moneyFormat)
            );
            $priceContainer.addClass(classes.productOnSale);
            
        } else {
            // Regular price
            $regularPrice.html(
                theme.Currency.formatMoney(variant.price, theme.moneyFormat)
            );
            $salePrice.html('');
        }
        $('[data-fbt-price-change]', $priceContainer).attr('data-price', variant.price);

        // Unit price
        if (variant.unit_price) {
            $unitPrice.html(
                theme.Currency.formatMoney(variant.unit_price, theme.moneyFormat)
            );
            $unitPriceBaseUnit.html(_getBaseUnit(variant));
            $priceContainer.addClass(classes.productUnitAvailable);
        }
    }

    function _onSelectChangeFBT(){
        $('.single-option-selector-frequently', this.$bundleContainer).on(
            'change',
            function(e){
                const productId = $(e.currentTarget).closest('[data-bundle-product-id]').data('bundle-product-id');
                const option_change = $(e.currentTarget).data('index');
                const option_value = $(e.currentTarget).val();
                if( productId ) {
                    var variants = window.productVariants[productId];
                    for(var i = 0; i < variants.length; i++ ) {
                        if(variants[i].id == $bundleContainer.find('#ProductSelect-'+productId).val()){
                            currentVariantFBT = variants[i];
                        }
                    }
                    var variant = _getVariantFromOptionsFBT(productId);
                    // remove error message if one is showing
                    _hideErrorMessage();

                    if (!variant) {
                        return;
                    }
                    _updateMasterSelectFBT(productId, variant);
                    _updateImagesFBT(productId, variant);
                    _updatePriceFBT(productId, variant);
                    _updateVariantFBT(productId, variant, option_change, option_value);
                    updateTotalPrice();
                }
            }
        );
    }
  
    function _handleButtonLoadingState(isLoading) {
        if (isLoading) {
            $addToCart.attr('aria-disabled', true);
            $addToCartText.addClass(classes.hidden);
            $loader.removeClass(classes.hidden);
        
            $loaderStatus.attr('aria-hidden', false);
        } else {
            $addToCart.removeAttr('aria-disabled');
            $addToCartText.removeClass(classes.hidden);
            $loader.addClass(classes.hidden);
        
            $loaderStatus.attr('aria-hidden', true);
        }
    }
  
    function _showErrorMessage(errorMessage) {
        $(this.selectors.errorMessage, this.$container).html(errorMessage);

      
        $errorMessageWrapper
        .removeClass(this.classes.productFormErrorMessageWrapperHidden)
        .attr('aria-hidden', true)
        .removeAttr('aria-hidden');
    }

    function _hideErrorMessage() {
        $errorMessageWrapper.addClass(
            classes.productFormErrorMessageWrapperHidden
        );
    }
  
    function _initAddToCartFBT() {
        $('.frequently-bought-together_form', this.$bundleContainer).on(
            'submit',
            function(evt) {
                evt.preventDefault();
                // disable the addToCart and dynamic checkout button while
                // request/cart popup is loading and handle loading state
                _handleButtonLoadingState(true);

                var ProductFBT = $(evt.currentTarget).find('.fbt-item.isChecked');
                Shopify.queue = [];
                var i = 0;
                var number = ProductFBT.length;
                ProductFBT.each(function() {
                    var variantId = $(this).find('[name="group_id"]').val();

                    if(variantId !== '') {
                        Shopify.queue.push( {
                            variantId: variantId,
                            quantity: 1
                        });

                    };
                });
                _addItemToCartFBT(number);
            }.bind(this)
        );
    }

    function _addItemToCartFBT(number) {
        if (Shopify.queue.length) {
            var data = Shopify.queue.shift();

            var params = {
                url: '/cart/add.js',
                data: 'quantity=' + data.quantity + '&id=' + data.variantId + '&form_type=product',
                dataType: 'json',
                //async: false,
            };

            $.post(params)
                .done(
                    function(item) {
                    _addItemToCartFBT();
                    _hideErrorMessage();
                    // _setupCartPopup(item, number);
                    form.submit();
    
                }.bind(this)
            )
            .fail(
                function(response) {
                    _showErrorMessage(response.responseJSON.description);
                    _handleButtonLoadingState(false);
                }.bind(this)
            );
            if(Shopify.queue.length == 0){
                try{
                    var discount_code = "FBT-BUNDLE-"+ meta.product.id;
                    apply_discount( discount_code );
                }
                catch(e){
                }
            }
        }
        else {
            _handleButtonLoadingState(false);
            return false;
        };
    }
  
    function apply_discount( discount_code ){
        if(window.bundleMatch){
            $.ajax({
                // url: "/discount/" + discount_code,
                url: "/discount/" + discount_code + "?redirect=/cart",
                success: function(response){
                    window.location.href = '/discount/' + discount_code + '?redirect=/cart';
                    // console.log('Discount code added');
                }
            });
        }
    }

    function _setupCartPopup(item, number) {
        this.$cartPopup = this.$cartPopup || cartPopup;
        this.$cartPopupWrapper =
            this.$cartPopupWrapper || cartPopupWrapper;
        this.$cartPopupTitle =
            this.$cartPopupTitle || cartPopupTitle;
        this.$cartPopupQuantity =
            this.$cartPopupQuantity || cartPopupQuantity;
        this.$cartPopupQuantityLabel =
            this.$cartPopupQuantityLabel || cartPopupQuantityLabel;
        this.$cartPopupClose =
            this.$cartPopupClose || cartPopupClose;
        this.$cartPopupDismiss =
            this.cartPopupDismiss || cartPopupDismiss;

        _setupCartPopupEventListeners();
        _updateCartPopupContent(item, number);
    }

    function _setupCartPopupEventListeners() {
        this.$cartPopupWrapper.on(
            'keyup',
            function(event) {
                if (event.keyCode === slate.utils.keyboardKeys.ESCAPE) {
                    this._hideCartPopup(event);
                }
            }.bind(this)
        );

        this.$cartPopupClose.on('click', _hideCartPopup.bind(this));
        this.$cartPopupDismiss.on('click', _hideCartPopup.bind(this));
        $('body').on('click', _onBodyClick.bind(this));
       
    }

    function _updateCartPopupContent(item, number) {

        $('[data-cart-popup-frequently-wrapper] .cart-popup-content').prepend(_getHTMLProducts(theme, item));

        $.getJSON('/cart.js').then(
            function(cart) {
                _setCartCountBubble(cart.item_count);
                setTimeout(function() {
                    _showCartPopup();
                }, 500);
            }.bind(this)
        );

        // setTimeout(function() {
        //     $(this.$cartPopupDismiss).trigger('click');
        // }, 4000)
    }

    function _getHTMLProducts(theme, product) {

        var productHTML = '';

        productHTML += '<div class="cart-popup-item">';
        productHTML += '<div class="cart-popup-item__image-wrapper" data-cart-popup-image-wrapper>';
        productHTML += '<img src="'+ product.image +'" alt="">';
        productHTML += '</div>';
        productHTML += '<div class="cart-popup-item__description">';
        productHTML += '<div>';
        productHTML += '<div class="cart-popup-item__title" data-cart-popup-title>'+ product.product_title +'</div>';
        productHTML += '<ul class="product-details" data-cart-popup-product-details>'+ _getVariantOptionList(product.variant_options) +'</ul>';
        productHTML += '<div class="cart-popup-desciption">'+ theme.strings.added_to_cart +'</div>';
        productHTML += '</div></div></div>';

        return productHTML;
    }

    function _getVariantOptionList(variantOptions) {
        var variantOptionListHTML = '';
        variantOptions.forEach(function(variantOption) {
            variantOptionListHTML =
                variantOptionListHTML +
                '<li class="product-details__item product-details__item--variant-option">' +
                variantOption +
                '</li>';
        });

        return variantOptionListHTML;
    }

    function _setCartCountBubble(quantity) {
        this.$cartCountBubble =
            this.$cartCountBubble || cartCountBubble;
        this.$cartCount = this.$cartCount || cartCount;

        this.$cartCountBubble.removeClass(this.classes.hidden);
        this.$cartCount.text(quantity);
    }

    function _showCartPopup() {
        this.$cartPopupWrapper
            .prepareTransition()
            .removeClass(this.classes.cartPopupWrapperHidden);
        _handleButtonLoadingState(false);

        slate.a11y.trapFocus({
            $container: this.$cartPopupWrapper,
            $elementToFocus: this.$cartPopup,
            namespace: 'cartPopupFocus'
        });
    }

    function _hideCartPopup(event) {
        var setFocus = event.detail === 0 ? true : false;
        this.$cartPopupWrapper
            .prepareTransition()
            .addClass(this.classes.cartPopupWrapperHidden);

        setTimeout(function() {
            $('[data-cart-popup-frequently-wrapper] .cart-popup-content').html('');
        }, 500);

        slate.a11y.removeTrapFocus({
            $container: this.$cartPopupWrapper,
            namespace: 'cartPopupFocus'
        });

        if (setFocus) this.$previouslyFocusedElement[0].focus();

        this.$cartPopupWrapper.off('keyup');
        this.$cartPopupClose.off('click');
        this.$cartPopupDismiss.off('click');
        $('body').off('click');
    }

    function _onBodyClick(event) {
        var $target = $(event.target);

        if ( $target[0] !== this.$cartPopupWrapper[0] && !$target.parents(this.selectors.cartPopup).length ) {
            _hideCartPopup(event);
        }
    }
  
    return {
        init: function() {
            bundleSlider();
            toggleVariantOptions();
            replaceDiscountRate();
            handleCheckedProduct();
            _firstupdateVariantFBT();
            _onSelectChangeFBT();
            updateTotalPrice();
            _initAddToCartFBT();
        }
    }
})();

theme.ProductRecommendations = (function() {
    var selectors = {
        productCard: '[data-product-card]'
    };

    function checkNeedToConvertCurrency() {
        return (window.show_multiple_currencies && Currency.currentCurrency != shopCurrency) || window.show_auto_currency;
    }

    function ProductRecommendations(container) {
        this.$container = $(container);

        var productId = this.$container.data('productId');
        var baseUrl = this.$container.data('baseUrl');

        var recommendationsSectionUrl = baseUrl + 
            '?section_id=product-recommendations&product_id=' +
            productId +
            '&limit=5';

        $.get(recommendationsSectionUrl).then(
            function(section) {
                var recommendationsMarkup = $(section).html();
                if (recommendationsMarkup.trim() !== '') {
                    this.$container.html(recommendationsMarkup);
                    this.sendTrekkieEvent();
                }

                theme.wishlist.init();
                if (checkNeedToConvertCurrency()) {
                    Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
                }
                // theme.HaloAddOn.updateVariant();
                $(".product-recommendations__inner").each(function(index) {
                    var $carousel = $(this).find('[data-slick]');
                    if ($carousel.length) {
                        if (!$carousel.hasClass('slick-slider')) {
                            $carousel.slick();
                        }
                    }
                });

            }.bind(this)
        );
        
    }

    ProductRecommendations.prototype = _.assignIn(
        {},
        ProductRecommendations.prototype,
        {
            sendTrekkieEvent: function() {
                if (
                    !window.ShopifyAnalytics ||
                    !window.ShopifyAnalytics.lib ||
                    !window.ShopifyAnalytics.lib.track
                ) {
                    return;
                }

                var didPageJumpOccur =
                    this.$container[0].getBoundingClientRect().top <= window.innerHeight;
                var numberOfRecommendationsDisplayed = this.$container.find(
                    selectors.productCard
                ).length;

                window.ShopifyAnalytics.lib.track('Product Recommendations Displayed', {
                    theme: 'debut',
                    didPageJumpOccur: didPageJumpOccur,
                    numberOfRecommendationsDisplayed: numberOfRecommendationsDisplayed
                });
            }
        }
    );

    return ProductRecommendations;
})();

theme.VideoSection = (function() {
    function VideoSection(container) {
        var $container = (this.$container = $(container));

        $('.video', $container).each(function() {
            var $el = $(this);
            theme.Video.init($el);
            theme.Video.editorLoadVideo($el.attr('id'));
        });
    }

    return VideoSection;
})();

theme.VideoSection.prototype = _.assignIn({}, theme.VideoSection.prototype, {
    onUnload: function() {
        theme.Video.removeEvents();
    }
});

theme.SlideshowSection = (function() {

    function initCarousel($carousel) {
        $carousel.each(function() {
            // const $slick = $(slick);
            var self = $(this);
            if (self.find('.youtube').length > 0) {
                self.addClass('slick-slider--video');
                // new YoutubeSlick(slick);

                function postMessageToPlayer(player, command) {
                    if (player == null || command == null) return;
                    player.contentWindow.postMessage(JSON.stringify(command), "*");
                }

                // When the slide is changing
                function playPauseVideo(slick, control) {
                    var currentSlide, player, video;

                    currentSlide = slick.find('.slick-current .slide-video');
                    player = currentSlide.find("iframe").get(0);

                    if (currentSlide.hasClass('youtube')) {
                        switch (control) {
                            case "play":
                                postMessageToPlayer(player, {
                                    "event": "command",
                                    "func": "mute"
                                });
                                postMessageToPlayer(player, {
                                    "event": "command",
                                    "func": "playVideo"
                                });
                                break;

                            case "pause":
                                postMessageToPlayer(player, {
                                    "event": "command",
                                    "func": "pauseVideo"
                                });
                                break;
                        }

                    } else if (currentSlide.hasClass('mp4')) {
                        video = currentSlide.children("video").get(0);

                        if (video != null) {
                            if (control === "play"){
                                video.play();
                            } else {
                                video.pause();
                            }
                        }
                    };
                };

                self.on('init', function(slick) {
                    slick = $(slick.currentTarget);

                    setTimeout(function(){
                        playPauseVideo(slick,"play");
                    }, 1000);
                });

                self.on("beforeChange", function(event, slick) {
                    slick = $(slick.$slider);
                    playPauseVideo(slick,"pause");
                });

                self.on("afterChange", function(event, slick) {
                    slick = $(slick.$slider);
                    playPauseVideo(slick,"play");
                });
            }
        });
    };

    function youtubeCarouselFactory($carousel) {
        if ($carousel.find('.youtube').length > 0) {

            if (typeof(YT) == 'undefined' || typeof(YT.Player) == 'undefined') {
                var tag = document.createElement('script');
                tag.src = "https://www.youtube.com/iframe_api";
                var firstScriptTag = document.getElementsByTagName('script')[0];
                firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
                
                window.onYouTubeIframeAPIReady = initCarousel.bind(window, $carousel);
            } else {
                initCarousel($carousel);
            }
        }
    };

    function mp4CarouselFactory($carousel) {
        if ($carousel.find('.slide-video.mp4').length > 0) {
            currentSlide = $carousel.find('.slick-current');
            video = currentSlide.find('video').get(0);

            if (video != null) {
                video.play();
                // if (control === "play"){
                //     video.play();

                // } else {
                //     video.pause();
                // }
            }

            $carousel.on('init', function() {
            });
            $carousel.on('beforeChange', function() {
            });
            $carousel.on('afterChange', function(event, slick, currentSlide) {
                video.play();
            });
        }       
    }

    function showTime(t){
        if(t < 10){
            return "<span class='num'>0</span><span class='num'>"+t+"</span>";
        }
        return "<span class='num'>"+parseInt(t/10)+"</span><span class='num'>"+(t%10)+"</span>";
    }

    function showDateFormat(t){
        if(t < 10){
            return "<span class='num'>0</span><span class='num'>"+t+"</span>";
        }
        if(t > 100){
            return showDateFormat(parseInt(t/10))+"<span class='num'>"+(t%10)+"</span>";
        }
        return "<span class='num'>"+parseInt(t/10)+"</span><span class='num'>"+(t%10)+"</span>";
    }

    function countDown($carousel){

      var countdownElm = $('[data-countdown]');
        countdownElm.each(function () {
            // Set the date we're counting down to
            if ($(this).hasClass('has-value')) {
                return;
            }

            var self = $(this),
                countDownDate = new Date( self.attr('data-countdown-value')).getTime();
            // Update the count down every 1 second
            var countdownfunction = setInterval(function() {

                // Get todays date and time
                var now = new Date().getTime();
        
                // Find the distance between now an the count down date
                var distance = countDownDate - now;
        
                // If the count down is over, write some text 
                if (distance < 0) {
                    clearInterval(countdownfunction);
                    document.getElementById("slide-countdown").innerHTML = "";
                } else {
                    // Time calculations for days, hours, minutes and seconds
                    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
                    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
                    // Output the result in an element with id="countDowntimer"
                    var strCountDown = "<span class='block-time'>"+showDateFormat(days) + "<span class='block-label'>days</span></span><span class='block-time'>"+showTime(hours) + "<span class='block-label'>hours</span></span><span class='block-time'>" + showTime(minutes) + "<span class='block-label'>mins</span></span><span class='block-time'>" + showTime(seconds) + "<span class='block-label'>secs</span></span>";
                    self.html(strCountDown);
                    self.addClass('has-value');
                }
            }, 1000);
        });




    }

    function SlideshowSection() {
        var $carousel = $('.slideshow[data-slick]');

        if ($carousel.length) {
            $carousel.slick();
            youtubeCarouselFactory($carousel);
            mp4CarouselFactory($carousel);
            countDown($carousel);
        }

        $carousel.each(function() {
            var self = $(this);
            if (self.find('.slide-video').length) {
                // self.find('.slide-video').css('height', self.height());
            }
        });
    };

    return SlideshowSection;
})();

theme.collection = (function() {

    function checkNeedToConvertCurrency() {
        return (window.show_multiple_currencies && Currency.currentCurrency != shopCurrency) || window.show_auto_currency;
    }

    function bannerCarousel() {
        $("[data-section-type='collection-tabs'] .collection-tab-banner").each(function() {
            var $carousel = $(this).find('[data-slick]');
            if ($carousel.length) {
                if (!$carousel.hasClass('slick-slider')) {
                    $carousel.slick();
                }
            }
        });
    }

    function custom_html() {

        if ($('.custom-html').length) {
            var $html = $('.custom-html'),
                showChar = 435,
                ellipsestext = "...";
           
            var moretext = theme.strings.showMore,
                lesstext = theme.strings.showLess,
                button = '<div class="button-group text-center"><a id="button-showmore-html" class="btn" href="#"><span class="text">'+ theme.strings.showMore +'</span></a>';

            $html.each(function() {
                var content = $(this).html();
                if(content.length > showChar) {
     
                    var c = content.substr(0, showChar);
                    var h = content.substr(showChar, content.length - showChar);
         
                    var html = c + '<span class="moreellipses">' + ellipsestext+ '&nbsp;</span><span class="morecontent"><span>' + h + '</span></span>';
                        html = html + button;
                    $(this).html(html);
                }
            });

            $('#button-showmore-html').on('click', function(event) {
                event.preventDefault();
                if($(this).hasClass("less")) {
                    $(this).removeClass("less");
                    $(this).find('.text').html(moretext);
                    $html.removeClass('showmore');
                } else {
                    $(this).addClass("less");
                    $(this).find('.text').html(lesstext);
                    $html.addClass('showmore');
                }
            });
        };
    }

    function layout_ListGrid() {
        var layout = $('#collection-page');
        $(document).on('click', '.view-as-btn a', function() {
            var column = $(this).attr('data-layout');
            document.getElementById('collection-page').className = '';
            layout.addClass(column)
        });
    }

    function showTime(t){
        if(t < 10){
            return "<span class='num'>0</span><span class='num'>"+t+"</span>";
        }
        return "<span class='num'>"+parseInt(t/10)+"</span><span class='num'>"+(t%10)+"</span>";
    }

    function showDateFormat(t){
        if(t < 10){
            return "<span class='num'>0</span><span class='num'>"+t+"</span>";
        }
        if(t > 100){
            return showDateFormat(parseInt(t/10))+"<span class='num'>"+(t%10)+"</span>";
        }
        return "<span class='num'>"+parseInt(t/10)+"</span><span class='num'>"+(t%10)+"</span>";
    }

    function initCountdown() {
        var countdownElm = $('.product-countdown[data-countdown]');
        countdownElm.each(function () {
            // Set the date we're counting down to
            if ($(this).hasClass('has-value')) {
                return;
            }

            var self = $(this),
                countDownDate = new Date( self.attr('data-countdown-value')).getTime();
            // Update the count down every 1 second
            var countdownfunction = setInterval(function() {

                // Get todays date and time
                var now = new Date().getTime();
        
                // Find the distance between now an the count down date
                var distance = countDownDate - now;
        
                // If the count down is over, write some text 
                if (distance < 0) {
                    clearInterval(countdownfunction);
                    document.getElementById("product-countdown").innerHTML = "";
                } else {
                    // Time calculations for days, hours, minutes and seconds
                    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
                    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
                    // Output the result in an element with id="countDowntimer"
                    var strCountDown = "<span class='block-time'>"+showDateFormat(days) + "<span class='block-label'>days</span></span><span class='block-time'>"+showTime(hours) + "<span class='block-label'>hours</span></span><span class='block-time'>" + showTime(minutes) + "<span class='block-label'>mins</span></span><span class='block-time'>" + showTime(seconds) + "<span class='block-label'>secs</span></span>";
                    self.html(strCountDown);
                    self.addClass('has-value');
                }
            }, 1000);
        });
    }

    function initInfiniteScrolling() {
        var infiniteScrolling = $('.infinite-scrolling');
        var infiniteScrollingLinkSlt = '.infinite-scrolling a';
        if (infiniteScrolling.length) {
            $(document).on('click', infiniteScrollingLinkSlt, function (e) {
                e.preventDefault();
                e.stopPropagation();

                if (!$(this).hasClass('disabled')) {
                    var url = $(this).attr('href');
                    doAjaxInfiniteScrollingGetContent(url);
                };
            });
        }
    }

    function doAjaxInfiniteScrollingGetContent(url) {
        $.ajax({
            type: "get",
            url: url,

            beforeSend: function () {
                showLoading();
            },
            success: function (data) {
                ajaxInfiniteScrollingMapData(data);
                if (theme.HaloAddOn.checkNeedToConvertCurrency()) {
                    Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
                }
                // theme.HaloAddOn.updateVariant();
            },
            complete: function () {
                hideLoading();
            }
        });
    }

    function ajaxInfiniteScrollingMapData(data) {
        var collectionTemplate = $('.page-collections'),
            currentProductColl = collectionTemplate.find('.halo-column-product'),
            newCollectionTemplate = $(data).find('.page-collections'),
            newProductColl = newCollectionTemplate.find('.halo-column-product'),
            newProductItem = newProductColl.children('.halo-item'),
            newPagination = newCollectionTemplate.find('.pagination-wrapper');

        var showMoreButton = $('.infinite-scrolling a');

        if (newProductColl.length) {
            currentProductColl.append(newProductItem);

            if ($(data).find('.infinite-scrolling').length > 0) {
                showMoreButton.attr('href', newCollectionTemplate.find('.infinite-scrolling a').attr('href'));
                showMoreButton.text(theme.strings.showMore1);
            } else {
                showMoreButton.addClass('disabled');
                showMoreButton.text(theme.strings.noMore);
            };

            $('.pagination-wrapper').html(newPagination.html());
            theme.wishlist.init();

            

            if (checkNeedToConvertCurrency()) {
                Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
            }

            if ($('.shopify-product-reviews-badge').length && $('.spr-badge').length) {
                return window.SPR.registerCallbacks(), window.SPR.initRatingHandler(), window.SPR.initDomEls(), window.SPR.loadProducts(), window.SPR.loadBadges();
            };
        };
    }

    function showLoading() {
        $('.loading-modal').show();
    }

    function hideLoading() {
        $('.loading-modal').hide();
    }

    return {
        init: function() {
            custom_html();
            layout_ListGrid();
            initCountdown();
            bannerCarousel();
            initInfiniteScrolling();
        }
    }
})();

theme.homepage_section = (function() {
    function logoList() {
        if (!$("[data-section-type='logolist']").length) {
            return
        }

        $("[data-section-type='logolist']").each(function(index) {
            var $carousel = $(this).find('[data-slick]');
                if ($carousel.length) {
                    if (!$carousel.hasClass('slick-slider')) {
                        $carousel.slick();
                    }
                }
        });
    }

    function blogList() {
        $("[data-section-type='featured-blog-section']").each(function(index) {
            var $carousel = $(this).find('[data-slick]');
            if ($(window).width() < 1025) {
                if ($carousel.length) {
                    if ($carousel.hasClass('slick-slider')) {
                        $carousel.slick('unslick');
                    }
                }
            } else {
                if ($carousel.length) {
                    if (!$carousel.hasClass('slick-slider')) {
                        $carousel.slick();
                    }
                }
            }
        });

        $("[data-gallery-images]").each(function(index) {
            var $carousel = $(this).find('[data-slick]');
            if ($(window).width() < 1025) {
                if ($carousel.length) {
                    if ($carousel.hasClass('slick-slider')) {
                        $carousel.slick('unslick');
                    }
                }
            } else {
                if ($carousel.length) {
                    if (!$carousel.hasClass('slick-slider')) {
                        $carousel.slick();
                    }
                }
            }
        });

        $("[data-gallery-images2]").each(function(index) {
            var $carousel = $(this).find('[data-slick]');
            if ($carousel.length) {
                if (!$carousel.hasClass('slick-slider')) {
                    $carousel.slick();
                }
            }
        });

        $("[data-section-type='featured-blog-section'] .halo-blog-layout-video").each(function(index) {
            var $carousel = $(this).find('[data-slick]');
            if ($(window).width() < 1025) {
                if ($carousel.length) {
                    if ($carousel.hasClass('slick-slider')) {
                        $carousel.slick('unslick');
                    }
                }
            } else {
                if ($carousel.length) {
                    if (!$carousel.hasClass('slick-slider')) {
                        $carousel.slick();
                    }
                }
            }
        });
    }

    function customBlockCarousel() {
        if (!$("[data-section-type='customBlockCarousel']").length) {
            return
        }

        $("[data-section-type='customBlockCarousel']").each(function(index) {
            var $carousel = $(this).find('[data-slick]');
            if ($(window).width() < 1025) {
                if ($carousel.length) {
                    if ($carousel.hasClass('slick-slider')) {
                        $carousel.slick('unslick');
                    }
                }
            } else {
                if ($carousel.length) {
                    if (!$carousel.hasClass('slick-slider')) {
                        $carousel.slick();
                    }
                }
            }
        });
    }

    function popup_video() {
        if (!$("[data-section-type='hero-section']").length) {
            return
        }

        $('.btn-popup-video').on('click', function() {
            var video_id = $(this).attr('data-id'),
                video_src = $(this).attr('data-src'),
                modal = $('#popup_video_'+video_id+' .modal-video');

                const $content = '<div class="modal-content">\
                        <div class="modal-header"><h5 class="modal-title">Popup Video</h5>\
                            <a class="close close-modal" data-dismiss="modal" class="close close-modal" href="javascript:void(0)"><svg class="icon icon-close"><use xlink:href="#icon-close" /></svg></a>\
                        </div>\
                        <div class="modal-body">\
                        <div class="popup-video" data-video-gallery>\
                            <div id="popup-video-content">\
                                <div class="popup-video-main">\
                                    <iframe\
                                        id="player"\
                                        type="text/html"\
                                        width="100%"\
                                        frameborder="0"\
                                        webkitAllowFullScreen\
                                        mozallowfullscreen\
                                        allowFullScreen\
                                        src="'+video_src+'"\
                                        data-video-player>\
                                    </iframe>\
                                </div>\
                            </div>\
                        </div>\
                        </div>\
                    </div>';

            modal.html($content);
        });

        $(document).on('click', function(event) {
            if($('.halo_modal_video .modal-video .modal-content').length){
                if (($(event.target).closest('.btn-popup-video').length === 0) && ($(event.target).closest('.halo_modal_video .close-modal').length === 0)) {
                    $('.halo_modal_video .modal-video .modal-content').remove();
                }
            }
        });  

    }

    function collection_hero_carousel() {
        $("[data-section-type='hero-section'] [data-slick]").each(function(index) {
            var $carousel = $(this);
            if ($carousel.length) {
                if (!$carousel.hasClass('slick-slider')) {
                    $carousel.slick();
                }
            }        
        });
    }

    function popup_product() {
        $('.points_popup .point').on('click', function() {
            var $productWrapper = $(this).parent(),
                $position = $productWrapper.position(),
                $product = $(this).siblings();

            if ($(window).width() < 1024) {
                $product.css({'top': 100 - $position.top, 'left': 30 - $position.left});
            }

            $productWrapper.addClass('is-open');
        });

        $('.custom-product-card .close').on('click', function() {
            $(this).parents('.points_popup').removeClass('is-open');
        });

        $(document).on('click', function(event) {
            if (($(event.target).closest('.custom-product-card').length === 0) && ($(event.target).closest('.points_popup').length === 0)) {
                $('.points_popup').removeClass('is-open');
            }
        });

    }

    function customArrowButton(collection) {
        $('.btn-arrow-prev').on('click', function(e) {
            e.preventDefault();
            var wrapper = $(this).parents('[data-carousel]');
            wrapper.find('[data-slick]').slick("slickPrev");
        })

        $('.btn-arrow-next').on('click', function(e) {
            e.preventDefault();
            var wrapper = $(this).parents('[data-carousel]');
            wrapper.find('[data-slick]').slick("slickNext");
        })
    }

    function collection_carousel() {
        $("[data-section-type='collection'] [data-slick]").each(function(index) {
            var $carousel = $(this);
            if ($carousel.length) {
                if (!$carousel.hasClass('slick-slider')) {
                    $carousel.slick();
                }
            }
        });
    }

    function back_to_top() {
        if (!$('#back-to-top').length) {
            return
        }

        var offset = $(window).height()/2;
        const backToTop = $('#back-to-top');

        $(window).scroll(function() {
            ($(this).scrollTop() > offset) ? backToTop.addClass('is-visible') : backToTop.removeClass('is-visible');
        });

        backToTop.on('click', function(event) {
            event.preventDefault();
            $('body,html').animate({
                scrollTop: 0
            }, 1000);
        });
    }

    function product_fancybox() {

        $('[data-fancybox]').fancybox({
            mobile : {
                clickContent : "close",
                clickSlide : "close"
            },
            buttons: [
                "zoom",
                //"share",
                "slideShow",
                //"fullScreen",
                //"download",
                // "thumbs",
                "close"
            ]
        });
    }

    function ask_an_expert_scroll() {
      if(!$('.ask-an-expert').length) {
         return;
      }

      var scrollTop = $(".ask-an-expert");
      var offset = $(window).height()/2;

      $(window).scroll(function() {
        // declare variable
        var topPos = $(this).scrollTop();

        // if user scrolls down - show scroll to top button
        if (topPos > offset) {
          $(scrollTop).fadeIn(400);
          $(scrollTop).show();
        } else {
          $(scrollTop).fadeOut(400);
        }

      });

    }

    function initInfiniteScrollingSection() {
        var infiniteScrolling = $('.infinite-scrolling1');
        var infiniteScrollingLinkSlt = '.infinite-scrolling1 a';
        if (infiniteScrolling.length) {
            $(document).on('click', infiniteScrollingLinkSlt, function (e) {
                e.preventDefault();
                e.stopPropagation();
                if($(this).hasClass('ajax-loading') )
                  return false;
                $(this).addClass('ajax-loading');

                if (!$(this).hasClass('disabled')) {
                    doAjaxInfiniteScrollingGetContentSection(e);
                };
            });
        }
    }

    function doAjaxInfiniteScrollingGetContentSection(e) {
      var url = $(e.currentTarget).attr('data-collection'),
            limit = $(e.currentTarget).attr('data-limit'),
            page = parseInt($(e.currentTarget).attr('data-page'));

        $.ajax({
            type: "get",
            url: window.router + '/collections/' + url,
            cache: false,
            data: {
                view: 'sorting',
                constraint: 'limit=' + limit + '+page=' + page
            },

            beforeSend: function () {
                showLoading();
            },
            success: function (data) {
              $('.section-product-new-sections .halo-row-new').append(data);
              if( $(data).length == limit ){
                $(e.currentTarget).attr('data-page', page + 1);
              }
              else{
                $(e.currentTarget).attr('disabled','disabled');
              }
              if (checkNeedToConvertCurrency()) {
                Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
              }
              if ($('.shopify-product-reviews-badge').length && $('.spr-badge').length) {
                return window.SPR.registerCallbacks(), window.SPR.initRatingHandler(), window.SPR.initDomEls(), window.SPR.loadProducts(), window.SPR.loadBadges();
              }
              
            },
            complete: function () {
                hideLoading();
                $(e.currentTarget).removeClass('ajax-loading');
                $('.infinite-scrolling1').remove();
            }
        });
    }

    function showLoading() {
        $('.loading-modal').show();
    }

    function hideLoading() {
        $('.loading-modal').hide();
    }

    function checkNeedToConvertCurrency() {
        return (window.show_multiple_currencies && Currency.currentCurrency != shopCurrency) || window.show_auto_currency;
    }

    return {
        init: function() {
            logoList();
            blogList();
            customBlockCarousel();
            customArrowButton();
            collection_carousel();
            collection_hero_carousel();
            back_to_top();
            popup_video();
            popup_product();
            product_fancybox();
            ask_an_expert_scroll();
            initInfiniteScrollingSection();
        }
    }
})();

theme.header = (function() {

    function header_sticky() {
        if ($('.header-sticky').length) {
            var header_position, header_height;
            if ($(window).width() > 1199) {
                header_height = $('.header-sticky').height();
                header_position = $('.page-container').offset();
                header_scroll1(header_position.top, header_height);
            }
            else {
                header_height = $('.halo-header-mobile').height();
                header_position = $('.page-container').offset();
                header_scroll2(header_position.top, header_height);
                header_scroll3(header_position.top, header_height);
            }
        }
    }

    function header_scroll1(header_position, header_height) {
        $(window).on('scroll load', function(event) {
            var scroll = $(window).scrollTop();
            if (scroll > header_height) {
                $('.header-sticky').addClass('is-sticky');
                // $('.announcement-bar').hide();
                $('body').css('padding-top', header_height);
                if ($('.halo-header-01').length) {
                    // if ($('.halo-header-01 .halo-header-PC #site-nav').length) {
                    //     $('.halo-header-01 .halo-header-PC #site-nav').appendTo('.halo_mobileNavigation_wrapper .site-nav-mobile-wrapper');
                    //     document.getElementById('site-nav').className = "site-nav-mobile"; 

                    // }
                    // if ($('.halo_mobileNavigation_wrapper #site-nav').length) {
                    //     $('.halo_mobileNavigation_wrapper #site-nav').appendTo('.halo-header-01 .halo-header-PC .header-bottom .container');
                    //     document.getElementById('site-nav').className = "site-nav";
                    // }
                }
            } else {
                $('.header-sticky').removeClass('is-sticky');
                // $('.announcement-bar').show();
                $('body').css('padding-top', 0);
                if ($('.halo-header-01').length) {
                    if ($('.halo_mobileNavigation_wrapper #site-nav').length) {
                        $('.halo_mobileNavigation_wrapper #site-nav').appendTo('.halo-header-01 .halo-header-PC .header-bottom .container');
                        document.getElementById('site-nav').className = "site-nav";
                    }
                }
            }
        });
        
        window.onload = function() {
            if ($(window).scrollTop() > header_position) {
                $('.header-sticky').addClass('is-sticky');
            }
        };
    }

    function header_scroll2(header_position, header_height) {
        if ($('.halo-header-01').length) {
            if ($('.halo-header-01 .halo-header-PC #site-nav').length) {
                $('.halo-header-01 .halo-header-PC #site-nav').appendTo('.halo_mobileNavigation_wrapper .site-nav-mobile-wrapper');
                document.getElementById('site-nav').className = "site-nav-mobile"; 
            }
        }

        $(window).on('scroll load', function(event) {
            var scroll = $(window).scrollTop();
            if (scroll > header_height) {
                $('.header-sticky').addClass('is-sticky');
                // $('.announcement-bar').hide();
                $('body').css('padding-top', header_height);
                
            } else {
                $('.header-sticky').removeClass('is-sticky');
                $('.announcement-bar').show();
                $('body').css('padding-top', 0);
            }
        });
        
        window.onload = function() {
            if ($(window).scrollTop() > header_position) {
                $('.header-sticky').addClass('is-sticky');
            }
        };
    } 

    function header_scroll3(header_position, header_height) {
        if ($('.halo-header-02').length) {
            if ($('.halo-header-02 .halo-header-PC #site-nav').length) {
                $('.halo-header-02 .halo-header-PC #site-nav').appendTo('.halo_mobileNavigation_wrapper .site-nav-mobile-wrapper');
                document.getElementById('site-nav').className = "site-nav-mobile"; 
            }
        }

        $(window).on('scroll load', function(event) {
            var scroll = $(window).scrollTop();
            if (scroll > header_height) {
                $('.header-sticky').addClass('is-sticky');
                // $('.announcement-bar').hide();
                $('body').css('padding-top', header_height);
                
            } else {
                $('.header-sticky').removeClass('is-sticky');
                $('.announcement-bar').show();
                $('body').css('padding-top', 0);
            }
        });
        
        window.onload = function() {
            if ($(window).scrollTop() > header_position) {
                $('.header-sticky').addClass('is-sticky');
            }
        };
    }

    function announcementtopCarousel() {
        if (!$("[data-section-type='header-section']").length) {
            return
        }

        $("[data-section-type='header-section']").each(function(index) {
            var $carousel = $(this).find('[data-slick]');
            if ($carousel.length) {
                if (!$carousel.hasClass('slick-slider')) {
                    $carousel.slick();
                }
            }
        });
    }

    function toggle_search_popup() {
        $('[data-search-dropdown-pc]').on('click', function(event) {
            event.preventDefault();

            const $target = $(event.currentTarget);
            if ($target.hasClass('is-open')) {
                $target.removeClass('is-open');
                $target.find('.icon-close').hide();
                $target.find('.icon-search').show();
                $('.search-form').hide();
            } else {
                $target.addClass('is-open');
                $target.find('.icon-close').show();
                $target.find('.icon-search').hide();
                $('.search-form').show();
            }
        });

        $(document).on('click', function(event) {
            if ($('[data-search-dropdown-pc]').hasClass('is-open')) {
                if (($(event.target).closest('[data-search-dropdown-pc]').length === 0) && ($(event.target).closest('.search-form').length === 0)) {
                    $('[data-search-dropdown-pc]').removeClass('is-open');
                    $('[data-search-dropdown-pc]').find('.icon-close').hide();
                    $('[data-search-dropdown-pc]').find('.icon-search').show();
                    $('.search-form').hide();
                }
            }
        });
    }

    function login_form() {
        if ($('#login-dropdown').length) {
            if ($(window).width() > 1199) {
                if ($('#login-mobile #login-dropdown').length) {
                    $('#login-mobile #login-dropdown').appendTo('.item--account .navUser-action');
                }
            }
            else {
                if ($('.halo-header-02').length) {
                    if ($('.navUser-account #login-dropdown').length) {
                        $('.navUser-account #login-dropdown').appendTo('#login-mobile .halo_mobileNavigation_wrapper');
                    }
                }
                else {
                    if ($('.item--account #login-dropdown').length) {
                        $('.item--account #login-dropdown').appendTo('#login-mobile .halo_mobileNavigation_wrapper');
                    }
                }
                
            }
        }
    }

    function cart_form() {
        if ($('#cart-dropdown').length) {
            if ($(window).width() > 1199) {
                if ($('#cart-mobile #cart-dropdown').length) {
                    $('#cart-mobile #cart-dropdown').appendTo('.item--cart');
                }
            }
            else {
                if ($('.item--cart #cart-dropdown').length) {
                    $('.item--cart #cart-dropdown').appendTo('#cart-mobile .halo_mobileNavigation_wrapper');
                }
            }
        }
    }

    function initToggleMuiltiLangCurrency() {
        var dropdownGroup = $('.lang_currency-dropdown'),
            dropdownLabel = dropdownGroup.find('.dropdown-label');

        if (dropdownLabel.length && dropdownLabel.is(':visible')) {
            dropdownLabel.on('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                var selfNextDropdown = $(this).next();

                if (!selfNextDropdown.is(':visible')) {
                    dropdownLabel.next('.dropdown-menu').hide();
                    selfNextDropdown.show();
                } else {
                    selfNextDropdown.hide();
                }
            });

            hideMuiltiLangCurrency();

            $(dropdownGroup.find('.dropdown-item')).on('click', function (e) {
                dropdownLabel.next('.dropdown-menu').hide();
            });
        } else {
            dropdownLabel.next('.dropdown-menu').css({
                'display': ''
            });
        };
    }

    function hideMuiltiLangCurrency() {
        $(document).on('click', function (e) {
            var muiltiDropdown = $('.lang_currency-dropdown .dropdown-menu');

            if (!muiltiDropdown.is(e.target) && !muiltiDropdown.has(e.target).length) {
                muiltiDropdown.hide();
            }
        });
    }

    function addTextMuiltiOptionActive(SltId, dataSlt, label) {
        if (label.length && label.is(':visible')) {
            var item = dataSlt.html();
            SltId.prev(label).html(item);
        };
    }

    function carouselMegaMenu() {
        if (!$('.featuredProductCarousel').length) {
            return
        }

        if (!$('.featuredProductCarousel').hasClass('slick-slider')) {
            $('.featuredProductCarousel').slick({
                infinite: true,
                slidesToShow: 1,
                slidesToScroll: 1,
                dots: false,
                autoplay: false,
                arrows: true,
                prevArrow: '<div class="slick-prev slick-arrow"><svg class="icon"><use xlink:href="#icon-chevron-left"></svg></div>',
                nextArrow: '<div class="slick-next slick-arrow"><svg class="icon"><use xlink:href="#icon-chevron-right"></svg></div>'
            });
        }

        $(".site-nav > li").mouseover(function() {
            $('.featuredProductCarousel').get(0).slick.setPosition();
        });
        $("ul.site-nav-mobile > li > .nav-action").on("click", function() {
            $('.featuredProductCarousel').get(0).slick.setPosition();
        });
    }

    function currency_mobile() {
        if ($('#currencies').length) {
            if ($(window).width() > 1199) {
                if(!$('.navUser-currency .lang_currency-dropdown').length) {
                    $('.currency-groups .lang_currency-dropdown').appendTo('.navUser-currency');
                }
            } else {
                if($('.navUser-currency .lang_currency-dropdown').length) {
                    $('.navUser-currency .lang_currency-dropdown').appendTo('.currency-groups');
                }
            }
        }
    }

    function language_mobile() {
        if ($('#lang-switcher').length) {
            if ($(window).width() > 1199) {
                if(!$('.navUser-language .lang_currency-dropdown').length) {
                    $('.lang-groups .lang_currency-dropdown').appendTo('.navUser-language');
                }
            } else {
                if($('.navUser-language .lang_currency-dropdown').length) {
                    $('.navUser-language .lang_currency-dropdown').appendTo('.lang-groups');
                }
            }
        }
    }

    function logo_mobile() {
        if ($('.logo-wrapper').length) {
            if ($(window).width() > 1199) {
                if ($('.halo-header-mobile .logo-wrapper').length) {
                    $('.halo-header-mobile .logo-wrapper').appendTo('.halo-header-PC .header-middle-logo');
                }
            }
            else {
                if ($('.halo-header-PC .logo-wrapper').length) {
                    $('.halo-header-PC .logo-wrapper').appendTo('.halo-header-mobile .header-Mobile-item.text-center .items');
                }
            }
        }
    }

    function search_mobile() {
        if ($('.search-form').length) {
            if ($(window).width() > 1199) {
                if ($('.item--searchMobile .search-form').length) {
                    $('.item--searchMobile .search-form').appendTo('.item--quickSearch');
                }
            }
            else {
                if ($('.item--quickSearch .search-form').length) {
                    $('.item--quickSearch .search-form').appendTo('.item--searchMobile');
                }
            }
        }
    }

    function show_more_menu(){
      if (!$('.sub-menu-mobile1 .menu-lv-2').length) {
        $('.wrap-show-more').each(function () {
            var item_menu = $(this).html();
            $('.sub-menu-mobile1 .site-nav-dropdown1').append('<li class="menu-lv-2 hover-lv2 item dropdown">' + item_menu + '</li>');
        });
      }
    }

    function slideshow_position(){
        if ($('.halo-header-02').length) {
            if ($(window).width() > 1199) {
                var header_height = $('.site-header').height();
              $('.banner-image-full-width-sections:first-child .banner-image-full-width').css('margin-top', -header_height);
            }
            else{
                $('.banner-image-full-width-sections:first-child .banner-image-full-width').css('margin-top', 0);
            }
        }
    }

    return {
        init: function() {
            logo_mobile();
            cart_form();
            announcementtopCarousel();
            toggle_search_popup();
            login_form();
            show_more_menu();
            slideshow_position();
            header_sticky();
            search_mobile();
            currency_mobile();
            language_mobile();
            carouselMegaMenu();
            initToggleMuiltiLangCurrency();
            addTextMuiltiOptionActive($('#currencies'), $('#currencies [data-currency].active'), $('[data-currency-label]'));
            addTextMuiltiOptionActive($('#lang-switcher'), $('#lang-switcher [data-value].active'), $('[data-language-label]'));
        }
    }
})();

theme.footer = (function() {

    function geotrust_slider() {
        if (!$('.geotrust_ssl--image[data-slick]').length) {
            return;
        }

        var $carousel = $('.geotrust_ssl--image[data-slick]');
        if ($carousel.length) {
            if (!$carousel.hasClass('slick-slider')) {
                $carousel.slick();
            }
        }
    }

    function block_icon() {
        if (!$(".footer-block-icon-row").length) {
            return
        }

        var $carousel = $('.footer-block-icon-row');
        if ($(window).width() < 1025) {
            if ($carousel.length) {
                if (!$carousel.hasClass('slick-slider')) {
                    $carousel.slick();
                }
            }
        } else {
            if ($carousel.length) {
                if ($carousel.hasClass('slick-slider')) {
                    $carousel.slick('unslick');
                }
            }
        }
    }

    function footer_mobile() {
        if ($(window).width() <= 767) {
            if(!$('.footer-info').hasClass('footerMobile')) {
                $('.footer-info').addClass('footerMobile');
                $('.footer-col--mobile .footer-info-list').css('display', 'none');
            }
        } else {
            $('.footer-info').removeClass('footerMobile');
            $('.footer-col--mobile').removeClass('open-dropdown');
            $('.footer-col--mobile .footer-info-list').css('display', 'block');
        }
    }

    function popup_video_article() {

      var $videoSrc;  
      $('.video-btn').click(function() {
          $videoSrc = $('.video-btn').data( "src" );
          // $('#exampleModal').modal('show')
      });
      $('#myModal').on('shown.bs.modal', function (e) {
    
      // set the video src to autoplay and not to show related video. Youtube related video is like a box of chocolates... you never know what you're gonna get
      $("#video").attr('src',$videoSrc + "?autoplay=1&amp;modestbranding=1&amp;showinfo=0" ); 
      });

      // stop playing the youtube video when I close the modal
      $('#myModal').on('hide.bs.modal', function (e) {
          // a poor man's stop video
          $("#video").attr('src',$videoSrc); 
      }); 
    }

    return {
        init: function() {
            geotrust_slider();
            block_icon();
            footer_mobile();
            popup_video_article();
        }
    }
})();

theme.sidebar = (function() {
    
    function toggle_sidebar_mobile() {
        $('.sidebar_mobile').on('click', function(event) {
            event.preventDefault();
            const $target = $(event.target);
            if ($target.hasClass('is-open')) {
                $target.removeClass('is-open');
                $('.page-sidebar').removeClass('is-open');
                $('body').removeClass('open_Sidebar');

            } else {
                $target.addClass('is-open');
                $('.page-sidebar').addClass('is-open');
                $('body').addClass('open_Sidebar');
            }
        });

        $('.sidebar_close .close').on('click', function(event) {
            event.preventDefault();
            $('.page-sidebar').removeClass('is-open');
            $('body').removeClass('open_Sidebar');
        });

        $('.overlay_background').on('click', function(event) {
            event.preventDefault();
            if ($('.page-sidebar').hasClass('is-open')) {
                $('.page-sidebar').removeClass('is-open');
                $('body').removeClass('open_Sidebar');
                $('.sidebar_mobile .icon-filter').removeClass('is-open');
                $('.sidebar_mobile .filters-toolbar__label').removeClass('is-open');
            }
        });
    }

    function dropdown_collectionChild() {
        if ($('.all-categories-list').length) {
            $(document).on('click', '.all-categories-list .navPages-action-wrapper', function(event) {
                const $target = $(event.target).parent();
                $target.siblings().removeClass('is-clicked');
                $target.toggleClass('is-clicked');
                $target.siblings().find("> .dropdown-category-list").slideUp( "slow" );
                $target.find("> .dropdown-category-list").slideToggle( "slow" );
            });
        }

        var category_active = $('.breadcrumb-wrapper ul.breadcrumb .item.is-active').children('a').attr('href');
        $('.all-categories-list .navPages-level-1').each(function () {
            var self = $(this);
            if (self.find('.navPages-action-wrapper a').attr('href') === category_active) {
                self.children('.navPages-action-wrapper').trigger("click");
            }
        });
    }

    function product_carousel() {
        if (!$('[data-product-carousel-sidebar]').length) {
            return
        }

        $("[data-product-carousel-sidebar]").each(function(index) {
            var $carousel = $(this).find('[data-slick]');
            if ($carousel.length) {
                if (!$carousel.hasClass('slick-slider')) {
                    $carousel.slick();
                }
            }
        });
    }

    function queryParams() {
        Shopify.queryParams = {};

        if (location.search.length) {
            for (var aKeyValue, i = 0, aCouples = location.search.substr(1).split('&'); i < aCouples.length; i++) {
                aKeyValue = aCouples[i].split('=');

                if (aKeyValue.length > 1) {
                    Shopify.queryParams[decodeURIComponent(aKeyValue[0])] = decodeURIComponent(aKeyValue[1]);
                }
            }
        };
    }

    function ajaxCreateUrl(baseLink) {
        var newQuery = $.param(Shopify.queryParams).replace(/%2B/g, '+');

        if (baseLink) {
            if (newQuery != "")
                return baseLink + "?" + newQuery;
            else
                return baseLink;
        }
        return location.pathname + "?" + newQuery;
    }

    function filterAjaxClick(baseLink) {
        delete Shopify.queryParams.page;

        var newurl = ajaxCreateUrl(baseLink);

        History.pushState({
            param: Shopify.queryParams
        }, newurl, newurl);
    }


    function ajaxSortBy() {
        var $sortby = $('.filters-toolbar__item-child[data-select="SortBy"]'),
            $sortbyActive = $sortby.find('#SortBy').val();

        // $sortbyName.text($sortbyActive);
        $('#SortBy').on('change', function(e) {
            var sort = $('#SortBy').val();
            var url = window.location.href.replace(window.location.search, '');
            console.log(url);
            if (sort.length) {
                Shopify.queryParams.sort_by = sort;
            } else {
                // clean up our url if the sort value is blank for default
                window.location.href = url;
            }
            filterAjaxClick();
        });
    }

    function ajaxFilterTags() {
        $(document).on('click', '.sidebarBlock_filter .list-tags a, .list-tags label, .refined .selected-tag', function (e) {
            e.preventDefault();
            e.stopPropagation();

            var newTags = [];

            if (Shopify.queryParams.constraint) {
                newTags = Shopify.queryParams.constraint.split('+');
            };

            //one selection or multi selection
            if (!window.enable_sidebar_multiple_choice && !$(this).prev().is(':checked')) {
                //remove other selection first
                var otherTag = $(this).closest('.sidebar-tags, .refined-widgets').find('input:checked');

                if (otherTag.length) {
                    var tagName = otherTag.val();

                    if (tagName) {
                        var tagPos = newTags.indexOf(tagName);

                        if (tagPos >= 0) {
                            //remove tag
                            newTags.splice(tagPos, 1);
                        }
                    }
                };
            };

            var tagName = $(this).prev().val();

            if (tagName) {
                var tagPos = newTags.indexOf(tagName);

                if (tagPos >= 0) {
                    newTags.splice(tagPos, 1);
                } else {
                    newTags.push(tagName);
                };
            };

            if (newTags.length) {
                Shopify.queryParams.constraint = newTags.join('+');
            } else {
                delete Shopify.queryParams.constraint;
            };

           filterAjaxClick();

            // var newurl = ajaxCreateUrl();

            // doAjaxSidebarGetContent(newurl);
        });
    }

    function ajaxFilterClearTags() {
        var sidebarTag = $('.sidebarBlock');

        $('.sidebarBlock').each(function () {
            var sidebarTagchild = $(this);

            if (sidebarTagchild.find('input:checked').length) {
                //has active tag
                sidebarTagchild.addClass('show_clear');
            }
        });

        $(document).on('click', '.sidebarBlock.show_clear .clear', function (e) {
            e.preventDefault();
            e.stopPropagation();

            var currentTags = [];
            var currentBlock = $(this).parents('.sidebarBlock');
            if (Shopify.queryParams.constraint) {
                currentTags = Shopify.queryParams.constraint.split('+');
            };

            currentBlock.find("input:checked").each(function () {
                var selectedTag = $(this);
                var tagName = selectedTag.val();

                if (tagName) {
                    var tagPos = currentTags.indexOf(tagName);
                    if (tagPos >= 0) {
                        //remove tag
                        currentTags.splice(tagPos, 1);
                    };
                };
            });


            if (currentTags.length) {
                Shopify.queryParams.constraint = currentTags.join('+');
            } else {
                delete Shopify.queryParams.constraint;
            };

            filterAjaxClick();
            // var newurl = ajaxCreateUrl();
            // doAjaxSidebarGetContent(newurl);
        });
    }

    function ajaxFilterClearAll() {
        var clearAllSlt = '.refined-widgets a.clear-all';
        var clearAllElm = $(clearAllSlt);

        $(document).on('click', clearAllSlt, function (e) {
            e.preventDefault();
            e.stopPropagation();

            delete Shopify.queryParams.constraint;

            filterAjaxClick();

            // var newurl = ajaxCreateUrl();

            // doAjaxSidebarGetContent(newurl);
        });
    }

    function ajaxMapData(data) {

        var curCollTemplate = $('.template-collection .page-container'),
            curSidebar = curCollTemplate.find('.sidebar_content'),
            curProColl = curCollTemplate.find('#Collection'),

            newCollTemplate = $(data).find('.page-collections'),
            newSidebar = newCollTemplate.find('.sidebar_content'),
            newProColl = newCollTemplate.find('#Collection');

        curSidebar.replaceWith(newSidebar);
        curProColl.replaceWith(newProColl);

        if (theme.HaloAddOn.checkNeedToConvertCurrency()) {
            Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
        };

        if ($('.shopify-product-reviews-badge').length && $('.spr-badge').length) {
            return window.SPR.registerCallbacks(), window.SPR.initRatingHandler(), window.SPR.initDomEls(), window.SPR.loadProducts(), window.SPR.loadBadges();
        };
        
    }

    function doAjaxSidebarGetContent(newurl) {
        $.ajax({
            type: "get",
            url: newurl,

            beforeSend: function () {
                showLoading();
            },

            success: function (data) {
                ajaxMapData(data);
                ajaxFilterClearTags();
                hide_filter();
                product_carousel();
            },

            error: function (xhr, text) {
                $('.ajax-error-message').text($.parseJSON(xhr.responseText).description);
                showModal('.ajax-error-modal');
            },

            complete: function () {
                hideLoading();
            }
        });
    }

    function historyAdapter() {
        var collTpl = $('.template-collection');

        if (collTpl.length) {
            History.Adapter.bind(window, 'statechange', function () {
                var State = History.getState();
                
                queryParams();

                var newurl = ajaxCreateUrl();

                doAjaxSidebarGetContent(newurl);
            });
        };
    }

    function showLoading() {
        $('.loading-modal').show();
    }

    function hideLoading() {
        $('.loading-modal').hide();
    }

    function hide_filter() {
        $('.sidebarBlock_filter .sidebarBlock-content .list-tags').each(function() {
            if($(this).children('li').length > 0) {
                $(this).parents('.sidebarBlock_filter').show();
            } else {
                $(this).parents('.sidebarBlock_filter').hide();
            }
        })
    }

    function ajaxPagination() {
          if (!$('.template-collection').length)
              return

          var paginationSlt = '.pagination-wrapper .pagination-link';

          $(document).off('click', paginationSlt).on('click', paginationSlt, function (e) {
              e.preventDefault();

              var page = $(this).attr('href').match(/page=\d+/g);

              if (page) {
                  Shopify.queryParams.page = parseInt(page[0].match(/\d+/g));
                  if (Shopify.queryParams.page) {

                      var newurl = ajaxCreateUrl();

                      History.pushState({
                          param: Shopify.queryParams
                      }, newurl, newurl);

                      doAjaxSidebarGetContent(newurl);

                      var elm = $('.template-collection .page-collection');

                      if (!elm.length) {
                          elm = $('.page-container');
                      }

                      var top = elm.offset().top;

                      $('body,html').animate({
                          scrollTop: top
                      }, 800);
                  };
              };
          });
      }

    return {
        init: function() {
            product_carousel();
            toggle_sidebar_mobile();
            dropdown_collectionChild();

            queryParams();
            hide_filter();
            ajaxFilterTags();
            ajaxSortBy();
            // ajaxFilterClearTags();
            // ajaxFilterClearAll();
            historyAdapter();
            ajaxPagination();
        }
    }
})();

theme.wishlist = (function() {
    var wishListsArr = localStorage.getItem('items') ? JSON.parse(localStorage.getItem('items')) : [];

    localStorage.setItem('items', JSON.stringify(wishListsArr));

    if (wishListsArr.length) {
        wishListsArr = JSON.parse(localStorage.getItem('items'));
    };

    theme.product_card.init();

    function checkNeedToConvertCurrency() {
        return (window.show_multiple_currencies && Currency.currentCurrency != shopCurrency) || window.show_auto_currency;
    }

    function initWishListIcons() {
        var wishListItems = localStorage.getItem('items') ? JSON.parse(localStorage.getItem('items')) : [];

        if (!wishListItems.length) {
            return;
        }

        for (var i = 0; i < wishListItems.length; i++) {
            var icon = $('[data-product-handle="'+ wishListItems[i] +'"]');
            icon.addClass('whislist-added');
        };
    };

    function createWishListTplItem(ProductHandle) {

        var wishListCotainer = $('[data-wishlist-container]');

        jQuery.getJSON('/products/'+ProductHandle+'.js', function(product) {
            var productHTML = '',
                price_min = theme.Currency.formatMoney(product.price_min, theme.moneyFormat);

            productHTML += '<tr class="wishlist_row" data-wishlist-added="wishlist-'+product.id+'" data-product-id="product-'+product.handle+'">';
            productHTML += '<th class="wishlist_col wishlist_image text-center">';
            productHTML += '<a href="'+product.url+'" class="product-grid-image" data-collections-related="/collections/all?view=related">';
            productHTML += '<img src="'+product.featured_image+'" alt="'+product.featured_image.alt+'">';
            productHTML += '</a></th>';
            productHTML += '<th class="wishlist_col wishlist_name text-left">';
            productHTML += '<div class="product-vendor">';
            productHTML += '<a href="/collections/vendors?q='+product.vendor+'" title="'+product.vendor+'">'+product.vendor+'</a></div>';
            productHTML += '<a class="product-title" href="'+product.url+'" title="'+product.title+'">'+product.title+'</a></th>';
            productHTML += '<th class="wishlist_col wishlist_price text-center"><div class="product-price"><span class="price-item">'+ price_min +'</span></div></th>';
            productHTML += '<th class="wishlist_col wishlist_remove text-center"><a class="btn btn--secondary product-remove whislist-added" href="#" data-product-handle="'+ product.handle +'" data-icon-wishlist data-id="'+ product.id +'">'+theme.strings.remove+'</a></th>';
            productHTML += '<th class="wishlist_col wishlist_add text-center">';
            productHTML += '<form action="/cart/add" method="post" class="variants" id="wishlist-product-form-'+product.id+'" data-id="product-actions-'+product.id+'" enctype="multipart/form-data">';
           
            if (product.available) {
                if (product.variants.length == 1) {
                    productHTML += '<button class="btn btn--secondary-accent" type="submit" data-btn-addToCart data-form-id="#wishlist-product-form-'+product.id+'">'+theme.strings.addToCart1+'</button><input type="hidden" name="id" value="'+ product.variants[0].id +'" />';
                }
                if (product.variants.length > 1){
                    productHTML += '<a class="btn btn--secondary-accent" title="'+product.title+'" href="'+product.url +'">'+theme.strings.select_options1+'</a>';
                }
            } else {
                productHTML += '<button class="btn product-btn product-btn-soldOut" type="submit" disabled>'+theme.strings.unavailable+'</button>';
            }
            
            productHTML += '</form></th>';
            productHTML += '</tr>';

            wishListCotainer.append(productHTML);

            var regex = /(<([^>]+)>)/ig;
            var href = $('.wrapper-wishlist a.share').attr("href");
            href += encodeURIComponent( product.title + '\nPrice: ' + price_min.replace(regex, "") + '\nLink: ' + window.location.protocol + '//' + window.location.hostname + product.url +'\n\n');
            $('.wrapper-wishlist a.share').attr("href", href );

            if (checkNeedToConvertCurrency()) {
                Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
            }

        });
    };

    function initWishListPagging() {

        var data = JSON.parse(localStorage.getItem('items'));

        var wlpaggingContainer = $('#wishlist_pagination');
       
        var paggingTpl = '<li><a href="#" class="btn btn--narrow btn--prev disabled"><span class="icon_text">'+theme.strings.previous+'</span></a></li>';
        
        var wishListCotainer = $('[data-wishlist-container]');

        wlpaggingContainer.children().remove();

        var totalPages = Math.ceil(data.length / 5);

        if (totalPages <= 1) {
            wishListCotainer.children().show();
            return;
        }

        for (var i = 0; i < totalPages; i++) {
            var pageNum = i + 1;
            if (i === 0) paggingTpl += '<li><a class="pagination-link pagination--current" data-page="' + pageNum + '" href="'+ pageNum +'" title="'+ pageNum +'">' + pageNum + '</a></li>'
            else paggingTpl += '<li><a class="pagination-link" data-page="' + pageNum + '" href="'+ pageNum +'" title="'+ pageNum +'">' + pageNum + '</a></li>'
        }

        paggingTpl += '<li><a class="btn btn--narrow btn--next" href="#"><span class="icon_text">'+theme.strings.next+'</span></a></li>';
        
        wlpaggingContainer.append(paggingTpl);

        wishListCotainer.children().each(function(idx, elm) {
            if (idx >= 0 && idx < 5) {
                $(elm).show();
            }
            else {
                $(elm).hide();
            }
        });

        wlpaggingContainer.off('click.wl-pagging').on('click.wl-pagging', 'li a', function(e) {
            e.preventDefault();

            var isPrev = $(this).hasClass('btn--prev');
            var isNext = $(this).hasClass('btn--next');
            var pageNumber = $(this).data('page');

            if (isPrev) {
                var curPage = parseInt($('#wishlist_pagination').find('.pagination--current').data('page'));
                pageNumber = curPage - 1;
            }

            if (isNext) {
                var curPage = parseInt($('#wishlist_pagination').find('.pagination--current').data('page'));
                pageNumber = curPage + 1;
            }

            wishListCotainer.children().each(function(idx, elm) {
                if (idx >= (pageNumber - 1) * 5 && idx < pageNumber * 5) {
                    $(elm).show();
                }
                else {
                    $(elm).hide();
                }
            });

            if (pageNumber === 1) {
                wlpaggingContainer.find('.btn--prev').addClass('disabled');
                wlpaggingContainer.find('.btn--next').removeClass('disabled');
            }
            else if (pageNumber === totalPages) {
                wlpaggingContainer.find('.btn--next').addClass('disabled');
                wlpaggingContainer.find('.btn--prev').removeClass('disabled');
            }
            else {
                wlpaggingContainer.find('.btn--prev').removeClass('disabled');
                wlpaggingContainer.find('.btn--next').removeClass('disabled');
            }

            $('#wishlist_pagination').find('.pagination-link').removeClass('pagination--current')
            $('#wishlist_pagination').find('[data-page="' + pageNumber + '"]').addClass('pagination--current')
        });
    };

    function initWishLists() {
        if (typeof(Storage) !== 'undefined' && $('.page').hasClass('page-wishlist')) {
            var data = JSON.parse(localStorage.getItem('items'));

            if (data.length <= 0) {
                return;
            }

            data.forEach(function(item) {
                createWishListTplItem(item);
            });
            setTimeout(function() {
                initWishListPagging();
            },1000);

        }
    };

    function setAddedForWishlistIcon(ProductHandle) {
        var wishlistElm = $('[data-product-handle="'+ ProductHandle +'"]'),
            idxArr = wishListsArr.indexOf(ProductHandle);

        if(idxArr >= 0) {
            wishlistElm.addClass('whislist-added');
        }
        else {
            wishlistElm.removeClass('whislist-added');
        };
    };

    function doAddOrRemoveWishlish() {
        var iconWishListsSlt = '[data-icon-wishlist]';

        $(document).off('click.addOrRemoveWishlist', iconWishListsSlt).on('click.addOrRemoveWishlist', iconWishListsSlt, function(e) {
            e.preventDefault();

            var self = $(this),
                productId = self.data('id'),
                ProductHandle = self.data('product-handle'),
                idxArr = wishListsArr.indexOf(ProductHandle);


            if(!self.hasClass('whislist-added')) {
                self.addClass('whislist-added');

                if($('[data-wishlist-container]').length) {
                    createWishListTplItem(ProductHandle);
                };

                wishListsArr.push(ProductHandle);
                localStorage.setItem('items', JSON.stringify(wishListsArr));
            } else {
                self.removeClass('whislist-added');

                if($('[data-wishlist-added="wishlist-'+productId+'"]').length) {
                    $('[data-wishlist-added="wishlist-'+productId+'"]').remove();
                }

                wishListsArr.splice(idxArr, 1);
                localStorage.setItem('items', JSON.stringify(wishListsArr));

                if($('[data-wishlist-container]').length) {
                    initWishListPagging();
                };
            };

            setAddedForWishlistIcon(ProductHandle);
        });
    };

    return {
        init: function() {
            initWishListIcons();
            initWishLists();
            doAddOrRemoveWishlish();
        }
    }
})();

theme.compare = (function() {

    var compareArr = localStorage.getItem('compareArr') ? JSON.parse(localStorage.getItem('compareArr')) : [];

    localStorage.setItem('compareArr', JSON.stringify(compareArr));
    
    if (compareArr.length) {
        compareArr = JSON.parse(localStorage.getItem('compareArr'));
    };

    function checkNeedToConvertCurrency() {
        return (window.show_multiple_currencies && Currency.currentCurrency != shopCurrency) || window.show_auto_currency;
    }

    function initCompareIcons() {
        if (!$('.page-collections').length) {
            return
        }
        var compareCountNum = $('[data-compare-count]');
            
            totalProduct = Math.ceil(compareArr.length);
            compareCountNum.text(totalProduct);

        if (!compareArr.length) {
            return;
        } else {
            for (var i = 0; i < compareArr.length; i++) {
                var icon = $('[data-compare-product-handle="'+ compareArr[i] +'"]');
                icon.addClass('compare-added');
            };

            if (typeof(Storage) !== 'undefined') {        
                
                if (compareArr.length <= 0) {
                    return;
                }

                // resetCompare();

                setTimeout(function() {
                    compareArr.forEach(function(item) {
                        createCompareItem(item);
                        setAddedForCompareIcon(item);      
                    });
                }, 700);
                

            } else {
                alert('Sorry! No web storage support..');
            }
        }
    }

    function createCompareItem(ProductHandle) {

        var compareProduct = $('[data-compare-modal]').find('.product-grid'),
            compareRating = $('[data-compare-modal]').find('.rating'),
            compareDescription = $('[data-compare-modal]').find('.description'),
            compareCollection = $('[data-compare-modal]').find('.collection'),
            compareAvailability = $('[data-compare-modal]').find('.availability'),
            compareProductType = $('[data-compare-modal]').find('.product-type'),
            compareSKU = $('[data-compare-modal]').find('.product-sku');
            compareOption1 = $('[data-compare-modal]').find('.option1'),
            compareOption2 = $('[data-compare-modal]').find('.option2'),
            compareOption3 = $('[data-compare-modal]').find('.option3');


        jQuery.getJSON('/products/'+ProductHandle+'.js', function(product) {
            var productHTML = '',
                priceHTML = '',
                productLabelHTML = '',
                ratingHTML = '',
                descriptionHTML = '',
                collectionHTML = '',
                availabilityHTML = '',
                productTypeHTML = '',
                skuHTML = '',
                optionValueHTML = '',
                optionValueHTML2 = '',
                price_min = theme.Currency.formatMoney(product.price_min, theme.moneyFormat);

            var productIDCompare = product.id;

            var rating = '<span class="shopify-product-reviews-badge" data-id="'+productIDCompare+'"></span>';

            var desc =  product.description.substring(0,100) + '...',
               domparser = new DOMParser(),
               descriptionHTML = domparser.parseFromString(desc, "text/html");

            var labelSale = (( product.variants[0].compare_at_price - product.variants[0].price )/ product.variants[0].compare_at_price) * 100,
               arrayTags = product.tags,
               percentDiscount = Math.floor(labelSale);

            var productID = $(this).find('.product-card').data('id');
             
            if (rating == '' || rating == undefined) {
                ratingHTML += '<div class="col-xl-4" data-compare-added="compare-'+product.id+'"></div>';
            } else {
                ratingHTML += '<div class="col-xl-4" data-compare-added="compare-'+product.id+'">'+rating+'</div>';
            }                        
            compareRating.append(ratingHTML);
           

           if (desc == '' || desc == undefined ) {
                descriptionHTML += '<div class="col-xl-4" data-compare-added="compare-'+product.id+'">-</div>';
            
           } else {
                descriptionHTML += '<div class="col-xl-4" data-compare-added="compare-'+product.id+'">'+desc+'</div>';
           }

           compareDescription.append(descriptionHTML);

            // SKU

           var sku = product.variants;

           if (sku.length > 1) {
                $.each( sku, function( key, value ) {
                    if(key == 0){
                        skuValue = value.sku;
                        if(skuValue == ""){
                           skuValueHTML = '<div class="col-xl-4" data-compare-added="compare-'+product.id+'">-</div>';
                           skuHTML += skuValueHTML;
                        }
                        else{
                            skuValueHTML = '<div class="col-xl-4" data-compare-added="compare-'+product.id+'">'+skuValue+'</div>';
                            skuHTML += skuValueHTML;
                        }
                    }
                });
           } else {
                skuHTML += '<div class="col-xl-4" data-compare-added="compare-'+product.id+'">-</div>';
           }
           compareSKU.append(skuHTML);
           
            // Option
            var productOptions = product.options;
          
            $.each(productOptions, function(index, opt) {
                var optPosition = opt.position,
                    optName = opt.name.toLowerCase(),
                    optValue = opt.values,
                    optValueText = '';

                optValue.forEach(function(value, index) {
                    if (value) {
                        if (index > 0) {
                            optValueText += ', '
                        }
                        optValueText += value;
                    }
                })

                optionValueHTML2 += '<div class="col-xl-4" data-compare-added="compare-'+product.id+'">-</div>';

                if (optValueText == '' || optValueText == 'Default Title') {
                    optionValueHTML += '<div class="col-xl-4" data-compare-added="compare-'+product.id+'">-</div>';
                } else {
                    optionValueHTML += '<div class="col-xl-4" data-compare-added="compare-'+product.id+'">'+optValueText+'</div>';
                }

                var optionOneValue = window.option_ptoduct1,
                    optionTwoValue = window.option_ptoduct2;
                    optionThreeValue = window.option_ptoduct3;
                if (optPosition == 1) {
                    if (optName == optionOneValue) {
                        compareOption1.append(optionValueHTML);
                        compareOption2.append(optionValueHTML2);
                        compareOption3.append(optionValueHTML2);
                    } else if (optName == optionTwoValue) {
                        compareOption1.append(optionValueHTML2);
                        compareOption2.append(optionValueHTML);
                        compareOption3.append(optionValueHTML2);
                    } else if (optName == 'title') {
                        compareOption1.append(optionValueHTML2);
                        compareOption2.append(optionValueHTML2);
                        compareOption3.append(optionValueHTML2);
                    } else {
                        compareOption1.append(optionValueHTML2);
                        compareOption2.append(optionValueHTML2);
                        compareOption3.append(optionValueHTML);
                    }
                }
                if (optPosition == 2) {
                    if (optName == optionOneValue) {
                        compareOption1.find('[data-compare-added="compare-'+product.id+'"]').html(optValueText);
                    } else  if (optName == optionTwoValue) {
                        compareOption2.find('[data-compare-added="compare-'+product.id+'"]').html(optValueText);
                    } else {
                        compareOption3.find('[data-compare-added="compare-'+product.id+'"]').html(optValueText);
                    }
                }
                if (optPosition == 3) {
                    if (optName == optionOneValue) {
                        compareOption1.find('[data-compare-added="compare-'+product.id+'"]').html(optValueText);
                    } else  if (optName == optionTwoValue) {
                        compareOption2.find('[data-compare-added="compare-'+product.id+'"]').html(optValueText);
                    } else {
                        compareOption3.find('[data-compare-added="compare-'+product.id+'"]').html(optValueText);
                    }
                }
            });

          
            productHTML += '<div class="grid-item col-xl-4" data-compare-added="compare-'+product.id+'">';
            productHTML += '<div class="product-card" data-product-id="product-'+product.handle+'">';
            productHTML += '<div class="product-image">';
            productHTML += '<a href="'+product.url+'" class="product-link">';
            productHTML += '<img src="'+product.featured_image+'" alt="'+product.featured_image.alt+'">';
            productHTML += '</a>';


            productHTML += '<div class="product_badges">';
            if(product.compare_at_price > product.price){
                if(window.label_sale == 'text'){
                    productHTML += '<div class="badge sale-badge">'+ theme.strings.sale +' </div>';
                }else{
                    productHTML += '<div class="badge sale-badge">- '+percentDiscount+'% </div>';
                }
            }
            if (product.available == false) {
                productHTML += '<div class="badge soldOut-badge">'+ theme.strings.soldOut +' </div>';
            }
            arrayTags.forEach(function(element){
                if(element == 'new' || element == 'New'){
                  productHTML += '<div class="badge new-badge">'+ theme.strings.new +' </div>';
                }
                if(element == 'bundle' || element == 'bundle') {
                  productHTML += '<div class="badge bundle-badge">'+ theme.strings.bundle +' </div>';
                }
            })
            productHTML += '</div></div>';


            productHTML += '<div class="product-content">';
            productHTML += '<div class="product-vendor">';
            productHTML += '<a href="/collections/vendors?q='+product.vendor+'" title="'+product.vendor+'">'+product.vendor+'</a></div>';
            productHTML += '<h4 class="product-title"><a href="'+product.url+'" title="'+product.title+'">'+product.title+'</a></h4>';

            if(product.compare_at_price > product.price){
                productHTML += '<div class="product-price price--on-sale">';
                productHTML += '<span class="price-item price-item--regular">' + Shopify.formatMoney(product.variants[0].compare_at_price  , window.money_format) + '</span>';
                productHTML += '<span class="price-item price-item--sale" itemprop="price"> '+ Shopify.formatMoney(product.price, window.money_format)+'</span>';
                productHTML +='</div>';
            }else{
                productHTML += '<div class="product-price">'+ Shopify.formatMoney(product.price, window.money_format) +'</div>';
            }

            productHTML += '<div class="product-action">';
            productHTML += '<form action="/cart/add" method="post" class="variants" id="-'+product.id+'" data-id="product-actions-'+product.id+'" enctype="multipart/form-data">';
            
            if (product.available) {
                if (product.variants.length == 1) {
                    productHTML += '<button data-btn-addToCart class="btn product-btn" type="submit" data-form-id="#-'+product.id+'">'+theme.strings.addToCart+'</button><input type="hidden" name="id" value="'+ product.variants[0].id +'" />'; 
                } 
                if (product.variants.length > 1){
                    productHTML += '<a class="btn product-btn" title="'+product.title+'" href="'+product.url +'">'+theme.strings.select_options+'</a>';
                }
                availabilityHTML += '<div class="col-xl-4 in-stock" data-compare-added="compare-'+product.id+'">'+theme.strings.in_stock+'</div>';
            } else { 
                productHTML += '<button data-btn-addToCart class="btn product-btn product-btn-soldOut" type="submit" disabled="disabled">'+theme.strings.unavailable+'</button>';
                availabilityHTML += '<div class="col-xl-4 unavailable" data-compare-added="compare-'+product.id+'">'+theme.strings.out_of_stock+'</div>';
            }
            productHTML += '</form><div class="text-center mt-3"><a class="product-remove" href="javascript:void(0);" data-icon-compare-added data-compare-product-handle="'+ product.handle +'" data-id="'+ product.id +'">'+theme.strings.remove+'</a></div>';
            
            productHTML += '</div></div></div></div>';

            compareProduct.append(productHTML);

            productTypeHTML += '<div class="col-xl-4" data-compare-added="compare-'+product.id+'">'+product.type+'</div>';    

            compareAvailability.append(availabilityHTML);
            compareProductType.append(productTypeHTML);

            if (checkNeedToConvertCurrency()) {
                Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
            }      
        });
    }

    function removeCompareItem(ProductHandle) {
        var iconCompareRemove = '[data-icon-compare-added]';

        $(document).off('click.removeCompareItem', iconCompareRemove).on('click.removeCompareItem', iconCompareRemove, function(e) {
            e.preventDefault();
            e.stopPropagation();

            var self = $(this),
                productId = self.data('id'),
                ProductHandle = self.data('compare-product-handle'),
                idxArr = compareArr.indexOf(ProductHandle);
            
            if($('[data-compare-added="compare-'+productId+'"]').length) {
                $('[data-compare-added="compare-'+productId+'"]').remove();

            }

            compareArr.splice(idxArr, 1);
            localStorage.setItem('compareArr', JSON.stringify(compareArr));

            setAddedForCompareIcon(ProductHandle);
        });
    }

    function removeAllCompareItem(ProductHandle) {
        var compareRemoveAll = '[data-compare-remove-all]';
            compareCountNum = $('[data-compare-count]');
            compareElm = $('[data-icon-compare]');

        $(document).off('click.removeAllCompareItem', compareRemoveAll).on('click.removeAllCompareItem', compareRemoveAll, function(e) {
            e.preventDefault();
            e.stopPropagation();

            $('[data-compare-added]').remove();

            compareArr.splice(0,compareArr.length);
            localStorage.setItem('compareArr', JSON.stringify(compareArr));

            if (compareElm.hasClass('compare-added')) {
                compareElm.removeClass('compare-added');
            }

            totalProduct = Math.ceil(compareArr.length);
            compareCountNum.text('0');
            compareCountNum.parent().removeClass('show');
            $('#compare').modal('hide');
        })
    }

    function resetCompare() {
        var compareRemoveAll = '[data-compare-remove-all]';
            compareCountNum = $('[data-compare-count]');
            compareElm = $('[data-icon-compare]');

        $('[data-compare-added]').remove();

        compareArr.splice(0,compareArr.length);
        localStorage.setItem('compareArr', JSON.stringify(compareArr));

        if (compareElm.hasClass('compare-added')) {
            compareElm.removeClass('compare-added');
        }

        totalProduct = Math.ceil(compareArr.length);
        compareCountNum.text('0');
        compareCountNum.parent().removeClass('show');
    }

    function setAddedForCompareIcon(ProductHandle) {    
        var compareElm = $('[data-compare-product-handle="'+ ProductHandle +'"]'),
            idxArr = compareArr.indexOf(ProductHandle),
            compareCountNum = $('[data-compare-count]');

            compareItems = localStorage.getItem('compareArr') ? JSON.parse(localStorage.getItem('compareArr')) : [];
            totalProduct = Math.ceil(compareItems.length);

        if(idxArr >= 0) {
            compareElm.addClass('compare-added');
            compareElm.find('.compare-text').text('remove compare');
        }
        else {
            compareElm.removeClass('compare-added');
            compareElm.find('.compare-text').text('add compare');
        };

        compareCountNum.text(totalProduct);
        if (totalProduct > 1) {
            compareCountNum.parent().addClass('show');   
        } else {
            compareCountNum.parent().removeClass('show');
        }
    }

    function doAddOrRemoveCompare() {
        if (!$('.page-collections').length) {
            return
        }

        var iconCompare = '[data-icon-compare]';

        $(document).on('click', iconCompare, function(e) {
            e.preventDefault();

            var self = $(this),
                productId = self.data('id'),
                ProductHandle = self.data('compare-product-handle'),
                idxArr = compareArr.indexOf(ProductHandle);
            
            if(!self.hasClass('compare-added')) {
                self.addClass('compare-added');


                compareArr.push(ProductHandle);
                localStorage.setItem('compareArr', JSON.stringify(compareArr));

                createCompareItem(ProductHandle);

            } else {
                self.removeClass('compare-added');

                if($('[data-compare-added="compare-'+productId+'"]').length) {
                    $('[data-compare-added="compare-'+productId+'"]').remove();
                }

                compareArr.splice(idxArr, 1);
                localStorage.setItem('compareArr', JSON.stringify(compareArr));
            };

            setAddedForCompareIcon(ProductHandle);
        });
    }

    function initCompareSelected() {
        if (!$('.page-collections').length) {
            return
        }

        var iconCompareSelected = '[data-compare-selected]',
            compareModal = $('[data-compare-modal]'),
            compareModalProduct = compareModal.find('.product-grid'),
            compareModalMessage = $('[data-compare-message-modal]');

        $(document).off('click.compareSelected', iconCompareSelected).on('click.compareSelected', iconCompareSelected, function(e) {
            e.preventDefault();
            e.stopPropagation();                

            if (typeof(Storage) !== 'undefined') {        
                
                if (compareArr.length <= 1) {

                } else {
                    compareArr.forEach(function(item) {
                        removeCompareItem(item);
                    });

                    removeAllCompareItem();
                }                    

            } else {
                alert('Sorry! No web storage support..');
            }
        });
    }

    return {
        init: function() {
            doAddOrRemoveCompare();
            initCompareIcons();
            initCompareSelected();
        }
    }
})();

theme.cart_page = (function() {
    function changeQuantityAddToCart() {
        if (!$('.page-cart').length) {
            return;
        }
        var buttonSlt = '[data-qtt]',
            buttonElm = $(buttonSlt);

        $(document).on('click', buttonSlt, function (e) {
            e.preventDefault();
            e.stopPropagation();

            var self = $(this),
                input = self.siblings('input[name="quantity"]').length > 0 ? self.siblings('input[name="quantity"]') : self.siblings('input[name="group_quantity"]');

            if (input.length < 1) {
                input = self.siblings('input[name="updates[]"]');
            }

            var val = parseInt(input.val());

            switch (true) {
                case (self.hasClass('plus')):
                    {
                        val +=1;
                        break;
                    }
                case (self.hasClass('minus') && val > 0):
                    {
                        val -=1;
                        break;
                    }
            }
            input.val(val);
        });
    }
    changeQuantityAddToCart();
})();

theme.someone_purchased = (function() {
    function toggleSomething() {
        var timeText = $('.product-notification .time-text span:visible').text();
        
        if($('.product-notification').hasClass('active')){
            $('.product-notification').removeClass('active')
        }
        else {     
            var number=$('.data-product').length,
                i = Math.floor(Math.random() * number),         
                images = $('.product-notification .data-product:eq('+i+')').data('image'),
                title = $('.product-notification .data-product:eq('+i+')').data('title'),
                url = $('.product-notification .data-product:eq('+i+')').data('url'),
                local =  $('.product-notification .data-product:eq('+i+')').data('local');

            $('.product-notification').addClass('active');
            $('.product-notification .product-image').find('img').attr('src', images );
            $('.product-notification .product-name').attr('href', url );
            $('.product-notification .product-name').text(title);
            $('.product-notification .product-image').attr('href', url );
            $('.product-notification .time-text').text(local);
        }
    }

    function SomeonePurchased() {
        if(!$('.product-notification').length) {
            return;
        }

        if ($.cookie('pr_notification') == 'closed') {
            $('.product-notification').remove();
        }

        $('.close-notifi').bind('click',function(){
            $('.product-notification').remove();
            $.cookie('pr_notification', 'closed', {expires:1, path:'/'});
        });  
        
        var time = $('.product-notification').data('time');
        var timer = setInterval(toggleSomething, time);
    }

    function gdprCookie() {
        var gdprCookie = $('#accept-cookies');

        if ($.cookie('cookieMessage') == 'closed') {
            gdprCookie.remove();
        } else {
            gdprCookie.removeClass('hide');
        }

        gdprCookie.find('[data-accept-cookie]').on('click', function(e) {
            e.preventDefault();
            gdprCookie.remove();
            $.cookie('cookieMessage', 'closed', {expires: 1, path:'/'});
        });
    }

    return {
        init: function() {
            gdprCookie();
            SomeonePurchased();
        }
    }
})();

theme.halo_mobile = (function() {
    function toggle_menu() {
        $('[data-mobile-menu-toggle="menu"]').on('click', function() {
            $(this).toggleClass('is-open');
            $('body').toggleClass('open_menu');
            if ($(window).width() > 1199) {
                var position = $('.site-header').position(), height = $('.site-header').outerHeight();
                $('#site-nav-mobile').css({'top': (position.top + height), 'height': ($(window).height() - position.top - height) });
            } else {
                $('#site-nav-mobile').css('top', 0);
            }
        });

        $('#site-nav-mobile .close_menu').on('click', function(event) {
            $('[data-mobile-menu-toggle="menu"]').removeClass('is-open');
            $('body').removeClass('open_menu');
            reset_dropdownMenu();
        });

        $('.overlay_background').on('click', function(event) {
            if ($('body').hasClass('open_menu')) {
                $('[data-mobile-menu-toggle="menu"]').removeClass('is-open');
                $('body').removeClass('open_menu');
                reset_dropdownMenu();
            }
        });
    }

    function toggle_login() {
        $('[data-login-dropdown-pc]').on('click', function(event) {
            event.preventDefault();
            const $target = $(event.currentTarget);
            if ($target.hasClass('is-open')) {
                $target.removeClass('is-open');
                $('#login-dropdown').slideUp();
            } else {
                $target.addClass('is-open');
                $('#login-dropdown').slideDown();
            }
        });

        $('[data-close-login-dropdown-pc]').on('click', function(event) {
            event.preventDefault();
            $('[data-login-dropdown-pc]').removeClass('is-open');
            $('#login-dropdown').slideUp();
        });

        $(document).on('click', function(event) {
            if ($('[data-login-dropdown-pc]').hasClass('is-open')) {
                if (($(event.target).closest('[data-login-dropdown-pc]').length === 0) && ($(event.target).closest('#login-dropdown').length === 0)) {
                    $('[data-login-dropdown-pc]').removeClass('is-open');
                    $('#login-dropdown').slideUp();
                }
            }
        });

        $('[data-login-toggle]').on('click', function(event) {
            $('body').addClass('open_Account');
        });

        $('[data-close-login-dropdown]').on('click', function(event) {
            $('body').removeClass('open_Account');
        });

        $('.overlay_background').on('click', function(event) {
            event.preventDefault();
            if ($('body').hasClass('open_Account')) {
                $('body').removeClass('open_Account');
            }
        });
    }

    function toggle_search() {
        $('.item--searchMobile .navUser-action').on('click', function(event) {
            $('.item--searchMobile .navUser-action').toggleClass('is-open');
        });
    }

    function reset_dropdownMenu() {
        $('#site-nav-mobile').find('.is-open').removeClass('is-open');
        $('#site-nav-mobile').find('.is-hidden').removeClass('is-hidden');
    }

    function toggle_dropdownMenu() {
        // var $opemMenu = $('.site-nav-mobile').find('.nav-action');
        $(document).on('click', '.site-nav-mobile .nav-action', function(event) {
            const $openAction = $(event.target).parent();
            const $parentSiblings = $openAction.siblings();
            const $checkTitle = $openAction.closest('.site-nav-dropdown');
            const $closestTitle = $checkTitle.siblings();
            if (!$(event.target).hasClass('menu__moblie_end')) {
                if (!$(event.target).hasClass('link')) {
                    $openAction.addClass('is-open');
                    if ($openAction.hasClass('is-open')) {
                        $parentSiblings.addClass('is-hidden');
                    }
                    if ( $checkTitle.length ) {
                        $closestTitle.addClass('is-hidden');
                    }
                }
            }
        });

        // var $closestMenu = $('.site-nav-mobile').find('.menu-mb-title');
         $(document).on('click', '.site-nav-mobile .menu-mb-title', function(event) {
            const $closestAction = $(event.target).closest('.dropdown');
            const $parentSiblings2 = $closestAction.siblings();
            const $openTitle = $(event.target).closest('.site-nav-dropdown').siblings();

            $closestAction.removeClass('is-open');
            $parentSiblings2.removeClass('is-hidden');
            $openTitle.removeClass('is-hidden');
        });
    }

    function terms_conditions() {
        if(!$('.terms_conditions_wrapper').length) {
            return;
        }

        var checkBox = $('.terms_conditions_wrapper input[type="checkbox"]');

        checkBox.each(function(){
            if ($(this).is(':checked')) {
                $(this).parent().next().removeClass('disabled');
            } else {
                $(this).parent().next().addClass('disabled');
            }
        });

        $(document).on('click', '.terms_conditions_wrapper .title', function(e) {
            e.preventDefault();
            var self = $(this),
                ipt = self.prev();

            if(!ipt.prop('checked')) {
                ipt.prop('checked', true);
                self.parent().next().removeClass('disabled');
            } else {
                ipt.prop('checked', false);
                self.parent().next().addClass('disabled');
            };
        })
    }

    function toggle_footer() {
        $('.footerMobile .footer-col--mobile .footer-info-heading').on('click', function() {
            $(this).parent().toggleClass('open-dropdown');
            $(this).parent().find('.footer-info-list').slideToggle();
            return;
        });
    }

    return {
        init: function() {
            toggle_menu();
            toggle_login();
            toggle_search();
            terms_conditions();
            toggle_dropdownMenu();
            toggle_footer();
        }
    }
})();

theme.instagram = (function() {
    function instagram() {
        if (!$('.home-instagram .instagram-load-more').length)
            return;

        var i, y;

        if ($(window).width() > 1024) {
            if(($('.home-instagram .item__ins').length) <= 7 ){
               $('.home-instagram .instagram-load-more').hide();
            }
            for (i = 1; i <= 7; i++) {
                $('.home-instagram .item__ins:nth-child('+i+')').removeClass('hide');
            }
        } else if ($(window).width() > 767) {
            for (i = 1; i <= 3; i++) {
                $('.home-instagram .item__ins:nth-child('+i+')').removeClass('hide');
            }
        } else {
            for (i = 1; i <= 4; i++) {
                $('.home-instagram .item__ins:nth-child('+i+')').removeClass('hide');
            }
        }
        
        $(document).on('click', '.home-instagram .instagram-load-more', function() {
            y = i;
            if ($(window).width() > 1024)
                i = i + 4;
            else
                i = i + 3;
            for (y; y <= i; y++) {
                $('.home-instagram .item__ins:nth-child('+y+')').removeClass('hide');
            }

            if (!$('.home-instagram .item__ins.hide').length)
                $('.home-instagram .instagram-load-more').remove();
        });

        $('[data-fancybox="images-instagram"]').fancybox({
            mobile : {
                clickContent : "close",
                clickSlide : "close"
            },
            buttons: [
                "zoom",
                //"share",
                "slideShow",
                //"fullScreen",
                //"download",
                // "thumbs",
                "close"
            ],
            animationEffect: "zoom-in-out",
            transitionEffect: "zoom-in-out",
            transitionDuration: 800
        });
    }
    function instagram2() {
        if (!$('.home-instagram-2 .instagram-load-more-2').length)
            return;

        var i, y;

        if ($(window).width() > 1024) {
            for (i = 1; i <= 6; i++) {
                $('.home-instagram-2 .item__ins:nth-child('+i+')').removeClass('hide');
            }
        } else if ($(window).width() > 767) {
            for (i = 1; i <= 3; i++) {
                $('.home-instagram-2 .item__ins:nth-child('+i+')').removeClass('hide');
            }
        } else {
            for (i = 1; i <= 4; i++) {
                $('.home-instagram-2 .item__ins:nth-child('+i+')').removeClass('hide');
            }
        }
        
        $(document).on('click', '.home-instagram-2 .instagram-load-more-2', function() {
            y = i;
            if ($(window).width() > 1024)
                i = i + 4;
            else
                i = i + 3;
            for (y; y <= i; y++) {
                $('.home-instagram-2 .item__ins:nth-child('+y+')').removeClass('hide');
            }

            if (!$('.home-instagram-2 .item__ins.hide').length)
                $('.home-instagram-2 .instagram-load-more-2').remove();
        });

        $('[data-fancybox="images-instagram"]').fancybox({
            mobile : {
                clickContent : "close",
                clickSlide : "close"
            },
            buttons: [
                "zoom",
                //"share",
                "slideShow",
                //"fullScreen",
                //"download",
                // "thumbs",
                "close"
            ],
            animationEffect: "zoom-in-out",
            transitionEffect: "zoom-in-out",
            transitionDuration: 800
        });
    }

    return {
        init: function() {
            instagram();
            instagram2();
            
        }
    }
})();

theme.lookbook = (function() {
    function Lookbook() {
        $('.lookbook__points-popup .point').on('click', function() {
            if ($('.lookbook__points-popup').hasClass('check_append')) {
                $('.lookbook__popup').removeClass('is-open');
                $('.lookbook__popup .custom-product-card').appendTo('.lookbook__points-popup.check_append');
                $('.lookbook__points-popup.check_append').removeClass('check_append');
            } else {
                if ($(this).parent().hasClass('check_append')) {
                    $('.lookbook__popup').removeClass('is-open');
                    $('.lookbook__popup .custom-product-card').appendTo('.lookbook__points-popup.check_append');
                    $('.lookbook__points-popup.check_append').removeClass('check_append');
                } else {
                    $('.lookbook__popup .custom-product-card').remove();

                    var $productWrapper = $(this).parent(),
                        $position = $productWrapper.offset(),
                        $product = $(this).siblings(),
                        $position_content = $('.lookbook').offset();

                    if ($(window).width() < 1024) {
                        $('.lookbook__popup').css({'top': 30, 'left': 20});
                    } else {
                        $('.lookbook__popup').css({'top': $position.top - $position_content.top - 100, 'left': $position.left - $position_content.left + 40});
                    }

                    $('.lookbook__popup').addClass('is-open');
                    $productWrapper.addClass('check_append');
                    $product.appendTo('.lookbook__popup');
                }
            }
        });    

        $('.lookbook__popup .close').on('click', function() {
            $('.lookbook__popup').removeClass('is-open');
            $('.lookbook__popup .custom-product-card').appendTo('.lookbook__points-popup.check_append');
            $('.lookbook__points-popup.check_append').removeClass('check_append');
        });

        $(document).on('click', function(event) {
            if (($(event.target).closest('.lookbook__popup').length === 0) && ($(event.target).closest('.lookbook__points-popup .point').length === 0)) {
                $('.lookbook__popup').removeClass('is-open');
                $('.lookbook__popup .custom-product-card').appendTo('.lookbook__points-popup.check_append');
                $('.lookbook__points-popup.check_append').removeClass('check_append');
            }
        });
    }
    function collection_hero_carousel() {
      $("[data-section-type='lookbook-section'] [data-slick]").each(function(index) {
          var $carousel = $(this);
          if ($carousel.length) {
              if (!$carousel.hasClass('slick-slider')) {
                  $carousel.slick();
              }
          }
      });
    }

    return {
        init: function() {
            Lookbook();
            collection_hero_carousel();
            
        }
    }
})();

theme.ProductTab = (function() {
    function load_ajax_product(handle, loadingElm, curTabContent, dataRow) {
        $.ajax({
            type: "get",
            url:  window.router + handle,
            cache: false,
            data: {
                view: 'json',
                limit: '&' + dataRow
            },
            beforeSend: function () {
                // loadingElm.html('<p>Loading ... please wait ...</p>');
            },
            success: function (data) {
                loadingElm.remove();
                if (handle == '/collections/?view=json') {
                    // loadingElm.html('<p>Please link to collections</p>').show();
                } else {

                    curTabContent.html($(data).html());
                    productCarousel(curTabContent);
                   
                    if (checkNeedToConvertCurrency()) {
                       Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
                    }
                    if ($('.shopify-product-reviews-badge').length && $('.spr-badge').length) {
                        return window.SPR.registerCallbacks(), window.SPR.initRatingHandler(), window.SPR.initDomEls(), window.SPR.loadProducts(), window.SPR.loadBadges();
                    }
                    
                };
               
            },
            complete: function() {
            },
            error: function (xhr, text) {
                loadingElm.text('Sorry, there are no products in this collection').show();
            }
        });
    }

    function active_collectionTab() {
        setTimeout(function(){  
                $("[data-section-type='collection-tabs']").each(function(index) {
                    var self = $(this),
                        listTabs = self.find('.nav-tabs'),
                        tabLink = listTabs.find('.nav-link'),
                        tabContent = self.find('.tab-pane'),
                        linkActive = self.find('.nav-tabs .nav-link.active'),
                        dataRow = self.find('.nav-tabs').data('row'),
                        activeTab = self.find('.tab-content .tab-pane.active');

                    load_ajax_product(linkActive.data('href'), activeTab.find('.halo-loading'), activeTab.find('.halo-row'), dataRow);

                    tabLink.on('click', function (e) {
                        e.preventDefault();
                        e.stopPropagation();

                        if($(this).hasClass('active')) {
                            return;
                        }

                        tabLink.removeClass('active');
                        tabContent.removeClass('active').removeClass('show');

                        var curTab = $(this),
                            curTabContent = $(curTab.attr('href'));

                        curTab.addClass('active');
                        curTabContent.addClass('active show');

                        if (curTabContent.find('.halo-loading').length) {
                            load_ajax_product(curTab.data('href'), curTabContent.find('.halo-loading'), curTabContent.find('.halo-row'), dataRow);
                            
                        }

                    });
                });

        }, 4500);
    }

    function productCarousel($carousel) {            
        if ($carousel.length) {
            if (!$carousel.hasClass('slick-slider')) {
                $carousel.slick();                
            } else {
                $carousel.slick('setPosition');
            }
        }  
    }

    function closeEmailModalWindow(newsletterWrapper,expire) {
        newsletterWrapper.hide(700);
        var inputChecked = newsletterWrapper.find('input[name="dismiss"]').prop('checked');
        if (inputChecked || !newsletterWrapper.find('input[name="dismiss"]').length)
            $.cookie('emailSubcribeModal', 'closed', {
                expires: expire,
                path: '/'
        });
    }

    function newsLetterPopup() {
        if (!$('#halo_newsletter').length) {
            return
        }
        var newsletterWrapper = $('#halo_newsletter'),
            overlay = newsletterWrapper.find('.popup-overlay'),
            closeWindow = newsletterWrapper.find('.close'),
            delay = $('.newsletterPopup').data('delay'),
            expire = $('.newsletterPopup').data('expire'),
            modalContent = newsletterWrapper.find('.newsletterPopup');

        if ($.cookie('emailSubcribeModal') != 'closed') {
            setTimeout(function () {
                newsletterWrapper.show(700);
            }, delay);
        };

        closeWindow.on('click', function (e) {
            e.preventDefault();
            closeEmailModalWindow(newsletterWrapper,expire);
        });

        overlay.on('click', function (e) {
            e.preventDefault();
            closeEmailModalWindow(newsletterWrapper,expire);
        });

        $('#mc_embed_signup form').submit(function () {
            if ($('#mc_embed_signup .email').val() != '') {
                closeEmailModalWindow(newsletterWrapper,expire);
            };
        });
    }

    function checkNeedToConvertCurrency() {
        return (window.show_multiple_currencies && Currency.currentCurrency != shopCurrency) || window.show_auto_currency;
    }

    return {
        init: function() {
            active_collectionTab();  
            newsLetterPopup();         
        }
    }
})();

theme.HaloAddOn = (function() {
   
    return {
        init: function() {
           
            this.progressBarShipping();
            this.updateVariant();
           
        },

        progressBarShipping: function() {
            if ($('.cart__progress_bar').length) {
                var $priceFreeShip = parseInt(theme.strings.priceFreeShipping) * 100;
                $.getJSON('/cart.js').then(
                    function(cart) {
                        var $cartTotalPrice =  cart.total_price,
                            $differencePrice = $priceFreeShip - $cartTotalPrice,
                            $percent = Math.floor(($cartTotalPrice * 100) / $priceFreeShip);

                        if($percent > 100)
                           $percent = 100;

                        if ($percent == 100) {
                            var progress = '<div class="progress"><div class="progress-bar progress-bar-striped bg-success progress-bar-animated" role="progressbar" style="width:'+ $percent +'%" aria-valuenow="'+ $percent +'" aria-valuemin="0" aria-valuemax="100">'+$percent+'%</div></div>';
                            $('.progress_bar_shipping').addClass('success');
                            $('.progress_bar_shipping').html(progress);
                            $('.progress_bar_shipping_message').html( theme.strings.freeShipping )
                        } else {
                            if ($percent < 50) {
                                var progress = '<div class="progress"><div class="progress-bar progress-bar-striped bg-danger progress-bar-animated" role="progressbar" style="width:'+ $percent +'%" aria-valuenow="'+ $percent +'" aria-valuemin="0" aria-valuemax="100">'+$percent+'%</div></div>';
                            } else {
                                var progress = '<div class="progress"><div class="progress-bar progress-bar-striped bg-warning progress-bar-animated" role="progressbar" style="width:'+ $percent +'%" aria-valuenow="'+ $percent +'" aria-valuemin="0" aria-valuemax="100">'+$percent+'%</div></div>';
                            }
                            var $price = theme.Currency.formatMoney($differencePrice, theme.moneyFormat);
                            $('.progress_bar_shipping').removeClass('success');
                            $('.progress_bar_shipping').html(progress);
                            $('.progress_bar_shipping_message').html( theme.strings.shippingMessage.replace('[price]', $price))
                        }

                        if (theme.HaloAddOn.checkNeedToConvertCurrency()) {
                            Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
                        }
                    }
                );
                
            }
        },

        updateVariant: function() {
            if (!$('.product-card__variant').length) {
                return;
            }

            $(document).on('click', '.product-card__variant .product-card__variant--item label', function() {
                var self = $(this),
                    $product = self.parents('.product-card'),
                    $variantName = self.data('name'),
                    $variantImage = self.data('image');

                    $('.product-card__variant .product-card__variant--item label').removeClass('active');
                    self.addClass('active');     
                 
                if ($variantImage != '') {
                    
                    $product.find('.product-card__img').attr('src', $variantImage );

                }
            });
        },

        showLoading: function() {
            $('.loading-modal').show();
        },

        hideLoading: function() {
            $('.loading-modal').hide();
        },
      
        checkNeedToConvertCurrency: function () {
            return (window.show_multiple_currencies && Currency.currentCurrency != shopCurrency) || window.show_auto_currency;
        }
    }
})();

$(document).ready(function() {
    var sections = new theme.Sections();

    sections.register('cart-template', theme.Cart);
    sections.register('product', theme.Product);
    sections.register('collection-template', theme.Filters);
    sections.register('product-template', theme.Product);
    sections.register('map', theme.Maps);
    sections.register('video-section', theme.VideoSection);
    sections.register('product-recommendations', theme.ProductRecommendations);
    sections.register('slideshow-section', theme.SlideshowSection);
    sections.register('cart-page', theme.cart_page);

    theme.header.init();
    theme.footer.init();
    theme.sidebar.init();
    theme.wishlist.init();
    theme.compare.init();
    theme.HaloAddOn.init();
    theme.collection.init();
    theme.halo_mobile.init();
    theme.product_card.init();
    theme.product_sticky_atc.init();
    theme.someone_purchased.init();
    theme.products_frequently_by_together.init();
    theme.product_quickview.init();
    theme.homepage_section.init();
    theme.instagram.init();
    theme.lookbook.init();
    theme.ProductTab.init();

    $(window).resize(function() {
        theme.header.init();
        theme.footer.init();
        theme.product_card.init();
        theme.homepage_section.init();
    });
});


theme.init = function() {
    theme.customerTemplates.init();

    // Theme-specific selectors to make tables scrollable
    var tableSelectors = '.rte table,' + '.custom__item-inner--html table';

    slate.rte.wrapTable({
        $tables: $(tableSelectors),
        tableWrapperClass: 'scrollable-wrapper'
    });

    // Theme-specific selectors to make iframes responsive
    var iframeSelectors =
        '.rte iframe[src*="youtube.com/embed"],' +
        '.rte iframe[src*="player.vimeo"],' +
        '.custom__item-inner--html iframe[src*="youtube.com/embed"],' +
        '.custom__item-inner--html iframe[src*="player.vimeo"]';

    slate.rte.wrapIframe({
        $iframes: $(iframeSelectors),
        iframeWrapperClass: 'video-wrapper'
    });

    // Common a11y fixes
    slate.a11y.pageLinkFocus($(window.location.hash));

    $('.in-page-link').on('click', function(evt) {
        slate.a11y.pageLinkFocus($(evt.currentTarget.hash));
    });

    $('a[href="#"]').on('click', function(evt) {
        evt.preventDefault();
    });

    slate.a11y.accessibleLinks({
        messages: {
            newWindow: theme.strings.newWindow,
            external: theme.strings.external,
            newWindowExternal: theme.strings.newWindowExternal
        },
        $links: $('a[href]:not([aria-describedby], .product-single__thumbnail)')
    });

    theme.FormStatus.init();

    // When the theme loads, lazysizes might load images before the "lazyloaded"
    // event listener has been attached. When this happens, the following function
    // hides the loading placeholders.
    function onLoadHideLazysizesAnimation() {
        $(selectors.image + '.lazyloaded')
            .closest(selectors.imageWithPlaceholderWrapper)
            .find(selectors.imagePlaceholder)
            .addClass(classes.hidden);
    }

    onLoadHideLazysizesAnimation();

    // Do the injection svg
    var mySVGsToInject = document.querySelectorAll('svg[data-src]');

    SVGInjector(mySVGsToInject);
};

$(theme.init);