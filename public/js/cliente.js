const key =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdmdmxqendwemljd3lucW1pcnVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Njc2NTU5NjcsImV4cCI6MTk4MzIzMTk2N30.Jj6AQlRlabhEBppjaP9Bw0kBa77HHOBTTLNsy5cv2EY";
const url = "https://gfvljzwpzicwynqmirui.supabase.co";
const database = supabase.createClient(url, key);
//bloquear boton paypal
document.getElementById("paypal-button-container").style.display = "none";

const menuBtn = document.querySelector(".menu-icon span");
const searchBtn = document.querySelector(".search-icon");
const cancelBtn = document.querySelector(".cancel-icon");
const items = document.querySelector(".nav-items");
const form = document.querySelector("form");
menuBtn.onclick = () => {
  items.classList.add("active");
  menuBtn.classList.add("hide");
  searchBtn.classList.add("hide");
  cancelBtn.classList.add("show");
};
cancelBtn.onclick = () => {
  items.classList.remove("active");
  menuBtn.classList.remove("hide");
  searchBtn.classList.remove("hide");
  cancelBtn.classList.remove("show");
  form.classList.remove("active");
  cancelBtn.style.color = "#ff3d00";
};
searchBtn.onclick = () => {
  form.classList.add("active");
  searchBtn.classList.add("hide");
  cancelBtn.classList.add("show");
};

//funcion para verificar si un asientos esta reservado
const checkAsiento = async () => {
  let idRuta = localStorage.getItem("idRuta");
  let fecha = localStorage.getItem("fechaViaje");
  console.log(idRuta);
  console.log(fecha);
  let resp = await database.from("rutas").select("*").eq("id", idRuta);
  let bote = resp.data[0].bote_asignado;
  console.log("holamundo");
  let resp2 = await database.from("compras").select("*");
  for (var i in resp2.data) {
    if (resp2.data[i].fecha == fecha && resp2.data[i].bote_asignado == bote) {
      let asiento = resp2.data[i].asientosArray;
      let seat = document.getElementById(asiento);
      seat.classList.remove("seat");
      seat.classList.add("seat-ocupado");
    }
  }
};
checkAsiento();

//funcion para mostrar información de la ruta
const infoRuta = async () => {
  let hora = new Date();
  let horaActual = hora.getHours();
  let minutos = hora.getMinutes();
  let segundos = hora.getSeconds();
  if (minutos < 10) {
    minutos = "0" + minutos;
  }
  if (segundos < 10) {
    segundos = "0" + segundos;
  }
  if (horaActual < 10) {
    horaActual = "0" + horaActual;
  }
  let horaFormateada = horaActual + ":" + minutos + ":" + segundos;

  let idRuta = localStorage.getItem("idRuta");
  let fecha = localStorage.getItem("fechaViaje");
  database
    .from("rutas")
    .select("*")
    .eq("id", idRuta)
    .then(({ data, error }) => {
      if (error) {
        console.log(error);
      } else {
        if ((horaFormateada > data[0].hora) & (fecha == data[0].fecha)) {
          console.log("ruta no disponible");
          alert("Ruta No Disponible");
        } else {
          console.log("data", data);
          //guardar en localStorage
          localStorage.setItem("origen", data[0].origen);
          localStorage.setItem("destino", data[0].destino);
          let infoBoleto = document.getElementById("infoBoleto");
          infoBoleto.innerHTML = `<div class="alert alert-success" role="alert">
                <h5 class="alert-heading">Informacion de la ruta</h5>
                <strong id="bote_a">${data[0].bote_asignado}</strong><br>
                <strong>${data[0].origen} ➡️ ${data[0].destino}</strong>
                <p class="mb-0">Precio: $ <strong id="precioBoleto">${data[0].precio}</strong></p>
                <p class="mb-0">Hora: <strong id="horaBoleto">${data[0].hora}</strong></p>
                </div>
                `;
        }
      }
    });
};
infoRuta();

//temporizador
function temporizador() {
  //iniciar temporizador de 10 minutos
  let tiempo = 600;
  let minutos = 10;
  let segundos = 0;
  let temporizador = document.getElementById("temporizador");
  let intervalo = setInterval(function () {
    if (segundos == 0) {
      segundos = 60;
      minutos--;
    }
    if (minutos == 0) {
      segundos = 0;
      clearInterval(intervalo);
      alert("Tiempo de reserva agotado");
      window.location.href = "index.html";
    }
    segundos--;
    temporizador.innerHTML = `<div class="alert alert-danger" role="alert">
        Tiempo restante: <strong>${minutos}m:${segundos}s </strong>
      </div>`;
  }, 1000);
}
temporizador();

