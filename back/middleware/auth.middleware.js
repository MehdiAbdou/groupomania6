const jwt = require("jsonwebtoken");
const postModel = require("../models/post.model");
const UserModel = require("../models/user.model");

module.exports.checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        res.cookie("jwt", "", { maxAge: 1 });
        next();
      } else {
        let user = await UserModel.findById(decodedToken.id);
        res.locals.user = user;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};

//Vérif token
module.exports.requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
      if (err) {
        res.send(200).json("Pas de token");
      } else {
        next();
      }
    });
  } else {
    return null;
  }
};

//vérif Admin

module.exports.isPostAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return console.log("Pas de token");
  } else {
    jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
      if (!err) {
        let user = await UserModel.findById(decodedToken.id);
        let poster = await postModel.findById(req.params.id);
        if (poster.posterId === user.id || user.isAdmin === true) {
          res.locals.user = user;
          next();
        } else {
          res.locals.user = null;
          res.cookie("jwt", "", { maxAge: 1 });
          res.sendStatus(401).json();
        }
      }
    });
  }
};

module.exports.isUserAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return console.log("Pas de token");
  } else {
    jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
      if (!err) {
        let requestingUser = await UserModel.findById(decodedToken.id);
        let updatingUser = await UserModel.findById(req.params.id);
        if (
          requestingUser.id === updatingUser.id ||
          requestingUser.isAdmin === true
        ) {
          res.locals.user = updatingUser;
          next();
        } else {
          res.locals.user = null;
          res.cookie("jwt", "", { maxAge: 1 });
          res.sendStatus(401).json();
        }
      }
    });
  }
};

module.exports.isUploadAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return console.log("Pas de token");
  } else {
    jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
      if (!err) {
        let requestingUser = await UserModel.findById(decodedToken.id);
        let updatingUser = await UserModel.findById(req.body.userId);
        if (
          requestingUser.id === updatingUser.id ||
          requestingUser.isAdmin === true
        ) {
          res.locals.user = updatingUser;
          next();
        } else {
          res.locals.user = null;
          res.cookie("jwt", "", { maxAge: 1 });
          res.sendStatus(401).json();
        }
      }
    });
  }
};
