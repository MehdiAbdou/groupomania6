const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

//Schema de création d'une fiche utilisateur.
const userSchema = new mongoose.Schema(
  {
    pseudo: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 30,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      validate: [isEmail],
      lowercase: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      max: 44,
      minlength: 4,
    },
    picture: {
      type: String,
      default: "./uploads/profil/random-user.png",
    },
    bio: {
      type: String,
      max: 1024,
    },
    likes: {
      type: [String],
    },
    isAdmin: {
      type: Boolean, 
      default : false
    }
  },
  {
    timestamps: true,
  }
);

// fonction pour saler les mots de passe.
userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

//fonction pour dessaler un mot de passe
userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error("Mauvais mot de passe");
  }
  throw Error("E-mail incorrect");
};

const UserModel = mongoose.model("user", userSchema);

module.exports = UserModel;