function cerrarSesion() {
  sessionStorage.clear();
  window.location.href = "../login.html";
}

function verificarAsiento(id) {
  let idRuta = localStorage.getItem("idRuta");
  let fecha = localStorage.getItem("fechaViaje");
  let asientos = document.getElementById(id);
  let bote = document.getElementById("bote_a").innerHTML;
  let resp2 = database.from("compras").select("*");
  for (var i in resp2.data) {
    if (resp2.data[i].fecha == fecha && resp2.data[i].bote_asignado == bote) {
      let asiento = resp2.data[i].asientosArray;
      for (var j in asiento) {
        if (asiento[j] == id) {
          asientos.classList.add("seat-ocupado");
          return true;
        }
      }
    }
  }
  return false;
}

//seleccionar asiento cambiar de de class
asientos = [];
precio = [];
function seleccionarAsiento(id) {
let asientosSelected = document.getElementById("asientosSelected");
let precioBoleto = document.getElementById("precioBoleto");
let agregarPasajero = document.getElementById("pasajeros");
let horaBoleto = document.getElementById("horaBoleto");
console.log(precioBoleto);
let totalPago = document.getElementById("totalPago");

var asiento = document.getElementById(id);
var filas =0;
//traer la hora de la ruta 
if(asiento.classList.contains("seat-ocupado")){
  alert("Asiento ocupado");
}else{
  if(asiento.classList.contains("seat")){
    asiento.classList.remove("seat");
    asiento.classList.add("seat-selected");
    //agregar campos para nombres y apellidos
    agregarPasajero.innerHTML +=`
    <div class="row" id="pasajero${id}">
    <div class="col-sm-12">
    <div class="card">
        <div class="card-body">
        <h5 class="card-title">Asiento ${id}</h5>
        <div id="result">👤</div>
        <label>Cédula</label>
        <input class="form-control" type="text" id="cedula" name="cedula" placeholder="Cédula" required/><br>
        <label>Nombre</label>
        <input type="text"  class="form-control" id="nombre" name="nombre" placeholder="Nombre"><br>
        <label>Apellido</label>
        <input type="text" class="form-control" id="apellido" name="apellido" placeholder="Apellido"><br>
        </div>
   </div>
   </div>
   </div>
    `;
    asientos.push(id);
    precio.push(precioBoleto.innerHTML);
   // asientosSelected.innerHTML = asientos;
    console.log(precio);
    //sumar los precios
    let suma = 0;
    for (var i in precio) {
        suma += parseFloat(precio[i].replace("$", ""));
        
    }
    totalPago.innerHTML =`<h3>$${suma} USD</h3>`;
    suma = sessionStorage.setItem("totalPago", suma);
  }else{
    if(asiento.classList.contains("seat-selected")){
      asiento.classList.remove("seat-selected");
      asiento.classList.add("seat");
      asientos.splice(asientos.indexOf(id), 1);
      precio.splice(precio.indexOf(precioBoleto.innerHTML), 1);
      //asientosSelected.innerHTML = asientos;
      let pasajero = document.getElementById("pasajero"+id);
      pasajero.remove();
      console.log(precio);
      //sumar los precios
      let suma = 0;
      for (var i in precio) {
          suma += parseFloat(precio[i].replace("$", ""));
      }
      totalPago.innerHTML=`<h3>$${suma} USD</h3>`;
      suma = sessionStorage.setItem("totalPago", suma);
    }
  }
}

}

