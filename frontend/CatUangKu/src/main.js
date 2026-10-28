
const idPesan = document.querySelector('#pesan');
const idInput = document.querySelector('#fJudul')

const getData = async ()=>{
    try{
        const response = await fetch('/api/notes/');
        if(!response.ok){
          throw new Error(`Pesan Error  dengan status: ${response.status}`);   
        }
        const data = await response.json();
        tampilkanCatatan(data.data);
        idPesan.textContent = '';
        
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


const idFrom = document.getElementById('formCatatan');
idFrom.addEventListener("submit", function (event){
    event.preventDefault();
    // ambil value dari input
    const getTitle = document.querySelector("#fJudul");
    const dataInput = getTitle.value
    tambahCatatan(dataInput);
})
const tambahCatatan = async (dataInput)=>{
    try{
        // if(dataInput===""){
        //     return(
        //         alert(" Data inputan kosong : ?");
        //     )
        // }
        
        const dataBody= {
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
            const errorBody = await response.json()
            console.log(errorBody);
            throw new Error ( `Gagal Input dengan code ${response.status} dengan pesan ${errorBody.message}`);
        }
        await getData();
        idInput.value ='';
    }catch(error){
        // console.log(`Proses Error dengan detail : ${error.message}`)
        idPesan.textContent = error.message
    }
}