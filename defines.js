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
