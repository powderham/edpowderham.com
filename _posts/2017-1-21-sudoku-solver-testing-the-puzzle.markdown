---
layout: post
blog: true
title:  "Solving Sudoku: Testing the puzzle"
date:   2017-1-20 20:03:00 +0000
categories: jekyll update
author: ed
hidden: true
---

# Where we are now

So at this stage, I now believe that I can solve the puzzle. what remains is to test it. However, as expected with this project, I'm not quite done. I realise that to test this properly, I need:
- a way to quickly add a significant amount of numbers in to the grid at the start of the game
- a complete sudoku grid to check against
- a way to recursively add numbers, if a new number can be solved as a result of adding a previous number

# Quickly adding numbers

If you recall, my current method for adding a number to a square is by having a grid send a message to a specific tile, with a number to add in a specific reference like so:

```javascript

Grid.prototype.addNumberToTile = function (xGrid,yGrid, xTile, yTile, number) {
  var tile = this.retrieveTile(xGrid, yGrid)
  tile.addNumber(xTile, yTile, number)
};

Tile.prototype.addNumber = function (x,y,number) {
  if(this.existingNumbers().indexOf(number) === -1){
    this._index[x][y] = number
  } else {
    //do something to indicate unsuccessful - not error to keep programme running
  }
};
```

However, this is not a way to enter a lot of numbers at one time, such as at the start of a game. What is needed now is to remedy this by creating a new function.

As ever, starting with the tests:

```javascript
it("can add multiple numbers to a row", function(){
        grid.addRow(1,2,3,4,5,6,7,8,9)
        expect(grid.returnRowNumbers(0,0,0,0)).toEqual([1,2,3,4,5,6,7,8,9])
      })
```

And now the passing code. The addRow function below takes a grid and tile argument, used to define the row, and an array of values that are entered.
The function first sets up the input data and a count to be used later. Then it sets the required row of tiles from the grid argument. It then loops over each of the tiles, replacing the three indicies from a given row with the related numbers from the input array (driven by the count).

```javascript
Grid.prototype.addRow = function(grid,tile,[one,two,three,four,five,six,seven,eight,nine]){
  input = [[one,two,three],[four,five,six],[seven,eight,nine]]
  count = 0
  tiles = this._index[grid]
  for (var t in tiles){
    tiles[t]._index[tile] = input[count]
    count++;
  }
}
```

Now that we can add a single row, let's add functionality to allow us to add 9 rows at once at the start of a game.

Beginning with a simple test to ensure that numbers are added to each column correctly.

```javascript
it("can set up multiple rows at once", function(){
        grid.setup([
          [1,null,null,null,null,null,null,null,null],
          [2,null,null,null,null,null,null,null,null],
          [3,null,null,null,null,null,null,null,null],
          [null,null,null,4,null,null,null,null,null],
          [null,null,null,5,null,null,null,null,null],
          [null,null,null,6,null,null,null,null,null],
          [null,null,null,null,null,null,7,null,null],
          [null,null,null,null,null,null,8,null,null],
          [null,null,null,null,null,null,9,null,null]
        ])
        expect(grid.returnColumnNumbers(0,0,0,0)).toEqual([1,2,3,null,null,null,null,null,null])
        expect(grid.returnColumnNumbers(0,1,0,0)).toEqual([null,null,null,4,5,6,null,null,null])
        expect(grid.returnColumnNumbers(0,2,0,0)).toEqual([null,null,null,null,null,null,7,8,9])
      })
```

Passing code to loop through the grid and tile rows and enter any found numbers.

```javascript
Grid.prototype.setup = function (array) {
  c = 0
  for (g = 0; g <= 2; g++){
    for (t = 0; t <= 2; t++){
      subarray = array[c]
      this.addRow(g,t,subarray);
      c += 1;
    }
  }
};
```

# A complete sudoku grid to check against

Not very hard to find an incomplete and complete Sudoku online and put it in to the programme. I will be using the one below that I found with a quick Google search:
![Incomplete grid](http://elmo.sbs.arizona.edu/sandiway/sudoku/wildcatjan17p.gif)
![Complete grid](http://elmo.sbs.arizona.edu/sandiway/sudoku/wildcatjan17.gif)

So now to write the test to check that it can be completed with a single call of the solve function:

```javascript
grid.setup([
      [null,null,null,2,6,null,7,null,1],
      [6,8,null,null,7,null,null,9,null],
      [1,9,null,null,null,4,5,null,null],
      [8,2,null,1,null,null,null,4,null],
      [null,null,4,6,null,2,9,null,null],
      [null,5,null,null,null,3,null,2,8],
      [null,null,9,3,null,null,null,7,4],
      [null,4,null,null,5,null,null,3,6],
      [7,null,3,null,1,8,null,null,null]
    ])
    grid.solve()
    expect(grid.isComplete()).toEqual(true)
```

Here I am writing the test to determine whether or not a tile contains the strictly the numbers 1 to 9. This uses a secondary function below that allows for array comparison of sorted rows that is not possible is javascript simply by using ```===``` to check for equivalence.  

```javascript
Grid.prototype.containsOneToNine = function (array) {
  complete = [1,2,3,4,5,6,7,8,9]
  current = []
  for (var index in array){
    current.push(array[index])
  }
  if (this.equalArrays(current, complete)){
    return true
  } else {
    return false
  }
};

Grid.prototype.equalArrays = function (a1, a2) {
  a1 = a1.sort()
  a2 = a2.sort()
  return (a1.length==a2.length && a1.every(function(v,i) { return v === a2[i]}))
};
```

Once we have the ability to check for a single tile, we need to be able to run that check on each individual tile. The below function cycles through each tile and applies the above containsOneToNine method. No doubt requires refactoring, off of the top of my head this could be refactored by:
- Moving the nested 'for in' loops to their own function - this function currently does not have a single responsibility
- Running additional checks on rows and columns for inconsistencies - although this is implemented in the solve method, it couldn't hurt to get a second pass at it

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

# Recursively solving the game

Now we need to have the solve method call itself, so that in the event of the entry of one number revealing another number that can be solved, the programme will input the new number, and so on.

So what we need to do is add a condition to the bottom of the solve method to understand whether:
- 0 numbers were input - at this point will will stop the solve function to avoid being stuck in an infinite loop
- 1 or more numbers were input, but not all - at this point we will call the function again to see if any more numbers can be solved
- the rest of the numbers were input - at this point we can return that the grid is complete

```javascript
Grid.prototype.solve = function () {
  count = 0
  for (i = 0; i <= 2; i++){
    for (j = 0; j<=2; j++){
      for(v = 0; v<=2; v++){
        for(w = 0; w<=2; w++){
          count += this.inputSolve([i],[j],[v],[w])
        }
      }
    }
  }
  if (count == 0){
    return false
  } else if (this.isComplete() == true) {
    return true
  } else {
    this.solve()
  }
};
```

This uses a new variable called count, which requires updating if a number is input, so we need to add a return value to the inputSolve function:

```javascript
Grid.prototype.inputSolve = function (xGrid, yGrid, xTile, yTile) {
  availableNumbersList = this.availableNumbers(xGrid, yGrid, xTile, yTile)
  if (availableNumbersList.length == 1 && this.retrieveTile(xGrid,yGrid)._index[xTile][yTile] == null){
    this.addNumberToTile(xGrid, yGrid, xTile, yTile, availableNumbersList[0])
    return 1
  } else {
    return 0
  }
};
```

The above test is now passing, meaning that we have solved the grid. I will do another blog post on refactoring this at another point.
