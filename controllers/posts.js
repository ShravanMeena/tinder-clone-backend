import mongoose from "mongoose";
import PostMessage from "../models/postMessage.js";
import UserMessage from "../models/userMessage.js";

import Joi from "@hapi/joi";

// also called handlers/controllers
export const getPosts = (req, res) => {
  PostMessage.find((err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
};

// create
export const createPost = async (req, res) => {
  const post = req.body;

  await PostMessage.create(post, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send(data);
    }
  });
};

// delete
export const deletePost = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).json(`No post with id: ${id}`);

  await PostMessage.findByIdAndRemove(id);

  res.json({ message: "Post deleted successfully." });
};

// update post
export const updatePost = async (req, res) => {
  const { id } = req.params;
  const post = req.body;

  // their is post mean {creator, title, message, tags, selectedFile}

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No post with id: ${id}`);

  const updatedPost = { ...post, _id: id };

  await PostMessage.findByIdAndUpdate(id, updatedPost, { new: true });

  res.json(updatedPost);
};

// create like or update like(not working...)
export const likePost = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No post with id: ${id}`);

  const post = await PostMessage.findById(id);

  const updatedPost = await PostMessage.findByIdAndUpdate(
    id,
    { likeCount: post.likeCount + 1 },
    { new: true }
  );

  res.json(updatedPost);
};

// user
const schema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().min(4).required().email(),
  password: Joi.string().min(6).required(),
});

// create
export const createUser = async (req, res) => {
  // validate a user before we create a user
  const { error } = schema.validate(req.body);
  res.send(error);
  const user = req.body;

  await UserMessage.create(user, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send(data);
    }
  });
};

// get user
export const getUser = (req, res) => {
  UserMessage.find((err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
};
