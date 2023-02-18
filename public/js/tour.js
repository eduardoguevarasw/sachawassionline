const key =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdmdmxqendwemljd3lucW1pcnVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Njc2NTU5NjcsImV4cCI6MTk4MzIzMTk2N30.Jj6AQlRlabhEBppjaP9Bw0kBa77HHOBTTLNsy5cv2EY";
const url = "https://gfvljzwpzicwynqmirui.supabase.co";
const database = supabase.createClient(url, key);

const body = document.querySelector("body"),
  modeToggle = body.querySelector(".mode-toggle");
sidebar = body.querySelector("nav");
sidebarToggle = body.querySelector(".sidebar-toggle");

let getMode = localStorage.getItem("mode");
if (getMode && getMode === "dark") {
  body.classList.toggle("dark");
}

let getStatus = localStorage.getItem("status");
if (getStatus && getStatus === "close") {
  sidebar.classList.toggle("close");
}

modeToggle.addEventListener("click", () => {
  body.classList.toggle("dark");
  if (body.classList.contains("dark")) {
    localStorage.setItem("mode", "dark");
  } else {
    localStorage.setItem("mode", "light");
  }
});

sidebarToggle.addEventListener("click", () => {
  sidebar.classList.toggle("close");
  if (sidebar.classList.contains("close")) {
    localStorage.setItem("status", "close");
  } else {
    localStorage.setItem("status", "open");
  }
});
document.getElementById("btnActualizar").style.display = "none";

let dataTable;
let dataTableisInit = false;

