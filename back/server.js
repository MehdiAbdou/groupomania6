const express = require("express");
const cookieParser = require("cookie-parser");
const userRoutes = require("./routes/user.routes");
const postRoutes = require("./routes/post.routes");
require("dotenv").config({ path: "./config/.env" });
require("./config/db");
const { checkUser, requireAuth } = require("./middleware/auth.middleware");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const app = express();

//Ratelimiter
const limiter = rateLimit({
  windowMs: 1000 /*ms*/ * 60 /*secondes*/ * 15 /*minutes*/, 
  max: 25, // Limite chaque IP a 25 requêtes par tranche de 15 minutes
  standardHeaders: true, // Renvoie le statut du ratelimiter aux headers `RateLimit-*`
  legacyHeaders: false, // Désactive le ratelimiter pour les headers `X-RateLimit-*`
});

//parametrage CORS
const corsOptions = {
  origin: ["http://localhost:3000", "*"],
  default: "http://localhost:3000",
  credentials: true,
  allowedHeaders: ["sessionId", "Content-Type"],
  exposedHeaders: ["sessionId"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//jwt
app.get("*", checkUser);
app.get("/jwtid", requireAuth, (req, res) => {
  res.status(200).send(res.locals.user._id);
});

//routes
app.use("/api/user/register", limiter);
app.use("/api/user/login", limiter);
app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);

// server
app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`);
});
