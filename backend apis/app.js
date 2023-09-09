const express = require("express");
const mongoose = require("mongoose");
const url = "mongodb+srv://rahildb:MTnWxvW5qNoAQGg6@cluster0.dksldog.mongodb.net/";
const app = express();
const cors = require("cors");
const dataRoutes = require("../backend apis/routes/dataRoutes")
const searchRoutes = require("../backend apis/routes/searchRoutes")
const getFileRoute = require("../backend apis/routes/getFiles");


try {
  mongoose
    .connect(url, {
      ssl: true,
    })

    .then(() => {
      console.log("db is connected");
    })

    .catch((error) => {
      console.log("db is not connected ", error);
    });
} catch (error) {
  console.log(error);
}

const port = 8000;

app.use(cors());
app.use(express.json());
app.use('/api/data', dataRoutes);
app.use('/api/search', searchRoutes);
app.use('/api', getFileRoute)


app.listen(port, () => {
  console.log("sever started");
});
