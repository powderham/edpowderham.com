---
layout: post
blog: true
title:  "Symfony Intro"
date:   2017-3-5 13:55:00 +0000
categories: jekyll update
author: ed
hidden: true
---

# A collection of useful snippets from my time playing with Symfony

## Running

```php
php bin/console server:run
```

## Namespaces

Namespaces are a convention to define a location for a class in to a directory, to be referenced somewhere else.

One file
```php
<?php

require 'Foo.php';
$foo = new \Acme\Tools\Foo();
```

A new file
```PHP
<?php

namespace Acme\Tools;

class foo
{
    public function doAwesomeFooThings()
    {
      echo "Hello World";
    }
}
```

You can shorten it by adding a shortcut. The shortcut defaults to the the final backslash, but you can declare it too with ```as someFooClass();```

```php
<?php

require 'Foo.php';

use \Acme\Tools\Foo;

$foo = new Foo();
```

## Simple Hello World routing

An example for a controller called 'genus'

```php
<?php

//This must reflect the route to the controller
namespace AppBundle\Controller;

//To use routing
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;

//To use response class
use Symfony\Component\HttpFoundation\Response;

class GenusController
{
  //Declaring the route as a comment that is parsed as configuration
  /**
  * @Route("/genus")
  */
  public function showAction()
  {
    return new Response('Hello World!');
  }
}
```

## Wildcard routing

An example for a 'wild card' router. The curly braces allow us to add the argument '$genusName' to the route.

```php
<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\Response;

class GenusController
{
  /**
  * @Route("/genus/{genusName}")
  */
  public function showAction($genusName)
  {
    return new Response('The genus: '.$genusName);
  }
}
```

## Debugging routing

In order to see a list of all the available routes, use the below command:
```
php bin/console debug:router
```

## JSON Responses

To provide a JSON response, first we need to define the route. Note that we are defining to only provide the response under the GET type. For this, we need to add the method configuration.

You can test that this route has been added with ```php bin/console debug:router ```.

```php
//Adding specification for method
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;

/**
* @Route("/genus/{genusName}/notes")
* @Method("GET")
*/
```

Now we are hardcoding some data to return ($notes), giving it a key (notes) and then returning it as encoded JSON.

```php
public function getNotesAction()
{
  $notes = [
          ['id' => 1, 'username' => 'AquaPelham', 'avatarUri' => '/images/leanna.jpeg', 'note' => 'Octopus asked me a riddle, outsmarted me', 'date' => 'Dec. 10, 2015'],
          ['id' => 2, 'username' => 'AquaWeaver', 'avatarUri' => '/images/ryan.jpeg', 'note' => 'I counted 8 legs... as they wrapped around me', 'date' => 'Dec. 1, 2015'],
          ['id' => 3, 'username' => 'AquaPelham', 'avatarUri' => '/images/leanna.jpeg', 'note' => 'Inked!', 'date' => 'Aug. 20, 2015'],
      ];
  $data = [
          'notes' => $notes
  ];
  return new Response(json_encode($data));
}
}
```

We can make the resposne shorter by using:
```php
return new JsonResponse($data);
// instead of
return new Response(json_encode($data));
```
This method both calls json_encode and sets the application/json content type header on the response.

## Route Generation

To avoid hardcoding routes, we can use route generation in symfony.
The first thing to do is to give the route a name (to be referenced elsewhere in the project)

```php
//Adding a unique name to the route to be referenced
/**
* @Route("/genus/{genusName}/notes", name="genus_show_notes")
* @Method("GET")
*/
public function getNotesAction()
{
  $notes = [
          ['id' => 1, 'username' => 'AquaPelham', 'avatarUri' => '/images/leanna.jpeg', 'note' => 'Octopus asked me a riddle, outsmarted me', 'date' => 'Dec. 10, 2015'],
          ['id' => 2, 'username' => 'AquaWeaver', 'avatarUri' => '/images/ryan.jpeg', 'note' => 'I counted 8 legs... as they wrapped around me', 'date' => 'Dec. 1, 2015'],
          ['id' => 3, 'username' => 'AquaPelham', 'avatarUri' => '/images/leanna.jpeg', 'note' => 'Inked!', 'date' => 'Aug. 20, 2015'],
      ];
  $data = [
          'notes' => $notes
  ];
  return new Response(json_encode($data));
}
```

Then in the template, use the path function to generate the path, adding the above name (genus_show_notes in this case) and an associative array containing the values for any wildcards.

```html
<!-- two arguments to the path function, the name of the route (defined in the controller) and values for any wildcards -->
{% raw %}
 <a href="{{ path('genus_show_notes', {"genusName" : name}) }}"></a>
{% endraw %}
```

# Services (useful objects)

There is a large object called 'The Container' that has the keys for related objects.
You can even add your own services!

## Rendering a template

Templates are stored in resources. Below a template is added in a directory called genus.

```
app
├── AppCache.php
├── AppKernel.php
├── Resources
│   └── views
│       ├── base.html.twig
│       └── genus
│           └── show.html.twig
```

To return this template, use the following code.

```php
<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\Response;

//To use controller
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class GenusController extends Controller
{
  /**
  * @Route("/genus/{genusName}")
  */
  public function showAction($genusName)
  {
    //To get the templating service from the container - you need to give the name of the service.
    $templating = $this->container->get('templating');

    //Defining the resposne object, rendered by the templating service with a defined path.
    $html = $templating->render('genus/show.html.twig', [
      'name' => $genusName
    ]);

    return new Response($html);
  }
}
```

