---
layout: post
blog: true
title:  "Solving Sudoku: Grid development"
date:   2017-1-2 12:20:54 +0000
categories: jekyll update
author: ed
hidden: true
---

# Grid Development

So now we have functioning tiles, we need to make the sudoku grid consisting of 3x3 such tiles.

```javascript
function Grid() {
  this._index = [
      [new Tile(),new Tile(),new Tile()],
      [new Tile(),new Tile(),new Tile()],
      [new Tile(),new Tile(),new Tile()]
    ]
};
```

The next step is to check that we can add numbers to each of the tiles through the grid. The purpose of the grid is to hold the tiles and understand the position of each tile in relation to the others, rather than adding the numbers to the tiles themselves. Therefore, the function for adding numbers in the grid will be to send a message to the tile, telling it to add a number to itself, rather than adding the number directly.

Below I have added a test to add the number 1 to the top left index of the top left tile of the grid. It already looks as though some refactoring will be required to make this clearer. This test requires that two new methods  be created to pass: addNumber and retrieveTile.

```javascript
it("can tell a tile to add a number to itself", function(){
  grid.addNumberToTile(0,0,0,0,1)
  expect(grid.retrieveTile(0,0)._index[0][0]).toEqual(1)
})
```

The two methods to pass this test are below. The first retrieveTile takes coordinates (passed to it by the second function) to return a specific tile. addNumberToTile takes 5 arguments, two for coordinates in the grid to pass to retrieve tile, and then two coordinates for where to put the number and the number itself.

```javascript
Grid.prototype.retrieveTile = function (x,y) {
  return this._index[x][y]
};

Grid.prototype.addNumberToTile = function (xGrid, yGrid, xTile, yTile, number) {
  var tile = this.retrieveTile(xGrid, yGrid)
  tile.addNumber(xTile, yTile, number)
};
```

# The interplay between tiles

Earlier I mentioned that the grid should be aware of the individual tiles and the interplay between them. To that end, the grid must be able to determine all of the available numbers for a given row or column.

Below are the tests adding a number to each index of a column/row and then testing it.

```javascript
it("can return all numbers in the same column", function(){
  grid.addNumberToTile(0,0,0,0,1)
  grid.addNumberToTile(0,0,1,0,2)
  grid.addNumberToTile(0,0,2,0,3)
  grid.addNumberToTile(1,0,0,0,4)
  grid.addNumberToTile(1,0,1,0,5)
  grid.addNumberToTile(1,0,2,0,6)
  grid.addNumberToTile(2,0,0,0,7)
  grid.addNumberToTile(2,0,1,0,8)
  grid.addNumberToTile(2,0,2,0,9)
  expect(grid.returnColumnNumbers(0,0,0,0)).toEqual([1,2,3,4,5,6,7,8,9])
})

it("can return all numbers in the same row", function(){
  grid.addNumberToTile(0,0,0,0,1)
  grid.addNumberToTile(0,0,0,1,2)
  grid.addNumberToTile(0,0,0,2,3)
  grid.addNumberToTile(0,1,0,0,4)
  grid.addNumberToTile(0,1,0,1,5)
  grid.addNumberToTile(0,1,0,2,6)
  grid.addNumberToTile(0,2,0,0,7)
  grid.addNumberToTile(0,2,0,1,8)
  grid.addNumberToTile(0,2,0,2,9)
  expect(grid.returnRowNumbers(0,0,0,0)).toEqual([1,2,3,4,5,6,7,8,9])
})
```

Below is the code to pass the tests, I will explain each in detail since I don't think it is self evident what they do.


returnColumnNumbers takes 4 arguments, the first two are the co-ordinates for the tile in question that we want to take the column from, the second two the index within the tile that we want to take the column from. Following this, for each row in .\_index, it takes the tile in the position dictated by the xGrid argument (so it is equal to the position of the tile we are looking at). Then for each of the rows of indicies in the tile, the index in the desired column is pushed to the return array.

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


returnRowNumbers, like the previous method, takes 4 arguments, the first two are the co-ordinates for the tile in question that we want to take the column from, the second two the index within the tile that we want to take the column from. It then selects a row of tiles from the index, and for each tile in that row, pushes each index from the row of the tile specified by xTile.

```javascript
Grid.prototype.returnRowNumbers = function (xGrid, yGrid, xTile, yTile) {
  var array = []
  var row = this._index[yGrid]
  for (var gridRow in row){
    var tile = this._index[yGrid][gridRow]
    for (var index in tile._index[xTile]){
      array.push(tile._index[xTile][index])
    }
  }
  return array
};
```
