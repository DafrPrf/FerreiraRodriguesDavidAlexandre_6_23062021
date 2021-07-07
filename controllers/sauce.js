const Sauce = require('../models/Sauce');
const fs = require('fs');

exports.createSauces = (req, res, next) => {
  const parsedBody = JSON.parse(req.body.sauce);
  const sauce = new Sauce({
    ...parsedBody,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${
      req.file.filename
    }`,
  });
  sauce
    .save()
    .then(() => res.status(201).json({ message: 'Sauce saved' }))
    .catch((error) => res.status(400).json({ error }));
};

exports.modifySauces = (req, res, next) => {
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };
  Sauce.updateOne(
    { _id: req.params.id },
    { ...sauceObject, _id: req.params.id }
  )
    .then(() => res.status(200).json({ message: 'Sauce modified !' }))
    .catch((error) => res.status(400).json({ error }));
};

exports.deleteSauces = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'sauce deleted !' }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(400).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(400).json({ error }));
};

exports.likes = (req, res, next) => {
  const userId = req.body.userId;
  const like = req.body.like;

  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (like === 1 && !sauce.usersLiked.includes(userId)) {
        Sauce.updateOne({
          $inc: { likes: 1 },
          $push: { usersLiked: userId },
        })
          .then(() => res.status(201).json({ message: 'liked' }))
          .catch((err) => res.status(400).json({ err }));
      }

      if (like === 0 && sauce.likes > 0 && sauce.usersLiked.includes(userId)) {
        Sauce.updateOne({
          $inc: { likes: -1 },
          $pull: { usersLiked: userId },
        })
          .then(() => res.status(201).json({ message: 'like removed' }))
          .catch((err) => res.status(400).json({ err }));
      }

      if (like === -1) {
        Sauce.updateOne({
          $inc: { likes: 1 },
          $push: { usersDisliked: userId },
        })
          .then(() => res.status(201).json({ message: 'disliked' }))
          .catch((err) => res.status(400).json({ err }));
      }
    })
    .catch((err) => res.status(404).json({ err }));
};
