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

function Rect() {
  this.x = 0;
  this.y = 0;
  this.width = 0;
  this.height = 0;
}

function Graph() {
  // Game sprites (a.k.a textures in PIXI terminology)
  this.sprites = Array();
  this.sprites_to_load = 0;
  this.sprites_loaded = 0;
  this.font_table = Array();

  this.font_ax = 0;
  this.font_ay = 0;
  this.font_align = ALIGN_LEFT;
}

Graph.prototype.render = function() {
  this.renderer.render(this.stage);
}

Graph.prototype.get_renderer = function() {
  return(this.renderer);
}

// Clears whole screen - removes all sprites
Graph.prototype.clear = function()
{
  // code by enpu
  for (var i = this.stage.children.length - 1; i >= 0; i--) {
    this.stage.removeChild(this.stage.children[i]);
  }
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
Graph.prototype.sprite_insert = function(spr, x, y)
{
  var sprite = new PIXI.Sprite(this.sprites[spr]);
  sprite.anchor.x = 0.5;
  sprite.anchor.y = 0.5;
  this.stage.addChild(sprite);

  if(x !== undefined && y !== undefined) {
    sprite.position.x = x+(sprite.width/2);
    sprite.position.y = y+(sprite.height/2);
  }

  return(sprite);
}

// Insert interactive sprite
// on mouse-over - draws spr_active or call callback_over
// on mouse-click - call callback_click
Graph.prototype.int_sprite_insert = function(active, 
                                             spr_inactive, spr_active, 
                                             x, y,
                                             callback_click, callback_click_data,
                                             callback_activate, 
                                             callback_inactivate)
{
  var spr = this.sprite_insert(spr_inactive, x, y);
  spr.sprite_inactive = this.sprites[spr_inactive];
  spr.sprite_active = this.sprites[spr_active];
  
  if(active) {
    spr.buttonMode = true;
    spr.interactive = true;
    
    spr.callback_click = callback_click;
    spr.callback_click_data = callback_click_data;
    spr.callback_activate = callback_activate;
    spr.callback_inactivate = callback_inactivate;
    
    // set the mousedown and touchstart callback..
    if(callback_activate != "undefined" && callback_inactivate != "undefined") {
      spr.mousedown = spr.touchstart = function(data){
        this.isdown = true;
        this.callback_activate(this);
      }
      
      // set the mouseup and touchend callback..
      spr.mouseup = spr.touchend = spr.mouseupoutside = spr.touchendoutside = function(data){
        this.isdown = false;
        if(this.isOver)
        {
          this.callback_activate(this);
        }
        else
        {
          this.callback_inactivate(this);
        }
      }
    
      // set the mouseover callback..
      spr.mouseover = function(data){
        this.isOver = true;
        if(this.isdown)
          return
        this.callback_activate(this);
      }
      
      // set the mouseout callback..
      spr.mouseout = function(data){
        this.isOver = false;
        if(this.isdown)
          return
        this.callback_inactivate(this);
      }      
    }
    else {    
      spr.mousedown = spr.touchstart = function(data){
        this.isdown = true;
        this.setTexture(this.sprite_active);
      }
    
      // set the mouseup and touchend callback..
      spr.mouseup = spr.touchend = spr.mouseupoutside = spr.touchendoutside = function(data){
        this.isdown = false;
        if(this.isOver)
        {
          this.setTexture(this.sprite_active);
        }
        else
        {
          this.setTexture(this.sprite_inactive);
        }
      }
    
      // set the mouseover callback..
      spr.mouseover = function(data){
        this.isOver = true;
        if(this.isdown)
          return
        this.setTexture(this.sprite_active)
      }
      
      // set the mouseout callback..
      spr.mouseout = function(data){
        this.isOver = false;
        if(this.isdown)
          return
        this.setTexture(this.sprite_inactive)
      }      
    }
    
    spr.click = spr.tap = function(data) {
      this.callback_click(spr.callback_click_data);
    }
  }
  
  return(spr);
}

spr_callback_set_active = function(spr)
{
  spr.setTexture(spr.sprite_active);
}

spr_callback_set_inactive = function(spr)
{
  spr.setTexture(spr.sprite_inactive);
}

// Insert interactive sprite
Graph.prototype.int_sprite_draw = function(spr_inactive, spr_active,
                                           x, y,
                                           callback_click, callback_click_data)
{
  var spr = this.int_sprite_insert(true,
                                   spr_inactive, spr_active,
                                   x, y,
                                   callback_click, callback_click_data,
                                   spr_callback_set_active,
                                   spr_callback_set_inactive);
  return(spr);
}

Graph.prototype.int_sprite_active_set = function(active)
{
  this.setTexture(active ? this.sprite_active : this.sprite_inactive);
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

Graph.prototype.game_sprites_load = function()
{
  this.sprite_load("data/Graphics/global1.spr", FIRST_GLOBAL_LEVEL);
  this.sprite_load("data/Graphics/klasik1.spr", FIRST_CLASSIC_LEVEL);
  this.sprite_load("data/Graphics/kyber1.spr",  FIRST_CYBER_LEVEL);
  this.sprite_load("data/Graphics/herni1.spr",  FIRST_OTHER);
  this.sprite_load("data/Graphics/game_cur.spr",FIRST_CURSOR);
  this.sprite_load("data/Graphics/hraci1.spr",  FIRST_PLAYER);
}

Graph.prototype.menu_sprites_load = function()
{
  this.sprite_load("data/Graphics/menu1.spr", MENU_SPRIT_ROCK);
  this.sprite_load("data/Graphics/menu2.spr", MENU_SPRIT_LOGO);
  this.sprite_load("data/Graphics/menu3.spr", MENU_SPRIT_BACK);
  this.sprite_load("data/Graphics/menu4.spr", MENU_SPRIT_ARROWS);
  this.sprite_load("data/Graphics/menu5.spr", MENU_SPRIT_LOGO_SMALL_1);
  this.sprite_load("data/Graphics/menu6.spr", MENU_SPRIT_WALL);
  this.sprite_load("data/Graphics/controls.spr", MENU_CHECKBOX_CHECKED);
  this.sprite_load("data/Graphics/slidebar.spr", MENU_SLIDEBAR);
  this.sprite_load("data/Graphics/slider.spr", MENU_SLIDER);
}

Graph.prototype.background_load = function(background)
{
  background = background+1;
  this.sprite_load("data/Graphics/background" + background + ".spr", FIRST_BACKGROUND);
}

Graph.prototype.init = function()
{
  this.stage = new PIXI.Stage(0x0);
  this.renderer = PIXI.autoDetectRenderer(GAME_RESOLUTION_X, GAME_RESOLUTION_Y);
  this.menu_sprites_load();
  this.game_sprites_load();

  for(var i = 0; i < FONT_NUM; i++) {
    this.font_load(i, FIRST_FONT + i*FONT_STEP, FONT_SPRITES);
  }
  this.font_set(0);
}

Graph.prototype.font_load = function(font_num, sprite_first, sprite_num)
{
  this.sprite_load("data/Graphics/font" + font_num + ".spr",  sprite_first);

  var font = this.font_table[font_num] = new FontTable();
  font.sprite_first = sprite_first;
  font.sprite_num = sprite_num;
  font.load("data/Graphics/font" + font_num + ".tab");
}

Graph.prototype.font_start_set = function(x, y)
{
  this.font_ax = x;
  this.font_ay = y;
}

Graph.prototype.font_set = function(font)
{
  this.font = this.font_table[font];
}

Graph.prototype.font_alignment_set = function(align)
{
  this.font_align = align;
}

Graph.prototype.text_size_get = function(text)
{
  var r = new Rect();

  var height_base = r.height = this.sprites[this.font.sprite_char_get(text[0])].height;
  for(var i = 0; i < text.length; i++) {
    if(text[i] == '\n') {
      r.height += height_base;
    }
    else {
      var c = this.font.sprite_char_get(text[i]);
      if(c) {
        r.width += this.sprites[c].width;
      }
    }
  }

  return(r);
}

Graph.prototype.print = function(text, x, y)
{
  if(x != undefined && y != undefined) {
    this.font_ax = x;
    this.font_ay = y;
  }

  var font_ax = this.font_ax;
  var font_ay = this.font_ay;

  if(this.font_align == ALIGN_RIGHT) {
    font_ax -= this.text_size_get(text).width;
  } else if(this.font_align == ALIGN_CENTER) {
    font_ax = (GAME_RESOLUTION_X - this.text_size_get(text).width) / 2;
  }

  var sprite_first;
  var local_x = 0;
  var local_y = 0;

  for(var i = 0; i < text.length; i++) {
    var c = text[i];    
    if(c == '\n') {
      local_y += sprite_first.height;
      this.font_ay += sprite_first.height;
    }
    else {
      var spr_index = this.font.sprite_char_get(c);
      if(spr_index) {
        var spr = this.sprite_insert(spr_index);
        if(!i) {
          this.sprite_move(spr, font_ax, font_ay);
          sprite_first = spr;
          local_x -= spr.anchor.x*spr.width;
          local_y -= spr.anchor.y*spr.height;
        }
        else {
          this.sprite_move(spr, local_x, local_y);
          sprite_first.addChild(spr);
        }
        local_x += spr.width;
      }
    }
  }

  return(sprite_first);
}

font_callback_set_active = function(sprite_first)
{
  sprite_first.setTexture(sprite_first.sprite_active);
  for (var i = sprite_first.children.length - 1; i >= 0; i--) {
    var spr = sprite_first.children[i];
    spr.setTexture(spr.sprite_active);
  }
}

font_callback_set_inactive = function(sprite_first)
{
  sprite_first.setTexture(sprite_first.sprite_inactive);
  for (var i = sprite_first.children.length - 1; i >= 0; i--) {
    var spr = sprite_first.children[i];
    spr.setTexture(spr.sprite_inactive);
  }
}

/* Draws interactive text
   on mouse over - changes to active font and redraw
   on mouse click - call callback_click
*/
Graph.prototype.int_print = function(text, callback_click, callback_click_data, x, y)
{
  if(x != undefined && y != undefined) {
    this.font_ax = x;
    this.font_ay = y;
  }

  var font_ax = this.font_ax;
  var font_ay = this.font_ay;

  // reaction frame
  var text_width = this.text_size_get(text).width;
  var text_height = this.text_size_get(text).height;

  if(this.font_align == ALIGN_RIGHT) {
    font_ax -= text_width;
  } else if(this.font_align == ALIGN_CENTER) {
    font_ax = (GAME_RESOLUTION_X - text_width) / 2;
  }

  var sprite_first;
  var local_x = 0;
  var local_y = 0;

  for(var i = 0; i < text.length; i++) {
    var c = text[i];    
    if(c == '\n') {
      local_y += sprite_first.height;
      this.font_ay += sprite_first.height;
    }
    else {
      var spr_inactive = this.font_table[FONT_DEFAULT].sprite_char_get(c);
      var spr_active = this.font_table[FONT_SELECTED].sprite_char_get(c);
      
      if(spr_inactive && spr_active) {
        var spr = this.int_sprite_insert(!i /* only first sprite is active*/,
                                         spr_inactive, spr_active, 
                                         0, 0,
                                         callback_click, callback_click_data,
                                         font_callback_set_active,
                                         font_callback_set_inactive);
        if(!i) {
          this.sprite_move(spr, font_ax, font_ay);
          this.hitArea = new PIXI.Rectangle(font_ax, font_ay, text_width, text_height);
          sprite_first = spr;
          local_x -= spr.anchor.x*spr.width;
          local_y -= spr.anchor.y*spr.height;
        }
        else {
          this.sprite_move(spr, local_x, local_y);
          sprite_first.addChild(spr);
        }
    
        local_x += spr.width;
      }
    }
  }

  return(sprite_first);
}

function FontTable(graph) {
  this.graph = graph;

  this.position = Array();
  for(var i = 0; i < 255; i++)
    this.position[i] = -1;
  
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

FontTable.prototype.sprite_char_get = function(c)
{
  var pos = this.position[c];
  return((pos != -1) ? this.sprite_first + pos : 0);
}
