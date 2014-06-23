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

// An active game animation
function GameAnimation(template, x, y, layer, rotation, callback, callback_param)
{
  // GameAnimTemplate for this animation
  this.anim_template = template;

  this.frame_current = 0;
  this.frame_correction = 0;

  this.position_in_animation = 0;

  // Position in level (x,y,layer)
  this.x = x;
  this.y = y;
  this.layer = layer;

  // rotation of the rendered item
  this.rotation = rotation;
  
  // callback functions at animation end
  this.callback = callback;
  this.callback_param = callback_param;
}

GameAnimation.prototype.start = function()
{
  this.frame_current = 0;
  this.frame_correction = this.anim_template.frame_correction;
  this.position_in_animation = 0;
}

GameAnimation.prototype.stop = function()
{
  if (this.callback != undefined) {
    this.callback(this.callback_param);
  }
}

GameAnimation.prototype.process = function(level)
{ 
/*
  if(flag&ANIM_REMOVE) {
    stop(p_queue, p_events, TRUE);
    return(true);
  }
*/
  if(this.frame_current >= this.anim_template.frame_num) {
    if(this.flag&(ANIM_LOOP))
      this.start();
    else {
      this.stop();
      return;
    }
  }

  if(this.frame_correction) {
    this.frame_correction--;
  } else {
    this.frame_correction = this.anim_template.frame_correction;

    var cell = level.cell_get(this.x, this.y, this.layer);

    if(this.anim_template.flags&ANIM_SPRITE) {
      level.graph.sprite_remove(cell.sprite_handle);
      var spr = this.anim_template.sprite_first + this.anim_template.sprite_step * this.position_in_animation;
      cell.sprite_handle = level.graph.sprite_insert(spr);

      if(this.rotation != NO_ROTATION) {
        cell.rotation = this.rotation;
      }
    }

    if(this.anim_template.flags&ANIM_MOVE) {
      cell.diff_x += this.anim_template.dx;
      cell.diff_y += this.anim_template.dy;
    }

    level.cell_draw(cell, this.x, this.y);

    this.position_in_animation++;
    this.frame_current++;
  }
}

// Performs the animations
function GameAnimationEngine(level) 
{
  // Reference to level interface
  this.level = level;

  // Array of anim templates
  this.anim_templates = new GameAnimTemplateRepository();
  this.anim_templates.load();
  
  // Array of running animations
  this.anim_running = Array();
}

GameAnimationEngine.prototype.create = function(template, x, y, layer, rotation, 
                                                callback, callback_param)
{  
  var index = this.anim_running.push(new GameAnimation(this.anim_templates.anim_template[template],
                                                       x, y, layer, rotation, 
                                                       callback, callback_param));
  return this.anim_running[index - 1];
}

GameAnimationEngine.prototype.process = function()
{
  var anim_size = this.anim_running.length;
  for (var i = 0; i < anim_size; i++) {
    this.anim_running[i].process(this.level);
  }
}
