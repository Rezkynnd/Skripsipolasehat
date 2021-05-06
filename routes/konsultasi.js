const express = require('express');
const mysql = require('mysql');
const router = express.Router();

const { requireLoggin } = require('../middleware');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'psehat'
});

db.connect((err) => {
  if (!err) {
    console.log("MYSQL CONNECTED");
  } else {
    console.log("CONNECTION FAILED", err);
  }
});

router.get("/", requireLoggin, (req, res) => {
      res.render("menuuser/konsultasi/index");
});


// KONSULTASI KOLESTROL
router.get("/kolestrol", requireLoggin, (req, res) => {
  db.query(`SELECT * FROM user WHERE username = '${req.session.currentUser}'`, (err, result) => {
    if (err) {
      console.log("ini eror : ", err);
      res.redirect("/konsultasi");
    } else {
      // console.log("Ini data user:", result);
      var millisecondsBetweenDOBAnd1970 = Date.parse(result[0].tgl_lahir);
      var millisecondsBetweenNowAnd1970 = Date.now();
      var ageInMilliseconds = millisecondsBetweenNowAnd1970-millisecondsBetweenDOBAnd1970;
      var milliseconds = ageInMilliseconds;
      var second = 1000;
      var minute = second*60;
      var hour = minute*60;
      var day = hour*24;
      var month = day*30; 
    /*using 30 as base as months can have 28, 29, 30 or 31 days depending a month in a year it itself is a different piece of comuptation*/
      var year = day*365;
      var years = Math.round(milliseconds/year);
      // console.log("Ini umur tahun:",years)
      res.render("menuuser/konsultasi/kolestrol/formkonsul", {users: result, usia: years});
    }
  });
});


router.get("/kolestrol/:id", requireLoggin, (req, res) => {
  const {id} = req.params;
  const {nama_user, usia, gol_darah, jkel, kolestrol} = req.body.user;
  console.log(parseInt(usia));
  console.log(parseInt(kolestrol));
  let hasilPenilaian = "";
  if(parseInt(usia) <= 9){
    if(parseInt(kolestrol) <= 99){
      hasilPenilaian = "normal";
    }else{
      // (parseInt(kolestrol) >= 240)
      hasilPenilaian = "tinggi";
    }
    }else if(parseInt(usia) >=10 && parseInt(usia) <= 19){
      if(parseInt(kolestrol) <= 129){
        hasilPenilaian = "normal";
      }else{
        // (parseInt(kolestrol) >= 240)
        hasilPenilaian = "tinggi";
      }
    }else{//dewasa
      if(parseInt(kolestrol) <= 239){
        hasilPenilaian = "normal";
      }else{
        // (parseInt(kolestrol) >= 240)
        hasilPenilaian = "tinggi";
      }
    }
if(hasilPenilaian === "tinggi"){
      db.query(`SELECT * FROM kolestrol`, (err, result) => {
        if(err){
          console.log(err);
          res.redirect("/konsultasi")
        }else{
          res.render("menuuser/konsultasi/kolestrol/hasilkonsul", {hasilPenilaian, nama_user, kolestrols: result});
        }
      });
    }else{
      res.render("menuuser/konsultasi/kolestrol/hasilkonsul", {hasilPenilaian, nama_user});
    }

    //Riwayat konsultasi kolestrol
    const timeElapsed = Date.now();
    const today = new Date(timeElapsed);
    const tanggal = today.toLocaleDateString();
    let sql = `INSERT INTO riwayat (id_user, konsultasi, hasil, tanggal) VALUES
   ('${id}' ,'kolestrol', '${hasilPenilaian}', '${tanggal}')`;
    db.query( sql, (err, result) => {
      if(err){
        console.log(err);
        res.redirect("/konsultasi")
      }else{
        console.log("Berhasil menambahkan riwayat");
      }
    });

});

