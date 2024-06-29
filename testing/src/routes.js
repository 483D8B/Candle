const express = require('express');
const { Activity, GridCell } = require('./models');

const router = express.Router();

// Get all activities and their grid cells
router.get('/activities', async (req, res) => {
  const activities = await Activity.findAll({
    include: GridCell,
  });
  res.json(activities);
});

// Update the state of the candle and grid cell
router.post('/activity/:id', async (req, res) => {
  const { id } = req.params;
  const activity = await Activity.findByPk(id);

  if (!activity) {
    return res.status(404).json({ error: 'Activity not found' });
  }

  const now = new Date();
  const lastLit = activity.lastLit ? new Date(activity.lastLit) : null;
  const oneDay = 24 * 60 * 60 * 1000;

  if (!activity.isLit || (lastLit && (now - lastLit) >= oneDay)) {
    activity.isLit = true;
    activity.lastLit = now;

    if (lastLit && (now - lastLit) < oneDay) {
      activity.streak += 1;
    } else {
      activity.streak = 1;
    }

    // Update grid cell
    const gridCell = await GridCell.findOne({
      where: {
        activityId: activity.id,
        index: activity.streak - 1,
      },
    });

    if (gridCell) {
      gridCell.isColored = true;
      await gridCell.save();
    }

    await activity.save();
    return res.json(activity);
  }

  res.status(400).json({ error: 'Candle already lit today' });
});

module.exports = router;
