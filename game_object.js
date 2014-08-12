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

/* Game item data
*/
var GAME_REPO_FILE = "data/GameData/items.dat"
var GAME_REPO_ANIM_FILE = "data/GameData/items_animation.dat"

function GameObject() {

  this.item = 0;  // object number
  this.variant = 0;  // object variant

  this.func = 0;  // item function
  this.flags = 0; // sprite flags

  // x - corrections for main item
  this.minus_x = 0;
  this.plus_x = 0;

  // x/y corrections (for sub-objects)
  this.x_cor = 0;
  this.y_cor = 0;

  this.sprite = 0;    // sprite for this item
  this.animation = 0; // animation for this item

  this.sub_objects = []; // two sub-objects
}

GameObject.prototype.parse_line = function(line)
{
  var token_pos = 0;

  var tokens = line.split("\t");
  for(var i = 0; i < tokens.length; i++) {
    var token = tokens[i];
    if(token.length != 0) {
      // we should have 12 tokens
      switch(token_pos) {
        case 0: // item number
        var tmp = token_translate(token);
        this.item = tmp.base;
        this.variant = tmp.offset;
        break;
        case 1: // item function
        this.func = token_translate(token).num;
        break;
        case 2: // flags
        this.flags = token_translate(token).num;
        break;
        case 3: // minus_x
        this.minus_x = parseInt(token, 10);
        break;
        case 4: // plus_x
        this.plus_x = parseInt(token, 10);
        break;
        case 5: // x_cor
        this.x_cor = parseInt(token, 10);
        break;
        case 6: // y_cor
        this.y_cor = parseInt(token, 10);
        break;
        case 7: // sprite
        this.sprite = token_translate(token).num;
        break;
        case 8: // animation
        this.animation = token_translate(token).num;
        break;
        case 9: // animation flags
        this.flags |= token_translate(token).num;
        break;
        case 10: // sub-object1
        break;
        case 11: // sub-object2
        break;
        default:
        break;
      }
      token_pos++;
    }
  }
}

GameObject.prototype.parse_anim_line = function(line)
{
  var token_pos = 0;

  var tokens = line.split("\t");
  for(var i = 0; i < tokens.length; i++) {
    var token = tokens[i];
    if(token.length != 0) {
      // we should have 12 tokens
      switch(token_pos) {
        case 0: // item number
        var tmp = token_translate(token);
        this.item = tmp.base;
        this.variant = tmp.offset;
        break;
        case 1: // animation
        this.animation = token_translate(token).num;
        break;
        case 2: // animation flags
        this.flags = token_translate(token).num;
        break;
        default:
        break;
      }
      token_pos++;
    }
  }
}

GameObject.prototype.print = function()
{
  console.log("GameObject item = " + this.item);
  console.log("  variant:  " + this.variant);
  console.log("  function: " + this.func);
  console.log("  sprite:   " + this.sprite);
  console.log("  flags:    " + this.flags);
  console.log("  animation:" + this.animation);
}

function ObjectsRepository() {
  // Two dimensional arrays of GameObjects
  this.repo = Array();
  this.loaded = 0;
  this.load();
}

ObjectsRepository.prototype.is_loaded = function() {
  return(this.loaded == 2);
}

ObjectsRepository_load_callback = function()
{
  var lines = this.responseText.split("\n");
  var loaded = 0;

  this.callback_object.ObjectsRepository.repo = Array();
  for(var i = 0; i < lines.length; i++) {
    var tline = lines[i].trim();

    if(tline[0] != '#' && tline.length != 0) {
      var obj = new GameObject();
      obj.parse_line(tline);
      // Debug print
      // obj.print();

      if(this.callback_object.ObjectsRepository.repo[obj.item] === undefined)
        this.callback_object.ObjectsRepository.repo[obj.item] = Array();

      this.callback_object.ObjectsRepository.repo[obj.item][obj.variant] = obj;
      loaded++;
    }
  }

  console.log("Repository objects loaded = " + loaded);
  this.callback_object.ObjectsRepository.loaded++;
}

ObjectsRepository_load_anim_callback = function()
{
  var lines = this.responseText.split("\n");
  var loaded = 0;

  for(var i = 0; i < lines.length; i++) {
    var tline = lines[i].trim();
    
    if(tline[0] != '#' && tline.length != 0) {
      var obj = new GameObject();
      obj.parse_anim_line(tline);
      // Debug print
      //obj.print();

      if(this.callback_object.ObjectsRepository.repo[obj.item] === undefined)
        throw "ObjectsRepository_load_anim_callback - obj.item is undefined!";

      if(this.callback_object.ObjectsRepository.repo[obj.item][obj.variant] === undefined)
        throw "ObjectsRepository_load_anim_callback - obj.variant is undefined!";

      var tmp = this.callback_object.ObjectsRepository.repo[obj.item][obj.variant];

      tmp.flags = obj.flags;
      tmp.animation = obj.animation;

      loaded++;
    }
  }

  console.log("Repository anim objects loaded = " + loaded);
  this.callback_object.ObjectsRepository.loaded++;
}

ObjectsRepository.prototype.load = function()
{
  load_file_text(GAME_REPO_FILE, ObjectsRepository_load_callback,
                 { ObjectsRepository : this });
  load_file_text(GAME_REPO_ANIM_FILE, ObjectsRepository_load_anim_callback,
                 { ObjectsRepository : this });
}

