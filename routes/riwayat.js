const express = require("express");
const mysql = require("mysql");
const router = express.Router();

const { requireLoggin } = require("../middleware");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "psehat",
});

db.connect((err) => {
  if (!err) {
    console.log("MYSQL CONNECTED");
  } else {
    console.log("CONNECTION FAILED", err);
  }
});


router.get("/", requireLoggin, (req, res) => {
  db.query(`SELECT * FROM user WHERE username = '${req.session.currentUser}'`, (err, users) => {
    if (err) {
      console.log("ini eror : ", err);
      res.redirect("/dashboard");
    } else {
      db.query(`SELECT * FROM riwayat WHERE id_user = '${users[0].id}'`, (err, result) => {
        if (err) {
          console.log("ini eror : ", err);
          res.redirect("/dashboard");
        } else {
          
          res.render("menuuser/riwayat/index", { riwayats: result, users });
        }
      });
    }
  });
});

module.exports = router;
