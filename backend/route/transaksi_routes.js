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
        if (!getData) {
            
        }
        res.status(200).json({
            status : "success",
            code : 200,
            data : getData
        })

    } catch (error) {
        res.status(500).json({
            status : "Internal server error",
            code : 500,
            message : "Data tidak di temukan A"
        })
    }
    
});

// ============================================ Get_UUID
route.get('/api/transaksi/:uuid', (req,res)=>{
    try {
        // 1. ambil uuid dari url pakai params
        const Get_uuid = req.params.uuid;
        // console.log(Get_uuid);
        const getData = database.selectTrx_uuid.get(Get_uuid);
        // console.log('get transaksi berdasarkan uuid',getData);
        // const data = JSON.stringify(getData);
        if (!getData) {
                return res.status(404).json({
                status : "Not Found",
                code : 404,
                message : "Data tidak ada"
            })
        }
        res.status(200).json({
            status : "success",
            code : 200,
            data : getData
        })

    } catch (error) {
        res.status(500).json({
            status : "Internal server error",
            code : 500,
            message : message.error
        })
    }
    
});

// ===========S_Validasi data Post dan Put
    const validasiDataTrx = (body) =>{
        var nama_transaksi = body?.nama_transaksi;

        if (typeof nama_transaksi !== "string" || nama_transaksi.trim() === "") {
            return { error : " nama_transaksi wajib berupa teks tidak kosong"}
        }

        const type = body?.type.trim();
        if (type !== 'debit' && type !== 'kredit') {
            return { error : " type harus 'debit' atau 'kredit' "}
        }

        const nominal = body?.nominal; 
        // console.log(Number.isInteger(nominal)); // memeriksa apakah suatu nilai merupakan bilangan bulat (integer)
        if(!Number.isInteger(nominal) || nominal <= 10){
            return {error : "nominal harus bilangan bulat lebih dari 10"}
        }

        const keterangan = 
            typeof body?.keterangan === "string" ? body.keterangan.trim() : "";

        return {
            data : {nama_transaksi: nama_transaksi.trim(), type, nominal, keterangan}
        }
    }
// ===========E_Validasi data Post dan Put

// ============================================ Post
route.post('/api/transaksi/',(req, res)=>{
    try {
        const {error, data} = validasiDataTrx(req.body);
        if (error) {
            return res.status(400).json({ status : "Bad Request", code : 400, message:error})
        }
        
        const Datapost = {
            uuid : crypto.randomUUID(),
            user_uuid : req.body?.user_uuid ?? null,
            ...data
        }
        database.statementTrx_Post.run(Datapost);
        // console.log('hasil data Post :',PostData.changes==1);
        res.status(201).json({
            status : "success",
            code : 201,
            data : Datapost,
        });
        
    } catch (err) {
        console.error('ERROR POST:', err);
        res.status(500).json({
            status : "Internal server error",
            code : 500,
            message : "Terjadi kesalahan pada server"
        })
    }
})


//=====================Put=====================
route.put('/api/transaksi/:uuid', (req,res)=>{
    try {
        const { error, data } = validasiDataTrx(req.body);
        if (error) {
            return res.status(400).json({ status: "Bad Request", code: 400, message:error})
        }

        const dataPut ={ uuid : req.params.uuid, ...data}
        const hasil = database.updateTrx_uuid.run(dataPut);
        console.log("hasil update", hasil);
        
        if (hasil.changes === 0) {
            const ada = database.selectTrx_uuid.get(req.params.uuid);
            if (!ada) {
                return res.status(404).json({ status: "Not Found", code: 404, message: "Data tidak ada" });
            }
            return res.status(409).json({
                status: "success", code: 409,
                message: "Tidak ada perubahan data", data: ada
            });
        }

        res.status(200).json({
            status : "succes",
            code : 200,
            data: dataPut
        })
    } catch (err) {
        console.error('ERROR INSERT:', err);
        return res.status(500).json({
            status : "Internal server error",
            code : 500,
            message : "Terjadi kesalahan pada server"
        });
    }
})

// ==================Delete====================
route.delete('/api/transaksi/:uuid', (req, res)=>{
    try {
        const get_uuid = req.params.uuid;
        const deleteTrx = database.deleteTrx.run(get_uuid);
        if (deleteTrx.changes === 0) {
            return res.status(404).json({
                status : "Not Found",
                code : 404,
                message : " Data yang di hapus tidak ada"
            })   
        }
        console.log("data di hapus", deleteTrx.changes);
        
        res.status(204).end()
    } catch (error) {
        return res.status(500).json({
                status : "Bad request",
                code : 500,
                message : message.error
            })
    }
    
})

export default route;