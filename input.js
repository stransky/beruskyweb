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

/*
  Game input handler
*/
var BUG_MOVE_UP     = KeyEvent.DOM_VK_UP
var BUG_MOVE_DOWN   = KeyEvent.DOM_VK_DOWN
var BUG_MOVE_RIGHT  = KeyEvent.DOM_VK_RIGHT
var BUG_MOVE_LEFT   = KeyEvent.DOM_VK_LEFT
var BUG_SWITCH      = KeyEvent.DOM_VK_SPACE

var BUG_SELECT_1    = KeyEvent.DOM_VK_1
var BUG_SELECT_2    = KeyEvent.DOM_VK_2
var BUG_SELECT_3    = KeyEvent.DOM_VK_3
var BUG_SELECT_4    = KeyEvent.DOM_VK_4
var BUG_SELECT_5    = KeyEvent.DOM_VK_5
var BUG_SELECT_NEXT = (-1)

var input_object;

function Input()
{
  this.key = Array(); // Array of keycodes
  input_object = this;
  
  document.onkeydown = handleKeyDown;
  document.onkeyup = handleKeyUp;
}

Input.prototype.key_get = function(keyCode, clear)
{
  var ret = (this.key[keyCode] != undefined && this.key[keyCode]);
  if(ret && (clear || 0)) {
    this.key[keyCode] = false;
  }
  return ret;
}

function handleKeyDown(event)
{
  input_object.key[event.keyCode] = true;
}

function handleKeyUp(event)
{
  input_object.key[event.keyCode] = false;   
}
