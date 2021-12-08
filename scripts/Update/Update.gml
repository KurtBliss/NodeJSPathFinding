function Update(other_players){
	static OtherPlayers = [];
	with (Par_User) {
		user_active = false;
	}
	
	if is_array(other_players) {
		for (var i = 0; i < array_length(other_players); i+=1) {			
			var other_id = real(other_players[i].user_id);
			var other_x = real(other_players[i].user_x);
			var other_y = real(other_players[i].user_y);
			
			if (other_id == user_id) {
				continue;
			}
			
			with Par_User {
				if (other_id == user_id) {
					user_active = true;
					x = other_x;
					y = other_y;
					continue;
				}
			}
			
			
			with instance_create_depth(other_x, other_y, 0, Obj_Other_Player) {
				user_id = other_id;
				user_active = true;
			}
		}
	}
		
	with (Par_User) {
		if (!user_active) {
			instance_destroy();	
		}
	}
}

