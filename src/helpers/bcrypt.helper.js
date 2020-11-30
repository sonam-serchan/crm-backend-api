const bcrypt = require("bcrypt");
const saltRounds = 10;

const hashPassword = password => {
  return new Promise((resolve) => {
    resolve(bcrypt.hashSync(password, saltRounds));
  });
};

const comparePassword = (painPass, passFromDb) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(painPass, passFromDb, function (err, result) {
      if (err) reject(error);
      resolve(result);
    });
  });
}

module.exports = { hashPassword, comparePassword };