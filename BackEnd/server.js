import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { sequelize, Users, Books, Loans } from "./models.js";

await sequelize.sync({alter:true});
console.log("Sihronizovana tabela");

const app = express();

app.use(cors({
    origin:process.env.FRONT_URL
}));

app.use(bodyParser.json());

app.listen("5000",()=>{
    console.log("Server slusa na portu 5000")
});
