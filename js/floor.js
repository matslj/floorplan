/**
 * Av: Mats Ljungquist
 */

var floor = floor || {};

/**
 * The main module for the application. The init method of this module is called
 * by the window.onload, after retrieving the necessary ajax-data.
 * 
 * @type object
 */
floor.app = (function() {
    // Dependencies
    var graph = floor.graph,
    loader = floor.loader,
    dataHandler = floor.dataHandler,
    constants = floor.constants,
    searchPanel = floor.searchPanel,
    utils = floor.utils,
    
    // Properties
    roomDataElement = null,
    hoverLayer = null,
    currentRoom = null,
    hoverId = null,
    bodyBR = null,
    col1BR = null,
    idMultiSelect = [],
    floorNumberElement = null,
    currentFloorNumber = 3,
    allFloors = null,
    tmplPresentation = null,
    tmplHover = null,
    self = null,
    moduleCode = "app",

    // Private methods
   /**
    * Goes through all rooms provided by the backend (floor.loader.data.rooms) and
    * binds events to each room and also sets/resets som attributes on each element.
    * <p>
    * Only rooms that are in the backend data should be made available for interaction.
    */
    bindEventHandlers = function(floorNumber) {
        var tempEl = null,
           // svg = graph.getSvg(),
           i = 0;
        for (i = loader.data.rooms.length; i--;) {
            if (floorNumber === loader.data.rooms[i].floor) {
                tempEl = graph.initSelectableElement(loader.data.rooms[i].id);

                // Add listeners
                utils.addListener(tempEl, 'click', selectRoom, moduleCode);
                utils.addListener(tempEl, 'mouseover', hoverRoom, moduleCode);
                utils.addListener(tempEl, 'mouseout', clearHover, moduleCode);
            }
        }
       // Instead of the event handling above, one can use a central eventhandler
       // for all svg. My imagnation thinks that this way is slower.
//       utils.addListener(svg, 'click', mainEventHandler);
//       utils.addListener(svg, 'mouseover', mainEventHandler);
//       utils.addListener(svg, 'mouseout', mainEventHandler);
    },
    
    /**
     * A central event handler for all svg events. I've tried
     * it and to me it seems slower than conneting a separate event
     * to each element. Maybe I'm imagining, but I'll keep this
     * method in the drawer and use the other.
     * 
     * @param {type} evt
     */
//    mainEventHandler = function(evt) {
//        var el = evt.target,
//            type = evt.type,
//            htmlClass = el.getAttribute("class");
//        
//        if (htmlClass && htmlClass.indexOf("fill-") >= 0) {
//            if (type === "click") {
//                self.clearMultiSelect();
//                self.selectRoomAction(el);
//            } else if (type === "mouseover") {
//                hoverRoomAction(el);
//            } else if (type === "mouseout") {
//               clearHoverAction(el);
//            }
//        }
//        evt.stopPropagation();
//    },

    selectRoom = function(evt) {
       self.clearMultiSelect();
       self.selectRoomAction(evt.target);
       evt.stopPropagation();
    },

    hoverRoom = function(evt) {
       hoverRoomAction(evt.target);
       evt.stopPropagation();
    },

    clearHover = function(evt) {
       clearHoverAction(evt.target);
       evt.stopPropagation();
    },
    
    _showRoom = function(roomId) {
        roomDataElement.innerHTML = _roomWrapper(roomId, tmplPresentation);
    },

    _roomWrapper = function(roomId, template) {
        var room = dataHandler.getRoomData(roomId),
            view = {},
            i = 0,
            length = 0;

        view.title = room.name;
        if (room.type === constants.CONFERENCE) {
            view.subTitle = "Konferensrum";
            view.class = "conference";
        } else if (typeof room.occupants !== "undefined") {
            view.occupants = [];
            for (i = 0, length = room.occupants.length; i < length; i++) {
                view.occupants.push({
                    name: room.occupants[i].name,
                    pic: room.occupants[i].pic
                });
            }
        } else {
            // empty room
            view.subTitle = "Tomt!";
            view.class = "emptyRoom";
        }
        return Mustache.render(template, view);
    },
    
    hoverRoomAction = function(element) {
        self.clearMultiSelect();
        if (!currentRoom || currentRoom.id !== element.id) {
            graph.fillHoverBG(element);
        }
        _displayHoverPopup(element);
    },

    clearHoverAction = function(element) {
        if (!currentRoom || currentRoom.id !== element.id) {
            graph.clearFill(element);
        }
        hoverId = "";
        hoverLayer.innerHTML = "";
    },
    
    _displayHoverPopup = function(el) {
        var bb = null,
            newEl = null,
            x = 0,
            y = 0;

        if (!hoverId || hoverId !== el.id) {
            hoverId = el.id;
            bb = el.getBoundingClientRect();
            // Calculate hover popup placement using bb displacements
            x = bb.left - bodyBR.left + (col1BR.left - bodyBR.left) + (bb.right - bb.left) + 5;
            y = bb.top - bodyBR.top + (col1BR.top - bodyBR.top) + ((bb.bottom - bb.top)/2);
            newEl = document.createElement("div");
            hoverLayer.innerHTML = "";
            newEl.setAttribute("class", "hoverBox");
            newEl.style.cssText = "top: " + y + "px; left: " + x + "px;";
            newEl.innerHTML = _roomWrapper(el.id, tmplHover);
            hoverLayer.appendChild(newEl);
        }
    };

    return {

        init: function() {
            self = this;
            
            // Set global DOM references.
            roomDataElement = document.getElementById("room-data");
            hoverLayer = document.getElementById("hoverLayer");
            floorNumberElement = document.getElementById("floorNumber");
            allFloors = document.querySelectorAll(".floorplan");
            utils.addClass(allFloors[0], constants.CLASS_SHOW_FLOOR);

            // Init templates
//            tmplPresentation = document.getElementById("tmpl-presentation").innerHTML;
//            tmplHover = document.getElementById("tmpl-hover").innerHTML;
            tmplPresentation = loader.templates["tmpl-presentation"];
            tmplHover = loader.templates["tmpl-hover"];
            Mustache.parse(tmplPresentation);
            Mustache.parse(tmplHover);

            // Init dependencies
            dataHandler.init();
            searchPanel.init();

            this.reload();
            
            console.log("- initializing complete -");
        },
        
        reload: function() {
            floor.utils.removeAllActiveListeners(moduleCode);
            // Retrieve bounding rects for the appropriate elements in the dom structure.
            // We only need the displaced elements.
            bodyBR = document.body.getBoundingClientRect(); // Needed to compensate for hover displacement
            col1BR = document.getElementById("col1").getBoundingClientRect(); // Needed to compensate for hover displacement
            
            graph.init(currentFloorNumber);
            // Binding event handlers
            bindEventHandlers(currentFloorNumber);
        },

        selectRoomAction: function(el) {
            self.deselectRoom();
            // el.style.cssText = el.style.cssText + "fill: " + floor.constants.clickColor + ";";
            graph.fillSelectedBG(el);
            _showRoom(el.id);
            currentRoom = el;
        },

        deselectRoom: function() {
            graph.clearFill(currentRoom);
            currentRoom = null;
            roomDataElement.innerHTML = "";
        },

        setMultiSelect: function(node) {
            idMultiSelect.push(node);
            graph.setClearHover(node, true);
        },

        clearMultiSelect: function() {
            var i = 0;
            if (idMultiSelect && idMultiSelect.length > 0) {
                for (i = idMultiSelect.length; i--;) {
                    graph.setClearHover(idMultiSelect[i], false); 
                }
                idMultiSelect.length = 0;
            }
        },
        
        getCurrentFloorNumber: function() {
            return currentFloorNumber;
        },
        
        floorChooserBtnAction: function(floorAdjustment) {
            var floorNumber = currentFloorNumber + parseInt(floorAdjustment, 10);
            if (floorNumber >= 1 && floorNumber <= 3) {
                floor.app.changeFloor(floorNumber);
            }
        },
        
        changeFloor: function(floorNumber) {
            floor.app.clearMultiSelect();
            currentFloorNumber = floorNumber;
            for(i = allFloors.length; i--;) {
                utils.removeClass(allFloors[i], constants.CLASS_SHOW_FLOOR);
            }
            var currentLevel = document.getElementById("level" + currentFloorNumber);
            utils.addClass(currentLevel, constants.CLASS_SHOW_FLOOR);
            floorNumberElement.innerHTML = currentFloorNumber;
            utils.manageArrows(currentFloorNumber);
            floor.app.reload();
        }
    };
}());

(function() {
    // Load event starting the initialization
    window.onload = function() {
        // Resources that should be loaded prior to application start
        var resources = [
            {
                path: "data.json",
                dataTarget: floor.loader.setData
            },
            {
                path: "templates.html",
                dataTarget: floor.loader.setTemplates
            }
        ];
        floor.loader.init(resources, floor.app.init, floor.app);
    };
}());