// KONSULTASI ASAM URAT
router.get("/asamurat", requireLoggin, (req, res) => {
  db.query(`SELECT * FROM user WHERE username = '${req.session.currentUser}'`, (err, result) => {
    if (err) {
      console.log("ini eror : ", err);
      res.redirect("/konsultasi");
    } else {
      // console.log("Ini data user:", result);
      var millisecondsBetweenDOBAnd1970 = Date.parse(result[0].tgl_lahir);
      var millisecondsBetweenNowAnd1970 = Date.now();
      var ageInMilliseconds = millisecondsBetweenNowAnd1970-millisecondsBetweenDOBAnd1970;
      var milliseconds = ageInMilliseconds;
      var second = 1000;
      var minute = second*60;
      var hour = minute*60;
      var day = hour*24;
      var month = day*30; 
    /*using 30 as base as months can have 28, 29, 30 or 31 days depending a month in a year it itself is a different piece of comuptation*/
      var year = day*365;
      var years = Math.round(milliseconds/year);
      // console.log("Ini umur tahun:",years)
      res.render("menuuser/konsultasi/asamurat/formkonsul", {users: result, usia: years});
    }
  });
});


router.get("/asamurat/:id", requireLoggin, (req, res) => {
  const {id} = req.params;
  const {nama_user, usia, gol_darah, jkel, asamurat} = req.body.user;
  console.log(parseInt(usia));
  console.log(parseFloat(asamurat));
  let hasilPenilaian = "";
  if(parseInt(usia) <= 9){ //anak-anak
    if(parseFloat(asamurat) >= 2.0 && parseFloat(asamurat) <= 5.5){
      hasilPenilaian = "normal";
    }else if(parseFloat(asamurat) < 2.0){
      hasilPenilaian = "rendah";
    }else{
      hasilPenilaian = "tinggi";
    }
    }else if(parseInt(usia) > 9){ //remaja - tua
      if(jkel === "Laki-laki"){
        if(parseFloat(asamurat) >= 3.4 && parseFloat(asamurat) <= 7.0){
          hasilPenilaian = "normal";
        }else if(parseFloat(asamurat) < 3.4){
          hasilPenilaian = "rendah";
        }else{
          hasilPenilaian = "tinggi";
        }
      }else{ //Perempuan
        if(parseFloat(asamurat) >= 2.4 && parseFloat(asamurat) <= 6.0){
          hasilPenilaian = "normal";
        }else if(parseFloat(asamurat) < 2.4){
          hasilPenilaian = "rendah";
        }else{
          hasilPenilaian = "tinggi";
        }
      }
    }
    if(hasilPenilaian === "rendah"){
      db.query(`SELECT * FROM asam_rendah`, (err, result) => {
        if(err){
          console.log(err);
          res.redirect("/konsultasi")
        }else{
          res.render("menuuser/konsultasi/asamurat/hasilkonsul", {hasilPenilaian, nama_user, asamurats: result});
        }
      });
    }else if(hasilPenilaian === "tinggi"){
      db.query(`SELECT * FROM asam_tinggi`, (err, result) => {
        if(err){
          console.log(err);
          res.redirect("/konsultasi")
        }else{
          res.render("menuuser/konsultasi/asamurat/hasilkonsul", {hasilPenilaian, nama_user, asamurats: result});
        }
      });
    }else{
      res.render("menuuser/konsultasi/asamurat/hasilkonsul", {hasilPenilaian, nama_user});
    }


     //Riwayat konsultasi asamurat
     const timeElapsed = Date.now();
     const today = new Date(timeElapsed);
     const tanggal = today.toLocaleDateString();
     let sql = `INSERT INTO riwayat (id_user, konsultasi, hasil, tanggal) VALUES
    ('${id}' ,'asam urat', '${hasilPenilaian}', '${tanggal}')`;
     db.query( sql, (err, result) => {
       if(err){
         console.log(err);
         res.redirect("/konsultasi")
       }else{
         console.log("Berhasil menambahkan riwayat");
       }
     });

});




