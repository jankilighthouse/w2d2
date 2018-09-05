var express = require("express");
var app = express();
var PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
  // shortURL:
   "longURL":"http://jankilighthouse@gmail.com"


};



app.get("/urls", (req, res) => {
   let templateVars =
   {
    url:urlDatabase
  };
res.render("urls_index",templateVars);

});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

// app.post("/urls", (req, res) => {
//   console.log(req.body.longURL);  // debug statement to see POST parameters generated from ulx_nesw.ejs
//   res.send("Ok");         // Respond with 'Ok' (we will replace this)
// });


app.get("/urls/:id", (req, res) => {
  let templateVars = { longURL: req.params.id };
  res.render("urls_show", templateVars);
});

function generateRandomString() {
  let randomString='';
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for(let i=0;i<6;i++)
  {
        randomString += possible.charAt(Math.floor(Math.random() * possible.length));

  }
  return randomString;


}
app.post("/urls", (req, res) => {
const shortURL = generateRandomString();
const longURLRED = req.body.longURL;  // debug statement to see POST parameters generated from ulx_nesw.ejs

 urlDatabase[shortURL] = longURLRED;
// console.log(urlDatabase);
res.redirect(`urls/${shortURL}`);
console.log("redirected on short url");


});

app.get("/u/:shortURL", (req, res) => {
  let shortURL = req.params.shortURL ; // rendom SHORTURL
  // console.log(shortURL);

  let longURL = urlDatabase[shortURL]; // LONGURL lighthouselab
  // console.log(longURL);
  res.redirect(longURL);
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

