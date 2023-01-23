"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const http_1 = require("http");
const app = (0, express_1.default)();
const PORT = 8000;
const DB = "PalCom_db";
const httpServer = (0, http_1.createServer)(app);
// middleware
dotenv_1.default.config();
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({ credentials: true, origin: "http://localhost:3000" }));
// connect to db
require("./config/mongoose.config")(DB);
// connect to route files
require("./routes/user.routes")(app);
require("./routes/message.routes")(app);
// connect the websocket server
require("./webSockets")(httpServer);
httpServer.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
