#macro MSG_LOGIN 0
#macro MSG_MOVE 1
#macro MSG_LOGOUT 2
#macro MSG_LOGIN_FAILED 3
#macro MSG_UPDATE 4

if is_string(async_load[? "result"]) begin  //////////////////////////////////////////////////////////////////////

var data = json_parse(async_load[? "result"]);

if variable_struct_exists(data, "msg") {
	switch (data.msg) {
	    case MSG_LOGIN:
			show_debug_message("MSG_LOGIN, " + string(data.user_id));
			user_id = real(data.user_id);
			window_set_caption("user_id = " + string(user_id));
			Obj_Player.x = real(data.user_x);
			Obj_Player.y = real(data.user_y);
			Spawn_Wall_Layout(data.server_grid);
			alarm[AlarmUpdate] = 1;
	        break;
			
					
		case MSG_MOVE:
			if (data.user_id == user_id) {
				Obj_Player.x = real(data.user_x);
				Obj_Player.y = real(data.user_y);
			}
	        break;
			
			
		case MSG_LOGOUT:
			show_debug_message("MSG_LOGOUT");
			show_message("loged out");
			game_end();
	        break;
			
			
		case MSG_LOGIN_FAILED:
			show_debug_message("MSG_LOGIN_FAILED");
			show_error("Login Failed", true);
	        break;
			
			
		case MSG_UPDATE:
			//show_debug_message("MSG_UPDATE");
			Update(data.clients);
			alarm[AlarmUpdate] = 1;
	        break;
			
			
	    default:
	        show_debug_message("Unkown message!");
	        break;
	}
} else {
	//show_debug_message(data);
}

end else { //////////////////////////////////////////////////////////////////////
	//show_debug_message("poop");
}