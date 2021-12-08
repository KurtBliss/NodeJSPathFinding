/// @desc Update

#macro AlarmUpdate 0

http_get(string(http_base) + "update/" + string(user_id));