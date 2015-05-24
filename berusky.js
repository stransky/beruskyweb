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
// Player control
var MOVE_NONE   = 0
var MOVE_UP     = 1
var MOVE_DOWN   = 2
var MOVE_LEFT   = 3
var MOVE_RIGHT  = 4
var LOW_PANEL_STP_X_TEXT = (GAME_RESOLUTION_X - 5)
var LOW_PANEL_STP_Y      = (LEVEL_RESOLUTION_Y+LEVEL_SCREEN_START_Y)
function StepStatus(graph) {
  this.graph = graph;
  this.clear();
}
StepStatus.prototype.clear = function()
{
  this.steps = 0;
  this.sprites = 0;
}
StepStatus.prototype.add = function()
{
  this.steps++;
  this.graph.font_start_set(LOW_PANEL_STP_X_TEXT, LOW_PANEL_STP_Y);
  this.graph.font_alignment_set(ALIGN_RIGHT);
  if(this.sprites) {
    this.graph.sprite_remove(this.sprites);
  }
  this.sprites = this.graph.print("steps: " + this.steps);
}
var LOW_PANEL_MAT_X    = 0
var LOW_PANEL_MAT_Y    = (LEVEL_RESOLUTION_Y+LEVEL_SCREEN_START_Y)
function MattockStatus(graph) {
  this.graph = graph;
  this.clear();
}
MattockStatus.prototype.update = function(player)
{
  if(this.mattocks != player.matocks) {
    if(this.mattocks < player.matocks) {
      // Add someone
      for(var i = this.mattocks; i < player.matocks; i++) {
        this.sprites[i] = this.graph.sprite_insert(SPRITE_MATOCK,
                                                   LOW_PANEL_MAT_X+i*CELL_SIZE_X,
                                                   LOW_PANEL_MAT_Y);
      }
    }
    else {
      // Remove someone
      for(var i = player.matocks; i < this.mattocks; i++) {
        this.graph.sprite_remove(this.sprites[i]);
      }
    }
    this.mattocks = player.matocks;
  }
}
MattockStatus.prototype.clear = function()
{
  this.mattocks = 0;
  this.sprites = Array();
}
function Game() {
  this.graph = new Graph();
  this.graph.init();
  document.body.appendChild(this.graph.get_renderer().view);
  this.repo = new ObjectsRepository();
  this.level = new Level(this.graph, this.repo);
  this.input = new Input(this);
  this.anim = new GameAnimationEngine(this.level);
  this.mattock_panel = new MattockStatus(this.graph);
  this.steps_panel = new StepStatus(this.graph);
  this.clear();
}
Game.prototype.clear = function()
{
  this.graph.clear();
  this.anim.clear();
  this.mattock_panel.clear();
  this.steps_panel.clear();
  this.loaded = false;
  this.level_running = false;
  this.level_end = false;
}
Game.prototype.game_load = function()
{
  // Load game repo
  if(!this.repo.is_loaded())
    return;
  // Load game level
  if(!this.level.is_loaded())
    return;
  // Game sprites
  if(!this.graph.is_loaded())
    return;
  // Render already loaded level
  if(!this.level.is_rendered()) {
    this.level.render(this.repo);
    this.level_animate();
  }
  this.loaded = true;
}
Game.prototype.level_play = function(level_name)
{
  this.clear();
  var file = "data/Levels/" + level_name;
  this.level_running = true;
  this.level_load(file);
}
Game.prototype.level_quit = function()
{
  // set propper flags
  this.level_running = false;
  this.level_end = true;
}
Game.prototype.is_resolved = function()
{
  return (this.level.keys_final == 5);
}
Game.prototype.game_play = function()
{
  if(this.input.key_get(BUG_MOVE_UP))
    this.bug_move(MOVE_UP);
  else if(this.input.key_get(BUG_MOVE_DOWN))
    this.bug_move(MOVE_DOWN);
  else if(this.input.key_get(BUG_MOVE_RIGHT))
    this.bug_move(MOVE_RIGHT);
  else if(this.input.key_get(BUG_MOVE_LEFT))
    this.bug_move(MOVE_LEFT);
  if(this.input.key_get(BUG_SWITCH, true))
    this.bug_switch(BUG_SELECT_NEXT);
  else if(this.input.key_get(BUG_SELECT_1, true))
    this.bug_switch(0);
  else if(this.input.key_get(BUG_SELECT_2, true))
    this.bug_switch(1);
  else if(this.input.key_get(BUG_SELECT_3, true))
    this.bug_switch(2);
  else if(this.input.key_get(BUG_SELECT_4, true))
    this.bug_switch(3);
  else if(this.input.key_get(BUG_SELECT_5, true))
    this.bug_switch(4);
  if(this.input.key_get(LEVEL_EXIT)) {
    // HACK - debugging hack
    this.level.keys_final = 5;
    this.level_quit();
  }
  else if(this.input.key_get(LEVEL_HELP))
    ;
  else if(this.input.key_get(LEVEL_SAVE))
    ;
  else if(this.input.key_get(LEVEL_LOAD))
    ;
}
Game.prototype.game_loop = function()
{
  if(!this.loaded) {
    this.game_load();
    return;
  }
  // Update all running animations
  this.anim.process();
  // Play the game
  this.game_play();
}
// Load the game
Game.prototype.level_load = function(name)
{
  this.level.load(name);
}
// Animate bug movement
Game.prototype.animation_bug_move = function(direction, nx, ny, remove_target)
{
  var player = this.level.player_active;
  var x = player.x;
  var y = player.y;
  var anim = 0;
  var rotation = 0;
  switch(direction) {
    case MOVE_UP:
      anim = ANIM_MOVE_UP;
      rotation = ROTATION_UP;
      break;
    case MOVE_DOWN:
      anim = ANIM_MOVE_DOWN;
      rotation = ROTATION_DOWN;
      break;
    case MOVE_LEFT:
      anim = ANIM_MOVE_LEFT;
      rotation = ROTATION_LEFT;
      break;
    case MOVE_RIGHT:
      anim = ANIM_MOVE_RIGHT;
      rotation = ROTATION_RIGHT;
      break;
  }
  var data = { game:this, x:x, y:y, nx:nx, ny:ny, remove_target : (remove_target || 0) };
  this.anim.create_temp(anim, x, y, LAYER_PLAYER, rotation, this.animation_bug_move_end, data);
  this.anim.create_temp(player.number - ANIM_PLAYER_1, x, y, LAYER_PLAYER, rotation);
  this.level.player_cursor_set_draw(false);
  this.steps_panel.add();
}
Game.prototype.animation_bug_move_end = function(data)
{
  if(data.remove_target)
    data.game.level.cell_remove(data.nx, data.ny, LAYER_LEVEL);
  data.game.level.cell_diff_set(data.x, data.y, 0, 0, LAYER_PLAYER);
  data.game.level.cell_diff_set(data.nx, data.ny, 0, 0, LAYER_PLAYER);
  data.game.level.cell_move(data.x, data.y, data.nx, data.ny, LAYER_PLAYER);
  var player = data.game.level.player_active;
  player.x = data.nx; player.y = data.ny;
  // Handle doors
  var cell = data.game.level.item_get(data.x, data.y);
  switch(cell.item) {
    case P_DV_H_O:
      cell.item = P_DV_H_Z;
      data.game.level.cell_draw(cell, data.x, data.y, true);
      if(cell.variant == DOOR_VARIATION_CYBER) {
        cell.animation = data.game.anim.create_anim(data.game.anim.generate_anim(ANIM_DOOR_DV_H),
                                                    data.x, data.y, LAYER_LEVEL, NO_ROTATION);
      }
      break;
    case P_DV_V_O:
      cell.item = P_DV_V_Z;
      data.game.level.cell_draw(cell, data.x, data.y, true);
      if(cell.variant == DOOR_VARIATION_CYBER) {
        cell.animation = data.game.anim.create_anim(data.game.anim.generate_anim(ANIM_DOOR_DV_V),
                                                    data.x, data.y, LAYER_LEVEL, NO_ROTATION);
      }
      break;
    // Opened ID doors
    case P_ID_DOOR1_H_O:
    case P_ID_DOOR2_H_O:
    case P_ID_DOOR3_H_O:
    case P_ID_DOOR4_H_O:
    case P_ID_DOOR5_H_O:
    case P_ID_DOOR1_V_O:
    case P_ID_DOOR2_V_O:
    case P_ID_DOOR3_V_O:
    case P_ID_DOOR4_V_O:
    case P_ID_DOOR5_V_O:
      cell.item += 5;
      data.game.level.cell_draw(cell, data.x, data.y, true);
      break;
    default:
      break;
  }
  player.is_moving = false;
}
// Animate box movement
Game.prototype.animation_box_move = function(direction, x, y, nx, ny)
{
  var anim = 0;
  switch(direction) {
    case MOVE_UP:
      anim = ANIM_MOVE_UP;
      break;
    case MOVE_DOWN:
      anim = ANIM_MOVE_DOWN;
      break;
    case MOVE_LEFT:
      anim = ANIM_MOVE_LEFT;
      break;
    case MOVE_RIGHT:
      anim = ANIM_MOVE_RIGHT;
      break;
  }
  var data = { game:this, x:x, y:y, nx:nx, ny:ny };
  this.anim.create_temp(anim, x, y, LAYER_LEVEL, NO_ROTATION, this.animation_box_move_end, data);
}
Game.prototype.animation_box_move_end = function(data)
{
  data.game.level.cell_diff_set(data.x, data.y, 0, 0, LAYER_LEVEL);
  data.game.level.cell_diff_set(data.nx, data.ny, 0, 0, LAYER_LEVEL);
  data.game.level.cell_move(data.x, data.y, data.nx, data.ny, LAYER_LEVEL);
}
// Animate box movement
Game.prototype.animation_box_explosion = function(direction, nx, ny, nnx, nny)
{
  this.level.cell_remove(nx, ny, LAYER_LEVEL);
  this.level.cell_remove(nnx, nny, LAYER_LEVEL);
  var data = { game:this, nx:nx, ny:ny, direction:direction };
  this.anim.create_temp(ANIM_BLAST, nnx, nny, LAYER_LEVEL, NO_ROTATION);
  this.animation_bug_move(data.direction, data.nx, data.ny);
}
Game.prototype.animation_stone_explosion_end = function(data)
{
  data.game.level.cell_remove(data.nx, data.ny, LAYER_LEVEL);
  data.game.animation_bug_move(data.direction, data.nx, data.ny);
}
// Animate stone animation
Game.prototype.animation_stone_explosion = function(variant, direction, nx, ny)
{
  var data = { game:this, nx:nx, ny:ny, direction:direction };
  this.anim.create_temp(ANIM_STONE_1+variant, nx, ny, LAYER_LEVEL, NO_ROTATION,
                   this.animation_stone_explosion_end, data);
}
Game.prototype.exit_animate = function()
{
  for(var y = 0; y < LEVEL_CELLS_Y; y++) {
    for(var x = 0; x < LEVEL_CELLS_X; x++) {
      var cell = this.level.level[level_index(x,y)];
      if(cell.item == P_EXIT) {
        if(cell.variant == ANIM_EXIT) {
          cell.animation = this.anim.create_temp(ANIM_EXIT_1,
                                                 x, y, LAYER_LEVEL, NO_ROTATION);
        } else {
          cell.variant = (cell.variant == REV_EXIT) ? cell.variant-1 : cell.variant+1;
          this.level.cell_draw(cell, x, y, true);
        }
      }
    }
  }
}
Game.prototype.check_borders = function(nx, ny)
{
  if(nx < 0 || nx >= LEVEL_CELLS_X)
    return(false);
  if(ny < 0 || ny >= LEVEL_CELLS_Y)
    return(false);
  return(true);
}
// Get an active player
// Check if we can move
// Move it
Game.prototype.bug_move = function(direction)
{
  var player = this.level.player_active;
  if(player.is_moving)
    return;
  player.is_moving = 1;
  var nx = player.x;
  var ny = player.y;
  var nnx = nx;
  var nny = ny;
  switch(direction) {
    case MOVE_UP:
      ny--;
      nny -= 2;
      break;
    case MOVE_DOWN:
      ny++;
      nny += 2;
      break;
    case MOVE_LEFT:
      nx--;
      nnx -= 2;
      break;
    case MOVE_RIGHT:
      nx++;
      nnx += 2;
      break;
  }
  if(!this.check_borders(nx, ny)) {
    player.is_moving = false;
    return;
  }
  var cell = this.level.cell_get(nx, ny, LAYER_PLAYER);
  if(cell.item != NO_ITEM) {
    player.is_moving = false;
    return;
  }
  cell = this.level.item_get(nx, ny);
  switch(cell.item) {
    case NO_ITEM:  // Empty cell
    case P_DOOR1_H_O: // Opened key-doors
    case P_DOOR2_H_O:
    case P_DOOR3_H_O:
    case P_DOOR4_H_O:
    case P_DOOR5_H_O:
    case P_DOOR1_V_O: // Opened key-doors
    case P_DOOR2_V_O:
    case P_DOOR3_V_O:
    case P_DOOR4_V_O:
    case P_DOOR5_V_O:
    case P_ID_DOOR1_H_O:
    case P_ID_DOOR2_H_O:
    case P_ID_DOOR3_H_O:
    case P_ID_DOOR4_H_O:
    case P_ID_DOOR5_H_O:
    case P_ID_DOOR1_V_O:
    case P_ID_DOOR2_V_O:
    case P_ID_DOOR3_V_O:
    case P_ID_DOOR4_V_O:
    case P_ID_DOOR5_V_O:
    case P_DV_H_O: // One pass doors
    case P_DV_V_O:
    case P_DV_H:   // Opened color-key doors
    case P_DV_V:
      this.animation_bug_move(direction, nx, ny);
      return;
    case P_BOX:
      if(this.check_borders(nnx, nny)) {
        var cell_next = this.level.item_get(nnx, nny);
        if(cell_next.item == NO_ITEM) {
          this.animation_bug_move(direction, nx, ny);
          this.animation_box_move(direction, nx, ny, nnx, nny);
          return;
        }
      }
      break;
    case P_TNT:
      if(this.check_borders(nnx, nny)) {
        var cell_next = this.level.item_get(nnx, nny);
        if(cell_next.item == NO_ITEM) {
          this.animation_bug_move(direction, nx, ny);
          this.animation_box_move(direction, nx, ny, nnx, nny);
          return;
        } else if(cell_next.item == P_BOX) {
          this.animation_box_explosion(direction, nx, ny, nnx, nny);
          return;
        }
      }
      break;
    case P_EXIT:
      if(this.is_resolved()) {
        this.level_quit();
      }
      break;
    case P_STONE:
      if(player.matocks) {
        this.animation_stone_explosion(cell.variant, direction, nx, ny);
        if(player.mattock_remove()) {
          this.level.panel_draw_player(player.number);
        }
        this.mattock_panel.update(player);
        return;
      }
      break;
    case P_KEY:
      if(this.level.keys_final < 5) {
        this.animation_bug_move(direction, nx, ny, true);
        this.level.keys_final++;
        this.level.panel_draw_keys();
        if(this.level.keys_final == 5) {
          this.exit_animate();
        }
        return;
      }
      break;
    case P_MATTOCK:
      if(player.matocks < PLAYER_MAX_MATTLOCKS) {
        this.animation_bug_move(direction, nx, ny, true);
        if(player.mattock_add()) {
          this.level.panel_draw_player(player.number);
        }
        this.mattock_panel.update(player);
        return;
      }
      break;
    case P_KEY1:
    case P_KEY2:
    case P_KEY3:
    case P_KEY4:
    case P_KEY5:
      if(player.number == (cell.item - P_KEY1) &&
         player.key_color < PLAYER_MAX_KEYS)
      {
        this.animation_bug_move(direction, nx, ny, true);
        if(player.key_color_add()) {
          this.level.panel_draw_player(player.number);
        }
        return;
      }
      break;
    case P_DOOR1_H_Z: // color-Key-doors
    case P_DOOR2_H_Z:
    case P_DOOR3_H_Z:
    case P_DOOR4_H_Z:
    case P_DOOR5_H_Z:
      if(player.number == (cell.item - P_DOOR1_H_Z) &&
         player.key_color)
      {
        var cell = this.level.cell_get(nx, ny, LAYER_LEVEL);
        if(cell.animation)
          this.anim.remove(cell.animation);
        if(cell.variant == DOOR_VARIATION_CYBER) {
          this.level.cell_set(nx, ny, LAYER_LEVEL, P_DV_H, 0);
        }
        else {
          this.level.cell_remove(nx, ny, LAYER_LEVEL);
          var cell = this.level.cell_get(nx, ny, LAYER_FLOOR);
          cell.item = P_GROUND;
          cell.variant = 3;
          this.level.cell_draw(cell, nx, ny, true);
        }
        this.animation_bug_move(direction, nx, ny, false);
        if(player.key_color_remove()) {
          this.level.panel_draw_player(player.number);
        }
        return;
      }
      break;
    case P_DOOR1_V_Z: // color-Key-doors
    case P_DOOR2_V_Z:
    case P_DOOR3_V_Z:
    case P_DOOR4_V_Z:
    case P_DOOR5_V_Z:
      if(player.number == (cell.item - P_DOOR1_V_Z) &&
         player.key_color)
      {
        var cell = this.level.cell_get(nx, ny, LAYER_LEVEL);
        if(cell.animation)
          this.anim.remove(cell.animation);
        if(cell.variant == DOOR_VARIATION_CYBER) {
          this.level.cell_set(nx, ny, LAYER_LEVEL, P_DV_V, 0);
        }
        else {
          this.level.cell_remove(nx, ny, LAYER_LEVEL);
          var cell = this.level.cell_get(nx, ny, LAYER_FLOOR);
          cell.item = P_GROUND;
          cell.variant = 2;
          this.level.cell_draw(cell, nx, ny, true);
        }
        this.animation_bug_move(direction, nx, ny, false);
        if(player.key_color_remove()) {
          this.level.panel_draw_player(player.number);
        }
        return;
      }
      break;
    case P_ID_DOOR1_H_Z: // ID doors
    case P_ID_DOOR2_H_Z:
    case P_ID_DOOR3_H_Z:
    case P_ID_DOOR4_H_Z:
    case P_ID_DOOR5_H_Z:
      if(player.number == (cell.item - P_ID_DOOR1_H_Z))
      {
        var cell = this.level.cell_get(nx, ny, LAYER_LEVEL);
        if(cell.animation)
          this.anim.remove(cell.animation);
        this.level.cell_set(nx, ny, LAYER_LEVEL, P_ID_DOOR1_H_O + player.number, cell.variant);
        this.animation_bug_move(direction, nx, ny, false);
        return;
      }
      break;
    case P_ID_DOOR1_V_Z: // ID doors
    case P_ID_DOOR2_V_Z:
    case P_ID_DOOR3_V_Z:
    case P_ID_DOOR4_V_Z:
    case P_ID_DOOR5_V_Z:
      if(player.number == (cell.item - P_ID_DOOR1_V_Z))
      {
        var cell = this.level.cell_get(nx, ny, LAYER_LEVEL);
        if(cell.animation)
          this.anim.remove(cell.animation);
        this.level.cell_set(nx, ny, LAYER_LEVEL, P_ID_DOOR1_V_O + player.number, cell.variant);
        this.animation_bug_move(direction, nx, ny, false);
        return;
      }
      break;
    default:
      break;
  }
  player.is_moving = false;
}
Game.prototype.bug_switch = function(number)
{
  if(this.level.player_active.is_moving) {
    return;
  }
  this.level.player_switch(number);
  this.mattock_panel.update(this.level.player_active);
}
Game.prototype.level_cell_animate = function(cell, x, y, layer)
{
  var obj = this.repo.get_object(cell.item, cell.variant);
  if(obj.flags&ANIM_TRIGGER_INSERT) {
    cell.animation = this.anim.create_anim(this.anim.generate_anim(obj.animation), x, y,
                                           layer, NO_ROTATION);
  }
}
Game.prototype.level_animate = function()
{
  for(var y = 0; y < LEVEL_CELLS_Y; y++) {
    for(var x = 0; x < LEVEL_CELLS_X; x++) {
      var cell = this.level.cell_get(x, y, LAYER_LEVEL);
      if(cell.item != NO_ITEM) {
        this.level_cell_animate(cell, x, y, LAYER_LEVEL);
      }
    }
  }
}
