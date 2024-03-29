var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var EventSchema = new Schema(
  {
    eventName: {
      type: String,
      require: true,
    },
    invitedUsers: [],
    createdBy: {
      type: String,
      require: true,
    },
    time: {
      type: Date,
      require: true,
    },
    description: {
      type: String,
      require: true,
    },

    // email: {
    //   type: String,
    //   require: true,
    // },
    // posts: [
    //   {
    //     type: Schema.Types.ObjectId,
    //     ref: "Post",
    //   },
    // ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Event", EventSchema);
