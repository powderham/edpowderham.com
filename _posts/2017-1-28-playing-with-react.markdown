---
layout: post
blog: true
title:  "Playing with React and Node"
date:   2017-1-30 20:03:00 +0000
categories: jekyll update
author: ed
hidden: true
---

# A collection of useful snippets from my time playing with React

## Full path to running node server

```
./node_modules/.bin/babel-node server.js
```

## Running webpack to generate Bundle.js file from source
```
npm run dev
```

## Importing React and ReactDom
First we need to import React and ReactDom in to our index file.

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
```

## Rendering a component

Takes two arguments:
- The thing to be rendered
- The element in which to render the first argument

```javascript
ReactDOM.render(
  <h2>Hello World</h2>,
  document.getElementById('root')
);
```

## Components
The top level component is usually an app component, defined as a constant

```javascript
const App = () => {
  return (
    <h2>
     Hello World!
    </h2>
  );
};
```

## Rendering a component

```javascript
ReactDOM.render(
  // call the component by its name
  <App />,
  document.getElementById('root')
);
```

## Passing a prop (variable) to a component

```javascript
const App = (props) => {
  return (
    <h2>
     {props.componentMessage}
    </h2>
  );
};

ReactDOM.render(
  // call the component by its name
  <App componentMessage="Hello World!!"/>,
  document.getElementById('root')
);
```

## Validating props

In order to get receive an error message, you can validate your props.

```javascript
App.propTypes = {
  // propName: React.PropTypes....
  componentMessage: React.PropTypes.string
};
```
Available PropTypes are:
- any
- array
- arrayOf
- createArrayOfTypeChecker(typeChecker)
- bool
- element
- func
- instanceOf
- createInstanceTypeChecker(expectedClass)
- node
- number
- object
- objectOf
- createObjectOfTypeChecker(typeChecker)
- oneOf
- createEnumTypeChecker(expectedValues)
- oneOfType
- createUnionTypeChecker(arrayOfTypeCheckers)
- shape
- createShapeTypeChecker(shapeTypes)
- string
- symbol

You can define a prop as required by chaining isRequired:

```javascript
App.propTypes = {
  // propName: React.PropTypes....
  // would become redundant if a default value is provided
  componentMessage: React.PropTypes.string.isRequired
};
```

You can define a default value for a prop:

```javascript
App.defaultProps = {
  // propName: default value
  componentMessage: "String";
}
```

## Multiple elements in a single component

To make the code more readable and re-use code, you can add components to existing components.
When making this type of abstraction, be sure to update all the validation.

```javascript
const App = () => {
  return (
    <div>
      <Header message = "Hello World from the header" />
      <div>
        ...
      </div>
    </div>
  );
};

const Header = ({message}) => {
  return(
    <h2>
      {message}
    </h2>
  );
};
```

## Extracting components in to their own files

To tidy up your index.js file, you can extract components to their own files and import them in to index.js.

It is convention to create a folder called components to put them in, and then mirror the name of the component in the file name, like so:

```javascript
├── src
│   ├── components
│   │   └── Header.js
```

Copy your code from index.js to Header.js. (Don't forget to import react again)

```javascript
import React from 'react';
```

Because it's a module now, you'll need to export it.

```javascript
//export default component name
export default Header;
```
And finally within your index.js file, you now need to import the component.

```javascript
//import Component from componentFileLocation
import Header from './components/Header.js';
```

## Making a component dynamic (giving a component state)

Suppose you wanted to change a component dependent upon where it is rendered on a page, you can give it states.

You need to convert the component in to a class based component.

Before

```javascript
const App = () => {
  return (
    <div>
      <Header message = "Hello World from the header" />
      <div>
        ...
      </div>
    </div>
  );
};
```

After

```javascript
class App extends React.Component {
  render(){
    return (
      <div>
        <Header message = "Hello World from React" />
        <div>
          .
        </div>
      </div>
    );
  };
};
```

Because we are using a class, to then add in the state, we can use the following syntax

```javascript
// class App extends React.Component {
  state = {pageHeader: "Hello World from React"}
  // render(){
  //   return (
  //     <div>
        <Header message = {this.state.pageHeader} />
