const express = require("express");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config.js");
const zod = require("zod");
const { User, Account } = require("../db.js");
const authMiddleware = require("../middleware/authMiddleware.js");
const router = express.Router();



//SIGNUP

const signupBody = zod.object({
  username: zod.string(),
  email: zod.string().email(),
  password: zod.string(),
});

router.post("/signup", async (req, res) => {
  const { success } = signupBody.safeParse(req.body);
  const { username, password, email } = req.body;
  if (!success) {
    res.status(404).json({
      msg: "Invalid Details",
    });
  } else {
    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      return res.status(411).json({
        message: "Email already taken",
        redirect: "/signin",
      });
    } else {
      const user = await User.create({
        username,
        email,
        password,
      });
      const userId = user._id;
      await Account.create({
        userId,
        balance: 1 + Math.random() * 10000
    })

      res.status(200).json({
        msg: "Successfully Registered",
        redirect: "/signin",
      });
    }
  }
});


//SIGNIN

const signinBody = zod.object({
  email: zod.string().email(),
  password: zod.string(),
});

router.post("/signin", async (req, res) => {
  const { success } = signinBody.safeParse(req.body);
  const { password, email } = req.body;

  if (!success) {
    res.status(404).json({
      msg: "Invalid Details",
    });
  } else {
    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      if (existingUser.password == password) {
        const token = jwt.sign({ userId: existingUser._id }, JWT_SECRET);
        res.status(200).json({
          token,
        });
      } else {
        res.status(404).json({
          msg: "Invalid password",
        });
      }
    } else {
      res.status(404).json({
        msg: "Invalid email",
      });
    }
  }
});



//UPDATE

const updateBody = zod.object({
  password: zod.string().optional(),
  username: zod.string().optional(),
  email: zod.string().optional(),
});

router.put('/update', authMiddleware, async (req, res) => {
  const { success } = updateBody.safeParse(req.body);

  if (!success) {
      return res.status(411).json({ message: "Error while updating information" });
  }

  if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "At least one field is required for update" });
  }

  try {
      await User.updateOne({ _id: req.userId }, { $set: req.body });

      res.json({ message: "Updated successfully" });
  } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
  }
});




// GET ALL USERS

router.get('/users', authMiddleware, async (req, res) => {
    try {
        const users = await User.find({ _id: { $ne: req.userId } });
        const account = await Account.findOne({ userId: req.userId });

        res.json({
            users,
            balance: account ? account.balance : 0 
        });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});


//GET MY DETAILS

router.get('/details', authMiddleware, async (req, res) => {
  try {
      const user = await User.findById(req.userId).select("username");
      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }

      res.json(user);
  } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
  }
});



module.exports = router;
