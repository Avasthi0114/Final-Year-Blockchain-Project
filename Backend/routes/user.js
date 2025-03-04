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

const puppeteer = require('puppeteer');

const axios = require('axios');

//global declaration of authToken
const authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InNheWFsaSIsIm9yZ05hbWUiOiJPcmcxIiwiaWF0IjoxNzQxMDE4MDk4fQ.7spluXvixrwmIFtgM_uVmhxRjjaBHK2nl6RwG8derJI";

router.post("/assignPolice", (req, res) => {
  const { ComplaintId, PoliceId } = req.body;

  if (!ComplaintId || !PoliceId) {
    return res.status(400).json({ message: "ComplaintId and PoliceId are required" });
  }

  // Step 1: Fetch the PoliceStationId using PoliceId
  const fetchStationQuery = "SELECT PoliceStationId FROM policedata WHERE PoliceOfficerId = ?";
  connection.query(fetchStationQuery, [PoliceId], (err, stationResults) => {
    if (err) {
      console.error("Error fetching stationId:", err);
      return res.status(500).json({ message: "Failed to fetch stationId", error: err });
    }

    if (stationResults.length === 0) {
      return res.status(404).json({ message: "No stationId found for the given PoliceId" });
    }

    const stationId = stationResults[0].PoliceStationId;

    // Step 2: Update the complaintdetails table to set status as "Assigned" and PoliceId
    const updateQuery = "UPDATE complaintdetails SET Status = 'Assigned', PoliceId = ? WHERE ComplaintId = ?";
    connection.query(updateQuery, [PoliceId, ComplaintId], (err, updateResults) => {
      if (err) {
        console.error("Error updating complaint details:", err);
        return res.status(500).json({ message: "Error updating complaint details", error: err });
      }

      // Step 3: Make a blockchain API call to update the blockchain
      const blockchainPayload = {
        peers: ["peer0.org1.example.com", "peer0.org2.example.com"],
        fcn: "addOfficerDetails",
        args: [ComplaintId, PoliceId, stationId]
      };

      
      axios
        .post(
          "http://localhost:4000/channels/fir-channel/chaincodes/FIRManagement",
          blockchainPayload,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`
            }
          }
        )
        .then((blockchainResponse) => {
          console.log("Blockchain response:", blockchainResponse.data);

          // Send success response to the client
          res.status(200).json({
            message: "Police assigned successfully and blockchain updated",
            blockchainResponse: blockchainResponse.data
          });
        })
        .catch((blockchainError) => {
          console.error("Error invoking blockchain:", blockchainError.message);
          res.status(500).json({
            message: "Police assigned, but failed to update blockchain",
            error: blockchainError.message
          });
        });
    });
  });
});



  
router.get('/policedata', (req, res) => {
  const query = `SELECT Name, Email, PoliceOfficerRank AS Post, PoliceOfficerId, PoliceStationId FROM policedata`;
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching policedata:', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
    res.json(results);
  });
});

router.get('/complaints', (req, res) => {
  const query = `SELECT ComplaintId,PlaceOfOccurance,Grievance,Email,Status,PoliceId FROM complaintdetails`;
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching complaintdata:', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
    res.json(results);
  });
});


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

  const query = "SELECT Email, password, PoliceOfficerRank FROM policedata WHERE Email=?";
  connection.query(query, [user.Email], async (err, results) => {
    if (!err) {
      if (results.length <= 0) {
        return res.status(401).json({ message: "Incorrect username or password" });
      } else {
        const dbPassword = results[0].password;
        const officerRank = results[0].PoliceOfficerRank; // Retrieve the rank from the database

        // Compare the hashed password
        const hashedPassword = crypto
          .createHash("sha256")
          .update(user.password)
          .digest("hex");

        if (hashedPassword === dbPassword) {
          return res.status(200).json({
            message: "Successfully logged in",
            rank: officerRank // Include the officer's rank in the response
          });
        } else {
          return res.status(402).json({ message: "Incorrect password" });
        }
      }
    } else {
      return res.status(500).json(err);
    }
  });
});



router.post('/generatereport', async (req, res) => {
  const generatedUuid = uuid.v1(); // Generate a unique ID
  const userDetails = req.body;

  try {
    // Render the EJS template to HTML
    const htmlContent = await ejs.renderFile(path.join(__dirname, "", "FIR_Report.ejs"), {
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
      ReasonOfDelay: userDetails.ReasonOfDelay,
      GrievenceTitle: userDetails.GrievenceTitle
    });

    // Launch Puppeteer to generate the PDF
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Set the content of the page
    await page.setContent(htmlContent);

    // Generate the PDF and save it
    const pdfPath = path.resolve(__dirname, '../generated_pdf/partialReport.pdf');
    await page.pdf({
      path: pdfPath,
      format: 'A4',
      printBackground: true
    });

    // Close Puppeteer
    await browser.close();

    // After the PDF is generated, send the complaintID and the UUID to /uploadToIPFS
    const uploadResponse = await axios.post('http://localhost:3001/uploadToIPFS', {
      complaintID: userDetails.ComplaintID // Send the dynamic ComplaintID
    });

     // Send the response back to the frontend after processing
     res.status(200).json({
      uuid: generatedUuid,
      complaintID: userDetails.ComplaintID,
      ipfsResponse: uploadResponse.data,
    });

  } catch (err) {
    console.error('Error generating report:', err);
    res.status(500).json({ message: 'Error generating report', error: err });
  }
});

router.post('/getPdf', (req, res) => {
  const { uuid } = req.body;
  const filePath = path.resolve(__dirname, '..generated_pdf', 'partialReport.pdf');

  // Check if file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Send the file as a response with error handling
    res.sendFile(filePath, (err) => {
      if (err) {
        console.error('Error sending file:', err);
        res.status(500).json({ message: 'Error sending file' });
      }
    });
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
// const { createClient } = require('redis');


// // Create a Redis client with the connection URL
// const redisClient = createClient({
//     url: 'redis://localhost:6379'  // Redis connection URL
// });


// // Handle connection event
// redisClient.on('connect', function() {
//     console.log('Connected to Redis...');
// });


// // Handle error event
// redisClient.on('error', function (err) {
//     console.error('Redis error:', err);
// });


// // Connect to Redis
// (async () => {
//     try {
//         await redisClient.connect();
//         console.log('Redis client connected.');


//         // Initialize the counter if it doesn't exist
//         const counter = await redisClient.get("complaintCounter");
//         if (counter === null) {
//             await redisClient.set("complaintCounter", 0);
//             console.log('complaintCounter initialized to 0');
//         }
//     } catch (err) {
//         console.error('Redis connection failed:', err);
//     }
// })();


// // Function to get the current complaint counter from Redis
// async function getCurrentComplaintCounter() {
//     try {
//         const counter = await redisClient.get('complaintCounter');
//         if (!counter) {
//             await redisClient.set('complaintCounter', 1);  // Initialize counter if not present
//             return 1;
//         }
//         return parseInt(counter, 10);  // Return the current counter value
//     } catch (err) {
//         console.error('Error fetching complaintCounter:', err);
//     }
// }




// // Example function to increment complaintCounter
// async function incrementComplaintCounter() {
//     try {
//         const newCounter = await redisClient.incr("complaintCounter");
//         console.log(`Complaint Counter incremented: ${newCounter}`);
//         return newCounter;  // return the new counter value
//     } catch (err) {
//         console.error('Error incrementing complaintCounter:', err);
//     }
// }




// Endpoint to get the current complaint ID (no incrementing)
// router.get('/complaint-id', async (req, res) => {
//     try {
//         const currentCount = await getCurrentComplaintCounter();  // Get current counter value
//         const complaintID = `F${currentCount}`;  // Create the complaint ID
//         res.json({ complaintID });  // Send the complaint ID as response
//     } catch (err) {
//         console.error('Error fetching complaint ID:', err);
//         res.status(500).send('Error fetching complaint ID');
//     }
// });


router.get('/complaint-id', (req, res) => {
  // Query to get the current highest complaint ID number
  const query = 'SELECT MAX(CAST(SUBSTRING(ComplaintId, 2) AS UNSIGNED)) AS currentCount FROM complaintdetails';

  // Use the existing connection to query the database
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching current complaint counter:', err);
      return res.status(500).send('Error fetching complaint ID');
    }

    // If no complaint exists, initialize the count to 0
    const currentCount = results[0].currentCount || 0;

    // Generate the next Complaint ID (e.g., F1, F2, F3, etc.)
    const nextComplaintID = `F${currentCount + 1}`;

    // Send the next Complaint ID as a response
    res.json({ complaintID: nextComplaintID });
  });
});



// router.post('/incrementComplaintId', async (req, res) => {
//     console.log('Received request to increment complaint ID');
//     try {
//         const newCount = await incrementComplaintCounter();  // Increment the counter
//         const complaintID = `F${newCount}`;  // Create the new complaint ID
//         res.json({ complaintID });  // Send the incremented complaint ID as response
//     } catch (err) {
//         console.error('Error incrementing complaint ID:', err);
//         res.status(500).send('Error incrementing complaint ID');
//     }
// });




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
 
// router.get('/api/complaints', async (req, res) => {
//   const Email = req.query.Email;

//   if (!Email) {
//     return res.status(400).json({ error: 'Email parameter is required.' });
//   }

//   const query = `
//     SELECT ComplaintId, PlaceOfOccurance, Grievance
//     FROM complaintdetails
//     WHERE Email = ?;
//   `;

//   try {
//     const [rows] = await connection.execute(query, [Email]);
//     res.json(rows);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });


router.post("/addComplaint", (req, res) => {
  const { ComplaintId, PlaceOfOccurance, Grievance, Email, Status } = req.body;

  // Check if the complaint already exists
  const query = "SELECT ComplaintId FROM complaintdetails WHERE ComplaintId=?";
  connection.query(query, [ComplaintId], (err, results) => {
    if (!err) {
      if (results.length > 0) {
        return res.status(400).json({ message: "ComplaintId already exists" });
      } else {
        // Insert the new complaint into the database
        const insertQuery =
        "INSERT INTO complaintdetails (ComplaintId, PlaceOfOccurance, Grievance, Email, Status) VALUES (?, ?, ?, ?, 'Unassigned')";
        connection.query(
          insertQuery,
          [ComplaintId, PlaceOfOccurance, Grievance, Email,Status],
          (insertErr, insertResults) => {
            if (!insertErr) {
              return res.status(201).json({
                message: "Complaint successfully registered",
                data: insertResults,
              });
            } else {
              console.error("Error inserting complaint:", insertErr);
              return res.status(500).json({ message: "Error inserting complaint", error: insertErr });
            }
          }
        );
      }
    } else {
      console.error("Error checking complaint existence:", err);
      return res.status(500).json({ message: "Error checking complaint existence", error: err });
    }
  });
});


router.get('/complaints/:Email', async (req, res) => {
  const { Email } = req.params;

  try {
    // Use promise-based query
    const [rows] = await connection.promise().query('SELECT * FROM  complaintdetails WHERE Email = ?', [Email]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    res.json(rows);  // Send the first result if there's a match
  } catch (error) {
    console.error('Error fetching complainant:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/getPoliceIdByEmail/:email', (req, res) => {
  const { email } = req.params;
  const query = 'SELECT PoliceOfficerId FROM policedata WHERE Email = ?';
  connection.query(query, [email], (err, results) => {
    if (err) {
      console.error('Error fetching Police ID:', err);
      res.status(500).json({ message: 'Error fetching Police ID' });
    } else if (results.length > 0) {
      res.json({ PoliceOfficerId: results[0].PoliceOfficerId });
    } else {
      res.status(404).json({ message: 'Police ID not found' });
    }
  });
});


router.get('/getByPoliceId/:policeId', (req, res) => {
  const { policeId } = req.params;
  const query = 'SELECT * FROM complaintdetails WHERE PoliceId = ?';
  connection.query(query, [policeId], (err, results) => {
    if (err) {
      console.error('Error fetching complaints:', err);
      res.status(500).json({ message: 'Error fetching complaints' });
    } else {
      res.json(results);
    }
  });
});



 

module.exports = router;


