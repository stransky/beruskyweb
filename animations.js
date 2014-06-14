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
function GameAnimation(template, x, y, layer, rotation) 
{
  // GameAnimTemplate for this animation
  this.anim_template = template;
    
  this.frame_num = 0;
  this.frame_current = 0;
  this.frame_correction = 0;

  this.position_in_animation = 0;

  // Position in level (x,y,layer)
  this.x = x;
  this.y = y;
  this.layer = layer;
  
  // rotation of the rendered item
  this.rotation = rotation;
}

// Performs the animations
function GameAnimationEngine(level) {

  // Reference to level interface
  this.level = level;

  // Array of anim templates
  this.anim_templates = new GameAnimTemplateRepository();
  this.anim_templates.load();
  
  // Array of running animations
  this.anim_running = Array();
}

GameAnimationEngine.prototype.create = function(template, x, y, layer, rotation)
{
  var index = this.anim_running.push(new GameAnimation(template, x, y, layer, rotation));
  return this.anim_running[index - 1];
}

/*
void animation::process_sprite_animation(LEVEL_GAME *p_level)
{
  ANIMATION_TEMPLATE *p_template = p_repository->get(thandle);
  spr_handle spr = 0;

  if(!p_template->p_sprite_table) {
    spr = p_template->sprite_first + p_template->sprite_step * position_in_animation;
    assert(p_template->sprite_step * position_in_animation < p_template->sprite_num);
  } else {
    spr = p_template->p_sprite_table[position_in_animation];
  }
*/
GameAnimationEngine.prototype.process = function()
{
  var anim_template = this.anim_templates[this.anim_template];
  var cell = this.level.cell_get(this.x, this.y, this.layer);

  if(anim_template.flag&ANIM_SPRITE) {
    var spr = anim_template.sprite_first + anim_template.sprite_step * this.position_in_animation;
    cell.sprite_handle = 
    
    if(this.rotation != NO_ROTATION) {
      cell.rotation = this.rotation;
    }
  }

  if(anim_template.flag&ANIM_MOVE) {
    cell.diff_x += anim_template.dx;
    cell.diff_y += anim_template.dy;
  }    
  this.cell_draw(cell, x, y);
}

/*
bool animation::process(LEVEL_GAME *p_level, LEVEL_EVENT_QUEUE *p_queue, int *p_events)
{ 

  if(flag&ANIM_REMOVE) {
    stop(p_queue, p_events, TRUE);
    return(true);
  }

  if(frame_current >= frame_num) {
    if(flag&(ANIM_LOOP))
      start();
    else {
      stop(p_queue, p_events, TRUE);
      return(true);
    }
  }

  if(frame_correction) {
    frame_correction--;
  } else {
    frame_correction = p_repository->get_frame_correction(thandle,position_in_animation);
  
    if(flag&ANIM_SPRITE) {
      process_sprite_animation(p_level);
    }

    if(flag&ANIM_MOVE) {
      process_move_animation(p_level);
    }    
  
    position_in_animation++;
    frame_current++;
  }  

  return(false);
}
*/
