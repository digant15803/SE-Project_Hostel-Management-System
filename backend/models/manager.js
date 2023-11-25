const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('manager', {
    managerId: {
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
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'manager',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "managerId" },
        ]
      },
      {
        name: "username",
        using: "BTREE",
        fields: [
          { name: "username" },
        ]
      },
    ]
  });
};
