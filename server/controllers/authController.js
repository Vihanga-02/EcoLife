import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import { uploadToFirebase, deleteFromFirebase } from '../utils/firebaseUpload.js';

// Register a new user
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email and password' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    const user = await User.create({ name, email, password });
    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        greenScore: user.greenScore,
        totalTransactions: user.totalTransactions,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Registration failed' });
  }
};

// Login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(user._id, user.role);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        greenScore: user.greenScore,
        totalTransactions: user.totalTransactions,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Login failed' });
  }
};

// Get current logged-in user profile
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to get user' });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const { name } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    // Only apply changed fields (supports JSON or multipart/form-data)
    const updates = {};
    if (typeof name === 'string' && name.trim() && name.trim() !== user.name) {
      updates.name = name.trim();
    }

    if (req.file) {
      const newUrl = await uploadToFirebase(req.file, 'profiles');
      if (newUrl) {
        if (user.profileImage) {
          await deleteFromFirebase(user.profileImage);
        }
        updates.profileImage = newUrl;
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(200).json({ success: true, message: 'No changes to update', user });
    }

    Object.assign(user, updates);
    await user.save();

    res.status(200).json({ success: true, message: 'Profile updated', user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to update profile' });
  }
};

// Update password (requires current password)
const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Please provide currentPassword and newPassword' });
    }
    if (String(newPassword).length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters' });
    }

    const user = await User.findById(req.user._id).select('+password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to update password' });
  }
};

// Delete current user account
const deleteMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (user.profileImage) {
      await deleteFromFirebase(user.profileImage);
    }

    await user.deleteOne();
    res.status(200).json({ success: true, message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to delete account' });
  }
};

// Register a new admin user
const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email and password' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    const user = await User.create({ name, email, password, role: 'admin' });
    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      message: 'Admin registration successful',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        greenScore: user.greenScore,
        totalTransactions: user.totalTransactions,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Admin registration failed' });
  }
};

export { registerUser, loginUser, getMe, updateProfile, updatePassword, deleteMe, registerAdmin };
