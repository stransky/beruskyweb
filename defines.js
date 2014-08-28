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

var GAME_RESOLUTION_X        = 640
var GAME_RESOLUTION_Y        = 480

var LEVEL_SCREEN_START_X     = 0
var LEVEL_SCREEN_START_Y     = 40

var LEVEL_RESOLUTION_X       = 640
var LEVEL_RESOLUTION_Y       = 420

var CELL_SIZE_X              = 20
var CELL_SIZE_Y              = 20

var LEVEL_CELLS_X            = 32
var LEVEL_CELLS_Y            = 21

/* Main game items */
var NO_ITEM                  = 65535 // -1 by uint16

var P_GROUND                 = 0
var P_PLAYER_1               = 1
var P_PLAYER_2               = 2
var P_PLAYER_3               = 3
var P_PLAYER_4               = 4
var P_PLAYER_5               = 5
var P_BOX                    = 6
var P_TNT                    = 7
var P_WALL                   = 8
var P_EXIT                   = 9
var P_STONE                  = 10
var P_KEY                    = 11
var P_MATTOCK                = 12
var P_KEY1                   = 13
var P_KEY2                   = 14
var P_KEY3                   = 15
var P_KEY4                   = 16
var P_KEY5                   = 17

var P_DOOR1_H_O              = 18
var P_DOOR2_H_O              = 19
var P_DOOR3_H_O              = 20
var P_DOOR4_H_O              = 21
var P_DOOR5_H_O              = 22
//
var P_DOOR1_H_Z              = 23
var P_DOOR2_H_Z              = 24
var P_DOOR3_H_Z              = 25
var P_DOOR4_H_Z              = 26
var P_DOOR5_H_Z              = 27
//
var P_DOOR1_V_O              = 28
var P_DOOR2_V_O              = 29
var P_DOOR3_V_O              = 30
var P_DOOR4_V_O              = 31
var P_DOOR5_V_O              = 32
//
var P_DOOR1_V_Z              = 33
var P_DOOR2_V_Z              = 34
var P_DOOR3_V_Z              = 35
var P_DOOR4_V_Z              = 36
var P_DOOR5_V_Z              = 37
//
var P_ID_DOOR1_H_O           = 38
var P_ID_DOOR2_H_O           = 39
var P_ID_DOOR3_H_O           = 40
var P_ID_DOOR4_H_O           = 41
var P_ID_DOOR5_H_O           = 42
//
var P_ID_DOOR1_H_Z           = 43
var P_ID_DOOR2_H_Z           = 44
var P_ID_DOOR3_H_Z           = 45
var P_ID_DOOR4_H_Z           = 46
var P_ID_DOOR5_H_Z           = 47
//
var P_ID_DOOR1_V_O           = 48
var P_ID_DOOR2_V_O           = 49
var P_ID_DOOR3_V_O           = 50
var P_ID_DOOR4_V_O           = 51
var P_ID_DOOR5_V_O           = 52
//
var P_ID_DOOR1_V_Z           = 53
var P_ID_DOOR2_V_Z           = 54
var P_ID_DOOR3_V_Z           = 55
var P_ID_DOOR4_V_Z           = 56
var P_ID_DOOR5_V_Z           = 57
//
var P_DV_H_O                 = 58
var P_DV_H_Z                 = 59
var P_DV_V_O                 = 60
var P_DV_V_Z                 = 61
//
var P_DV_H                   = 62
var P_DV_V                   = 63

var PP_LEFT_JAMB_O           = 64
var PP_RIGHT_JAMB_O          = 65
var PP_TOP_JAMB_O            = 66
var PP_BOTTOM_JAMB_O         = 67

var PP_LEFT_JAMB_Z           = 68
var PP_RIGHT_JAMB_Z          = 69
var PP_TOP_JAMB_Z            = 70
var PP_BOTTOM_JAMB_Z         = 71

/* Sprite flags */
var SPRITE_CLEAR             = 0x1
var SPRITE_NO_DRAW           = 0x2
var SPRITE_STATIC            = 0x4
var SPRITE_DYNAMIC           = 0x8
var SPRITE_NO_ROTATE         = 0x10

/* Sprite positions */
var FIRST_GLOBAL_LEVEL        = 0
var FIRST_CLASSIC_LEVEL       = 100
var FIRST_CYBER_LEVEL         = 200
var FIRST_BACKGROUND          = 400
var FIRST_OTHER               = 410
var FIRST_CURSOR              = 590
var FIRST_PLAYER              = 600
var FIRST_PLAYER_1            = 600
var FIRST_PLAYER_2            = 610
var FIRST_PLAYER_3            = 620
var FIRST_PLAYER_4            = 630
var FIRST_PLAYER_5            = 640
var FIRST_PLAYER_STEP         = 10
var FIRST_MENU                = 700
var FIRST_LOGO                = 800
var FIRST_FONT                = 1000

