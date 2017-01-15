/**
 * Av: Mats Ljungquist
 */

var floor = floor || {};
/**
 * This module is for interacting with the svg document. All svg interaction
 * should go through this module.
 * 
 * @type Object
 */
floor.graph = (function() {

    var svgDoc = null,
        svg = null,
        svgns = null,
        
        FILL_HOVER = "fill-hover",
	FILL_PROCESSED = "fill-processed",
        FILL_SELECTED = "fill-selected",
        FILL_NONE = "fill-none";
    
    return {
        
        init: function(floorNumber) {
            svgDoc = document.getElementById("floor" + floorNumber).getSVGDocument();
            svg = svgDoc.getElementById("svg2");
            // Set svg namespace
            svgns = svg.namespaceURI;
        },

        initSelectableElement: function(svgElementId) {
            var tempEl = svgDoc.getElementById(svgElementId);

            tempEl.setAttribute("pointer-events", "visible");
            tempEl.setAttribute("class", FILL_NONE);
            // Remove fill style from all elements that are interactable.
            // Their interaction policies are replaced by the class set on the line above
            tempEl.style.cssText = tempEl.style.cssText.replace(/fill.?:.?none;/, "");

            return tempEl;
        },
        
        /**
         * The paths for a room in the currently used .svg-document are each
         * contained in their own g-element. This method traverses all the path
         * elements within the g-elements in the specified range and applies a
         * callback on each of them.
         * 
         * @param {type} fromGId
         * @param {type} toGId
         * @param {type} callback
         */
        processElementsInRange: function(fromGId, toGId, callback) {
            var currentEl = svgDoc.getElementById(fromGId),
                child = null;
            while (currentEl) {
                child = currentEl.firstChild;
                child.setAttribute("class", FILL_HOVER);
                child.style.cssText = child.style.cssText.replace(/fill.?:.?none;/, "");
                callback(child);
                currentEl = currentEl.id === toGId ? null : currentEl.nextSibling;
            }
        },
        
        getSvgDoc: function() {
            return svgDoc;
        },
        
        getSvg: function() {
            return svg;
        },
        
        getSvgElementById : function(id) {
            return svgDoc.getElementById(id);
        },
        
        drawTextBox: function(x, y, aText) {
            var frag = svgDoc.createDocumentFragment(),
                rect = svgDoc.createElementNS(svgns, "rect"),
                text = svgDoc.createElementNS(svgns, "text"),
                g10 = svgDoc.getElementById("g10");
            
            rect.setAttribute("x", x);
            rect.setAttribute("y", y);
            rect.setAttribute("width", 50);
            rect.setAttribute("height", 50);
            rect.setAttribute("fill", "white");
            rect.setAttribute("stroke", "black");
            rect.setAttribute("stroke-width", 2);
            frag.appendChild(rect);
            
            text.setAttribute("x", x+10);
            text.setAttribute("y", y+10);
            text.textContent = "hejsan";
            frag.appendChild(text);
            
            g10.appendChild(frag);
        },
        
        createSvgNodeFromNode: function (svgElementId) {
            var el = svgDoc.getElementById(svgElementId),
                path = svgDoc.createElementNS(svgns, "path");

            path.setAttribute("id", el.id + "hover");
            path.setAttribute("d", el.getAttribute("d"));
            path.setAttribute("class", "svgHover");
            path.setAttribute("style", "fill:yellow;stroke:#000000;stroke-width:0.07;");
            el.parentNode.insertBefore(path, el); // keep old element on top
        },

    //    clearHoverClearBG: function (element) {
    //        element.style.cssText = element.style.cssText.replace(/fill.?:.?yellow;/, "fill: none;");
    //        this.clearHover();
    //    },

		fillProcessed: function(svgElementId) {
			var tempEl = svgDoc.getElementById(svgElementId);
            tempEl.setAttribute("class", FILL_PROCESSED);
        },
	
        fillHoverBG: function(svgElement) {
            svgElement.setAttribute("class", FILL_HOVER);
        },

        fillSelectedBG: function(svgElement) {
            svgElement.setAttribute("class", FILL_SELECTED);
        },

        clearFill: function(svgElement) {
            if (svgElement) {
                svgElement.setAttribute("class", FILL_NONE);
            }
        },

        setClearHover: function(node, set) {
            var fill = set ? FILL_HOVER : FILL_NONE,
                svgEl = null;
            svgEl = svgDoc.getElementById(node.id);
            svgEl.setAttribute("class", fill);
        }
    };
}());