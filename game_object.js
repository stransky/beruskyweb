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

var GAME_REPO_FILE = "data/GameData/items.dat"

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

var REC_NUM = 12

GameObject.prototype.parse_line = function(line)
{
  var token_pos = 0;
  
  tokens = line.split("\t");
  for(var i = 0; i < tokens.length; i++) {
    var token = tokens[i];
    if(token.length != 0) {
      // we should have 12 tokens
      switch(token_pos) {
        case 0: // item number
        this.item = token_translate(token).base;
        this.variant = token_translate(token).variant;
        break;
        case 1: // item function
        this.func = token_translate(token).num;
        break;
        case 2: // flags
        this.flags = token_translate(token).num;
        break;
        case 3: // minus_x
        this.minus_x = parseInt(token).num;
        break;
        case 4: // plus_x
        this.plus_x = parseInt(token).num;
        break;
        case 5: // x_cor
        this.x_cor = parseInt(token).num;
        break;
        case 6: // y_cor
        this.y_cor = parseInt(token).num;
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

function ObjectsRepository() {
  // Two dimensional arrays of GameObjects
  this.repo = Array();
}

ObjectsRepository.prototype.load = function()
{
  var data = load_file_text("data/GameData/items.dat");
  var lines = data.split("\n");
  
  this.repo = Array();
  for(var i = 0; i < lines.length; i++) {
    var tline = lines[i].trim();
    if(tline[0] != '#' && tline.length != 0) {
      var obj = new GameObject();
      obj.parse_line(tline);
      
      if(!(this.repo[obj.item].isArray()))
        this.repo[obj.item] = Array();
      
      this.repo[obj.item][obj.variant] = obj;
    }
  }
  
  console.log("Repository objects loaded = " + this.repo.length);
}
