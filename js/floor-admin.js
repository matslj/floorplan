/* 
 * Av: Mats Ljungquist
 */
var floor = floor || {};

/**
 * Can be used to display the id-values of the room elements. The administrator
 * of the occupant - roomid relation use this to connect occupant with roomid on
 * the map.
 * 
 * @type Object
 */
floor.admin = (function () {
    // Dependencies
    var graph = floor.graph,
        constants = floor.constants,
        utils = floor.utils,
		loader = floor.loader,
        // graphPZ = floor.graphPanZoom,
    
    // Properties
    bodyBR = null,
    col1BR = null,
    hoverLayer = null,
    floorNumberElement = null,
    currentFloorNumber = 3,
    allFloors = null,
    
    // Methods
	markProcessedRooms = function(floorNumber) {
        var tempEl = null,
            i = 0;
        for (i = loader.data.rooms.length; i--;) {
            if (floorNumber === loader.data.rooms[i].floor) {
                tempEl = graph.fillProcessed(loader.data.rooms[i].id);
            }
        }
    },
	
    _displayHoverBox = function(el) {
        var bb = null,
            newEl = null,
            x = 0,
            y = 0;
        if (el) {
            bb = el.getBoundingClientRect();
            // Calculate hover popup placement using bb displacements
            x = bb.left - bodyBR.left + (col1BR.left - bodyBR.left);
            y = bb.top - bodyBR.top + (col1BR.top - bodyBR.top) + ((bb.bottom - bb.top)/2) + 10;
            newEl = document.createElement("div");
            newEl.setAttribute("class", "hoverBoxAdmin");
            newEl.style.cssText = "top: " + y + "px; left: " + x + "px;";
            newEl.innerHTML = el.id;
            hoverLayer.appendChild(newEl);
        }
    };
    
    return {
        init: function () {
            hoverLayer = document.getElementById("hoverLayer");
            floorNumberElement = document.getElementById("floorNumber");
            allFloors = document.querySelectorAll(".floorplan");
            utils.addClass(allFloors[0], constants.CLASS_ADMIN_SHOW_FLOOR);
            // The line below activates the pan-and-zoom tool
            // graphPZ.init(graph.getSvgDoc(), this.markSelectableRooms);
            this.markSelectableRooms(currentFloorNumber);
			markProcessedRooms(currentFloorNumber);
        },
        
        markSelectableRooms: function(floorNumber) {
            // Retrieve bounding rects for the appropriate elements in the dom structure.
            // We only need the displaced elements.
            bodyBR = document.body.getBoundingClientRect(); // Needed to compensate for hover displacement
            col1BR = document.getElementById("col1").getBoundingClientRect(); // Needed to compensate for hover displacement
            
            graph.init(currentFloorNumber);
            hoverLayer.innerHTML = "";
            switch (floorNumber) {
                case 3:
                    graph.processElementsInRange("g4452", "g4616", _displayHoverBox);
                    graph.processElementsInRange("g4640", "g4660", _displayHoverBox);
                    break;
                case 2:
                    graph.processElementsInRange("g2634", "g2722", _displayHoverBox);
                    graph.processElementsInRange("g2754", "g2842", _displayHoverBox);
                    graph.processElementsInRange("g2610", "g2618", _displayHoverBox);
                    break;
                case 1:
                    graph.processElementsInRange("g3048", "g3084", _displayHoverBox);
                    graph.processElementsInRange("g3116", "g3120", _displayHoverBox);
                    graph.processElementsInRange("g2916", "g2984", _displayHoverBox);
                    break;
                default:
            }
        },
        
        floorChooserBtnAction: function(floorAdjustment) {
            var floorNumber = currentFloorNumber + parseInt(floorAdjustment, 10);
            if (floorNumber >= 1 && floorNumber <= 3) {
                floor.admin.changeFloor(floorNumber);
            }
        },
        
        changeFloor: function(floorNumber) {
            currentFloorNumber = floorNumber;
            hoverLayer.innerHTML = '';
            for(i = allFloors.length; i--;) {
                utils.removeClass(allFloors[i], constants.CLASS_ADMIN_SHOW_FLOOR);
            }
            var currentLevel = document.getElementById("level" + currentFloorNumber);
            utils.addClass(currentLevel, constants.CLASS_ADMIN_SHOW_FLOOR);
            floorNumberElement.innerHTML = currentFloorNumber;
            utils.manageArrows(currentFloorNumber);
            floor.admin.markSelectableRooms(currentFloorNumber);
			markProcessedRooms(currentFloorNumber);
        }
        
    };
}());

/***************************
   Starta adminhanteringen
 ***************************/
(function () {
    window.onload = function () {
        // floor.admin.init(); // Old way
		
		// Resources that should be loaded prior to application start
        var resources = [
            {
                path: "../data.json",
                dataTarget: floor.loader.setData
            },
            {
                path: "../templates.html",
                dataTarget: floor.loader.setTemplates
            }
        ];
        floor.loader.init(resources, floor.admin.init, floor.admin);
    };
}());