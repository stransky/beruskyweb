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
  this.sprites_to_load = 0;
  this.sprites_loaded = 0;  
  this.font_table = Array();
}

Graph.prototype.render = function() {  
  this.renderer.render(this.stage);
}

Graph.prototype.get_renderer = function() {
  return(this.renderer);
}

sprite_load_callback = function()
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
  this.callback_object.graph.sprites_loaded++;
  console.log(this.callback_object.graph.sprites_loaded + " : " + this.callback_object.file + " loaded...");
}

Graph.prototype.is_loaded = function()
{
  return(this.sprites_loaded == this.sprites_to_load);
}

// file     - sprite_file.spr
// position - first used handle
Graph.prototype.sprite_load = function(file, position)
{ 
  this.sprites_to_load++;
  load_file_text(file, sprite_load_callback, { graph : this, position : position, file : file});
}

// Draws sprite at specified location and returns handle to 
// displayed object
Graph.prototype.sprite_insert = function(spr)
{
  var sprite = new PIXI.Sprite(this.sprites[spr]);
  sprite.anchor.x = 0.5;
  sprite.anchor.y = 0.5;
  this.stage.addChild(sprite);
  return(sprite);
}

Graph.prototype.sprite_move = function(sprite_handle, x, y)
{  
  sprite_handle.position.x = x+(sprite_handle.width/2);
  sprite_handle.position.y = y+(sprite_handle.height/2);  
  return(sprite_handle);
}

Graph.prototype.sprite_rotate = function(sprite_handle, rotation)
{  
  sprite_handle.rotation = (Math.PI/2)*rotation;
  return(sprite_handle);
}

Graph.prototype.sprite_remove = function(sprite_handle)
{    
  this.stage.removeChild(sprite_handle);  
}

Graph.prototype.sprites_load = function()
{  
  this.sprite_load("data/Graphics/global1.spr", FIRST_GLOBAL_LEVEL);
  this.sprite_load("data/Graphics/klasik1.spr", FIRST_CLASSIC_LEVEL);
  this.sprite_load("data/Graphics/kyber1.spr",  FIRST_CYBER_LEVEL);
  this.sprite_load("data/Graphics/herni1.spr",  FIRST_OTHER);
  this.sprite_load("data/Graphics/game_cur.spr",FIRST_CURSOR);
  this.sprite_load("data/Graphics/hraci1.spr",  FIRST_PLAYER);
}

Graph.prototype.background_load = function(background)
{
  background = background+1;
  this.sprite_load("data/Graphics/background" + background + ".spr", FIRST_BACKGROUND);
}

Graph.prototype.init = function()
{
  this.stage = new PIXI.Stage(0x000000);
  this.renderer = PIXI.autoDetectRenderer(GAME_RESOLUTION_X, GAME_RESOLUTION_Y);
  this.sprites_load();

  for(var i = 0; i < FONT_NUM; i++) {
    this.load_font(i, FIRST_FONT + i*FONT_STEP, FONT_SPRITES);
  }
}

Graph.prototype.load_font = function(font_num, sprite_first, sprite_num)
{
  this.sprite_load("data/Graphics/font" + font_num + ".spr",  sprite_first);

  var font = this.font_table[font_num] = new FontTable();
  font.sprite_first = sprite_first;
  font.sprite_num = sprite_num;
  font.load("data/Graphics/font" + font_num + ".tab");
}

function FontTable() {
  this.position = Array();
  this.loaded = false;
  this.sprite_first = 0;
  this.sprite_num = 0;
}

FontTable_load_callback = function()
{
  var font_table = this.callback_object;
  var chars = this.responseText.split("\n");

  for (i = 0; i < chars.length; i++) {
    var c = chars[i];
    font_table.position[(c.toLowerCase())[0]] = i;
    font_table.position[(c.toUpperCase())[0]] = i;
  }
  this.loaded = true;
}

FontTable.prototype.load = function(file)
{
  load_file_text(file, FontTable_load_callback, this);
}
