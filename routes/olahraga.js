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
  db.query(`SELECT * FROM olahraga`, (err, result) => {
    if (err) {
      console.log("ini eror : ", err);
      res.redirect("/dashboard");
    } else {
      res.render("menuadmin/olahraga/index", { olahragas: result });
    }
  });
});

router.post("/", requireLoggin, (req, res) => {
  const { name, jenis, description } = req.body;
  let sql = `INSERT INTO olahraga (name, jenis, description) VALUES
  ('${name}' ,'${jenis}', '${description}')`;
  db.query(sql, (err, result) => {
    if (err) {
      req.flash("error", "Gagal menambahkan data"); //adding informatin to a session
      res.redirect("/olahraga");
    } else {
      req.flash("success", "Berhasil menambahkan data"); //adding informatin to a session
      res.redirect(`/olahraga`);
    }
  });
});

//Edit Route
router.get("/:id/edit", requireLoggin, (req, res) => {
  db.query(
    `SELECT * FROM olahraga WHERE id = '${req.params.id}'`,
    function (err, result) {
      if (err) {
        req.flash("error", "Gagal mengupdate data"); //adding informatin to a session
        res.redirect("/olahraga");
      } else {
        res.render("menuadmin/olahraga/edit", { olahragas: result });
      }
    }
  );
});

//Update route
router.put("/:id", requireLoggin, (req, res) => {
  console.log(req.body.olahraga)
  const { id } = req.params;
  const { name, jenis, description } = req.body.olahraga;
    let sql = `UPDATE olahraga SET name = '${name}', jenis = '${jenis}', description = '${description}' WHERE id = '${id}'`;
    db.query(sql, function (err, result) {
      if (err) {
        req.flash("error", "Update data gagal"); //adding informatin to a session
        console.log(err);
        res.redirect(`/olahraga`);
      } else {
        req.flash("success", "Berhasil update data"); //adding informatin to a session
        res.redirect(`/olahraga`);
      }
    });
});

//Delete Route
router.delete("/:id", requireLoggin, (req, res) => {
  const sql = `DELETE FROM olahraga WHERE (id = '${req.params.id}')`;
  db.query(sql, function (err, result) {
    if (err) {
      req.flash("error", "Gagal menghapus data"); //adding informatin to a session
      console.log(err);
      res.redirect("/olahraga");
    } else {
      req.flash("success", "Berhasil menghapus data"); //adding informatin to a session
      res.redirect("/olahraga");
    }
  });
});


module.exports = router;
