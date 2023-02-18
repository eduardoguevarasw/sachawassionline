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


//funcion para registrar ciudad
function registrarCiudad(){
    //validar que no exista una ciudad igual 
   
    const nombre = document.getElementById("nombre").value;
    const estado = document.getElementById("estado").value;
    const ciudad = {
        nombre: nombre,
        estado: estado
    }
    console.log(nombre, estado);
    if(nombre === "" || estado === ""){
        alert("Por favor llene todos los campos 💡");

    }else{
        //validar que no exista una ciudad igual 
        database
        .from("ciudades")
        .select("*")
        .eq("nombre", nombre)
        .then((response) => {
            console.log("data", response.data);
            if(response.data.length > 0){
                alert("Ya existe una ciudad con ese nombre ❌");
            }else{
                database
                .from("ciudades")
                .insert([ciudad])
                .then((response) => {
                    console.log("Registro exitoso", response);
                    alert("Registro exitoso ✅");
                    //RECARGAR LA PAGINA
                    location.reload();
                })
            }
        })
        .catch((error) => {
            console.log("error", error);
            alert("Error al registrar la ciudad ❌");
        })
    }
    
   
}

//listar ciudades
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
    .from("ciudades")
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
            <td>${bote.nombre}</td>
            <td>${bote.estado}</td>
            <td>
                <button class="btnEditar" onclick="selectBote('${bote.id}')">Editar</button>
            </td>
            <td>
                <button class="btnEliminar" onclick="eliminarBote('${bote.id}')">Eliminar</button>
            </td>
        </tr>
      </div>



        `;
    } );
}

window.addEventListener("load",  async () => {
 await initDataTable();
});


//funcion para eliminar bote con el id
const eliminarBote = async (id) => {
    let { data, error } = await database
    .from("ciudades")
    .delete()
    .match({id: id});
    if (error) {
        console.log("error", error);
        alert("Error al eliminar el bote ❌");
    }else{
        console.log("data", data);
        alert("Eliminado correctamente ✅");
        //recargar la pagina
        location.reload();
    }   
}

//funcion para editar una ciudad
const selectBote = async (id) => {
    database
    .from("ciudades")
    .select("*")
    .eq("id", id)
    .then((response) => {  
        console.log("data", response.data);
        const bote = response.data[0];
        document.getElementById("id").value = bote.id;
        document.getElementById("nombre").value = bote.nombre;
        document.getElementById("estado").value = bote.estado;
        //ocultar boton de registrar en type="hidden"
        document.getElementById("saveBote").style.display = "none";
        //mostrar boton de editar y quitar hidden 
        document.getElementById("updateBote").style.display = "block";
     })
    //focus a input nombre
    document.getElementById("nombre").focus();
}

function editCiudad(){
    const id = document.getElementById("id").value;
    const nombre = document.getElementById("nombre").value;
    const estado = document.getElementById("estado").value;
    const bote = {
        nombre: nombre,
        estado: estado
    }
    database
    .from("ciudades")
    .update([bote])
    .eq("id", id)
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

//cerrar sesion si hizo click 
const logout = document.querySelector(".logout");
logout.addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "https://eduardoguevarasw.github.io/sachawassi/";
})
