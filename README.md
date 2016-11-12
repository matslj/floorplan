# Floorplan
by Mats Ljungquist

## What?
The application consists of two columns and a simple admin navbar and page. The admin
page displays the element ids of the rooms in the svgs.

### Column one
Interactive floorplans. The floorplans themselves are svg-documents and they are not
included in this repository (the svg floorplans are not my property). When hovering
over a room in the floorplan a popup div with information on the room is displayed
next to the room, and if the room is clicked more details are presented
about the room and its inhabitants (if any). The inhabitants are presented with photos
(the photos are not included - not my property). The information about the rooms
are stored in a json file (data.json - not included - I do not want to disclose names
and other info regarding my (in this case) coworkers without their consent).

### Column two
A simple search panel. Parts of words (and names) can be searched/filtered upon.
If a room is clicked in the resulting list it works in the same way as click on
the svg.

## Installation

Without svg-files, the data.json-file and images, there's no working example.

If they were there, there would be no need for installation other than dropping
the project folder into your webserver (however - everything unminified and unconcatenated).

As a reminder to myself in future work:

Add the following styling to the svg-files.

```
<style type="text/css">

    .fill-none {
        fill: none;
    }
    
    .fill-selected {
        fill: green;
    }
    
    .fill-hover {
        fill: yellow;
    }
               
    /* Zoom and Pan */
    .compass{
        fill:  #fff;
        stroke:  #000;
        stroke-width:  1.5;
    }
    .button{
        fill:  #225EA8;
        stroke:  #0C2C84;
        stroke-miterlimit:	6;
        stroke-linecap:  round;
    }
    .button:hover{
        stroke-width:  2;
    }
    .plus-minus{
        fill:  #fff;
        pointer-events: none;
    }           
  </style>
```

