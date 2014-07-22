/*
 *        .þÛÛþ þ    þ þÛÛþ.     þ    þ þÛÛÛþ.  þÛÛÛþ .þÛÛþ. þ    þ
 *       .þ   Û Ûþ.  Û Û   þ.    Û    Û Û    þ  Û.    Û.   Û Ûþ.  Û
 *       Û    Û Û Û  Û Û    Û    Û   þ. Û.   Û  Û     Û    Û Û Û  Û
 *     .þþÛÛÛÛþ Û  Û Û þÛÛÛÛþþ.  þþÛÛ.  þþÛÛþ.  þÛ    Û    Û Û  Û Û
 *    .Û      Û Û  .þÛ Û      Û. Û   Û  Û    Û  Û.    þ.   Û Û  .þÛ
 *    þ.      þ þ    þ þ      .þ þ   .þ þ    .þ þÛÛÛþ .þÛÛþ. þ    þ
 *
 *    
 * Author: Martin Stransky <stransky@anakreon.cz>
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
 *
 */

var H_LEVEL    = "Level 3 (C) Anakreon 1999"
var LEVEL_SIZE = 28361
var LEVEL_CELLS_X = 32
var LEVEL_CELLS_Y = 21

var LEVEL_LAYER_SIZE = (LEVEL_CELLS_X*LEVEL_CELLS_Y)

// Floor and Level layers have 10 cells for every level tile
var LEVEL_FLOOR_SIZE = (LEVEL_LAYER_SIZE*10)
var LEVEL_LEVEL_SIZE = (LEVEL_LAYER_SIZE*10)
var LEVEL_PLAYER_SIZE = (LEVEL_LAYER_SIZE)


/* Level structure (packed)

#define LEVEL_CELLS_X             32
#define LEVEL_CELLS_Y             21

Layers:
item:     0
variant:  1
rotation: 2

char signum[30];
char back;
char music;
char rot[5];
char rezerved[100];
word floor[LEVEL_CELLS_Y][LEVEL_CELLS_X][10];
word level[LEVEL_CELLS_Y][LEVEL_CELLS_X][10];
word players[LEVEL_CELLS_Y][LEVEL_CELLS_X];

array memory layout

  [LEVEL_CELLS_Y]
    [LEVEL_CELLS_X]
      [10]
      [10]
      [10]
    [LEVEL_CELLS_X+1]
      [10]
      [10]
      [10]
  [LEVEL_CELLS_Y+1]
    [LEVEL_CELLS_X]
      [10]
      [10]
      [10]
    [LEVEL_CELLS_X+1]
      [10]
      [10]
      [10]
*/

function level_index_disk(x, y, layer)
{
  return(y * (LEVEL_CELLS_X*10) + x * (10) + layer);
}

function level_index(x, y)
{
  return(y * (LEVEL_CELLS_X) + x);
}

