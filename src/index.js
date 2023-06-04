import express from 'express'
import bodyParser from 'body-parser'

import handleAuthRequest from './auth'
import handleStaffRequest from './staff'
import handleActivitiesRequest from './activities'
import handleSubscriberRequest from './subscribers'
import handleSendmailRequest from './mailer'
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


app.post('/sendmail', authenticate, sendmailController);
app.get('/sendmail', authenticate, sendmailController);

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


app.all('/staff', authenticate, staffController);
app.put('/staff', authenticate, staffController);
app.post('/staff/add', authenticate, staffController);
app.post('/staff/auth', staffController);
// app.post('/staff/reset', staffController);
app.get('/staff/:id', authenticate, staffController);
// app.delete('/staff/?id=:id', staffController);
app.get('/staff/?id=:id', authenticate, staffController);
app.get('/staff/find/?email=:email', authenticate, staffController);

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



app.get('/activities', authenticate, activitiesController);
app.post('/activities/add', authenticate, activitiesController);
app.delete('/activities/:id', authenticate, activitiesController);
app.get('/activities?month=:month', authenticate, activitiesController);
app.get('/activities?year=:year', authenticate, activitiesController);


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
app.post('/subscriber/add', authenticate, subscriberController);
app.put('/subscriber', authenticate, subscriberController);
app.post('/subscriber/update', authenticate, subscriberController);
app.delete('/subscriber?id=:id', authenticate, subscriberController);
app.get('/subscriber/:id', authenticate, subscriberController);
app.get('/subscriber?id=:id', authenticate, subscriberController);

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