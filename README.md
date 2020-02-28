edit node tab:

clicking 'save as new category' takes the current custom attributes and saves
those as a new category. 
currently, if another category was selected,
it does not apply those values to the new category... just the set custom attrs.

---

####TO DO:

##need to haves
+ ~~Automatically go to edit screen when clicking on a node~~
+ ~~auto select the new node~~
+ ~~Make slider component~~
+ ~~Add delete button onto edit node screen~~
+ ~~BUG: have link distances auto load saved values~~

In Progress:
+ Print out a pdf
+  - a. Select proportions by using svg mask
+ Add shadow under unanchored nodes

To Do:
+ Write undo history with timestamps
+ A Notes page on the left hand side- 
+  - a. With text editor
+  - b. Attached Images

+ Create up to five documents
+ Click on a node, then option to create connected node on next click

+ Unlock all as an option
+ Lock all as an option

+ ‘Friction’ setting
+ Download the JSON file?
+ Color picker for node/category

+ If no node selected, only show add node, no edit options


##nice to haves
+ 3D version
+ Group groups
+ Rotate Canvas
+ Psychadelic backgrounds
+ Combine documents together
+ Option to combine overlapping node names
+ Option to go step by step through each overlapping name
+ Multi select mode
+ Edit multi select panel
+ Move multiple selected
+ Drag box to select
+ Option to use attachment as node mask
+ Unlink selected nodes button should be on main menu if nodes are selected,
+ detect shift select
+ Option to auto-save every move on, Autosave on edit screens
+ Have a new node connect to all selected nodes
+ Select all global button
+ Link to bookmark on the web
+ Import your bookmarks!
+ Views or frames (prezzi style)

## mvp user account
+ User registration
+ Encrypt the user data

##mvp file sharing

+ post mvp - Connect to other user, create an online space (Elixir stuff)
+ Post mvp: ability to change nodes to squares, change dimensions
+ Make private or public (user gets 1 private 4 public files)
+ Multi-user-mode - fire local actions but log as user2
+ Can’t select not another user has selected.
+ Emit your image
+ Image merge  if 2 people work on it and save different versions- resolve or combine options

features:
encapsulation
privacy


code written to adapt to additional features

older users locked in to a lower price

technique of only transferring checked edited items
to prevent from other items that were
experimented with but then disabled. this step
can discard that data and only select the wanted
changes. plucks those only and overwrites those.

other things like changing a max range on a slider
will update that atribute's max range (rangeMax and rangeMin
are saved in a flat structure along with the other global
properties) these rules apply at the app level,
not the node level. a max range value for node radius
is updated in the globalSettings page and doesn't
need to be checked to save an updated value.
so, someone could possibly increase the radius max range value
and then deselet the radius on a node and it would still update.
you don't have to go into global settings to edit this.
but... it should also be available on the globel edit
screen.

