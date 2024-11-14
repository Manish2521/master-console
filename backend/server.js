import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';


const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors({
  origin: ['https://gymautomationfront.netlify.app', 'https://gymautomation.netlify.app' , 'http://localhost:5173'], // Allow both frontend origins
  credentials: true, // Allow credentials (cookies) to be included
}));
app.use(cookieParser());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/master-console', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('Error connecting to MongoDB:', err));

// Sample User Schema (assumes password is stored as plaintext)
const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
});

const User = mongoose.model('user', userSchema);
// module.exports = User;

// Middleware to parse JSON
app.use(express.json());

// POST /login endpoint for authentication
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log("Request body:", req.body);
  
    try {
      const user = await User.findOne({ username, password });
      if (user) {
        res.status(200).send({ message: 'Login successful' });
      } else {
        res.status(400).send({ message: 'Invalid credentials' });
      }
    } catch (error) {
      console.error("Error during login:", error); // Log the actual error
      res.status(500).send({ message: 'Internal server error' });
    }
  });
  
// Start the server
app.listen(5000, () => {
  console.log('Server is running on http://localhost:5000');
});
