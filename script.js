const inquirer = require("inquirer");
const fs = require("fs");
const util = require("util");
const axios = require("axios");

const htmlToPDF = require("puppeteer");
const writeFileAsync = util.promisify(fs.writeFile);




function promptUser() {

    return inquirer.prompt([
        {
            type: "input",
            name: "username",
            message: "What is your Github name?"
        },

        {
            type: "input",
            name: "color",
            message: "Pick a color: green, blue, pink, or red?"
        }
    ])
}


async function getUser(answers) {

    const queryUrl = `https://api.github.com/users/${answers.username}`;
    const res = await axios.get(queryUrl)
    return res.data

}




async function getStarInfo(answers) {
    const queryUrl = `https://api.github.com/users/${answers.username}/starred`
    const res = await axios.get(queryUrl)
    return res.data
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

var options = {
    format : "Letter",
    printbackground : true,
    margin: {
        top : "0px",
        right: "0px",
        bottom: "0px",
        left: "0px"
    }
}

async function init() {

    try {
        const answers = await promptUser();


        const userInfo = await getUser(answers);
        const star = await getStarInfo(answers)


        const html = generateHTML(answers, userInfo, star);

        await writeFileAsync("index.html", html);

      
        
        await writeToPDF();

        
        
    }
    catch (err) {
        console.log(err);
    }
}

async function writeToPDF(){
    const browser = await htmlToPDF.launch({headless: true , slowMo: 150})
    const page = await browser.newPage();
    const readHtml = fs.readFileSync("index.html", "utf8")
    await page.setContent(readHtml)
    await page.pdf({
        path: "gitBio2.pdf",
    });
    console.log("PDF Sucess");
    await browser.close()
    
}
init();

function generateHTML(answers,  userInfo, star) {
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
    background-color: ${colors[answers.color].wrapperBackground};
  height: 33.33333%;
  }
  
  body {
    -webkit-print-color-adjust: exact !important;
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
    background-color:${colors[answers.color].headerBackground};
   
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
border: 6px solid ${colors[answers.color].photoBorderColor};
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
  color :black
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
background-color :${colors[answers.color].headerBackground};
color: ${colors[answers.color].headerColor};
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
            <img src="${ userInfo.avatar_url}" alt="profile picture"></img>
            
            <div class="row loc">
            <h1>Hi!</h1>    
            <div  
               class="col loc"><h1>My name is ${ userInfo.name}!</h1> 
                <h3>${ userInfo.location}</h3></a></div>
            </div>
        </div>
    </div>
    <div class="row main">
        <div class="col">
            <div class="row">
                <div class="col">
                    <h3>${ userInfo.bio}</h3>
                </div>  
                
            </div>
            <br>
            <div class="row">
                <div class="col card">
                    <h3>Public Repositories</h3>
                    <h3>${ userInfo.public_repos}</h3>
                </div>
                <div class="col card">
                    <h3>Followers</h3>
                    <h3>${ userInfo.followers}</h3>
                </div>
               
            </div>

            <div class="row">
                <div class="col card">
                <h3>Following</h3>
                <h3> ${ userInfo.following}</h3>
                </div>
                <div class="col card">
                <h3>Stars</h3>
                <h3> ${star.length}</h3>
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



