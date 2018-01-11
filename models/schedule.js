'use strict';
module.exports = (sequelize, DataTypes) => {
  var schedule = sequelize.define('schedule', {
    date: DataTypes.DATE,
    time: DataTypes.TIME,
    course: DataTypes.STRING
  });
      schedule.associate = function(models) {
       models.schedule.belongsTo(models.user, {through: models.schedule});
     };
  return schedule;
};
