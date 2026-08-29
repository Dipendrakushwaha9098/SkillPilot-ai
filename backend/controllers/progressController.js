const userStore = require('../utils/userStore');

exports.updateProgress = async (req, res) => {
  try {
    const { topicId } = req.body;
    const user = await userStore.findById(req.user._id);
    
    if (!user.progress.completedLessons.includes(topicId)) {
      user.progress.completedLessons.push(topicId);
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const lastActive = new Date(user.progress.lastActive);
    lastActive.setHours(0, 0, 0, 0);
    
    const diffTime = today - lastActive;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      // Last active yesterday, increment streak
      user.progress.streak += 1;
    } else if (diffDays > 1) {
      // Gap in activity, reset streak
      user.progress.streak = 1;
    } else if (user.progress.streak === 0) {
      // First ever activity
      user.progress.streak = 1;
    }
    // If diffDays is 0, they already active today, streak stays the same.
    
    user.progress.lastActive = Date.now();
    await user.save();
    res.json(user.progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProgress = async (req, res) => {
  try {
    const user = await userStore.findById(req.user._id);
    res.json(user.progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
