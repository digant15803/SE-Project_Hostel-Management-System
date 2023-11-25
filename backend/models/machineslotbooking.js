const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('machineslotbooking', {
    studentId: {
      type: DataTypes.STRING(45),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'student',
        key: 'studentId'
      }
    },
    time: {
      type: DataTypes.TIME,
      allowNull: false
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      primaryKey: true
    }
  }, {
    sequelize,
    tableName: 'machineslotbooking',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "studentId" },
          { name: "date" },
        ]
      },
    ]
  });
};
