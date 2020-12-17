import mongoose from "mongoose";
// const { Schema } = mongoose;

const cardSchema = mongoose.Schema({
  title: String,
  imgUrl: String,
});

export default mongoose.model("cards", cardSchema);
