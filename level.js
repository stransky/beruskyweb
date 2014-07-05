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
  for(var i = 0; i < 5; i++) {
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
  
  loaded_level.player_active.number = 6;
  
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
function Player() {
  this.active = false;
  this.is_moving = false; // there's a running player animation  
  this.key_color = 0;
  this.matocks = 0;
  this.number = 0;
  this.x = 0;
  this.y = 0;
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
  
  this.player_table = new Array();
  for(var i = 0; i < 5; i++) {
    this.player_table[i] = new Player();
    this.player_table[i].number = i;
  }
    
  this.player_active = this.player_table[4];
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
  switch (layer || LAYER_LEVEL) {
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

Level.prototype.item_draw = function(x, y, layer)
{
  var cell = cell_get(x,y,layer||LAYER_LEVEL);
  if(cell.item != NO_ITEM) {
    this.cell_draw(cell,x,y);
  }
}

// Remove specified LevelItem from level, 
// unregister sprite and so
Level.prototype.item_remove = function(x, y, layer)
{
  var cell = this.cell_get(x,y,layer||LAYER_LEVEL);
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
  
  var cell_old = this.cell_get(ox,oy,layer||LAYER_LEVEL);
  if(cell_old.item != NO_ITEM) {
    var cell_new = this.cell_get(nx,ny,layer||LAYER_LEVEL);
    cell_new.copy(cell_old);
    cell_old.item = NO_ITEM;
    this.cell_draw(cell_new, nx, ny);
  }
}

Level.prototype.item_diff_set = function(x, y, dx, dy, layer)
{ 
  var cell = this.cell_get(x,y,layer||LAYER_LEVEL);
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
  this.background_sprite = this.graph.sprite_insert(FIRST_BACKGROUND);
  this.graph.sprite_move(this.background_sprite, LEVEL_SCREEN_START_X,
                                                 LEVEL_SCREEN_START_Y);  

  for(var y = 0; y < LEVEL_CELLS_Y; y++) {
    for(var x = 0; x < LEVEL_CELLS_X; x++) {
      var index = level_index(x,y);

      var cell = this.floor[index];
      if(cell.item != NO_ITEM) {        
        cell.sprite_handle = this.graph.sprite_insert(repository.get_sprite(cell.item, cell.variant));
        this.cell_draw(cell, x, y);
      }

      cell = this.level[index];
      if(cell.item != NO_ITEM && cell.item != P_GROUND) {
        cell.sprite_handle = this.graph.sprite_insert(repository.get_sprite(cell.item, cell.variant));
        this.cell_draw(cell, x, y);
      }

      cell = this.players[index];
      if(cell.item != NO_ITEM) {
        cell.sprite_handle = this.graph.sprite_insert(FIRST_PLAYER+cell.item*FIRST_PLAYER_STEP);
        this.cell_draw(cell, x, y);
      }
    }
  }

  this.rendered = true;
}

Level.prototype.player_switch = function(number)
{
TODO
}
