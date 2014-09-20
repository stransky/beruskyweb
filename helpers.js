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

/* Load helpers
*/
function load_file_text(file, callback, callback_object) {
  var request = new XMLHttpRequest();
  request.open('GET', file);
  request.onload = callback;
  request.callback_object = callback_object;
  request.send();
}

function load_file_binary(file, callback, callback_object) {
  var request = new XMLHttpRequest();
  request.open('GET', file);
  request.responseType = "arraybuffer";
  request.onload = callback;
  request.callback_object = callback_object;
  request.send();
}

function is_number(value) {
  return !isNaN(parseInt(value, 10));
}

/* Event helpers
*/
function BeruskyEvents() {
  var listener = false;
}

BeruskyEvents.prototype.event_listener = function(e) {
  var events = e.detail.events;
  if(events.listener) {
    events.listener.callback(e.detail.data);
  }
}

BeruskyEvents.prototype.listener_add = function(listener) {  
  if(!this.listener) {
    // Listen for the event.
    this.listener = listener;
    document.addEventListener('berusky', this.event_listener);
  }
}

BeruskyEvents.prototype.send = function(data) {
  var event = new CustomEvent('berusky', { "detail" : { "events" : this, "data" : data }} );
  document.dispatchEvent(event);
}
