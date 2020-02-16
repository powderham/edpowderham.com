---
layout: post
title:  "Solving Sudoku - Side project"
blog: true
date:   2016-12-29 16:19:54 +0000
categories: jekyll update
author: ed
hidden: true
---

# The context

Sat over Christmas attempting to complete a Fiendish Sudoku, I wondered if I could write the code to solve my Sudoku quicker than I could solve the Sudoku myself. On reflection, writing the code according to the best practices that I have learnt (e.g. testing) would almost certainly mean that writing the code would be slower. However, having thought about the challenge required, I decided that this would be a fun side project to wrestle with over the Christmas break.

I will write a series of posts detailing how I have solved the Sudoku puzzle, with complete transparency on my code and working practices. The hope is that by exposing my decisions to work in a certain way, I can emulate some of the positive attributes of pair-programming.

The project will in the first instance look to complete the first two user stories detailed below:

```
As a user,
So that I can receive relevant solutions to sudoku,
I would like to be able to input my sudoku numbers.
```

```
As a user,
So that I can go off and enjoy my christmas,
I would like to see the solution to a entered sudoku challenge.
```


# The technology

I am going to be writing this code in JavaScript. The reason for this are:
- I have a working knowledge of writing code in JS so the challenge will be about solving Sudoku, rather than learning a new language
- I am seeing increasingly more jobs requiring experience with Node and Express, should I ever decide to host my application, I would like to do so using these technologies, rather than Sinatra/Rails that I currently have most experience in.
