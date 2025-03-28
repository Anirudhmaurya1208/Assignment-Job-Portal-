const mongoose = require("mongoose");

exports.checkObjectId = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid Job ID" });
  }
  next();
};