//         <div>
//         </div>
//       </div>
//     );
//   };
// };
```

## Changing state in the console

In the react dev tools console, you can see and set the state with the following code:

```
$r.state
$r.setState({key: value})
```

## Component lifecycle

You can run code on lifeycle events that occur to a component: mounting and unmounting. The code is as follows:

To run code when the component is mounted

```javascript
compnentDidMount(
  // code here such as timers, listeners or AJAX requests
)
componentWillUnmount(
  // code here such as cancelling timers and listeners
)
```

## Handling JSON data

First install JSON-loader

```javascript
$ npm i -S json-loader
```

add the loader to the webpack config

```javascript
{
      test: /\.json$/,
      loader: 'json-loader'
    }
```

save your data somewhere and then import it

```javascript
import data from './testData.json';
```

you can now use this data as you'd like by calling data. For example, passing it as a prop

```javascript
ReactDOM.render(

  <App contests={data}/>,
  document.getElementById('root')
);
```

## Reading data from states

Above, the data is being passed to the application as a prop. While this is ok for data in memory, if the data is coming from an API call, react will render the view before the data has been loaded. To solve this, make the data be stored in state.

Remove the data from the props

```javascript
ReactDOM.render(

  <App />,
  document.getElementById('root')
);
```

Inside the App component, we now want to add the data to the state

```javascript
class App extends React.Component {
  state = {
    contests: []
  }

  ...
}
```

To have the data update when ready, we need to add the following code to the componentDidMount() function

```javascript
componentDidMount(){
  this.setState({
    contests: data.contests
  })
}
```

Now when data is loaded/updated, this will be reflected in react.

## Making and handling an AJAX request

To call data from a remote API, you need to run an AJAX request. To make this request, you need to use a library.

```
import i -S axios
```

Import axios

```javascript
import axios from 'axios';
```
```javascript
//put inside componentDidMount to happen on load
componentDidMount(){
  // define the path for the request
  axios.get('/path')
  .then(resp => {
    // do what you want with the response here - updating state in this example
    this.setState({
      contests: resp.data.contests
    })
  })
  // providing an error message
  .catch(console.error)
}
```

## Fetching the data on the server side

In order to have increased SEO rankings, you need to render data on the server side.
This is because web crawlers don't use JS, so to have data from api calls included, you must call them on the server side.

```javascript
//importing and using axios as per above
import axios from 'axios';
// importing url from config to avoid hardcoding a url
import config from './config';

axios.get(`${config.serverUrl}/`) //url to api data
  .then(resp => {
    console.log(resp.data)
  })
```

```javascript
// export default {
  // port: env.PORT || 8080,
  host: env.HOST || '0.0.0.0',
  get serverUrl() {
    return `http://${this.host}:${this.port}`
  }
// }
```

If you are fetching data with axios in a separate file to the server.js file, you need to import it again in your server.js file

```javascript
import './filepath'
```

So we now have fetched the data on the server side, evidenced by restarting the server and viewing ```resp.data``` in the console.

Now we need to render the data with react. We will need to import React and ReactDOMServer

```javascript
import React from 'react';
import ReactDomServer from 'react-dom/server';
import App from './src/components/App'; //this line is assuming we are calling the data in its own file

```
Then we need to update where we had console.log before:

```javascript
axios.get(`${config.serverUrl}/`) //url to API
  .then(resp => {
    ReactDomServer.renderToString(<App />);
  })
```

We now need to pass this data to the App component.

```javascript
axios.get(`${config.serverUrl}/`) //url to API
  .then(resp => {
    ReactDomServer.renderToString(
      <App initialContests={resp.data.contests}/>   //propName={path.to.data}
    );

  })
```

And make the necessary adjustment in the App component

```javascript
// state = {
//     pageHeader: "Hello World from React",
    contests: this.props.initialContests //where initialContests is the name of the prop given in the renderToString method
  // }
```

Because the axios data fetch is inside a promise, we need to wrap it in a constant and  return it.

```javascript
const serverRender = () =>
// axios.get(`${config.serverUrl}/api/contests`)
//   .then(resp => {
  //  return ReactDomServer.renderToString(
  //       <App initialContests={resp.data.contests}/>
  //     );
  //
  //   })
  export default serverRender;

