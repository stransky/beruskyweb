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

  // Used for menu rendering
  this.menu_spr_active = false;
  this.menu_spr_inactive = false;
  this.menu_text_diff_x = false;
  this.menu_text_diff_y = false;
  this.menu_spr_diff_dx = false;
  this.menu_spr_diff_dy = false;
  this.menu_last_x = false;
  this.menu_last_y = false;


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


// MENU_TEXT_DIFF_X, MENU_TEXT_DIFF_Y
/*
GameGui.prototype.menu_item_draw_sprite_set = function(sprite_active, sprite_inactive, 
                                                       menu_text_diff_x, menu_text_diff_y)
{
  this.menu_spr_active = sprite_active;
  this.menu_spr_inactive = sprite_inactive;
  this.menu_text_diff_x = menu_text_diff_x;
  this.menu_text_diff_y = menu_text_diff_y;
  this.menu_spr_diff_dx = sprite_active.width;
  this.menu_spr_diff_dy = sprite_active.height;
}

GameGui.prototype.menu_item_draw_sprite = function(text, align, flags,
                                                   click1, click2, click3)
{
  switch(align)
  {
    case MENU_LEFT:
      {
        if(!(flags&MENU_DONT_DRAW_SPRITE)) {
          this.graph.sprite_insert(menu_spr_inactive, this.menu_last_x, this.menu_last_y);
        }
        this.graph.font_alignment_set(MENU_LEFT);
        this.graph.font_select(FONT_DEFAULT);
        this.graph.print(test, this.menu_last_x + menu_spr_diff_dx + menu_text_diff_x, 
                               this.menu_last_y + menu_text_diff_y);
      
        if(!(flags&MENU_DRAW_ONLY)) {
          RECT r_arrow = {this.menu_last_x, this.menu_last_y, menu_spr_diff_dx, menu_spr_diff_dy};
      
          LEVEL_EVENT s_spr;
          LEVEL_EVENT u_spr;
        
          if(flags&MENU_DONT_DRAW_SPRITE) {
            u_spr = s_spr = LEVEL_EVENT(EV_NONE);
          }
          else {
            s_spr = LEVEL_EVENT(GI_SPRITE_DRAW, menu_spr_active, this.menu_last_x, this.menu_last_y);
            u_spr = LEVEL_EVENT(GI_SPRITE_DRAW, menu_spr_inactive,  this.menu_last_x, this.menu_last_y);
          }
  
          LEVEL_EVENT s_text = LEVEL_EVENT(GI_STRING_DRAW, ET(FONT_SELECTED),
                               ET_INT(this.menu_last_x + menu_spr_diff_dx + menu_text_diff_x),
                               ET_INT(this.menu_last_y + menu_text_diff_y),
                               ET_INT(MENU_LEFT), ET_INT(p_text));
          LEVEL_EVENT u_text = LEVEL_EVENT(GI_STRING_DRAW, ET_INT(FONT_DEFAULT),
                               ET_INT(this.menu_last_x + menu_spr_diff_dx + menu_text_diff_x),
                               ET_INT(this.menu_last_y + menu_text_diff_y),
                               ET_INT(MENU_LEFT), ET_INT(p_text));
          LEVEL_EVENT u_text_highlight = LEVEL_EVENT(GI_HIGHLIGHT_EVENT, highlight_group_next);
          u_text_highlight.depends_add(2);
      
          input.mevent_add(MOUSE_EVENT(MOUSE_STATE(r_arrow), MEVENT_ACTIVATE_ONCE|MEVENT_MOUSE_IN,  s_spr, s_text));
          if(!highlight_group_next)
            input.mevent_add(MOUSE_EVENT(MOUSE_STATE(r_arrow), MEVENT_ACTIVATE_ONCE|MEVENT_MOUSE_OUT, u_spr, u_text));
          else
            input.mevent_add(MOUSE_EVENT(MOUSE_STATE(r_arrow, MASK_BUTTON_LEFT), MEVENT_ACTIVATE_ONCE|MEVENT_MOUSE_IN|MEVENT_MOUSE_BUTTONS, u_text_highlight, u_spr, u_text));
          if(flags&MENU_SAVE_BACK)
            input.mevent_add(MOUSE_EVENT(MOUSE_STATE(r_arrow, MASK_BUTTON_LEFT), MEVENT_ACTIVATE_ONCE|MEVENT_MOUSE_IN|MEVENT_MOUSE_BUTTONS, LEVEL_EVENT(GI_MENU_BACK_PUSH)));
          input.mevent_add(MOUSE_EVENT(MOUSE_STATE(r_arrow, MASK_BUTTON_LEFT), MEVENT_ACTIVATE_ONCE|MEVENT_MOUSE_IN|MEVENT_MOUSE_BUTTONS, click1, click2, click3));
    
          input.mevent_add(MOUSE_EVENT(MOUSE_STATE(r), MEVENT_ACTIVATE_ONCE|MEVENT_MOUSE_IN,  s_spr, s_text));
          if(!highlight_group_next)
            input.mevent_add(MOUSE_EVENT(MOUSE_STATE(r), MEVENT_ACTIVATE_ONCE|MEVENT_MOUSE_OUT, u_spr, u_text));
          else
            input.mevent_add(MOUSE_EVENT(MOUSE_STATE(r, MASK_BUTTON_LEFT), MEVENT_ACTIVATE_ONCE|MEVENT_MOUSE_IN|MEVENT_MOUSE_BUTTONS, u_text_highlight, u_spr, u_text));
          if(flags&MENU_SAVE_BACK)
            input.mevent_add(MOUSE_EVENT(MOUSE_STATE(r, MASK_BUTTON_LEFT), MEVENT_ACTIVATE_ONCE|MEVENT_MOUSE_IN|MEVENT_MOUSE_BUTTONS, LEVEL_EVENT(GI_MENU_BACK_PUSH)));
          input.mevent_add(MOUSE_EVENT(MOUSE_STATE(r, MASK_BUTTON_LEFT), MEVENT_ACTIVATE_ONCE|MEVENT_MOUSE_IN|MEVENT_MOUSE_BUTTONS, click1, click2, click3));
          
          highlight_group_next = HIGHLIGHT_GROUP_NONE;
        }
        
        this.menu_last_x += this.menu_last_dx;
        this.menu_last_y += this.menu_last_dy;        
      }
      break;
    case MENU_RIGHT:
      {
        if(!(flags&MENU_DONT_DRAW_SPRITE)) {
          p_grf->draw(menu_spr_inactive, this.menu_last_x, this.menu_last_y);
        }
        this.graph.font_alignment_set(MENU_RIGHT);
        this.graph.font_select(FONT_DEFAULT);
        this.graph.font_print(&r, this.menu_last_x - menu_text_diff_x, this.menu_last_y + menu_text_diff_y, p_text);

        if(!(flags&MENU_DRAW_ONLY)) {
          RECT r_arrow = {this.menu_last_x, this.menu_last_y, menu_spr_diff_dx, menu_spr_diff_dy};
  
          LEVEL_EVENT s_spr;
          LEVEL_EVENT u_spr;
  
          if(flags&MENU_DONT_DRAW_SPRITE) {
            u_spr = s_spr = LEVEL_EVENT(EV_NONE);
          }
          else {
            s_spr = LEVEL_EVENT(GI_SPRITE_DRAW, menu_spr_active, this.menu_last_x, this.menu_last_y);
            u_spr = LEVEL_EVENT(GI_SPRITE_DRAW, menu_spr_inactive,  this.menu_last_x, this.menu_last_y);
          }
          
          LEVEL_EVENT s_text = LEVEL_EVENT(GI_STRING_DRAW, 
                                          ET_INT(FONT_SELECTED), 
                                          ET_INT(this.menu_last_x - menu_text_diff_x), 
                                          ET_INT(this.menu_last_y + menu_text_diff_y), 
                                          ET_INT(MENU_RIGHT), ET_INT(p_text));
          LEVEL_EVENT u_text = LEVEL_EVENT(GI_STRING_DRAW, 
                                          ET_INT(FONT_DEFAULT),  
                                          ET_INT(this.menu_last_x - menu_text_diff_x), 
                                          ET_INT(this.menu_last_y + menu_text_diff_y), 
                                          ET_INT(MENU_RIGHT), ET_INT(p_text));
  
          LEVEL_EVENT u_text_highlight = LEVEL_EVENT(GI_HIGHLIGHT_EVENT, highlight_group_next);
          u_text_highlight.depends_add(2);
  
          input.mevent_add(MOUSE_EVENT(MOUSE_STATE(r_arrow), MEVENT_ACTIVATE_ONCE|MEVENT_MOUSE_IN,  s_spr, s_text));
          if(!highlight_group_next)
            input.mevent_add(MOUSE_EVENT(MOUSE_STATE(r_arrow), MEVENT_ACTIVATE_ONCE|MEVENT_MOUSE_OUT, u_spr, u_text));
          else
            input.mevent_add(MOUSE_EVENT(MOUSE_STATE(r_arrow, MASK_BUTTON_LEFT), MEVENT_ACTIVATE_ONCE|MEVENT_MOUSE_IN|MEVENT_MOUSE_BUTTONS, u_text_highlight, u_text));
          if(flags&MENU_SAVE_BACK)
            input.mevent_add(MOUSE_EVENT(MOUSE_STATE(r_arrow, MASK_BUTTON_LEFT), MEVENT_ACTIVATE_ONCE|MEVENT_MOUSE_IN|MEVENT_MOUSE_BUTTONS, LEVEL_EVENT(GI_MENU_BACK_PUSH)));        
          input.mevent_add(MOUSE_EVENT(MOUSE_STATE(r_arrow, MASK_BUTTON_LEFT), MEVENT_ACTIVATE_ONCE|MEVENT_MOUSE_IN|MEVENT_MOUSE_BUTTONS, click1, click2, click3));
  
          input.mevent_add(MOUSE_EVENT(MOUSE_STATE(r), MEVENT_ACTIVATE_ONCE|MEVENT_MOUSE_IN,  s_spr, s_text));
          if(!highlight_group_next)
            input.mevent_add(MOUSE_EVENT(MOUSE_STATE(r), MEVENT_ACTIVATE_ONCE|MEVENT_MOUSE_OUT, u_spr, u_text));
          else
            input.mevent_add(MOUSE_EVENT(MOUSE_STATE(r, MASK_BUTTON_LEFT), MEVENT_ACTIVATE_ONCE|MEVENT_MOUSE_IN|MEVENT_MOUSE_BUTTONS, u_text_highlight, u_text));
          if(flags&MENU_SAVE_BACK)
            input.mevent_add(MOUSE_EVENT(MOUSE_STATE(r, MASK_BUTTON_LEFT), MEVENT_ACTIVATE_ONCE|MEVENT_MOUSE_IN|MEVENT_MOUSE_BUTTONS, LEVEL_EVENT(GI_MENU_BACK_PUSH)));        
          input.mevent_add(MOUSE_EVENT(MOUSE_STATE(r, MASK_BUTTON_LEFT), MEVENT_ACTIVATE_ONCE|MEVENT_MOUSE_IN|MEVENT_MOUSE_BUTTONS, click1, click2, click3));
  
          highlight_group_next = HIGHLIGHT_GROUP_NONE;
        }
      
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

void gui_base::menu_item_draw_sprite(tpos x, tpos y, char *p_text, MENU_TYPE spr_align, int flags,
                                     LEVEL_EVENT click1, LEVEL_EVENT click2, LEVEL_EVENT click3)
{
  menu_item_set_pos(x,y);
  menu_item_draw_sprite(p_text, spr_align, flags, click1, click2, click3);
}

void gui_base::menu_item_draw_text(char *p_text, MENU_TYPE align, int flags,
                                   LEVEL_EVENT click1, LEVEL_EVENT click2, LEVEL_EVENT click3)
{
  this.graph.font_alignment_set(align);
  this.graph.font_select(FONT_DEFAULT);
  this.graph.font_print(&r, this.menu_last_x, this.menu_last_y, p_text);

  if(!(flags&MENU_DRAW_ONLY)) {
    LEVEL_EVENT s_text = LEVEL_EVENT(GI_STRING_DRAW, ET_INT(FONT_SELECTED), 
                                    ET_INT(this.menu_last_x), 
                                    ET_INT(this.menu_last_y), 
                                    ET_INT(align),
                                    ET_INT(p_text));
    LEVEL_EVENT u_text = LEVEL_EVENT(GI_STRING_DRAW, ET_INT(FONT_DEFAULT),
                                    ET_INT(this.menu_last_x), 
                                    ET_INT(this.menu_last_y), 
                                    ET_INT(align),
                                    ET_INT(p_text));
    LEVEL_EVENT u_text_highlight = LEVEL_EVENT(GI_HIGHLIGHT_EVENT, highlight_group_next);
    u_text_highlight.depends_add(1);
  
    // event - release the saved highlighted event (if any)
    input.mevent_add(MOUSE_EVENT(MOUSE_STATE(r), MEVENT_ACTIVATE_ONCE|MEVENT_MOUSE_IN,  s_text));
    if(!highlight_group_next)
      input.mevent_add(MOUSE_EVENT(MOUSE_STATE(r), MEVENT_ACTIVATE_ONCE|MEVENT_MOUSE_OUT, u_text));
    else
      input.mevent_add(MOUSE_EVENT(MOUSE_STATE(r, MASK_BUTTON_LEFT), 
                       MEVENT_ACTIVATE_ONCE|MEVENT_MOUSE_IN|MEVENT_MOUSE_BUTTONS, 
                       u_text_highlight, u_text));
  
    if(flags&MENU_SAVE_BACK) {
      input.mevent_add(MOUSE_EVENT(MOUSE_STATE(r, MASK_BUTTON_LEFT), 
                       MEVENT_ACTIVATE_ONCE|MEVENT_MOUSE_IN|MEVENT_MOUSE_BUTTONS, 
                       LEVEL_EVENT(GI_MENU_BACK_PUSH)));
    }
    
    input.mevent_add(MOUSE_EVENT(MOUSE_STATE(r, MASK_BUTTON_LEFT), 
                     MEVENT_ACTIVATE_ONCE|MEVENT_MOUSE_IN|MEVENT_MOUSE_BUTTONS, 
                     click1, click2, click3));
    
    highlight_group_next = HIGHLIGHT_GROUP_NONE;
  }

  this.menu_last_x += this.menu_last_dx;
  this.menu_last_y += this.menu_last_dy;
}

void gui_base::menu_item_draw_text(tpos x, tpos y, char *p_text, MENU_TYPE spr_align, int flags,
                                   LEVEL_EVENT click1, LEVEL_EVENT click2, LEVEL_EVENT click3)
{
  menu_item_set_pos(x,y);
  menu_item_draw_text(p_text, spr_align, flags, click1, click2, click3);
}

void gui_base::menu_item_draw(char *p_text, MENU_TYPE spr_align, int flags,
                              LEVEL_EVENT click1, LEVEL_EVENT click2, LEVEL_EVENT click3)
{

  if(flags&MENU_NO_SPRITE) {
    menu_item_draw_text(p_text, spr_align, flags, click1, click2, click3);
  }
  else {
    switch(spr_align)
    {
      case MENU_LEFT:
        {      
          menu_item_draw_sprite_set(MENU_SPRIT_ARROW_LC, MENU_SPRIT_ARROW_L, 
                                    MENU_TEXT_DIFF_X, MENU_TEXT_DIFF_Y);
          menu_item_draw_sprite(p_text, MENU_LEFT, flags,
                                click1, click2, click3);
        }
        break;
      case MENU_RIGHT:
        {
          menu_item_draw_sprite_set(MENU_SPRIT_ARROW_RC, MENU_SPRIT_ARROW_R,
                                    MENU_TEXT_DIFF_X, MENU_TEXT_DIFF_Y);
          menu_item_draw_sprite(p_text, MENU_RIGHT, flags,
                                click1, click2, click3);
        }          
        break;
      
      case MENU_CENTER:
        {
          menu_item_draw_sprite_set(MENU_SPRIT_ARROW_RC, MENU_SPRIT_ARROW_L,
                                    MENU_TEXT_DIFF_X, MENU_TEXT_DIFF_Y);
          menu_item_draw_sprite(p_text, MENU_CENTER, flags,
                                click1, click2, click3);
        }      
        break;
      default:
        break;
    }
  }
}

void gui_base::menu_item_draw(tpos x, tpos y, char *p_text, MENU_TYPE spr_align, 
                              int flags, LEVEL_EVENT click1, LEVEL_EVENT click2, LEVEL_EVENT click3)
{
  menu_item_set_pos(x,y);
  menu_item_draw(p_text,spr_align,flags,click1,click2,click3);
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

        this.graph.font_select(FONT_DEFAULT);

        menu_item_set_pos(GAME_RESOLUTION_X/2 - 70, GAME_RESOLUTION_Y/2 - 50);

        #define MENU_X_DIFF  0
        #define MENU_Y_DIFF  (DOUBLE_SIZE ? 45 : 35)
        menu_item_set_diff(MENU_X_DIFF, MENU_Y_DIFF);
        
        menu_item_draw(new_game, MENU_LEFT, MENU_SAVE_BACK, LEVEL_EVENT(GC_MENU_NEW_GAME));
        menu_item_draw(profiles, MENU_LEFT, MENU_SAVE_BACK, LEVEL_EVENT(GC_MENU_PROFILES));
        menu_item_draw(settings, MENU_LEFT, MENU_SAVE_BACK, LEVEL_EVENT(GC_MENU_SETTINGS));
        menu_item_draw(help, MENU_LEFT, MENU_SAVE_BACK, LEVEL_EVENT(GC_MENU_HELP,FALSE));
        menu_item_draw(editor, MENU_LEFT, MENU_SAVE_BACK, LEVEL_EVENT(GC_RUN_EDITOR));      
        menu_item_draw(quit, MENU_LEFT, MENU_SAVE_BACK, LEVEL_EVENT(GC_MENU_QUIT));
      
        this.graph.font_alignment_set(MENU_CENTER);
        this.graph.font_start_set(0, GAME_RESOLUTION_Y - 60);
        this.graph.font_print(NULL,_("berusky version %s (C) Anakreon 1997-2012\n"), VERSION);
        this.graph.font_print(_("distributed under GPLv2\n"));
        
        #define PROFILE_Y_DIFF  (DOUBLE_SIZE ? 70 : -10)
        this.graph.font_alignment_set(MENU_CENTER);
        this.graph.font_start_set(0, LOGO_START+height+PROFILE_Y_DIFF);
        this.graph.font_print(NULL, _("Selected profile: %s"), profile.profile_name);
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
