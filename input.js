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
var input_object;
var MOVE_NONE = 0;

function Input(game)
{
  this.bug_movement = MOVE_NONE;
  this.game = game;
  input_object = this;
  
  document.onkeydown = handleKeyDown;
  document.onkeyup = handleKeyUp;
}

Input.prototype.key_input = function(event)
{
  switch(event.keyCode) {
    case KeyEvent.DOM_VK_UP:
      this.bug_movement = MOVE_UP;
      break;
    case KeyEvent.DOM_VK_DOWN:
      this.bug_movement = MOVE_DOWN;
      break;
    case KeyEvent.DOM_VK_RIGHT:
      this.bug_movement = MOVE_RIGHT;
      break;
    case KeyEvent.DOM_VK_LEFT:
      this.bug_movement = MOVE_LEFT;
      break;
  }
  this.game.bug_move(this.bug_movement);
}

function handleKeyDown(event)
{
  input_object.key_input(event);
}

function handleKeyUp(event)
{
    
}
