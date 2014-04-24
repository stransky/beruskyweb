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

var loaded_level = {};

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

function level_disk_index(x, y, layer)
{
  return(y * (LEVEL_CELLS_X*10) + x * (10) + layer);
}

function level_index(x, y)
{
  return(y * (LEVEL_CELLS_X) + x);
}

function level_load_callback_set_level(level)
{
  loaded_level = level;
  loaded_level.loaded = false;
}

level_load_callback = function() {
  var data = new Uint8Array(this.response);

  // Check level size and signature
  if(data.length != LEVEL_SIZE)
    return;

  for(var i = 0; i < H_LEVEL.length; i++) {
    if(String.fromCharCode(data[i]) != H_LEVEL[i])
      return;
  }

  loaded_level.background = data[30];
  loaded_level.music = data[31];

  loaded_level.rotation = Array();
  for(var i = 0; i < 5; i++) {
    loaded_level.rotation[i] = data[32+i];
  }

  // Skip rezerved[100]
  // We have to multiply the sizes by 2 
  // because all cells are stored as unsigned int16 
  var level = new DataView(this.response, 137, 
                           LEVEL_FLOOR_SIZE*2 + 
                           LEVEL_LEVEL_SIZE*2 + 
                           LEVEL_PLAYER_SIZE*2);

  var floor = Uint16Array(LEVEL_FLOOR_SIZE);
  var level = Uint16Array(LEVEL_LEVEL_SIZE);
  var players = Uint16Array(LEVEL_PLAYER_SIZE);

  for(var i = 0; i < LEVEL_FLOOR_SIZE; i++)
    floor[i] = level.getUint16(i*2, true);
  for(var i = 0; i < LEVEL_LEVEL_SIZE; i++)
    level[i] = level.getUint16(LEVEL_FLOOR_SIZE*2 + i*2, true);
  for(var i = 0; i < LEVEL_PLAYER_SIZE; i++)
    players[i] = level.getUint16(LEVEL_FLOOR_SIZE*2 +
                                 LEVEL_LEVEL_SIZE*2 + i*2, true);

  // Convert to game level structure
  loaded_level.floor = Array();
  loaded_level.level = Array();
  loaded_level.players = Array();
  
  for(var y = 0; y < LEVEL_CELLS_Y; y++) {
    for(var x = 0; x < LEVEL_CELLS_X; x++) {
      var cell = new LevelItem();
      cell.item = floor[level_disk_index(x, y, LAYER_ITEM)];
      if(cell.item != NO_ITEM) {
        cell.variant = this.floor[level_disk_index(x, y, LAYER_VARIANT)];
        cell.rotation = this.floor[level_disk_index(x, y, LAYER_ROTATION)];
      }
      loaded_level.floor[level_index] = cell;

      cell.item = this.level[level_disk_index(x, y, LAYER_ITEM)];
      if(cell.item != NO_ITEM && cell.item != P_GROUND) {
        cell.variant = this.level[level_disk_index(x, y, LAYER_VARIANT)];
        cell.rotation = this.level[level_disk_index(x, y, LAYER_ROTATION)];
      }
      loaded_level.level[level_index] = cell;

      cell.item = this.players[level_index(x, y)];
      loaded_level.players[level_index] = cell;
    }
  }

  console.log("Level " + loaded_level.name + " loaded.");

  loaded_level.loaded = true;
}

function LevelItem(item, variant, rotation) {
  this.item = item;
  this.variant = variant;
  this.rotation = rotation;
}

function Level() {
  this.name = "a.lv3";
  this.loaded = false;  
}

// Load binary level data from original lv3 files
// use the Blob interface
Level.prototype.load = function(file) {
  this.name = file;
  console.log("Loading " + this.name);

  level_load_callback_set_level(this);
  load_file_binary(file, level_load_callback);
}

Level.prototype.item_is_empty = function(x,y) {
  return(this.item_get(x,y).item == 0);
}

// Render the level on screen
Level.prototype.render = function(repository) {

  graph.draw(FIRST_BACKGROUND,
             LEVEL_SCREEN_START_X,
             LEVEL_SCREEN_START_Y);

  for(var y = 0; y < LEVEL_CELLS_Y; y++) {
    for(var x = 0; x < LEVEL_CELLS_X; x++) {
      var item = this.floor[level_disk_index(x, y, LAYER_ITEM)];
      if(item != NO_ITEM) {
        var variant = this.floor[level_disk_index(x, y, LAYER_VARIANT)];
        var rotation = this.floor[level_disk_index(x, y, LAYER_ROTATION)];
        var sprite = repository.get_sprite(item, variant);
        graph.draw(sprite, LEVEL_SCREEN_START_X + x*CELL_SIZE_X,
                           LEVEL_SCREEN_START_Y + y*CELL_SIZE_Y, rotation);
      }

      var item = this.level[level_disk_index(x, y, LAYER_ITEM)];
      if(item != NO_ITEM && item != P_GROUND) {
        var variant = this.level[level_disk_index(x, y, LAYER_VARIANT)];
        var rotation = this.level[level_disk_index(x, y, LAYER_ROTATION)];
        var sprite = repository.get_sprite(item, variant);
        graph.draw(sprite, LEVEL_SCREEN_START_X + x*CELL_SIZE_X,
                           LEVEL_SCREEN_START_Y + y*CELL_SIZE_Y, rotation);
      }

      var player = this.players[level_index(x, y)];
      if(player != NO_ITEM) {
        var sprite = FIRST_PLAYER+player;
        graph.draw(sprite, LEVEL_SCREEN_START_X + x*CELL_SIZE_X,
                           LEVEL_SCREEN_START_Y + y*CELL_SIZE_Y,
                           loaded_level.rotation[player]);
      }
    }
  }
}
