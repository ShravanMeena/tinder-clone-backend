import mongoose from "mongoose";
import PostMessage from "../models/postMessage.js";
import UserMessage from "../models/userMessage.js";
import { userRegistrationValidation, loginValidation } from "../validation.js";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import dotenv from "dotenv";

dotenv.config();

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

// get post with id
export const getPost = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).json(`No post with id: ${id}`);
  const data = await PostMessage.findById(id);
  res.json(data);
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

// create comment or update like(not working...)
export const commentPost = async (req, res) => {
  const { id } = req.params;
  const post = req.body;
  // their is post mean {creator, title, message, tags, selectedFile}

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No post with id: ${id}`);

  const updatedPost = { ...post, _id: id };

  await PostMessage.findByIdAndUpdate(id, updatedPost, { new: true });

  res.json(updatedPost);
};

// user

// register user
export const createUser = async (req, res) => {
  // validate a user before we create a user
  const { error } = userRegistrationValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // check if the user already registerd or not
  const emailExist = await UserMessage.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send("Email already exist");

  // hash password
  var salt = await bcrypt.genSalt(10);

  var hash = await bcrypt.hash(req.body.password, salt);

  // create a user
  const user = new UserMessage({
    name: req.body.name,
    email: req.body.email,
    password: hash,
  });
  await UserMessage.create(user, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send(data);
    }
  });
};

// login user
export const loginUser = async (req, res) => {
  // validate a user before we create a user
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // check if the user already registerd or not /email exist or ot
  const user = await UserMessage.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Email is not found");

  // check if the user already registerd or not /password exist or ot
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).send("password is wrong");

  // create and send token
  var token = jwt.sign({ _id: user._id }, process.env.SECRET_TOKEN);
  res.header("auth-token", token).send(token);
  res.send("logged in succesfully");
};
