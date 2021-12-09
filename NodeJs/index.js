var express = require("express");
var app = express();
var { grid_points: grid_points, grid: obstacles } = require("./grid");
var { Grid, Astar } = require("fast-astar");

const MSG_LOGIN = 0;
const MSG_MOVE = 1;
const MSG_LOGOUT = 2;
const MSG_LOGIN_FAILED = 3;
const MSG_UPDATE = 4;
const SPEED = 4;
var counter = -1; // for user ids
var clients = [];
var bots = [];

const WIDTH = 640;
const HEIGHT = 480;
const CELL_W = 32;
const CELL_H = 32;

let grid = new Grid({
  col: Math.floor(WIDTH / CELL_W), // col
  row: Math.floor(HEIGHT / CELL_H), // row
  render: function () {
    // Optional, this method is triggered when the grid point changes
    // console.log(this);
  },
});
// Add obstacles to the grid
obstacles.forEach((item) => {
  grid.set(item, "value", 1); // Values greater than 0 are obstacles
});

// https://github.com/qiao/PathFinding.js/pull/151 weights

var local_new_client = new_client(true);
local_new_client.user_x = 550;
local_new_client.user_y = 390;
clients.push(local_new_client);
bots.push({ user_id: counter, target_user_id: -1, path: null });

setInterval(intervalTimeout, 1000);
function intervalTimeout() {
  clients.forEach((client) => {
    if (!client.bot && ++client.user_timer > 5 && client.user_active) {
      client.user_active = false;
      console.log("timeout,", client.user_id);
    }
  });
}

setInterval(intervalBot, 5);
function intervalBot() {
  bots.forEach((bot) => {
    var self_point = new Point(
      clients[bot.user_id].user_x,
      clients[bot.user_id].user_y
    );
    if (bot.target_user_id == -1) {
      var closest_dist = -1;
      var closest_id = -1;
      var client_point;
      var cur_dist = -1;
      clients.forEach((client) => {
        if (client.user_id != bot.user_id && !clients.bot) {
          client_point = new Point(client.user_x, client.user_y);
          if (closest_id == -1) {
            closest_id = client.user_id;
            closest_dist = self_point.distanceTo(client_point);
          } else {
            cur_dist = self_point.distanceTo(client_point);
            if (cur_dist < closest_dist) {
              closest_id = client.user_id;
              closest_dist = self_point.distanceTo(client_point);
            }
          }
        }
      });
      bot.target_user_id = closest_id;
    } else {
      var target = clients[bot.target_user_id];
      var target_point = new Point(target.user_x, target.user_y);

      if (target.user_active) {
        if (bot.path == null || (bot.path != null && bot.path[0] == null)) {
          grid = new Grid({
            col: Math.floor(WIDTH / CELL_W), // col
            row: Math.floor(HEIGHT / CELL_H), // row
            render: function () {
              // Optional, this method is triggered when the grid point changes
              // console.log(this);
            },
          });
          // Add obstacles to the grid
          obstacles.forEach((item) => {
            grid.set(item, "value", 1); // Values greater than 0 are obstacles
          });

          var from = get_pos_cell(self_point.x, self_point.y);
          var to = get_pos_cell(target_point.x, target_point.y);

          var astar = new Astar(grid),
            path = astar.search(
              [from.cell_x, from.cell_y], // start
              [to.cell_x, to.cell_y], // end
              {
                // option
                rightAngle: true, // default:false,Allow diagonal
                optimalResult: true, // default:true,In a few cases, the speed is slightly slower
              }
            );

          bot.path = path;
          // console.log(bot.path);
        }

        if (bot.path != null && bot.path[0] != null && bot.path[0][0] != null) {
          var pos = get_cell_pos(bot.path[0][0], bot.path[0][1]);
          var path_point = new Point(pos.point_x, pos.point_y);

          while (path_point.distanceTo(self_point) < 16) {
            bot.path.shift();
            try {
              pos = get_cell_pos(bot.path[0][0], bot.path[0][1]);
              path_point = new Point(pos.point_x + 0, pos.point_y + 0);
            } catch (error) {
              break;
            }
          }

          var move_to = self_point.moveTo(path_point, 0.4);

          clients[bot.user_id].user_x = move_to.x; //self_point.x;
          clients[bot.user_id].user_y = move_to.y; //self_point.y;
        } else {
          // var move_to = self_point.moveTo(target_point, 0.4);
          // clients[bot.user_id].user_x = move_to.x; //self_point.x;
          // clients[bot.user_id].user_y = move_to.y; //self_point.y;
        }
      }
    }
  });
}

function Point(x, y) {
  // https://stackoverflow.com/questions/42755576/javascript-function-distance-between-two-points
  this.x = x;
  this.y = y;

  //   var { sqrt, pow, atan2, cos, sin, min } = Math;

  this.distanceTo = function (point) {
    var distance = Math.sqrt(
      Math.pow(point.x - this.x, 2) + Math.pow(point.y - this.y, 2)
    );
    return distance;
  };

  this.moveTo = function (point, velocity = 30) {
    var dx = this.x - point.x;
    var dy = this.y - point.y;
    var angle = Math.atan2(dy, dx);
    if (this.distanceTo(point) < velocity) {
      this.x -= velocity * Math.cos(angle);
      this.y -= velocity * Math.sin(angle);
    } else {
      this.x -= velocity * Math.cos(angle);
      this.y -= velocity * Math.sin(angle);
    }
    return {
      x: this.x,
      y: this.y,
    };
  };
}

function get_cell_pos(cell_x, cell_y) {
  return {
    point_x: cell_x * CELL_W,
    point_y: cell_y * CELL_H,
  };
}

function get_pos_cell(point_x, point_y) {
  return {
    cell_x: Math.floor((point_x / WIDTH) * (WIDTH / CELL_W)),
    cell_y: Math.floor((point_y / HEIGHT) * (HEIGHT / CELL_H)),
  };
}

function new_client(_bot = false) {
  return {
    user_id: ++counter,
    user_active: true,
    bot: _bot,
    user_timer: 0,
    user_x: 100,
    user_y: 100,
  };
}

app.get("/login", function (req, res) {
  console.log("login", counter + 1);
  var local_new_client = new_client();
  clients.push(local_new_client);
  res.json({
    msg: MSG_LOGIN,
    ...local_new_client,
    server_grid: grid_points,
  });
});

app.get("/logout/:user_id", function (req, res) {
  console.log("logout, " + req.params.user_id);
  var id = parseInt(req.params.user_id);
  clients[id].user_active = false;
});

app.get("/update/:user_id", function (req, res) {
  var id = parseInt(req.params.user_id);
  var active_clients = [];
  clients[id].user_active = true;
  clients[id].user_timer = 0;
  clients.forEach((client) => {
    if (client.user_active && client.user_id != id) {
      active_clients.push(client);
    }
  });
  res.json({
    msg: MSG_UPDATE,
    clients: active_clients,
  });
});

app.get("/move/:user_id/:user_x/:user_y", function (req, res) {
  var id = parseInt(req.params.user_id);
  clients[id]["user_x"] += parseFloat(req.params.user_x) * SPEED;
  clients[id]["user_y"] += parseFloat(req.params.user_y) * SPEED;
  res.json({
    msg: MSG_MOVE,
    user_id: req.params.user_id,
    user_x: clients[id]["user_x"],
    user_y: clients[id]["user_y"],
  });
});

var server = app.listen(3000, function () {
  console.log("Listening! http://localhost:3000/");
});
