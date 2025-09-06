import { Password } from "../../utils/password.js";
import jwt from "jsonwebtoken";
import { pool } from "../../utils/database.js";

export const signup = async (req,res) => {
    const {email, password} = req.body;
    try{
        const existingUser = await pool.query(`select * from admin_users where email=$1`,[email]);
        if (existingUser.rows.length > 0) {
        return res.status(400).send({ message: "Email already in use" });
    }
    
    const hashedPassword = await Password.toHash(password);
    await pool.query(`insert into admin_users(email,password) values($1,$2)`,[email,hashedPassword]);
    return res.status(200).send({message : "Sign up successfull"});

    } catch(err){
        console.error(err);
        res.status(500).send({message: err.message});
    }
}

export const signin = async (req, res) => {
    const {email, password} = req.body;
    try{
        const result = await pool.query(`select * from admin_users where email=$1`,[email]);
        if(result.rows.length == 0){
            return res.status(400).send({ message: "Invalid credentials"});
        }

        const existingUser = result.rows[0];

        const passwordMatch = await Password.comparePasswords(existingUser.password, password);
        if(!password) return es.status(400).send({ message: "Invalid credentials"});
    
        const userJwt = jwt.sign({
            id: existingUser.id
        },
        process.env.JWT_KEY,
        {expiresIn : "7d"}
    );
    res.status(200).send("JWT:"+userJwt);
    } catch(err){
        console.error(err);
        res.status(500).send({message : err.message});
    }
}