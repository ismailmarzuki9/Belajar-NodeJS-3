
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
        const ArrData = data
       
        for (let i = 0; i < ArrData.length; i++) {
        var liBaru1 = document.createElement("li");
            liBaru1.textContent=ArrData[i].title;
            ulBaru.appendChild(liBaru1);
        }

        idDaftar.appendChild(ulBaru);   
    }

getData();

const tambahCatatan = async (dataInput)=>{
    event.preventDefault()
    console.log("data yang di terima, ", dataInput);

    try{
        if(!dataInput){
            alert(" Data inputan kosong : ?");
        }
        const data = JSON.stringify(dataFrom)
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
        console.log(`Proses Error dengan detail : ${error.message}`)
    }
}