import { Schema, model } from "mongoose";

const testSchema = new Schema({
  message: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

const TestModel = model("Test", testSchema);

export default TestModel;