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
    const validasiDataTrx = (data, res) =>{
        console.log("dataval", data);
        var nama_transaksi = data.nama_transaksi;

        if (typeof nama_transaksi !== "string") {
            // return res.status(400).json({
            //         success: false,
            //         message: 'Gagal menyimpan transaksi nama transaksi salah',
            //     })
            return res.status(400).json({
                    status : "Bad Request",
                    code : 400,
                    message : "Gagal menyimpan transaksi nama transaksi salah"
                })
        }else{
            nama_transaksi
        }

        nama_transaksi = nama_transaksi.trim(); // menghilangkan karakter space pada value
        if (nama_transaksi === "") {
            // return res.status(400).json({
            //         success: false,
            //         message: 'Gagal menyimpan transaksi data kosong salah',
            //     })
             return res.status(400).json({
                    status : "Bad Request",
                    code : 400,
                    message : "Gagal menyimpan transaksi data kosong salah"
                })
        }

        const type = data.type.trim();
        if (type !== 'debit' && type !== 'kredit') {
            // return res.status(400).json({
            //         success: false,
            //         message: 'Gagal menyimpan transaksi type salah',
            //     })
             return res.status(400).json({
                    status : "Bad Request",
                    code : 400,
                    message : "Gagal menyimpan transaksi type salah"
                })
            
        }else{
            type;
        }
        const nominal = data.nominal; 
        // console.log(Number.isInteger(nominal)); // memeriksa apakah suatu nilai merupakan bilangan bulat (integer)
         if (nominal == undefined) {
            nominal
         }
        if(!Number.isInteger(nominal) || nominal <= 0){
            // return res.status(400).json({
            //         success: false,
            //         message: 'Gagal menyimpan transaksi nominal salah',
            //     })
             return res.status(400).json({
                    status : "Bad Request",
                    code : 400,
                    message : "Gagal menyimpan transaksi nominal salah"
                })
        }else{
            nominal
        }

        return {
            nama_transaksi: nama_transaksi,
            type : type,
            nominal : nominal
        }

    }
// ===========E_Validasi data Post dan Put

// ============================================ Post
route.post('/api/transaksi/',(req, res)=>{
    try {
        const Hasil_Val = validasiDataTrx(req.body, res);
        console.log("hasil Validation :", Hasil_Val);
        
        const uuid = crypto.randomUUID();
        const Datapost = {
            uuid : uuid,
            user_uuid : req.body?.user_uuid,
            nama_transaksi : Hasil_Val.nama_transaksi,
            type : Hasil_Val.type,
            nominal : Hasil_Val.nominal,
            keterangan : req.body?.keterangan  ?? '',
            // updated_at : new Date().toISOString().replace('T', ' ').slice(0, 19)
        }
        // console.log('data yg di post',Datapost);
        // const data = Object.values(Datapost)
        // console.log("Hasil pengambilan value object : ",data);
        
        // const PostData = statementTrx_Post.run(Datapost);
        const PostData = database.statementTrx_Post.run(Datapost);
        // console.log('hasil data Post :',PostData.changes==1);
        if (!PostData.changes==1) {
            return res.status(500).json({
                        status : "Internal server error",
                        code : 500,
                        message : message.error
                    })
        }
        res.status(201).json({
            status : "success",
            code : 201,
            data : Datapost,
            changes : PostData.changes
        });
        
    } catch (error) {
        res.status(500).json({
            status : "Internal server error",
            code : 500,
            message : "Data tidak di temukan A"
        })
    }
})


//=====================Put=====================
route.put('/api/transaksi/:uuid', (req,res)=>{
    try {
        const uuid = req.params.uuid;
        // console.log('uuid dari url ', uuid);
        const GetData = database.selectTrx_uuid.get(uuid);
        // console.log("data brd uuuid :", GetData.uuid);
        
        const Hasil_Val = validasiDataTrx(req.body);
        console.log("Hasil Validasi :", Hasil_Val);
        
        // if (GetData.nama_transaksi === Hasil_Val.nama_transaksi.trim() &&
        //     GetData.type === Hasil_Val.type.trim() &&
        //     GetData.nominal === Number(Hasil_Val.nominal)&&
        //     GetData.keterangan === Hasil_Val.keterangan.trim()
        //     ) // cek apakah ada inputan yang berubah dari tabel
        // {
        //     return res.code(400).json({
        //         success : false,
        //         message : "Data tidak diupdate karena data tidak berubah"               
        //     })
        // } kenapa code ini gagal

        // 2. Gunakan .trim() untuk mengantisipasi spasi kosong tersembunyi
        const namaLama = GetData.nama_transaksi ? GetData.nama_transaksi.trim() : "";
        const namaBaru = Hasil_Val.nama_transaksi ? Hasil_Val.nama_transaksi.trim() : "";
        const ketLama = GetData.keterangan ? GetData.keterangan.trim() : "";
        const ketBaru = Hasil_Val.keterangan ? Hasil_Val.keterangan.trim() : "";
         // 3. Cek apakah data benar-benar berubah
        if (namaLama === namaBaru &&
            GetData.type === Hasil_Val.type &&
            GetData.nominal === Number(Hasil_Val.nominal) && // Pastikan perbandingan angka/number sama
            ketLama === ketBaru
        ) {
            // PERBAIKAN: Hapus message.error yang bikin crash. Gunakan res.status() yang konsisten
            return res.status(400).json({
                success: false,
                message: "Data tidak diupdate karena data tidak berubah"
            });
        }
        

        const DataPut = {
            uuid : GetData.uuid,
            user_uuid : GetData.user_uuid,
            nama_transaksi :Hasil_Val.nama_transaksi,
            type : Hasil_Val.type,
            nominal : Hasil_Val.nominal,
            keterangan : Hasil_Val.keterangan

        }

        const response = database.updateTrx_uuid.run(DataPut);

        console.log(" hasil Update : ", response);
        if (!response.changes==1) {
            return res.status(500).json({
                        status : "Internal server error",
                        code : 500,
                        message : message.error
                    })
        }
        res.status(200).json({
                status : "success",
                code : 200,
                data : DataPut,
                changes : response.changes
            });

    } catch (error) {
        console.error('ERROR INSERT:', error);

        return res.status(400).json({
            success: false,
            message: 'Gagal menyimpan perubahan transaksi',
            error: error.message
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
        return res.status(400).json({
                status : "Bad request",
                code : 404,
                message : message.error
            })
    }
    
})

export default route;