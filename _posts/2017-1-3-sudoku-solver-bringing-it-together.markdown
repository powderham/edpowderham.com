---
layout: post
blog: true
title:  "Solving Sudoku: Bringing the game together (Part I)"
date:   2017-1-3 21:46:00 +0000
categories: jekyll update
author: ed
hidden: true
---

# Recap

A quick recap for where we are at present:
- We have created a tile, which is a 3x3 grid of indicies
- We have created a grid, which is a 3x3 grid of tiles
- For any given index in a tile, we can return the existing numbers in that tile
- For any given index, we can return the existing numbers in that row/column

So, we _should_ now be in a position where for any given index, we know what possible numbers can be input in to that index. The next step then will be writing the tests to work out which indicies can only have one number in them (due to there only being one possible number to be input) recursively to solve the game.

## Writing the tests


Below I am writing two initial test:
- The first test expects all numbers to be available when no numbers have been input.
- The second test adds a number to the tested index' tile, column and row, and then expects those numbers to be unavailable

```javascript
describe("Gameplay grid", function(){
  it("can return possible numbers for input in a square", function(){
    grid.addNumberToTile(0,0,0,0,1)
    grid.addNumberToTile(1,0,1,1,2)
    grid.addNumberToTile(0,1,1,1,3)
    grid.availableNumbers(0,0,1,1).toEqual([4,5,6,7,8,9])
  })
})
```

Naturally at this stage the following error message is received:
```
TypeError: grid.availableNumbers is not a function
```

So let's get to writing the function!

The below is a work in progress and requires refactoring, the overall with the function is the following:
- Indicate all numbers there can possibly be in an index (1-9)
- Push unique numbers from the Row, Column and Tile to an array of current numbers
- Compare the current numbers and all numbers to return possible numbers


```javascript
Grid.prototype.availableNumbers = function (xGrid, yGrid, xTile, yTile) {
  var allNumbers = [1,2,3,4,5,6,7,8,9]
  var currentNumbers = []
  var workingNumbers = []
  workingNumbers = this.returnRowNumbers(xGrid, yGrid, xTile, yTile)
  for (var number in workingNumbers){
    if(currentNumbers.indexOf(workingNumbers[number]) === -1){
      currentNumbers.push(workingNumbers[number])
      console.log(workingNumbers[number])
    }
  }
  workingNumbers = this.returnColumnNumbers(xGrid, yGrid, xTile, yTile)
  for (var number in workingNumbers){
    if(currentNumbers.indexOf(workingNumbers[number]) === -1){
      currentNumbers.push(workingNumbers[number])
      console.log(workingNumbers[number])
    }
  }
  console.log(this.retrieveTile(xGrid, yGrid).existingNumbers())
  workingNumbers = this.retrieveTile(xGrid, yGrid).existingNumbers()
  for (var number in workingNumbers){
    if(currentNumbers.indexOf(workingNumbers[number]) === -1){
      currentNumbers.push(workingNumbers[number])
    }
  }
  console.log(currentNumbers)
};
```
The reason why I have left the console.log functions in place is because I have got an unexpected result. I have got the number 1 twice, once for my tile retreival and once for my column retrieval:

```
3 <- row
1 <- column
[1] <- tile
[null, 3, 1] <- currentNumbers
```

Initially, I have three avenues for exploration here:
- I entered the number in to the wrong index
- My function to pull the column is wrong
- I am searching in the wrong index

What would be helpful for debugging here is to have a visual display of how the grid looks, so I will pause 'bringing it together' where we currently are, to write a function to visually print the grid.
