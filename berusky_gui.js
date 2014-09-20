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

function MenuEvent() {
    var type;
}

function MenuFunction() {
/*
  void run(MENU_STATE state)
  void run_and_clear(MENU_STATE state)
  */
}

function GameGui() {
  this.game = new Game();
  this.graph = this.game.graph;
  this.loaded = false;
  this.events = new BeruskyEvents();
  
  //this.menu_back_stack = Array();
  //this.menu_current = new MenuFunction();
  
  // launch the beast
  requestAnimFrame(GameGuiLoop);
}

GameGui.prototype.GameGuiLoop = function() {

  if(!this.loaded && this.graph.is_loaded()) {
    this.loaded = true;
    this.events.listener_add(this);
    this.event_send(GC_MENU_START);    
  }
  
  //this.game.game_loop();
  this.graph.render();
}

GameGui.prototype.event_send = function(type, p1, p2)
{
  var ev = new MenuEvent();  
  ev.type = type;
  ev.p1 = p1;
  ev.p2 = p2;
  this.events.send(ev);
}

/*
// -------------------------------------------------------
// Game UI - clean up management
// -------------------------------------------------------
GameGui.prototype.menu_enter = function(class, func, param_1, param_2)
{
  // If there is a menu function, call it
  menu_leave();

  // Set the new menu function
  menu_current.set(p_class, p_func, param_1, param_2);
}

void gui_base::menu_leave(void)
{
  menu_current.run_and_clear(MENU_LEAVE);
}

// -------------------------------------------------------
// Game UI - "back" management
// -------------------------------------------------------
void gui_base::back_push(void)
{  
  menu_back_stack.push(menu_current);
}

void gui_base::back_pop(void)
{
  if(!(menu_back_stack.is_empty())) {
    MENU_FUCTION fnc = menu_back_stack.pop();
    fnc.run(MENU_RETURN);
  }
}
*/
/*
GameGui.prototype.menu_dummy = function(state, data, data1)
{
  switch(state) {
    case MENU_RETURN:
    case MENU_ENTER:
      menu_enter((GUI_BASE *)this,(GUI_BASE_FUNC)&gui_base::menu_dummy, data, data1);
      break;
    
    case MENU_LEAVE:
      break;      
    
    default:
      break;
  }
}
*/

GameGui.prototype.menu_main = function(state, data, data1)
{  
  switch(state) {
    case MENU_RETURN:
    case MENU_ENTER:
      {        
/*      
        menu_enter((GUI_BASE *)this,(GUI_BASE_FUNC)(&game_gui::menu_main), data, data1);
*/        
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
        
/*
        static char *new_game = _("play");
        static char *profiles = _("change profile");
        static char *settings = _("settings");
        static char *help = _("help");
        static char *editor = _("editor");
        static char *quit = _("quit");

        p_font->select(FONT_DEFAULT);

        menu_item_set_pos(GAME_RESOLUTION_X/2 - 70, GAME_RESOLUTION_Y/2 - 50);

        #define MENU_X_DIFF  0
        #define MENU_Y_DIFF  (DOUBLE_SIZE ? 45 : 35)
        menu_item_set_diff(MENU_X_DIFF, MENU_Y_DIFF);

        menu_item_start();

        menu_item_draw(new_game, MENU_LEFT, MENU_SAVE_BACK, LEVEL_EVENT(GC_MENU_NEW_GAME));
        menu_item_draw(profiles, MENU_LEFT, MENU_SAVE_BACK, LEVEL_EVENT(GC_MENU_PROFILES));
        menu_item_draw(settings, MENU_LEFT, MENU_SAVE_BACK, LEVEL_EVENT(GC_MENU_SETTINGS));
        menu_item_draw(help, MENU_LEFT, MENU_SAVE_BACK, LEVEL_EVENT(GC_MENU_HELP,FALSE));
        menu_item_draw(editor, MENU_LEFT, MENU_SAVE_BACK, LEVEL_EVENT(GC_RUN_EDITOR));      
        menu_item_draw(quit, MENU_LEFT, MENU_SAVE_BACK, LEVEL_EVENT(GC_MENU_QUIT));
      
        p_font->alignment_set(MENU_CENTER);
        p_font->start_set(0, GAME_RESOLUTION_Y - 60);
        p_font->print(NULL,_("berusky version %s (C) Anakreon 1997-2012\n"), VERSION);
        p_font->print(_("distributed under GPLv2\n"));
        
        #define PROFILE_Y_DIFF  (DOUBLE_SIZE ? 70 : -10)
        p_font->alignment_set(MENU_CENTER);
        p_font->start_set(0, LOGO_START+height+PROFILE_Y_DIFF);
        p_font->print(NULL, _("Selected profile: %s"), profile.profile_name);
*/
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
/*     
    case GC_MENU_NEW_GAME:
      menu_new_game(MENU_ENTER);
      break;      
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
   
    case GC_MENU_RUN_LEVEL:
      menu_level_run_new(MENU_ENTER, ev.param_int_get(PARAM_0));
      break;
    case GC_MENU_END_LEVEL:
      menu_level_end(MENU_ENTER);
      break;
    case GC_MENU_END_LEVEL_CUSTOM:
      menu_level_end_custom(MENU_ENTER);
      break;
    case GC_MENU_END_LEVEL_SET:
      menu_levelset_end(MENU_ENTER);
      break;
    
    case GC_MENU_IN_GAME:
      menu_in_game(MENU_ENTER);
      break;

    case GC_RUN_EDITOR:
      run_editor();
      break;

    case GI_MENU_BACK_POP:
      back_pop();
      break;
    case GI_MENU_BACK_PUSH:
      back_push();
      break;
    
    case GI_SPRITE_DRAW:
    case GI_STRING_DRAW:
    case GI_CHECKBOX_SWITCH:
    case GI_HIGHLIGHT_EVENT:
    case GI_KEY_DOWN:
      menu_services(p_queue, &tmp_queue, ev);
      break;
*/        
    default:
      break;
  }
}

GameGui.prototype.level_run = function(event)
{


}
