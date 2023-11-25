const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('roomcleaning', {
    roomNo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    studentId: {
      type: DataTypes.STRING(100),
      allowNull: false,
      references: {
        model: 'student',
        key: 'studentId'
      }
    },
    time: {
      type: DataTypes.TIME,
      allowNull: false
    },
    bedSheetChange: {
      type: DataTypes.TINYINT,
      allowNull: true,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'roomcleaning',
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
        name: "name",
        using: "BTREE",
        fields: [
          { name: "studentId" },
        ]
      },
    ]
  });
};