level_load_callback = function() {
  var data = new Uint8Array(this.response);
  var loaded_level = this.callback_object;

  // Check level size and signature
  if(data.length != LEVEL_SIZE)
    return;

  for(var i = 0; i < H_LEVEL.length; i++) {
    if(String.fromCharCode(data[i]) != H_LEVEL[i])
      return;
  }

  loaded_level.background = data[30];
  loaded_level.music = data[31];

  var player_rotations = Array();
  for(var i = 0; i < PLAYER_MAX; i++) {
    player_rotations[i] = data[32+i];
  }

  // Skip rezerved[100]
  // We have to multiply the sizes by 2 
  // because all cells are stored as unsigned int16 
  var level_data = new DataView(this.response, 137,
                                LEVEL_FLOOR_SIZE*2 +
                                LEVEL_LEVEL_SIZE*2 +
                                LEVEL_PLAYER_SIZE*2);

  var floor = Uint16Array(LEVEL_FLOOR_SIZE);
  var level = Uint16Array(LEVEL_LEVEL_SIZE);
  var players = Uint16Array(LEVEL_PLAYER_SIZE);

  for(var i = 0; i < LEVEL_FLOOR_SIZE; i++)
    floor[i] = level_data.getUint16(i*2, true);
  for(var i = 0; i < LEVEL_LEVEL_SIZE; i++)
    level[i] = level_data.getUint16(LEVEL_FLOOR_SIZE*2 + i*2, true);
  for(var i = 0; i < LEVEL_PLAYER_SIZE; i++)
    players[i] = level_data.getUint16(LEVEL_FLOOR_SIZE*2 +
                                      LEVEL_LEVEL_SIZE*2 + i*2, true);

  // Convert to game level structure
  loaded_level.floor = Array();
  loaded_level.level = Array();
  loaded_level.players = Array();
  
  for(var y = 0; y < LEVEL_CELLS_Y; y++) {
    for(var x = 0; x < LEVEL_CELLS_X; x++) {
      var index = level_index(x,y);

      loaded_level.floor[index] = new LevelItem();
      loaded_level.floor[index].item = floor[level_index_disk(x, y, LAYER_ITEM)];
      loaded_level.floor[index].variant = floor[level_index_disk(x, y, LAYER_VARIANT)];
      loaded_level.floor[index].rotation = floor[level_index_disk(x, y, LAYER_ROTATION)];

      loaded_level.level[index] = new LevelItem();
      loaded_level.level[index].item = level[level_index_disk(x, y, LAYER_ITEM)];
      loaded_level.level[index].variant = level[level_index_disk(x, y, LAYER_VARIANT)];
      loaded_level.level[index].rotation = level[level_index_disk(x, y, LAYER_ROTATION)];
      if(loaded_level.level[index].item == P_GROUND)
        loaded_level.level[index].item = NO_ITEM;

      loaded_level.players[index] = new LevelItem();
      loaded_level.players[index].item = players[level_index(x, y)];

      if(loaded_level.players[index].item != NO_ITEM) {
        loaded_level.players[index].rotation = player_rotations[loaded_level.players[index].item];
        
        var player_number = loaded_level.players[index].item;
        loaded_level.player_table[player_number].active = true;
        loaded_level.player_table[player_number].x = x;
        loaded_level.player_table[player_number].y = y;
        
        if(player_number < loaded_level.player_active.number) {
          loaded_level.player_active = loaded_level.player_table[player_number];
        }
      }
    }
  }

  console.log("Level " + loaded_level.name + " loaded.");
  loaded_level.loaded = true;

  // Load background for this level
  loaded_level.graph.background_load(loaded_level.background);
  loaded_level.background_loaded = true;
}

