const express = require("express");
const multer = require("multer");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const { promisify } = require("util");

const pipeline = promisify(require("stream").pipeline);

const router = express.Router();

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, `${__dirname}/../public/resume/`);
     },
    filename: function (req, file, cb) {
        cb(null , file.originalname);
    }
});

const upload = multer({'storage':storage});

router.post("/resume", upload.single("file"), async (req, res) => {
    const { file } = req;
    if (file.mimetype != 'application/pdf') {
        res.status(400).json({
            message: "Invalid format",
        });
    }else{
        res.send({
            message: "File uploaded successfully",
            url: `/host/resume/${file.originalname}`,
        });
    }


//   console.log(file)
//   try {
//     if (file.mimetype != 'application/pdf') {
//         res.status(400).json({
//           message: "Invalid format",
//         });
//       } else {
//         const filename = `${uuidv4()}${'.pdf'}`;

//         // req.pipe(fs.createWriteStream(`${__dirname}/../public/resume/${filename}`));

//         res.send({
//             message: "File uploaded successfully",
//             url: `/host/resume/${filename}`,
//         });

//         req.on('error',(err)=>{
//             console.log(err)
//             res.status(400).json({
//             message: "Error while uploading",
//             });
//         })
//         // await pipeline(
//         // //   file.stream,
//         //   fs.createWriteStream(`${__dirname}/../public/resume/${filename}`)
//         // )
//         //   .then(() => {
//         //     res.send({
//         //       message: "File uploaded successfully",
//         //       url: `/host/resume/${filename}`,
//         //     });
//         //   })
//         //   .catch((err) => {
//         //     console.log(err)
//         //     res.status(400).json({
//         //       message: "Error while uploading",
//         //     });
//         //   });
//       }
//   } catch (error) {
//       console.log("hello "+error)
//   }

});

router.post("/profile", upload.single("file"), (req, res) => {
  const { file } = req;
  if (
    file.detectedFileExtension != ".jpg" &&
    file.detectedFileExtension != ".png"
  ) {
    res.status(400).json({
      message: "Invalid format",
    });
  } else {
    const filename = `${uuidv4()}${file.detectedFileExtension}`;

    pipeline(
      file.stream,
      fs.createWriteStream(`${__dirname}/../public/profile/${filename}`)
    )
      .then(() => {
        res.send({
          message: "Profile image uploaded successfully",
          url: `/host/profile/${filename}`,
        });
      })
      .catch((err) => {
        res.status(400).json({
          message: "Error while uploading",
        });
      });
  }
});

module.exports = router;
