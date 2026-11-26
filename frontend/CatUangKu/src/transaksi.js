const daftarTrx = document.querySelector('#daftarTrx');
const pesanTrx = document.querySelector('#pesanTrx');
// import tampilkanCatatan from './main.js';

let uuidEdit = null;

const getTransaksi = async () => {
    try {
        const response = await fetch('/api/transaksi/');
        if (!response.ok) {
            throw new Error (`Data Kosong ${response.status}`);
        }
        const Data = await response.json();
        tampilkanTransaksi(Data.data);
        pesanTrx.textContent = '';
    } catch (error) {
        pesanTrx.textContent = error.message
    }

}
getTransaksi();
// tampilkan daftar data transaksi 
const tampilkanTransaksi = (data) => {
    daftarTrx.replaceChildren();
    // console.log('Data yang ada Trx ',data);
    const ulBaru = document.createElement("ul");
    for (let i = 0; i < data.length; i++) {
        const liBaru1 = document.createElement("li");
        liBaru1.textContent=`
            ${data[i].nama_transaksi}|
            ${data[i].type}|
            ${Intl.NumberFormat('id-ID', {style:'currency', currency:'IDR'}).format(data[i].nominal)} |
            ${data[i].keterangan ?? '-'}
        `;
        // ${data[i].nominal} |
        const buttonDelete = document.createElement("button");
        const buttonEdit = document.createElement("button");
        buttonDelete.textContent="delete";
        buttonEdit.textContent="edit";

        // buttonDelete.setAttributeNode(dataSet);
        buttonDelete.dataset.uuid = data[i].uuid
        buttonDelete.dataset.aksi = "delete"

        buttonEdit.dataset.uuid = data[i].uuid
        buttonEdit.dataset.aksi = "edit"
        buttonEdit.dataset.nama_transaksi = data[i].nama_transaksi
        buttonEdit.dataset.type = data[i].type
        buttonEdit.dataset.nominal = data[i].nominal
        buttonEdit.dataset.keterangan = data[i].keterangan ?? ''
            
        liBaru1.appendChild(buttonDelete);
        liBaru1.appendChild(buttonEdit);
        ulBaru.appendChild(liBaru1);
        
    }
     daftarTrx.appendChild(ulBaru);
}

//input transaksi
const inputTrx = document.getElementById('inputTrx');
inputTrx.addEventListener("submit", function (event){
    event.preventDefault();
    // get semua data
    const formData = new FormData(inputTrx) // mengumpulkan semua input ber-name, dibaca lewat .get('nama_transaksi'). Lebih ringkas kalau field banyak.
    const dataTrxA = Object.fromEntries(formData.entries());
    console.log("uuide",uuidEdit);
    if (uuidEdit === null) {
        console.log("data Baru");
        return AddTransaksi(dataTrxA);
    }
    // console.log("data Edit dengan uuid",uuidEdit);
    // console.log("data dari from",dataTrxA);
    // console.log("run ... function editTransaksi");
    editTransaksi(dataTrxA)
})
// Logika tombol batal
const batal = document.getElementById('batal');
batal.addEventListener("click", function (e) {
    e.preventDefault();
    inputTrx.reset()
    uuidEdit=null
    console.log("bataluuid", uuidEdit);
    
})
const AddTransaksi = async (data) => {
    try {
        const dataBody = {
            nama_transaksi : data.nama_transaksi,
            type : data.type,
            nominal : Number(data.nominal),
            keterangan : data.keterangan
        }
        const dataPost = JSON.stringify(dataBody);
        console.log("data yg di post",dataPost);
        
        const response = await fetch('/api/transaksi/',{
            method : 'POST',
            headers :{
                'Content-Type': 'application/json'
            },
            body : dataPost
        })
        if (!response.ok) {
            const errorBody = await response.json();
            throw new Error(errorBody.message);
        }
        inputTrx.reset();
        uuidEdit = null;
        await getTransaksi();
    } catch (error) {
        pesanTrx.textContent = error.message
    }
}
// DELETE OR EDIR
daftarTrx.addEventListener("click", function(event){
    const uuid = event.target.dataset.uuid;
    if (event.target.dataset.aksi === "delete") {
        const conf = confirm("Yakin hapus data ?")
        if (conf==true) {
            hapusTransaksi(uuid)            
        }else{
            alert("Batal di Delete")
        }
    } else if (event.target.dataset.aksi === "edit"){
        isiFormEdit(event.target.dataset)
    }
    
})
const hapusTransaksi = async (uuid) => {
    try {
        const response = await fetch(`/api/transaksi/${uuid}`,{
            method : 'DELETE',
        })
        if(!response.ok){
            throw new Error ( ` Gagal menghapus Transkasi code ${response.status}`)
        }
        await getTransaksi();
    } catch (error) {
        pesanTrx.textContent = error.message
    }
}


const isiFormEdit= (data)=>{
    console.log("dari f isi form",data.uuid);
    uuidEdit = data.uuid
    document.querySelector("#nama_transaksi").value = data.nama_transaksi;
    document.querySelector("#nominal").value = data.nominal;
    document.querySelector("#keterangan").value = data.keterangan ?? "";
    document.querySelector(`input[name="type"][value="${data.type}"]`).checked = true;

}


const editTransaksi= async (data)=>{
    try {
        
        const dataBody = {
                nama_transaksi: data.nama_transaksi,
                type: data.type,
                nominal: Number(data.nominal),
                keterangan: data.keterangan
            }; 
        const putData = await fetch(`/api/transaksi/${uuidEdit}`,{
            method : 'PUT',
            headers : {
                'Content-Type': 'application/json'
            },
            body : JSON.stringify(dataBody)
        })

        if (!putData.ok) {
            const errorBody = await putData.json()
            console.log(errorBody);
            throw new Error ( `Gagal update dengan status ${putData.status} dengan pesan ${errorBody.message}`)
        }
        inputTrx.reset();
        // document.querySelector("#uuid").value =''
        uuidEdit = null; // agar uuid jadi null setelah berhasil edit
        console.log(data.uuid);
        await getTransaksi();
        

    } catch (error) {
        pesanTrx.textContent = error.message
    }
}