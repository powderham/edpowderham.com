---
layout: post
blog: true
title:  "Solving Sudoku: Bringing the game together (Part II)"
date:   2017-1-16 14:03:00 +0000
categories: jekyll update
author: ed
hidden: true
---

# Recap

When I paused part I of 'Bringing the game together' I had a bug that I needed to fix. The bug was that I was receiving the same number (1) in two of my rows, both for the grid and for the column. Clearly from the screenshot of the grid below we can see that the number 1 only appears in one row.

![Grid](http://imgur.com/a/q9B6Z.png)

# Finding the bug

Given that I now have full faith in my grid being correct, and that my return column function is working perfectly for my unit test for that, I have to ask myself why is the return column function that is being called inside my available numbers function not working. As per the previous blog post, it was returning the first column, not the second column.
My unit test was adding numbers to the first column too, coincidentally (or perhaps not, due to some subconscious reason for putting everything in the first column. This gave me a clue that my return column function was not changing for the input variables that I was giving it.

Below is how it originally looked

```javascript
Grid.prototype.returnColumnNumbers = function (xGrid, yGrid, xTile, yTile) {
var array = []
for (var gridRow in this._index ){
  var tile = this._index[gridRow][xGrid]
  for (var tileRow in tile._index){
    array.push(tile._index[tileRow][yGrid])
  }
}
return array
};
```

and this is how it looks now.

```javascript
Grid.prototype.returnColumnNumbers = function (xGrid, yGrid, xTile, yTile) {
  var array = []
  for (var gridRow in this._index ){
    var tile = this._index[gridRow][xGrid]
    for (var tileRow in tile._index){
      array.push(tile._index[tileRow][yTile])
    }
  }
  return array
};
```
Clearly a very subtle change, but it transpired that the problem was that I was looking to the column for the grid, not the tile to push results. Since both of my tests were being operated in the same tile (0) it was difficult to pick up on this subtlety just through the code alone. There is a lesson here in making my tests more robust, checking multiple columns across multiple tiles.

# Continuing with the game

Following on from the bug, I have now written the code to pass the test written in the previous post

```javascript
Grid.prototype.availableNumbers = function (xGrid, yGrid, xTile, yTile) {
  var allNumbers = [1,2,3,4,5,6,7,8,9]
  var currentNumbers = []
  var workingNumbers = []


  workingNumbers = this.returnRowNumbers(xGrid, yGrid, xTile, yTile)
  for (var number in workingNumbers){
    if(currentNumbers.indexOf(workingNumbers[number]) === -1){
      currentNumbers.push(workingNumbers[number])
    }
  }
  workingNumbers = this.returnColumnNumbers(xGrid, yGrid, xTile, yTile)
  for (var number in workingNumbers){
    if(currentNumbers.indexOf(workingNumbers[number]) === -1){
      currentNumbers.push(workingNumbers[number])
    }
  }
  workingNumbers = this.retrieveTile(xGrid, yGrid).existingNumbers()
  for (var number in workingNumbers){
    if(currentNumbers.indexOf(workingNumbers[number]) === -1){
      currentNumbers.push(workingNumbers[number])
    }
  }

  for (var i in currentNumbers){
    index = allNumbers.indexOf(currentNumbers[i])
    if (index > -1){
      allNumbers.splice(index, 1)
    }
  }
  return allNumbers
};
```

So now, for any given square, we know which are the available numbers to be placed in it. What we now need then is an algorithm that will add numbers to squares where only one is available.

Below is the first test which looks to fill a simple case of one number missing from a tile

```javascript
it("can input numbers where only one is available", function() {
    grid.addNumberToTile(0,0,0,0,1)
    grid.addNumberToTile(0,0,0,1,2)
    grid.addNumberToTile(0,0,0,2,3)
    grid.addNumberToTile(0,0,1,0,4)
    grid.addNumberToTile(0,0,1,1,5)
    grid.addNumberToTile(0,0,1,2,6)
    grid.addNumberToTile(0,0,2,0,7)
    grid.addNumberToTile(0,0,2,1,8)
    grid.print()
    grid.solve()
    expect(grid._index[0][0][2][2]).toEqual(9)
  })
```

So the firs thing that I need is something to traverse across the board and give me every coordiante. This was made slightly harder by the fact that I have a grid containing an array of tiles, which in turn contain arrays of indicies and numbers. This was achieved with 4 nested if statements (someone shout if there's a more efficient way!). For each of the indicies, it then calls the input function. The input function calls the availableNumbers function which in turn checks if there is only one available number. If there is only one available number then this is input in to the index and the algorithm moves on.

```javascript
Grid.prototype.solve = function () {
  for (i = 0; i <= 2; i++){
    for (j = 0; j<=2; j++){
      for(v = 0; v<=2; v++){
        for(w = 0; w<=2; w++){
          this.input([i],[j],[v],[w])
        }
      }
    }
  }
}

Grid.prototype.input = function (xGrid, yGrid, xTile, yTile) {
  availableNumbersList = this.availableNumbers(xGrid, yGrid, xTile, yTile)
  if (availableNumbersList.length == 1 && this.retrieveTile(xGrid,yGrid)._index[xTile][yTile] == null){
    this.addNumberToTile(xGrid, yGrid, xTile, yTile, availableNumbersList[0])
  }
};
```

Below I am adding the tests for a tile, column and a row that need filling at the same time. Note the use of ```grid.print()``` to check what I was doing.

```javascript

it("can input numbers where only one is available", function() {
  //adding 8 numbers to the tile
      grid.addNumberToTile(0,0,0,0,1)
      grid.addNumberToTile(0,0,0,1,2)
      grid.addNumberToTile(0,0,0,2,3)
      grid.addNumberToTile(0,0,1,0,4)
      grid.addNumberToTile(0,0,1,1,5)
      grid.addNumberToTile(0,0,1,2,6)
      grid.addNumberToTile(0,0,2,0,7)
      grid.addNumberToTile(0,0,2,1,8)
      grid.print()
      //adding the rest of the top row
      grid.addNumberToTile(0,1,0,0,4)
      grid.addNumberToTile(0,1,0,1,5)
      grid.addNumberToTile(0,1,0,2,6)
      grid.addNumberToTile(0,2,0,0,7)
      grid.addNumberToTile(0,2,0,1,8)
      grid.print()
      //adding the rest of the column
      grid.addNumberToTile(1,0,0,0,2)
      grid.addNumberToTile(1,0,1,0,5)
      grid.addNumberToTile(1,0,2,0,6)
      grid.addNumberToTile(2,0,0,0,3)
      grid.addNumberToTile(2,0,1,0,8)
      grid.print()
      grid.solve()
      grid.print()
      expect(grid.retrieveTile(0,0)._index[2][2]).toEqual(9)
      expect(grid.retrieveTile(0,2)._index[0][2]).toEqual(9)
      expect(grid.retrieveTile(2,0)._index[2][0]).toEqual(9)
})
```

Since this works we can now theoretically solve any sudoku - time to test it!
