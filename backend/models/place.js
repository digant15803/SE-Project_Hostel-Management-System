const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('place', {
    studentId: {
      type: DataTypes.STRING(45),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'student',
        key: 'studentId'
      }
    },
    lunchPlace: {
      type: DataTypes.STRING(45),
      allowNull: false,
      defaultValue: "Hostel Mess"
    },
    teaPlace: {
      type: DataTypes.STRING(45),
      allowNull: false,
      defaultValue: "Hostel Mess"
    }
  }, {
    sequelize,
    tableName: 'place',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "studentId" },
        ]
      },
    ]
  });
};
