var DataTypes = require("sequelize").DataTypes;
var _cleaning = require("./cleaning");
var _machine = require("./machine");
var _machineslotbooking = require("./machineslotbooking");
var _manager = require("./manager");
var _place = require("./place");
var _roomcleaning = require("./roomcleaning");
var _roomdetails = require("./roomdetails");
var _student = require("./student");
var _user = require("./user");

function initModels(sequelize) {
  var cleaning = _cleaning(sequelize, DataTypes);
  var machine = _machine(sequelize, DataTypes);
  var machineslotbooking = _machineslotbooking(sequelize, DataTypes);
  var manager = _manager(sequelize, DataTypes);
  var place = _place(sequelize, DataTypes);
  var roomcleaning = _roomcleaning(sequelize, DataTypes);
  var roomdetails = _roomdetails(sequelize, DataTypes);
  var student = _student(sequelize, DataTypes);
  var user = _user(sequelize, DataTypes);
  var sequelize;


  machineslotbooking.belongsTo(student, { as: "student", foreignKey: "studentId"});
  student.hasMany(machineslotbooking, { as: "machineslotbookings", foreignKey: "studentId"});
  place.belongsTo(student, { as: "student", foreignKey: "studentId"});
  student.hasOne(place, { as: "place", foreignKey: "studentId"});
  roomcleaning.belongsTo(student, { as: "student", foreignKey: "studentId"});
  student.hasMany(roomcleaning, { as: "roomcleanings", foreignKey: "studentId"});
  roomdetails.belongsTo(student, { as: "studentId1_student", foreignKey: "studentId1"});
  student.hasMany(roomdetails, { as: "roomdetails", foreignKey: "studentId1"});
  roomdetails.belongsTo(student, { as: "studentId2_student", foreignKey: "studentId2"});
  student.hasMany(roomdetails, { as: "studentId2_roomdetails", foreignKey: "studentId2"});
  roomdetails.belongsTo(student, { as: "studentId3_student", foreignKey: "studentId3"});
  student.hasMany(roomdetails, { as: "studentId3_roomdetails", foreignKey: "studentId3"});
  manager.belongsTo(user, { as: "username_user", foreignKey: "username"});
  user.hasMany(manager, { as: "managers", foreignKey: "username"});
  student.belongsTo(user, { as: "username_user", foreignKey: "username"});
  user.hasMany(student, { as: "students", foreignKey: "username"});

  return {
    cleaning,
    machine,
    machineslotbooking,
    manager,
    place,
    roomcleaning,
    roomdetails,
    student,
    user,
    sequelize,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
