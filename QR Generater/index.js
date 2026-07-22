import inquirer from "inquirer";
import qr from "qr-image";
import fs, { writeFile } from "fs";
inquirer
  .prompt([{ type: "input", message: "Type in your URL: ", name: "URL" }])
  .then((answers) => {
    const url = answers.URL;
    var qr_svg = qr.image(url);
    qr.svg.pipe(require("fs").createWriteStream("qr_img.svg"));

    fs.writeFile("URL.txt",url,(err)=>{
      if(err) throw err;
      console.log("This file had been saved")
    });
  })
  .catch((error) => {
    if (error.isTtyError) {
    } else {
    }
  });
