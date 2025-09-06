import { pool } from "../../utils/database.js";

export const media = async(req, res) => {
    const supabase = req.app.locals.supabase;
    
    try {
        const {title, type} = req.body;
        const file = req.file;

        if(!file) return res.status(400).send({message: 'File is required'});

        const {data, error} = await supabase.storage.from("FileService").upload(file.originalname, file.buffer, {
            contentType: file.mimetype,
            upsert: false,
        });

        if(error) {
            return res.status(500).send({message: error.message});
        }

        const result = await pool.query(`insert into media_assets(title, type, file_url) values ($1,$2,$3)`, [title, type, data.path]);
        return res.status(200).send({message: 'File uploaded successfully'});
    } catch (error) {
        console.error(error);
        res.status(500).send({message: error.message});
    }
}