const initDataTable = async () => {
  if (dataTableisInit) {
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


function buscarfecha() {
  initDataTable();
}

//cargar ciudades en el select de origen
const cargarCiudadesOrigen = async () => {
  let selectOrigen = document.getElementById("origen");
  let { data, error } = await database
    .from("ciudades")
    .select("*")
    .eq("estado", "disponible")
  if (error) {
    console.log("error", error);
    alert("Error al listar las ciudades ❌");
  }
  data.forEach((ciudad) => {
    selectOrigen.innerHTML += `
        <option value="${ciudad.nombre}">${ciudad.nombre}</option>
        `;
  });

};
cargarCiudadesOrigen();

//cargar ciudades en el select de destino
const cargarCiudadesDestino = async () => {
  let selectDestino = document.getElementById("destino");
  let { data, error } = await database
    .from("ciudades")
    .select("*")
    .eq("estado", "disponible")
  if (error) {
    console.log("error", error);
    alert("Error al listar las ciudades ❌");
  }
  data.forEach((ciudad) => {
    selectDestino.innerHTML += `
        <option value="${ciudad.nombre}">${ciudad.nombre}</option>
        `;
  });
};
cargarCiudadesDestino();



//funcion para listar los botes
const listarBotes = async () => {
  //al cambiar la fecha se debe actualizar la tabla
  //let fechaActual = document.getElementById("fechaCompra").value;
  //cambiar el formato de la fecha en dd/mm/yyyy
  //determinar la zona horaria
  //let fecha = new Date(fechaActual).toLocaleDateString();
  console.log();
  let registroBotes = document.getElementById("registroBotes");
  let { data, error } = await database
    .from("tour")
    .select("*")
  //.eq("checkin", fecha)
  if (error) {
    console.log("error", error);
    alert("Error al listar los botes ❌");
  }
  //buscar la el destino con la id de la ruta

  data.forEach((bote, index) => {
    registroBotes.innerHTML += `
        <tr>
            <td>${index + 1}</td>
            <td>${bote.nombre}</td>
            <td>${bote.origen}</td>
            <td>${bote.destino}</td>
            <td>${bote.precio}</td>
            <td>${bote.descripcion}</td>
            <td>${bote.dias}</td>
            <td>${bote.noches}</td>
            <td><img src="${bote.foto}" width="100px" height="100px"></td>
            <td>
                <button class="btnEditar" onclick="selectBote('${bote.id}')">Editar</button>
            </td>
            <td>
                <button class="btnEliminar" onclick="eliminarBote('${bote.id}')">Eliminar</button>
            </td>
        </tr>
      </div>
        `;
  });
}

//funcion para eliminar un bote
const eliminarBote = async (id) => {
  let { data, error } = await database
    .from("tour")
    .delete()
    .eq("id", id);
  if (error) {
    console.log("error", error);
    alert("Error al eliminar el tour ❌");
  } else {
    alert("Tour eliminado correctamente ✅");
    window.reload();
  }
  //actualizar la tabla
  initDataTable();
};

//funcion para seleccionar un bote
const selectBote = async (id) => {
  let { data, error } = await database
    .from("tour")
    .select("*")
    .eq("id", id);
  if (error) {
    console.log("error", error);
    alert("Error al seleccionar el tour ❌");
  }
  //llenar el formulario con los datos del bote
  document.getElementById("id").value = data[0].id;
  document.getElementById("nombre").value = data[0].nombre;
  document.getElementById("origen").value = data[0].origen;
  document.getElementById("destino").value = data[0].destino;
  document.getElementById("dias").value = data[0].dias;
  document.getElementById("noches").value = data[0].noches;
  document.getElementById("precio").value = data[0].precio;
  document.getElementById("descripcion").value = data[0].descripcion;
  document.getElementById("estado").value = data[0].estado;
  document.getElementById("btnGuardar").style.display = "none";
  document.getElementById("btnActualizar").style.display = "block";
};

//funcion para actualizar un bote
const actualizarBote = async () => {
  //validar que los campos no esten vacios
  if (document.getElementById("nombre").value == "" || document.getElementById("origen").value == "" || document.getElementById("destino").value == "" || document.getElementById("dias").value == "" || document.getElementById("noches").value == "" || document.getElementById("precio").value == "" || document.getElementById("descripcion").value == "") {
    alert("Por favor llene todos los campos");
    return;
  } else {
    let id = document.getElementById("id").value;
    let nombre = document.getElementById("nombre").value;
    let origen = document.getElementById("origen").value;
    let destino = document.getElementById("destino").value;
    let dias = document.getElementById("dias").value;
    let noches = document.getElementById("noches").value;
    let precio = document.getElementById("precio").value;
    let descripcion = document.getElementById("descripcion").value;
    let imagen = localStorage.getItem("imagen");
    let estado = document.getElementById("estado").value;
    let { data, error } = await database
      .from("tour")
      .update({
        nombre: nombre,
        origen: origen,
        destino: destino,
        dias: dias,
        noches: noches,
        precio: precio,
        descripcion: descripcion,
        foto: imagen,
        estado: estado
      })
      .eq("id", id);
    if (error) {
      console.log("error", error);
      alert("Error al actualizar el tour ❌");
    } else {
      alert("Tour actualizado con éxito ✅");
      window.reload();
    }
    //actualizar la tabla
    initDataTable();
  }

};

window.addEventListener("load", async () => {
  await initDataTable();
});


async function subir() {
  let foto = document.getElementById("imagen").files[0];
  const CLOUDINARY_PRESET = 'sachawassi';
  const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dau2utfvm/image/upload'
  //guardar la imagen en cloudinary
  const formData = new FormData();
  formData.append('file', foto);
  formData.append('upload_preset', CLOUDINARY_PRESET);
  const res = await fetch(CLOUDINARY_URL, {
    method: 'POST',
    body: formData

  });
  const file = await res.json();
  console.log(file);
  //guardar la url de la imagen en localstorage
  localStorage.setItem("imagen", file.url);
}

//al escuchar ingresar un dia en el input dias restar 1 al input noches
document.getElementById("dias").addEventListener("change", () => {
  let dias = document.getElementById("dias").value;
  //validar que no se ingrese un numero negativo
  if (dias < 1) {
    alert("No se puede ingresar un numero negativo");
    document.getElementById("dias").value = 1;
    return;
  } else {
    //validar si el dia es igual a 1 para que no reste 1 al input noches y poner 1 en noches
    if (dias == 1) {
      document.getElementById("noches").value = 1;
      return;
    } else {
      let noches = document.getElementById("noches").value;
      if (dias != "") {
        document.getElementById("noches").value = dias - 1;
      }
    }

  }


});


function guardarTour() {
  //validar que los campos no esten vacios y que origen y destino sean diferentes
  if (document.getElementById("nombre").value == "" || document.getElementById("origen").value == "" || document.getElementById("destino").value == "" || document.getElementById("dias").value == "" || document.getElementById("noches").value == "" || document.getElementById("precio").value == "" ||  document.getElementById("precio").value < 1 || document.getElementById("descripcion").value == "") {
    alert("Por favor verifique todos los campos estén correctos o llenos");
    return;
  } else {
    if (document.getElementById("origen").value == document.getElementById("destino").value) {
      alert("El origen y el destino no pueden ser iguales");
      return;
    } else {
      let nombre = document.getElementById("nombre").value;
      let origen = document.getElementById("origen").value;
      let destino = document.getElementById("destino").value;
      let dias = document.getElementById("dias").value;
      let noches = document.getElementById("noches").value;
      let precio = document.getElementById("precio").value;
      let descripcion = document.getElementById("descripcion").value;
      let imagen = localStorage.getItem("imagen");
      let estado = document.getElementById("estado").value;
      console.log(imagen);

      if (
        nombre === "" ||
        origen === "" ||
        destino === "" ||
        dias === "" ||
        noches === "" ||
        precio === "" ||
        descripcion === ""
      ) {
        alert("Todos los campos son obligatorios 💡");
      } else {
        //obtener url de la imagen del localstorage

        database
          .from("tour")
          .insert([
            {
              nombre: nombre,
              origen: origen,
              destino: destino,
              dias: dias,
              noches: noches,
              precio: precio,
              descripcion: descripcion,
              foto: imagen,
              estado: estado
            },
          ])
          .then((res) => {
            if (res.error) {
              console.log(res.error);
              alert("Error al guardar el tour 😢");
            } else {
              alert("Tour guardado con exito ✅");
            }
          });
      }

    }
  }

}



//cerrar sesion si hizo click
const logout = document.querySelector(".logout");
logout.addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "https://eduardoguevarasw.github.io/sachawassi/";
});
