const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('place', {
    studentid: {
      type: DataTypes.STRING(45),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'student',
        key: 'studentid'
      }
    },
    lunchplace: {
      type: DataTypes.STRING(45),
      allowNull: true,
      defaultValue: "Hostel Mess"
    },
    teaplace: {
      type: DataTypes.STRING(45),
      allowNull: true,
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
          { name: "studentid" },
        ]
      },
    ]
  });
};
