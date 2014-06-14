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
  
  this.x = x;
  this.y = y;
  this.layer = layer;
  this.rotation = rotation;
}

// Performs the animations
function GameAnimationEngine() {

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
