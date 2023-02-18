const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdmdmxqendwemljd3lucW1pcnVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Njc2NTU5NjcsImV4cCI6MTk4MzIzMTk2N30.Jj6AQlRlabhEBppjaP9Bw0kBa77HHOBTTLNsy5cv2EY";
const url = "https://gfvljzwpzicwynqmirui.supabase.co";
const database = supabase.createClient(url, key);
//obtener el jwt 


let dataTable;
let dataTableisInit = false;

const initDataTable = async () => {
    if(dataTableisInit){
        dataTable.destroy();
    };

    await listarBotes();

    dataTable = $("#table_id").DataTable({
        responsive: true,
        "language": {
            "url": "//cdn.datatables.net/plug-ins/1.10.24/i18n/Spanish.json"
        },
       
    });

    dataTableisInit = true;
}


//funcion para listar los botes
const listarBotes = async () => {
    let { data, error } = await database
    .from("rutas")
    .select("*")
    if (error) {
        console.log("error", error);
        alert("Error al listar los botes ❌");
    }
    //si el idUsuario es igual al idUsuario de la compra
    //mostrar los datos de la compra
    data.forEach((bote,index) => {
            registroBotes.innerHTML += `
        <tr>
            <td>${index+1}</td>
            <td>${bote.origen}</td>
            <td>${bote.destino}</td>
            <td>${bote.bote_asignado}</td>
            <td>${bote.hora}</td>
            <td>${bote.dias_disponible}</td>
        </tr>
      </div>
        `;
     
        
    } );
}


window.addEventListener("load",  async () => {
 await initDataTable();
});

