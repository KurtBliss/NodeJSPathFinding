
var type_all = 0;
var type_points = 1;
var type = type_points;

var cell_width = 32;
var cell_height = 32;

if (type == type_all) {
	var cells = array_create( room_width/cell_width, array_create(room_height/cell_height, 0) );
} 

// Added for use with different pathfinding lib...
if (type == type_points) { 
	var cells = [];
}

with (Obj_Wall)  {
	place_snapped(cell_width, cell_height);
	if place_meeting(x, y, Obj_Wall) {
		instance_destroy();
	} else {
		if (type == type_all)
			cells[x/cell_width][y/cell_height]=1;
		else if (type == type_points) {
			cells[array_length(cells)] = [
				x/cell_width,
				y/cell_height
			];
		}
	}
}

var data = json_stringify(cells);

show_debug_message("Printing wall layout json--------------------------------------------\n\n\n"
	+ data + "\n\n\n--------------------------------------------");

//if (show_question("Copy wall data json to clipboard?")) {
//	clipboard_set_text(data);	
//}