var FONT_NUM                  = 3
var FONT_STEP                 = 100
var FONT_SPRITES              = 61

var LAYER_ITEM                = 0
var LAYER_VARIANT             = 1
var LAYER_ROTATION            = 2

var GAME_RESOLUTION_X         = 640
var GAME_RESOLUTION_Y         = 480

var CELL_SIZE_X               = 20
var CELL_SIZE_Y               = 20

var LEVEL_SCREEN_START_X      = 0
var LEVEL_SCREEN_START_Y      = 40

var PLAYER_MAX                = 5
var PLAYER_MAX_MATTLOCKS      = 9
var PLAYER_MAX_KEYS           = 1

// -------------------------------------------------------
// Animation definition - predefined
// -------------------------------------------------------
var ANIM_PLAYER_1             = 0
var ANIM_PLAYER_2             = 1
var ANIM_PLAYER_3             = 2
var ANIM_PLAYER_4             = 3
var ANIM_PLAYER_5             = 4

var ANIM_MOVE_FRAMES          = 9

var ANIM_MOVE_UP              = 5
var ANIM_MOVE_DOWN            = 7
var ANIM_MOVE_LEFT            = 6
var ANIM_MOVE_RIGHT           = 8

var ANIM_STONE_1              = 9
var ANIM_STONE_2              = 10

var ANIM_EXIT_1               = 11

var ANIM_BLAST                = 14

var ANIM_DOOR_ID_H            = 0
var ANIM_DOOR_ID_V            = 1
var ANIM_DOOR_DV_H            = 2
var ANIM_DOOR_DV_V            = 3

var ANIM_PLAYER_1_FAST        = 15
var ANIM_PLAYER_2_FAST        = 16
var ANIM_PLAYER_3_FAST        = 17
var ANIM_PLAYER_4_FAST        = 18
var ANIM_PLAYER_5_FAST        = 19

var ANIM_MOVE_UP_FAST         = 20
var ANIM_MOVE_DOWN_FAST       = 22
var ANIM_MOVE_LEFT_FAST       = 21
var ANIM_MOVE_RIGHT_FAST      = 23

var ANIM_MOVE_FRAMES_FAST     = 4

var FAST_ANIMATION_SHIFT      = 15

var FIRST_KEY                 = (FIRST_OTHER+4)
var X_KEYS_POSITION           = 550
var Y_KEYS_POSITION           = 0

var PLAYER_ITEM               = 1
var PLAYER_HAND               = 3

var PANEL_X_OFFSET            = (40 + (46 / 2))
var PANEL_Y_OFFSET            =  2

var PANEL_X_SIZE              = 29
var PANEL_X_SIZE_2            = (2*PANEL_X_SIZE+10)
var PANEL_Y_SIZE              = 40

var PANEL_DIFF                = 100
var PLAYER_MASK               = FIRST_OTHER+56

var SPRITE_MATOCK             = (FIRST_GLOBAL_LEVEL+6)

var ALIGN_LEFT                = 0
var ALIGN_RIGHT               = 1
var ALIGN_CENTER              = 2

var ANIM_EXIT                 = 6
var REV_EXIT                  = 8

var DOOR_VARIATION_CLASSIC    = 0
var DOOR_VARIATION_CYBER      = 1

var DOOR_FRAMES               = 10

// -------------------------------------------------------
// Animation flags
// -------------------------------------------------------

var ANIM_USED                 = 0x001 // animation change sprite position

var ANIM_MOVE                 = 0x002 // animation change sprite position
var ANIM_SPRITE               = 0x004 // animation change sprite

var ANIM_INSTANT              = 0x008 // run this animation imediately after create
var ANIM_LOOP                 = 0x010 // loop animation
var ANIM_ADD_INVERSE          = 0x020 // add inverted sprites to animation

var ANIM_REMOVE               = 0x100 // remove this animation from anim queue
                                      // in next anim process
var ANIM_GENERATE             = 0x200 // it's generated animation

var ANIM_TRIGGER_MOVE         = 0x1000
var ANIM_TRIGGER_ERASE        = 0x2000
var ANIM_TRIGGER_INSERT       = 0x4000

var NO_ROTATION               = (-1)

var ROTATION_UP               = 0
var ROTATION_RIGHT            = 1
var ROTATION_DOWN             = 2
var ROTATION_LEFT             = 3

var LAYER_FLOOR               = 0
var LAYER_LEVEL               = 1
var LAYER_PLAYER              = 2

// ------------------------------------------------------------------------
// GUI event types
// ------------------------------------------------------------------------

