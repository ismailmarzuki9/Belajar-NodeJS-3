import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import route_api_notes from './route/route_api_notes.js';
import transaksi_routes from './route/transaksi_routes.js';

const app = express();
const port = process.env.PORT || 3000

const Izin_con = {
    origin : 'http://localhost:5173',
}
app.use(cors(Izin_con));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/',route_api_notes);
app.use('/',transaksi_routes);

//========================DB=================================================
// import {db} from './db/db.js';
// console.log("Tes Connet db", db.status);

//========================DB=================================================




//====================PORT=====================================================
// app.listen(port, ()=>{
//     console.log(`code sudah run pada : ${port}`)
// });

app.listen(port, (err) => {
  if (err) {
    console.error('Gagal menjalankan server:', err);
    process.exit(1);
  }
  console.log(`Server berjalan di port http://localhost:${port}`);
});
//=====================PORT====================================================