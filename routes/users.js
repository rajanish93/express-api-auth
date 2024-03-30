var express = require('express');
var express = require('express');
const bcrypt = require("bcrypt");
var router = express.Router();
var db = require("../dbServer");
const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const generateAccessToken = require("../generateAccessToken");

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


/* CREATE USER */
router.post("/createUser", async (req, res) => {
  const user = req.body.name;
  const email = req.body.email;
 
  //res.send(200, { message: "response 2", user });
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  db.getConnection(async (err, connection) => {
    if (err) throw err;
    const sqlSearch = "SELECT * FROM users WHERE name = ?";
    const search_query = mysql.format(sqlSearch, [user]);

    const sqlInsert = "INSERT INTO users VALUES (0,?,?,?)";
    const insert_query = mysql.format(sqlInsert, [user, email, hashedPassword]);

    await connection.query(search_query, async (err, result) => {
      if (err) throw err;
      console.log("------> Search Results");
      console.log(result.length);
      if (result.length != 0) {
        connection.release();
        console.log("------> User already exists");
        res.sendStatus(409);
      } else {
        await connection.query(insert_query, (err, result) => {
          connection.release();
          if (err) throw err;
          console.log("--------> Created new User");
          console.log(result.insertId);
          res.sendStatus(201);
        });
      }
    }); //end of connection.query()
  }); //end of db.getConnection()
}); //end of app.post()



//LOGIN (AUTHENTICATE USER, and return accessToken)
router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  db.getConnection(async (err, connection) => {
    if (err) throw err;
    const sqlSearch = "Select * from users where email = ?";
    const search_query = mysql.format(sqlSearch, [email]);
    await connection.query(search_query, async (err, result) => {
      connection.release();

      if (err) throw err;
      if (result.length == 0) {
        console.log("--------> User does not exist");
        res.sendStatus(404);
      } else {
        const hashedPassword = result[0].password;
        //get the hashedPassword from result
        if (await bcrypt.compare(password, hashedPassword)) {
          console.log("---------> Login Successful");
          console.log("---------> Generating accessToken");
          const token = generateAccessToken({ user: email });
          console.log(token);
          res.json({ accessToken: token });
        } else {
          res.send("Password incorrect!");
        } //end of Password incorrect
      } //end of User exists
    }); //end of connection.query()
  }); //end of db.connection()
}); //end of app.post()



// Validate token route

router.get("/get", validateToken, (req, res) => {
  console.log("Token is valid");
  console.log(req.user.user);
  res.send(`${req.user.user} successfully accessed post`);
});




function validateToken(req, res, next) {
  //get token from request header
  const authHeader = req.headers["authorization"]
  const token = authHeader.split(" ")[1]
  //console.log(token);
  //the request header contains the token "Bearer <token>", split the string and use the second value in the split array.
  if (token == null) res.sendStatus(400).send("Token not present")
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      res.status(403).send("Token invalid")
    }
    else {
      req.user = user
      next() //proceed to the next action in the calling function
    }
  }) //end of jwt.verify()
} //end of function


module.exports = router;