// Active player info
function Player(num) {
  this.active = false;
  this.is_moving = false; // there's a running player animation  
  this.key_color = 0;
  this.matocks = 0;
  this.number = num;
  this.x = 0;
  this.y = 0;
  
  this.ls = Array();
  this.rs = Array();

  switch(this.number) {
    case 0:
      this.ls[0] = FIRST_OTHER + 48;
      this.ls[1] = FIRST_OTHER + 49;
      this.ls[2] = FIRST_OTHER + 52;
      this.ls[3] = FIRST_OTHER + 53;
      this.rs[0] = FIRST_OTHER + 50;
      this.rs[1] = FIRST_OTHER + 51;
      this.rs[2] = FIRST_OTHER + 54;
      this.rs[3] = FIRST_OTHER + 55;
      break;
    case 1:
      this.ls[0] = FIRST_OTHER + 16;
      this.ls[1] = FIRST_OTHER + 17;
      this.ls[2] = FIRST_OTHER + 44;
      this.ls[3] = FIRST_OTHER + 45;
      this.rs[0] = FIRST_OTHER + 24;
      this.rs[1] = FIRST_OTHER + 25;
      this.rs[2] = FIRST_OTHER + 46;
      this.rs[3] = FIRST_OTHER + 47;
      break;
    case 2:
      this.ls[0] = FIRST_OTHER + 22;
      this.ls[1] = FIRST_OTHER + 23;
      this.ls[2] = FIRST_OTHER + 20;
      this.ls[3] = FIRST_OTHER + 21;
      this.rs[0] = FIRST_OTHER + 18;
      this.rs[1] = FIRST_OTHER + 19;
      this.rs[2] = FIRST_OTHER + 26;
      this.rs[3] = FIRST_OTHER + 27;
      break;
    case 3:
      this.ls[0] = FIRST_OTHER + 36;
      this.ls[1] = FIRST_OTHER + 37;
      this.ls[2] = FIRST_OTHER + 40;
      this.ls[3] = FIRST_OTHER + 41;
      this.rs[0] = FIRST_OTHER + 38;
      this.rs[1] = FIRST_OTHER + 39;
      this.rs[2] = FIRST_OTHER + 42;
      this.rs[3] = FIRST_OTHER + 43;
      break;
    case 4:
      this.ls[0] = FIRST_OTHER + 28;
      this.ls[1] = FIRST_OTHER + 29;
      this.ls[2] = FIRST_OTHER + 32;
      this.ls[3] = FIRST_OTHER + 33;
      this.rs[0] = FIRST_OTHER + 30;
      this.rs[1] = FIRST_OTHER + 31;
      this.rs[2] = FIRST_OTHER + 34;
      this.rs[3] = FIRST_OTHER + 35;
      break;
  }

  this.a_ls = PLAYER_HAND;
  this.a_rs = PLAYER_HAND;
  
  this.sprite_ls = false;
  this.sprite_rs = false;
  this.sprite_mask = false;
}

Player.prototype.key_color_add = function()
{
  this.key_color++;
  this.a_rs = PLAYER_ITEM;
  return(this.key_color == 1);
}

Player.prototype.key_color_remove = function()
{
  this.key_color--;
  if(!this.key_color) {
    this.a_rs = PLAYER_HAND;
    return(true);
  }
}

Player.prototype.mattock_add = function()
{
  this.matocks++;
  this.a_ls = PLAYER_ITEM;
  return(this.matocks == 1);
}

Player.prototype.mattock_remove = function()
{
  this.matocks--;
  if(!this.matocks) {
    this.a_ls = PLAYER_HAND;
    return(true);
  }
}

function LevelItem() {
  this.item = NO_ITEM;
  this.variant = 0;
  this.rotation = 0;
  this.sprite_handle = 0;
  this.diff_x = 0; // sprite offset
  this.diff_y = 0;
}

function LevelItem(item, variant, rotation) {
  this.item = item;
  this.variant = variant;
  this.rotation = rotation;
  this.sprite_handle = 0;
  this.diff_x = 0;
  this.diff_y = 0;
}

LevelItem.prototype.copy = function(template)
{
  this.item = template.item;
  this.variant = template.variant;
  this.rotation = template.rotation;  
  this.sprite_handle = template.sprite_handle;
  this.diff_x = template.diff_x;
  this.diff_y = template.diff_y;
}

function Level(graph) {
  this.graph = graph;
  this.name = "a.lv3";
  this.loaded = false;
  this.background_sprite = 0;
  this.background_loaded = false;
  this.rendered = false;
  this.keys_final = 0;
  this.player_mark_cursor = 0;
  
  this.player_table = new Array();
  for(var i = 0; i < PLAYER_MAX; i++) {
    this.player_table[i] = new Player(i);
  }
    
  this.player_active = this.player_table[4];  
  this.sprite_key = false;
}

Level.prototype.is_loaded = function() {
  return(this.loaded && this.background_loaded);
}

// Load binary level data from original lv3 files
// use the Blob interface
Level.prototype.load = function(file) {
  this.name = file;
  this.loaded = false;
  console.log("Loading " + this.name);
  
  load_file_binary(file, level_load_callback, this);
}

