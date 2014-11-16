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
        this.graph.font_alignment_set(align);
        this.graph.int_print(text,
                             this.menu_item_callback, new GameGuiCallbackData(this, event, event_back),
                             this.menu_last_x + this.menu_spr_diff_dx + this.menu_text_diff_x,
                             this.menu_last_y + this.menu_text_diff_y);

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
        this.graph.font_alignment_set(align);
        this.graph.int_print(text,
                             this.menu_item_callback, new GameGuiCallbackData(this, event, event_back),
                             this.menu_last_x - this.menu_text_diff_x,
                             this.menu_last_y + this.menu_text_diff_y);

        this.menu_last_x += this.menu_last_dx;
        this.menu_last_y += this.menu_last_dy;
      }
      break;
    case MENU_CENTER:
      {
        // not implemented
        assert(0);
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

// New level set - based on profiles
GameGui.prototype.menu_level_run_new = function(state, level_set, unused)
{
  switch(state) {
    case MENU_RETURN:
    case MENU_ENTER:
      {            
        this.menu_enter(this, GameGui.prototype.menu_level_run_new, data, data1);
        this.graph.clear();
      
        this.level_set_select(level_set);
        this.menu_level_run_path_draw(level_set,
                                      profile.selected_level_get(),
                                      p_ber->levelset_get_levelnum(),
                                      profile.last_level_get());
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
      menu_level_run_new(MENU_ENTER, event.params[0]);
      break;
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
    
    case GC_RUN_LEVEL_SELECT:
      level_select(ev.param_int_get(PARAM_0), ev.param_int_get(PARAM_1), ev.param_int_get(PARAM_2));
      menu_level_name_print();
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
