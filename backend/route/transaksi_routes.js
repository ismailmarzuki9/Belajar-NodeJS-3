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
            user_uuid :'550e8400-e29b-41d4-a716-446655440004',
            nama_transaksi : req.body?.nama_transaksi ?? '',
            type : req.body?.type ?? '',
            nominal : req.body?.nominal ?? '',
            keterangan : req.body?.keterangan  ?? '',
        }
        console.log(Datapost);
        // const data = Object.values(Datapost)
        // console.log("Hasil pengambilan value object : ",data);
        
        // const PostData = statementTrx_Post.run(Datapost);
        const PostData = statementTrx_Post.run(
                                                {
                                                uuid: '8f41d6e2-6f01-42f9-82ea-4a79129ba8ac',
                                                user_uuid: '550e8400-e29b-41d4-a716-446655440004',
                                                nama_transaksi: 'Belanja Makanan',
                                                type: 'debit',
                                                nominal: 150000,
                                                keterangan: 'Belanja kebutuhan rumah'
                                                }
                                             );

        console.log(PostData);
        
    } catch (error) {
        
    }
})



export default route;