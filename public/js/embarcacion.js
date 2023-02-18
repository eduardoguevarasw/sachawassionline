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

//funcion para registrar un bote
function registrarBote(){

    const nombre = document.getElementById("nombre").value;
    const placa = document.getElementById("placa").value;
    const estado = document.getElementById("estado").value;
    const bote = {
        nombre: nombre,
        placa: placa,
        estado: estado
    }
    if(nombre === "" || placa === "" || estado === ""){
        alert("Porfavor llene todos los campos 💡")
    }else{
        //validar si ya existe otro bote con los mismo datos
        database
        .from("bote")
        .select("*")
        .eq("placa", placa)
        .eq("nombre", nombre)
        .then((response) => {
            console.log("data", response.data);
            if(response.data.length > 0){
                alert("Ya existe un bote con los mismos datos ❌");
            }else{
                //insertar el bote
                database
                .from("bote")
                .insert([bote])
                .then((response) => {
                    console.log("Registro exitoso", response);
                    alert("Registro exitoso ✅");
                    //RECARGAR LA PAGINA
                    location.reload();
                })
                .catch((error) => {
                    console.log("Error", error);
                    alert("Error al registrar el bote ❌");
                    //recargar la pagina
                    location.reload();
                });
            }
        })
    }
}


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
        }
    });

    dataTableisInit = true;
}


//funcion para listar los botes
const listarBotes = async () => {
    let registroBotes = document.getElementById("registroBotes");
    let { data, error } = await database
    .from("bote")
    .select("*");
    if (error) {
        console.log("error", error);
        alert("Error al listar los botes ❌");
    }
    console.log("data", data);
    data.forEach((bote,index) => {
        registroBotes.innerHTML += `
        <tr>
            <td>${index+1}</td>
            <td>${bote.placa}</td>
            <td>${bote.nombre}</td>
            <td>${bote.estado}</td>
            <td>
                <button class="btnEditar" onclick="selectBote('${bote.placa}')">Editar</button>
            </td>
            <td>
                <button class="btnEliminar" onclick="eliminarBote('${bote.placa}')">Eliminar</button>
            </td>
        </tr>
      </div>



        `;
    } );
}

window.addEventListener("load",  async () => {
 await initDataTable();
});

//funcion para editar un bote 
function selectBote(placa) {
//cargar los datos en el form 
    database
    .from("bote")
    .select("*")
    .eq("placa", placa)
    .then((response) => {  
        console.log("data", response.data);
        const bote = response.data[0];
        document.getElementById("nombre").value = bote.nombre;
        document.getElementById("placa").value = bote.placa;
        document.getElementById("estado").value = bote.estado;
        document.getElementById("placa").disabled = true;
        //ocultar boton de registrar en type="hidden"
        document.getElementById("saveBote").style.display = "none";
        //mostrar boton de editar y quitar hidden 
        document.getElementById("updateBote").style.display = "block";
     })
}

function editBote(){
    const nombre = document.getElementById("nombre").value;
    const placa = document.getElementById("placa").value;
    const estado = document.getElementById("estado").value;
    const bote = {
        nombre: nombre,
        placa: placa,
        estado: estado
    }
    database
    .from("bote")
    .update([bote])
    .eq("placa", placa)
    .then((response) => {
        console.log("Registro exitoso", response);
        alert("Actualización exitosa ✅");
        //RECARGAR LA PAGINA
        location.reload();
    })
    .catch((error) => {
        console.log("Error", error);
        alert("Error al actualizar el bote ❌");
        //recargar la pagina
        location.reload();
    });
}


//funcion para eliminar un bote
function eliminarBote(placa){
    console.log(placa);
    database
    .from("bote")
    .delete()
    .eq("placa", placa)
    .then((response) => {
        console.log("Eliminacion exitosa", response);
        alert("Eliminacion exitosa ✅");
        //RECARGAR LA PAGINA
        location.reload();
    })
    .catch((error) => {
        console.log("Error", error);
        alert("Error al eliminar el bote ❌");
        //recargar la pagina
        location.reload();
    });
}

//cerrar sesion si hizo click 
const logout = document.querySelector(".logout");
logout.addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "https://eduardoguevarasw.github.io/sachawassi/";
})
