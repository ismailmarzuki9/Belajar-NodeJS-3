const idPesan = document.querySelector('#pesan2');
const idInput = document.querySelector('#fJudul');



const getTransaksi = async () => {
    try {
        const response = await fetch('/api/transaksi/');

        console.log("bentuk response ",response);

        const Data = await response.json();
        console.log(" bentuk data", Data);
        console.log(" bentuk data", Data.data);
        
        // idPesan.textContent=Data.data;

        if (!response.ok) {
            throw new Error (``);
        }
    } catch (error) {
        
    }

}
getTransaksi();