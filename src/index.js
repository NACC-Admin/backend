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

const fs = require('fs')
const https = require('https')

const key = fs.readFileSync('private.key')
const cert = fs.readFileSync('certificate.crt')

const port = process.env.PORT || 9090;

//Middleware
app.use(express.urlencoded({ extended: true}));
app.use(express.json());

app.use(cors());

// app.get('/.well-known/pki-validation/39E87E8F368589DE8F7FFB9F4D079CFA.txt', (req, res) => {
//   res.sendFile('/home/ec2-user/backend/src/39E87E8F368589DE8F7FFB9F4D079CFA.txt')
// })

const credentials = {
  key,
  cert
}

function authenticate (req, res, next) {
  const httpRequest = adaptRequest(req)
  
  handleAuthRequest(httpRequest)
      .then(({ statusCode }) => {
       
        if(statusCode == 200){
          next();
        } 
        else {
          // console.log("Unauthorized access")
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
app.put('/staff', staffController);
app.post('/staff/add', authenticate, staffController);
app.post('/staff/auth', staffController);
// app.post('/staff/reset', staffController);
app.get('/staff/:id', staffController);
// app.delete('/staff/?id=:id', staffController);
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




app.all('/subscriber', subscriberController);
app.post('/subscriber/add', subscriberController);
app.put('/subscriber', subscriberController);
app.post('/subscriber/update', subscriberController);
app.delete('/subscriber?id=:id', subscriberController);
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

const httpServer = https.createServer(credentials, app);
httpServer.listen(9443)