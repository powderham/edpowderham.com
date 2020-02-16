---
layout: post
blog: true
title:  "Interacting with the React DOM"
date:   2017-2-08 12:13:00 +0000
categories: jekyll update
author: ed
hidden: true
---

# A collection of useful snippets from my time playing with React

## Adding an onClick handler to a component

A dynamic function that requires data from the state requires the component to be a class component so that there is an instance of the component.
We are going to make the below constant in to a class component

```javascript
const ContestPreview = (contest) => (
  <div className="ContestPreview" onClick={  }>
    <div className="category-name">
      {this.props.categoryName}
    </div>
    <div className="contest-name">
      {contest.contestName}
    </div>
  </div>
);
```

A skeleton class component looks like this

```javascript
class ComponentName extends component {
  render(){
    return (
      //block to return
    )
  }
}
```

So we update the skeleton with the name of the previous constant and return the previous html as per below and declare the PropTypes
```javascript
class ContestPreview extends Component {
  render() {
    return (
      <div className="ContestPreview" onClick={  }>
        <div className="category-name">
            // now referencing the category name for the instance of the ContestPreview
          {this.props.categoryName}
        </div>
        <div className="contest-name">
            // now referencing the contest name for the instance of the ContestPreview
          {this.props.contestName}
        </div>
      </div>
    );
  }
}

ContestPreview.propTypes = {
  categoryName: React.PropTypes.string.isRequired,
  contestName: React.PropTypes.string.isRequired,
}
```

## Adding an instance function to the class

Now that we have an instance of a ContestPreview, we can add an instance function (that we must also define). Here we are just logging the contestName on click - we are doing this for testing purposes.

```javascript
// class ContestPreview extends Component {
  handleClick = () => {
    console.log(this.props.contestName)
  }
//   render() {
//     return (
      <div className="ContestPreview" onClick={ this.handleClick }>
//         <div className="category-name">
//           {this.props.categoryName}
//         </div>
//         <div className="contest-name">
//           {this.props.contestName}
//         </div>
//       </div>
//     );
//   }
// }
```

## Adding a hover link to a component

To update the styling so that when we hover we will be able to see that it is a link, we need to add a link class to the top level div..

```javascript
// class ContestPreview extends Component {
  // handleClick = () => {
  //   console.log(this.props.contestName)
  // }
//   render() {
//     return (
      <div className="link ContestPreview" onClick={ this.handleClick }>
//         <div className="category-name">
//           {this.props.categoryName}
//         </div>
//         <div className="contest-name">
//           {this.props.contestName}
//         </div>
//       </div>
//     );
//   }
// }
```

.. and reference this in our scss style sheet

```css
.link {
  cursor: pointer;
}
```

## Adding routing

We can use the HTML5 History API to do our routing. We are wrapping the API in a function so that it can be easily modified at a later date.

```javascript
const pushState = (obj, url) =>
  window.history.pushState(obj, '', url);
```

We now want to add functionality to onClick. So we need to declare a function (in this instance fetching information from a server). The function below is taking a contestId as an argument, and using that to interact with the HTML5 History API.

```javascript
fetchContest = (contestId) => {
    pushState(
      {currentContestId: contestId } ,
      `/contest/${contestId}`
    );
  }
```

We now need to pass this function to the children both ContestList and ContestPreview, by passing it as a prop. Below adding it to ContestList

```javascript
<div>
    <Header message = {this.state.pageHeader} />
    <ContestList
    onContestClick={this.fetchContest}
    contests={this.state.contests} />
</div>
```

This means that we now need to declare the PropType in the ContestList component

```javascript
// ContestList.propTypes = {
//   contests: React.PropTypes.array,
  onContestClick: React.PropTypes.func.isRequired,
// }
```

Then for each ContestPreview, we need to pass this function (onContestClick)

```javascript
// const ContestList = ({contests, onContestClick}) => (
//   <div>
//     {contests.map(contest =>
//       <ContestPreview
//       key={contest.id}
         onClick={onContestClick}
//       {...contest}/>
//     )}
//   </div>
// );
```

And then add onClick as a property type so that it can be received within ContestPreview. Further, we also need to add the id.

```javascript
// ContestPreview.propTypes = {
//   categoryName: React.PropTypes.string.isRequired,
//   contestName: React.PropTypes.string.isRequired,
  onClick: React.PropTypes.func.isRequired,
// }
```

Now so that we can access the id of the selected contest, we need to update handleClick, which was previously logging the contest to the console.

```javascript
// class ContestPreview extends Component {
//   handleClick = () => {
    this.props.onClick(this.props.id)
// }
```

Because we are using the id prop for the first time here, we need to declare it as a PropTypes

```javascript
// ContestPreview.propTypes = {
     id: React.PropTypes.number.isRequired,
//   categoryName: React.PropTypes.string.isRequired,
//   contestName: React.PropTypes.string.isRequired,
//   onClick: React.PropTypes.func.isRequired,
// }
```

Now when we click on a ContestPreview div, the function to fetch the contest (which has been passed from the App) is called using the id prop of the ContestPreview instance, thereby changing the URL.

