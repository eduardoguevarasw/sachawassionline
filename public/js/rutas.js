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


//funcion para listar las rutas
const listarBotes = async () => {
    let registroBotes = document.getElementById("registroBotes");
    let { data, error } = await database
    .from("rutas")
    .select("*")

    if (error) {
        console.log("error", error);
        alert("Error al listar los botes ❌");
    }
    console.log("data", data);
    data.forEach((bote,index) => {
        registroBotes.innerHTML += `
        <tr>
            <td>${index+1}</td>
            <td>${bote.origen}</td>
            <td>${bote.destino}</td>
            <td>${bote.bote_asignado}</td>
            <td>${bote.precio}</td>
            <td>${bote.hora}</td>
            <td>${bote.dias_disponible}</td>
            <td>${bote.estado}</td>
            <td>
            <button class="btnEditar" onclick="editBote('${bote.id}')">Editar</button>
          </td>
            <td>
                <button class="btnEliminar" onclick="eliminarBote('${bote.id}')">Eliminar</button>
            </td>
        </tr>
      </div>



        `;
    } );
}

function eliminarBote(id){
    //eliminar bote 
    database
    .from("rutas")
    .delete()
    .match({ id: id })
    .then((response) => {
        console.log("response", response);
        alert("Ruta eliminada correctamente ✅");
        location.reload();
    })
}

window.addEventListener("load",  async () => {
 await initDataTable();
});

//mostrar el las ciudades en el select de origen
const mostrarOrigen = async () => {
    let origen = document.getElementById("origen");
    let { data, error } = await database
    .from("ciudades")
    .select("*")
    .eq("estado", "disponible")
    if (error) {
        console.log("error", error);
        alert("Error al listar los botes ❌");
    }
    console.log("data", data);
    data.forEach((ciudad) => {
        origen.innerHTML += `
        <option value="${ciudad.nombre}">${ciudad.nombre}</option>
        `;
    } );
}
mostrarOrigen();




var contadorFila = 0;
let btnAgregar = document.querySelector("#btnAgregar");
btnAgregar.addEventListener("click", async (e) => {
  e.preventDefault();
  //mostrar destino 
  let datos = document.getElementById("paradas");
  datos.innerHTML += `<div class="row" id="fila${contadorFila}">
  <div class="col-md-2">
      <div class="form-group">
          <label for="destino">Parada${contadorFila+1}</label>
          <select class="form-control" id="destino${contadorFila+1}" name="destino" required>
          <option value="">Seleccione</option>
          </select>
      </div>
  </div>
  <div class="col-md-2">
      <div class="form-group">  
          <label for="precio">Precio</label>
          <input type="number" id="precio${contadorFila+1}" class="form-control" required>
      </div>
  </div>
  <div class="col-md-1">
      <div class="form-group">
          <label for="fecha">Guardar</label>
          <button class="btn btn-success" onclick="SaveFila(${contadorFila+1})">Guardar</button>
      </div>
  </div>
  <div class="col-md-1">
      <div class="form-group">
          <label for="fecha">Eliminar</label>
          <button class="btn btn-danger" onclick="deleteFila(${contadorFila})">Eliminar</button>
      </div>
  </div>
</div>`;
  contadorFila++;

  let destino = document.getElementById("destino"+(contadorFila));
  let { data, error } = await database
  .from("ciudades")
  .select("*")
  .eq("estado", "disponible")
  if (error) {
      console.log("error", error);
      alert("Error al listar los botes ❌");
  }
  console.log("data", data);
  data.forEach((ciudad) => {
      destino.innerHTML += `
      <option value="${ciudad.nombre}">${ciudad.nombre}</option>
      `;
  });
  
});



