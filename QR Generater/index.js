import inquirer from "inquirer";
var qr = require("qr-image");

inquirer
  .prompt([{ message: "Type in your URL: ", name: "URL" }])
  .then((answers) => {
    const url = answers.URL;
    console.log(answers);
  })
  .catch((error) => {
    if (error.isTtyError) {
    } else {
    }
  });