// KONSULTASI GULA DARAH
router.get("/guladarah", requireLoggin, (req, res) => {
  db.query(`SELECT * FROM user WHERE username = '${req.session.currentUser}'`, (err, result) => {
    if (err) {
      console.log("ini eror : ", err);
      res.redirect("/konsultasi");
    } else {
      // console.log("Ini data user:", result);
      var millisecondsBetweenDOBAnd1970 = Date.parse(result[0].tgl_lahir);
      var millisecondsBetweenNowAnd1970 = Date.now();
      var ageInMilliseconds = millisecondsBetweenNowAnd1970-millisecondsBetweenDOBAnd1970;
      var milliseconds = ageInMilliseconds;
      var second = 1000;
      var minute = second*60;
      var hour = minute*60;
      var day = hour*24;
      var month = day*30; 
    /*using 30 as base as months can have 28, 29, 30 or 31 days depending a month in a year it itself is a different piece of comuptation*/
      var year = day*365;
      var years = Math.round(milliseconds/year);
      // console.log("Ini umur tahun:",years)
      res.render("menuuser/konsultasi/guladarah/formkonsul", {users: result, usia: years});
    }
  });
});


router.get("/guladarah/:id", requireLoggin, (req, res) => {
  const {id} = req.params;
  const {nama_user, usia, gol_darah, jkel, guladarah} = req.body.user;
  console.log(parseInt(usia));
  console.log(parseInt(guladarah));
  let hasilPenilaian = "";
  if(parseInt(usia) <= 6){ //anak-anak
    if(parseInt(guladarah) <= 99){
      hasilPenilaian = "rendah";
    }else if(parseInt(guladarah) >= 100 && parseInt(guladarah) < 200){
      hasilPenilaian = "normal";
    }else{
      hasilPenilaian = "tinggi";
    }
    }else if(parseInt(usia) <= 12 ){ //remaja 
      if(parseInt(guladarah) >= 70 && parseInt(guladarah) < 150){
        hasilPenilaian = "normal";
      }else if(parseInt(guladarah) <= 69){
          hasilPenilaian = "rendah";
        }else{
          hasilPenilaian = "tinggi";
        }
    }else if(parseInt(usia) > 12 ){
      if(parseInt(guladarah) <= 99){
        hasilPenilaian = "normal";
      }else{
          hasilPenilaian = "tinggi";
        }
    }
console.log("Hasil peilaian: ",hasilPenilaian);
    if(hasilPenilaian === "rendah"){
      db.query(`SELECT * FROM gdarah_rendah`, (err, result) => {
        if(err){
          console.log(err);
          res.redirect("/konsultasi")
        }else{
          res.render("menuuser/konsultasi/guladarah/hasilkonsul", {hasilPenilaian, nama_user, guladarahs: result});
        }
      });
    }else if(hasilPenilaian === "tinggi"){
      db.query(`SELECT * FROM gdarah_tinggi`, (err, result) => {
        if(err){
          console.log(err);
          res.redirect("/konsultasi")
        }else{
          db.query(`SELECT * FROM olahraga`, (err, resultt) => {
            if(err){
              console.log(err);
              res.redirect("/konsultasi")
            }else{
              res.render("menuuser/konsultasi/guladarah/hasilkonsul", {hasilPenilaian, nama_user, olahragas: resultt, guladarahs: result});
            }
          });
        }
      });
    }else{
      res.render("menuuser/konsultasi/guladarah/hasilkonsul", {hasilPenilaian, nama_user});
    }

     //Riwayat konsultasi Gula Darah
     const timeElapsed = Date.now();
     const today = new Date(timeElapsed);
     const tanggal = today.toLocaleDateString();
     console.log("ini tanggal:", tanggal);
     let sql = `INSERT INTO riwayat (id_user, konsultasi, hasil, tanggal) VALUES
    ('${id}' ,'gula darah', '${hasilPenilaian}', '${tanggal}')`;
     db.query( sql, (err, result) => {
       if(err){
         console.log(err);
         res.redirect("/konsultasi")
       }else{
         console.log("Berhasil menambahkan riwayat");
       }
     });
});




module.exports = router;