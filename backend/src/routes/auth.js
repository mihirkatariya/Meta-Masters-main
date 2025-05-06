
import { Router } from 'express';
import User from '../Models/User.js';
import jwt from 'jsonwebtoken';
import { compare } from 'bcryptjs';
const router = Router();


// Register a new user
router.post('/register', async (req, res) => {
     const {name, email, password} = req.body;
     try{
         const newUser = new User({ name, email, password });
         await newUser.save();
         const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '15d'});
         res.status(201).json({token});
     } catch (error) {
         res.status(400).json({ error: 'User already exists' });
     }
});


//Login user and generate JWT token
router.post('/login', async (req, res) => {
     const { email, password } = req.body;
     try{
         const user = await User.findOne({ email });
         if (!user) return res.status(404).json({ error: 'User not found'});

         const isMatch = await compare(password, user.password);
         if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

         const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15d'});
         res.json({ token });
     } catch (error) {
         res.status(500).json({ error: 'Server error' });
     }
});

router.get('/me', async (req, res) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) return res.status(401).json({ error: 'Unauthorized' });
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('name email');
      if (!user) return res.status(404).json({ error: 'User not found' });
  
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  });

export default router;