const User = require('../models/User');

exports.updateProgress = async (req, res) => {
  try {
    const { topicId } = req.body;
    const user = await User.findById(req.user._id);
    
    if (!user.progress.completedLessons.includes(topicId)) {
      user.progress.completedLessons.push(topicId);
    }
    
    user.progress.lastActive = Date.now();
    // Simple streak logic: if lastActive was yesterday, increment. 
    // For now, just a placeholder as real logic requires date comparison.
    user.progress.streak += 1; 
    
    await user.save();
    res.json(user.progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProgress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user.progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
