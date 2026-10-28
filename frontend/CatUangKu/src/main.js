
const idPesan = document.querySelector('#pesan');

const getData = async ()=>{
    try{
        const response = await fetch('/api/notes/');
        if(!response.ok){
          throw new Error(`Pesan Error  dengan status: ${response.status}`);   
        }
        const data = await response.json();
        tampilkanCatatan(data.data);
        idPesan.textContent = ''
    }catch(error){
        // console.log("Pesan Error: ",error.message);
        idPesan.textContent = error.message    
    }
}

    const tampilkanCatatan =(data)=>{
        const idDaftar = document.querySelector('#daftar');
        idDaftar.replaceChildren(); 
        const ulBaru = document.createElement("ul");
        
        for (let i = 0; i < data.length; i++) {
        const liBaru1 = document.createElement("li");
            liBaru1.textContent=data[i].title;
            ulBaru.appendChild(liBaru1);
        }

        idDaftar.appendChild(ulBaru);   
    }

getData();


const from = document.getElementById('formCatatan');
from.addEventListener("submit", function (event){
    // event.preventDefault();
    // ambil value dari input
    const getTitle = document.querySelector("#fJudul");
    const dataInput = getTitle.value
    tambahCatatan(dataInput);
})
const tambahCatatan = async (dataInput)=>{
    console.log("data yang di terima, ", dataInput);
    
    try{
        // if(dataInput===""){
        //     return(
        //         alert(" Data inputan kosong : ?");
        //     )
        // }
        const randID = Math.floor(Math.random() * 10);
        
        const dataBody= {
            id : Number(randID),
            title : dataInput,
        }
        const data = JSON.stringify(dataBody);
        
        const response = await fetch('/api/notes/',{
            method: 'POST',
            headers :{
                'Content-Type': 'application/json'
            },
            body : data
        })
        if(!response.ok){
            throw new Error ( `Gagal Input dengan code ${response.status} dengan pesan ${response.message}`);
        }
        getData();
    }catch(error){
        // console.log(`Proses Error dengan detail : ${error.message}`)
        idPesan.textContent = error.message
    }
}