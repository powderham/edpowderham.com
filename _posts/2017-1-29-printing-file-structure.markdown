---
layout: post
blog: true
title:  "Printing directory file structure to command line"
date:   2017-1-23 20:03:00 +0000
categories: jekyll update
author: ed
hidden: true
---

Whether you're writing a tutorial or documentation, sometimes it's useful to print your document tree. Fortunately there's a brew formula for this - [tree](http://brewformulas.org/Tree)

To run this, open your terminal and type:

```
brew install tree
```

To view the file structure of a specific directory, navigate to your directory write the following, super-complex command:

```
tree
```

et voila

```
├── _posts
│   ├── 2015-02-24-markdown-extra-components.markdown
│   ├── 2016-01-23-indigo-jekyll-theme.markdown
│   ├── 2016-02-24-markdown-common-elements.markdown
│   ├── 2016-12-23-welcome-to-jekyll.markdown
│   ├── 2016-12-24-sudoku-solver-project.markdown
│   ├── 2016-12-29-sudoku-solver-project-initial-testing.markdown
│   ├── 2017-1-12-sudoku-solver-printing-the-grid.markdown
│   ├── 2017-1-16-sudoku-solver-bringing-it-together.markdown
│   ├── 2017-1-2-sudoku-solver-grid-development.markdown
│   ├── 2017-1-2-sudoku-solver-project-further-tile-development.markdown
│   ├── 2017-1-21-sudoku-solver-testing-the-puzzle.markdown
│   ├── 2017-1-23-sudoku-solver-refactoring.markdown
│   ├── 2017-1-28-playing-with-react.markdown
│   └── 2017-1-3-sudoku-solver-bringing-it-together.markdown
```
