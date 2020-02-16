---
layout: post
blog: true
title:  "Mongo and React"
date:   2017-2-13 13:02:00 +0000
categories: jekyll update
author: ed
hidden: true
---

# A collection of useful snippets from my time playing with React

## Configuring an api to Mongo

Import the mongo client

```javascript
import { MongoClient } from 'mongodb'
```

Import assert library and config as well as part of the setup.

```javascript
import assert from 'assert';
import config from '../congif';
```

Connecting to the mongodbUri. Callback exposes an error and then the connected db. Raise an error if an error exists, otherwise assign the mdb to the global object.

```javascript
let mdb;
MongoClient.connect(config.mongodbUri, (err, db) => {
  assert.equal(null, err);

  mdb = db;
});
```

## Returning data

How to return multiple entries

```javascript
router.get('/contests', (req, res) => {
  //an object to collect retrieved objects
  let contests = {};
  //specify the collection (think table) that you want to look in
  mdb.collection('contests').find({})

    //.project can be omitted, it is used to specify specific fields
    .project({
      id: 1,
      categoryName: 1,
      contestName: 1
    })
    //to iterate over the objects
    .each((err, contest) => {
      //receiving an error message
      assert.equal(null, err);

      //if there is no longer a contest (because they have all been iterated over) then send the response
      if (!contest) {
        res.send({contests});
        return;
      }

      //set the data for a given contest with the id as the key
      contests[contest.id] = contest;
    });
});
```

How to return a single entry

```javascript
router.get('/contests/:contestId', (req, res) => {
  mdb.collection('contests')
    //function to return one entry - turning a string in to a number
    .findOne({id: Number(req.params.contestId)})
    //return the contest immediately because there is only one
    .then(contest => res.send(contest))
    .catch(console.error)
});
```

How to return values from an array

```javascript
// router.get('/names/:nameIds', (req, res) => {
  // taking the parameters, and setting them to an array of numbers
  const nameIds = req.params.nameIds.split(',').map(Number);
//   let names = {};
  // $in
  mdb.collection('names').find({id: {$in: nameIds}})
//     .each((err, name) => {
//       assert.equal(null, err);
//
//       if (!name) {
//         res.send({names});
//         return;
//       }
//
//       names[name.id] = name;
//     });
// });
```

## Displaying information from an api

Suppose you want a component to fetch its own related data. Here you would use componentDidMount to fetch the data. We want to keep all information on the state in the api, so will pass the information from the app component to the sub-component.

So we need to pass a function to fetch the information to the sub-comonent.

So we need to define the function in the app component

```javascript
fetchNames = (nameIds) => {
    //a guard against no names
    if (nameIds.length === 0){
      return;
    }
    api.fetchNames(nameIds).then(names => {
      this.setState({names});
    });
  }
```

and the api

```javascript
export const fetchNames = nameIds => {
  return axios.get(`/api/names/${nameIds.join(',')}`)
    .then(resp => resp.data)
}
```

Then define the proptype and call the function in the sub-component. We are also defining an array of nameIds that are related to the subcomponent which get passed to the fetch names function.

```javascript
componentDidMount(){
    this.props.fetchNames(this.props.nameIds);
  }

Contest.propTypes = {
  // description: PropTypes.string.isRequired,
  // contestListClick: PropTypes.func.isRequired,
  fetchNames: PropTypes.func.isRequired,
  nameIds: PropTypes.array.isRequired
};
```

Now that we have our nameIds, we can map these in to <li> objects. Note we are using .name to render a string, rather than an object, which is not possible in React.

```javascript
{this.props.nameIds.map(nameId =>
  <li className="list-group-item">{nameId}.name</li>
)}
```

Currently this is just returning the id, so we need to then find the name that is related to that id.React will to lookupNames that are undefined when the first page is loaded. To avoid an error, we need to put in a guard against this, a fake name object.

```javascript
lookupName = (nameId) => {
  //if no names or no name for a specific nameId then return a mark (could be a loader in the future)
  if (!this.state.names || !this.state.names[nameId]){
    return {
        name: '...'
    };
  }
  return this.state.names[nameId];
}
```

## Using Mongos Ids

In the above code we have used a manual 'id' field. However Mongo uses an '\_id' field that is auto generated on insertion (although you can add your own).

So, we need to update our code to handle this. We can find all instances of 'id' where we have typed it using grep to let us know where we need to make updates.

