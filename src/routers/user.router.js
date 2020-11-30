const express = require("express");
const router = express.Router();

const { insertUser, getUserByEmail } = require("../model/user/User.model");
const { hashPassword, comparePassword } = require("../helpers/bcrypt.helper");
const { json } = require("body-parser");

router.all('/', (req, res, next) => {
  // res.json({ message: "return from user router" });
  next();
});

// Create a new user route
router.post('/', async (req, res) => {
  const { name, company, address, phone, email, password } = req.body;
  try {
    // hash password
    const hashedPw = await hashPassword(password);
    console.log(hashedPw);

    const newUserObj = {
      name,
      company,
      address,
      phone,
      email,
      password: hashedPw
    };
    const result = await insertUser(newUserObj);
    console.log(result);
    res.json({ message: "New user created", result });
  } catch (error) {
    console.log(error);
    res.json({ status: "error", message: error.message });
  }
})

// user sign in router
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.json({ status: "error", message: "invalid form submission" });
  }

  const user = await getUserByEmail(email);

  const passFromDb = user && user._id ? user.password : null;

  if (!passFromDb) return res.json({ status: "error", message: "Invalid email or password!" });

  const result = await comparePassword(password, passFromDb);

  res.json({ status: "success", message: "Login succesfull!" })
})

module.exports = router;