const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('roomdetails', {
    roomNo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    studentId1: {
      type: DataTypes.STRING(45),
      allowNull: true,
      references: {
        model: 'student',
        key: 'studentId'
      }
    },
    studentId2: {
      type: DataTypes.STRING(45),
      allowNull: true,
      references: {
        model: 'student',
        key: 'studentId'
      }
    },
    studentId3: {
      type: DataTypes.STRING(45),
      allowNull: true,
      references: {
        model: 'student',
        key: 'studentId'
      }
    }
  }, {
    sequelize,
    tableName: 'roomdetails',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "roomNo" },
        ]
      },
      {
        name: "studentid1",
        using: "BTREE",
        fields: [
          { name: "studentId1" },
        ]
      },
      {
        name: "studentid2",
        using: "BTREE",
        fields: [
          { name: "studentId2" },
        ]
      },
      {
        name: "studentid3",
        using: "BTREE",
        fields: [
          { name: "studentId3" },
        ]
      },
    ]
  });
};