Level.prototype.item_get = function(x, y)
{
  return(this.level[level_index(x,y)]);
}

Level.prototype.item_is_empty = function(x,y) {
  return(this.item_get(x,y).item == NO_ITEM);
}

Level.prototype.cell_get = function(x, y, layer)
{
  var cell;
  switch (layer) {
  case (LAYER_FLOOR):
    cell = this.floor[level_index(x,y)];
    break;
  case (LAYER_LEVEL):
    cell = this.level[level_index(x,y)];
    break;
  case (LAYER_PLAYER):
    cell = this.players[level_index(x,y)];
    break;
  default:
    throw "Unknown layer!";
  }
  return(cell);
}

Level.prototype.cell_draw = function(cell, x, y)
{  
  this.graph.sprite_move(cell.sprite_handle,
                         cell.diff_x + LEVEL_SCREEN_START_X + x*CELL_SIZE_X,
                         cell.diff_y + LEVEL_SCREEN_START_Y + y*CELL_SIZE_Y);
  this.graph.sprite_rotate(cell.sprite_handle, cell.rotation); 
}

Level.prototype.cell_draw_sprite = function(spr, x, y)
{  
  this.graph.sprite_move(spr,
                         LEVEL_SCREEN_START_X + x*CELL_SIZE_X,
                         LEVEL_SCREEN_START_Y + y*CELL_SIZE_Y);
}

Level.prototype.item_draw = function(x, y, layer)
{
  var cell = cell_get(x,y,layer);
  if(cell.item != NO_ITEM) {
    this.cell_draw(cell,x,y);
  }
}

// Remove specified LevelItem from level, 
// unregister sprite and so
Level.prototype.item_remove = function(x, y, layer)
{
  var cell = this.cell_get(x,y,layer);
  if(cell.item != NO_ITEM) {
    cell.item = NO_ITEM;
    if(cell.sprite_handle) {
      this.graph.sprite_remove(cell.sprite_handle);
      cell.sprite_handle = 0;
    }
  }
}

// 1. Remove a LevelItem at (nx,ny)
// 2. Move LevelItem from (ox,oy) to (nx,ny)
Level.prototype.item_move = function(ox, oy, nx, ny, layer)
{
  this.item_remove(nx, ny, layer);

  var cell_old = this.cell_get(ox,oy,layer);
  if(cell_old.item != NO_ITEM) {
    var cell_new = this.cell_get(nx,ny,layer);
    cell_new.copy(cell_old);
    cell_old.item = NO_ITEM;
    this.cell_draw(cell_new, nx, ny);
  }
}

Level.prototype.item_diff_set = function(x, y, dx, dy, layer)
{ 
  var cell = this.cell_get(x,y,layer);
  if(cell.item != NO_ITEM) {
    cell.diff_x = dx;
    cell.diff_y = dy;
    this.cell_draw(cell,x,y);
  }
}

Level.prototype.is_rendered = function() 
{
  return(this.rendered);
}