ObjectsRepository.prototype.get_object = function(item, variant)
{
  if(this.repo[item][variant] === undefined) {
    throw ("Undefined object repository - item = " + item + " variant = " + variant);
  }
  return this.repo[item][variant];
}

ObjectsRepository.prototype.get_sprite = function(item, variant)
{
  var obj = this.get_object(item, variant);
  return obj.sprite;
}

/* Item animation data
*/

var GAME_ANIM_FILE = "data/GameData/anim.dat"

function GameAnimTemplate(flags, frames) {

  this.template_handle = 0;

  this.flags = (flags == undefined) ? 0 : flags;

  this.frame_num = (frames == undefined) ? 0 : frames;
  this.frame_correction = 0;

  this.dx = 0;
  this.dy = 0;

  this.sprite_first = 0;
  this.sprite_num = 0;
  this.sprite_step = 0;

  this.sprite_table = 0;
  this.delay_table = 0;
}

GameAnimTemplate.prototype.create_sprite_table = function(frame_num, sprite_table, delay_table)

{
  this.frame_num = frame_num;
  this.sprite_table = sprite_table;
  this.delay_table = delay_table;

  this.sprite_step = 0;
  this.sprite_first = 0;
  this.frame_correction = 0;
}

GameAnimTemplate.prototype.get_frame_correction = function(position_in_animation)
{
  return(this.delay_table ? this.delay_table[position_in_animation] :
                            this.frame_correction);
}

GameAnimTemplate.prototype.parse_line = function(line)
{
  var token_pos = 0;

  var tokens = line.split("\t");
  for(var i = 0; i < tokens.length; i++) {
    var token = tokens[i];
    if(token.length != 0) {
      switch(token_pos) {
        case 0: // template handle
        this.template_handle = token_translate(token).num;
        break;
        case 1: // flags
        this.flags = token_translate(token).num;
        break;
        case 2: // frame_num
        this.frame_num = token_translate(token).num;
        break;
        case 3: // dx
        this.dx = parseInt(token, 10);
        break;
        case 4: // dy
        this.dy = parseInt(token, 10);
        break;
        case 5: // sprite_first
        this.sprite_first = token_translate(token).num;
        break;
        case 6: // sprite_num
        this.sprite_num = token_translate(token).num;
        break;
        case 7: // sprite_step
        this.sprite_step = parseInt(token, 10);
        break;
        case 8: // frame_correction
        this.frame_correction = parseInt(token, 10);
        break;
        default:
        break;
      }
      token_pos++;
    }
  }
}

GameAnimTemplate.prototype.load_update = function()
{
  if(this.flags&ANIM_SPRITE && this.flags&ANIM_ADD_INVERSE) {
    var spr_array = Array();
    var time_array = Array();

    for(var j = 0; j < this.frame_num; j++) {
      spr_array[j] = this.sprite_first + j*this.sprite_step;
      time_array[j] = this.frame_correction;
    }

    var frame_num = this.frame_num*2-2;
    for(var j = this.frame_num; j < frame_num; j++) {
      spr_array[j] = spr_array[frame_num - j];
      time_array[j] = this.frame_correction;
    }
  
    this.create_sprite_table(frame_num, spr_array, time_array);      
  }
}

GameAnimTemplate.prototype.print = function()
{
  console.log("GameAnimTemplate handle = " + this.template_handle);
  console.log("  flags:        " + this.flags);
  console.log("  frame_num:    " + this.frame_num);
  console.log("  dx:           " + this.dx);
  console.log("  dy:           " + this.dy);
  console.log("  sprite_first: " + this.sprite_first);
  console.log("  sprite_num:   " + this.sprite_num);
  console.log("  sprite_step:  " + this.sprite_step);
  console.log("  frame_correction:" + this.frame_correction);
}

function GameAnimTemplateRepository() {
  // Two dimensional arrays of GameObjects
  this.anim_template = Array();
  this.loaded = false;
  this.load();
}

GameAnimTemplateRepository.prototype.is_loaded = function() {
  return(this.loaded);
}

GameAnimTemplateRepository_load_callback = function()
{
  var lines = this.responseText.split("\n");
  var loaded = 0;

  this.callback_object.GameAnimTemplateRepository.anim_template = Array();
  for(var i = 0; i < lines.length; i++) {
    var tline = lines[i].trim();

    //console.log(tline);
    if(tline[0] != '#' && tline.length != 0) {
      var obj = new GameAnimTemplate();
      obj.parse_line(tline);
      obj.load_update();
      // Debug print
      obj.print();

      this.callback_object.GameAnimTemplateRepository.anim_template[obj.template_handle] = obj;
      loaded++;
    }
  }

  console.log("Repository objects loaded = " + loaded);
  this.callback_object.GameAnimTemplateRepository.loaded = true;
}

GameAnimTemplateRepository.prototype.load = function()
{
  load_file_text(GAME_ANIM_FILE, GameAnimTemplateRepository_load_callback ,
                 { GameAnimTemplateRepository : this });
}

GameAnimTemplateRepository.prototype.insert = function(handle, anim)
{
  if(this.anim_template[handle] != undefined) {
    throw "The anim slot is not empty!"
  }
  this.anim_template[handle] = anim;
}

GameAnimTemplateRepository.prototype.get_object = function(anim_template)
{
  if(this.anim_template[anim_template] === undefined) {
    console.log("Undefined object repository - anim_template = " + anim_template);
  }
  return this.anim_template[anim_template];
}
