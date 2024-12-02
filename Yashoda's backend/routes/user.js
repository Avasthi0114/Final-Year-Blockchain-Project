const express = require("express");
const connection = require("../connection");
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
require('dotenv').config();

let ejs = require('ejs');
let pdf = require('html-pdf');
let path = require('path');
var fs = require('fs');
var uuid = require('uuid');

//here we have created api for POST
// router.post("/signup", (req, res) => {
//   let user = req.body;
//   query = "select Name,Email, UserRole, password from signupdata where email=?";
//   connection.query(query, [user.Email], (err, results) => {
//     if (!err) {
//       if (results.length <= 0) {
//         query =
//           "insert into signupdata(Name,Email,UserRole,password) values(?,?,?,?)";
//         // query = "INSERT INTO user(name, email, contactNumber, password, status) VALUES(?, ?, ?, ?, 'false')";
//         connection.query(
//           query,
//           [user.Name, user.Email, user.UserRole, user.password],
//           (err, results) => {
//             if (!err) {
//               return res
//                 .status(200)
//                 .json({ message: "successfully registered" });
//             } else {
//               return res.status(500).json(err);
//             }
//           }
//         );
//       } else {
//         return res.status(400).json({ message: "email already exits" });
//       }
//     } else {
//       return res.status(500).json(err);
//     }
//   });
// });

 

// router.post("/signup", async (req, res) => {
//   let user = req.body;

//   // Check if the user already exists
//   const query = "SELECT Name, Email, UserRole, password FROM signupdata WHERE Email=?";
//   connection.query(query, [user.Email], async (err, results) => {
//     if (!err) {
//       if (results.length <= 0) {
//         try {
//           // Hash the password
//           const saltRounds = 10;
//           const hashedPassword = await bcrypt.hash(user.password, saltRounds);

//           // Insert the new user into the database
//           const insertQuery = "INSERT INTO signupdata(Name, Email, UserRole, password) VALUES(?, ?, ?, ?)";
//           connection.query(
//             insertQuery,
//             [user.Name, user.Email, user.UserRole, hashedPassword],
//             (err, results) => {
//               if (!err) {
//                 return res.status(200).json({ message: "Successfully registered" });
//               } else {
//                 return res.status(500).json(err);
//               }
//             }
//           );
//         } catch (hashError) {
//           return res.status(500).json({ message: "Error hashing the password", error: hashError });
//         }
//       } else {
//         return res.status(400).json({ message: "Email already exists" });
//       }
//     } else {
//       return res.status(500).json(err);
//     }
//   });
// });

router.post("/SignUpComplainant", async (req, res) => {
  let user = req.body;

  // Check if the user already exists
  const query = "SELECT Name, Email, PhoneNumber, password FROM complainantdata WHERE Email=?";
  connection.query(query, [user.Email], async (err, results) => {
    if (!err) {
      if (results.length <= 0) {
        try {
          // Hash the password
          const saltRounds = 10;
          const hashedPassword = await bcrypt.hash(user.password, saltRounds);

          // Insert the new user into the database
          const insertQuery = "INSERT INTO complainantdata(Name, Email, PhoneNumber, password) VALUES(?, ?, ?, ?)";
          connection.query(
            insertQuery,
            [user.Name, user.Email, user.PhoneNumber, hashedPassword],
            (err, results) => {
              if (!err) {
                return res.status(200).json({ message: "Successfully complainant registered" });
              } else {
                return res.status(500).json(err);
              }
            }
          );
        } catch (hashError) {
          return res.status(500).json({ message: "Error hashing the password", error: hashError });
        }
      } else {
        return res.status(400).json({ message: "Email already exists" });
      }
    } else {
      return res.status(500).json(err);
    }
  });
});

router.post("/SignUpPoliceOfficer", async (req, res) => {
  let user = req.body;

  // Check if the user already exists
  const query = "SELECT Name, Email, PhoneNumber, PoliceOfficerRank, PoliceOfficerId, PoliceStationId, password FROM policedata WHERE Email=?";
  connection.query(query, [user.Email], async (err, results) => {
    if (!err) {
      if (results.length <= 0) {
        try {
          // Hash the password
          const saltRounds = 10;
          const hashedPassword = await bcrypt.hash(user.password, saltRounds);

          // Insert the new user into the database
          const insertQuery = "INSERT INTO policedata(Name, Email, PhoneNumber, PoliceOfficerRank, PoliceOfficerId, PoliceStationId, password) VALUES(?, ?, ?, ?,?,?,?)";
          connection.query(
            insertQuery,
            [user.Name, user.Email, user.PhoneNumber, user.PoliceOfficerRank, user.PoliceOfficerId, user.PoliceStationId, hashedPassword],
            (err, results) => {
              if (!err) {
                return res.status(200).json({ message: "Successfully police officer registered" });
              } else {
                return res.status(500).json(err);
              }
            }
          );
        } catch (hashError) {
          return res.status(500).json({ message: "Error hashing the password", error: hashError });
        }
      } else {
        return res.status(400).json({ message: "Email already exists" });
      }
    } else {
      return res.status(500).json(err);
    }
  });
});


