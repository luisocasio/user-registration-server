const mongoose = require('mongoose')

mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    // useFindAndModify: false,
    // useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .catch((error) => {
    console.error(error.message)
  })
