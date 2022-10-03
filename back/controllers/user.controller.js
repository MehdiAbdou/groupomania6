const UserModel = require("../models/user.model");
const ObjectID = require("mongoose").Types.ObjectId;

//Obtenir les données de tous les utilisateurs
module.exports.getAllUsers = async (req, res) => {
  const users = await UserModel.find({}, {pseudo:true, picture:true, likes:true, createdAt:true, updatedAt: true, bio: true})
  res.status(200).json(users);
};

//Obtenir les données d'un seul utilisateur
module.exports.userInfo = (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    //Si l'id de la requête ne correspond pas je retourne une erreur
    return res.status(400).send("ID inconnu : " + req.params.id);

  UserModel.findById(req.params.id, (err, docs) => {
    //Si l'id correspond je récupère les données de l'utilisateur cible sans le mdp
    if (!err) res.send(docs);
    else console.log("ID inconnu : " + err);
  }).select("-password");
};

//Update profile user
module.exports.updateUser = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID inconnu : " + req.params.id);

  try {
    await UserModel.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          bio: req.body.bio,
        },
      },
      { upsert: true, setDefaultsOnInsert: true },
      (err, docs) => {
        if (!err) return res.send(docs);
        if (err) return res.status(500).send({ message: err });
      }
    );
  } catch (err) {
    return;
  }
};

