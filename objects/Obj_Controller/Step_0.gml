/// @desc Player Controls...

if (user_id == -1) exit;


var move_x = keyboard_check(vk_right) - keyboard_check(vk_left);
var move_y = keyboard_check(vk_down) - keyboard_check(vk_up);

if (move_x != 0 || move_y != 0) {
	http_get(http_base + "move/" + string(user_id) + "/" + string(move_x) + "/" + string(move_y) );
}