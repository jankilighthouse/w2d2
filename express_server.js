var express = require("express");
var app = express();
const cookieSession = require('cookie-parser');

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.use(cookieSession({

}))

var PORT = 8080; // default port 8080



var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
  // shortURL:
   "longURL":"http://jankilighthouse@gmail.com"


};

app.set("view engine", "ejs");


app.get("/urls", (req, res) => {
   let templateVars ={
                           username: req.cookies["username"], // cookie display you are loged in

                           url:urlDatabase
                     };
res.render("urls_index",templateVars);

});





app.get("/urls/new", (req, res) => {
     let templateVars ={
                        username: req.cookies["username"]

                      };
  res.render("urls_new",templateVars);
});


app.post('/login',(req,res)=>
{
  const username= req.body.username;
  res.cookie('username',username)

  res.redirect('/urls');

});


app.post('/logout',(req,res)=>
{
  const username= req.body.username;
  res.clearCookie('username',username)
  res.redirect('/urls');

});


app.get("/urls/:id", (req, res) => {

  let shortURL = req.params.id ; // rendom SHORTURL
  let longURL = urlDatabase[shortURL]; // LONGURL lighthouselab // for urls_show
let templateVars = { username: req.cookies["username"],

                      shortURL : shortURL,
                      longURL :  longURL

}

  res.render("urls_show", templateVars);

});

app.post("/urls/:id/edit", (req, res) => {

let shortURL = req.params.id;
console.log(req.params.id);
  let newURL = req.body.editURL;
  // console.log(newURL);
   // urlDatabase[req.params.id].url = req.body.editURL;
  // console.log(req.body.newURL)
    urlDatabase[req.params.id] = req.body.newURL;
    // console.log(urlDatabase);
    res.redirect("/urls");

//         urlDatabase[req.params.id].url = req.body.editURL;
// console.log(req.body.editURL);
//       res.redirect(`/urls/${req.params.id}`);


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
  console.log(shortURL);

  let longURL = urlDatabase[shortURL]; // LONGURL lighthouselab
  // console.log(longURL);
  res.redirect(longURL);
});


// app.get("/urls/:id", (req, res) => {

// let temp = { shortURL: req.params.id, url: urlDatabase[req.params.id].url};
//       res.render("urls_show", temp);

// });

app.post('/urls/:id/delete', (req, res) => {

      delete urlDatabase[req.params.id];
      res.redirect('/urls');

});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