// Render the level on screen
Level.prototype.render = function(repository) {
  /* We need to render the level layer to keep correct order of sprites
  */
  this.background_sprite = this.graph.sprite_insert(FIRST_BACKGROUND,
                                                    LEVEL_SCREEN_START_X,
                                                    LEVEL_SCREEN_START_Y);

  for(var y = 0; y < LEVEL_CELLS_Y; y++) {
    for(var x = 0; x < LEVEL_CELLS_X; x++) {
      var index = level_index(x,y);

      var cell = this.floor[index];
      if(cell.item != NO_ITEM) {        
        cell.sprite_handle = this.graph.sprite_insert(repository.get_sprite(cell.item, cell.variant));
        this.cell_draw(cell, x, y);
      }
    }
  }

  for(var y = 0; y < LEVEL_CELLS_Y; y++) {
    for(var x = 0; x < LEVEL_CELLS_X; x++) {
      var index = level_index(x,y);
      
      var cell = this.level[index];
      if(cell.item != NO_ITEM && cell.item != P_GROUND) {
        cell.sprite_handle = this.graph.sprite_insert(repository.get_sprite(cell.item, cell.variant));
        this.cell_draw(cell, x, y);
      }
    }
  }
  
  for(var y = 0; y < LEVEL_CELLS_Y; y++) {
    for(var x = 0; x < LEVEL_CELLS_X; x++) {
      var index = level_index(x,y);
      
      var cell = this.players[index];
      if(cell.item != NO_ITEM) {
        cell.sprite_handle = this.graph.sprite_insert(FIRST_PLAYER+cell.item*FIRST_PLAYER_STEP);
        this.cell_draw(cell, x, y);
      }
    }
  }

  this.rendered = true;  
  this.player_cursor_set_draw(true);
  this.panel_draw();
}

Level.prototype.player_switch = function(number)
{
  var player_old = this.player_active.number;

  if(number == BUG_SELECT_NEXT) {
    var p = this.player_active.number;
    do {
      p = p+1;
      if(p >= PLAYER_MAX)
        p = 0;

      if(this.player_table[p].active) {
        number = p;
        break;
      }

    } while(this.player_table[p].number != this.player_active.number);
  }

  if(player_old != number) {
    if(this.player_table[number].active) {
      this.player_cursor_set_draw(false);
      this.player_active = this.player_table[number];
      this.player_cursor_set_draw(true);
    }

    this.panel_draw_player(player_old);
    this.panel_draw_player(number);
  }
}

Level.prototype.player_cursor_set_draw = function(draw)
{   
  if(draw && !this.player_mark_cursor && this.player_active.active) {
    this.player_mark_cursor = this.graph.sprite_insert(FIRST_CURSOR);
    this.cell_draw_sprite(this.player_mark_cursor,
                          this.player_active.x,
                          this.player_active.y);
  }
  else if(!draw && this.player_mark_cursor) {
    this.graph.sprite_remove(this.player_mark_cursor);
    this.player_mark_cursor = 0;
  }
}

Level.prototype.panel_draw_player = function(num)
{
  var player = this.player_table[num];

  var x = PANEL_X_OFFSET + (num * PANEL_DIFF);

  var s1 = player.a_ls;
  var s2 = player.a_rs;

  var active = (num == this.player_active.number);

  // Draw selected player
  if(active) {
    s1--;
    s2--;
  }

  var sx = x - PANEL_X_SIZE;
  var sy = 0;
  var dx = PANEL_X_SIZE_2;
  var dy = PANEL_Y_SIZE;

  if(player.sprite_ls)
    this.graph.sprite_remove(player.sprite_ls);
  if(player.sprite_rs)
    this.graph.sprite_remove(player.sprite_rs);

  player.sprite_ls = this.graph.sprite_insert(player.ls[s1], sx, 0);
  player.sprite_rs = this.graph.sprite_insert(player.rs[s2], x, 0);

  if(player.sprite_mask) {
    this.graph.sprite_remove(player.sprite_rs);
    player.sprite_mask = false;
  }
  if(!player.active) {
    player.sprite_mask = this.graph.sprite_insert(PLAYER_MASK, x - 23, 2);
  }
}

Level.prototype.panel_draw = function()
{
  for(var i = 0; i < PLAYER_MAX; i++) {
    this.panel_draw_player(i);
  }
}

Level.prototype.panel_draw_keys = function()
{
  if(this.keys_final > 0 && this.keys_final <= 5) {
    if(this.sprite_key)
      this.graph.sprite_remove(this.sprite_key);
  
    this.sprite_key = this.graph.sprite_insert(FIRST_KEY + this.keys_final, X_KEYS_POSITION, Y_KEYS_POSITION);
  }
}
