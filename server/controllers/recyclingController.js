import RecyclingCenter from '../models/RecyclingCenter.js';
import RecyclingSubmission from '../models/RecyclingSubmission.js';
import User from '../models/User.js';

// RECYCLING CENTERS

// Get all recycling centers
const getAllCenters = async (req, res) => {
  try {
    const { city, material } = req.query;

    const filter = { isActive: true };
    if (city) filter.city = { $regex: city, $options: 'i' };
    if (material) filter.acceptMaterials = { $in: [material] };

    const centers = await RecyclingCenter.find(filter).sort({ name: 1 });
    res.status(200).json({ success: true, count: centers.length, centers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to get centers' });
  }
};

// Get nearby recycling centers (geospatial)
const getNearbyCenters = async (req, res) => {
  try {
    const { lng, lat, maxDist = 10000 } = req.query;

    if (!lng || !lat) {
      return res.status(400).json({ success: false, message: 'Longitude and latitude are required' });
    }

    const centers = await RecyclingCenter.find({
      isActive: true,
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          $maxDistance: Number(maxDist),
        },
      },
    });

    res.status(200).json({ success: true, count: centers.length, centers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to get nearby centers' });
  }
};

// Get single center
const getCenterById = async (req, res) => {
  try {
    const center = await RecyclingCenter.findById(req.params.id);
    if (!center) {
      return res.status(404).json({ success: false, message: 'Recycling center not found' });
    }
    res.status(200).json({ success: true, center });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to get center' });
  }
};

// Admin: Create recycling center
const createCenter = async (req, res) => {
  try {
    const { name, city, address, longitude, latitude, acceptMaterials, contactNumber, operatingHours } = req.body;

    if (!name || !city || !address || !longitude || !latitude) {
      return res.status(400).json({ success: false, message: 'name, city, address, longitude, latitude are required' });
    }

    const center = await RecyclingCenter.create({
      name,
      city,
      address,
      location: {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)],
      },
      acceptMaterials: acceptMaterials || [],
      contactNumber,
      operatingHours,
    });

    res.status(201).json({ success: true, message: 'Recycling center created', center });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to create center' });
  }
};

// Admin: Update recycling center
const updateCenter = async (req, res) => {
  try {
    const { longitude, latitude, ...rest } = req.body;

    const updateData = { ...rest, updatedAt: new Date() };
    if (longitude && latitude) {
      updateData.location = {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)],
      };
    }

    const center = await RecyclingCenter.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!center) {
      return res.status(404).json({ success: false, message: 'Center not found' });
    }

    res.status(200).json({ success: true, message: 'Center updated', center });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to update center' });
  }
};

// Admin: Delete recycling center
const deleteCenter = async (req, res) => {
  try {
    const center = await RecyclingCenter.findByIdAndDelete(req.params.id);
    if (!center) {
      return res.status(404).json({ success: false, message: 'Center not found' });
    }
    res.status(200).json({ success: true, message: 'Center deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to delete center' });
  }
};

// RECYCLING SUBMISSIONS

// Submit recycling request
const createSubmission = async (req, res) => {
  try {
    const { centerId, materialType, estimatedWeight } = req.body;

    if (!centerId || !materialType || !estimatedWeight) {
      return res.status(400).json({ success: false, message: 'centerId, materialType, estimatedWeight required' });
    }

    const center = await RecyclingCenter.findById(centerId);
    if (!center || !center.isActive) {
      return res.status(404).json({ success: false, message: 'Recycling center not found or inactive' });
    }

    const submission = await RecyclingSubmission.create({
      userId: req.user._id,
      centerId,
      materialType,
      estimatedWeight,
    });

    res.status(201).json({ success: true, message: 'Submission created', submission });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to create submission' });
  }
};

// Get current user submissions
const getMySubmissions = async (req, res) => {
  try {
    const submissions = await RecyclingSubmission.find({ userId: req.user._id })
      .populate('centerId', 'name city address')
      .sort({ submittedAt: -1 });

    res.status(200).json({ success: true, count: submissions.length, submissions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to get submissions' });
  }
};

// Admin: Get all submissions
const getAllSubmissions = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const submissions = await RecyclingSubmission.find(filter)
      .populate('userId', 'name email')
      .populate('centerId', 'name city')
      .sort({ submittedAt: -1 });

    res.status(200).json({ success: true, count: submissions.length, submissions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to get submissions' });
  }
};

// Admin: Review a submission
const reviewSubmission = async (req, res) => {
  try {
    const { status, reviewNotes } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Status must be approved or rejected' });
    }

    const submission = await RecyclingSubmission.findById(req.params.id);
    if (!submission) {
      return res.status(404).json({ success: false, message: 'Submission not found' });
    }

    submission.status = status;
    submission.reviewedBy = req.user._id;
    submission.reviewedAt = new Date();
    submission.reviewNotes = reviewNotes || '';
    await submission.save();

    if (status === 'approved') {
      const scoreGain = Math.round(submission.estimatedWeight * 3);
      await User.findByIdAndUpdate(submission.userId, { $inc: { greenScore: scoreGain } });
    }

    res.status(200).json({ success: true, message: `Submission ${status}`, submission });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to review submission' });
  }
};

export {
  getAllCenters,
  getNearbyCenters,
  getCenterById,
  createCenter,
  updateCenter,
  deleteCenter,
  createSubmission,
  getMySubmissions,
  getAllSubmissions,
  reviewSubmission,
};
