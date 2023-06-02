const express = require("express")
const app = express()

app.use(express.json())

app.get("/api/courses")

app.get("api/courses/:course_id")

app.get("api/users")

app.get("api/users/:user_id")

app.get("api/users/:user_id/rounds")

app.get("api/users/:user_id/rounds/:round_id")

app.post("api/users")

app.post("api/users/:user_id/rounds")

app.patch("api/users/:user_id/rounds/:round_id")

app.patch("api/users/:user_id")

app.delete("/api/users/:user_id/rounds/:round_id")

module.exports = app
