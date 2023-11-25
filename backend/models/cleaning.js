const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('cleaning', {
    time: {
      type: DataTypes.TIME,
      allowNull: false,
      primaryKey: true
    },
    numberofslots: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'cleaning',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "time" },
        ]
      },
    ]
  });
};
