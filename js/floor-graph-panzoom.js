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
floor.graphPanZoom = (function() {
    var utils = floor.utils,
    
        svgDoc = null,
        svg = null,
        svgns = null,
        transMatrix = [1,0,0,1,0,0],
        mapMatrix = null,
        width = 0,
        height = 0,
        callback;
    
    return {
        
        init: function(aSvgDoc, aCallback) {
            var frag = null;
            callback = aCallback;
            
            svgDoc = aSvgDoc;
            frag = svgDoc.createDocumentFragment();
            svg = svgDoc.getElementsByTagName("svg")[0];
            // Set svg namespace
            svgns = svg.namespaceURI;

            transMatrix = [1.25,0,0,-1.25,0,744.095]; // [1,0,0,1,0,0],
            
	    mapMatrix = svgDoc.getElementById("g10");
	    width  = svg.getAttributeNS(null, "width");
	    height = svg.getAttributeNS(null, "height");
            
            frag.appendChild(this.form("circle", {
                cx:"50",
                cy:"50",
                r:"42",
                fill: "white",
                opacity: "0.75"
            }));
            
            frag.appendChild(this.form("path", {
                class:"button",
                d:"M50 10 l12 20 a40,70 0 0,0 -24,0z"
            }, function() {
                var x = 0,
                    y = 50,
                    callback = callback;
                floor.graphPanZoom.pan(x,y);
            }));
            frag.appendChild(this.form("path", {
                class:"button",
                d:"M10 50 l20 -12 a70,40 0 0,0 0,24z"
            }, function() {
                var x = 50,
                    y = 0,
                    callback = callback;
                floor.graphPanZoom.pan(x,y);
            }));
            frag.appendChild(this.form("path", {
                class:"button",
                d:"M50 90 l12 -20 a40,70 0 0,1 -24,0z"
            }, function() {
                var x = 0,
                    y = -50,
                    callback = callback;
                floor.graphPanZoom.pan(x,y);
            }));
            frag.appendChild(this.form("path", {
                class:"button",
                d:"M90 50 l-20 -12 a70,40 0 0,1 0,24z"
            }, function() {
                var x = -50,
                    y = 0,
                    callback = callback;
                floor.graphPanZoom.pan(x,y);
            }));
            frag.appendChild(this.form("circle", {
                cx:"50",
                cy:"50",
                r:"20",
                class:"compass"
            }));
            frag.appendChild(this.form("circle", {
                cx:"50",
                cy:"41",
                r:"8",
                class:"button"
            }, function() {
                var z=0.8,
                    callback = callback;
                floor.graphPanZoom.zoom(z);
            }));
            frag.appendChild(this.form("circle", {
                cx:"50",
                cy:"59",
                r:"8",
                class:"button"
            }, function() {
                var z=1.25,
                    callback = callback;
                floor.graphPanZoom.zoom(z);
            }));
            
            // Draw plus minus
            frag.appendChild(this.form("rect", {
                x:"46",
                y:"39.5",
                width:"8",
                height: "3",
                class:"plus-minus"
            }));
            frag.appendChild(this.form("rect", {
                x:"46",
                y:"57.5",
                width:"8",
                height: "3",
                class:"plus-minus"
            }));
            frag.appendChild(this.form("rect", {
                x:"48.5",
                y:"55",
                width:"3",
                height: "8",
                class:"plus-minus"
            }));
            svg.appendChild(frag);
        },
        
        pan: function(dx, dy) {
          transMatrix[4] += dx;
          transMatrix[5] += dy;

          var newMatrix = "matrix(" +  transMatrix.join(',') + ")";
          mapMatrix.setAttributeNS(null, "transform", newMatrix);
          callback();
        },
        
        zoom: function(scale)
        {
          for (var i=0; i<transMatrix.length; i++)
          {
            transMatrix[i] *= scale;
          }

          transMatrix[4] += (1-scale)*width/2;
          transMatrix[5] += (1-scale)*height/2;

          newMatrix = "matrix(" +  transMatrix.join(' ') + ")";
          mapMatrix.setAttributeNS(null, "transform", newMatrix);
          callback();
        },
        
        form: function(elementName, options, eventHandler) {
            var el = svgDoc.createElementNS(svgns, elementName),
                prop = null;
            
            for (prop in options) {
                if (options.hasOwnProperty(prop)) {
                    // console.log(prop + " - " + options[prop]);
                    el.setAttribute(prop, options[prop]);
                }
            }
            if (eventHandler) {
                utils.addListener(el, "click", eventHandler);
            }
            return el;
        }
    };
}());