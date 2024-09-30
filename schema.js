const mongoose = require("mongoose");

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
});

// Folder Schema
const folderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  parentFolderId: { type: mongoose.Schema.Types.ObjectId, ref: "Folder" },
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Email Schema
const emailSchema = new mongoose.Schema({
  senderEmail: { type: String, required: true },
  subject: String,
  body: String,
  createdAt: { type: Date, default: Date.now },
  recipient: {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    /** it is optional, according to requirement user may organize it in folder hierarchy */
    folderId: { type: mongoose.Schema.Types.ObjectId, ref: "Folder" },
  },
});



// Indexes
folderSchema.index({ userId: 1, name: 1 });
emailSchema.index({ "recipient.userId": 1, "recipient.folderId": 1, createdAt: -1 });
emailSchema.index({ createdAt: -1 });

// Models
const User = mongoose.model("User", userSchema);
const Folder = mongoose.model("Folder", folderSchema);
const Email = mongoose.model("Email", emailSchema);

module.exports = { User, Folder, Email };
