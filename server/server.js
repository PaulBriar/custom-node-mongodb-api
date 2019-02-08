'use strict';
require('./config/config');

const _ = require('lodash');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodo');

let { Stream } = require('./models/streams');

const express = require('express');
const app = express();

const port = process.env.PORT;

app.use(bodyParser.json());

app.get("/streams", async (req, res) => {
  try {
    const streams = await Stream.find({});
    res.send({streams});
  } catch (err) {
    res.status(400).send(err);
  }
});

//Add new stream
app.post("/streams", async (req, res) => {
  try {
    let stream = new Stream({
      title: req.body.title,
      desc: req.body.desc
    });
    await stream.save();
    res.send(stream);
  } catch (err) {
    res.status(400).send(err);
  }
});

//Get stream by id
app.get("/streams/:id", async (req, res ) => {
  try {
    let id = req.params.id;
    if(!ObjectID.isValid(id)) {
      return res.status(404).send();
    };
    const stream = await Stream.findOne({_id:id});
    !stream ? console.log('Stream not found') : res.send({stream});

  }catch (err) {
    res.status(400).send(err);
  }
});

//Update stream by id
app.patch("/streams/:id", async (req, res) => {
  try {
    let id = req.params.id;
    let body = _.pick(req.body, ['title', 'desc']);
    if(!ObjectID.isValid(id)) {
      return res.status(404).send();
    };
    const stream = await Stream.findOneAndUpdate({
      _id: id,
    }, {$set: body}, {new: true});
    !stream ? res.status(404).send() : res.send({stream});
  } catch (err) {
    res.status(400).send(err);
  }
});

//Delete stream by id
app.delete("/streams/:id", async (req, res) => {
  const id = req.params.id;
  if(!ObjectID.isValid(id)) {
    return res.status(404).send();
  };

  try {
    const stream = await Stream.findOneAndRemove({
      _id: id,
    });
    !stream ? res.status(404).send(): res.status(200).send({stream});
  } catch (err) {
    res.status(400).send(err);
  }
});

app.listen(port, () => console.log(`Server running on port ${port}`));

module.exports = {app};
