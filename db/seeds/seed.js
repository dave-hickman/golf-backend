const format = require("pg-format");
const db = require("../connection");

const seed = ({ usersData, roundsData, coursesData }) => {
  return db
    .query("DROP TABLE IF EXISTS courses")
    .then(() => {
      return db.query("DROP TABLE IF EXISTS users");
    })
    .then(() => {
      return db.query("DROP TABLE IF EXISTS rounds");
    })
    .then(() => {
      const coursesTablePromise = db.query(`
      CREATE TABLE courses (
        course_id SERIAL PRIMARY KEY
        name VARCHAR NOT NULL,
        par INT NOT NULL,
      )`);

      const usersTablePromise = db.query(`
      CREATE TABLE users (
        user_id SERIAL PRIMARY KEY
        username VARCHAR NOT NULL
        handicap INT NOT NULL
      )`)
    });
};
