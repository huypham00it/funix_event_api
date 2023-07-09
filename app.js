require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/user");
const Role = require("./models/role");
const jwt = require("jsonwebtoken");
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger_output.json');
const {
  OAuth2Client,
  UserRefreshClient
} = require('google-auth-library');
const axios = require('axios')


const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;

const app = express();
const session = require('express-session');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'SECRET'
}));

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    methods: ["POST", "PUT", "GET", "DELETE", "OPTIONS", "HEAD"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const passport = require('passport');

app.use(passport.initialize());
app.use(passport.session());

const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback",
  passReqToCallback: true,
  accessType: 'offline',
  prompt: 'consent',
  scope: ['email', 'profile'],
},
  function (req, accessToken, refreshToken, profile, done) {
    return done(null, { profile, accessToken, refreshToken });
  }
));

const oAuth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'postmessage',
);

app.post('/user/login', async (req, res) => {
  const { tokens } = await oAuth2Client.getToken(req.body.code); // exchange code for tokens
  const response = await axios.get(process.env.GOOGLE_USERINFO_API, {
    headers: {
      Authorization: `Bearer ${tokens.access_token}`
    }
  })

  if (response.data.email.endsWith(process.env.EMAIL_DOMAIN) && response.data.verified_email) {
    return res.status(200).json({ ...tokens, ...response.data });
  } else {
    return res.status(403).json({ message: Messages.FORBIDDEN })
  }
});

app.post('/user/login/refresh-token', async (req, res) => {
  const user = new UserRefreshClient(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    req.body.refreshToken,
  );
  const { credentials } = await user.refreshAccessToken(); // optain new tokens
  res.json(credentials);
})

const googleAuthRoutes = require("./routes/user/googleAuth");
const adminRoutes = require("./routes/admin/admin");
const userRoutes = require("./routes/user/user");
const Messages = require("./utils/Messages");

app.use(googleAuthRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1", userRoutes);


app.get('/auth/google/success', async (req, res) => {
  try {
    const profile = req.user.profile._json
    if (profile.email.endsWith("@funix.edu.vn") && profile.email_verified) {
      const accessToken = req.user.accessToken
      const refreshToken = req.user.refreshToken
      // return res.status(200).json({ profile, accessToken, refreshToken })
      return res.redirect(`${process.env.FE_USER_BASE_URL}/google/redirect?name=${profile.name}&email=${profile.email}&picture=${profile.picture}&accessToken=${accessToken}&refreshToken=${refreshToken}`)
    } else {
      return res.redirect(`${process.env.FE_USER_BASE_URL}/google/forbidden`);
    }
  } catch (error) {
    res.status(500).json({ message: Messages.SERVER_ERROR })
  }
})

app.get('/auth/google/error', (req, res) => res.send("Lỗi đăng nhập."));

app.get('/routes', (req, res) => res.status(200).json({ routes: getAllRoutes() }))

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});

mongoose
  .connect(MONGO_URI).then(() => {
    app.listen(PORT, async () => {
    });
  })

// Get all routes
function getAllRoutes() {
  const routes = [];

  app._router.stack.forEach((middleware) => {
    if (middleware.route) {
      // Route middleware
      const route = {
        path: middleware.route.path,
        method: Object.keys(middleware.route.methods)[0].toUpperCase()
      };
      routes.push(route);
    } else if (middleware.name === 'router') {
      // Sub-router middleware
      middleware.handle.stack.forEach((handler) => {
        const route = handler.route;
        if (route) {
          const subRoute = {
            path: route.path,
            method: Object.keys(route.methods)[0].toUpperCase()
          };
          routes.push(subRoute);
        }
      });
    }
  });

  return routes;
}