You can use a shortcut to return templates

```php
<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class GenusController extends Controller
{
  /**
  * @Route("/genus/{genusName}")
  */
  public function showAction($genusName)
  {
    $templating = $this->container->get('templating');
    //A shortcut for returning a template
    return $this->render('genus/show.html.twig', [
      'name' => $genusName
    ]);
  }
}
```

# Twig

Documentation for Twig can be found here:
http://twig.sensiolabs.org/doc/2.x/

## Debugging in twig

In order to print all of the available variables (or a specific variable, given as an argument), use the dump function

```html
{% raw %}
{{ dump() }}
{% endraw %}
```

Which returns something like this

```
array:3 [▼
  "name" => "test"
  "notes" => array:3 [▶]
  "app" => AppVariable {#363 ▶}
]
```

You can also use dump in php code whilst using Symfony

```php
<?php

dump($anyVariable);
```

## Looping in Twig

Below we hardcode an array and pass it to the template

```php
<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class GenusController extends Controller
{
  /**
  * @Route("/genus/{genusName}")
  */
  public function showAction($genusName)
  {
    $templating = $this->container->get('templating');

    //A hardcoded array to be looped over
    $notes = [
      "Notes1",
      "Notes2",
      "Notes3"
    ];

    return $this->render('genus/show.html.twig', [
      'name' => $genusName,
      //Passing the array to the template
      'notes' => $notes
    ]);
  }
}
```

In the template, we can loop over it like so

```php
<h1> The Genus {{ name }} </h1>

<ul>
    {% for note in notes %}
      <li>  {{note}}  </li>
    {% endfor %}
</ul>
```

## Templating in Twig

Templates in twig inheret from one another, beginning from base.html.twig

base.html.twig looks like this

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8" />
        <title>
          {% raw %}
            {% block title %}
          {% endraw %}
          Welcome!
          {% raw %}
            {% endblock %}
          {% endraw %}
        </title>
        {% raw %}
        {% block stylesheets %}{% endblock %}
        <link rel="icon" type="image/x-icon" href="{{ asset('favicon.ico') }}" />
        {% endraw %}
    </head>
    <body>
        {% raw %}
          {% block body %}{% endblock %}
          {% block javascripts %}{% endblock %}
        {% endraw %}
    </body>
</html>
```

This can be extended by wrapping the code from another template in to a block, and giving it the name of the block in base.html.twig to replace

```html
{% raw %}
  <!-- Belongs to base -->
  {% extends 'base.html.twig' %}

  <!-- All the code in the below block should be placed within the body block in base -->
  {% block body %}
    <h1> The Genus {{ name }} </h1>

    <ul>
        {% for note in notes %}
          <li>  {{note}}  </li>
        {% endfor %}
    </ul>
  {% endblock %}
{% endraw %}
```

## Using javascript/react in twig

Javascript is included automatically in the base.html.twig as per below:

```php
{% raw %}
  {% block javascripts %}
      <script src="//code.jquery.com/jquery-2.1.4.min.js"></script>
      <script src="{{ asset('js/main.js') }}"></script>
  {% endblock %}
{% endraw %}
```

However if we want to add javascript to a single page, we have to declare it on that single page.
The scripts called in this block will directly replace the scripts in the parent's javascripts block. Therefore we are calling the parent() function, this returns all the script tags in the parent's javascripts block. We then add new scripts to the block and return it all.

We are adding scripts for react and rendering NoteSection in an element called 'js-notes-wrapper'.

```html
{% raw %}
{% block javascripts %}
  {{ parent() }}
  <script src="https://cdnjs.cloudflare.com/ajax/libs/react/0.14.3/react.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/react/0.14.3/react-dom.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/babel-core/5.8.23/browser.min.js"></script>
  <script type="text/babel" src="{{ asset('js/notes.react.js') }}"></script>

  <script type="text/babel">
    ReactDOM.render(
      <NoteSection />,
      document.getElementById('js-notes-wrapper')
    )
  </script>
{% endblock %}
{% endraw %}
```

So we need to add the element where react will render the content in the body.

```html
<div id="js-notes-wrapper"></div>
```


In the react file that is called, we have a hardcoded url for the ajax request. We can use twig and react to update this:

```javascript
  loadNotesFromServer: function() {
      $.ajax({
          url: '/genus/octopus/notes',
          success: function (data) {
              this.setState({notes: data.notes});
          }.bind(this)
      });
  },
```

We can update this to take a property, which we will pass to the component.

```javascript
  loadNotesFromServer: function() {
      $.ajax({
          url: this.props.url,
          success: function (data) {
              this.setState({notes: data.notes});
          }.bind(this)
      });
  },
```

Now NoteSection is expecting a property of url. We can pass that to the component with symphony/twig.
Again we use that path function to dynamically generate the url.

```javascript
{% raw %}
<script type="text/babel">
  var notesUrl = "{{ path("genus_show_notes", {"genusName":name}) }}";

  ReactDOM.render(
    <NoteSection url={notesUrl}/>,
    document.getElementById('js-notes-wrapper')
  )
</script>
{% endraw %}
```
