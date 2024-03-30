var express = require('express');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});



router.get("/test", (req, res) => {
  let responseText = "Hello World!<br>";
  responseText += `<small>Requested at: ${23}</small>`;
  res.send(responseText);
});


// router.get("/user/:id",
//   (req, res, next) => {
//     console.log("ID:", req.params.id);
//     next();
//   },
//   (req, res, next) => {
//     res.send("User Info");
//   }
// );

// handler for the /user/:id path, which prints the user ID
router.get("/user/:id/:user", (req, res, next) => {
  res.send(req.params);
});




module.exports = router;
