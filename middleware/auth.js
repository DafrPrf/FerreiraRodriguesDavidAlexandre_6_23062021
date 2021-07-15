const jwt = require('jsonwebtoken');

require('dotenv').config({ path: '../utils/.env' });

const secretToken = process.env.SECRET_TOKEN;

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, secretToken);
    const userId = decodedToken.userId;

    if (req.body.userId && req.body.userId !== userId) {
      throw 'User ID invalid';
    } else {
      next();
    }
  } catch (error) {
    res.status(400).json({ error });
  }
};
