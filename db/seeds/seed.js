const format = require("pg-format");
const db = require("../connection");

const seed = ({ usersData, roundsData, coursesData, holesData, playerScoresData }) => {
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
        course_id INT NOT NULL PRIMARY KEY
        name VARCHAR(255) NOT NULL,
        par INT NOT NULL
      );`);

      const usersTablePromise = db.query(`
      CREATE TABLE users (
        user_id SERIAL PRIMARY KEY,
        username VARCHAR NOT NULL,
        handicap INT NOT NULL
      );`);
      return Promise.all([coursesTablePromise, usersTablePromise]);
    })
    .then(() => {
      const holesTablePromise = db.query(`
        CREATE TABLE holes (
            hole_id SERIAL PRIMARY KEY,
            course_id INT NOT NULL REFERENCES courses(course_id)
            course_name VARCHAR(255) NOT NULL REFERENCES courses(name),
            par INT NOT NULL,
            stroke_index INT NOT NULL,
            hole_number INT NOT NULL
        );`);
      const roundsTablePromise = db.query(`
        CREATE TABLE rounds (
            round_id SERIAL PRIMARY KEY,
            course_name VARCHAR(255) REFERENCES courses(name),
            date_played TIMESTAMP DEFAULT NOW()
        );`);
      return Promise.all([holesTablePromise, roundsTablePromise]);
    })
    .then(() => {
      return db.query(`
        CREATE TABLE playerscore (
            player_score_id SERIAL PRIMARY KEY
            round_id INT NOT NULL REFERENCES rounds(round_id)
            course_id INT NOT NULL REFERENCES course(course_id)
            course_name VARCHAR(255 REFERENCES course(name))
            user_id INT NO NULL REFERENCES users(user_id)
            username VARCHAR NOT NULL REFERENCES users(username)
            hole_number INT NOT NULL REFERENCES holes(hole_id)
            score INT NOT NULL
            fairway BOOL
            green BOOL
        )`);
    })
    .then(() => {
      const insertCoursesQueryStr = format(
        "INSERT INTO courses (name, par) VALUES %L;",
        coursesData.map(({ name, par }) => [name, par])
      );
      const coursesPromise = db.query(insertCoursesQueryStr);

      const insertUsersQueryStr = format(
        `INSERT INTO users (username, handicap) VALUES %L;`,
        usersData.map(({ username, handicap }) => [username, handicap])
      );
      const usersPromise = db.query(insertUsersQueryStr)

      return Promise.all([coursesPromise, usersPromise])
    })
    .then(() => {
        const insertHolesQueryStr = format(
            "INSERT into holes (course_name, course_id, par, stroke_index, hole_number) VALUES %L;",
            holesData.map(({course_name, course_id, par, stroke_index, hole_number}) => [course_name, course_id, par, stroke_index, hole_number] )
        )

        const insertRoundsQueryStr = format(
            "INSERT into rounds (course_name, course_id) VALUES %L;",
            roundsData.map(({course_name, course_id}) => [course_name, course_id])
        )
    })
};
