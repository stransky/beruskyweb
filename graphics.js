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
  // Game sprites (a.k.a textures in PIXI terminology)
  this.sprites = Array();
}

Graph.prototype.render = function() {  
  this.renderer.render(this.stage);
}

Graph.prototype.get_renderer = function() {  
  return(this.renderer);
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

      this.sprites[position] = new PIXI.Texture(base_text, base_rect);
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
        
        this.sprites[position] = new PIXI.Texture(base_text, base_rect);
        position++;
      }
    }
  }

  return(position - position_base);
}

Graph.prototype.draw = function(spr, x, y) 
{  
  var sprite = new PIXI.Sprite(this.sprites[spr])  
  sprite.position.x = x;
  sprite.position.y = y;
  this.stage.addChild(sprite);
}

var FIRST_GLOBAL_LEVEL      = 0
var FIRST_CLASSIC_LEVEL     = 100
var FIRST_CYBER_LEVEL       = 200
var FIRST_BACKGROUND        = 400
var FIRST_OTHER             = 410
var FIRST_CURSOR            = 590
var FIRST_PLAYER            = 600
var FIRST_MENU              = 700
var FIRST_LOGO              = 800
var FIRST_FONT              = 1000
var ROT_SHIFT               = 10000

Graph.prototype.load = function()
{
  var i;

  i  = this.sprite_insert("data/Graphics/global1.spr", FIRST_GLOBAL_LEVEL);
  i += this.sprite_insert("data/Graphics/global2.spr", FIRST_GLOBAL_LEVEL + ROT_SHIFT);
  i += this.sprite_insert("data/Graphics/global3.spr", FIRST_GLOBAL_LEVEL + 2 * ROT_SHIFT);
  i += this.sprite_insert("data/Graphics/global4.spr", FIRST_GLOBAL_LEVEL + 3 * ROT_SHIFT);

  i += this.sprite_insert("data/Graphics/klasik1.spr", FIRST_CLASSIC_LEVEL);
  i += this.sprite_insert("data/Graphics/klasik2.spr", FIRST_CLASSIC_LEVEL + ROT_SHIFT);
  i += this.sprite_insert("data/Graphics/klasik3.spr", FIRST_CLASSIC_LEVEL + 2 * ROT_SHIFT);
  i += this.sprite_insert("data/Graphics/klasik4.spr", FIRST_CLASSIC_LEVEL + 3 * ROT_SHIFT);

  i += this.sprite_insert("data/Graphics/kyber1.spr", FIRST_CYBER_LEVEL);
  i += this.sprite_insert("data/Graphics/kyber2.spr", FIRST_CYBER_LEVEL + ROT_SHIFT);
  i += this.sprite_insert("data/Graphics/kyber3.spr", FIRST_CYBER_LEVEL + 2 * ROT_SHIFT);
  i += this.sprite_insert("data/Graphics/kyber4.spr", FIRST_CYBER_LEVEL + 3 * ROT_SHIFT);

  i += this.sprite_insert("data/Graphics/herni1.spr",  FIRST_OTHER);
  i += this.sprite_insert("data/Graphics/herni2.spr",  FIRST_OTHER + ROT_SHIFT);

  i += this.sprite_insert("data/Graphics/game_cur.spr", FIRST_CURSOR);

  i += this.sprite_insert("data/Graphics/hraci1.spr", FIRST_PLAYER);
  i += this.sprite_insert("data/Graphics/hraci2.spr", FIRST_PLAYER + ROT_SHIFT);
  i += this.sprite_insert("data/Graphics/hraci3.spr", FIRST_PLAYER + 2 * ROT_SHIFT);
  i += this.sprite_insert("data/Graphics/hraci4.spr", FIRST_PLAYER + 3 * ROT_SHIFT);

  console.log("Loaded sprites " + i);
}

var GAME_RESOLUTION_X = 640
var GAME_RESOLUTION_Y = 480

Graph.prototype.init = function()
{
	this.stage = new PIXI.Stage(0x000000);
	this.renderer = PIXI.autoDetectRenderer(GAME_RESOLUTION_X, GAME_RESOLUTION_Y);
  this.load();
}
