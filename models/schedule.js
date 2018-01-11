'use strict';
module.exports = (sequelize, DataTypes) => {
  var schedule = sequelize.define('schedule', {
    date: DataTypes.DATE,
    time: DataTypes.TIME,
    course: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
       models.schedule.belongsTo(models.user);
      }
    }
  });
  return schedule;
};
