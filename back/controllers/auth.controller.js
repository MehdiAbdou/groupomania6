const UserModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const { signUpErrors, signInErrors } = require('../utils/errors.utils');

const maxAge = 1000 * 60 * 60 * 24;
const createToken = (id) => {
  return jwt.sign({ id }, process.env.TOKEN_SECRET, {
    //token valable 24h
    expiresIn: maxAge , 
  });
};

module.exports.signUp = async (req, res) => {
  const { pseudo, email, password } = req.body; 

  try {
    const user = await UserModel.create({ pseudo, email, password }); 
  } catch (err) {
    const errors = signUpErrors(err);
    res.status(200).send({ errors });
  }
};

module.exports.signIn = async (req, res) => {
  const { email, password } = req.body; //destructuring comme dans le signUp, on pourrait également faire comme suit:
  
  try {
    const user = await UserModel.login(email, password);
    const token = createToken(user._id);
    res.cookie("jwt", token, {
      httpOnly: true,
      sameSite: "Lax",
      secure: false,
      maxAge,
    });
    res.status(200).json({ user: user._id });
  } catch (err) {
    const errors = signInErrors(err);
    res.status(200).json({ errors });
  }
};

module.exports.logout = async (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 }); //on attribue un cookie qui va vivre 1ms, puis rediriger l'utilisateur
  res.redirect("/");
};