//creating login APIs
// router.post("/login", (req, res) => {
//     const user = req.body;
//     query = "select Name,password from signupdata where Email=?";
//     connection.query(query, [user.Email], (err, results) => {
//       if (!err) {
//         if (results.length <= 0 || results[0].password != user.password) {
//           return res
//             .status(401)
//             .json({ message: "incorrect username or password" });
//         } else if (results[0].password == user.password) {
//           // const response = { Email: results[0].email };
//           // const accessToken = jwt.sign(response, process.env.ACCESS_TOKEN, {
//           //   expiresIn: "8h",
//           // });
//           // res.status(200).json({ token: accessToken });
//           return res.status(200).json({ message: "successfully login" });
//         } else {
//           return res.status(400).json({ message: "something went wrong" });
//         }
//       } else {
//         return res.status(500).json(err);
//       }
//     });
//   });

 

router.post("/login", (req, res) => {
  const user = req.body;

  const query = "SELECT Name,password FROM signupdata WHERE Email=?";
  connection.query(query, [user.Email], async (err, results) => {
    if (!err) {
      if (results.length <= 0) {
        return res.status(401).json({ message: "Incorrect username or password" });
      } else {
        const dbPassword = results[0].password;
        // Compare the hashed password
        const passwordMatch = await bcrypt.compare(user.password, dbPassword);
        if (passwordMatch) {
          return res.status(200).json({ message: "Successfully logged in" });
        } else {
          return res.status(401).json({ message: "Incorrect username or password" });
        }
      }
    } else {
      return res.status(500).json(err);
    }
  });
});


router.post("/form", (req, res) => {
  let user = req.body;
  console.log("Incoming user data:", user);
  // Check if UIDNo already exists
  query = "SELECT UIDNo FROM user WHERE UIDNo = ?";
  connection.query(query, [user.UIDNo], (err, results) => {
      if (!err) {
          if (results.length <= 0) {
              // Insert new user without email
              query = "INSERT INTO user(UserName, FatherOrHusbandName, DateOfBirth, PhoneNumber, Nationality, PermanentAddress, TemporaryAddress, UIDNo, PassportNo, DateOfIssue, PlaceOfIssue, IDType, IDNumber, Occupation, PropertyCategory, PropertyType, DescriptionOfProperty, TotleValueOfProperty, ValueOfProperty, OccurenceDay, OccurenceDateFrom, OccurenceDateTo, OccurenceTimePeriod, OccurenceTimeFrom, OccurenceTimeTo, OccurenceDate, OccurenceTime, Occurence, Accused, FirstInformationcontent, ReasonOfDelay) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?)";

              connection.query(query, [
                  user.UserName,
                  user.FatherOrHusbandName,
                  user.DateOfBirth,
                  user.PhoneNumber,
                  user.Nationality,
                  user.PermanentAddress,
                  user.TemporaryAddress,
                  user.UIDNo,
                  user.PassportNo,
                  user.DateOfIssue,
                  user.PlaceOfIssue,
                  user.IDType,
                  user.IDNumber,
                  user.Occupation,
                  user.PropertyCategory,
                  user.PropertyType,
                  user.DescriptionOfProperty,
                  user.TotleValueOfProperty,
                  user.ValueOfProperty,
                  user.OccurenceDay,
                  user.OccurenceDateFrom,
                  user.OccurenceDateTo,
                  user.OccurenceTimePeriod,
                  user.OccurenceTimeFrom,
                  user.OccurenceTimeTo,
                  user.OccurenceDate,
                  user.OccurenceTime,
                  user.Occurence,
                  user.Accused,
                  user.FirstInformationcontent,
                  user.ReasonOfDelay
              ], (err, results) => {
                  if (!err) {
                      return res.status(200).json({ message: "Successfully added" });
                  } else {
                      return res.status(500).json(err);
                  }
              });
          } else {
              return res.status(400).json({ message: "User with this UIDNo already exists" });
          }
      } else {
          return res.status(500).json(err);
      }
  });
});

 

