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
  db.query(`SELECT * FROM gdarah_rendah`, (err, rendahs) => {
    if (err) {
      console.log("ini eror : ", err);
      res.redirect("/dashboard");
    } else {
      db.query(`SELECT * FROM gdarah_tinggi`, (err, tinggis) => {
        if(err){
          console.log("ini eror : ", err);
      res.redirect("/dashboard");
        }else{

          res.render("menuadmin/guladarah/index", { rendahs, tinggis });
        }

      });
    }
  });
});

// Add routes

//RENDAH
router.post("/rendah", requireLoggin, (req, res) => {
  const { nm_makanan, keterangan, description } = req.body;
  let sql = `INSERT INTO gdarah_rendah (nm_makanan, keterangan, description) VALUES
  ('${nm_makanan}' ,'${keterangan}', '${description}')`;
  db.query(sql, (err, result) => {
    if (err) {
      req.flash("error", "Gagal menambahkan data"); //adding informatin to a session
      res.redirect("/guladarah");
    } else {
      req.flash("success", "Berhasil menambahkan data"); //adding informatin to a session
      res.redirect(`/guladarah`);
    }
  });
});

//TINGGI
router.post("/tinggi", requireLoggin, (req, res) => {
  const { nm_makanan, keterangan, description } = req.body;
  let sql = `INSERT INTO gdarah_tinggi (nm_makanan, keterangan, description) VALUES
  ('${nm_makanan}' ,'${keterangan}', '${description}')`;
  db.query(sql, (err, result) => {
    if (err) {
      req.flash("error", "Gagal menambahkan data"); //adding informatin to a session
      res.redirect("/guladarah");
    } else {
      req.flash("success", "Berhasil menambahkan data"); //adding informatin to a session
      res.redirect(`/guladarah`);
    }
  });
});

//Edit Routes

//RENDAH
router.get("/:id/edit/rendah", requireLoggin, (req, res) => {
  db.query(
    `SELECT * FROM gdarah_rendah WHERE id = '${req.params.id}'`,
    function (err, result) {
      if (err) {
        console.error(err);
        res.redirect("/guladarah");
      } else {
        res.render("menuadmin/guladarah/rendahedit", { guldars: result });
      }
    }
  );
});

//TINGGI
router.get("/:id/edit/tinggi", requireLoggin, (req, res) => {
  db.query(
    `SELECT * FROM gdarah_tinggi WHERE id = '${req.params.id}'`,
    function (err, result) {
      if (err) {
        console.error(err);
        res.redirect("/guladarah");
      } else {
        res.render("menuadmin/guladarah/tinggiedit", { guldars: result });
      }
    }
  );
});

//Update routes

// RENDAH
router.put("/:id/rendah", requireLoggin, (req, res) => {
  const { id } = req.params;
  const { nm_makanan, keterangan, description } = req.body.guldar;
  
    let sql = `UPDATE gdarah_rendah SET nm_makanan = '${nm_makanan}', keterangan = '${keterangan}', description = '${description}' WHERE id = '${id}'`;
    db.query(sql, function (err, result) {
      if (err) {
        req.flash("error", "Update data gagal"); //adding informatin to a session
        console.log(err);
        res.redirect(`/guladarah`);
      } else {
        req.flash("success", "Berhasil update data"); //adding informatin to a session
        res.redirect(`/guladarah`);
      }
    });
});

// TINGGI
router.put("/:id/tinggi", requireLoggin, (req, res) => {
  const { id } = req.params;
  const { nm_makanan, keterangan, description } = req.body.guldar;
    let sql = `UPDATE gdarah_tinggi SET nm_makanan = '${nm_makanan}', keterangan = '${keterangan}', description = '${description}' WHERE id = '${id}'`;
    db.query(sql, function (err, result) {
      if (err) {
        req.flash("error", "Update data gagal"); //adding informatin to a session
        console.log(err);
        res.redirect(`/guladarah`);
      } else {
        req.flash("success", "Berhasil update data"); //adding informatin to a session
        res.redirect(`/guladarah`);
      }
    });
});

//Delete Routes

// RENDAH
router.delete("/:id/rendah", requireLoggin, (req, res) => {
  const sql = `DELETE FROM gdarah_rendah WHERE (id = '${req.params.id}')`;
  db.query(sql, function (err, result) {
    if (err) {
      req.flash("error", "Gagal menghapus data"); //adding informatin to a session
      console.log(err);
      res.redirect("/guladarah");
    } else {
      req.flash("success", "Berhasil menghapus data"); //adding informatin to a session
      res.redirect("/guladarah");
    }
  });
});

// TINGGI
router.delete("/:id/tinggi", requireLoggin, (req, res) => {
  const sql = `DELETE FROM gdarah_tinggi WHERE (id = '${req.params.id}')`;
  db.query(sql, function (err, result) {
    if (err) {
      req.flash("error", "Gagal menghapus data"); //adding informatin to a session
      console.log(err);
      res.redirect("/guladarah");
    } else {
      req.flash("success", "Berhasil menghapus data"); //adding informatin to a session
      res.redirect("/guladarah");
    }
  });
});


module.exports = router;