const continuar = async () => {
  //comprobar que todos los campos esten llenos
  if (
    document.getElementById("cedula").value == "" ||
    document.getElementById("nombre").value == "" ||
    document.getElementById("apellido").value == ""
  ) {
    alert("Por favor llene todos los campos 💡");
  } else {
    let cedulas = document.getElementsByName("cedula");
    let nombres = document.getElementsByName("nombre");
    let apellidos = document.getElementsByName("apellido");
    console.log(cedulas[0].value);
    console.log(nombres[0].value);
    console.log(apellidos[0].value);
    //obtener los asientos seleccionados
    let asiento = document.querySelectorAll(".seat-selected");
    console.log(asiento);
    let fecha = localStorage.getItem("fechaViaje");
    console.log(fecha);
    let destino = localStorage.getItem("destino");
    console.log(destino);
    //buscar cedula del usuario en la base de datos
    let idUsuario = sessionStorage.getItem("cedula");
    let bote_asignado = document.getElementById("bote_a").innerHTML;
    let totalPago = sessionStorage.getItem("totalPago");
    let asientosArray = [];
    let nombresyapellidos = [];
    let cedula = [];
    let nombre = [];
    let apellido = [];
    for (var i = 0; i < cedulas.length; i++) {
      cedula.push(cedulas[i].value);
      nombre.push(nombres[i].value);
      apellido.push(apellidos[i].value);
      asientosArray.push(asientos[i]);
      nombresyapellidos.push(nombre[i]+" "+apellido[i]);
    }

    var compra = {
      cedula,
      nombre,
      apellido,
      asientosArray,
      nombresyapellidos,
      fecha,
      destino,
      idUsuario,
      totalPago,
      bote_asignado,
    };
     localStorage.setItem("compra", JSON.stringify(compra));
    
    //comprobar que no exista asientos repetidos
    comprobar();
}
}

const comprobar = async () => {
  let compra = JSON.parse(localStorage.getItem("compra"));
  //buscar si en la base existe una compra con los mismos asientos
  let asientos = compra.asientosArray;
  let fecha = compra.fecha;
  let destino = compra.destino;
  let bote_asignado = compra.bote_asignado;
  //buscar en la base de datos
  let resp = await database.from("compras").select("*").eq("fecha", fecha).eq("destino", destino).eq("bote_asignado", bote_asignado);
  console.log(resp);
  let asientosOcupados = [];
  for (var i = 0; i < resp.length; i++) {
    asientosOcupados.push(resp[i].asientosArray);
  }
  console.log(asientosOcupados);
  let asientosRepetidos = [];
  for (var i = 0; i < asientos.length; i++) {
    for (var j = 0; j < asientosOcupados.length; j++) {
      if (asientos[i] == asientosOcupados[j]) {
        asientosRepetidos.push(asientos[i]);
      }
    }
  }
  console.log(asientosRepetidos);
  if (asientosRepetidos.length > 0) {
    alert("Los asientos " + asientosRepetidos + " ya estan ocupados");
  }
  else{
    //mostar boton de paypal
    document.getElementById("paypal-button-container").style.display = "block";
  }

};

/*
const continuar = async () => {
  //comprobar que todos los campos esten llenos
  if (
    document.getElementById("cedula").value == "" ||
    document.getElementById("nombre").value == "" ||
    document.getElementById("apellido").value == ""
  ) {
    alert("Por favor llene todos los campos 💡");
  } else {
    let cedulas = document.getElementsByName("cedula");
    let nombres = document.getElementsByName("nombre");
    let apellidos = document.getElementsByName("apellido");
    //obtener los asientos seleccionados
    console.log(cedulas[0].value);
    console.log(nombres[0].value);
    console.log(apellidos[0].value);
    let asiento = document.querySelectorAll(".seat-selected");
    let fecha = localStorage.getItem("fechaViaje");
    let destino = localStorage.getItem("destino");
    let idUsuario = localStorage.getItem("cedula");
    let bote_asignado = document.getElementById("bote_a").innerHTML;
    let totalPago = sessionStorage.getItem("totalPago");
    let asientosArray = [];
    let nombresyapellidos = [];
    let cedula = [];
    let nombre = [];
    let apellido = [];
    for (var i = 0; i < cedulas.length; i++) {
      cedula.push(cedulas[i].value);
      nombre.push(nombres[i].value);
      apellido.push(apellidos[i].value);
      asientosArray.push(asientos[i]);
      nombresyapellidos.push(nombre[i]+" "+apellido[i]);
    }

    var compra = {
      cedula,
      nombre,
      apellido,
      asientosArray,
      nombresyapellidos,
      fecha,
      destino,
      idUsuario,
      totalPago,
      bote_asignado,
    };
     localStorage.setItem("compra", JSON.stringify(compra));
    
      if(localStorage.getItem("compra") != null){
      let compra = JSON.parse(localStorage.getItem("compra"));
      database.from("compras").select("*").eq("fecha",fecha).eq("destino",destino).eq("bote_asignado",bote_asignado).then(({data, error}) => { 
        if(error){
          console.log(error);
        }else{
          for(var i in data){
            for(var j in data[i].asientosArray){
              for(var k in asientosArray){
                if(data[i].asientosArray[j] == asientosArray[k]){
                  alert("Asiento:"+asientosArray[k]+"ocupado");
                }else{
                  //si no hay datos iguales, guardar los datos
                  database
                  .from("compras")
                  .insert([
                    {
                      cedula: compra.cedula[i],
                      nombre: compra.nombre[i],
                      apellido: compra.apellido[i],
                      asientosArray: compra.asientosArray[i],
                      nombresyapellidos: compra.nombresyapellidos[i],
                      fecha: compra.fecha,
                      destino: compra.destino,
                      idUsuario: compra.idUsuario,
                      totalPago: compra.totalPago,
                      bote_asignado: compra.bote_asignado,
                    },
                  ])
                  .then((data) => {
                    console.log(data);
                    document.getElementById("paypal-button-container").style.display = "block";
                  });
                }
              }
            }
          }

        }
       });
      }
      else{
        console.log("no hay datos")
      }  
  }
};*/

