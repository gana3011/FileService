import { pool } from "../../utils/database.js";

function sanitizeFileName(name) {
  return name
    .replace(/[^a-zA-Z0-9.\-_]/g, "_"); 
    // keep only letters, numbers, dot, dash, underscore
}

export const media = async(req, res) => {
    const supabase = req.app.locals.supabase;
    
    try {
        const {title, type} = req.body;
        const file = req.file;

        if(!file) return res.status(400).send({message: 'File is required'});

        const safeName = sanitizeFileName(file.originalname);
        const filePath = `${Date.now()}-${safeName}`;

        const {data, error} = await supabase.storage.from("FileService").upload(filePath, file.buffer, {
            contentType: file.mimetype,
            upsert: false,
        });

        if(error) {
            return res.status(500).send({message: error.message});
        }

        const result = await pool.query(`insert into media_assets(title, type, file_url) values ($1,$2,$3) returning *`, [title, type, data.path]);
        return res.status(200).send(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send({message: error.message});
    }
}


export const streamUrl = async(req, res) => {
    const supabase = req.app.locals.supabase;

    try{
        
    const {id} = req.params;
    const media = await pool.query(`select * from media_assets where id=$1`,[id]);
    if(media.rowCount==0) return res.status(404).send({message: 'No media found'});

    const filePath = media.rows[0].file_url;

    await pool.query(`insert into media_view_logs(media_id, viewed_by_ip) values($1,$2)`,[id, req.ip]);

    const {data, error} = await supabase.storage.from("FileService").createSignedUrl(filePath, 60*10);

    if(error) return res.status(500).send({message: error.message});

    return res.status(200).send({url: data.signedUrl});
    } catch(error){
        console.error(error);
        return res.status(500).send({message: error.message});
    }
}
