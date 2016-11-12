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

```
--
-- Add default user(s)
--
INSERT INTO {$tUser} (accountUser, emailUser, nameUser, lastLoginUser, passwordUser, activeUser)
VALUES ('doe', 'doe@noreply.se', 'Jane Doe', NOW(), md5('doe'), TRUE);
    
--
-- Add default groups
--
INSERT INTO {$tGroup} (idGroup, nameGroup) VALUES ('usr', 'Regular users of the site');

--
-- Add default groupmembers
--
INSERT INTO {$tGroupMember} (GroupMember_idUser, GroupMember_idGroup)
	VALUES ((SELECT idUser FROM {$tUser} WHERE accountUser = 'doe'), 'usr');

```

