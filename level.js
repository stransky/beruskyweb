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

var H_LEVEL    = "Level 3 (C) Anakreon 1999"
var LEVEL_SIZE = 28361

/* Level structure (packed)

char signum[30];               // -> "Berusky (C) Anakreon 1998"
char back;                     // -> background number
char music;                    // -> track number
char rot[5];                   // -> players rotation
char rezerved[100];            // -> reserved
word floor[LEVEL_CELLS_Y][LEVEL_CELLS_X][10];  //-> floor cells
word level[LEVEL_CELLS_Y][LEVEL_CELLS_X][10];  //-> level items
word players[LEVEL_CELLS_Y][LEVEL_CELLS_X];    //-> players

*/

function Level() {
  this.rezerved = 0;
}

// Load binary level data from original lv3 files
// use the Blob interface
Level.prototype.load = function(file) {
  var data = new Uint8Array(load_file_binary(file));

  // Check level size and signature
  if(data.length != LEVEL_SIZE)
    return(false);
  
  for(var i = 0; i < H_LEVEL.length; i++) {
    if(data[i] != H_LEVEL[i])
      return(false);
  }

  this.background = data[30];
  this.music = data[31];
  
  this.rotation = Array();
  for(var i = 0; i < 5; i++) {
    this.rotation[i] = data[32+i];
  }
  
  return(true);
}
