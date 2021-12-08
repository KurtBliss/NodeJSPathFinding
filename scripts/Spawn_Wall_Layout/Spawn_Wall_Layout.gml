function Spawn_Wall_Layout(data){
	for (var xi = 0; xi < array_length(data); ++xi) {
	    for (var yi = 0; yi < array_length(data[xi]); ++yi) {
			if (real(data[xi][yi]) == 1) {
				instance_create_depth(xi * 32, yi * 32, 0, Obj_Wall);
			}
		}
	}
}