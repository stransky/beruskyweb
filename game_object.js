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

function ObjectsRepository() {
  // Array of GameObject's
  this.repo = {};
}

var REC_NUM = 12

ObjectsRepository.prototype.parse_line = function(line)
{
  tokens = line.split("\t");
  for(var i = 0, var token_pos = 0; i < tokens.length; i++) {
    var token = tokens[i];
    if(token.length != 0) {
      // we should have 12 tokens
      switch(token_pos) {
        case 0: // item number
        this.item = token_translate(token);
        break;
        case 1: // item function
        this.func = token_translate(token);
        break;
      
      
      }
      token_pos++;
    }
  }  
}

ObjectsRepository.prototype.load = function()
{
  var data = load_file_text("data/GameData/items.dat");
  var lines = data.split("\n");
  
  for(var i = 0; i < lines.length; i++) {
    var tline = lines[i].trim();
    if(tline[0] != '#' && tline.length != 0) {
      this.parse_line(tline);
    }
  }
}
