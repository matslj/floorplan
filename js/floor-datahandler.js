/**
 * Av: Mats Ljungquist
 */

var floor = floor || {};

/**
 * Ett arbetsgränssnitt mot uppläst data (floor.loader.data).
 * 
 * @type type
 */
floor.dataHandler = (function() {
    // Dependencies
    var loader = floor.loader,
        constants = floor.constants;
    
    return {
        occupants: null,
        init: function () {
            var i = 0, j = 0,
                length = loader.data.rooms.length;

            if (loader.data === null) {
                throw new Error("Error: Data has not been initialized. Run floor.loader.init()");
            }

            this.occupants = [];

            // Flatten the data structure (to make it easy to search)
            for (; i < length; i++) {
                // Handling offices with occupants (flatten occupant structure into man structure)
                if (loader.data.rooms[i].type === constants.OFFICE && loader.data.rooms[i].occupants) {
                    for (j = 0; j < floor.loader.data.rooms[i].occupants.length; j++) {
                        loader.data.rooms[i].occupants[j].roomId = loader.data.rooms[i].id;
                        loader.data.rooms[i].occupants[j].floor = loader.data.rooms[i].floor;
                        this.occupants.push(loader.data.rooms[i].occupants[j]);
                    }
                } else {
                    // Handling empty rooms and conference rooms
                    floor.loader.data.rooms[i].roomId = loader.data.rooms[i].id;
                    this.occupants.push(loader.data.rooms[i]);
                }
            }

            // Sort the rooms by occupants name
            this.occupants.sort(function (a, b) {
                if (typeof a.name === "undefined" && typeof b.name !== "undefined")
                    return -1;
                if (typeof a.name !== "undefined" && typeof b.name === "undefined")
                    return 1;
                if (typeof a.name === "undefined" && typeof b.name === "undefined")
                    return 0;
                if (a.name < b.name)
                    return -1;
                if (a.name > b.name)
                    return 1;
                return 0;
            });
        },

        getRoomData: function (roomId) {
            var i = 0;

            for (i = loader.data.rooms.length; i--;) {
                if (loader.data.rooms[i].id === roomId) {
                    return loader.data.rooms[i];
                }
            }
            return null;
        },

        getEmptyRooms: function(callback) {
            var i = 0,
                length = loader.data.rooms.length;

            for (; i < length; i++) {
                if (loader.data.rooms[i].type === constants.OFFICE && 
                        typeof loader.data.rooms[i].occupants === "undefined") {
                    callback(loader.data.rooms[i]);
                }
            }
        },

        getConferenceRooms: function(callback) {
            var i = 0,
                length = loader.data.rooms.length;

            for (; i < length; i++) {
                if (loader.data.rooms[i].type === constants.CONFERENCE) {
                    callback(loader.data.rooms[i]);
                }
            }
        }
    };
}());