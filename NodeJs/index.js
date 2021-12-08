
var express=require('express');
var app=express();

const grid = 
    [ 
        [ 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0 ],
        [ 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0 ], 
         [ 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0 ], 
         [ 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 1.0, 1.0, 0.0, 0.0, 0.0 ], 
         [ 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0 ], 
         [ 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0 ], 
         [ 0.0, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.0, 0.0, 0.0 ], 
         [ 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0 ], 
         [ 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0 ], 
         [ 0.0, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0 ], 
         [ 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0 ], 
         [ 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0 ], 
         [ 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.0, 0.0 ], 
         [ 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0 ], 
         [ 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0 ], 
         [ 0.0, 0.0, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.0, 0.0, 0.0 ], 
         [ 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0 ], 
         [ 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0 ], 
         [ 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0 ], 
         [ 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0 ] 
        ];

const MSG_LOGIN = 0;
const MSG_MOVE = 1;
const MSG_LOGOUT = 2;
const MSG_LOGIN_FAILED = 3;
const MSG_UPDATE = 4;
const WIDTH = 640;
const HEIGHT = 480;
const SPEED = 4; 
var counter = -1; // for user ids
var clients = [];
var bots = [];

var local_new_client = new_client(true);
clients.push(local_new_client);
bots.push(counter);

setInterval(intervalTimeout, 1000);

function intervalTimeout() {
   clients.forEach(client => {
      if ((!client.bot) && (++client.user_timer > 5) && (client.user_active)) {
         client.user_active = false;
         console.log("timeout,", client.user_id);
      }
   });
}

function new_client(_bot = false) {
   return {
      user_id: ++counter,
      user_active: true,
      bot: _bot,
      user_timer: 0,
      user_x: 100, 
      user_y: 100
   };
}

app.get('/login',function(req,res){
   console.log("login", counter+1);
   var local_new_client = new_client();
   clients.push(local_new_client)
   res.json({
      msg: MSG_LOGIN,
      ...local_new_client,
      server_grid: grid
   });
});

app.get('/logout/:user_id', function(req,res){
   console.log("logout, " + req.params.user_id);
   var id = parseInt(req.params.user_id);
   clients[id].user_active = false;
});

app.get('/update/:user_id',function(req,res){
   var id = parseInt(req.params.user_id);
   var active_clients = [];
   clients[id].user_active = true;
   clients[id].user_timer = 0;
   clients.forEach(client => {
      if (client.user_active && client.user_id != id) {
         active_clients.push(client);
      }
   });
   res.json({
      msg: MSG_UPDATE,
      clients: active_clients
   });
});

app.get('/move/:user_id/:user_x/:user_y', function(req,res){
   var id = parseInt(req.params.user_id);
   clients[id]["user_x"] += (parseFloat(req.params.user_x) * SPEED);
   clients[id]["user_y"] += (parseFloat(req.params.user_y) * SPEED);
   res.json({
      msg: MSG_MOVE,
      user_id: req.params.user_id,
      user_x: clients[id]["user_x"],
      user_y: clients[id]["user_y"]
   });
});

var server=app.listen(3000,function() {
   console.log("Listening! http://localhost:3000/");
});

