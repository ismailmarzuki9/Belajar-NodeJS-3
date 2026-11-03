import express, { json } from 'express';
import { db, selectTrx, statementTrx_Post } from '../db/db.js';

const route = express.Router();

console.log(db);

route.get('/api/transaksi/', (req,res)=>{
    try {
        const getData = selectTrx.all();
        // console.log(getData);
        // const data = JSON.stringify(getData);
        res.status(200).json({
            status : "success",
            code : 200,
            data : getData
        })

    } catch (error) {
        
    }
    
});

route.post('/api/transaksi/',(req, res)=>{
    try {
        console.log("post data");
        
        const uuid = crypto.randomUUID();
        const Datapost = {
            uuid : uuid,
            user_uuid :      req.body?.user_uuid,
            nama_transaksi : req.body?.nama_transaksi ?? '',
            type : req.body?.type ?? '',
            nominal : req.body?.nominal ?? '',
            keterangan : req.body?.keterangan  ?? '',
        }
        console.log('data yg di post',Datapost);
        // const data = Object.values(Datapost)
        // console.log("Hasil pengambilan value object : ",data);
        
        // const PostData = statementTrx_Post.run(Datapost);
        const PostData = statementTrx_Post.run(Datapost);

        console.log('hasil data Post :',PostData);

        res.status(200).json({
            status : "success",
            code : 200,
            data : Datapost,
            changes : PostData.changes
        });
        
    } catch (error) {
        // idPesan.textContent =
        console.error('ERROR INSERT:', error);

        return res.status(500).json({
            success: false,
            message: 'Gagal menyimpan transaksi',
            error: error.message
        });
    }
})



export default route;