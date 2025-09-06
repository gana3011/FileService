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

export const logView = async(req, res) => {
    const {id} = req.params;
    try{
    const media = await pool.query(`select * from media_assets where id=$1`,[id]);
    if(media.rowCount==0) return res.status(404).send({message: 'No media found'});

    await pool.query(`insert into media_view_logs(media_id, viewed_by_ip) values($1,$2)`,[id, req.ip]);

    res.status(200).send({message: 'View logged'});

    } catch(error){
        console.error(error);
        res.status(500).send({message: error.message});
    }
}

export const analytics = async (req, res) => {
    const {id} = req.params;
    
    try{
        const media = await pool.query(`select * from media_assets where id=$1`,[id]);
        if(media.rowCount==0) return res.status(404).send({message: 'No media found'});

        const totalViews = await pool.query(`select count(*) from media_view_logs where media_id = $1`,[id]);

        const uniqueIp = await pool.query(`select count(distinct viewed_by_ip) from media_view_logs where media_id=$1`,[id]);

        const viewsPerDayRes = await pool.query(`select to_char(timestamp::DATE, 'YYYY-MM-DD') as day, count(*) as views from
            media_view_logs where media_id=$1 group by day order by day`,[id]);

        const viewsPerDay = {};
         viewsPerDayRes.rows.forEach((row) => {
      viewsPerDay[row.day] = parseInt(row.views, 10);
    });

         res.json({
      total_views: parseInt(totalViews.rows[0].count, 10),
      unique_ips: parseInt(uniqueIp.rows[0].count, 10),
      views_per_day: viewsPerDay,
    });

    } catch(error){
        console.error(error);
        res.status(500).send({message: error.message});
    }
}