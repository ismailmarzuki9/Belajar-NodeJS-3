import express from 'express';
import 'dotenv/config';

const app = express();
const port = process.env.PORT || 3000

const notes = [ {id :1 , title : "Belajar"},
                {id :2 , title : "Belajar lagi"}
 ];

app.get('/', (req, res)=>{
    res.send('Hello World')
})
app.get('/api/notes',(req, res)=>{
    res.status(200).json(notes)
})
const HOST_LOCAL = '127.0.0.1';
const HOST_ANY = '0.0.0.0';

app.listen(port, HOST_LOCAL, ()=>{
    console.log(`code sudah run pada : ${HOST_LOCAL}:${port}`)
});
// PASANG MIDDLEWARE INI AGAR REQ.BODY TERBACA
app.use(express.json());