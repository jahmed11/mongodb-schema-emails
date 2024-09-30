const { Email } = require("../models/schema");
const mongoose = require("mongoose");

/** Query with userId and foldername */

const getEmailsByFolderName = async (id, folderName, skip = 0, limit = 20) => {
  const userId = mongoose.isValidObjectId(id) ? new mongoose.Types.ObjectId(id) : id;
  const emails = await Email.aggregate([
    {
      $lookup: {
        from: "folders",
        localField: "recipient.folderId",
        foreignField: "_id",
        as: "folderDetails",
      },
    },
    {
      $match: {
        "recipient.userId": userId,
        "folderDetails.name": folderName,
      },
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
    {
      $project: {
        senderEmail: 1,
        subject: 1,
        body: 1,
        createdAt: 1,
      },
    },

    {
      $skip: skip,
    },
    {
      $limit: limit,
    },
  ]);

  return emails;
};

/** Query with folderId and userId. it is faster because it involved only one table */
const getEmailsByFolderId = async (userId, folderId, skip = 1, limit = 50) => {
  const emails = await Email.aggregate([
    {
      $match: {
        recipient: {
          userId: new mongoose.Types.ObjectId(userId),
          folderId: new mongoose.Types.ObjectId(folderId),
        },
      },
    },
    {
      $project: {
        senderEmail: 1,
        subject: 1,
        body: 1,
        createdAt: 1,
      },
    },
    { $sort: { createdAt: -1 } },
    { $skip: skip },
    { $limit: limit },
  ]);

  return emails;
};
