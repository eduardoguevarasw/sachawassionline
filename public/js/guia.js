const key ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdmdmxqendwemljd3lucW1pcnVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Njc2NTU5NjcsImV4cCI6MTk4MzIzMTk2N30.Jj6AQlRlabhEBppjaP9Bw0kBa77HHOBTTLNsy5cv2EY";
const url = "https://gfvljzwpzicwynqmirui.supabase.co";

const database = supabase.createClient(url, key);
const body = document.querySelector("body"),
      modeToggle = body.querySelector(".mode-toggle");
      sidebar = body.querySelector("nav");
      sidebarToggle = body.querySelector(".sidebar-toggle");

let getMode = localStorage.getItem("mode");
if(getMode && getMode ==="dark"){
    body.classList.toggle("dark");
}

let getStatus = localStorage.getItem("status");
if(getStatus && getStatus ==="close"){
    sidebar.classList.toggle("close");
}

modeToggle.addEventListener("click", () =>{
    body.classList.toggle("dark");
    if(body.classList.contains("dark")){
        localStorage.setItem("mode", "dark");
    }else{
        localStorage.setItem("mode", "light");
    }
});

sidebarToggle.addEventListener("click", () => {
    sidebar.classList.toggle("close");
    if(sidebar.classList.contains("close")){
        localStorage.setItem("status", "close");
    }else{
        localStorage.setItem("status", "open");
    }
})

//seleccionar solo fechas anteriores a la actual 
let maxValue = new Date();
maxValue.setDate(maxValue.getDate());
maxValue = maxValue.toISOString().split("T")[0];
document.getElementById("fecha").setAttribute("max", maxValue);

let dataTable;
let dataTableisInit = false;

const initDataTable = async () => {
    if(dataTableisInit){
        dataTable.destroy();
    };

    await listarBotes();

    dataTable = $("#table_id").DataTable({
        dom: 'Bfrtip',
        buttons: [
            {
                extend: 'pdfHtml5',
                download: 'open'
            }
        ],
        responsive: true,
        "language": {
            "url": "//cdn.datatables.net/plug-ins/1.10.24/i18n/Spanish.json"
        },
       
    });

    dataTableisInit = true;
}

function buscarfecha(){
    initDataTable();
}

//funcion para listar los botes
const listarBotes = async () => {

    //al cambiar la fecha se debe actualizar la tabla
    let fechaActual = document.getElementById("fecha").value;
    console.log(fechaActual);
    //cambiar el formato de la fecha en dd/mm/yyyy
    //determinar la zona horaria
    let fecha = new Date(fechaActual).toLocaleDateString('es-ES');
    //aumentar un dia a la fecha
    let fecha2 = new Date(fechaActual);
    fecha2.setDate(fecha2.getDate() + 1);
    fecha2 = new Date(fecha2).toLocaleDateString('es-ES');
    console.log(fecha2);
    console.log(fecha);
    //obtener la fecha de hoy en el formato dd/mm/yyyy
    let registroBotes = document.getElementById("registroBotes");
    let { data, error } = await database
    .from("compras")
    .select("*")
    .eq("fecha", fechaActual)
    if (error) {
        console.log("error", error);
        alert("Error al listar los botes ❌");
    }
    //buscar la el destino con la id de la ruta
    
    data.forEach((bote,index) => {
        registroBotes.innerHTML += `
        <tr>
            <td>${index+1}</td>
            <td>${bote.cedula}</td>
            <td>${bote.nombre}</td>
            <td>${bote.apellido}</td>
            <td>${bote.asientosArray}</td>
            <td>${bote.destino}</td>
            <td>${bote.bote_asignado}</td>
        </tr>
      </div>`;
    } );
}

window.addEventListener("load",  async () => {
 await initDataTable();
});

//cerrar sesion si hizo click 
const logout = document.querySelector(".logout");
logout.addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "https://eduardoguevarasw.github.io/sachawassi/";
})
