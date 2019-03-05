'use strict';
const _ = require('lodash');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { ObjectID } = require('mongodb');

const Feed = require('./models/feeds');
const auth = require('./config/config');

const express = require('express');
const cors = require('cors');
const app = express();

const port = process.env.PORT || 3000;

app.use(cors());

//Mlab Connection
const mongodbUri ='mongodb://@ds211275.mlab.com:11275/streams-api';
mongoose.connect(mongodbUri, {
  useNewUrlParser: true,
  auth,
});
const conn = mongoose.connection;
conn.on('error', console.error.bind(console, 'connection error:'));

conn.once('open', () =>{
 console.log('connected to database')
});

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send('Welcome to the Feeds Api -- Go to /feeds for the json data');
});

app.get("/feeds", async (req, res) => {
  try {
    const feeds = await Feed.find({});
    res.json({feeds});
  } catch (err) {
    res.status(400).send(err);
  }
});

//Add new stream
app.post("/feeds", async (req, res) => {
  try {
    let feed = new Feed({
      title: req.body.title,
      body: req.body.body,
      author: req.body.author
    });
    await feed.save();
    res.send(feed);
  } catch (err) {
    res.status(400).send(err);
  }
});

//Get stream by id
app.get("/feeds/:id", async (req, res ) => {
  try {
    let id = req.params.id;
    if(!ObjectID.isValid(id)) {
      return res.status(404).send();
    };
    const feed = await Feed.findOne({_id:id});
    !feed ? console.log('Feed not found') : res.send({feed});

  }catch (err) {
    res.status(400).send(err);
  }
});

//Update stream by id
app.patch("/feeds/:id", async (req, res) => {
  try {
    let id = req.params.id;
    let body = _.pick(req.body, ['body']);
    if(!ObjectID.isValid(id)) {
      return res.status(404).send();
    };
    const feed = await Feed.findOneAndUpdate({
      _id: id,
    }, {$set: body}, {new: true});
    !feed ? res.status(404).send() : res.send({feed});
  } catch (err) {
    res.status(400).send(err);
  }
});

//Delete stream by id
app.delete("/feeds/:id", async (req, res) => {
  const id = req.params.id;
  if(!ObjectID.isValid(id)) {
    return res.status(404).send();
  };

  try {
    const feed = await Feed.findOneAndRemove({
      _id: id,
    });
    !feed ? res.status(404).send(): res.status(200).send({feed});
  } catch (err) {
    res.status(400).send(err);
  }
});

app.listen(port, () => console.log(`Server running on port ${port}`));

module.exports = {app};
