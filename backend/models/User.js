const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user', {
    username: {
      type: DataTypes.STRING(45),
      allowNull: false,
      primaryKey: true
    },
    password: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    position: {
      type: DataTypes.STRING(45),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'user',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "username" },
        ]
      },
    ]
  });
};
