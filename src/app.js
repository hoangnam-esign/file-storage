const express = require("express");
const app = express();

require("dotenv").config();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const cors = require("cors");
app.use(cors());

const PORT = process.env.PORT;

app.use("/api", require("./routes"));

app.listen(PORT, () => console.log(`App listening on port ${PORT}!`));
