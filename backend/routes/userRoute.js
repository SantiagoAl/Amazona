import express from "express";
import { getToken } from "../util";
import User from "../models/userModel";
const bcrypt = require("bcrypt");

const router = express.Router();

router.post("/signin", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  await User.findOne({
    email: email,
  })
    .then((user) => {
      if (user === null) {
        return res.status(404).json({
          msg: "Authorization Unsuccessful",
        });
      }

      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          return res.status(401).json({
            msg: "Authorization Unsuccessful",
          });
        }

        if (result) {
          return res.status(200).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: getToken(user),
          });
        } else {
          res.status(401).json({
            msg: "Authorization Unsuccessful",
          });
        }
      });
    })
    .catch((err) => res.status(500).json("Error: " + err));
});

router.post("/register", async (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  await User.find({ email: email })
    .then((user) => {
      if (user.length >= 1) {
        return res.status(409).json({
          msg: "User already exists",
        });
      } else {
        bcrypt.hash(password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err,
            });
          } else {
            const newUser = new User({
              name: name,
              email: email,
              password: hash,
            });

            newUser
              .save()
              .then(() => {
                res.status(200).json({
                  _id: newUser.id,
                  name: newUser.name,
                  email: newUser.email,
                  isAdmin: newUser.isAdmin,
                  token: getToken(newUser),
                });
              })
              .catch((err) => res.status(500).json("Error: " + err));
          }
        });
      }
    })
    .catch((err) => res.status(500).json("Error: " + err));
});

router.post("/createadmin", async (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  await User.find({ email: email })
    .then((user) => {
      if (user.length >= 1) {
        res.status(409).json({
          msg: "Admin already exists",
        });
      } else {
        bcrypt.hash(password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err,
            });
          } else {
            const newUser = new User({
              name: name,
              email: email,
              password: hash,
              isAdmin: true,
            });

            newUser
              .save()
              .then(() => {
                res.status(200).json(newUser);
              })
              .catch((err) => res.status(500).json("Error: " + err));
          }
        });
      }
    })
    .catch((err) => res.status(500).json("Error: Here is the error"));
});

export default router;
