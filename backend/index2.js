import express from 'express';
import 'dotenv/config';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3000

const Izin_con = {
    origin : 'http://localhost:5173',
}
app.use(cors(Izin_con));

app.use(express.json());

app.get('/', (req, res)=>{
    res.send('Hello World 2')
})

let data = [
    {   "id" : 1,
        "title" : "Judul1"
    }, 
    {   "id" : 2,
        "title" : "Judul2"
    },
    {   "id" : 3,
        "title" : "Judul3"
    }
    ]

app.get('/api/notes/', (req, res)=>{
    console.log("reques masuk");
    
    res.status(200).json({
        status : "success",
        code : 200,
        data : data,
    })
})

app.get('/api/notes/:id', (req, res)=>{
     // 1. Ambil id dari params dan ubah menjadi tipe data Number
    const parameterId = Number(req.params.id)

    const cari = data.find(i => i.id ===parameterId)
    if(!cari){
        return res.status(404).json({
            status : "Not Found",
            code : 404,
            message : "Data tidak ada"
        })
    }
    res.status(200).json({
        status : "success",
        code : 200,
        data : cari,
    })
})

app.post('/api/notes/', (req, res)=>{
//    console.log(req.body.title);
   
   if(!req.body.title){
        return res.status(400).json({
           status : "Bad Request",
           code : 400,
           message : "Data gagal input"
       })
   }
   const randID = Math.floor(Math.random() * 10); // ini sementara saja, selanjutnya ini akan di buat di db atau menggunkan UUID

    const dataPost = {
        id : Number(randID),
        title : req.body.title
    }

    const hasil = data.push(dataPost);
    console.log(hasil);

    res.status(201).json({
        status : "success",
        code : 201,
        data : data,
    })
})


app.put('/api/notes/:id', (req, res)=>{
        const getID = Number(req.params.id);

        const findID = data.find(i => i.id === getID);

        if (!findID || !req.body.title) {
            return res.status(404).json({
                status : "Not Found",
                code : 404,
                message : "Data tidak di temukan atau title kosong"
            })
        }
        
        findID.title = req.body.title
        
        res.status(200).json({
            status : "Success",
            code : 200,
            data : findID
        })
})

app.delete('/api/notes/:id', (req, res)=>{
    const getId = Number(req.params.id);
    const findID = data.find(i => i.id === getId);
    if (!findID) {
        return res.status(404).json({
            status : "Not Found",
            code : 404,
            message : " Data tidak ada"
        })
    }
    console.log(findID);
     data = data.filter(i => i.id !== getId);
    console.log(data);
    

    res.status(204).end()
})
// app.listen(port, ()=>{
//     console.log(`code sudah run pada : ${port}`)
// });

app.listen(port, (err) => {
  if (err) {
    console.error('Gagal menjalankan server:', err);
    process.exit(1);
  }
  console.log(`Server berjalan di port ${port}`);
});