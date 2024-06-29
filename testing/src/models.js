require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: 'postgres',
});

const Activity = sequelize.define('Activity', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isLit: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  streak: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  lastLit: {
    type: DataTypes.DATE,
  },
});

const GridCell = sequelize.define('GridCell', {
  index: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  isColored: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  activityId: {
    type: DataTypes.INTEGER,
    references: {
      model: Activity,
      key: 'id',
    },
  },
});

sequelize.sync();

module.exports = {
  Activity,
  GridCell,
  sequelize,
};
