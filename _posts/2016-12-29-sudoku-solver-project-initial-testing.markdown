---
layout: post
blog: true
title:  "Solving Sudoku: Initial testing"
date:   2016-12-29 16:19:54 +0000
categories: jekyll update
author: ed
hidden: true
---

# Initial thoughts

Having given the project some initial thought, it seems intuitive to split the sudoku grid as below in to 9 separate tiles of 3x3 which will eventually make up the larger grid, themselves 3x3. I will be able to handle the basic mechanics of a tile (specifying dimensions and rules) before dealing with the interplay between tiles.

![](http://www.sudoku.4thewww.com/Grids/grid.jpg)

So the next task is to model a single tile, and the rules for each tile:
- Each tile should have space for 9 numbers (1-9).
- The spaces in the tile should be arranged in a 3x3 grid.
- When complete, each space should contain every number (1-9) without repeating.

Dealing with the first two rules simultaneously, I have written a test to determine whether the tile contains three rows (regardless of what they contain) and a test to determine whether the tile is initialised with 3 null entries

```javascript
describe("Tile", function() {
  var tile;

  beforeEach(function() {
      var tile = new Tile();
    });

    it("should contain 3 individual rows", function(){
      expect(tile.row0()).toBeTruthy()
      expect(tile.row1()).toBeTruthy()
      expect(tile.row2()).toBeTruthy()
    })

    it("should contain 3 individual rows with three data points", function(){
      expect(tile.row0()).toEqual([null,null,null])
      expect(tile.row1()).toEqual([null,null,null])
      expect(tile.row2()).toEqual([null,null,null])
  })

});
```

Of course having not create a Tile object, these tests will all fail and as such the Tile requires defining.


Below I define the basic outline of the tile. The tile has three variables, each of which is an array allow for 3 numbers to be entered. This thereby fulfills the first two conditions set out for myself.


```javascript
function Tile() {
  this._row0 = [null,null,null]
  this._row1 = [null,null,null]
  this._row2 = [null,null,null]
}


Tile.prototype.row0 = function() {
  return this._row0
};

Tile.prototype.row1 = function() {
  return this._row1
};

Tile.prototype.row2 = function() {
  return this._row2
};
```

I have prefixed the three rows with an underscore, following convention, to indentify that these variables should not be modified directly. These variables will be modified using the methods soon to be defined:

Writing the test for adding numbers:
```javascript
it("should allow numbers to be input in to the tile", function(){
  tile.addNumber(0,0,1)
  expect(tile.row1()[0]).toEqual(1)
})
```
Here I am writing a function 'addNumber' which takes three arguments:
- x-coordinate
- y-coordinate
- number to be input
The expectation then references the first index in the first row and expects it to equal one.

Of course these tests will fail without defining the functions in our tile object so let's do that now.

I have just come across what I believe was a design issue earlier on in this blog post. In attempting to use the coordinates passed to the addNumber function in the test, I was trying to access a variable dynamically using the eval() function as per below.

```javascript
Tile.prototype.addNumber = function (x,y,number) {
  eval("this._row"+x) // Some more code would go here
};
```
As soon as I hardcoded 'this.\_row' as a string, I sensed that the code could be better. For now, I am going to change the rows to an array of arrays to make the accessing of such rows easier.

So where we are now is:

```javascript
function Tile() {
  this._index = [[null,null,null],[null,null,null],[null,null,null]]
}


Tile.prototype.row = function (x) {
  return this._index[x]
};


Tile.prototype.addNumber = function (x,y,number) {
  this._index[x][y] = number
};
```

This code is already much neater than the previous code for the following reasons:
- Row is now one function instead of three (I have a suspicion I may eventually remove this function altogether - in an isolated tile, what use is knowing the three values that make up a row?)
- addNumber now takes two parameters to directly target the required square I want to put a number in.

I have updated the tests below accordingly too:

```javascript
describe("Tile", function() {
  var tile;

  beforeEach(function() {
      tile = new Tile();
    });

  it("should contain 3 individual rows", function(){
    expect(tile.row(0)).toBeTruthy()
    expect(tile.row(1)).toBeTruthy()
    expect(tile.row(2)).toBeTruthy()
  })

  it("should contain 3 individual rows with three data points", function(){
    expect(tile.row(0)).toEqual([null,null,null])
    expect(tile.row(1)).toEqual([null,null,null])
    expect(tile.row(2)).toEqual([null,null,null])
})

  it("should allow numbers to be input in to the tile", function(){
    tile.addNumber(0,0,1)
    expect(tile.row(0)[0]).toEqual(1)
  })
});
```

In writing this blog post I have caught myself out for writing my code before my tests - slap on the wrist for me!
