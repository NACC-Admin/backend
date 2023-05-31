import express from 'express'
import bodyParser from 'body-parser'

import handleAuthRequest from './auth'
import handleStaffRequest from './staff'

import handleActivitiesRequest from './activities'

import handleSubscriberRequest from './subscribers'

// import handleMessagesRequest from './messages'
// import handleTrendingReactRequest from './trending-react'
// import handleTrendingReactCommentRequest from './trending-react-comment'
// import handleFollowerRequest from './followers'

import handleSendmailRequest from './mailer'

// import handleContactRequest from './contact'

import adaptRequest from './helpers/adapt-request'

var cors = require('cors')
const app = express();
app.use(bodyParser.json());

const port = process.env.PORT || 9090;

//Middleware
app.use(express.urlencoded({ extended: true}));
app.use(express.json());

app.use(cors());


function authenticate (req, res, next) {
  const httpRequest = adaptRequest(req)
  
  handleAuthRequest(httpRequest)
      .then(({ statusCode }) => {
       
        if(statusCode == 200){
          next();
        } 
        else {
          console.log("Unauthorized access")
          res.json({message: "Unauthorized access"})
        }

    })
    .catch(e => {console.log(e)})
}


app.post('/sendmail', sendmailController);
app.get('/sendmail', sendmailController);

function sendmailController (req, res) {
  const httpRequest = adaptRequest(req)
  handleSendmailRequest(httpRequest)
      .then(({ headers, statusCode, data }) =>
      res
          .set(headers)
          .status(statusCode) 
          .send(data)
      )
      .catch(e => res.status(500).end())
}


app.all('/staff', staffController);
app.post('/staff/add', staffController);
app.post('/staff/auth', staffController);
app.post('/staff/reset', staffController);
app.get('/staff/:id', staffController);
app.get('/staff/?id=:id', staffController);
app.get('/staff/find/?email=:email', staffController);

function staffController (req, res) {
    const httpRequest = adaptRequest(req)
    handleStaffRequest(httpRequest)
        .then(({ headers, statusCode, data }) =>
        res
            .set(headers)
            .status(statusCode) 
            .send(data)
        )
        .catch(e => res.status(500).end())
}



app.get('/activities', activitiesController);
app.post('/activities/add', activitiesController);
app.delete('/activities/:id', activitiesController);
app.get('/activities?month=:month', activitiesController);
app.get('/activities?year=:year', activitiesController);
app.get('/activities?dday=:dday&dmonth=:dmonth&dyear=:dyear', activitiesController);


function activitiesController (req, res) {
  
  const httpRequest = adaptRequest(req)
  handleActivitiesRequest(httpRequest)
    .then(({ headers, statusCode, data }) =>
      res
        .set(headers)
        .status(statusCode) 
        .send(data)
    )
    .catch(e => res.status(500).end())
}




app.all('/subscriber', authenticate, subscriberController);
app.post('/subscriber/add', subscriberController);
app.post('/subscriber/update', subscriberController);
app.delete('/subscriber/:id', subscriberController);
app.get('/subscriber/:id', subscriberController);
app.get('/subscriber?id=:id', subscriberController);

function subscriberController (req, res) {
  
  const httpRequest = adaptRequest(req)
  handleSubscriberRequest(httpRequest)
    .then(({ headers, statusCode, data }) =>
      res
        .set(headers)
        .status(statusCode) 
        .send(data)
    )
    .catch(e => res.status(500).end())
}



app.all('/auth', authController);
app.get('/auth/:id', authController);
app.get('/auth/check_token', authController);

function authController (req, res) {
  const httpRequest = adaptRequest(req)
  handleAuthRequest(httpRequest)
      .then(({ headers, statusCode, data }) =>
      res
          .set(headers)
          .status(statusCode) 
          .send(data)
      )
      .catch(e => res.status(500).end())
}


app.listen(port, () => console.log(`Listening on port 9090`+process.env.PORT || 9090));