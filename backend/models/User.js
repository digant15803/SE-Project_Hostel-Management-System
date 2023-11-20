const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();


const insertUserQuery = `
  INSERT INTO users (User_Id,User_Email, User_Password, User_Type) 
  VALUES (?, ?, ?, ?)
`;

async function initializeDatabase(User_Id,User_Email, User_Password, User_Type) {
  try {
    connection.query(sql, [User_Id,User_Email, User_Password, User_Type], function (err, data) {
      if (err) {
        console.error('Insert row error:', error);
      } else {
        console.log('Insert row succesfully:', rows);
      }
  });
  }
  catch{
    console.log('Insert row error:', error);
  }
}