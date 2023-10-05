"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-undef */
const child_process_1 = require("child_process");
const seedDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    yield new Promise((resolve, reject) => {
        (0, child_process_1.exec)('npx sequelize-cli db:seed:all --config src/server/db/config.json --seeders-path src/server/db/seeders', { env: process.env }, (err) => (err ? reject(err) : resolve(() => { })));
    });
});
exports.default = seedDatabase;
