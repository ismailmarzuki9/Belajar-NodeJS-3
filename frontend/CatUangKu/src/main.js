
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
            buttonEdit.textContent=" edit ";
            // dataSet.value=data[i].id;
            // buttonDelete.setAttributeNode(dataSet);
            buttonDelete.dataset.id = data[i].id
            buttonDelete.dataset.aksi = "delete"
            buttonEdit.dataset.id = data[i].id
            buttonEdit.dataset.aksi = " edit "
            
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
            console.log("id Button :", id);
            hapusCatatan(id);
        }else{
            editCatatan(id);
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
const editCatatan = async (id) => {
    try {
        console.log(id>0);
        const data = await fetch(`/api/notes/${id}`);
        console.log(data.data);
        
    } catch (error) {
        
    }
}