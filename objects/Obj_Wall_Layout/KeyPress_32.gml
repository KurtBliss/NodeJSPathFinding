var cell_width = 32;
var cell_height = 32;
var cells = array_create( room_width/cell_width, array_create(room_height/cell_height, 0) );

with (Obj_Wall)  {
	place_snapped(cell_width, cell_height);
	if place_meeting(x, y, Obj_Wall) {
		instance_destroy();
	} else {
		cells[x/cell_width][y/cell_height]=1;
	}
}

var data = json_stringify(cells);

show_debug_message("Printing wall layout json--------------------------------------------\n\n\n"
	+ data + "\n\n\n--------------------------------------------");

if (show_question("Copy wall data json to clipboard?")) {
	clipboard_set_text(data);	
}

