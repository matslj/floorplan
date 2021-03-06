/**
 * Utils module.
 * 
 * Av: Mats Ljungquist
 */

var floor = floor || {};
floor.utils = (function() {
    var addListener = null,
        removeListener = null,
        activeListeners = [];
        
    // 'Class' initialization of x-browser listener handling
    if (typeof window.addEventListener === 'function') {
        addListener = function(el, type, fn) {
            el.addEventListener(type, fn, false);
            return el;
        };
        removeListener = function(el, type, fn) {
            el.removeEventListener(type, fn, false);
        };
    } else if (typeof document.attachEvent === 'function') { // IE
        addListener = function(el, type, fn) {
            el.attachEvent('on' + type, fn);
            return el;
        };
        removeListener = function(el, type, fn) {
            el.detachEvent('on' + type, fn);
        };
    } else { // Older browsers
        addListener = function(el, type, fn) {
            el['on' + type] = fn;
            return el;
        };
        removeListener = function(el, type, fn) {
            el['on' + type] = null;
        };
    }
    
    return {
        /**
         * Adds an event listener for designated element event.
         * 
         * @param {element} el the element on which a listener is added
         * @param {string} type the type of event to listen for
         * @param {function} fn the eventhandler to use
         * @param {string} es the eventgroup (if any) that this listener belongs to
         * @returns {@var;fn}
         */
        addListener: function(el, type, fn, es) {
            activeListeners.push({
               el: el,
               type: type,
               fn: fn,
               es: es
            });
            return addListener(el, type, fn);
        },
        removeListener: removeListener,
        
        /**
         * Removes all active listeners. With the paramter es set
         * only the events within the eventgroup given by es will
         * be removed.
         * 
         * @param {type} es
         * @returns {undefined}
         */
        removeAllActiveListeners: function(es) {
            var i = activeListeners.length,
                obj = null,
                remainingListeners = [];
            for (;i--;) {
                obj = activeListeners[i];
                if (!es || (es && obj.es === es)) {
                    removeListener(obj.el, obj.type, obj.fn);
                } else {
                    remainingListeners.push(obj);
                }
            }
            activeListeners = remainingListeners;
        },
        
        removeChildNodes: function (el) {
            var i = el.childNodes.length;
            for (;i--;) {
                el.removeChild(el.childNodes[i]);
            }
        },
        
        /**
         * Bind a function/method to a specific object, so that 'this' in the
         * function/method always points to the bound object. Especially useful
         * for callbacks.
         * 
         * @param {type} o the object to bind m to
         * @param {type} m the method/function that should be bound
         * @returns {Function} the original method/function in a bound form
         */
        bind: function(o, m) {
            return function() {
                return m.apply(o, [].slice.call(arguments));
            };
        },
        
        addClass: function(element, theClassName) {
            element.className += (" " + theClassName);
        },
        
        removeClass: function(element, theClassName) {
            var regex = new RegExp('(?:^|\\s)' + theClassName + '(?:\\s|$)');
            element.className = element.className.replace(regex, ' ');
        },
        
        /**
         * Manages enabling/disabling of the arrows on the change
         * floor buttons.
         * @param {number} the new floor number
         */
        manageArrows: function(aFloorNumber) {
            var back = document.querySelector("#floor-back i");
            var forward = document.querySelector("#floor-forward i");
            this.removeClass(back, "md-inactive");
            this.removeClass(forward, "md-inactive");
            if (1 === aFloorNumber) {
                this.addClass(back, "md-inactive");
            } else if (3 === aFloorNumber) {
                this.addClass(forward, "md-inactive");
            }
        },

        /**
         * Searches through the chosen string (or number) fields of the objects in an array for a match
         * of searchString. Only the first level strings (or numbers) are searched (so not strings
         * in subobjects). Matching string sequences in the result are em-marked.
         * 
         * @param {type} objArray the array of objects to be searched through
         * @param {type} searchString the search string
         * @param {Array} searchableFields the names of the string field properties that
         *               will be searched. If for example this array contains the values
         *               name and prof, only the strings and numbers of those properties will be searched.
         * @returns {Array|floor.utils.searchTextFieldsInObject.returnArray} the result of the search
         */
        searchTextFieldsInObject: function (objArray, searchString, searchableFields) {
            var index = -1,
                i = 0,
                length = objArray.length,
                searchStrLength = searchString.length,
                key = null,
                obj = null,
                tempStr = null,
                tempObj = null,
                matchFound = false,
                returnArray = []
				iRef = null;

            for (; i < length; i++) {
                obj = objArray[i];
                tempObj = {};
                matchFound = false;
                for (key in obj) {
                    if (obj.hasOwnProperty(key)) {
						iRef = obj[key];
                        if (searchableFields.indexOf(key) >= 0) {
							if (typeof iRef === "number") {
								// Convert to string
								iRef = "" + iRef;
							}
                            if (typeof iRef === "string") {
                                index = iRef.toLowerCase().indexOf(searchString);
                                if (index >= 0) {
                                    tempStr = iRef.substring(0, index);
                                    tempStr += "<em class='match'>" + iRef.substring(index, index + searchStrLength) + "</em>";
                                    tempStr += iRef.substr(index + searchStrLength);
                                    tempObj[key] = tempStr;
                                    matchFound = true;
                                    continue;
                                }
                            } else {
                                throw new Error("Only string properties should be searchable");
                            }
                        }
                        tempObj[key] = iRef;
                    }
                }
                if (matchFound) {
                    returnArray.push(tempObj);
                }
            }
            return returnArray;
        }
    };
}());