## Reducing an array in to an object

If you want to reference an element by id, looping over an array to find it is inefficient. Therefore we ought to turn the array in to an object so that the element can be referenced directly, and therefore in constant time.

```javascript
router.get('/contests', (req, res) => {
  res.send({ contests: data.contests});
});
```

Implementing a simple reduce function to return an object rather than an array.

```javascript
router.get('/contests', (req, res) => {
  res.send({
    contests: data.contests.reduce((obj, contest) => {
      obj[contest.id] = contest
      return obj;
    }, {})
  });
});
```

This can be refactored one step further, by taking the operation out and storing it as a variable.

```javascript
const contests = data.contests.reduce((obj, contest) => {
  obj[contest.id] = contest
  return obj;
}, {})

router.get('/contests', (req, res) => {
  res.send({
    contests: contests
  });
});
```

Given that we now have contests as an object rather than an array, we need to update a few references to it.

Firstly the PropType should change to an object

```javascript
// ContestList.propTypes = {
  contests: React.PropTypes.object,
// onContestClick: React.PropTypes.func.isRequired,
// }
```

Given that you cannot map an object, we need to map the keys of the object, so the ContestPreview iterator/props must be updated.

```javascript
const ContestList = ({contests, onContestClick}) => (
  <div>
  {Object.keys(contests).map(contestId =>
    <ContestPreview
    //referencing the contestId directly
    key={contestId}
    onClick={onContestClick}
    //looking up the contest by id as exposed by the loop
    {...contests[contestId]}/>
  )}
  </div>
);
```

## Changing the content

Now on click, we want to update the content, therefore must update the state of the application.

Within the fetchContent

```javascript
// fetchContest = (contestId) => {
//     pushState(
//       {currentContestId: contestId} ,
//       `/contest/${contestId}`
//     );
//     this.setState({
      pageHeader: this.state.contests[contestId].contestName
    });
// }
```

Currently all we are adding to the state is the name of the contest. If we want to do more with a given contest, we should grab its id.

```javascript
// fetchContest = (contestId) => {
//     pushState(
//       {currentContestId: contestId} ,
//       `/contest/${contestId}`
//     );
//     this.setState({
      pageHeader: this.state.contests[contestId].contestName,
      currentContestId: contestId
    });
// }
```

## Adding a conditional

In order to vary what we are displaying in our application, we must have a conditional statement.

To render a conditional statement, we have to define and call an instance function

Here we are calling our instance function which will return the content to render.

```javascript
// render(){
//     return (
//       <div>
//         <Header message = {this.state.pageHeader} />
          {this.currentContent()}
//     </div>
//   );
// };
```

Below we are defining the instance function within the app. This statement checks to see whether there is a currentContestId or not and then either returns a new contest component or the previously defined ContestList component.

```javascript
currentContent(){
    if (this.state.currentContestId) {
      return <Contest {...this.state.contest[this.state.currentContestId]} />

    }
    return  <ContestList
            onContestClick={this.fetchContest}
            contests={this.state.contests} />
  }
```

We now need to define the single Contest component

```javascript
//importing react and destructuring Component and PropTypes
import React, { Component, PropTypes } from 'react';

//making Contest a class rather than component to allow for future functionality
class Contest extends Component {
  render(){
    return(
      <div className="Contest">
          //displaying the id on the page
          {this.props.id}
      </div>
    )
  }
}

//declaring that id is a required number
Contest.propTypes = {
  id: PropTypes.number.isRequired
}

//exporting Contest by default
export default Contest
```

## Fetching information from an API onClick

When we click on an object, we need to fetch information from an API. Below we add a route to the previously defined API to return information

```javascript
//Adding a route with a parameter
router.get('/contests/:contestId', (req, res) => {
  //retreiving the specific contest (defined as a constant already)
  let contest = contests[req.params.contestId];
  //adding a dummy description
  contest.description = "Lorem ipsum dolor sit amet"
  //sending the contest
  res.send(contest);
});
```

So now the API will return information. However we need to fetch this information with AJAX.

Create a new file to contain all of the logic for the API.

```javascript
//importing axios to allow for AJAX calls
import axios from 'axios';

//exporting a function that fetches the data for a given contest
export const fetchContest = contestId => {
  return axios.get(`/api/contests/${contestId}`)
    .then(resp => resp.data)
}
```

Import all the api logic from api.js in to the app component. We do this because we will eventually be exporting multiple functions so want more than the default.

```javascript
import * as api from '../api'
```

Now we make a call to the api and move and refactor the old setState function to use the response from the API, rather than the state.

```javascript
// this.setState({
//       pageHeader: this.state.contests[contestId].contestName,
//       currentContestId: contestId
//     });

api.fetchContest(contestId).then(contest => {
    this.setState({
      pageHeader: contest.contestName,
      currentContestId: contest.id
    });
  })
```

Now that we have the ability to fetch data from an API, we may want to cache the information for performance benefits.

Below we set the state of contest to the previous contests, and then set the contest object as a value related to its id key.