/*
const guardarcompra = async () => {
  let compra = JSON.parse(localStorage.getItem("compra"));
  console.log(compra);
  for (var i in compra.asientosArray) {
    if (verificarAsiento(compra.asientosArray[i])) {
      alert("Asiento ocupado");
    } else {
      database
        .from("compras")
        .insert([
          {
            cedula: compra.cedula[i],
            nombre: compra.nombre[i],
            apellido: compra.apellido[i],
            asientosArray: compra.asientosArray[i],
            nombresyapellidos: compra.nombresyapellidos[i],
            fecha: compra.fecha,
            destino: compra.destino,
            idUsuario: compra.idUsuario,
            totalPago: compra.totalPago,
            bote_asignado: compra.bote_asignado,
          },
        ])
        .then((data) => {
          console.log(data);
          alert("Compra realizada con éxito ✅ ");
          window.location.href = "../client/gracias.html";
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }
  alert("Compra realizada con exito ✅");
  window.location.href = "../client/gracias.html";
};*/

paypal
  .Buttons({
    // Sets up the transaction when a payment button is clicked
    //cambiar idioma a español
    locale: "es_ES",
    style: {
      color: "blue",
      shape: "pill",
    },
    createOrder: (data, actions) => {
      return actions.order.create({
        purchase_units: [
          {
            amount: {
              //obtener el valor de un session storage
              value: sessionStorage.getItem("totalPago"),
              //value: 16
            },
            //descripcion del producto
            description: "Compra de boletos Sacha Wassi",
          },
        ],
      });
    },
    // Finalize the transaction after payer approval
    onApprove: (data, actions) => {
      return actions.order.capture().then(function (orderData) {

        alert("Compra realizada con éxito ✅ ");
        //redireccionar a la pagina de index
        window.location.href = "../client/gracias.html";
        
      });
    },
    onCancel: (data, actions) => {
      alert("Pago cancelado 😢 ");
      //eliminar datos de compra de la base de datos
      let compra = JSON.parse(localStorage.getItem("compra"));
      //eliminar de la base de datos
      for(var i in compra.cedulas){
        database.from("compras").delete().eq("cedula",compra.cedulas[i]).eq("fecha",compra.fecha).eq("destino",compra.destino).eq("bote_asignado",compra.bote_asignado).then(({data, error}) => {
              if(error){
                console.log(error);
              }else{
                console.log(data);
              }
        });
              
      }
    },
    onError: (data, actions) => {
      return actions.order.capture().then(function (orderData) {
        //obtener datos de compra para eliminarlos de la base
        let compra = JSON.parse(localStorage.getItem("compra"));
        //eliminar de la base de datos
        for(var i in compra.cedulas){
          database.from("compras").delete().eq("cedula",compra.cedulas[i]).eq("fecha",compra.fecha).eq("destino",compra.destino).eq("bote_asignado",compra.bote_asignado).then(({data, error}) => {
            if(error){
              console.log(error);
            }else{
              console.log(data);
            }
          });
        
        }
        //eliminar datos de compra
        alert("Pago cancelado 😢 ");
        //redireccionar a la pagina de index
        window.location.href = "../client/index.html";
      });
    },
  })
  .render("#paypal-button-container");
//en caso de rechazo
//cerrar sesion si hizo click 
const logout = document.querySelector("#logout");
logout.addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "https://eduardoguevarasw.github.io/sachawassionline/";
})