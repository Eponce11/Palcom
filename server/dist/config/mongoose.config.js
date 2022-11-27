"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
module.exports = (DB) => {
    (0, mongoose_1.connect)(`mongodb://localhost/${DB}`)
        .then(() => console.log(`Connected to ${DB}`))
        .catch((err) => console.log(`Connection failed to ${DB}`, err));
};