// Zero-event
var EV_NONE = 0

// Test-event
var EV_TEST = 1

// ------------------------------------------------------------------------
// GUI events

// user interface - block selected event (player move and so on)
// format: [GI_BLOCK_KEYS, key_group, blocked]
// key_group = key group to block
// blocked = true/false
var GI_BLOCK_KEYS = 2

// user interface - enable all groups
// format: [GI_UNBLOCK_ALL]
var GI_UNBLOCK_ALL = 3

// pressed key
// format: [GI_KEY_DOWN, asci code of key]
var GI_KEY_DOWN = 4

// Mouse was moved
// format: [GI_MOUSE_MOVE, x, y, button]
var GI_MOUSE_MOVE = 5

// a raw mouse event (it's generated by an input interface when
// MEVENT_MOUSE_EXTERNAL flag was set)
// format: [GI_MOUSE_EVENT, handle, x, y, state, button]
var GI_MOUSE_EVENT = 6

// Pick up one message from backtrace stack
// and run it
var GI_MENU_BACK_POP = 7

// Push one message to backtrace stack
// format: [GC_MENU_BACK_PUSH, function, param_1, param_2]
var GI_MENU_BACK_PUSH = 8

// Draw sprite
// format: [GC_SPRITE_DRAW, sprite_handle, x, y]
var GI_SPRITE_DRAW = 9

// Print string
// format: [GC_STRING_DRAW, font, x, y, x_aling, string]
var GI_STRING_DRAW = 10

// Switch and redraw the checkbox
// format: [GI_CHECKBOX_SWITCH, checkbox_id]
var GI_CHECKBOX_SWITCH = 11

// Launch an event for the previous menu and set the next event
// format: [GI_HIGHLIGHT_EVENT, group]
var GI_HIGHLIGHT_EVENT = 12 

// ------------------------------------------------------------------------
// Game control events

// play level
// format: [GC_RUN_LEVEL_SELECT, level_number, x, y]
var GC_RUN_LEVEL_SELECT = 13
  
// play level
// format: [GC_RUN_LEVEL_SET]
var GC_RUN_LEVEL_SET = 14

// play level
// format: [GC_RUN_LEVEL_LINE, level_name]
var GC_RUN_LEVEL_LINE = 15

// run editor
// format: [GC_RUN_EDITOR]
var GC_RUN_EDITOR = 16

// quit playing level
// format: [GC_STOP_LEVEL, cheat, menu]
var GC_STOP_LEVEL = 17

// play level with welcome screen
// format: [GC_MENU_RUN_LEVEL, level_set]  
var GC_MENU_RUN_LEVEL = 18

// end screen for a level
// format: [GC_MENU_END_LEVEL]
var GC_MENU_END_LEVEL = 19

// end screen for a custom level
// format: [GC_MENU_END_LEVEL_CUSTOM]
var GC_MENU_END_LEVEL_CUSTOM = 20

// end screen for whole episode
// format: [GC_MENU_END_LEVEL_SET, level_set]
var GC_MENU_END_LEVEL_SET = 21

// create a new profile with given name
// format: [GC_MENU_PROFILE_CREATE, profile_name]
var GC_MENU_PROFILE_CREATE = 22

// select from loaded profiles
// format: [GC_MENU_PROFILE_SELECT, profile_number]
var GC_MENU_PROFILE_SELECT = 23

// suspend/restore playing level
// format: [GC_SUSPEND_LEVEL/GC_RESTORE_LEVEL]
var GC_SUSPEND_LEVEL = 24
var GC_RESTORE_LEVEL = 25

// Restart current level
// format: [GC_RESTART_LEVEL]
var GC_RESTART_LEVEL = 26

// load/save level
// format: [GC_SAVE_LEVEL/GC_LOAD_LEVEL]
var GC_SAVE_LEVEL = 27
var GC_LOAD_LEVEL = 28

// messages in menu
// format: [message ID, page]
var GC_MENU_START = 29
var GC_MENU_NEW_GAME = 30
var GC_MENU_PROFILES = 31
var GC_MENU_SETTINGS = 32
var GC_MENU_SETTINGS_FULSCREEN_SWITCH = 33
var GC_MENU_SETTINGS_DOUBLESIZE_SWITCH = 34
var GC_MENU_SETTINGS_SOUND_SWITCH = 35
var GC_MENU_SETTINGS_MUSIC_SWITCH = 36
var GC_MENU_LEVEL_HINT = 37
var GC_MENU_HELP = 38
var GC_MENU_HELP_KEYS = 39
var GC_MENU_HELP_RULES = 40
var GC_MENU_HELP_CREDIT = 41
var GC_MENU_IN_GAME = 42
var GC_MENU_QUIT = 43