function SaveFila(fila) {
  let destino = document.getElementById("destino" + fila).value;
  let precio = document.getElementById("precio" + fila).value;
  let origen = document.getElementById("origen").value;
  let hora = document.getElementById("hora").value;
  let bote_asignado = document.getElementById("bote_asignado").value;
  let lunes = document.getElementById("lunes").checked;
  let martes = document.getElementById("martes").checked;
  let miercoles = document.getElementById("miercoles").checked;
  let jueves = document.getElementById("jueves").checked;
  let viernes = document.getElementById("viernes").checked;
  let sabado = document.getElementById("sabado").checked;
  let domingo = document.getElementById("domingo").checked;
  
  
  //guardar los dias en un array
  let dias_disponible = [];
  if (lunes) {
    dias_disponible.push("lunes");
  }
  if (martes) {
    dias_disponible.push("martes");
  }
  if (miercoles) {
    dias_disponible.push("miercoles");
  }
  if (jueves) {
    dias_disponible.push("jueves");
  }
  if (viernes) {
    dias_disponible.push("viernes");
  }
  if (sabado) {
    dias_disponible.push("sabado");
  }
  if (domingo) {
    dias_disponible.push("domingo");
  }
  //let fecha = new Date();

  //si la precio contiene valores negativos no guardar
  if(precio < 0){
    alert("El precio no puede ser negativo");
    return;
  }else{
    //controlar que el precio no sea 0
    if(precio == 0){
      alert("El precio no puede ser 0");
      return;
    }else{
      //el origen no puede ser igual al destino
      if(origen == destino){
        alert("El origen no puede ser igual al destino");
        return;
      }else{
        let data = {
          origen,
          destino,
          precio,
          hora,
          bote_asignado,
          dias_disponible,
        };
        console.log(data);
        deleteFila(fila-1);
        insertRuta(data);
        
      }
      

    }
  }

  

  
}

function deleteFila(id) {
  let fila = document.getElementById("fila" + id);
  fila.remove();
}

const insertRuta = async (data) => {

  //controlar que todos los campos esten llenos
  if(data.origen == "" || data.destino == "" || data.precio == "" || data.hora == "" || data.bote_asignado == "" || data.dias_disponible == ""){
    alert("Por favor llene todos los campos 💡");
  }else{
    //controlar que el origen, destino, bote, hora y dias no se repitan
    const res = await database.from("rutas").select("*").eq("origen", data.origen).eq("destino", data.destino).eq("bote_asignado", data.bote_asignado).eq("hora", data.hora);
    console.log(res.data);
    if(res.data.length > 0){
      alert("Esta ruta ya existe ❌");
    }else{
      //insertar ruta
      const res = await database.from("rutas").insert([data]);
      console.log(res);
      if (res) {
        alert("Ruta agregada correctamente ✅");
        //recargar la pagina
      } else {
        alert("Error al agregar la ruta ❌");
      }
    }
    
  }
}
//traer los botes disponibles
const traer_botes = async () => {
  let bote_asignado = document.getElementById("bote_asignado");
  let option = "";
  const res = await database.from("bote").select("*").eq("estado", "disponible");
  console.log(res.data);
  if (res) {
    for (var i in res.data) {
      option += `<option value="${res.data[i].nombre}">${res.data[i].nombre}</option>`;
    }
    bote_asignado.innerHTML = option;
  }
};
traer_botes();

//control de hora 
const hora = document.querySelector('input[type="time"]');
hora.setAttribute('min', '06:00');
hora.setAttribute('max', '21:00');

hora.addEventListener('change', () => {
  const value = hora.value;
  if (value < '06:00' || value >= '21:00') {
    alert('Seleccione una hora entre las 6:00 AM y las 21:00 PM');
    hora.value = '';
  }
});

//control de origen y destino