```
git grep "\.id"
```

We take a comma separated list of Ids and map them in to numbers. However in Mongo we need to use ObjectIds, so we need to map the comma separated values in to ObjectIds using the ObjectID function imported from Mongo.

```javascript
import { MongoClient, ObjectID } from 'mongodb';
```

```javascript
// router.get('/names/:nameIds', (req, res) => {
  const nameIds = req.params.nameIds.split(',').map(ObjectID);
//   let names = {};
//   mdb.collection('names').find({_id: {$in: nameIds}})
//     .each((err, name) => {
//       assert.equal(null, err);
//
//       if (!name) {
//         res.send({names});
//         return;
//       }
//
//       names[name._id] = name;
//     });
// });
```

## Sending the user an error page

We were logging the error to the console. Lets send the user a message if there is a bad request.

```javascript
// server.get(['/', '/contest/:contestId'], (req, res) => {
//   serverRender(req.params.contestId)
//     .then(({initialMarkup, initialData}) => {
//       res.render('index', {
//         initialMarkup,
//         initialData
//       });
//     })
    .catch(error => {
      console.error(error);
      res.status(404).send('Bad Request');
    });
// });
```

## Sending data to Mongo

We will be sending (posting) information to the api as a JSON object. The data of which needs to be parsed from the body parameter of express. In order to parse it, we need to use the express middleware, body-parser.

The api will need to do 3 things,
Create a name, read the created name id and then update the contest by appending the new name to the contest.

```javascript
router.post('/names', (req, res) => {
  //setting two constants from the response
  const contestId = ObjectID(req.body.contestId);
  const name = req.body.newName;

  //insert the object (from the above constant) name and with return value of that (as well as the given contestId) update the related contest with the new name.
  mdb.collection('names').insertOne({name}).then(result =>
    mdb.collection('contests').findAndModify(
      { _id: contestId},
      [],
      { $push: {nameIds: result.insertedId}},
      { new: true}
    )
    //return a response with the updatedContest and the newName
    .then(doc =>
      res.send({
        updatedContest: doc.value,
        newName: {_id: result.insertedId, name}
      })
    )
  )
  .catch(error => {
    console.error(error);
    res.status(404).send('Bad Request');
  });
});
```

## Passing information from the front end to the server

We currently have a form, that we will use to pass data to the front end. By default a form will submit data on click. We need to override this as well as adding other functionality, so we add a function to onSubmit. We also will add a reference so that we can refer to the form in React

```javascript
// <form
    onSubmit={this.handleSubmit}>
//   <div className="input-group">
//     <input type="text"
//       placeholder="New Name Here..."
    ref="newNameInput"
//       className="form-control" />
//     <span className="input-group-btn">
//       <button type="submit" className="btn btn-info">
//         Sumbit
//       </button>
//     </span>
//   </div>
// </form>
```

Then we need to define the handleSubmit function. Here we are using console.log for testing purposes, to make sure we can access the value on the form.

```javascript
handleSubmit = (event) => {
  event.preventDefault();
  console.log(this.refs.newNameInput.value);
}
```

We will want to store the new name in the state, which we keep in the app component, so we need to define a function in the app component to add a name and pass it to the contest component. (We have done this before so I wont copy the code - we need to define the function in app, pass it to the contest component and then add it as a proptype to the component function)

```javascript
handleSubmit = (event) => {
  event.preventDefault();
  this.props.addName(this.refs.newNameInput.value, this.props._id);
  this.refs.newNameInput.value = '';
}
```

Now we need to define the api call

```javascript
//passing the two required pieces of information to the api call
export const addName = (newName, contestId) => {
  //using axios to interact with our api
  return axios.post('/api/names', {newName, contestId})
    .then(resp => resp.data);
};
```

Finally in the app component we need to define the addName function to join the handleSubmit event with the addName api.

```javascript
addName = (newName, contestId) => {
  //call the defined addName function
  api.addName(newName, contestId).then(resp =>
    //setting the state of the app component
    this.setState({
      contests: {
        //use the existing contests
        ...this.state.contests,
        //add the newly defined contest
        [resp.updatedContest._id]: resp.updatedContest
      },
      names: {
        //use the existing names
        ...this.state.names,
        //add the newly defined name
        [resp.newName._id]: resp.newName
      }
    })
  )
  .catch(console.error);
}
```
