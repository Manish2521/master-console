import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

const app = express();
const port = 5000;

const options = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
  hour12: true,
  timeZone: 'Asia/Kolkata'
};

const currentDateTime = new Date();
const formattedDateTime = currentDateTime.toLocaleString('en-IN', options);

// MongoDB URI and Secret Key
const MONGODB_URI = 'mongodb://localhost:27017/master'; // Hard-coded MongoDB URI
const ACCESS_TOKEN_SECRET = 'esgdrhdrfhdfhfnffhfthftthffvngfngf'; // Replace with your desired secret key


const userSchema = new mongoose.Schema({
  username: String,
  password: String, 
  role: { type: String, required: true }
});


// // Models
// const Membership = mongoose.model('Membership', membershipSchema, 'membership');
// const AvailablePlans = mongoose.model('availablePlans', membershipSchema, 'availablePlans');
// const Employee = mongoose.model('employees', employeeSchema, 'employees');
// const Equipment = mongoose.model('equipment', equipSchema, 'equipment');
// const Trainer = mongoose.model('trainer', trainerSchema, 'trainer');
const User = mongoose.model('User', userSchema);

// Middleware
app.use(bodyParser.json());
app.use(cors({
  origin: [
    'https://master-console-controlz.netlify.app',
    'http://localhost:5173'
  ],
  credentials: true,
}));
app.use(cookieParser());

// MongoDB Connection
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.get("/", (req, res) => {
  res.json("Hello");
});

app.get('/checkUser', async (req, res) => {
  const username = req.query.username;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ exists: false, message: 'User not found' });
    }
    return res.status(200).json({ exists: true, message: 'User exists' });
  } catch (err) {
    console.error('Check user error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).json(users);
  } catch (err) {
    console.error('Get users error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (user && user.password === password) {
      const token = jwt.sign({ username }, ACCESS_TOKEN_SECRET, { expiresIn: '1h' });

      res.cookie('token', token, { httpOnly: true, secure: false, sameSite: 'Lax' });
      res.status(200).json({ message: 'Login successful' });

      console.log("-----------------------------------------------------------------------------------------------------------------------------------");
      console.log(`User: ${user.username} with Password: ${password} logged IN at ${formattedDateTime}`);
      console.log("-----------------------------------------------------------------------------------------------------------------------------------");
    } else {
      res.status(401).json({ error: 'Incorrect credentials' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Unable to connect to the database' });
  }
});



// Check if user exists endpoint
app.get('/checkUser', async (req, res) => {
  const username = req.query.username;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ exists: false, message: 'User not found' });
    }

    return res.status(200).json({ exists: true, message: 'User exists' });
  } catch (err) {
    console.error('Check user error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});



app.post('/logout', (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    secure: false,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });

  console.log("===============================================================================================================");
  console.log(`User logged OUT at ${formattedDateTime}`);
  console.log("===============================================================================================================");
});

const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: 'Unauthorized access' });

  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

app.get('/check-auth', authenticateToken, (req, res) => {
  res.json({ message: 'You are authenticated', user: req.user });
});

app.use('/error', (req, res) => {
  res.send(`
    <h1>Unauthorized Access</h1>
    <p>You are not logged in. Please log in to access this page.</p>
    <p>Redirecting to login page in <span id="countdown">5</span> seconds...</p>
    <script>
      let countdown = 5;
      const countdownElement = document.getElementById('countdown');
      const timer = setInterval(() => {
        countdown--;
        countdownElement.textContent = countdown;
        if (countdown <= 0) {
          clearInterval(timer);
          window.location.href = '/';
        }
      }, 1000);
    </script>
  `);
});

app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).send('Something broke!');
});

// Start Server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
