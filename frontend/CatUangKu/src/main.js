
const idPesan = document.querySelector('#pesan');
const idInput = document.querySelector('#fJudul');
const idDaftar = document.querySelector('#daftar');

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

// const tampilkanCatatan =(data)=>{        
//         idDaftar.replaceChildren(); // 
//         const ulBaru = document.createElement("ul");

//         for (let i = 0; i < data.length; i++) {
//         const liBaru1 = document.createElement("li");
//             liBaru1.textContent=data[i].title;

//             const buttonDelete = document.createElement("button");
//             const dataSet = document.createAttribute("data-id");
//             buttonDelete.textContent="Delete";
//             dataSet.value=data[i].id;
//             buttonDelete.setAttributeNode(dataSet);

//             liBaru1.appendChild(buttonDelete);
//             ulBaru.appendChild(liBaru1);
//         }

//         idDaftar.appendChild(ulBaru);  
//     }
const tampilkanCatatan =(data)=>{        
        idDaftar.replaceChildren(); // 
        const ulBaru = document.createElement("ul");

        for (let i = 0; i < data.length; i++) {
        const liBaru1 = document.createElement("li");
            liBaru1.textContent=data[i].title;

            const buttonDelete = document.createElement("button");
            // const dataSet = document.createAttribute("data-id");
            const buttonEdit = document.createElement("button");
            buttonDelete.textContent="delete";
            buttonEdit.textContent="edit";
            // dataSet.value=data[i].id;
            // buttonDelete.setAttributeNode(dataSet);
            buttonDelete.dataset.id = data[i].id
            buttonDelete.dataset.aksi = "delete"
            buttonEdit.dataset.id = data[i].id
            buttonEdit.dataset.aksi = "edit"
            buttonEdit.dataset.title = data[i].title
            
            liBaru1.appendChild(buttonDelete);
            liBaru1.appendChild(buttonEdit);
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



idDaftar.addEventListener("click", function(event){
    const id = event.target.dataset.id;
        if (event.target.dataset.aksi === "delete") {
            console.log("id Button delete:", id);
            hapusCatatan(id);
        }else if (event.target.dataset.aksi === "edit"){
            console.log("id Button edir:", id);
            editCatatan(id, event.target.dataset.title);
        }
})

const hapusCatatan= async (id) => {
    try{
        const response = await fetch(`/api/notes/${id}`,{
            method : 'DELETE',
        })
        if(!response.ok){
            throw new Error ( `Gagal menghapus dengan code ${response.status}`);
        }

        await getData();
        
    }catch(error){
        idPesan.textContent = error.message
    }
}

const editCatatan = async (id, judulLama) => {
    try {
        const inputValue = prompt("Judul Baru : ", judulLama);
        // cek judul bernilai null
        if (inputValue===null){return}
        // menghilangkan karakter space pada value inputValue
        const judulBaru =inputValue.trim();
        // cek apakah value kosong
        if(judulBaru === ""){
            idPesan.textContent = "judul tidak boleh Kosong";
            return;
        }
        // cek judul apakah sama dengan judul lama
        // const judulLama = event.target
        // const judulLamaValue = judulLama.dataset.title;
        if(judulBaru === judulLama){
            idPesan.textContent = 'ini masih Judul Lama'
            return;
        }
        
        console.log('data', inputValue);
        const putData = await fetch(`/api/notes/${id}`,{
            method : 'PUT',
            headers : {
                'Content-Type': 'application/json'
            },
            body : JSON.stringify({
                title : judulBaru
            })
        })
        if (!putData.ok) {
            throw new Error ( `Gagal update dengan status ${putData.status}`)
        }
        idPesan.textContent="";
        await getData();
    } catch (error) {
        idPesan.textContent = error.message
    }
}