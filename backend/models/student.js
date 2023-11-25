const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('student', {
    studentId: {
      type: DataTypes.STRING(45),
      allowNull: false,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING(45),
      allowNull: false,
      references: {
        model: 'user',
        key: 'username'
      }
    },
    roomNo: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'student',
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
      {
        name: "userName_idx",
        using: "BTREE",
        fields: [
          { name: "username" },
        ]
      },
    ]
  });
};
