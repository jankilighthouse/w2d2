const express = require("express");
const app = express();
const cookieSession = require('cookie-session');
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'session',
  keys: ['janki'],
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))
var PORT = 8080; // default port 8080
const urlDatabase = {
  "b2xVn2": {
    url: "http://www.lighthouselabs.ca",
    id: 'userRandomID',
    shortURL: 'b2xVn2'
  }
};
const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
     password: bcrypt.hashSync('p', 10)
  },
}
app.use('/urls',function(req,res,next){
  if (req.session.user_id) {
    next();
  } else {
    res.redirect('/login');
  }
});
//Return the user for the email matched
function findUserByEmail(email){
  for(let key in users){
    if(email === users[key].email){
      return users[key];
    }
  }
}

function urlsForUser(id) {
  let urls = {};
  for(let i in urlDatabase) {

    if(urlDatabase[i].id === id) {
      urls[i] = {
          longURL:urlDatabase[i].longURL
      }

    }
  }
  return urls;
}
function generateRandomString() {
  let randomString='';
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for(let i=0;i<6;i++){
       randomString += possible.charAt(Math.floor(Math.random() * possible.length));
      }
      return randomString;
  }
app.get('/', (req, res) => {
  if(!req.session.user_id){
    res.redirect('/login');
  } else {
    res.redirect('/urls');
  }
});
//GET - Register : Displays the Register page
app.get('/register', (req, res) => {

  // console.log(req.user_id);
  if(!req.session.user_id){
    res.render('urls_register');
  } else {
    res.redirect('/urls');
  }
});

app.post('/register', (req, res) => { // for register new user
  if(!req.body.email || !req.body.password){
    res.statusCode = 400;
    res.render('error', errorPageSetup(400, 'Enter a valid email or password. Register again!'));
  } else{
    const user = findUserByEmail(req.body.email);
    if(user){
      res.statusCode = 400;
      res.render('User already exists. Register with a different email!');
    } else {
      //Storing in user information in the database
      let id = generateRandomString();
      users[id] = {};
      users[id].id = id;
      users[id].email = req.body.email;
      const hashedPassword = bcrypt.hashSync(req.body.password, 10);
      users[id].password = hashedPassword;
      console.log("Users are", users);
      req.session.user_id = id;
      res.redirect('/urls');
    }
  }
});
//GET - Login : Displays the login page
app.get('/login', (req, res) => {

  if(!req.session.user_id){
    res.render('urls_login');
  } else {
    res.redirect('/urls');
  }
});
//POST - Login : Handles login info, sets the cookie to id and redirects to homepage if user is authenticated
app.post('/login',(req,res)=> //login
{
if(req.body.email === '' || req.body.password === '') {
    res.redirect(400, '/login')
  } else {
    for(let i in users) {
      if (users[i].email === req.body.email) {
        if (bcrypt.compareSync(req.body.password,users[i].password)) {
          req.session.user_id = users[i].id;
          return res.redirect('/urls');
        }
      }
    }
    res.redirect(403, '/login');
  }
});
//POST - Logout : Logs the user out and clears the cookie.
app.post('/logout',(req,res)=>{
  const users= req.body.users;
    req.session = null;
    res.redirect('/urls');
});
//GET - Add : Add a new URL
app.get("/urls/new", (req, res) => {
    const usercookie = req.session.user_id;
     let templateVars ={user: users[usercookie]}
                      if(usercookie){
                      res.render("urls_new",templateVars);
                      }else{
                      res.redirect('/login');
                    }
  });
app.get("/urls", (req, res) => {
const cookie = req.session.user_id;
let userURL = urlsForUser(cookie) // for hiding data to third party
   let templateVars ={urls: userURL,user: users[cookie], url:urlDatabase };

              if(cookie){
                  res.render("urls_index",templateVars);  /// if user is login then he can acess
                      }else{
                      res.redirect('/login');
                    }
                });

//POST - Add : Redirects the url to /u/shorturl after generating and assigning a random string to longURL
app.post("/urls", (req, res) => {
const randomString = generateRandomString();
let userID = req.session.user_id;
const longURLRED = req.body.longURL;  // debug statement to see POST parameters generated from ulx_nesw.ejs
urlDatabase[randomString] = {
url:longURLRED,
id:userID,
shortURL:randomString
}
console.log(urlDatabase);
res.redirect(`/urls/${randomString}`);
});
//GET - Edit : Shows an Edit page for a id url
app.get("/urls/:id", (req, res) => {
if(!urlDatabase[req.params.id]){
      res.statusCode = 404;
      res.send("Error 404 : Page not found");
    } else {
      if(urlDatabase[req.params.id].id === req.session.user_id){
      let temp = { shortURL: req.params.id, url: urlDatabase[req.params.id].url, user: users[req.session.user_id]};
      res.render("urls_show", temp);
    }
    }
});

//POST - Edit : Redirects to /urls:id after updating the selected url in the database
app.post("/urls/:id/edit", (req, res) => {
      if(urlDatabase[req.params.id].id === req.session.user_id){
      urlDatabase[req.params.id].url = req.body.editURL;
      res.redirect("/urls");
    }
});

//POST - Delete : Redirects to /urls after the deleting the selected url from the database
app.post('/urls/:id/delete', (req, res) => {
if(!urlDatabase[req.params.id]){
      res.statusCode = 404;
      res.send("Error 404 : Page not found");
    }
    if(urlDatabase[req.params.id].id === req.session.user_id){
      delete urlDatabase[req.params.id];
      res.redirect('/urls');
    } else {
      res.statusCode = 403;
      res.end("You are trying to access the url that doesn't belong to you.");
    }
});
//middle link for redirecting from shorturl to corresponding webpage
app.get("/u/:shortURL", (req, res) => {
if(!urlDatabase[req.params.id]){
    res.statusCode = 404;
    res.send("Error 404 : Page not found");
  } else {
    res.redirect(urlDatabase[req.params.id].url);
  }

});
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

