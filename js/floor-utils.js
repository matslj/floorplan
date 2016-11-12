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
            console.log(activeListeners.length);
            activeListeners = remainingListeners;
            console.log(activeListeners.length);
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

        /**
         * Searches through the chosen string fields of the objects in an array for a match
         * of searchString. Only the first level strings are searched (so not strings
         * in subobjects). Matching string sequences in the result are em-marked.
         * 
         * @param {type} objArray the array of objects to be searched through
         * @param {type} searchString the search string
         * @param {Array} searchableFields the names of the string field properties that
         *               will be searched. If for example this array contains the values
         *               name and prof, only the strings of those properties will be searched.
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
                returnArray = [];

            for (; i < length; i++) {
                obj = objArray[i];
                tempObj = {};
                matchFound = false;
                for (key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        if (searchableFields.indexOf(key) >= 0) {
                            if (typeof obj[key] === "string") {
                                index = obj[key].toLowerCase().indexOf(searchString);
                                if (index >= 0) {
                                    tempStr = obj[key].substring(0, index);
                                    tempStr += "<em class='match'>" + obj[key].substring(index, index + searchStrLength) + "</em>";
                                    tempStr += obj[key].substr(index + searchStrLength);
                                    tempObj[key] = tempStr;
                                    matchFound = true;
                                    continue;
                                }
                            } else {
                                throw new Error("Only string properties should be searchable");
                            }
                        }
                        tempObj[key] = obj[key];
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