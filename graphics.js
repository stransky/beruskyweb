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

sprite_insert_callback = function()
{  
  var position = this.callback_object.position;
  var position_base = this.callback_object.position;
  var sprites = this.responseText.split("\n");
  var base_text;
  var base_rect;
  
  for (i = 0; i < sprites.length; i++) {
    var line = sprites[i];
    if(line[0] == "s") {
      // s x y dx dy scale
      var sprite_file = this.callback_object.file.replace(".spr",".png");      
      base_text = PIXI.Texture.fromImage(sprite_file).baseTexture;

      var r = line.slice(2).split(" ");
      base_rect = new PIXI.Rectangle(parseInt(r[0]), 
                                     parseInt(r[1]), 
                                     parseInt(r[2]), 
                                     parseInt(r[3]));

      this.callback_object.graph.sprites[position] = new PIXI.Texture(base_text, base_rect.clone());
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

        this.callback_object.graph.sprites[position] = new PIXI.Texture(base_text, base_rect.clone());
        position++;
      }
    }
  }  
}

// file     - sprite_file.spr
// position - first used handle
Graph.prototype.sprite_insert = function(file, position) 
{ 
  load_file_text(file, sprite_insert_callback, { graph : this, position : position, file : file});
}

// Draws sprite at specified location and returns handle to 
// displayed object
Graph.prototype.draw = function(spr, x, y, rotation)
{  
  var sprite = new PIXI.Sprite(this.sprites[spr]);

  sprite.position.x = x+(sprite.width/2);
  sprite.position.y = y+(sprite.height/2);
  sprite.anchor.x = 0.5;
  sprite.anchor.y = 0.5;
  sprite.rotation = (Math.PI/2)*(rotation || 0);

  this.stage.addChild(sprite);
  
  return(sprite);
}

Graph.prototype.sprite_move = function(sprite_handle, x, y)
{  
  sprite_handle.position.x = x+(sprite_handle.width/2);
  sprite_handle.position.y = y+(sprite_handle.height/2);  
  return(sprite_handle);
}

Graph.prototype.remove = function(sprite_handle)
{  
  this.stage.removeChild(sprite_handle);
}

Graph.prototype.sprites_load = function()
{
  var i;

  i  = this.sprite_insert("data/Graphics/global1.spr", FIRST_GLOBAL_LEVEL);
  i += this.sprite_insert("data/Graphics/klasik1.spr", FIRST_CLASSIC_LEVEL);
  i += this.sprite_insert("data/Graphics/kyber1.spr",  FIRST_CYBER_LEVEL);
  i += this.sprite_insert("data/Graphics/herni1.spr",  FIRST_OTHER);
  i += this.sprite_insert("data/Graphics/game_cur.spr",FIRST_CURSOR);
  i += this.sprite_insert("data/Graphics/hraci1.spr",  FIRST_PLAYER);

  console.log("Loaded sprites " + i);
}

Graph.prototype.background_load = function(background)
{
  background = background+1;
  var back = this.sprite_insert("data/Graphics/background" + background + ".spr", FIRST_BACKGROUND);
  console.log("Loaded background(" + background + ") result = " + back);
}

Graph.prototype.init = function()
{
  this.stage = new PIXI.Stage(0x000000);
  this.renderer = PIXI.autoDetectRenderer(GAME_RESOLUTION_X, GAME_RESOLUTION_Y);
  this.sprites_load();
}