```javascript
// api.fetchContest(contestId).then(contest -> {
//   this.setState({
//     pageHeader: contest.contestName,
//     currentContestId: contest.id,
    contests: {
      ...this.state.contests,
      [contest.id]: contest
    }
//   });
// })
```

Because we are now fetching our information from the api rather than the state, we can now include information that we previously did not have.

Given that our Contest is now coming from the api, we can add the description to the component, and render this on the page.

```javascript
// import React, { Component, PropTypes } from 'react';
//
// class Contest extends Component {
//   render(){
//     return(
//       <div className="Contest">
          {this.props.description}
//       </div>
//     )
//   }
// }
//
// Contest.propTypes = {
  description: PropTypes.string.isRequired
// }
//
// export default Contest
```

## Server-side routing

On the server side, we currently only have a '/' route. This means that although '/contest/1' (for example) is a valid route for the API, if we refresh the page, we cannot GET the route.

So, we need to add additional routes, done in an array here.

```javascript
// server.get(
  ['/', '/contest/:contestId']
  // , (req, res) => {
//   serverRender()
//     .then(({initialMarkup, initialData}) => {
//       res.render('index', {
//         initialMarkup,
//         initialData
//       });
//     })
//     .catch(console.error)
// });
```

The route is now handled but we now need to handle the different route to render something different.

We do this within serverRender. Previously serverRender would get information from a url and store data from that url. Now, because we have two routes (where we have a selected contest or not) we need to act accordingly. We can pass different urls/data depending on whether or not we have data

Returning the url based on whether there is a contestId or not, going to the specific contest's url if there is one

```javascript
const getApiUrl = contestId =>{
  if (contestId){
    return `${config.serverUrl}/api/contests/${contestId}`;
  }
  return `${config.serverUrl}/api/contests`;
}
```

The app component requires a data object to render. If we have a specific contest, we need to create a new data object of a single contest in order to have the view render properly. The below code returns a new data object containing only one key/value pair if there is a contestId. Otherwise, all the initial data is returned as before.

```javascript
const getInitialData = (contestId, apiData) => {
  if (contestId) {
    return {
      currentContestId: apiData.id,
      contests: {
        [apiData.id]: apiData
      }
    }
  }
  return {
    contests: apiData.contests
  }
}
```

Using both these methods in the server.get method

```javascript
//accepting the contestId parameter
const serverRender = (contestId) =>
  //making the call to the first function to receive the appropriate url
  axios.get(getApiUrl(contestId))
    .then(resp => {
      //defining the data to be rendered depending on whether there is a specified contest
      const initialData = getInitialData(contestId, resp.data)
      return {
        initialMarkup: ReactDomServer.renderToString(
          <App initialData={initialData} />
        ), initialData
      }
    });
```

## Navigating with links

The first step for navigating is creating something clickable. You can use a link class in react. Within the contest component (which is displayed when an individual contest is clicked on) we define a link. We are also defining an, as yet undefined, onClick function which will be handed down from the app component so that it can change the UI.
We also need to define the contestListClick PropType.

```javascript
<div className="home-link link"
      onClick={this.props.contestListClick}>
  Contest List
</div>

// Contest.propTypes = {
//   description: PropTypes.string.isRequired,
     contestListClick: PropTypes.func.isRequired
// }
```

In the app component we need to pass the contestListClick prop to the Contest

```javascript
// currentContent(){
//     if (this.state.currentContestId) {
//       return <Contest
              contestListClick={this.fetchContestList}
  //             {...this.currentContest()} />
  //
  //   }
  //   return  <ContestList
  //           onContestClick={this.fetchContest}
  //           contests={this.state.contests} />
  // }
```

We now need to define the fetchContestList function, the purpose of which is to fetch all of the Contests from the server.
So we need to add this api call to the api.

The api responds with an object of the contests

```javascript
export const fetchContestList = () => {
  return axios.get(`/api/contests`)
    .then(resp => resp.data.contests);
}
```

We the need to add a function which fetches this data from the api.

```javascript
fetchContestList = () => {
  //setting the currentContestId to null, to be used by renderServer
  pushState(
    {currentContestId: null},
    //taking the url to '/'
    `/`
  );
  //making the call to the api
  api.fetchContestList().then(contests => {
    this.setState({
      currentContestId: null,
      //putting the contests object on the state
      contests
    });
  });
}
```

## Navigating with browser buttons

Currently using the browser back and forward buttons does not make any changes. So we need to update the onPopState api in the window to show the content that we want. From above, we know that we show either a single contest or all of the contests depending on whether we have a currentContestId in our state. Therefore, we can take this information from the onPopState (which returns an event with the state) and apply some logic.

We can make a handler for the onPopState api in the app component.

```javascript
const onPopState = handler => {
  window.onpopstate = handler
}
```

Then in componentDidMount we want to set the current state equal to either a null (showing all the contests) or a number (showing the specific contest)

```javascript
componentDidMount(){
  onPopState((event) => {
    this.setState({
      currentContestId: (event.state || {}).currentContestId
    })
  })
}
```

You will get an error unless you clear the onPopState event on componentWillUnmount

```javascript
componentWillUnmount(){
  onPopState(null);
}
```
