if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
//models will go here
require("./models/admin");
require("./models/user");
const express = require("express");
const cors = require("cors");
const MongoDBStore = require("connect-mongo");
const mongoose = require("mongoose");

const passport = require("passport");
const localStrategy = require("passport-local");

const session = require("express-session");
var bodyParser = require("body-parser");

const Admin = mongoose.model("Admin");
const User = mongoose.model("User");

const app = express();
const PORT = 3000;
const mongoURi = "mongodb://0.0.0.0:27017/mern_db_practice";
const secret = "hegge";

// Routes will go here

const adminRoutes = require('./routes/adminRoute');
const userRoutes = require('./routes/userRoute');
// Use cors middleware with specific origin
app.use(cors({
  origin: "http://localhost:5173",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
}));
const store = new MongoDBStore({
  mongoUrl: mongoURi,
  secret,
  touchAfter: 24 * 60 * 60,
});
const sessionConfig = {
  store,
  secret,
  name: "session",
  resave: false,
  saveUninitialized: false,
};

// Setting up the app

app.use(express.static(__dirname + "/public"));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.use(session(sessionConfig));

app.use(passport.initialize());

app.use(passport.session());

passport.use("admin", new localStrategy(Admin.authenticate()));
passport.use("user", new localStrategy(User.authenticate()));
passport.serializeUser((user, done) => {
  if (user instanceof User) {
    done(null, { type: "user", id: user.id });
  } else if (user instanceof Admin) {
    done(null, { type: "admin", id: user.id });
  }
});
passport.deserializeUser(async (data, done) => {
  try {
    let user;
    if (data.type === "user") {
      user = await User.findById(data.id);
    } else if (data.type === "admin") {
      user = await Admin.findById(data.id);
    }

    // Save the user object in the session regardless of its type
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// initializing Mongoose
mongoose
  .connect(mongoURi, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {})
  .catch((e) => {
    console.log(e);
  });

const db = mongoose.connection;

db.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

db.once("open", () => {
  console.log("Connected to MongoDB");
});

app.use(express.json());

//Routes usage will go here
app.use(adminRoutes);
app.use(userRoutes);
// Listen for the port Number
app.listen(PORT, () => {
  console.log(`App is listening on http://localhost:${PORT}`);
});
