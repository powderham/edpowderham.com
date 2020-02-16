---
layout: post
blog: true
title:  "Solving Sudoku: Refactoring"
date:   2017-1-23 20:03:00 +0000
categories: jekyll update
author: ed
hidden: true
---

# Refactoring

Being able to now complete a Sudoku grid, and passing basic tests, it is time to refactor the code to make it more efficient and manageable. I will from this point go through to code looking to apply the [solid principles](https://en.wikipedia.org/wiki/SOLID_(object-oriented_design)).

# Single Responsibility

Look at the below code for the grid. As was seen in the previous blog post, the intention of this was to check if an individual tile contains the numbers 1 to 9. The problem here is twofold, first the isComplete method is doing two things:
- Checking whether every tile contains 1 - 9
- Returning whether or not each tile does contain 1 - 9

In order to give this method a single responsibility, we can refactor the containsOneToNine.

```javascript
Grid.prototype.isComplete = function () {
  count = 0
  for (var row in this._index){
    for (var tile in this._index[row]){
      if (this.containsOneToNine(this._index[row][tile].existingNumbers()) == true){
        count += 1;
      }
    }
  }
  if (count == 9){
    return true
  } else {
    return false
  }
};
```

The below refactoring has been done:
- Moving the functionality to tiles
- We know exactly what the tile is doing without having to look at it
- The code is now inverted with the "!" to return false if one tile fails, since we then know that the entire grid cannot be complete
- Removed a conditional statement that is no longer required if we check for 1 non-complete tile rather than 9 completes ones
- The equalArrays method is moved across to the tile object

```javascript
Grid.prototype.isComplete = function () {
  count = 0
  for (var row in this._index){
    for (var tile in this._index[row]){
      if (!this._index[row][tile].isComplete()){
        return false
      }
    }
  }
  return true
};

Tile.prototype.isComplete = function () {
  complete = [1,2,3,4,5,6,7,8,9]
  current = this.existingNumbers()
  if (this.equalArrays(current, complete)){
    return true
  } else {
    return false
  }
};

Tile.prototype.equalArrays = function (a1, a2) {
  a1 = a1.sort()
  a2 = a2.sort()
  return (a1.length==a2.length && a1.every(function(v,i) { return v === a2[i]}))
};
```

# Removing Magic Numbers

A few times in the code, there are checks in place to look for some/all of the numbers in 1 - 9. Given the fact that the numbers belonging to a tile or grid is a part of the game, it makes sense to make them a constant in the object. This has the following benefits:
- Not having a 'magic number' in the code that the user does not know where it comes from
- Not having to repeat the array, leaving room for error,  but instead directly referencing the constant

Implementing the constant:

```javascript
function Grid() {
  this._index = [
      [new Tile(),new Tile(),new Tile()],
      [new Tile(),new Tile(),new Tile()],
      [new Tile(),new Tile(),new Tile()]
    ]
  this.ONETONINE = [1,2,3,4,5,6,7,8,9]
};

function Tile() {
  this._index = [[null,null,null],[null,null,null],[null,null,null]]
  this.ONETONINE = [1,2,3,4,5,6,7,8,9]
}
```

Example of a new reference to this constant:

```javascript
Tile.prototype.isComplete = function () {
  complete = this.ONETONINE
  current = this.existingNumbers()
  if (this.equalArrays(current, complete)){
    return true
  } else {
    return false
  }
};
```
