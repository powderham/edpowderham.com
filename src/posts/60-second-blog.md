---
title: Creating and hosting a react/markdown blog on zeit in 60 seconds
author: Ed Powderham
date: "2020-04-17"
---

#### Intro

I recently helped a friend of mine create a live blog using my [nextjs blog starter](https://github.com/powderham/nextjs-blog-starter). The process took 5 minutes so I thought I would write a brief guide.

You will need:

- A [github](https://github.com) account
- A [zeit](https://zeit.co) account

#### Step 1: Use the template

[Create a repository](https://github.com/powderham/nextjs-blog-starter/generate) from the template.

![Create from repository image](../../public/images/60-second-blog/create-blog-from-template.png)

#### Step 2: Import your new repository on zeit

Go to [https://zeit.co/import/git](https://zeit.co/import/git) and import your project

![Import repository image](../../public/images/60-second-blog/import-github-repository.png)

Select your repository

![Import repository image](../../public/images/60-second-blog/select-repository.png)

Import your project and give it a name

![Import project image](../../public/images/60-second-blog/import-project.png)

The project is not in a sub-directory so leave blank

![Subdirectory select image](../../public/images/60-second-blog/subdirectory-select.png)

Zeit will auto detect your nextjs project so press deploy

![Deploy image](../../public/images/60-second-blog/deploy.png)

#### Step 3: ...?

Wait for your build

![Building image](../../public/images/60-second-blog/building.png)

#### Step 4: Profit

![Built image](../../public/images/60-second-blog/built.png)

Your blog is now live, and you can check it out at the [given link](my-new-blog.powderham.now.sh)

Any new commits to master will now be automatically deployed, and any markdown folder in `/src/posts` will be statically generated and served via zeit.
