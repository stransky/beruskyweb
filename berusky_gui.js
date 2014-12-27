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

var MENU_ENTER      = 1
var MENU_RETURN     = 2
var MENU_TIMER      = 3
var MENU_KEY_INPUT  = 4
var MENU_LEAVE      = 5

var MENU_LEFT       = 1
var MENU_CENTER     = 2
var MENU_RIGHT      = 3

var MENU_NO_SPRITE         = 0x1
var MENU_DONT_DRAW_SPRITE  = 0x2
var MENU_SAVE_BACK         = 0x4
// only draw menu items, don't register any events
var MENU_DRAW_ONLY         = 0x8

var MENU_TEXT_DIFF_X       = 10
var MENU_TEXT_DIFF_Y       = 5

function MenuFunction(obj, func, param1, param2) {
  this.obj = obj;
  this.func = func;
  this.param1 = param1;
  this.param2 = param2;
}

MenuFunction.prototype.run = function(st)
{
  if(this.func) {
    this.func.call(this.obj, st, this.param1, this.param2);
  }
}

MenuFunction.prototype.run_and_clear = function(st)
{
  if(this.func) {
    this.func.call(this.obj, st, this.param1, this.param2);
    this.func = 0;
  }
}

MenuFunction.prototype.copy = function()
{
  return new MenuFunction(this.obj, this.func, this.param1, this.param2);
}

function MenuEvent(type, params) {
  this.type = type;

  if(params != "undefined") {
    this.params = params;
  }
  else {
    this.params = Array();  
  }
}

var LEVEL_SET_NUM             = 5
var PROFILE_NAME              = "name"
var PROFILE_LAST_TRAINING     = "l0"
var PROFILE_LAST_EASY         = "l1"
var PROFILE_LAST_INTERMEDIATE = "l2"
var PROFILE_LAST_ADVANCED     = "l3"
var PROFILE_LAST_IMPOSSIBLE   = "l4"

function PlayerProfile() {
  this.filename = "";
  this.level_selected = Array();  //[LEVEL_SET_NUM] - selected level
  this.level_last = Array();      //[LEVEL_SET_NUM] - last finished level
  this.level_set_selected = 0;
  this.profile_name = "";
}

// fill level_set_selected and level_selected
PlayerProfile.profile.level_set_select = function(level_set_num)
{
  this.level_set_selected = level_set_num;
  this.selected_level_set(this.level_selected[level_set_num]);
}

PlayerProfile.profile.level_set_get = function()
{
  return(this.level_set_selected);
}

