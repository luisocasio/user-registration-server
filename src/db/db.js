const mongoose = require("mongoose");

mongoose
  .set("strictQuery", true)
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch((error) => {
    console.error(error.message);
  });
