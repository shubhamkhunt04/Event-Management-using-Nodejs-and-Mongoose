var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UserSchema = new Schema(
  {
    username: {
      type: String,
      require: true,
      trim: true,
    },
    email: {
      type: String,
      require: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      trim: true,
    },
    resetPasswordToken: {
      type: String,
      default: "",
    },
    resetPasswordExpires: {
      type: String,
      default: "",
    },

    userEvents: [
      {
        type: Schema.Types.ObjectId,
        ref: "Event",
      },
    ],
    invitedEvents: [
      // {
      //   type: Schema.Types.ObjectId,
      //   ref: "Event",
      // },
    ],

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

module.exports = mongoose.model("User", UserSchema);