PlayerProfile.profile.selected_level_set = function(level) 
{
  if(level > this.level_last[level_set_selected])
    level = this.level_last[level_set_selected];
  
  this.level_selected[level_set_selected] = level;
{

PlayerProfile.profile.selected_level_get = function()
{
  return(this.level_selected[level_set_selected]);
}

PlayerProfile.profile.last_level_set = function(level) 
{
  this.level_last[level_set_selected] = level;
}

PlayerProfile.profile.last_level_get = function() 
{
  return(this.level_last[level_set_selected]);
}

  // The selected level has been successfuly finished
PlayerProfile.profile.selected_level_finished = function()
{
  var selected_level = this.selected_level_get();

  if(selected_level == this.last_level_get()) {
    selected_level += 1;
    this.last_level_set(selected_level);
    this.selected_level_set(selected_level);
  
    // save the profile
    this.save();
  }
}

PlayerProfile.profile.create = function(name)
{

}

PlayerProfile.profile.load = function(dir, file)
{

}

PlayerProfile.profile.save = function()
{

}

/* Stores levelset
*/
LevelSet_load_callback = function()
{
  var level_set = this.callback_object;
  var chars = this.responseText.split("\n");

  for (var i = 0, var lv = 0; i < chars.length; i += 2, lv++) {
    level_set.levelname[lv] = chars[i];
    level_set.password[lv] = chars[i+1];
  }
  this.loaded = true;
}

function LevelSet(set) {
  // Array of level names and passwords
  this.levelname = Array();
  this.password = Array();
  this.loaded = false;

  var file = "data/GameData/s" + set + ".dat";
  load_file_text(file, FontTable_load_callback, this);
}

LevelSet.prototype.levelnum_get = function() 
{
  return this.loaded ? this.levelname.lenght : 0;
}

function LevelStore() {
  this.level_set = Array();
  for(var i = 0; i < LEVEL_SET_NUM; i++)
    this.level_set[i] = new LevelSet(i);
}

LevelStore.profile.loaded = function() {
  for(var i = 0; i < LEVEL_SET_NUM; i++)
    if(!this.level_set[i].loaded())
      return false;

  return true;
}

LevelStore.profile.levelset_get = function(set) {
  return this.level_set[set];
}

LevelStore.profile.levelset_get_passwd = function(set, level) {
  return this.level_set[set].password[level];
}

function GameGuiCallbackData(gui, event, event_back) {
  this.GameGui = gui;
  this.event = event;
  this.event_back = event_back;
}

function GameGui() {
  this.game = new Game();
  this.graph = this.game.graph;
  this.loaded = false;
  this.events = new BeruskyEvents();
  this.profile = new PlayerProfile();
  this.store = new LevelStore();

  // Used for menu rendering
  this.menu_spr_active = false;
  this.menu_spr_inactive = false;
  this.menu_text_diff_x = false;
  this.menu_text_diff_y = false;
  this.menu_spr_diff_dx = false;
  this.menu_spr_diff_dy = false;
  this.menu_last_x = false;
  this.menu_last_y = false;

  this.menu_back_stack = Array();
  this.menu_current = new MenuFunction();  
}

GameGui.prototype.GameGuiLoop = function() {

  if(!this.loaded && this.graph.is_loaded()) {
    this.loaded = true;
    this.events.listener_add(this);
    this.events.send(new MenuEvent(GC_MENU_START));
  }
  
  //this.game.game_loop();
  this.graph.render();
}

// -------------------------------------------------------
// Game UI - clean up management
// -------------------------------------------------------
GameGui.prototype.menu_enter = function(obj, func, param_1, param_2)
{
  // If there is a menu function, call it
  this.menu_leave();

  // Set the new menu function
  this.menu_current = new MenuFunction(obj, func, param_1, param_2);
}

GameGui.prototype.menu_leave = function()
{
  this.menu_current.run_and_clear(MENU_LEAVE);
}

// -------------------------------------------------------
// Game UI - "back" management
// -------------------------------------------------------
GameGui.prototype.back_push = function()
{  
  this.menu_back_stack.push(this.menu_current.copy());
}

GameGui.prototype.back_pop = function()
{
  if(this.menu_back_stack.length) {
    var menu_func = this.menu_back_stack.pop();
    menu_func.run(MENU_RETURN);
  }
}

// -------------------------------------------------------
// Game UI - items rendering
// -------------------------------------------------------

GameGui.prototype.menu_item_set_pos = function(x, y)
{
  this.menu_last_x = x;
  this.menu_last_y = y;
}

GameGui.prototype.menu_item_set_diff = function(dx, dy)
{
  this.menu_last_dx = dx;
  this.menu_last_dy = dy;
}

GameGui.prototype.menu_item_set_add = function(dx, dy)
{
  this.menu_last_x += dx;
  this.menu_last_y += dy;
}

GameGui.prototype.menu_item_callback = function(data)
{
  if(data.event_back) {
    data.GameGui.events.send(data.event_back);
  }
  data.GameGui.events.send(data.event);
}

// MENU_TEXT_DIFF_X, MENU_TEXT_DIFF_Y
GameGui.prototype.menu_item_draw_sprite_set = function(sprite_active, sprite_inactive, 
                                                       menu_text_diff_x, menu_text_diff_y)
{
  this.menu_spr_active = sprite_active;
  this.menu_spr_inactive = sprite_inactive;
  this.menu_text_diff_x = menu_text_diff_x;
  this.menu_text_diff_y = menu_text_diff_y;
  this.menu_spr_diff_dx = this.graph.sprites[sprite_active].width;
  this.menu_spr_diff_dy = this.graph.sprites[sprite_active].height;
}

GameGui.prototype.menu_item_draw_sprite = function(text, align, flags, event)
{
  var event_back = (flags&MENU_SAVE_BACK) ? new MenuEvent(GI_MENU_BACK_PUSH) : 0;

  switch(align)
  {
    case MENU_LEFT:
      {
        if(!(flags&MENU_DONT_DRAW_SPRITE)) {
          this.graph.int_sprite_draw(this.menu_spr_inactive, this.menu_spr_active,
                                     this.menu_last_x, this.menu_last_y,
                                     this.menu_item_callback, new GameGuiCallbackData(this, event, event_back));
        }
        if(text != "") {
          this.graph.font_alignment_set(align);
          this.graph.int_print(text,
                               this.menu_item_callback, new GameGuiCallbackData(this, event, event_back),
                               this.menu_last_x + this.menu_spr_diff_dx + this.menu_text_diff_x,
                               this.menu_last_y + this.menu_text_diff_y);
        }
        
        this.menu_last_x += this.menu_last_dx;
        this.menu_last_y += this.menu_last_dy;
      }
      break;
      
    case MENU_RIGHT:
      {
        if(!(flags&MENU_DONT_DRAW_SPRITE)) {
          this.graph.int_sprite_draw(this.menu_spr_inactive, this.menu_spr_active,
                                     this.menu_last_x, this.menu_last_y,
                                     this.menu_item_callback, new GameGuiCallbackData(this, event, event_back));
        }
        if(text != "") {
          this.graph.font_alignment_set(align);
          this.graph.int_print(text,
                               this.menu_item_callback, new GameGuiCallbackData(this, event, event_back),
                               this.menu_last_x - this.menu_text_diff_x,
                               this.menu_last_y + this.menu_text_diff_y);
        }
        this.menu_last_x += this.menu_last_dx;
        this.menu_last_y += this.menu_last_dy;
      }
      break;
    case MENU_CENTER:
      {
        // not implemented
        throw "Not implemented!";
      }
      break;
    default:
      break;
  }
}

GameGui.prototype.menu_item_draw_text = function(text, align, flags, event)
{
  var event_back = (flags&MENU_SAVE_BACK) ? new MenuEvent(GI_MENU_BACK_PUSH) : 0;
  this.graph.font_alignment_set(align);
  this.graph.int_print(text,
                       this.menu_item_callback, new GameGuiCallbackData(this, event, event_back),
                       this.menu_last_x, this.menu_last_y);
  
  this.menu_last_x += this.menu_last_dx;
  this.menu_last_y += this.menu_last_dy;
}

GameGui.prototype.menu_item_draw = function(text, align, flags, event)
{

  if(flags&MENU_NO_SPRITE) {
    this.menu_item_draw_text(text, align, flags, event);
  }
  else {
    switch(align)
    {
      case MENU_LEFT:
        {      
          this.menu_item_draw_sprite_set(MENU_SPRIT_ARROW_LC, MENU_SPRIT_ARROW_L, 
                                         MENU_TEXT_DIFF_X, MENU_TEXT_DIFF_Y);
        }
        break;
      case MENU_RIGHT:
        {
          this.menu_item_draw_sprite_set(MENU_SPRIT_ARROW_RC, MENU_SPRIT_ARROW_R,
                                         MENU_TEXT_DIFF_X, MENU_TEXT_DIFF_Y);
        }          
        break;
      
      case MENU_CENTER:
        {
          this.menu_item_draw_sprite_set(MENU_SPRIT_ARROW_RC, MENU_SPRIT_ARROW_L,
                                         MENU_TEXT_DIFF_X, MENU_TEXT_DIFF_Y);
        }      
        break;
      default:
        break;
    }
    
    this.menu_item_draw_sprite(text, align, flags, event);
  }
}

/* Print selected level name
*/
GameGui.prototype.menu_level_name_print = function()
{
  var level = this.profile.selected_level_get();
  var level_set = this.profile.level_set_get();

  this.graph.font_set(FONT_DEFAULT);
  this.graph.font_alignment_set(MENU_LEFT);

  var menu_x_start = 0;
  var menu_y_start = 0;

  if(DOUBLE_SIZE) {
    this.graph.font_alignment_set(MENU_CENTER);
    menu_x_start = 20;
    menu_y_start = (GAME_RESOLUTION_Y - 220);
  }
  else {
    switch(level_set) {
      case 0:
        menu_x_start = (GAME_RESOLUTION_X/2 - 70);
        menu_y_start = (GAME_RESOLUTION_Y - 170);
        break;
      case 1:
        menu_x_start = (GAME_RESOLUTION_X/2 - 130);
        menu_y_start = (GAME_RESOLUTION_Y - 155);
        break;
      case 2:
        menu_x_start = 10;
        menu_y_start = (GAME_RESOLUTION_Y - 25);
        break;
      case 3:
        menu_x_start = (GAME_RESOLUTION_X/2 - 17 - 180);
        menu_y_start = (GAME_RESOLUTION_Y - 160);
        break;
      case 4:
        p_font->alignment_set(MENU_CENTER);
        menu_x_start = 20;
        menu_y_start = (GAME_RESOLUTION_Y - 160);
        break;
      case 5:
        menu_x_start = 70;
        menu_y_start = (GAME_RESOLUTION_Y - 35);
        break;
    }
  }
  
  TODO -> save the string
  this.graph.font_start_set(menu_x_start, menu_y_start);
  this.graph.print("Level: " + level+1 + " - " + this.store.levelset_get_passwd(level_set, level));
}

GameGui.prototype.level_set_select = function(level_set)
{
  bool ret = p_ber->levelset_load(level_set);
  if(!ret) {
    berror("Unable to load levelset %d\n",level_set);
    return;
  }
  profile.level_set_set(level_set);
}

GameGui.prototype.level_select(level, tpos spr_x, tpos spr_y)
{  
  // Selec the level
  p_ber->levelset_set_level(level);
  profile.selected_level_set(level);

  // Draw the selected level
  p_grf->draw(LEVEL_DONE, profile.level_spr_x, profile.level_spr_y);
  p_grf->redraw_add(profile.level_spr_x, profile.level_spr_y, 
                    p_grf->sprite_get_width(LEVEL_DONE),
                    p_grf->sprite_get_height(LEVEL_DONE));
  p_grf->draw(LEVEL_NEXT, spr_x, spr_y);
  p_grf->redraw_add(spr_x, spr_y,
                    p_grf->sprite_get_width(LEVEL_NEXT),
                    p_grf->sprite_get_height(LEVEL_NEXT));
  profile.level_spr_x = spr_x;
  profile.level_spr_y = spr_y;
  p_grf->flip();
}

GameGui.prototype.menu_main = function(state, data, data1)
{  
  switch(state) {
    case MENU_RETURN:
    case MENU_ENTER:
      { 
        this.menu_enter(this, GameGui.prototype.menu_main, data, data1);

        this.graph.clear();
        
        var spr = this.graph.sprite_insert(MENU_SPRIT_LOGO);
        var width = spr.width;
        var height = spr.height;
/*        
        if(DOUBLE_SIZE) {
          p_grf->draw(menu_background_get(),0,0);
        }      
*/      
        this.graph.sprite_move(spr, (GAME_RESOLUTION_X-width)/2, 0);
        
        var new_game = "play";
        var profiles = "change profile";
        var settings = "settings";
        var help = "help";        
        
        var MENU_X_DIFF  = 0;
        var MENU_Y_DIFF  = (DOUBLE_SIZE ? 45 : 35);
        this.menu_item_set_pos(GAME_RESOLUTION_X/2 - 70,
                               GAME_RESOLUTION_Y/2 - 0);
        this.menu_item_set_diff(MENU_X_DIFF, MENU_Y_DIFF);
                
        this.menu_item_draw(new_game, MENU_LEFT, MENU_SAVE_BACK, new MenuEvent(GC_MENU_NEW_GAME));
        this.menu_item_draw(profiles, MENU_LEFT, MENU_SAVE_BACK, new MenuEvent(GC_MENU_PROFILES));
        this.menu_item_draw(settings, MENU_LEFT, MENU_SAVE_BACK, new MenuEvent(GC_MENU_SETTINGS));
        this.menu_item_draw(help, MENU_LEFT, MENU_SAVE_BACK, new MenuEvent(GC_MENU_HELP, [ false ]));
             
        this.graph.font_alignment_set(MENU_CENTER);
        this.graph.font_start_set(0, GAME_RESOLUTION_Y - 60);
        this.graph.print("berusky version " + VERSION + " (C) Anakreon 1997-2014\n");
        this.graph.print("distributed under GPLv2\n");

        var PROFILE_Y_DIFF  = (20);
        this.graph.font_alignment_set(MENU_CENTER);
        this.graph.font_start_set(0, height+PROFILE_Y_DIFF);
        //this.graph.print("Selected profile: " + profile.profile_name);
        this.graph.print("Selected profile: ");
      }
      break;
    case MENU_LEAVE:      
      break;
    default:
      break;
  }
}

GameGui.prototype.menu_new_game = function(state, data, data1)
{
  switch(state) {
    case MENU_RETURN:
    case MENU_ENTER:
      {
        this.menu_enter(this, GameGui.prototype.menu_new_game, data, data1);
        this.graph.clear();
        
        var spr = this.graph.sprite_insert(MENU_SPRIT_LOGO);
        var width = spr.width;
        var height = spr.height;

        this.graph.sprite_move(spr, (GAME_RESOLUTION_X-width)/2, 0);

        var MENU_X_START = (GAME_RESOLUTION_X/2 - 70);
        var MENU_Y_START = (GAME_RESOLUTION_Y/2);

        this.graph.font_set(FONT_DEFAULT);
        this.graph.font_alignment_set(MENU_CENTER);
        this.graph.font_start_set(0, MENU_Y_START - 50);
        this.graph.print("select difficulty of the new game:");

        var training      = "training";
        var easy          = "easy";
        var intermediate  = "intermediate";
        var advanced      = "advanced";
        var impossible    = "impossible";
        var back          = "back";

        var MENU_X_DIFF = 0;
        var MENU_Y_DIFF = 35;

        this.menu_item_set_pos(MENU_X_START, MENU_Y_START);
        this.menu_item_set_diff(MENU_X_DIFF, MENU_Y_DIFF);

        this.menu_item_draw(training, MENU_LEFT, MENU_SAVE_BACK, new MenuEvent(GC_MENU_RUN_LEVEL, [ 0 ]));
        this.menu_item_draw(easy, MENU_LEFT, MENU_SAVE_BACK, new MenuEvent(GC_MENU_RUN_LEVEL, [ 1 ]));
        this.menu_item_draw(intermediate, MENU_LEFT, MENU_SAVE_BACK, new MenuEvent(GC_MENU_RUN_LEVEL, [ 2 ]));
        this.menu_item_draw(advanced, MENU_LEFT, MENU_SAVE_BACK, new MenuEvent(GC_MENU_RUN_LEVEL, [ 3 ]));
        this.menu_item_draw(impossible, MENU_LEFT, MENU_SAVE_BACK, new MenuEvent(GC_MENU_RUN_LEVEL, [ 4 ]));
        this.menu_item_draw(back, MENU_LEFT, 0, new MenuEvent(GI_MENU_BACK_POP));
      }
      break;    
    case MENU_LEAVE:    
      break;
    default:
      break;
  }
}

var LEVEL  = 'V' // Draw level - V+two digits of level number, so the first one will be "V01"
var PIPE   = 'P' // Draw pipe

var MLEFT  = 'L' // cursor movement
var MRIGHT = 'R' 
var MUP    = 'U'
var MDOWN  = 'D'

var LEFT_I  = 0
var RIGHT_I = 1
var UP_I    = 2
var DOWN_I  = 3
var WRONG_PIPE = (-1);

var FIRST_PIPE            = (FIRST_CLASSIC_LEVEL+13)

var LEVEL_DONE            = (FIRST_CLASSIC_LEVEL+43)
var LEVEL_NEXT            = (FIRST_CLASSIC_LEVEL+45)
var LEVEL_CLOSED          = (FIRST_CLASSIC_LEVEL+42)

var ITEM_SIZE             = (20)
var TEXT_SHIFT_VERTICAL   = (0)
var TEXT_SHIFT_HORIZONTAL = (20)


/*
  LEVEL_PATH "LPUPLPD"
*/
/*
  Pipe list:

  0  -
  1  \
  2  |
  3  _|
  4  /
  5  L
*/

function LevelPath() {
  this.pipe_table = [[-1,-1,-1,-1],[-1,-1,-1,-1],[-1,-1,-1,-1],[-1,-1,-1,-1]];
  
  this.pipe_table[LEFT_I][UP_I] = 5;
  this.pipe_table[LEFT_I][DOWN_I] = 4;
  this.pipe_table[LEFT_I][LEFT_I] = 0;

  this.pipe_table[RIGHT_I][UP_I] = 3;
  this.pipe_table[RIGHT_I][DOWN_I] = 1;
  this.pipe_table[RIGHT_I][RIGHT_I] = 0;

  this.pipe_table[UP_I][UP_I] = 2;
  this.pipe_table[UP_I][LEFT_I] = 1;
  this.pipe_table[UP_I][RIGHT_I] = 4;

  this.pipe_table[DOWN_I][DOWN_I] = 2;
  this.pipe_table[DOWN_I][LEFT_I] = 3;
  this.pipe_table[DOWN_I][RIGHT_I] = 5;
}

LevelPath.prototype.translate_direction = function(last, next)
{
  pipe = this.pipe_table[last][next];  
  return(pipe);
}

GameGui.prototype.menu_level_draw_level = function(lev, level_act,
                                                   level_last, level_set, x, y)
{
  var spr_x = x*ITEM_SIZE;
  var spr_y = y*ITEM_SIZE;
  var spr;

  if(lev > level_last) {
    // Draw as inactive sprite
    spr = LEVEL_CLOSED;
    this.graph.sprite_insert(spr, spr_x, spr_y);
  }
  else {  
  
    if(lev == level_act) {
      spr = LEVEL_NEXT;
    }
    else {
      spr = LEVEL_DONE;
    }
      
    this.menu_item_draw_sprite_set(spr, LEVEL_DONE,
                                   TEXT_SHIFT_HORIZONTAL-ITEM_SIZE,
                                   TEXT_SHIFT_VERTICAL);
    this.menu_item_set_pos(spr_x, spr_y);
    this.menu_item_draw_sprite("", MENU_LEFT, 0,
                               new MenuEvent(GC_RUN_LEVEL_SELECT, [lev]));
  }
}

GameGui.prototype.menu_level_draw_pipe = function(pip, x, y)
{
  if(x >= 0 &&
     y >= 0 &&
     (x+1)*ITEM_SIZE <= GAME_RESOLUTION_X &&
     (y+1)*ITEM_SIZE <= GAME_RESOLUTION_Y)
  {
    this.graph.sprite_insert(FIRST_PIPE+pip, (x)*ITEM_SIZE, (y)*ITEM_SIZE);
  }
}

GameGui.prototype.translate_coords = function(direction, coord)
{
  switch(direction) {
    case MLEFT:
      coord.x--;
      coord.index = LEFT_I;
      break;
    case MRIGHT:
      coord.x++;
      coord.index = RIGHT_I;
      break;
    case MUP:
      coord.y--;
      coord.index = UP_I;
      break;
    case MDOWN:
      coord.y++;
      coord.index = DOWN_I;
      break;
  }
}

/*
  The level path is encoded from those paths + two digits of level number
*/
GameGui.prototype.menu_level_run_path_draw_line = function(path, level_act,
                                                           level_last,
                                                           level_set, sx, sy)
{
  var index_last = LEFT_I;
  var lx = sx,
      ly = sy;
  var levels = 0;
  var i = 0;

  while(path[i]) {
    switch(path[i]) {
      case LEVEL:
        {
          var tmp = [];
          tmp[0] = path[i+1];
          tmp[1] = path[i+2];
          this.menu_level_draw_level(parseInt(tmp,10),level_act,level_last,level_set,sx,sy);
          i += 3;
          levels++;
        }
        break;
      case PIPE:
        {
          index_next = LEFT_I;
          
          var coord = {x:0, y:0, index:index_next};
          this.translate_coords(p_path[i+1], coord);
          index_next = coord.index;
          
          pipe_num = translate_direction(index_last, index_next);
        
          this.menu_level_draw_pipe(pipe_num, sx, sy);
          i++;
        }
        break;
      
      // It's a coordinate - translate it
      default:
        lx = sx;
        ly = sy;
        
        var coord = {x:sx, y:sy, index:index_last};
        this.translate_coords(p_path[i], coord);
        sx = coord.x; sy = coord.y; index_last = coord.index;
        
        i++;
        break;
    }
  }

  return(levels);
}

// Draw level path
GameGui.prototype.menu_level_run_path_draw = function(level_set, level_act, level_last)
{
  this.graph.clear();
  
  this.graph.font_alignment_set(MENU_LEFT);
  this.graph.font_set(FONT_DEFAULT);
   
  var IMAGE_START = (50);
  var TEXT_START  = (250);
  
  this.graph.sprite_insert(MENU_SPRIT_WALL,0,0);

  var play_string = "play level";
  var level_hint  = "level hint";
  var select_string = "select last";
  var back_string = "back";

  switch(level_set) {
    case 0:
      {
        // Draw top of the pipe
        this.menu_level_draw_pipe(2,14,0);
        this.menu_level_draw_pipe(2,14,1);
        this.menu_level_draw_level(0,level_act, level_last,level_set,14,2);
      
        this.menu_level_draw_pipe(3,14,3);
        this.menu_level_draw_pipe(4,13,3);
        this.menu_level_draw_level(1,level_act,level_last,level_set,13,4);
      
        this.menu_level_draw_pipe(3,13,5);
        this.menu_level_draw_pipe(0,12,5);
        this.menu_level_draw_pipe(4,11,5);
        this.menu_level_draw_level(2,level_act,level_last,level_set,11,6);
      
        this.menu_level_draw_pipe(2,11,7);
        this.menu_level_draw_level(3,level_act,level_last,level_set,11,8);
      
        this.menu_level_draw_pipe(2,11,9);
        this.menu_level_draw_level(4,level_act,level_last,level_set,11,10);
      
        this.menu_level_draw_pipe(3,11,11);
        this.menu_level_draw_pipe(0,10,11);
        this.menu_level_draw_pipe(4,9,11);
        this.menu_level_draw_level(5,level_act,level_last,level_set,9,12);

        this.menu_level_draw_pipe(3,9,13);
        this.menu_level_draw_pipe(0,8,13);
        this.menu_level_draw_pipe(0,7,13);
        this.menu_level_draw_pipe(0,6,13);
        this.menu_level_draw_pipe(4,5,13);
        this.menu_level_draw_level(6,level_act,level_last,level_set,5,14);
        this.menu_level_draw_pipe(0,4,14);
        this.menu_level_draw_pipe(0,3,14);
        this.menu_level_draw_pipe(0,2,14);
        this.menu_level_draw_pipe(0,1,14);
        this.menu_level_draw_pipe(0,0,14);

        this.menu_level_draw_pipe(2,5,15);
        this.menu_level_draw_pipe(2,5,16);
        this.menu_level_draw_level(7,level_act,level_last,level_set,5,17);
        
        this.menu_level_draw_pipe(2,5,18);
        this.menu_level_draw_pipe(5,5,19);
        this.menu_level_draw_pipe(0,6,19);
        this.menu_level_draw_pipe(0,7,19);
        this.menu_level_draw_level(8,level_act,level_last,level_set,8,19);

        this.menu_level_draw_pipe(0,10,6);
        this.menu_level_draw_pipe(0,9,6);
        this.menu_level_draw_pipe(0,8,6);
        this.menu_level_draw_pipe(5,7,6);
        this.menu_level_draw_pipe(2,7,5);
        this.menu_level_draw_pipe(2,7,4);
        this.menu_level_draw_level(9,level_act,level_last,level_set,7,3);
        this.menu_level_draw_pipe(2,7,2);
        this.menu_level_draw_pipe(2,7,1);
        this.menu_level_draw_pipe(2,7,0);

        if(!DOUBLE_SIZE) {
          var MENU_X_START_L = (GAME_RESOLUTION_X/2 + 60 - 17 - 60);
          var MENU_X_START_R = (GAME_RESOLUTION_X/2 + 60 + 60);
          var MENU_Y_START   = (GAME_RESOLUTION_Y - 140);
          var MENU_X_DIFF    = 0;
          var MENU_Y_DIFF    = 30;
        
          this.menu_item_set_pos(MENU_X_START_R, MENU_Y_START+0*MENU_Y_DIFF);
          this.menu_item_draw(play_string,
                              MENU_RIGHT, FALSE, 
                              new MenuEvent(GC_RUN_LEVEL_SET));

          this.menu_item_set_pos(MENU_X_START_R, MENU_Y_START+1*MENU_Y_DIFF);
          this.menu_item_draw(level_hint,
                              MENU_RIGHT, MENU_SAVE_BACK, 
                              new MenuEvent(GC_MENU_LEVEL_HINT, [FALSE]));

          this.menu_item_set_pos(MENU_X_START_R, MENU_Y_START+2*MENU_Y_DIFF);
          this.menu_item_draw(select_string,
                              MENU_RIGHT, FALSE, 
                              //new MenuEvent(GC_RUN_LEVEL_SELECT, [ level_last, profile.level_spr_x ,profile.level_spr_y ]));
                              new MenuEvent(GC_RUN_LEVEL_SELECT, [ level_last, 0, 0]));

          this.menu_item_set_pos(MENU_X_START_L, MENU_Y_START+3*MENU_Y_DIFF);
          this.menu_item_draw(back_string,
                              MENU_LEFT, FALSE, 
                              new MenuEvent(GI_MENU_BACK_POP));
        } 
      }
      break;
/*      
    // Easy
    case 1:
      { 
        int lev = 0;
      
        lev += menu_level_run_path_draw_line("V01LPUPUV02UPLPUPV03UPRPRV13UPUV04UPUV05UPRPRV06UPUPU",
                                             level_act,  level_last, level_set, 15, 12);
        lev += menu_level_run_path_draw_line("LPLPUPUV07LPUPUPV08UPUPUPUPU",
                                             level_act,  level_last, level_set, 13, 8);
        lev += menu_level_run_path_draw_line("UPUV09UPUV10UPLPUPU",
                                             level_act,  level_last, level_set, 6, 5);
        lev += menu_level_run_path_draw_line("UPRPRPRPRV00UPRV11UPUV12UPRPUV13UPUV14UPUV15UPRPUPU",
                                             level_act,  level_last, level_set, 15, 12);
        lev += menu_level_run_path_draw_line("DPRV16DPDV17",
                                             level_act,  level_last, level_set, 15, 12);
        lev += menu_level_run_path_draw_line("LPLPDPDV18DPDV19DPDPD",
                                             level_act,  level_last, level_set, 23, 17);
        lev += menu_level_run_path_draw_line("DPDV20DPRPDPRPR",
                                             level_act,  level_last, level_set, 12, -1);
        lev += menu_level_run_path_draw_line("LPLPLPLPUV21UPLPLPLPLPDV22DPDV23DPDV24LPDV25DPDV26",
                                             level_act,  level_last, level_set, 16, 15);
        lev += menu_level_run_path_draw_line("DPDV27DPLPDV28DPDV29DPDPLPDPDV30DPDPDV31LPLPLPLPLPLPU",
                                             level_act,  level_last, level_set, 27, -1);
        lev += menu_level_run_path_draw_line("DPLPDV32DPLPDPDPV33DPRPRPRPDPV34DPDV35",
                                             level_act,  level_last, level_set, 25, 12);
        lev += menu_level_run_path_draw_line("LPLPLPLPDV36LPLPL",
                                             level_act,  level_last, level_set, 6, 3);
        lev += menu_level_run_path_draw_line("DPDPV37DPDV38DPDV39DPDV40LPLPL",
                                             level_act,  level_last, level_set, 2, 4);
        lev += menu_level_run_path_draw_line("DPDV41DPRPRPRPRPDPRPR",
                                             level_act,  level_last, level_set, 2, 12);
        lev += menu_level_run_path_draw_line("LPDPDPV43DPDV44DPDV49DPDPDPD",
                                             level_act,  level_last, level_set, 2, 14);
        lev += menu_level_run_path_draw_line("LPLPDPDPLPLPLPLPLPUV45UPUV46UPUV47LPUPUV48",
                                             level_act,  level_last, level_set, 14, 10);
        //assert(lev == 50);
        
        if(!DOUBLE_SIZE) {
          #define MENU_X_START_L (GAME_RESOLUTION_X/2 - 17 - 60 - 10)
          #define MENU_X_START_R (GAME_RESOLUTION_X/2 + 60 - 10)
          #define MENU_Y_START   (GAME_RESOLUTION_Y - (DOUBLE_SIZE ? 180 : 130))
          #define MENU_X_DIFF     0
          #define MENU_Y_DIFF     30
        
          menu_item_draw(MENU_X_START_R, MENU_Y_START+0*MENU_Y_DIFF, play_string,
                         MENU_RIGHT, FALSE, 
                         LEVEL_EVENT(GC_RUN_LEVEL_SET));
          menu_item_draw(MENU_X_START_R, MENU_Y_START+1*MENU_Y_DIFF, level_hint,
                         MENU_RIGHT, MENU_SAVE_BACK, 
                         LEVEL_EVENT(GC_MENU_LEVEL_HINT, FALSE));
          menu_item_draw(MENU_X_START_R, MENU_Y_START+2*MENU_Y_DIFF, select_string,
                         MENU_RIGHT, FALSE, 
                         LEVEL_EVENT(GC_RUN_LEVEL_SELECT, level_last, profile.level_spr_x ,profile.level_spr_y));
          menu_item_draw(MENU_X_START_L, MENU_Y_START+3*MENU_Y_DIFF, back_string,
                         MENU_LEFT, FALSE, 
                         LEVEL_EVENT(GI_MENU_BACK_POP));
        
          #undef MENU_X_START_L
          #undef MENU_X_START_R
          #undef MENU_Y_START
          #undef MENU_X_DIFF
          #undef MENU_Y_DIFF
        }
      }
      break;
    // Intermediate
    case 2:
      {      
        // 35 levels
        #undef  LEVEL_LINE
        #define LEVEL_LINE "DPDV00DPDV01DPDV02DPLPDV03DPDV04DPDV05DPLPDV06DPDV07DPDV08DPLPLPLPLPUV09UP" \
                           "UV10UPUV11UPLPUV12UPLPUV13UPUV14UPUV15LPUPUPUV16UPLPLPDPLPDPLPLPDV17DPDV18" \
                           "DPDV19DPDV20DPLPDPDV21DPDV22LPDPDPDPLPDPDPLPLPLPUPUPUV23UPUV24UPUV25UPLPUV26UPUV" \
                           "27UPUV28UPUV29UPRPUPV30UPUV31UPLPLPDPDPLPLPLPDPV32DPDV33DPLPDPDV34DPLP"
        int lev = 0;
      
        lev += menu_level_run_path_draw_line(LEVEL_LINE, level_act,  level_last, level_set, 27, -1);
        assert(lev == 35);
      
        if(!DOUBLE_SIZE) {
          #define MENU_X_START_L (GAME_RESOLUTION_X/2 +20 - 17 - 60)
          #define MENU_X_START_R (GAME_RESOLUTION_X/2 +20 + 60)
          #define MENU_Y_START   (GAME_RESOLUTION_Y - (DOUBLE_SIZE ? 180 : 130))
          #define MENU_X_DIFF     0
          #define MENU_Y_DIFF     30
        
          menu_item_draw(MENU_X_START_R, MENU_Y_START+0*MENU_Y_DIFF, play_string,
                         MENU_RIGHT, FALSE, 
                         LEVEL_EVENT(GC_RUN_LEVEL_SET));
          menu_item_draw(MENU_X_START_R, MENU_Y_START+1*MENU_Y_DIFF, level_hint,
                         MENU_RIGHT, MENU_SAVE_BACK, 
                         LEVEL_EVENT(GC_MENU_LEVEL_HINT, FALSE));
          menu_item_draw(MENU_X_START_R, MENU_Y_START+2*MENU_Y_DIFF, select_string,
                         MENU_RIGHT, FALSE, 
                         LEVEL_EVENT(GC_RUN_LEVEL_SELECT, level_last, profile.level_spr_x ,profile.level_spr_y));
          menu_item_draw(MENU_X_START_L, MENU_Y_START+3*MENU_Y_DIFF, back_string,
                         MENU_LEFT, FALSE, 
                         LEVEL_EVENT(GI_MENU_BACK_POP));
        
          #undef MENU_X_START_L
          #undef MENU_X_START_R
          #undef MENU_Y_START
          #undef MENU_X_DIFF
          #undef MENU_Y_DIFF
        }      
      }
      break;
    case 3:
      {
        // Draw center of the net
        #define ADV_START_X 15
        #define ADV_START_Y 10
      
        menu_level_draw_level(0,level_act,level_last,level_set,ADV_START_X, ADV_START_Y);
      
        menu_level_draw_pipe(2, ADV_START_X, ADV_START_Y-1);
        menu_level_draw_level(1,level_act,level_last,level_set,ADV_START_X, ADV_START_Y-2);
      
        menu_level_draw_pipe(2, ADV_START_X, ADV_START_Y-3);
        menu_level_draw_pipe(2, ADV_START_X, ADV_START_Y-4);
        menu_level_draw_level(3,level_act,level_last,level_set,ADV_START_X, ADV_START_Y-5);
      
        menu_level_draw_pipe(0, ADV_START_X-1, ADV_START_Y-5);
        menu_level_draw_pipe(5, ADV_START_X-2, ADV_START_Y-5);
        menu_level_draw_pipe(2, ADV_START_X-2, ADV_START_Y-6);
        menu_level_draw_level(3,level_act,level_last,level_set,ADV_START_X-2, ADV_START_Y-7);
      
        menu_level_draw_pipe(2, ADV_START_X-2, ADV_START_Y-8);
        menu_level_draw_pipe(2, ADV_START_X-2, ADV_START_Y-9);
        menu_level_draw_pipe(2, ADV_START_X-2, ADV_START_Y-10);

        menu_level_draw_pipe(2, ADV_START_X, ADV_START_Y+1);
        menu_level_draw_pipe(2, ADV_START_X, ADV_START_Y+2);
        menu_level_draw_pipe(5, ADV_START_X, ADV_START_Y+3);
        menu_level_draw_pipe(0, ADV_START_X+1, ADV_START_Y+3);
        menu_level_draw_level(4,level_act,level_last,level_set,ADV_START_X+2, ADV_START_Y+3);

        menu_level_draw_pipe(4, ADV_START_X+2, ADV_START_Y+2);
        menu_level_draw_pipe(0, ADV_START_X+3, ADV_START_Y+2);
        menu_level_draw_pipe(0, ADV_START_X+4, ADV_START_Y+2);        
        menu_level_draw_level(5,level_act,level_last,level_set,ADV_START_X+5, ADV_START_Y+2);

        menu_level_draw_pipe(2, ADV_START_X+5, ADV_START_Y+1);
        menu_level_draw_pipe(2, ADV_START_X+5, ADV_START_Y);
        menu_level_draw_level(6,level_act,level_last,level_set,ADV_START_X+5, ADV_START_Y-1);

        menu_level_draw_pipe(4, ADV_START_X+5, ADV_START_Y-2);
        menu_level_draw_pipe(0, ADV_START_X+6, ADV_START_Y-2);
        menu_level_draw_pipe(0, ADV_START_X+7, ADV_START_Y-2);
        menu_level_draw_pipe(0, ADV_START_X+8, ADV_START_Y-2);
        menu_level_draw_level(7,level_act,level_last,level_set,ADV_START_X+9, ADV_START_Y-2);

        menu_level_draw_pipe(2, ADV_START_X+9, ADV_START_Y-3);
        menu_level_draw_pipe(2, ADV_START_X+9, ADV_START_Y-4);
        menu_level_draw_pipe(2, ADV_START_X+9, ADV_START_Y-5);
        menu_level_draw_level(8,level_act,level_last,level_set,ADV_START_X+9, ADV_START_Y-6);

        menu_level_draw_pipe(2, ADV_START_X+9, ADV_START_Y-1);
        menu_level_draw_pipe(2, ADV_START_X+9, ADV_START_Y);
        menu_level_draw_level(9,level_act,level_last,level_set,ADV_START_X+9, ADV_START_Y+1);
        
        menu_level_draw_pipe(5, ADV_START_X+2, ADV_START_Y+4);
        menu_level_draw_pipe(0, ADV_START_X+3, ADV_START_Y+4);
        menu_level_draw_level(10,level_act,level_last,level_set,ADV_START_X+4, ADV_START_Y+4);
        
        menu_level_run_path_draw_line("DPRPRPDPV11DPD",
                                      level_act,  level_last, level_set, ADV_START_X+4, ADV_START_Y+4);
        menu_level_draw_level(12,level_act,level_last,level_set,ADV_START_X+6, ADV_START_Y+8);

        menu_level_draw_pipe(0, ADV_START_X-1, ADV_START_Y);
        menu_level_draw_pipe(0, ADV_START_X-2, ADV_START_Y);
        menu_level_draw_pipe(0, ADV_START_X-3, ADV_START_Y);
        menu_level_draw_pipe(0, ADV_START_X-4, ADV_START_Y);
        menu_level_draw_pipe(5, ADV_START_X-5, ADV_START_Y);
        menu_level_draw_level(13,level_act,level_last,level_set,ADV_START_X-5, ADV_START_Y-1);
        menu_level_draw_pipe(0, ADV_START_X-1, ADV_START_Y-2);
        menu_level_draw_pipe(0, ADV_START_X-2, ADV_START_Y-2);
        menu_level_draw_pipe(0, ADV_START_X-3, ADV_START_Y-2);
        menu_level_draw_pipe(0, ADV_START_X-4, ADV_START_Y-2);
        menu_level_draw_pipe(4, ADV_START_X-5, ADV_START_Y-2);

        menu_level_draw_pipe(0, ADV_START_X-6, ADV_START_Y-1);
        menu_level_draw_pipe(0, ADV_START_X-7, ADV_START_Y-1);
        menu_level_draw_pipe(0, ADV_START_X-8, ADV_START_Y-1);
        menu_level_draw_pipe(0, ADV_START_X-9, ADV_START_Y-1);
        menu_level_draw_pipe(5, ADV_START_X-10, ADV_START_Y-1);
        menu_level_draw_level(14,level_act,level_last,level_set,ADV_START_X-10, ADV_START_Y-2);

        menu_level_draw_pipe(2, ADV_START_X-10, ADV_START_Y-3);
        menu_level_draw_pipe(2, ADV_START_X-10, ADV_START_Y-4);
        menu_level_draw_level(15,level_act,level_last,level_set,ADV_START_X-10, ADV_START_Y-5);

        menu_level_draw_pipe(2, ADV_START_X+6, ADV_START_Y+9);
        menu_level_draw_pipe(2, ADV_START_X+6, ADV_START_Y+10);
        menu_level_draw_level(16,level_act,level_last,level_set,ADV_START_X+6, ADV_START_Y+11);
        
        menu_level_draw_pipe(2, ADV_START_X-10, ADV_START_Y-6);
        menu_level_draw_pipe(2, ADV_START_X-10, ADV_START_Y-7);
        menu_level_draw_level(17,level_act,level_last,level_set,ADV_START_X-10, ADV_START_Y-8);
        
        menu_level_draw_pipe(4, ADV_START_X-11, ADV_START_Y-2);
        menu_level_draw_pipe(2, ADV_START_X-11, ADV_START_Y-1);
        menu_level_draw_pipe(2, ADV_START_X-11, ADV_START_Y);
        menu_level_draw_pipe(2, ADV_START_X-11, ADV_START_Y+1);
        menu_level_draw_level(18,level_act,level_last,level_set,ADV_START_X-11, ADV_START_Y+2);
        
        menu_level_draw_pipe(3, ADV_START_X-11, ADV_START_Y+3);
        menu_level_draw_pipe(0, ADV_START_X-12, ADV_START_Y+3);        
        menu_level_draw_pipe(4, ADV_START_X-13, ADV_START_Y+3);
        menu_level_draw_pipe(2, ADV_START_X-13, ADV_START_Y+4);
        menu_level_draw_pipe(2, ADV_START_X-13, ADV_START_Y+5);
        menu_level_draw_level(19,level_act,level_last,level_set,ADV_START_X-13, ADV_START_Y+6);
        
        menu_level_draw_pipe(0, ADV_START_X-14, ADV_START_Y+6);
        menu_level_draw_pipe(0, ADV_START_X-15, ADV_START_Y+6);

        if(!DOUBLE_SIZE) {
          #define MENU_X_START_L (GAME_RESOLUTION_X/2 - 17 - 60 - 60)
          #define MENU_X_START_R (GAME_RESOLUTION_X/2 + 60 - 60)
          #define MENU_Y_START   (GAME_RESOLUTION_Y - (DOUBLE_SIZE ? 180 : 130))
          #define MENU_X_DIFF     0
          #define MENU_Y_DIFF     30
        
          menu_item_draw(MENU_X_START_R, MENU_Y_START+0*MENU_Y_DIFF, play_string,
                         MENU_RIGHT, FALSE, 
                         LEVEL_EVENT(GC_RUN_LEVEL_SET));
          menu_item_draw(MENU_X_START_R, MENU_Y_START+1*MENU_Y_DIFF, level_hint,
                         MENU_RIGHT, MENU_SAVE_BACK, 
                         LEVEL_EVENT(GC_MENU_LEVEL_HINT, FALSE));
          menu_item_draw(MENU_X_START_R, MENU_Y_START+2*MENU_Y_DIFF, select_string,
                         MENU_RIGHT, FALSE, 
                         LEVEL_EVENT(GC_RUN_LEVEL_SELECT, level_last, profile.level_spr_x ,profile.level_spr_y));
          menu_item_draw(MENU_X_START_L, MENU_Y_START+3*MENU_Y_DIFF, back_string,
                         MENU_LEFT, FALSE, 
                         LEVEL_EVENT(GI_MENU_BACK_POP));
        
          #undef MENU_X_START_L
          #undef MENU_X_START_R
          #undef MENU_Y_START
          #undef MENU_X_DIFF
          #undef MENU_Y_DIFF
        }
      }
      break;
    case 4:
      {
        // Draw top of the pipe      
        #define IMP_START_X 15
        #define IMP_START_Y 6
      
        menu_level_draw_pipe(5,IMP_START_X+1,IMP_START_Y);
        menu_level_draw_level(0,level_act,level_last,level_set,IMP_START_X+2, IMP_START_Y);
      
        menu_level_draw_pipe(2,IMP_START_X+2,IMP_START_Y+1);
        menu_level_draw_level(1,level_act,level_last,level_set,IMP_START_X+2, IMP_START_Y+2);
      
        menu_level_draw_pipe(5,IMP_START_X+2,IMP_START_Y+3);
        menu_level_draw_pipe(0,IMP_START_X+3,IMP_START_Y+3);
        menu_level_draw_pipe(1,IMP_START_X+4,IMP_START_Y+3);
        menu_level_draw_level(2,level_act,level_last,level_set,IMP_START_X+4, IMP_START_Y+4);
      
        menu_level_draw_pipe(2,IMP_START_X+4,IMP_START_Y+5);
        menu_level_draw_pipe(3,IMP_START_X+4,IMP_START_Y+6);
        menu_level_draw_pipe(0,IMP_START_X+3,IMP_START_Y+6);
        menu_level_draw_pipe(0,IMP_START_X+3,IMP_START_Y+6);
        menu_level_draw_pipe(0,IMP_START_X+2,IMP_START_Y+6);
        menu_level_draw_pipe(0,IMP_START_X+1,IMP_START_Y+6);
        menu_level_draw_pipe(4,IMP_START_X+0,IMP_START_Y+6);
        menu_level_draw_pipe(3,IMP_START_X+0,IMP_START_Y+7);
        menu_level_draw_pipe(0,IMP_START_X-1,IMP_START_Y+7);
        menu_level_draw_pipe(5,IMP_START_X-2,IMP_START_Y+7);
        menu_level_draw_pipe(2,IMP_START_X-2,IMP_START_Y+6);
        menu_level_draw_level(3,level_act,level_last,level_set,IMP_START_X-2, IMP_START_Y+5);

        menu_level_draw_pipe(1,IMP_START_X-2,IMP_START_Y+4);
        menu_level_draw_pipe(0,IMP_START_X-3,IMP_START_Y+4);
        menu_level_draw_pipe(5,IMP_START_X-4,IMP_START_Y+4);
        menu_level_draw_level(4,level_act,level_last,level_set,IMP_START_X-4, IMP_START_Y+3);

        menu_level_draw_pipe(4,IMP_START_X-4,IMP_START_Y+2);
        menu_level_draw_pipe(0,IMP_START_X-3,IMP_START_Y+2);
        menu_level_draw_pipe(0,IMP_START_X-2,IMP_START_Y+2);
        menu_level_draw_pipe(3,IMP_START_X-1,IMP_START_Y+2);
        menu_level_draw_pipe(2,IMP_START_X-1,IMP_START_Y+1);
        menu_level_draw_pipe(2,IMP_START_X-1,IMP_START_Y);
        menu_level_draw_pipe(2,IMP_START_X-1,IMP_START_Y-1);
        menu_level_draw_pipe(4,IMP_START_X-1,IMP_START_Y-2);        
        menu_level_draw_pipe(0,IMP_START_X  ,IMP_START_Y-2);
        menu_level_draw_pipe(1,IMP_START_X+1,IMP_START_Y-2);
        menu_level_draw_pipe(2,IMP_START_X+1,IMP_START_Y-1);
        
        if(!DOUBLE_SIZE) {
          #define MENU_X_START_L (GAME_RESOLUTION_X/2 - 17 - 60)
          #define MENU_X_START_R (GAME_RESOLUTION_X/2 + 60)
          #define MENU_Y_START   (GAME_RESOLUTION_Y - (DOUBLE_SIZE ? 180 : 130))
          #define MENU_X_DIFF     0
          #define MENU_Y_DIFF     30
        
          menu_item_draw(MENU_X_START_R, MENU_Y_START+0*MENU_Y_DIFF, play_string,
                         MENU_RIGHT, FALSE, 
                         LEVEL_EVENT(GC_RUN_LEVEL_SET));
          menu_item_draw(MENU_X_START_R, MENU_Y_START+1*MENU_Y_DIFF, level_hint,
                         MENU_RIGHT, MENU_SAVE_BACK, 
                         LEVEL_EVENT(GC_MENU_LEVEL_HINT, FALSE));
          menu_item_draw(MENU_X_START_R, MENU_Y_START+2*MENU_Y_DIFF, select_string,
                         MENU_RIGHT, FALSE, 
                         LEVEL_EVENT(GC_RUN_LEVEL_SELECT, level_last, profile.level_spr_x ,profile.level_spr_y));
          menu_item_draw(MENU_X_START_L, MENU_Y_START+3*MENU_Y_DIFF, back_string,
                         MENU_LEFT, FALSE, 
                         LEVEL_EVENT(GI_MENU_BACK_POP));
        
          #undef MENU_X_START_L
          #undef MENU_X_START_R
          #undef MENU_Y_START
          #undef MENU_X_DIFF
          #undef MENU_Y_DIFF
        }      
      }
      break;
    case 5:
      {
        // 32 levels
        #undef  LEVEL_LINE
        #define LEVEL_LINE "DPDV00DPDV01DPDV02DPLPDV03DPDV04DPDV05DPRPDV06DPDV07DPDV08DPLPLPDV09DPDV10"
        int lev = 0;
      
        lev += menu_level_run_path_draw_line(LEVEL_LINE, level_act,  level_last, level_set, 2, -1);
      
        #undef  LEVEL_LINE
        #define LEVEL_LINE "DPDV11DPRPRPDV12DPDV13DPDV14DPDV15DPRPDV16DPDV17DPRPDV18"
        lev += menu_level_run_path_draw_line(LEVEL_LINE, level_act,  level_last, level_set, 8, -1);
            
        #undef  LEVEL_LINE
        #define LEVEL_LINE "DPDV19DPRPRPDV20DPRPRPDPV21DPLPLPDV22DPRPRPDV23DPLPLPDV24DPRPDV25DPRPRPRPDV26DPDV27DPDV28DPDV29"
        lev += menu_level_run_path_draw_line(LEVEL_LINE, level_act,  level_last, level_set, 15, -1);
      
        #undef  LEVEL_LINE
        #define LEVEL_LINE "DPDV29DPRPRPDV30DPRPRPDPDPLPLPLPDV31"
        lev += menu_level_run_path_draw_line(LEVEL_LINE, level_act,  level_last, level_set, 23, -1);
              
        if(!DOUBLE_SIZE) {
          #define MENU_X_START_L (GAME_RESOLUTION_X/2 - 17 - 60 - 60)
          #define MENU_X_START_R (GAME_RESOLUTION_X/2 + 60 - 60)
          #define MENU_Y_START   (GAME_RESOLUTION_Y - 140)
          #define MENU_X_DIFF     0
          #define MENU_Y_DIFF     30
        
          menu_item_draw(MENU_X_START_R, MENU_Y_START+0*MENU_Y_DIFF, play_string,
                         MENU_RIGHT, FALSE, 
                         LEVEL_EVENT(GC_RUN_LEVEL_SET));
          menu_item_draw(MENU_X_START_R, MENU_Y_START+1*MENU_Y_DIFF, select_string,
                         MENU_RIGHT, FALSE, 
                         LEVEL_EVENT(GC_RUN_LEVEL_SELECT, level_last, profile.level_spr_x ,profile.level_spr_y));
          menu_item_draw(MENU_X_START_L, MENU_Y_START+2*MENU_Y_DIFF, back_string,
                         MENU_LEFT, FALSE, 
                         LEVEL_EVENT(GI_MENU_BACK_POP));
        
          #undef MENU_X_START_L
          #undef MENU_X_START_R
          #undef MENU_Y_START
          #undef MENU_X_DIFF
          #undef MENU_Y_DIFF
        }
      }
      break;
*/      
    default:  
      break;
  }
/*
  #undef MENU_X_START_L
  #undef MENU_X_START_R
  #undef MENU_Y_START
  #undef MENU_X_DIFF
  #undef MENU_Y_DIFF

  if(DOUBLE_SIZE) {
    #define MENU_X_START_L (GAME_RESOLUTION_X/2 - 17 - 60)
    #define MENU_X_START_R (GAME_RESOLUTION_X/2 + 60)
    #define MENU_Y_START   (GAME_RESOLUTION_Y - ((level_set < 5) ? 180 : 145))
    #define MENU_X_DIFF     0
    #define MENU_Y_DIFF     35
    int     y_position = 0;
  
    menu_item_draw(MENU_X_START_R, MENU_Y_START+y_position*MENU_Y_DIFF, play_string,
                   MENU_RIGHT, FALSE, 
                   LEVEL_EVENT(GC_RUN_LEVEL_SET));
    y_position++;
  
    if(level_set < 5) {
      menu_item_draw(MENU_X_START_R, MENU_Y_START+y_position*MENU_Y_DIFF, level_hint,
                     MENU_RIGHT, MENU_SAVE_BACK, 
                     LEVEL_EVENT(GC_MENU_LEVEL_HINT, FALSE));
      y_position++;
    }
    menu_item_draw(MENU_X_START_R, MENU_Y_START+y_position*MENU_Y_DIFF, select_string,
                   MENU_RIGHT, FALSE, 
                   LEVEL_EVENT(GC_RUN_LEVEL_SELECT, level_last, profile.level_spr_x ,profile.level_spr_y));
    y_position++;
    menu_item_draw(MENU_X_START_L, MENU_Y_START+y_position*MENU_Y_DIFF, back_string,
                   MENU_LEFT, FALSE, 
                   LEVEL_EVENT(GI_MENU_BACK_POP));
    y_position++;
  }

  p_grf->redraw_add(0, 0, GAME_RESOLUTION_X, GAME_RESOLUTION_Y);
  p_grf->flip();
  */
}

// New level set - based on profiles
GameGui.prototype.menu_level_run_new = function(state, level_set, unused)
{
  switch(state) {
    case MENU_RETURN:
    case MENU_ENTER:
      {            
        this.menu_enter(this, GameGui.prototype.menu_level_run_new, level_set, unused);
        this.graph.clear();
        
        this.profile.level_set_select(level_set);
        this.menu_level_run_path_draw(level_set,
                                      this.profile.selected_level_get(),
                                      this.profile.last_level_get());
        this.menu_level_name_print();
      }
      break;
    case MENU_LEAVE:
      break;
    default:
      break;
  }
}

GameGui.prototype.callback = function(event)
{  
  var ev = event.type;
  switch(ev) {
    case GC_MENU_START:
      this.menu_main(MENU_ENTER);
      break;      
    case GC_MENU_NEW_GAME:
      this.menu_new_game(MENU_ENTER);
      break;      
    case GC_MENU_RUN_LEVEL:
      this.menu_level_run_new(MENU_ENTER, event.params[0]);
      break;
/*
    case GC_RUN_LEVEL_SELECT:
      level_select(event.params[0], event.params[1], event.params[2]);      
      menu_level_name_print();
      break;
*/
/*      
    case GC_MENU_END_LEVEL:
      menu_level_end(MENU_ENTER);
      break;
    case GC_MENU_END_LEVEL_CUSTOM:
      menu_level_end_custom(MENU_ENTER);
      break;
    case GC_MENU_END_LEVEL_SET:
      menu_levelset_end(MENU_ENTER);
      break;
*/
/*     
    case GC_MENU_PROFILES:
      menu_profiles(MENU_ENTER);
      break;
    case GC_MENU_PROFILE_CREATE:
      menu_profile_create(ev.param_int_get(PARAM_0));
      break;
    case GC_MENU_PROFILE_SELECT:        
      menu_profile_select(ev.param_int_get(PARAM_0), ev.param_int_get(PARAM_1));
      break;
    case GC_MENU_SETTINGS:
      menu_settings(MENU_ENTER, ev.param_int_get(PARAM_0));
      break;
    case GC_MENU_SETTINGS_FULSCREEN_SWITCH:
      menu_settings_fullscreen();
      break;
    case GC_MENU_SETTINGS_DOUBLESIZE_SWITCH:        
      menu_settings_doublesize();
      break;
    case GC_MENU_SETTINGS_SOUND_SWITCH:
      //p_ber->sound.sound_on = !p_ber->sound.sound_on;
      break;
    case GC_MENU_SETTINGS_MUSIC_SWITCH:
      //p_ber->sound.music_on = !p_ber->sound.music_on;
      break;
    case GC_MENU_HELP:
      menu_help(MENU_ENTER, ev.param_int_get(PARAM_0));
      break;
    case GC_MENU_QUIT:        
      return(FALSE);
      break;
    case GC_MENU_HELP_KEYS:
      menu_help_keys(MENU_ENTER, ev.param_int_get(PARAM_0));
      break;
    case GC_MENU_HELP_RULES:
      menu_help_rules(MENU_ENTER, ev.param_int_get(PARAM_0), ev.param_int_get(PARAM_1));
      break;
    case GC_MENU_HELP_CREDIT:
      menu_help_credits(MENU_ENTER, ev.param_int_get(PARAM_0));
      break;
    case GC_MENU_LEVEL_HINT:
      menu_level_hint(MENU_ENTER, ev.param_int_get(PARAM_0));
      break;
    
    case GC_RUN_LEVEL_LINE:
      level_run(&tmp_queue, (char *)ev.param_point_get(PARAM_0));
      break;
    case GC_RUN_LEVEL_SET:
      level_run(&tmp_queue);
      break;
    case GC_STOP_LEVEL:
      level_stop(&tmp_queue, ev.param_int_get(PARAM_0), ev.param_int_get(PARAM_1));
      break;
    
    case GC_SUSPEND_LEVEL:
      level_suspend(&tmp_queue);
      break;
    case GC_RESTORE_LEVEL:
      level_restore(&tmp_queue);
      break;
    
    case GC_RESTART_LEVEL:
      level_restart(&tmp_queue);
      break;
    
    case GC_SAVE_LEVEL:
      level_save(&tmp_queue);
      break;
    case GC_LOAD_LEVEL:        
      level_load(&tmp_queue);
      break;
   
    
    case GC_MENU_IN_GAME:
      menu_in_game(MENU_ENTER);
      break;

    case GC_RUN_EDITOR:
      run_editor();
      break;
    
    case GI_SPRITE_DRAW:
    case GI_STRING_DRAW:
    case GI_CHECKBOX_SWITCH:
    case GI_HIGHLIGHT_EVENT:
    case GI_KEY_DOWN:
      menu_services(p_queue, &tmp_queue, ev);
      break;
*/        
    case GI_MENU_BACK_POP:
      this.back_pop();
      break;
    case GI_MENU_BACK_PUSH:
      this.back_push();
      break;
    default:
      break;
  }
}

GameGui.prototype.level_run = function(event)
{


}