//creating login APIs
// router.post("/login", (req, res) => {
//   const user = req.body;
//   query = "select username,password, from signupdata where email=?";
//   connection.query(query, [user.email], (err, results) => {
//     if (!err) {
//       if (results.length <= 0 || results[0].password != user.password) {
//         return res
//           .status(401)
//           .json({ message: "incorrect username or password" });
//       } else if (results[0].status == "false") {
//         return res.status(401).json({ message: "wait for admin approval" });
//       } else if (results[0].password == user.password) {
//         const response = { email: results[0].email };
//         const accessToken = jwt.sign(response, process.env.ACCESS_TOKEN, {
//           expiresIn: "8h",
//         });
//         res.status(200).json({ token: accessToken });
//       } else {
//         return res.status(400).json({ message: "something went wrong" });
//       }
//     } else {
//       return res.status(500).json(err);
//     }
//   });
// });

//api for forget password
// var transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth:{
//           user: process.env.EMAIL,
//           pass: process.env.PASSWORD
//     }
// })

// router.post('/forgotPassword',(req,res)=>{
//     const user = req.body;
//     query = "select email,password from user where email=?";
//     connection.query(query,[user.email],(err,results)=>{
//         if(!err){
//             if(results.length <=0){
//                 return res.status(200).json({message: "password sent successfully on your email"});
//             }
//             else{
//                 var mailOptions = {
//                     from: proccess.env.EMAIL,
//                     to: results[0].email,
//                     subject: 'password by cafe management system',
//                     html: '<p><b> your login details for cafe management system</b> <br><b>Email:</b>'+results[0].email+'<br><b>password: </b>'+results[0].password+'<br> <a href="https://localhost:4200">Click here to login</a></p>'
//                 };
//                 transporter.sendMail(mailOptions,function(error,info){
//                     if(error){
//                         console.log(error);
//                     }
//                     else{
//                         console.log('email sent: '+info.response);
//                     }
//                 });
//                 return res.status(200).json({message: "password sent successfully on your email"});
//             }
//         }
//         else{
//             return res.status(500).json(err);
//         }
//     })

// });

 

router.post('/generatereport', (req, res) => {
  const generatedUuid = uuid.v1(); // Generate a unique ID
  const userDetails = req.body;

  // Render the EJS template to generate the PDF
  ejs.renderFile(path.join(__dirname, "", "FIR_Report.ejs"), {
      UserName: userDetails.UserName,
      FatherOrHusbandName: userDetails.FatherOrHusbandName,
      DateOfBirth: userDetails.DateOfBirth,
      PhoneNumber: userDetails.PhoneNumber,
      Nationality: userDetails.Nationality,
      PermanentAddress: userDetails.PermanentAddress,
      TemporaryAddress: userDetails.TemporaryAddress,
      UIDNo: userDetails.UIDNo,
      PassportNo: userDetails.PassportNo,
      DateOfIssue: userDetails.DateOfIssue,
      PlaceOfIssue: userDetails.PlaceOfIssue,
      IDType: userDetails.IDType,
      IDNumber: userDetails.IDNumber,
      Occupation: userDetails.Occupation,
      PropertyCategory: userDetails.PropertyCategory,
      PropertyType: userDetails.PropertyType,
      DescriptionOfProperty: userDetails.DescriptionOfProperty,
      TotleValueOfProperty: userDetails.TotleValueOfProperty,
      ValueOfProperty: userDetails.ValueOfProperty,
      OccurenceDay: userDetails.OccurenceDay,
      OccurenceDateFrom: userDetails.OccurenceDateFrom,
      OccurenceDateTo: userDetails.OccurenceDateTo,
      OccurenceTimePeriod: userDetails.OccurenceTimePeriod,
      OccurenceTimeFrom: userDetails.OccurenceTimeFrom,
      OccurenceTimeTo: userDetails.OccurenceTimeTo,
      OccurenceDate: userDetails.OccurenceDate,
      OccurenceTime: userDetails.OccurenceTime,
      Occurence: userDetails.Occurence,
      Accused: userDetails.Accused,
      FirstInformationcontent: userDetails.FirstInformationcontent,
      ReasonOfDelay: userDetails.ReasonOfDelay
  }, (err, results) => {
      if (err) {
          return res.status(502).json(err);
      } else {
          pdf.create(results).toFile('./generated_pdf/' + generatedUuid + ".pdf", function (err, data) {
              if (err) {
                  console.log(err);
                  return res.status(503).json(err);
              } else {
                  return res.status(200).json({ uuid: generatedUuid });
              }
          });
      }
  });
});

router.post('/getPdf', (req, res) => {
  const { uuid } = req.body;
  // const filePath = `./generated_pdf/${uuid}.pdf`;
  const filePath = path.join(__dirname, 'generated_pdf', `${uuid}.pdf`);
  // Check if file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
          return res.status(404).json({ message: 'File not found' });
      }
      // Send the file as a response
      res.sendFile(filePath, { root: __dirname });
  });
});
 


module.exports = router;
