/**
 * Av: Mats Ljungquist
 */

var floor = floor || {};

/**
 * Hämtar via ajax http-GET den data och de eventuella resurser som applikationen
 * är beroende av.
 * 
 * @type type
 */
floor.loader = (function() {
    var resources = null,
        appInitMethod = null,
        appObject =  null,
        
        request = function(url, callback) {
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = (function (myxhr) {
                return function () {
                    if (myxhr.readyState === 4 && myxhr.status === 200) {
                        callback(myxhr);
                    }
                };
            }(xhr));
            xhr.open('GET', url, true);
            xhr.send('');
        },
        
        /**
         * Calls itself recursively until there are no more
         * resources to process. After that the init method
         * for the application is called.
         * <br>
         * This method performs ajax calls, one after the other (not
         * making the next call until the previous is complete), until all
         * resources has been processed.
         * <br>
         * The resources array that it pops resources from must have the format
         * <pre>
         *   [
         *     { 
         *       path: -path to external resource-,
         *       dataTarget: -a ref to a function with one parameter. this function
         *                    acts as a setter/adder for loaded data-
         *     }
         *   ]
         * </pre>
         * Resources are processed differently based on the file extension.
         * Files ending with .json will be parsed as json, all other formats are
         * treated as strings.
         */
        loadResource = function() {
            var obj = resources.pop(),
                dotIndex = obj.path.lastIndexOf(".") + 1,
                ext = obj.path.substring(dotIndex, obj.path.length);
            
            console.log("loading resource - path: " + obj.path + " with the extension: " + ext);
            request(obj.path, function(xhr) {
                var result = xhr.responseText;
                if (ext === "json") {
                    result = JSON.parse(result);
                }
                obj.dataTarget(result);
                if (resources.length === 0) {
                    console.log("Starting app");
                    appInitMethod.call(appObject);
                } else {
                    loadResource();
                }
            });
        };
        
    return {
        
        /**
         * Data about the content of the rooms in the floor plan.
         */
        data: null,
        
        /** 
         * All the templates that the application is using, stored as key value
         * pairs, where the key is the id of the template and where the value is
         * the (html + mustache) content of the template.
         */
        templates: {},
        
        setData : function(theData) {
            floor.loader.data = theData;
        },
        
        /**
         * Parses the inputstring after script-tags, retrieves each tags id
         * and use this id as a key in order to store the script content in the
         * templates-object.
         * 
         * @param {type} theTemplatesAsOneString
         */
        setTemplates : function(theTemplatesAsOneString) {
            var fragment = document.createDocumentFragment(),
                intermediateContainer = document.createElement('div'),
                scripts = null,
                i = 0;

            intermediateContainer.innerHTML = theTemplatesAsOneString;

            while (intermediateContainer.childNodes.length > 0) {
                fragment.appendChild(intermediateContainer.childNodes[0]);
            }
            
            scripts = fragment.querySelectorAll('script');
            
            for (i = 0; i < scripts.length; i++) {
                floor.loader.templates[scripts[i].id] = scripts[i].innerHTML;
            }
        },

        init: function(aResourceArray, anAppInitMehod, anAppObject) {
            appInitMethod = anAppInitMehod;
            appObject = anAppObject;
            resources = aResourceArray;
            
            loadResource();
        }
    };
}());