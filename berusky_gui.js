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

bool game_gui::callback(LEVEL_EVENT_QUEUE *p_queue, int frame)
{  
  /* If there's a timer function, call it! */
  if(menu_timer.valid()) {
    (this->*menu_timer.p_func)(MENU_TIMER, menu_timer.p1, menu_timer.p2);
  }

  /* load events from system by SDL event handler */
  input.events_loop(p_queue);
  
  /* Scan the queue and do the propper action */
  static LEVEL_EVENT_QUEUE tmp_queue;

#if EVENTS_DEBUG
  p_queue->dump_read("Read - game_gui::callback() loop start");
#endif

  while(!p_queue->empty()) {
    LEVEL_EVENT ev = p_queue->get();
      
    switch(ev.action_get()) {
      /* Start of the game
       * This is the firts event after start
       */
      case GC_MENU_START:
        menu_main(MENU_ENTER);
        break;      
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
            
      default:
        // Copy only valid events
        if(ev.valid()) {
          tmp_queue.add(ev);
          tmp_queue.commit();
        }
        break;
    }
  }

  /* Commit all writes */
  tmp_queue.commit();
  p_queue->add(&tmp_queue);
  p_queue->commit();  
  tmp_queue.clear();

#if EVENTS_DEBUG
  p_queue->dump_read("Read - game_gui::callback() end");
#endif

  /* Call the game (if exists) */
  if(p_ber) {
    p_ber->level_callback(p_queue);
  }

  return(TRUE);
}