```


Now update what is being imported from the serverRender (it was previously the entire file)

```javascript
// import './filepath'
import serverRender from './filepath';
```

And use that import in the server.get method

```javascript
server.get('/', (req, res) => {
  //calling server render
  serverRender()
    .then(content => {
      //using the response to render
      res.render('index', {
        content
      });
    })
    //adding a catch for any errors
    .catch(console.error)
});
```

Currently, in index.js we are initialising the App component with an empty array. This means that we rendering the component with no data, fetching the data and then re-rendering the component which is wasteful.

```javascript
ReactDOM.render(
  <App initialContests={[]}/>,
  document.getElementById('root')
);
```
There are two ways to solve this:

To solve this one way, we can fetch the data and then render the DOM by putting ReactDom.render inside our call to fetch the data, which we now do in index.js (and also importing axios in to index.js to make the call again).

```javascript
axios.get('/api/contests')
  .then(resp => {
    ReactDOM.render(
      <App initialContests={resp.data.contests}/>,
      document.getElementById('root')
    );
  })
  .catch(console.error)
```

However, this makes another call to the api which may cause some downstream problems. So, what we can do, is return the data itself from the server, since the server already has the data.

So, in serverRender, we need to return the data as well as the renderToString function

```javascript
// const serverRender = () =>
//   axios.get(`${config.serverUrl}/api/contests`)
//     .then(resp => {
       return {
          initialMarkup: ReactDomServer.renderToString(
            <App initialContests={resp.data.contests} />
          ),
          initialData: resp.data
        }
    // });
```

Now that we are returning two elements, we need to update the server to include them in ejs by including them as arguments (as an object) to the serverRender function.

```javascript
// server.get('/', (req, res) => {
//   serverRender()
//  .then((
        {initialMarkup, initialData}
// ) => {
      // res.render('index', {
        initialMarkup,
        initialData
//       });
//     })
//     .catch(console.error)
// });
```

Because we have changed the name of the variable in the render function, we need to update the the ejs template variable name, as well as add script to add the data to a global variable in the window

```javascript
<script type="text/javascript">
  window.initialData = <%- JSON.stringify(initialData) -%>
</script>

// <%- include('header') -%>
//     <div id= "root" class="">
      <%- initialMarkup %>
//     </div>
// <%- include('footer') -%>
```

Now we can remove the additional api call that we added above and instead get the data from the window. (Remebering to not require axios anymore)

```javascript

ReactDOM.render(
  <App initialContests={window.initialData.contests}/>,
  document.getElementById('root')
);

```

## Refactoring components

Often components can be refactored to make them more reusable. The code below has a component rendering another component (Header) and then renders further html. The additional HTML can be refactored in to its own component.

```javascript
render(){
  return (
    <div>
      <Header message = {this.state.pageHeader} />
      <div>
        {this.state.contests.map(contest =>
          <ContestPreview key={contest.id} {...contest}/>
        )}
      </div>
    </div>
  );
};
```

Create a new file for the ContestList component

```javascript

//import react and ContestPreview (which is now required in ContestPreview rather than app)
import React from 'react';
import ContestPreview from './ContestPreview.js';

//make a constant named after the component (Pass in contests, which was previously in the state of App.js)
const ContestList = ({contests}) => (
  <div>
  //note we are now running map on the contests argument that is passed, rather than calling direct state
    {contests.map(contest =>
      <ContestPreview key={contest.id} {...contest}/>
    )}
  </div>
);

//declare that the contests argument will be an array
ContestList.propTypes = {
  contests: React.PropTypes.array
}

//set the default export to ContestList
export default ContestList;
```

Now to tidy up the App component.

```javascript
import ContestList from './ContestList'

  render(){
    return (
      <div>

        <Header message = {this.state.pageHeader} />
        <ContestList contests={this.state.contests} />
      </div>
    );
  };
};
```

Creating a new component with its own file

## Using SASS with node

To have node translate the SCSS in to CSS, we need the middleware.

Install node-sass-middleware
```
npm i -S node-sass-middleware
```

Import node-sass-middleware and path (a built in node module) in server.js

```
import sassMiddleware from 'node-sass-middleware';
import path from 'path';
```

Define where the SCSS files are and where to write the CSS files to. This code snippet below expects a directory called sass as the source and uses the public folder for the destination.

```
server.use(sassMiddleware({
  src: path.join(__dirname, 'sass' ),
  dest: path.join(__dirname, 'public')
}));
```

Finally add a link to the rendered css file in to the header.
(You can link directly because it is in the public folder)

```javascript
<link rel="stylesheet" href="/style.css">
```

You can now add SCSS code in to the sass directory and have it rendered by node.
