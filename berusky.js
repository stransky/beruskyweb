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


function Game() {
  this.graph = new Graph();
  this.graph.init();

  document.body.appendChild(this.graph.get_renderer().view);

  this.repo = new ObjectsRepository();

  this.level = new Level(this.graph);
  this.input = new Input(this);
  
  this.anim = new GameAnimationEngine(this.level);

  this.loaded = false;
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
  }
  this.loaded = true;
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

  if(this.input.key_get(BUG_SWITCH))
    this.bug_switch();

/*
    case KeyEvent.DOM_VK_1:
    case KeyEvent.DOM_VK_2:
    case KeyEvent.DOM_VK_3:
    case KeyEvent.DOM_VK_4:
    case KeyEvent.DOM_VK_5:
      this.game.bug_switch(event.keyCode-KeyEvent.DOM_VK_1);
*/
}

Game.prototype.game_loop = function() 
{
  if(!this.loaded) {
    this.game_load();
    return;
  }
  
  // Update all running animations
  this.anim.process();
  
  this.game_play();
  
  this.graph.render();
}

// Load the game
Game.prototype.level_load = function(name) 
{
  this.level.load(name);  
}

// Animate bug movement
Game.prototype.animation_bug_move = function(direction, nx, ny)
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

  var data = { game:this, x:x, y:y, nx:nx, ny:ny };
  this.anim.create(anim, x, y, LAYER_PLAYER, rotation, this.animation_bug_move_end, data);
  this.anim.create(player.number - ANIM_PLAYER_1, x, y, LAYER_PLAYER, rotation);
}

Game.prototype.animation_bug_move_end = function(data)
{
  data.game.level.item_diff_set(data.x, data.y, 0, 0, LAYER_PLAYER);
  data.game.level.item_diff_set(data.nx, data.ny, 0, 0, LAYER_PLAYER);
  data.game.level.item_move(data.x, data.y, data.nx, data.ny, LAYER_PLAYER);

  var player = data.game.level.player_active;
  player.x = data.nx; player.y = data.ny;

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
  this.anim.create(anim, x, y, LAYER_LEVEL, NO_ROTATION, this.animation_box_move_end, data);
}

Game.prototype.animation_box_move_end = function(data)
{
  data.game.level.item_diff_set(data.x, data.y, 0, 0, LAYER_LEVEL);
  data.game.level.item_diff_set(data.nx, data.ny, 0, 0, LAYER_LEVEL);
  data.game.level.item_move(data.x, data.y, data.nx, data.ny, LAYER_LEVEL);
}

// Get an active player
// Check if we can move
// Move it
Game.prototype.bug_move = function(direction)
{
  var player = this.level.player_active;
  if(player.is_moving)
    return;    
  player.is_moving = true;

  if(this.anim.anim_running.length != 0)
    throw "Animace!";

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

  var cell = this.level.item_get(nx, ny);
  var cell_next = this.level.item_get(nnx, nny);

  switch(cell.item) {
    case NO_ITEM:
      this.animation_bug_move(direction, nx, ny);
      return;
    case P_BOX:
      if(cell_next.item == NO_ITEM) {
        this.animation_bug_move(direction, nx, ny);
        this.animation_box_move(direction, nx, ny, nnx, nny);
        return;
      }
      break;
    case P_TNT:
      if(cell_next.item == NO_ITEM) {
        this.animation_bug_move(direction, nx, ny);
        this.animation_box_move(direction, nx, ny, nnx, nny);
        return;
      } else if(cell_next.item == P_BOX) {

      }
      break;
    case P_EXIT:
      break;
    case P_STONE:
      break;
    case P_KEY:
      if(player.keys_final < 5) {
        this.animation_bug_move(direction, nx, ny);
        player.keys_final++;
        return;
      }
      break;
    case P_MATTOCK:
      break;
    case P_KEY1:
    case P_KEY2:
    case P_KEY3:
    case P_KEY4:
    case P_KEY5:    
      break;
    default:
      break;
  }
    
  player.is_moving = false;
}

Game.prototype.bug_switch = function(number)
{
  alert("bug_switch " + number);
}
