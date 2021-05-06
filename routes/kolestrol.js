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
  db.query(`SELECT * FROM kolestrol`, (err, result) => {
    if (err) {
      console.log("ini eror : ", err);
      res.redirect("/dashboard");
    } else {
      res.render("menuadmin/kolestrol/index", { kolestrols: result });
    }
  });
});

router.post("/", requireLoggin, (req, res) => {
  const { nm_makanan, keterangan, description } = req.body;
  let sql = `INSERT INTO kolestrol (nm_makanan, keterangan, description) VALUES
  ('${nm_makanan}' ,'${keterangan}', '${description}')`;
  db.query(sql, (err, result) => {
    if (err) {
      req.flash("error", "Gagal menambahkan data"); //adding informatin to a session
      res.redirect("/kolestrol");
    } else {
      req.flash("success", "Berhasil menambahkan data"); //adding informatin to a session
      res.redirect(`/kolestrol`);
    }
  });
});

//Edit Route
router.get("/:id/edit", requireLoggin, (req, res) => {
  db.query(
    `SELECT * FROM kolestrol WHERE id = '${req.params.id}'`,
    function (err, result) {
      if (err) {
        req.flash("error", "Gagal mengupdate data"); //adding informatin to a session
        res.redirect("/kolestrol");
      } else {
        console.log(result);
        res.render("menuadmin/kolestrol/edit", { kolestrols: result });
      }
    }
  );
});

//Update route
router.put("/:id", requireLoggin, (req, res) => {
  const { id } = req.params;
  const { nm_makanan, keterangan, description } = req.body.kolestrol;
  
    let sql = `UPDATE kolestrol SET nm_makanan = '${nm_makanan}', keterangan = '${keterangan}', description = '${description}' WHERE id = '${id}'`;
    db.query(sql, function (err, result) {
      if (err) {
        req.flash("error", "Update data gagal"); //adding informatin to a session
        console.log(err);
        res.redirect(`/kolestrol`);
      } else {
        req.flash("success", "Berhasil update data"); //adding informatin to a session
        res.redirect(`/kolestrol`);
      }
    });
});

//Delete Route
router.delete("/:id", requireLoggin, (req, res) => {
  const sql = `DELETE FROM kolestrol WHERE (id = '${req.params.id}')`;
  db.query(sql, function (err, result) {
    if (err) {
      req.flash("error", "Gagal menghapus data"); //adding informatin to a session
      console.log(err);
      res.redirect("/kolestrol");
    } else {
      req.flash("success", "Berhasil menghapus data"); //adding informatin to a session
      res.redirect("/kolestrol");
    }
  });
});


module.exports = router;
