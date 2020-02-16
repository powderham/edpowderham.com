---
layout: post
blog: true
title:  "Solving Sudoku: Further development"
date:   2017-1-1 14:50:13 +0000
categories: jekyll update
author: ed
hidden: true
---

# Further Development


In the last post, the following work was implemented:
- A tile was defined as a 3x3 gird
- A number could be implemented to a given index
What remains now is to add the existingNumbers function/test to determine to determine whether or not a number can be added.

Adding the existingNumbers test.

```javascript
it("should be able to return existing values", function(){
    expect(tile.existingNumbers()).toEqual([])
    tile.addNumber(0,0,1)
    expect(tile.existingNumbers()).toEqual([1])
  })
```

In order to pass this test, it is necessary to flatten the array of arrays above so I implemented the below code.
```javascript
Tile.prototype.existingNumbers = function (){
  return [].concat.apply([],this._index)
}
```
This array left me with the below error, due to the placeholder 'null' values.
```javascript
Expected [ null, null, null, null, null, null, null, null, null ] to equal [  ]
```

There is a decision here as to whether or not to remove all of the null values, all-but-one of the null values or none of the null values. Given that I am intending on using the return value of existingNumbers to ascertain whether or not a specific new number can be added, I will (for now) remove all null values given that a user wont be adding a null value.

Below is my code for passing the two tests. At a high level, the following is happening:
- A method called flattenIndex has been created to return an array of all numbers in the tile
- A method called removeNulls is called, unsurprisingly, the remove the Nulls from that array
- The filtered array is returned

```javascript
Tile.prototype.existingNumbers = function () {
  var array = this.flattenIndex()
  array = this.removeNulls(array)
  return array
};

Tile.prototype.flattenIndex = function (){
  return [].concat.apply([],this._index)
};

Tile.prototype.removeNulls = function (array) {
  var returnArray = []
  for (var num in array) {
    if (array[num] != null && returnArray.indexOf(array[num]) === -1){
      returnArray.push(array[num])
    }
  }
  return returnArray
};
```

The existingNumbers method is a bit messy so I've refactored it:

```javascript
Tile.prototype.existingNumbers = function () {
  return this.removeNulls(this.flattenIndex())
};
```

The next step is to define the rule that no number can be repeated in any given tile. So if a number already exists in a position, it cannot be a valid entry for any other position. Below I write the tests to determine available numbers.

```javascript
it("should not allow an existing number to be added again", function(){
  tile.addNumber(0,0,1);
  tile.addNumber(0,1,1);
  expect(tile.row(0)[1]).not.toEqual(1)
})
```

The below code is the simple if statement that I set up to stop a number being input if it is already existing in the same tile:

```javascript
Tile.prototype.addNumber = function (x,y,number) {
  if(this.existingNumbers().indexOf(number) === -1){
    this._index[x][y] = number
  } else {
    //do something to indicate unsuccessful - not error to keep programme running
  }
};
```

We are now in a position where a tile is definable, can be edited and contains the rules for a tile that are contained to only one tile. For the next post we will move on to create the 3x3 grid of tiles and then add the logic to interact with all of them at once.
