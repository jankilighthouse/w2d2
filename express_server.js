const express = require("express");
const app = express();
const cookieSession = require('cookie-parser');
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2'],
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))

var PORT = 8080; // default port 8080
var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
  // shortURL:
   "longURL":"http://jankilighthouse@gmail.com"
};
const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
     password: "purple-monkey-dinosaur"
  },
}
app.set("view engine", "ejs");

app.get("/urls", (req, res) => {
const cookie = req.cookies.user_id
   let templateVars ={
                           user: users[cookie], // cookie display you are loged in with email.id

                           url:urlDatabase
                     };
res.render("urls_index",templateVars);

});

app.get("/urls/new", (req, res) => {

     let templateVars ={
                        user: req.cookies["users"]

                      };
  res.render("urls_new",templateVars);
});

app.get('/register', (req, res) => {
  let templateVars = {
  randID: req.cookies["user_id"],

    user: users[req.user_id]
  }
  console.log(req.user_id);
  res.render('urls_register', templateVars)
});


app.get('/login', (req, res) => {
  // const user =req.cookie.user)?JSON.parse(req.cookies.user.user_id ): '' ;
  // const user = req.cookies.user_id || '' ;
  let templateVars = {

  user: users[req.user_id]

  };
  console.log(users[req.user_id]);
  res.render('urls_login', templateVars);
});


app.post('/register', (req, res) => { // for register new user
  let randID = generateRandomString();
if(req.body.email === '' || req.body.password === '') { //CHECK FOR USER IS ALREDY REGISTER OR NOR(YOU HAVE TO IMPLE..)
    res.redirect(400, '/register')
  } else {
    users[randID] = {
      id: randID,
      email: req.body.email,
      password:req.body.password
    }
    const user_id= req.body.email;

  res.cookie('user_id',randID)

    req.user_id = randID;
    console.log(req.user_id);
    console.log(users);
    res.redirect('/urls');
}
});



app.post('/login',(req,res)=> //login
{
if(req.body.email === '' || req.body.password === '') {
    res.redirect(400, '/login')
  } else {
    for(let i in users) {
      if (users[i].email === req.body.email) {
        if ((req.body.password ===users[i].password)) {
          req.user_id = users[i].id;
            res.cookie('user_id',users[i].id)
                const user_id= req.body.email;


          return res.redirect('/urls');
        }
      }
    }
    res.redirect(403, '/login');
  }
});



app.post('/logout',(req,res)=> //logout
{
  const users= req.body.users;
  res.clearCookie('user_id')
  res.redirect('/urls');

});



app.get("/urls/:id", (req, res) => {

  let shortURL = req.params.id ; // rendom SHORTURL
  let longURL = urlDatabase[shortURL]; // LONGURL lighthouselab // for urls_show
let templateVars = { user: req.cookies["users"],

                      shortURL : shortURL,
                      longURL :  longURL

}
res.render("urls_show", templateVars);

});

app.post("/urls/:id/edit", (req, res) => {
let shortURL = req.params.id;
console.log(req.params.id);
  let newURL = req.body.editURL;
  urlDatabase[req.params.id] = req.body.newURL;
    res.redirect("/urls");

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
app.post('/urls/:id/delete', (req, res) => {

      delete urlDatabase[req.params.id];
      res.redirect('/urls');

});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

