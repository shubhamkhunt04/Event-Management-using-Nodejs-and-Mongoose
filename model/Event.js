var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var EventSchema = new Schema(
  {
    name: {
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
