import express, { json } from 'express';
// import { db, selectTrx, statementTrx_Post, selectTrx_uuid } from '../db/db.js'; // karena terlalu banyak kita jadikan satu object
import database from '../db/db.js'; // karena terlalu banyak kita jadikan satu object


const route = express.Router();

console.log(database.db);

// ============================================ GetAll
route.get('/api/transaksi/', (req,res)=>{
    try {
        const getData = database.selectTrx.all();
        // console.log(getData);
        // const data = JSON.stringify(getData);
        res.status(200).json({
            status : "success",
            code : 200,
            data : getData
        })

    } catch (error) {
        res.status(500).json({
            status : "Internal server error",
            code : 500,
            message : "Data tidak di temukan"
        })
    }
    
});

// ============================================ Get_UUID
route.get('/api/transaksi/:uuid', (req,res)=>{
    try {
        const getData = database.selectTrx_uuid.get(uuid);
        // console.log(getData);
        // const data = JSON.stringify(getData);
        res.status(200).json({
            status : "success",
            code : 200,
            data : getData
        })

    } catch (error) {
        res.status(500).json({
            status : "Internal server error",
            code : 500,
            message : "Data tidak di temukan"
        })
    }
    
});

// ============================================ Post
route.post('/api/transaksi/',(req, res)=>{
    try {
        console.log("post data");

        // validasi data
        var nama_transaksi = req.body?.nama_transaksi;
        if (typeof nama_transaksi !== "string") {
            // return res.status(400).json({
            //         success: false,
            //         message: 'Gagal menyimpan transaksi nama transaksi salah',
            //     })
            return res.status(500).json({
                    status : "Internal server error",
                    code : 500,
                    message : "Data tidak di temukan"
                })
        }
        nama_transaksi = nama_transaksi.trim(); // menghilangkan karakter space pada value
        if (nama_transaksi === "") {
            // return res.status(400).json({
            //         success: false,
            //         message: 'Gagal menyimpan transaksi data kosong salah',
            //     })
             return res.status(500).json({
                    status : "Internal server error",
                    code : 500,
                    message : "Data tidak di temukan"
                })
        }
        const type = req.body.type;
        if (type !== 'debit' && type !== 'kredit') {
            // return res.status(400).json({
            //         success: false,
            //         message: 'Gagal menyimpan transaksi type salah',
            //     })
             return res.status(500).json({
                    status : "Internal server error",
                    code : 500,
                    message : "Data tidak di temukan"
                })
            
        }
        const nominal = req.body?.nominal; 
        // console.log(Number.isInteger(nominal)); // memeriksa apakah suatu nilai merupakan bilangan bulat (integer)
         
        if(!Number.isInteger(nominal) || nominal <= 0){
            // return res.status(400).json({
            //         success: false,
            //         message: 'Gagal menyimpan transaksi nominal salah',
            //     })
             return res.status(500).json({
                    status : "Internal server error",
                    code : 500,
                    message : "Data tidak di temukan"
                })
        };

        const uuid = crypto.randomUUID();
        const Datapost = {
            uuid : uuid,
            user_uuid : req.body?.user_uuid,
            nama_transaksi : nama_transaksi,
            type : type,
            nominal : nominal,
            keterangan : req.body?.keterangan  ?? '',
            updated_at : new Date().toISOString().replace('T', ' ').slice(0, 19)
        }
        console.log('data yg di post',Datapost);
        // const data = Object.values(Datapost)
        // console.log("Hasil pengambilan value object : ",data);
        
        // const PostData = statementTrx_Post.run(Datapost);
        const PostData = database.statementTrx_Post.run(Datapost);

        console.log('hasil data Post :',PostData);

        res.status(201).json({
            status : "success",
            code : 201,
            data : Datapost,
            changes : PostData.changes
        });
        
    } catch (error) {
        // idPesan.textContent =
        console.error('ERROR INSERT:', error);

        return res.status(400).json({
            success: false,
            message: 'Gagal menyimpan transaksi',
            error: error.message
        });
    }
})



export default route;