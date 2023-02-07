import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

const app: Application = express();
const PORT: Number = 8000;
const DB: String = "PalCom_db"

// middleware
dotenv.config();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

// connect to db
require("./config/mongoose.config")(DB);

// connect to route files
require("./routes/user.routes")(app);
require("./routes/message.routes")(app);


const server = app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));

// connect the websocket server
require("./webSockets")(server);








