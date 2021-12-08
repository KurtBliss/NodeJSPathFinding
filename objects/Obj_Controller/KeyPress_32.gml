/// @desc Login
if (can_connect) {
	show_debug_message("logging in....");
	http_get(http_base + "login");
	can_connect = false;
}