
import pool from "../config/db.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { hashPassword, comparePassword, generateToken } from "../utils/auth.js";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { log } from "console";
const uploadDir = "./uploads"; 
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
const resolvers = {
    Query: {
        getUsers: async () => {
            const { rows } = await pool.query("SELECT id,name,email FROM users");
            console.log(rows);
            return rows;
        },
        getUserPersonas: async (parent, args, context) => {
            const user = authMiddleware(context.token);
            const { rows } = await pool.query("SELECT * FROM personas WHERE user_id = $1 ORDER BY id", [user.userId]);
            return rows;
          },
          getPersona: async (parent, { id }, context) => {
            const user = authMiddleware(context.token);
            const { rows } = await pool.query("SELECT * FROM personas WHERE id = $1 AND user_id = $2", [id, user.userId]);
            // const { rows } = await pool.query("SELECT * FROM personas WHERE id = $1 ", [id]);
            if (rows.length === 0) throw new Error("Persona not found or unauthorized");
            return rows[0];
          },
    },
    Mutation:
    {
        signup: async (_, { name, email, password }) => {
            const { rows } = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
            if (rows.length != 0) {
                throw new Error("Email already exists");
            }
            const hashedPassword = await hashPassword(password);
            const newUser = await pool.query(
                "INSERT INTO users(name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email",
                [name, email, hashedPassword]
            );
            const token = generateToken(newUser.rows[0].id);

            return {
                token,
                user: newUser.rows[0],
            };

        },
        signin: async (_, { email, password }) => {
            const { rows } = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
            if (rows.length == 0) {
                throw new Error("Invalid user or password");
            }
            console.log(rows);
            const isValidPassword = await comparePassword(password, rows[0].password);
            if (!isValidPassword) {
                throw new Error("Invalid user or password");
            }
            const token = generateToken(rows[0].id)
            return {token, user: {
                id: rows[0].id,
                name: rows[0].name,
                email: rows[0].email
            }};
        },
        addPersona: async (parent, { input, persona_image }, context) => {
          const { name, quote, description, motivation, pain_points, jobs_needs, activites } = input;
            const user = authMiddleware(context.token);
          
            const { rows } = await pool.query(
              `INSERT INTO personas (name, quote, description, motivation, pain_points, jobs_needs, activites, persona_image, user_id) 
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
              [name, quote, description, motivation, pain_points, jobs_needs, activites, persona_image, user.userId]
            );
            return rows[0];
          },
          updatePersona: async (parent,  { id, input }, context) => {
            const user = authMiddleware(context.token);
            const { name, quote, description, motivation, pain_points, jobs_needs, activites, persona_image } = input;
            const { rows } = await pool.query("SELECT * FROM personas WHERE id = $1 AND user_id = $2", [id, user.userId]);
            if (rows.length === 0) throw new Error("Persona not found or unauthorized");
      
            const updatedPersona = await pool.query(
              `UPDATE personas SET 
                 name = COALESCE($1, name),
                 quote = COALESCE($2, quote),
                 description = COALESCE($3, description),
                 motivation = COALESCE($4, motivation),
                 pain_points = COALESCE($5, pain_points),
                 jobs_needs = COALESCE($6, jobs_needs),
                 activites = COALESCE($7, activites),
                 persona_image = COALESCE($8, persona_image)
               WHERE id = $9 AND user_id=$10 RETURNING *`,
              [name, quote, description, motivation, pain_points, jobs_needs, activites, persona_image, id,user.userId]
            );
            return updatedPersona.rows[0];
          },
          deletePersona: async (parent, { id }, context) => {
            const user = authMiddleware(context.token);
            const { rows } = await pool.query("SELECT * FROM personas WHERE id = $1 AND user_id=$2", [id,user.userId]);
            if (rows.length === 0) throw new Error("Persona not found or unauthorized");
      
            await pool.query("DELETE FROM personas WHERE id = $1", [id]);
            return "Persona deleted successfully";
          }      
      

    }
}
export { resolvers }