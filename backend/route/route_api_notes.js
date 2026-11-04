import express from 'express';


const router = express.Router();
//========================ROUTE=================================================
router.get('/', (req, res)=>{
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
    },
    {   "id" : 4,
        "title" : "Judul4"
    },
    {   "id" : 403,
        "title" : "Judul5xx"
    }
    ]

router.get('/api/notes/', (req, res)=>{
    // console.log("reques masuk");
    
    res.status(200).json({
        status : "success",
        code : 200,
        data : data,
    })
})

router.get('/api/notes/:id', (req, res)=>{
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

router.post('/api/notes/', (req, res)=>{
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


router.put('/api/notes/:id', (req, res)=>{
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

router.delete('/api/notes/:id', (req, res)=>{
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
//========================ROUTE=================================================
export default router;