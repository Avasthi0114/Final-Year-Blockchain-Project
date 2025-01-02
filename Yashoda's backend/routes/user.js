const express = require("express");
const connection = require("../connection");
const router = express.Router();
const bcrypt = require('bcrypt');
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const qrcode = require('qrcode');
const multer = require("multer");
require('dotenv').config();

let ejs = require('ejs');
let pdf = require('html-pdf');
let path = require('path');
var fs = require('fs');
var uuid = require('uuid');

  

router.post("/SignUpComplainant", async (req, res) => {
  let user = req.body;

  // Check if the user already exists
// Updated query to check both Email and PhoneNumber
const query = "SELECT Name, Email, PhoneNumber, password FROM complainantdata WHERE Email=? OR PhoneNumber=?";
connection.query(query, [user.Email, user.PhoneNumber], (err, results) => {
    if (!err) {
      if (results.length <= 0) {
        try {
          // Hash the password using SHA-256
          const hashedPassword = crypto
            .createHash("sha256")
            .update(user.password)
            .digest("hex");

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
        return res.status(400).json({ message: "Email or phonenumber already exists" });
      }
    } else {
      return res.status(500).json(err);
    }
  });
});


router.post("/SignUpPoliceOfficer", async (req, res) => {
  let user = req.body;

  // Check if the user already exists
  const query = "SELECT Name, Email, PhoneNumber, PoliceOfficerRank, PoliceOfficerId, PoliceStationId, password  FROM policedata  WHERE Email=? OR PhoneNumber=? OR PoliceOfficerId=?";
   connection.query(query, [user.Email, user.PhoneNumber, user.PoliceOfficerId], async (err, results) => {
    if (!err) {
      if (results.length <= 0) {
        try {
          // Hash the password
          const hashedPassword = crypto
          .createHash("sha256")
          .update(user.password)
          .digest("hex");

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
        return res.status(400).json({ message: "Email or phonenumber or PoliceOfficerId already exists" });
      }
    } else {
      return res.status(500).json(err);
    }
  });
});
 

router.post("/loginComplainant", (req, res) => {
  const user = req.body;

  const query = "SELECT Email,password FROM complainantdata WHERE Email=?";
  connection.query(query, [user.Email], async (err, results) => {
    if (!err) {
      if (results.length <= 0) {
        return res.status(401).json({ message: "Incorrect username or password" });
      } else {
        const dbPassword = results[0].password;
        // Compare the hashed password
        const hashedPassword = crypto
        .createHash("sha256")
        .update(user.password)
        .digest("hex");

        if  (hashedPassword === dbPassword) {
          return res.status(200).json({ message: "Successfully logged in" });
        } else  {
          return res.status(402).json({ message: "Incorrect password" });
        }
      }
    } else {
      return res.status(500).json(err);
    }
  });
});

router.post("/loginPolice", (req, res) => {
  const user = req.body;

  const query = "SELECT Email,password FROM policedata WHERE Email=?";
  connection.query(query, [user.Email], async (err, results) => {
    if (!err) {
      if (results.length <= 0) {
        return res.status(401).json({ message: "Incorrect username or password" });
      } else {
        const dbPassword = results[0].password;
        // Compare the hashed password
        const hashedPassword = crypto
        .createHash("sha256")
        .update(user.password)
        .digest("hex");

        if  (hashedPassword === dbPassword) {
          return res.status(200).json({ message: "Successfully logged in" });
        } else  {
          return res.status(402).json({ message: "Incorrect password" });
        }
      }
    } else {
      return res.status(500).json(err);
    }
  });
});


// router.post("/form", (req, res) => {
//   let user = req.body;
//   console.log("Incoming user data:", user);
//   // Check if UIDNo already exists
//   query = "SELECT UIDNo FROM user WHERE UIDNo = ?";
//   connection.query(query, [user.UIDNo], (err, results) => {
//       if (!err) {
//           if (results.length <= 0) {
//               // Insert new user without email
//               query = "INSERT INTO user(UserName, FatherOrHusbandName, DateOfBirth , Nationality,PhoneNumber, PermanentAddress, TemporaryAddress, UIDNo, PassportNo, DateOfIssue, PlaceOfIssue, IDType, IDNumber, Occupation, PropertyCategory, PropertyType, DescriptionOfProperty, TotleValueOfProperty, ValueOfProperty, OccurenceDay, OccurenceDateFrom, OccurenceDateTo, OccurenceTimePeriod, OccurenceTimeFrom, OccurenceTimeTo, OccurenceDate, OccurenceTime, Occurence, Accused, FirstInformationcontent, ReasonOfDelay,complainantemail) VALUES(?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?)";

//               connection.query(query, [
//                   user.UserName,
//                   user.FatherOrHusbandName,
//                   user.DateOfBirth,
//                   user.Nationality,
//                   user.PhoneNumber,
//                   user.PermanentAddress,
//                   user.TemporaryAddress,
//                   user.UIDNo,
//                   user.PassportNo,
//                   user.DateOfIssue,
//                   user.PlaceOfIssue,
//                   user.IDType,
//                   user.IDNumber,
//                   user.Occupation,
//                   user.PropertyCategory,
//                   user.PropertyType,
//                   user.DescriptionOfProperty,
//                   user.TotleValueOfProperty,
//                   user.ValueOfProperty,
//                   user.OccurenceDay,
//                   user.OccurenceDateFrom,
//                   user.OccurenceDateTo,
//                   user.OccurenceTimePeriod,
//                   user.OccurenceTimeFrom,
//                   user.OccurenceTimeTo,
//                   user.OccurenceDate,
//                   user.OccurenceTime,
//                   user.Occurence,
//                   user.Accused,
//                   user.FirstInformationcontent,
//                   user.ReasonOfDelay,
//                   user.complainantemail,
//               ], (err, results) => {
//                   if (!err) {
//                       return res.status(200).json({ message: "Successfully added" });
//                   } else {
//                       return res.status(500).json(err);
//                   }
//               });
//           } else {
//               return res.status(400).json({ message: "User with this UIDNo already exists" });
//           }
//       } else {
//           return res.status(500).json(err);
//       }
//   });
// });

 

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
    ComplaintID: userDetails.ComplaintID,
      UserName: userDetails.UserName,
      FatherOrHusbandName: userDetails.FatherOrHusbandName,
      DateOfBirth: userDetails.DateOfBirth,
      complainantemail: userDetails.complainantemail,
      Nationality: userDetails.Nationality,
      PhoneNumber: userDetails.PhoneNumber,
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
 

router.get('/complainant/:Email', async (req, res) => {
  const { Email } = req.params;

  try {
    // Use promise-based query
    const [rows] = await connection.promise().query('SELECT * FROM complainantdata WHERE Email = ?', [Email]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Complainant not found' });
    }

    res.json(rows[0]);  // Send the first result if there's a match
  } catch (error) {
    console.error('Error fetching complainant:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


router.get('/police/:Email', async (req, res) => {
  const { Email } = req.params;

  try {
    // Use promise-based query
    const [rows] = await connection.promise().query('SELECT * FROM policedata WHERE Email = ?', [Email]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Complainant not found' });
    }

    res.json(rows[0]);  // Send the first result if there's a match
  } catch (error) {
    console.error('Error fetching complainant:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Set the destination folder for uploaded files
    cb(null, path.join(__dirname, "Evidences"));
  },
  filename: (req, file, cb) => {
    // Set the file name
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Middleware to parse JSON
router.use(express.json());

// API to handle file uploads
router.post("/upload", upload.single("file"), (req, res) => {
  try {
    // File details available in req.file
    console.log("File uploaded:", req.file);

    // Respond with a success message
    res.status(200).json({
      message: "File uploaded successfully",
      file: req.file,
    });
  } catch (error) {
    console.error("Error during file upload:", error);
    res.status(500).json({
      message: "File upload failed",
      error: error.message,
    });
  }
});

 
// ***************AUTO INCREMENT FID***********
// Create a Redis client with the connection URL
const { createClient } = require('redis');


// Create a Redis client with the connection URL
const redisClient = createClient({
    url: 'redis://localhost:6379'  // Redis connection URL
});


// Handle connection event
redisClient.on('connect', function() {
    console.log('Connected to Redis...');
});


// Handle error event
redisClient.on('error', function (err) {
    console.error('Redis error:', err);
});


// Connect to Redis
(async () => {
    try {
        await redisClient.connect();
        console.log('Redis client connected.');


        // Initialize the counter if it doesn't exist
        const counter = await redisClient.get("complaintCounter");
        if (counter === null) {
            await redisClient.set("complaintCounter", 0);
            console.log('complaintCounter initialized to 0');
        }
    } catch (err) {
        console.error('Redis connection failed:', err);
    }
})();


// Function to get the current complaint counter from Redis
async function getCurrentComplaintCounter() {
    try {
        const counter = await redisClient.get('complaintCounter');
        if (!counter) {
            await redisClient.set('complaintCounter', 1);  // Initialize counter if not present
            return 1;
        }
        return parseInt(counter, 10);  // Return the current counter value
    } catch (err) {
        console.error('Error fetching complaintCounter:', err);
    }
}




// Example function to increment complaintCounter
async function incrementComplaintCounter() {
    try {
        const newCounter = await redisClient.incr("complaintCounter");
        console.log(`Complaint Counter incremented: ${newCounter}`);
        return newCounter;  // return the new counter value
    } catch (err) {
        console.error('Error incrementing complaintCounter:', err);
    }
}




// Endpoint to get the current complaint ID (no incrementing)
router.get('/complaint-id', async (req, res) => {
    try {
        const currentCount = await getCurrentComplaintCounter();  // Get current counter value
        const complaintID = `F${currentCount}`;  // Create the complaint ID
        res.json({ complaintID });  // Send the complaint ID as response
    } catch (err) {
        console.error('Error fetching complaint ID:', err);
        res.status(500).send('Error fetching complaint ID');
    }
});


router.post('/incrementComplaintId', async (req, res) => {
    console.log('Received request to increment complaint ID');
    try {
        const newCount = await incrementComplaintCounter();  // Increment the counter
        const complaintID = `F${newCount}`;  // Create the new complaint ID
        res.json({ complaintID });  // Send the incremented complaint ID as response
    } catch (err) {
        console.error('Error incrementing complaint ID:', err);
        res.status(500).send('Error incrementing complaint ID');
    }
});




// Ensure the client remains open for future use
process.on('exit', () => {
    redisClient.quit();
});
 



// Load credentials securely from environment variables for security
const EMAIL_USER = process.env.EMAIL_USER; // Gmail email address
const EMAIL_PASS = process.env.EMAIL_PASS; // Gmail App Password


// -------------------- Function to Generate QR Code --------------------
async function generateQRCode(data) {
    try {
        // Generate a QR code as a Base64 image
        const qrCodeDataUrl = await qrcode.toDataURL(data); // Converts input "data" to a base64 QR image
        return qrCodeDataUrl;
    } catch (error) {
        console.error('Error generating QR code:', error);
        throw new Error('Failed to generate QR Code');
    }
}


// -------------------- Function to Send Email with QR Code --------------------
async function sendEmailWithQRCode(email, qrCodeDataUrl, UserName) {
    try {
        // Create a transporter object using Gmail SMTP
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: EMAIL_USER, // Sender email from .env
                pass: EMAIL_PASS, // App Password from .env
            },
        });
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS);


        // Extract Base64 data from the QR Code Data URL
        const qrCodeBase64 = qrCodeDataUrl.split(',')[1]; // Splits "data:image/png;base64,..." and extracts the base64 string


        // Email configuration
        let mailOptions = {
            from: EMAIL_USER, // Sender's email address
            to: email, // Receiver's email
            subject: 'FIR Submitted Successfully',
            html: `
                <p>Dear ${UserName},</p>
                <p>This is to formally notify you that your FIR has been successfully submitted to the police department.</p>
                <p>Please scan the QR code below to track the status of your complaint:</p>
                <p>Thank you for using our services!</p>
            `,
            attachments: [
                {
                    filename: 'qrcode.png', // File name for attachment
                    content: qrCodeBase64, // File content (base64 string)
                    encoding: 'base64', // Specify content encoding
                },
            ],
        };


        // Send email using the transporter object
        let info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.response);
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email');
    }
}


// -------------------- API Endpoint to Send Email with QR Code --------------------
router.post('/sendEmail', async (req, res) => {
    const { complainantEmail, UserName } = req.body;


    // Input Validation
    if (!complainantEmail || !UserName) {
        return res.status(400).json({ message: 'Complainant email and user name are required.' });
    }


    try {
        // Generate dynamic URL for tracking complaint status
        const statusURL = `http://localhost:8081/user/${complainantEmail}?id=${Math.random().toString(36).substring(7)}`;
        console.log('Generated Status URL:', statusURL);


        // Generate QR Code for the status URL
        const qrCodeDataUrl = await generateQRCode(statusURL);


        // Send an email with the generated QR code
        await sendEmailWithQRCode(complainantEmail, qrCodeDataUrl, UserName);


        // Send success response back to the client
        res.status(200).json({
            message: 'FIR submitted successfully and email sent!',
            data: {
                complainantEmail,
                UserName,
                trackingURL: statusURL,
            },
        });
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});





 

module.exports = router;
