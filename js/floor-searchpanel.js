/**
 * Av: Mats Ljungquist
 */

var floor = floor || {};
/**
 * Module representing the search panel which includes:
 * <ul>
 * <li>Textfield for input text with search button
 * <li>Button for listing and on the map highlighting all empty rooms on the current floor
 * <li>Button for listing and on the map highlighting all conference rooms on the current floor
 * <li>The result list. The entries on this list are clickable and will upon click select on map.
 * </ul>
 */
floor.searchPanel = (function() {
    // Dependencies
    var dataHandler = floor.dataHandler,
        graph = floor.graph,
        utils = floor.utils,
        constants = floor.constants,
        loader = floor.loader,
        // has to be initialized in the init() method since when the modules are
        // loaded separatly this module is loaded before the app-module and at
        // that time the floor.app module is undefined.
        app = null,
        
        // Private constants
        ACC_PANEL = "accPanel",
        EMPTY_ROOMS_BTN = "empty-rooms-btn",
        CONFERENCE_ROOMS_BTN = "conference-rooms-btn",
        SEARCH_BUTTON = "search-button",
        SEARCH_FIELDS = ["name", "prof"],
        
        // Private properties
        pList = null,
        inputField = null,
        tmplList = null,
        
        // Private methods
        _bindEvents = function() {
            var el = document.getElementById(ACC_PANEL);
            // Bind filter button click and enter press to the same eventhandler.
            utils.addListener(el, "click", eventHandlerSearch);
            utils.addListener(el, "keydown", eventHandlerSearch);
            utils.addListener(pList, "click", eventHandlerList);
            //pList.addEventListener("mouseover", eventHandlerList, false);
            //pList.addEventListener("mouseout", eventHandlerList, false);
        },
        
        _displayNode = function(item) {
            var view = {};
        
            view.floor = item.floor;
            view.roomId = item.roomId;
            view.title = typeof item.name === "undefined" ? "-- Tomt rum --" : item.name;
            view.extras = [];
            if (item.type === constants.CONFERENCE) {
                view.extras.push("konferensrum");
                view.cls = "conference";
            } else if (typeof item.name !== "undefined") {
                view.extras.push(item.prof);
                view.cls = "office";
            } else if (typeof item.name === "undefined") {
                view.cls = "empty";
            }
            return view;
        },
        
        _displayResult = function(data) {
            var dataLength = data.length,
                i = 0,
                view = {
                    listItems : []
                };
            
            for(;i < dataLength; i++) {
                view.listItems.push(_displayNode(data[i]));
            }
            pList.innerHTML = Mustache.render(tmplList, view);
        },
        
        eventHandlerSearch = function(evt) {
            var evel = evt.target,
                buttonFunction = null,
                data = null;
            
            app.clearMultiSelect();
            if (evel.id && ((evel.id === EMPTY_ROOMS_BTN) || (evel.id === CONFERENCE_ROOMS_BTN))) {
                // Handle click on empty room btn or conf room button
                pList.innerHTML = "";
                app.deselectRoom();
                buttonFunction = evel.id === EMPTY_ROOMS_BTN ? dataHandler.getEmptyRooms : dataHandler.getConferenceRooms;
                data = [];
                buttonFunction(function(node) {
                    if (app.getCurrentFloorNumber() === node.floor) {
                        app.setMultiSelect(node);
                    }
                    data.push(node);
                });
                _displayResult(data);
            } else if (evt.which === 13 || evt.keyCode === 13 || evel.id && evel.id === SEARCH_BUTTON) {
                if (inputField.value) {
                    _displayResult(utils.searchTextFieldsInObject(dataHandler.occupants, inputField.value, SEARCH_FIELDS));
                } else {
                    // Show all
                    _displayResult(dataHandler.occupants);
                }
            }
            evt.stopPropagation();
            return false;
        },
        
        eventHandlerList = function(evt) {
            var evel = evt.target,
                roomId = null,
                svgTarget = null,
                floorNumber = 3;
        
            app.clearMultiSelect();
            if (evel.nodeName !== "LI") {
                evel = evel.parentNode;
            }
            floorNumber = parseInt(evel.getAttribute("data-floornr"),10);
            if (app.getCurrentFloorNumber() !== floorNumber) {
                app.changeFloor(floorNumber);
            }            
            roomId = evel.getAttribute("data-roomid");
            svgTarget = graph.getSvgElementById(roomId);
                    
            if (evel.nodeName === "LI") {
                app.selectRoomAction(svgTarget);
            }
            evt.stopPropagation();
            return false;
        };
    
    // Public interface
    return {
        
        init: function() {
            var data = dataHandler.occupants;
            
            app = floor.app;
        
            if (data === null) {
                throw new Error("Error: Occupant data has not been initialized. Run floor.dataHandler.init()");
            }
            
            // Pre fetch references to dom elements
            inputField = document.getElementById("search-input");
            pList = document.getElementById("plist");
            
            // Load template
            // tmplList = document.getElementById("tmpl-list-item").innerHTML;
            tmplList = loader.templates["tmpl-list-item"];
            Mustache.parse(tmplList);
            
            // Clear input field
            inputField.value = "";
            inputField.focus();

            _displayResult(data);
            
            _bindEvents();
        }
    };
}());