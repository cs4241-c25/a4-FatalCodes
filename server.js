const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const User = require('./models/User');
const Todo = require('./models/Todo');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/todoApp', {
}).then(() => {
  console.log('MongoDB connected');
}).catch(err => {
  console.error('MongoDB connection error:', err);
  if (process.env.LIGHTHOUSE_MODE !== 'true') {
    process.exit(1);
  }
});

const app = express();

// Move the production static file serving to the top
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/dist')));
}

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || 'your_session_secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  }
}));

app.use(passport.initialize());
app.use(passport.session());

// GitHub authentication
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.NODE_ENV === 'production'
      ? `${process.env.CLIENT_URL}/auth/github/callback`
      : 'http://localhost:3000/auth/github/callback'
  },
  async function(accessToken, refreshToken, profile, done) {
    try {
      let user = await User.findOne({ githubId: profile.id });
      
      if (!user) {
        user = await User.create({
          githubId: profile.id,
          username: profile.username,
          displayName: profile.displayName || profile.username,
          avatar: profile._json.avatar_url
        });
      }
      
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// Auth routes
app.get('/auth/github',
  passport.authenticate('github', { scope: [ 'user:email' ] }));

app.get('/auth/github/callback', 
  passport.authenticate('github', { 
    failureRedirect: process.env.NODE_ENV === 'production' ? `${process.env.CLIENT_URL}/` : 'http://localhost:5173/',
    successRedirect: process.env.NODE_ENV === 'production' ? `${process.env.CLIENT_URL}/todos` : 'http://localhost:5173/todos'
  })
);

app.get('/api/auth/user', (req, res) => {
  res.json(req.user || null);
});

app.get('/api/auth/logout', (req, res) => {
  req.logout((err) => {
    if (err) console.error(err);
    res.json({ success: true });
  });
});

if (process.env.LIGHTHOUSE_MODE === 'true') {
  app.use((req, res, next) => {
    req.user = {
      id: 'lighthouse-test-id',
      username: 'lighthouse-user'
    };
    next();
  });
}

// Routes

app.get('/', (req, res) => {
  res.redirect(process.env.CLIENT_URL || 'http://localhost:5173');
});

app.get('/login', (req, res) => {
  res.redirect('/auth/github');
});

app.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) console.error(err);
    res.redirect(process.env.CLIENT_URL || 'http://localhost:5173');
  });
});

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated() || process.env.LIGHTHOUSE_MODE === 'true') return next();
  res.status(401).json({ error: 'Not authenticated' });
}

// API Endpoints

app.get('/api/todos', isAuthenticated, async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user._id });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
});

app.post('/api/todos', isAuthenticated, async (req, res) => {
  try {
    const { task, category, priority, customDeadline } = req.body;
    const creationDate = new Date();

    let deadline;
    if (customDeadline) {
      deadline = new Date(customDeadline);
    } else {
      const days = priority === 'high' ? 2 : priority === 'medium' ? 5 : 7;
      deadline = new Date();
      deadline.setDate(creationDate.getDate() + days);
    }

    const newTodo = new Todo({
      user: req.user._id,
      task,
      category,
      priority,
      creationDate,
      deadline,
      completed: false
    });

    const savedTodo = await newTodo.save();
    res.status(201).json(savedTodo);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create todo' });
  }
});

app.patch('/api/todos/:id', isAuthenticated, async (req, res) => {
  try {
    const updateData = req.body;
    const updatedTodo = await Todo.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      updateData,
      { new: true }
    );
    if (!updatedTodo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    res.json(updatedTodo);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update todo' });
  }
});

app.delete('/api/todos/:id', isAuthenticated, async (req, res) => {
  try {
    const deletedTodo = await Todo.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!deletedTodo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete todo' });
  }
});

// Move the catch-all route to the bottom and remove the redirect
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/dist/index.html'));
  });
} else {
  app.get('*', (req, res) => {
    res.redirect(process.env.CLIENT_URL || 'http://localhost:5173');
  });
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