//funcion para editar las rutas
const editBote = async (id) => {

  //agregar html a edit
  document.getElementById("edit").innerHTML = `
  <div class="row" id="fila${id}">
  <div class="col-md-2">
      <div class="form-group">
          <input type="hidden" id="id" value="${id}">
      </div>
  </div>
  <div class="col-md-2">
      <div class="form-group">
          <label for="destino">ruta${id}</label>
          <input type="text" class="form-control" id="destino" name="destino" placeholder="Destino" required>
      </div>
  </div>
  <div class="col-md-2">
      <div class="form-group">  
          <label for="precio">Precio</label>
          <input type="number" id="precio" class="form-control" required>
      </div>
  </div>
  <div class="col-md-2">
      <div class="form-group">  
          <label for="precio">Estado</label>
          <select id="estado" name="estado" class="form-control" >
              <option value="disponible">Disponible</option>
              <option value="nodisponible">No disponible</option>
          </select>
      </div>
  </div>
  <div class="col-md-1">
      <div class="form-group">
          <label for="fecha">Guardar</label>
          <button type="button" id="guardarRuta" class="btn btn-success" onclick="updateRuta(${id})">Guardar</button>
          <button type="button" id="updateBote" class="btnEditar" onclick="updateRuta(${id})" style="display:none">Editar</button>
      </div>
  </div>
</div>
  
  `;

  document.getElementById("guardarRuta").style.display = "none";
  //mostrar boton de editar y quitar hidden 
  document.getElementById("updateBote").style.display = "block";
  console.log(id);
  const res = await database.from("rutas").select("*").eq("id", id);
  console.log(res.data);
  document.getElementById("id").value = res.data[0].id;
  document.getElementById("origen").value = res.data[0].origen;
  document.getElementById("destino").value = res.data[0].destino;
  document.getElementById("precio").value = res.data[0].precio;
  document.getElementById("hora").value = res.data[0].hora;
  document.getElementById("bote_asignado").value = res.data[0].bote_asignado;
  document.getElementById("estado").value = res.data[0].estado;
  let dias = res.data[0].dias_disponible;
  console.log(dias);
  for (var i in dias) {
    if (dias[i] == "lunes") {
      document.getElementById("lunes").checked = true;
    }
    if (dias[i] == "martes") {
      document.getElementById("martes").checked = true;
    }
    if (dias[i] == "miercoles") {
      document.getElementById("miercoles").checked = true;
    }
    if (dias[i] == "jueves") {
      document.getElementById("jueves").checked = true;
    }
    if (dias[i] == "viernes") {
      document.getElementById("viernes").checked = true;
    }
    if (dias[i] == "sabado") {
      document.getElementById("sabado").checked = true;
    }
    if (dias[i] == "domingo") {
      document.getElementById("domingo").checked = true;
    }
  }
  
}

//funcion para actualizar las rutas
function updateRuta(id) {
  let clave = document.getElementById("id").value;
   //control de que los valores no esten vacios
  let origen = document.getElementById("origen").value;
  let destino = document.getElementById("destino").value;
  let precio = document.getElementById("precio").value;
  let hora = document.getElementById("hora").value;
  let bote_asignado = document.getElementById("bote_asignado").value;
  let estado = document.getElementById("estado").value;
  console.log(estado);
  let dias_disponible = [];

  //control de campos vacios
  if (origen == "" || destino == "" || precio == "" || hora == "" || bote_asignado == "" ) {
    alert("Por favor llene todos los campos 💡 ");
    return false;
  }else{
    //control de que el precio sea mayor a 0
    if (precio < 0) {
      alert("El precio debe ser mayor a 0");
      return false;
    }else{
      //control de que el origen y el destino sean iguales
      if (origen == destino) {
        alert("El origen y el destino no pueden ser iguales");
        return false;
      }else{
        //control de que algún dia este seleccinado 
        
          let data = {
            origen: origen,
            destino: destino,
            precio: precio,
            hora: hora,
            bote_asignado: bote_asignado,
            dias_disponible: dias_disponible,
            estado: estado
          }
          if (document.getElementById("lunes").checked) {
            data.dias_disponible.push("lunes");
          }
          if (document.getElementById("martes").checked) {
            data.dias_disponible.push("martes");
          }
          if (document.getElementById("miercoles").checked) {
            data.dias_disponible.push("miercoles");
          }
          if (document.getElementById("jueves").checked) {
            data.dias_disponible.push("jueves");
          }
          if (document.getElementById("viernes").checked) {
            data.dias_disponible.push("viernes");
          }
          if (document.getElementById("sabado").checked) {
            data.dias_disponible.push("sabado");
          }
          if (document.getElementById("domingo").checked) {
            data.dias_disponible.push("domingo");
          }
          if (data.dias_disponible.length == 0) {
            alert("Por favor seleccione al menos un dia");
            return false;
          }
          console.log(data);
          //actualizar datos
            database.from("rutas").update(data).eq("id", clave).then((res) => {
            console.log(res);
            alert("Ruta actualizada");
            //recargar la pagina
            location.reload();
            
          });
      }
    }
  }
  
}





//============================================FORMATO DE DINERO ==========================================


//cerrar sesion si hizo click 
const logout = document.querySelector(".logout");
logout.addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "https://eduardoguevarasw.github.io/sachawassionline/";
})