const express = require("express");

const fs = require("fs");
const router = express.Router();
const formidable = require("formidable");

const books = require("../data.json");
const { title } = require("process");

router.get("/", (req, res) => {
  res.render("add");
});

router.post("/", (req, res) => {
  if (books.some((book) => book.Title == req.body.Title)) {
    return res.status(400).send("Book already exists");
  }
  let form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
    if (err) console.log(err);

    //THIS IS TO TAKE THE IMAGE AND DOWNLOAD IT TO PUBLIC IMAGES SO THAT WE CAN ACCESS IT
    //VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
    let oldpath = files.image[0].filepath;
    let newpath = "public/images/" + files.image[0].originalFilename;
    fs.access(newpath, fs.constants.F_OK, (accessErr) => {
      if (accessErr) {
        console.log(accessErr);
      }
    });

    fs.renameSync(oldpath, newpath, (err) => {
      if (err) console.log(err);
    });
    //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    //IT ALSO CHANGES THE NAME OF THE FILE SO THAT WE CAN JUST KEEP THE FILEPATH IN THE OBJECT

    let book = {
      Id: Math.floor(Math.random() * 1000),
      Title: fields.title[0],
      Author: fields.author[0],
      Description: fields.description[0],
      Image: newpath,
    };
    if (books.some((book) => book.Id == req.body.Id)) {
      id = mathfloor(Math.random() * 1000);
    }
    //IF THE BOOKID IS USED JUST RANDOMIZE AGAIN
    if (books.some((book) => book.Title == req.body.Title)) {
      return res.status(400).send("Book already exists");
    }
    //IF BOOK ALREADY EXISTS SEND AN ERROR 
    books.push(book);
    fs.writeFile("data.json", JSON.stringify(books), (err) => {
      if (err) console.log(err);
    });
    //WRITES THE ARRAY WITH THE ADDED BOOK BACK TO THE DATA.JSON FILE

    res.end();
  });
});

router.get("/:id", (req, res) => {
  console.log(req.params.id);
  const book = books[books.findIndex((book) => book.Id == req.params.id)];

  res.send(book);
  res.end();
});

router.delete("/:id", (req, res) => {
  let index = books.findIndex((book) => book.id == req.params.id);
  books.splice(index, 1);
  fs.writeFile("data.json", JSON.stringify(books), (err) => {
    if (err) console.log(err);
  });
  res.end();
});

router.put("/:id", (req, res) => {
  let oldpath; // Declare these variables so that I can use them later in the function
  let newpath;
  let form = new formidable.IncomingForm();
 
  form.parse(req, function (err, fields, files) {
    if (err) console.log(err);
  
   
    // HERE I AM TRYING TO CHECK IF A FILE WAS UPLOADED, IF IT WAS I AM TRYING TO CHANGE THE NAME OF THE FILE
// AND DOWNLOAD IT TO PUBLIC IMAGES SO THAT WE CAN ACCESS IT. JUST LIKE I DID IN THE POST METHOD. 
// IF NOT IT SHOULD KEEP THE FILEPATH THAT IS ALREADY IN THE OBJECT
    if (!files.image || files.image.size == 0 || files.image.length == 0) {
        newpath = books[books.findIndex((book) => book.Id == req.params.id)].Image;
    } else {
      oldpath = files.image[0].filepath;
      newpath = "public/images/" + files.image[0].originalFilename;
      fs.renameSync(oldpath, newpath, (err) => {
        if (err) console.log(err);
      });
    }
   
    
    setTimeout(() => {
      
    
    let book = {
      Id: req.params.id,
      Title: fields.title[0],
      Author: fields.author[0],
      Description: fields.description[0],
      Image: newpath,
    };
    // NOW IM SPLICING OUT THE PREVIOUS VERSION (FOUND THROUGH THE ID) AND REPLACING IT WITH THE NEW ONE
    let previousversion = books.findIndex((book) => book.Id == req.params.id);
    
    
    
    books.splice(previousversion, 1, book);
    // WRITING THE FILE LIKE I DID IN POST
    fs.writeFile("data.json", JSON.stringify(books), (err) => {
      if (err) console.log(err);
      res.end()
    });
    }, 50)
  });
});

module.exports = router;
