---
layout: post
blog: true
title:  "PHP Intro"
date:   2017-2-28 10:51:00 +0000
categories: jekyll update
author: ed
hidden: true
---

# A collection of useful snippets from my time playing with PHP

## Basics

Writing php inline in an HTML doc
```php
<?php echo "Hello World!" ?>
```

Declaring a variable
```php
<?php
$var = "Hello World!";
echo $var;
 ?>
```

## Arrays and loops
You can use ```[]``` or ```array()``` to declare an array

Indexed array
```php
<?php
  $names = array("John", "Mark", "Matthew");

  foreach ($names as $name){
    echo $name;
  }

?>
```

Associative arrays
The values of associative arrays can be called by their keys
Items can be added to associative arrays by specifying the key
```php
<?php
  $person = [
    "name" => "Ed",
    "hairColour" => "Brown",
    "city" => "London"
  ];

    echo $person["name"];

    $person["eyeColour"] = "Blue";
?>
```

## Debugging

To print a variable to the screen with more information, use var_dump
```php
var_dump($variable)
```

## Requiring files

```php
<?php
  require 'index.php';
 ?>
```

You can also use

```php
<?php
  require_once;

    //continue if the files doesn't exist
  include;
  include_once
?>
```

## Redirecting

Set the header to redirect (especially after a form submit)

```php
<?php
  header('Location: /index.php')
?>
```

## Connecting to a database

```php
//                db name,                        username, password
$pdo = new PDO('mysql:dbname=###;host=localhost', 'root', null);
```

## Avoiding SQL injection

Preparing queries
```php
function get_pet($id)
{
    $pdo = get_connection();
    $query = 'SELECT * FROM pet WHERE id = :idVal';
    $stmt = $pdo->prepare($query);
    $stmt->bindParam('idVal', $id);
    $stmt->execute();

    return $stmt->fetch();
}
```
