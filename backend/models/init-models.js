var DataTypes = require("sequelize").DataTypes;
var _bookhousekeeping = require("./bookhousekeeping");
var _bookmachine = require("./bookmachine");
var _cleaning = require("./cleaning");
var _machine = require("./machine");
var _manager = require("./manager");
var _place = require("./place");
var _room = require("./room");
var _student = require("./student");
var _user = require("./user");

function initModels(sequelize) {
  var bookhousekeeping = _bookhousekeeping(sequelize, DataTypes);
  var bookmachine = _bookmachine(sequelize, DataTypes);
  var cleaning = _cleaning(sequelize, DataTypes);
  var machine = _machine(sequelize, DataTypes);
  var manager = _manager(sequelize, DataTypes);
  var place = _place(sequelize, DataTypes);
  var room = _room(sequelize, DataTypes);
  var student = _student(sequelize, DataTypes);
  var user = _user(sequelize, DataTypes);
  var sequelize = sequelize;

  bookhousekeeping.belongsTo(student, { as: "name_student", foreignKey: "name"});
  student.hasMany(bookhousekeeping, { as: "bookhousekeepings", foreignKey: "name"});
  bookmachine.belongsTo(student, { as: "student", foreignKey: "studentid"});
  student.hasMany(bookmachine, { as: "bookmachines", foreignKey: "studentid"});
  place.belongsTo(student, { as: "student", foreignKey: "studentid"});
  student.hasOne(place, { as: "place", foreignKey: "studentid"});
  room.belongsTo(student, { as: "studentid1_student", foreignKey: "studentid1"});
  student.hasMany(room, { as: "rooms", foreignKey: "studentid1"});
  room.belongsTo(student, { as: "studentid2_student", foreignKey: "studentid2"});
  student.hasMany(room, { as: "studentid2_rooms", foreignKey: "studentid2"});
  room.belongsTo(student, { as: "studentid3_student", foreignKey: "studentid3"});
  student.hasMany(room, { as: "studentid3_rooms", foreignKey: "studentid3"});
  manager.belongsTo(user, { as: "username_user", foreignKey: "username"});
  user.hasMany(manager, { as: "managers", foreignKey: "username"});

  return {
    bookhousekeeping,
    bookmachine,
    cleaning,
    machine,
    manager,
    place,
    room,
    student,
    user,
    sequelize,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
