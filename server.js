const dotenv = require('dotenv');
const mongoose = require('mongoose');
const app = require('./app');
dotenv.config({ path: './config.env' });
const PORT = process.env.PORT;
const DB = process.env.DB_LINK.replace('<password>', process.env.DB_PASSWORD);
mongoose.connect(
  DB,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) throw err;
    console.log('Connected to MongoDB !!');
  }
);

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
