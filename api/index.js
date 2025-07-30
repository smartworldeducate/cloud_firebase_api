const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Firebase Admin Setup
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const usersCollection = db.collection('users');


// ✅ CREATE - Add user
app.post('/users', async (req, res) => {
  try {
    const data = req.body;
    const newUser = await usersCollection.add(data);
    res.status(201).json({ id: newUser.id, ...data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ READ - Get all users
app.get('/users', async (req, res) => {
  try {
    const snapshot = await usersCollection.get();
    const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ READ - Get user by ID
app.get('/users/:id', async (req, res) => {
  try {
    const doc = await usersCollection.doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ error: 'User not found' });
    res.json({ id: doc.id, ...doc.data() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ UPDATE - Update user by ID
app.put('/users/:id', async (req, res) => {
  try {
    await usersCollection.doc(req.params.id).update(req.body);
    res.json({ message: 'User updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ DELETE - Delete user by ID
app.delete('/users/:id', async (req, res) => {
  try {
    await usersCollection.doc(req.params.id).delete();
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
