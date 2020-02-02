const inquirer = require("inquirer");
const fs = require("fs");
const util = require("util");
const axios = require("axios");
const convertHTMLtoPDF = require("pdf-puppeteer");
const writeFileAsync = util.promisify(fs.writeFile);
const convertAsync = util.promisify(convertHTMLtoPDF);



function promptUser() {

    return inquirer.prompt([
        {
            type: "input",
            name: "username",
            message: "What is your Githubname?"
        },

        {
            type: "input",
            name: "color",
            message: "Pick a color: green, blue, pink, or red?"
        }
    ])
}


async function getUser(username) {

    const queryUrl = `https://api.github.com/users/${username}`;
    const res = await axios.get(queryUrl)
    return res.data

}




var generatePDF = function (PDF) {

    fs.writeFile("githubProfile.pdf", PDF, "utf8", function (err) {
        if (err) {
            return console.log(err);
        }
        console.log("new pdf success!");
    })
}

const colors = {
    green: {
      wrapperBackground: "#E6E1C3",
      headerBackground: "#C1C72C",
      headerColor: "black",
      photoBorderColor: "#black"
    },
    blue: {
      wrapperBackground: "#5F64D3",
      headerBackground: "#26175A",
      headerColor: "white",
      photoBorderColor: "#73448C"
    },
    pink: {
      wrapperBackground: "#879CDF",
      headerBackground: "#FF8374",
      headerColor: "white",
      photoBorderColor: "#FEE24C"
    },
    red: {
      wrapperBackground: "#DE9967",
      headerBackground: "#870603",
      headerColor: "white",
      photoBorderColor: "white"
    }
};



function generateHTML(login, location, public_repos, followers, following, bio, avatar_url, answers, name) {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.1/css/all.css"/>
    <link href="https://fonts.googleapis.com/css?family=BioRhyme|Cabin&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
    <title>Developer Profile</title>
    <style>
   
   
  
  html, body {
  padding: 0;
  margin: 0;
  height: 100%; 
  }
  .container-fluid {
  padding:0;
  height:100%   
  }
  
  .wrapper {
  height: 33.33333%;
  }
  
  body {
  background-color: white;
  }

  .main {
  background-color: #E9EDEE;
  height: 33.33333%;
  padding-top: 200px;
  
  }
  h1, h2, h3, h4, h5, h6 {
  font-family:  serif;
  margin: 0;
  }
  
  .aboutMe {
  position: relative;
  margin-top: 80px;
  margin-right:auto;
  margin-bottom:0px;
  margin-left:auto;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  

  padding: 10px;
  width: 90vh;
  border-radius: 6px;
  height: 100%;
  
  }
  .aboutMe img {
  width: 250px;
  height: 250px;
  border-radius: 50%;
  object-fit: cover;
  margin-top: -50px;
 
  box-shadow: rgba(0, 0, 0, 0.3) 4px 1px 20px 4px;
  }
  .aboutMe h1, .aboutMe h2 {
  width: 100%;
  text-align: center;
  }
  .aboutMe h1 {
  margin-top: 10px;
  }
  .loc {
  width: 100%;
  text-align: center;
  padding: 20px 0;
  font-size: 1.1em;
  }
  .loc {
  display: inline-block;
  margin: 5px 10px;
  }
  
  .row {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  
  }
  
  .card {
  padding: 20px;
  border-radius: 6px;

  margin: 20px;
  }
  
  .col {
  flex: 1;
  text-align: center;
  }
  
  a, a:hover {
  text-decoration: none;
  color: inherit;
  font-weight: bold;
  }
  
  @media print { 
  body { 
  zoom: .75; 
  } 
  }
  </style>
    </head>
    <body>
    <div class="container-fluid">
    <div class="row wrapper">
        <div class="aboutMe">
            <img src="https://avatars3.githubusercontent.com/u/25015205?v=4" alt="profile picture"></img>    
            <h1>Hi!</h1>    
            <h1>My name is Dameon Charley!</h1>    
            
            <div class="row loc">
                <div class="col loc"><h3>Windsor CT</h3></a></div>
            </div>
        </div>
    </div>
    <div class="row main">
        <div class="col">
            <div class="row">
                <div class="col">
                    <h3>An accountant who grew a fond for coding</h3>
                </div>
                
            </div>
            <br>
            <div class="row">
                <div class="col card">
                    <h3>Public Repositories</h3>
                    <h3>12</h3>
                </div>
                <div class="col card">
                    <h3>Followers</h3>
                    <h3>3</h3>
                </div>
            </div>
            <div class="row">
                <div class="col card">
                    <h3>Following</h3>
                    <h3>3</h3>
                </div>
            </div>
        </div>
        
    </div>
    <div class="row wrapper">
        
    </div>
  </div>
    </body>
    </html>`;
}



async function init() {

    try {
        const answers = await promptUser();
        const Userinfo = await getUser(answers.username);

        const html = generateHTML(Userinfo.login, Userinfo.location, Userinfo.public_repos, Userinfo.followers, Userinfo.following, Userinfo.bio, Userinfo.avatar_url, answers.color, Userinfo.name);

        await writeFileAsync("index.html", html);

        convertAsync(html, generatePDF);

        console.log("Successfully wrote to index.html");
    }
    catch (err) {
        console.log(err);
    }
}

init();
