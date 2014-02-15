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

function Graph() {
  // Game textures
  this.sprites = Array();
}

// file     - sprite_file.spr
// position - first used handle
Graph.prototype.sprite_insert = function(file, position) 
{  
  var position_base = position;
  var sprites = load_file_text(file).split("\n");
  var base_text;
  var base_rect;
  
  for (i = 0; i < sprites.length; i++) {
    var line = sprites[i];
    if(line[0] == "s") {
      // s x y dx dy scale
      
      var sprite_file = file.replace(".spr",".png");      
      base_text = PIXI.Texture.fromImage(sprite_file).baseTexture;

      var r = line.slice(2).split(" ");
      base_rect = new PIXI.Rectangle(parseInt(r[0]), 
                                     parseInt(r[1]), 
                                     parseInt(r[2]), 
                                     parseInt(r[3]));

      var text = new PIXI.Texture(base_text, base_rect);
      this.sprites[position] = new PIXI.Sprite(text);
      
      position++;
    }
    else {
      //f offset_x offset_y offset_dx offset_dy num 

      var l = line.slice(2).split(" ");
      var num = parseInt(l[4]);

      for(i = 0; i < num; i++) {
        base_rect.x += parseInt(l[0]);
        base_rect.y += parseInt(l[1]);
        base_rect.width += parseInt(l[2]);
        base_rect.height += parseInt(l[3]);

        var text = new PIXI.Texture(base_text, base_rect);
        this.sprites[position] = new PIXI.Sprite(text);

        position++;
      }
    }
  }

  return(position - position_base);
}

Graph.prototype.draw = function(spr, x, y) 
{  

}

var graph = new Graph();
