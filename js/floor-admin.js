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
        // graphPZ = floor.graphPanZoom,
    
    // Properties
    bodyBR = null,
    col1BR = null,
    hoverLayer = null,
    floorNumberElement = null,
    currentFloorNumber = 3,
    allFloors = null,
    
    // Methods
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
    },
    
    _manageArrows = function(aFloorNumber) {
            var back = document.querySelector("#floor-back i");
            var forward = document.querySelector("#floor-forward i");
            back.className = back.className.replace(new RegExp('(?:^|\\s)md-inactive(?:\\s|$)'), ' ');
            forward.className = forward.className.replace(new RegExp('(?:^|\\s)md-inactive(?:\\s|$)'), ' ');
            if (1 === aFloorNumber) {
                back.className = back.className + " md-inactive";
            } else if (3 === aFloorNumber) {
                forward.className = forward.className + " md-inactive";
            }
    };
    
    return {
        init: function () {
            hoverLayer = document.getElementById("hoverLayer");
            floorNumberElement = document.getElementById("floorNumber");
            allFloors = document.querySelectorAll(".floorplan");
            allFloors[0].style.display = 'block';
            
            // Retrieve bounding rects for the appropriate elements in the dom structure.
            // We only need the displaced elements.
//            bodyBR = document.body.getBoundingClientRect(); // Needed to compensate for hover displacement
//            col1BR = document.getElementById("col1").getBoundingClientRect(); // Needed to compensate for hover displacement
//            
            // graph.init(currentFloorNumber);
            // The line below activates the pan-and-zoom tool
            // graphPZ.init(graph.getSvgDoc(), this.markSelectableRooms);
            this.markSelectableRooms(currentFloorNumber);
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
                allFloors[i].style.display = 'none';
            }
            var currentLevel = document.getElementById("level" + currentFloorNumber);
            currentLevel.style.display = "block";
            floorNumberElement.innerHTML = currentFloorNumber;
            _manageArrows(currentFloorNumber);
            floor.admin.markSelectableRooms(currentFloorNumber);
        }
        
    };
}());

/***************************
   Starta adminhanteringen
 ***************************/
(function () {
    window.onload = function () {
        floor.admin.init();
    };
}());