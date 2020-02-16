---
layout: post
blog: true
title:  "Solving Sudoku: Printing the grid"
date:   2017-1-12 14:23:00 +0000
categories: jekyll update
author: ed
hidden: true
---

# Recap

In the last post, I needed to debug my grid and was not able to easily tell where I had placed numbers easily just by looking at the code. It occurred to me that it would become useful to have a visual representation of my grid, one to see a completed sudoku and, as I have now realised, for debugging. This post will cover the process of drawing the grid.

# Setting up a blank grid

I used unicode characters to create a two-thickness grid to identify tiles from the larger grid.

{% gist powderham/9f6871b99b47c5d5f991971c24ed9289 %}

 [here](https://gist.github.com/powderham/9f6871b99b47c5d5f991971c24ed9289) - I have not included the grid raw because it does not format correctly in markdown, although does print correctly in the console.

# Printing in to the grid

What you are about to see below is an extremely rough version of printing a grid, that requires some serious refactoring. I am showing it in this state to talk through some of the thought behind it and how I arrived there.
- Originally I was trying to print directly from the grid itself, having code like ```this._index[0][0][0][1] + | + this._index[0][0][0][1]```. Clearly this was going to get very confusing and extremely long to write out. Fortunately I hit a technical block before writing all 81 permutations in that I could not interpolate more than 7 strings and the 7 related unicode characters using this method
- I then decided to reuse the code to pull a specific row, and gave that to the printing function 9 times for each row.
- A small algorithm exists to change nulls for white space, which was originally a problem, given that i was printing ```null``` instead of ``` ```.

```javascript
Grid.prototype.print = function (array) {
  for (var number in array){
    if(array[number] === null){
      array[number] = " "
    }
  }

  console.log("┏━━━┳━━━┳━━━┳━━━┳━━━┳━━━┳━━━┳━━━┳━━━┓")
  console.log("┃ "+array[0]+" │ "+array[1]+" │ "+array[2]+" ┃ "+array[3]+" │ "+array[4]+" │ "+array[5]+" ┃ "+array[6]+" │ "+array[7]+" │ "+array[8]+" ┃")
  console.log("┣───┼───┼───┃───┼───┼───┃───┼───┼───┫")

  array = this.returnRowNumbers(0,0,1,0)
    for (var number in array){
      if(array[number] === null){
        array[number] = " "
      }
    }

  console.log("┃ "+array[0]+" │ "+array[1]+" │ "+array[2]+" ┃ "+array[3]+" │ "+array[4]+" │ "+array[5]+" ┃ "+array[6]+" │ "+array[7]+" │ "+array[8]+" ┃")
  console.log("┣───┼───┼───┃───┼───┼───┃───┼───┼───┫")

  array = this.returnRowNumbers(0,0,2,0)
    for (var number in array){
      if(array[number] === null){
        array[number] = " "
      }
    }
  console.log("┃ "+array[0]+" │ "+array[1]+" │ "+array[2]+" ┃ "+array[3]+" │ "+array[4]+" │ "+array[5]+" ┃ "+array[6]+" │ "+array[7]+" │ "+array[8]+" ┃")
  console.log("┣━━━╋━━━╋━━━╋━━━╋━━━╋━━━╋━━━╋━━━╋━━━┫")

  array = this.returnRowNumbers(0,1,0,0)
    for (var number in array){
      if(array[number] === null){
        array[number] = " "
      }
    }

    console.log("┃ "+array[0]+" │ "+array[1]+" │ "+array[2]+" ┃ "+array[3]+" │ "+array[4]+" │ "+array[5]+" ┃ "+array[6]+" │ "+array[7]+" │ "+array[8]+" ┃")
  console.log("┣───┼───┼───┃───┼───┼───┃───┼───┼───┫")

  array = this.returnRowNumbers(0,1,1,0)
    for (var number in array){
      if(array[number] === null){
        array[number] = " "
      }
    }

  console.log("┃ "+array[0]+" │ "+array[1]+" │ "+array[2]+" ┃ "+array[3]+" │ "+array[4]+" │ "+array[5]+" ┃ "+array[6]+" │ "+array[7]+" │ "+array[8]+" ┃")
  console.log("┣───┼───┼───┃───┼───┼───┃───┼───┼───┫")

  array = this.returnRowNumbers(0,1,2,0)
    for (var number in array){
      if(array[number] === null){
        array[number] = " "
      }
    }

  console.log("┃ "+array[0]+" │ "+array[1]+" │ "+array[2]+" ┃ "+array[3]+" │ "+array[4]+" │ "+array[5]+" ┃ "+array[6]+" │ "+array[7]+" │ "+array[8]+" ┃")
  console.log("┣━━━╋━━━╋━━━╋━━━╋━━━╋━━━╋━━━╋━━━╋━━━┫")

  array = this.returnRowNumbers(0,2,0,0)
    for (var number in array){
      if(array[number] === null){
        array[number] = " "
      }
    }
  console.log("┃ "+array[0]+" │ "+array[1]+" │ "+array[2]+" ┃ "+array[3]+" │ "+array[4]+" │ "+array[5]+" ┃ "+array[6]+" │ "+array[7]+" │ "+array[8]+" ┃")
  console.log("┣───┼───┼───┃───┼───┼───┃───┼───┼───┫")

  array = this.returnRowNumbers(0,2,1,0)
    for (var number in array){
      if(array[number] === null){
        array[number] = " "
      }
    }
  console.log("┃ "+array[0]+" │ "+array[1]+" │ "+array[2]+" ┃ "+array[3]+" │ "+array[4]+" │ "+array[5]+" ┃ "+array[6]+" │ "+array[7]+" │ "+array[8]+" ┃")
  console.log("┣───┼───┼───┃───┼───┼───┃───┼───┼───┫")

  array = this.returnRowNumbers(0,2,2,0)
    for (var number in array){
      if(array[number] === null){
        array[number] = " "
      }
    }

  console.log("┃ "+array[0]+" │ "+array[1]+" │ "+array[2]+" ┃ "+array[3]+" │ "+array[4]+" │ "+array[5]+" ┃ "+array[6]+" │ "+array[7]+" │ "+array[8]+" ┃")
  console.log("┗━━━┻━━━┻━━━┻━━━┻━━━┻━━━┻━━━┻━━━┻━━━┛")
};
```

Well done for making it down this far past all that smelly code. See below the following refactoring:
- Moved cleanNulls in to its own prototype function to allow me to call it in one line rather than 4 (I may also want to use this function elsewhere so it makes sense to have it separate)
- Made the function be called without a beginning row. Given that for the following 8 rows I would call the row from within the function, it makes sense for consistency to call the first row from within the function too.
- Moved each row with numbers in it in to a single function, called multiple times. This will make the code more readable than it was before.

Calling each row by a specific index feels a bit long-winded to me, and perhaps a simpler function calling with just a single digit (1-9) might be easier. That said, currently what I have works so I will move on.

```javascript
Grid.prototype.cleanNulls = function (array) {
  for (var number in array){
    if(array[number] === null){
      array[number] = " "
    }
  };
  return array
};

Grid.prototype.printRow = function (row) {
  console.log("┃ "+row[0]+" │ "+row[1]+" │ "+row[2]+" ┃ "+row[3]+" │ "+row[4]+" │ "+row[5]+" ┃ "+row[6]+" │ "+row[7]+" │ "+row[8]+" ┃")
};

Grid.prototype.print = function () {

  console.log("┏━━━┳━━━┳━━━┳━━━┳━━━┳━━━┳━━━┳━━━┳━━━┓")

  array = this.cleanNulls(this.returnRowNumbers(0,0,0,0))
  this.printRow(array)
  console.log("┣───┼───┼───┃───┼───┼───┃───┼───┼───┫")

  array = this.cleanNulls(this.returnRowNumbers(0,0,1,0))
  this.printRow(array)
  console.log("┣───┼───┼───┃───┼───┼───┃───┼───┼───┫")

  array = this.cleanNulls(this.returnRowNumbers(0,0,2,0))
  this.printRow(array)
  console.log("┣━━━╋━━━╋━━━╋━━━╋━━━╋━━━╋━━━╋━━━╋━━━┫")

  array = this.cleanNulls(this.returnRowNumbers(0,1,0,0))
  this.printRow(array)
  console.log("┣───┼───┼───┃───┼───┼───┃───┼───┼───┫")

  array = this.cleanNulls(this.returnRowNumbers(0,1,1,0))
  this.printRow(array)
  console.log("┣───┼───┼───┃───┼───┼───┃───┼───┼───┫")

  array = this.cleanNulls(this.returnRowNumbers(0,1,2,0))
  this.printRow(array)
  console.log("┣━━━╋━━━╋━━━╋━━━╋━━━╋━━━╋━━━╋━━━╋━━━┫")

  array = this.cleanNulls(this.returnRowNumbers(0,2,0,0))
  this.printRow(array)
  console.log("┣───┼───┼───┃───┼───┼───┃───┼───┼───┫")

  array = this.cleanNulls(this.returnRowNumbers(0,2,1,0))
  this.printRow(array)
  console.log("┣───┼───┼───┃───┼───┼───┃───┼───┼───┫")

  array = this.cleanNulls(this.returnRowNumbers(0,2,2,0))
  this.printRow(array)
  console.log("┗━━━┻━━━┻━━━┻━━━┻━━━┻━━━┻━━━┻━━━┻━━━┛")
};

```
