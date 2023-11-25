const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('room', {
    roomnumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    studentid1: {
      type: DataTypes.STRING(45),
      allowNull: false,
      references: {
        model: 'student',
        key: 'studentid'
      }
    },
    studentid2: {
      type: DataTypes.STRING(45),
      allowNull: false,
      references: {
        model: 'student',
        key: 'studentid'
      }
    },
    studentid3: {
      type: DataTypes.STRING(45),
      allowNull: false,
      references: {
        model: 'student',
        key: 'studentid'
      }
    }
  }, {
    sequelize,
    tableName: 'room',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "roomnumber" },
        ]
      },
      {
        name: "studentid1",
        using: "BTREE",
        fields: [
          { name: "studentid1" },
        ]
      },
      {
        name: "studentid2",
        using: "BTREE",
        fields: [
          { name: "studentid2" },
        ]
      },
      {
        name: "studentid3",
        using: "BTREE",
        fields: [
          { name: "studentid3" },
        ]
      },
    ]
  });
};
