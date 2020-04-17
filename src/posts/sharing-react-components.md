---
title: Self hosting and sharing React components between separate projects
author: Ed Powderham
date: "2018-02-18"
---

# Intro

This blog was originally posted on [Medium]('https://medium.com/@Powderham/sharing-react-components-between-separate-projects-self-hosting-with-git-installing-with-yarn-npm-d3275b64239c')

At The Yacht Week (TYW) and The Ski Week (TSW), we’re increasingly writing our front-end assets in React. We’ve naturally been reusing our components within TYW for some time, and now the time has come to reuse the assets on TSW.

Whilst perhaps the easiest implementation is to publish the module on npm, there were a number of reasons to host our module ourselves, and only use npm to install the module and control the versions:

- Hosting the module alongside our existing repositories is mentally neater, so we can find all of our code in one place
- We can manage access to the repositories in one place
- We avoid the billing for private repositories in npm

## 1.

Create a new directory, and run yarn init inside the directory to kickstart writing the package.json file.

Notes:

    At this stage I had set up a github repository where I will be hosting the module, which I entered to the URL when prompted.
    We are defining the entry point to the module in a directory called build

mkdir shared-react-component-example
cd shared-react-component-examplegit init
git remote add origin https://github.com/powderham/shared-react-component-example.gityarn initquestion name (shared-react-component-example):
question version (1.0.0): 0.1.0
question description: An example module demonstrating how to share react components
question entry point (index.js): build/index.js
question repository url: https://github.com/powderham/shared-react-component-example.git
question author: Ed Powderham
question license (MIT):
question private:

## 2.

Now time to create our component. We do so inside a new directory src . This is where if you’re refactoring a pre-existing component to its own module, you would move the file here (not forgetting to add/install any dependencies).

For the purpose of keeping this example simple, the component simply returns a string containing a new date object.

//src/TodaysDate.js
import React from "react";const TodaysDate = () =>

  <div>{`Today's date is ${Date()}`}</div>;export default TodaysDate;

Because we’re using React, don’t forget to run yarn add react .

## 3.

Time to expose the component so that we can use it wherever we install the module

In the src directory we need to create the index.js file we declared as the entry point to our application:

//src/index.js
export { default as TodaysDate } from './TodaysDate';

When we’re using es6, it’s as simple as that.

## 4.

As we set up in step 1, we will be building/transpiling the code to a build directory.

For this we will use babel. I am using the stage-0 preset to explore the latest JS goodies, make sure that any features you use that rely on stage-0 don’t get deprecated if you decide to use them in production.

yarn add --dev babel-cli babel-preset-react babel-preset-stage-0 babel-preset-env

and create the .babelrc file.

.babelrc

```bash
{
    "presets": [
      [
        "env",
      {
        "modules": false
      }
   ],
      "react",
      "stage-0"
    ]
}
```

## 5.

So as to avoid adding unnecessary files to our repo/npm module, we need to ignore the build directory in git, and ignore the src directory in npm.

```
// .npmignore
.babelrc
/src// .gitignore
/build
*.log
/node_modules
```

Note: we are also ignoring any log files (e.g. yarn.log) and our node_modules directory in git.

## 6.

Now we need to prepare the module for publishing to npm.

We do this by adding two scripts. The first build uses babel to parse the files from src to the build directory. The second, prepare is run after local npm install , calling the previous build script and thus creates the build directory wherever we add the module.

```bash
{
  // ... The rest of package.json
  "scripts": {
    "build": "babel src -d build",
    "prepare": "yarn run build"
  }
}
```

You can test these out by running yarn run prepare locally. Further, if you want to add non JavaScript assets, append your build command with --copy-files so: babel src -d build --copy-files

## 7.

Time to push to our repository and import it in whichever project we want:

‘Publishing’ the module, which is really just pushing it to git.

git add .
git commit -m 'Initial commit'
git push origin master

To add use this, just run:

```bash
// documents/theyachtweek/
yarn add git+ssh://git@github.com:powderham/shared-react-component-example.git
```

which creates the following in your package.json:

```bash
{
 // all other key, values in your package.json
  "dependencies": {
    "shared-react-component-example":    "git+ssh://git@github.com:powderham/shared-react-component-example.git",
  }
}
```

and where you want to include it in your React code

import { TodaysDate } from 'shared-react-component-example';

and now <TodaysDate /> renders as:

![Todays date image](/images/todays-date.png)

I hope you this helps, let me know if you have any questions!
