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
        
        /**
         * Performing an ajax request and executing a callback upon successful
         * completion of the request.
         * <p>
         * Not adapted for older ways of performing ajax requests.
         * 
         * @param {String} url the url the resource ajaxed resource
         * @param {function} callback the callback to be executed on successful completion of request
         */
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
            // Start - disable caching
            xhr.setRequestHeader("Pragma", "no-cache");
            xhr.setRequestHeader("Cache-Control", "no-store, no-cache, must-revalidate, post-check=0, pre-check=0");
            xhr.setRequestHeader("Expires", 0);
            xhr.setRequestHeader("Last-Modified", new Date(0));
            xhr.setRequestHeader("If-Modified-Since", new Date(0));
            // End - disable caching
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
                    console.log("All resources loaded - starting application");
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
         * Takes the content of a template file (a string) and splits the content into
         * separate templates and stores these templates in an associative array. This
         * array will later on be used by the mustache template creator.
         * <p>
         * Course of action: Parses inputstring for script-tags, retrieves each tags id
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

            // Create an intermediate DOM container and set its content to the 
            // template input string. In this case the DOM container is a div
            // but the type of element does not matter.
            intermediateContainer.innerHTML = theTemplatesAsOneString;

            // Transfer content to fragment
            while (intermediateContainer.childNodes.length > 0) {
                fragment.appendChild(intermediateContainer.childNodes[0]);
            }
            
            // Query fragment for all script-elements
            scripts = fragment.querySelectorAll('script');
            
            // Store the script elements, with all its content, in an associative
            // array where the template id is key.
            for (i = 0; i < scripts.length; i++) {
                floor.loader.templates[scripts[i].id] = scripts[i].innerHTML;
            }
        },

        /**
         * Initializationmethod for the loader. If any resources needs to get loaded
         * before the rest of the application, this method has to be called.
         * 
         * @param {type} aResourceArray an array of resources to be loaded. for 
         *                              format see loadResource above.
         * @param {type} anAppInitMehod the method to call when initialization is complete
         * @param {type} anAppObject a reference to the object which contains the init-method
         *                           in the previous parameter. This in order to preserve
         *                           'this' for that object.
         */
        init: function(aResourceArray, anAppInitMehod, anAppObject) {
            appInitMethod = anAppInitMehod;
            appObject = anAppObject;
            resources = aResourceArray;
            
            loadResource();
        }
    };
}());