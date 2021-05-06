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
  db.query(`SELECT * FROM user WHERE username = '${req.session.currentUser}'`, (err, result) => {
    if (err) {
      console.log("ini eror : ", err);
      res.redirect("/dashboard");
    } else {
      res.render("menuuser/profil/index", { profils: result });
    }
  });
});


//Edit Route
router.get("/:id/edit", requireLoggin, (req, res) => {
  db.query(
    `SELECT * FROM user WHERE id = '${req.params.id}'`,
    function (err, result) {
      if (err) {
        req.flash("error", "Gagal mengupdate data"); //adding informatin to a session
        res.redirect("/profil");
      } else {
        console.log(result);
        res.render("menuuser/profil/edit", { profils: result });
      }
    }
  );
});

//Update route
router.put("/:id", requireLoggin, (req, res) => {
  const { id } = req.params;
  const { nama_user, username, tgl_lahir, gol_darah, jkel, password } = req.body.profil;
  
    let sql = `UPDATE user SET nama_user = '${nama_user}', username = '${username}', tgl_lahir = '${tgl_lahir}', gol_darah = '${gol_darah}', jkel = '${jkel}', password = '${password}' WHERE id = '${id}'`;
    db.query(sql, function (err, result) {
      if (err) {
        req.flash("error", "Update data gagal"); //adding informatin to a session
        console.log(err);
        res.redirect(`/profil`);
      } else {
        req.flash("success", "Berhasil update data"); //adding informatin to a session
        res.redirect(`/profil`);
      }
    });
});


module.exports = router;
