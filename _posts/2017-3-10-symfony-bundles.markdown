---
layout: post
blog: true
title:  "Symfony Bundles & Environments"
date:   2017-3-10 10:39:00 +0000
categories: jekyll update
author: ed
hidden: true
---

# A collection of useful snippets from my time playing with Symfony

## Configuring Bundles

Go to the config file
```
app/config
├── config.yml
```

In here you will see the configuration for all the bundles in the project.
You can find the parameters for these either at symfony.com or by running the below code with the name of the bundle (e.g. twig) supplied.
```
./bin/console config:dump-reference {twig}
```

Configuration is validated so will generate an error if it is not understood.

## Adding Markdown parser bundle

To do markdown conversion, install the following bundle:
https://github.com/KnpLabs/KnpMarkdownBundle

In the terminal
```
composer require knplabs/knp-markdown-bundle
```

In AppKernel $bundles array
```php
new Knp\Bundle\MarkdownBundle\KnpMarkdownBundle(),
```

The bundle is used in the controller. You can call the parser on a string.

```php
public function showAction($genusName)
{
  //adding a string to be parsed
  $funFact = "Octopuses can change the color of their body in just *three-tenths* of a second!";
  //calling the parser on the string
  $funFact = $this->container->get('markdown.parser')
              ->transform($funFact);

    return $this->render('genus/show.html.twig', array(
        'name' => $genusName,
        //adding the parsed string to the return function
        'funFact' => $funFact,
    ));
}
```

In twig you then need to escape the html using the 'raw filter':

```php
{{funFact|raw}}
```

You can shorten the reference to the bundle like so:

```php
$funFact = $this->get('markdown.parser')
  ->transform($funFact);
```

## Adding caching bundle

Ensure that the bundle is in the composer.json file

```json
{
    "require": {
        "doctrine/doctrine-cache-bundle": "^1.2",
    }
}
```

Then add in Appkernel, add the bundle

```php
class AppKernel extends Kernel
{
    public function registerBundles()
    {
        $bundles = array(
            new Doctrine\Bundle\DoctrineCacheBundle\DoctrineCacheBundle(),
        );
    }
}
```

So now that we have the bundle, we need to configure it.
Find out what keys it has by running the below in the terminal
```
./bin/console config:dump-reference doctrine_cache
```

From this let's add the below code to the config file

```
doctrine_cache:
    providers:
        my_markdown_cache:
            type: file_system            
```

Now we need to use the cache

```php
//calling the bundle
$cache = $this->get('doctrine_cache.providers.my_markdown_cache');
//hashing the funFact
$key = md5($funFact);

//returning the cached key if it is found, otherwise saving it
if ($cache->contains($key)) {
  $funFact = $cache->fetch($key);
} else {
  sleep(1); // fake how slow this could be
     $funFact = $this->get('markdown.parser')
         ->transform($funFact);
     $cache->save($key, $funFact);
}
```

This is saving the cache by default to a place. We can specify it using the following code (from the documentation)

```
doctrine_cache:
    providers:
        my_markdown_cache:
            type: file_system
            file_system:
                directory: /tmp/doctrine_cache
```
