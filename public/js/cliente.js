const key =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdmdmxqendwemljd3lucW1pcnVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Njc2NTU5NjcsImV4cCI6MTk4MzIzMTk2N30.Jj6AQlRlabhEBppjaP9Bw0kBa77HHOBTTLNsy5cv2EY";
const url = "https://gfvljzwpzicwynqmirui.supabase.co";
const database = supabase.createClient(url, key);
//bloquear boton paypal
document.getElementById("paypal-button-container").style.display = "none";



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
                <p class="mb-0">Llegada Aprox: <strong id="llegadaBoleto">${data[0].llegada}</strong></p>
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
let llegadaBoleto = document.getElementById("llegadaBoleto");
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
        <select class="form-control" id="tipoDNI" name="tipoDNI">
        <option value="cedula">Cédula</option>
        <option value="pasaporte">Pasaporte</option>
        <select>
        <br>
        <input class="form-control" type="text" id="identificacion" name="cedula" placeholder="Indentificación" required/><br>
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
    document.getElementById("identificacion").value == "" ||
    document.getElementById("nombre").value == "" ||
    document.getElementById("apellido").value == ""
  ) {
    alert("Por favor llene todos los campos 💡");
  } else {
    //si esta marcado como cedula continuar 
    let tipoDNI = document.getElementById("tipoDNI").value;
    if (tipoDNI == "cedula") {
    let cedulas = document.getElementsByName("cedula");
    let nombres = document.getElementsByName("nombre");
    let apellidos = document.getElementsByName("apellido");
    //validar las cedulas
    let dni = cedulas.length;
    let validadas = 0;
    cedulas.forEach((cedula) => {
      var cedula = cedula.value;
      array = cedula.split("");
      num = array.length;
      if (num == 10) {
        total = 0;
        digito = (array[9] * 1);
        for (i = 0; i < (num - 1); i++) {
          mult = 0; if ((i % 2) != 0) { total = total + (array[i] * 1); } else {
            mult = array[i] * 2; if (mult > 9)
              total = total + (mult - 9);
            else
              total = total + mult;
          }
        }
        decena = total / 10;
        decena = Math.floor(decena);
        decena = (decena + 1) * 10;
        final = (decena - total);
        if ((final == 10 && digito == 0) || (final == digito)) {
          //si el numero de cedulas es igual al numero de cedulas validadas
          validadas++;
          if (dni == validadas) {
            let asiento = document.querySelectorAll(".seat-selected");
            console.log(asiento);
            let fecha = localStorage.getItem("fechaViaje");
            console.log(fecha);
            let origen = localStorage.getItem("origen");
            let destino = localStorage.getItem("destino");
            console.log(destino);
            //buscar cedula del usuario en la base de datos
            let idUsuario = localStorage.getItem("cedula");
            let idRuta = localStorage.getItem("idRuta");
            let bote_asignado = document.getElementById("bote_a").innerHTML;
            let totalPago = sessionStorage.getItem("totalPago");
            let horaSalida = document.getElementById("horaBoleto").innerHTML;
            let llegadaBoleto = document.getElementById("llegadaBoleto").innerHTML;

            let asientosArray = [];
            let nombresyapellidos = [];
            let cedula = [];
            let nombre = [];
            let apellido = [];
            let tx = [];
            for (var i = 0; i < cedulas.length; i++) {
              tx.push(Math.floor(Math.random() * 1000000000000));
              cedula.push(cedulas[i].value);
              nombre.push(nombres[i].value);
              apellido.push(apellidos[i].value);
              asientosArray.push(asientos[i]);
              nombresyapellidos.push(nombre[i] + " " + apellido[i]);
            }

            var compra = {
              cedula,
              nombre,
              apellido,
              asientosArray,
              nombresyapellidos,
              fecha,
              origen,
              horaSalida,
              llegadaBoleto,
              destino,
              idUsuario,
              totalPago,
              bote_asignado,
              tx,
              idRuta
            };
            localStorage.setItem("compra", JSON.stringify(compra));
            //comprobar que no exista asientos repetidos
            comprobar();
          }
        }
        else {
          alert("La cedula:" + cedula + " es invalida ❌")
          return false;
        }
      }
      else {
        alert("La cedula:" + cedula + " no tiene los 10 digitos ❌")
        return false;
      }
      });
    }else{
      let tipoDNI = document.getElementById("tipoDNI").value;
      if(tipoDNI == "pasaporte"){
      //guardar los datos de la compra
            let cedulas = document.getElementsByName("cedula");
            let nombres = document.getElementsByName("nombre");
            let apellidos = document.getElementsByName("apellido");
            let asiento = document.querySelectorAll(".seat-selected");
            console.log(asiento);
            let fecha = localStorage.getItem("fechaViaje");
            console.log(fecha);
            let origen = localStorage.getItem("origen");
            let destino = localStorage.getItem("destino");
            console.log(destino);
            //buscar cedula del usuario en la base de datos
            let idUsuario = localStorage.getItem("cedula");
            let idRuta = localStorage.getItem("idRuta");
            let bote_asignado = document.getElementById("bote_a").innerHTML;
            let totalPago = sessionStorage.getItem("totalPago");
            let horaSalida = document.getElementById("horaBoleto").innerHTML;
            let llegadaBoleto = document.getElementById("llegadaBoleto").innerHTML;

            let asientosArray = [];
            let nombresyapellidos = [];
            let cedula = [];
            let nombre = [];
            let apellido = [];
            let tx = [];
            for (var i = 0; i < cedulas.length; i++) {
              tx.push(Math.floor(Math.random() * 1000000000000));
              cedula.push(cedulas[i].value);
              nombre.push(nombres[i].value);
              apellido.push(apellidos[i].value);
              asientosArray.push(asientos[i]);
              nombresyapellidos.push(nombre[i] + " " + apellido[i]);
            }

            var compra = {
              cedula,
              nombre,
              apellido,
              asientosArray,
              nombresyapellidos,
              fecha,
              origen,
              horaSalida,
              llegadaBoleto,
              destino,
              idUsuario,
              totalPago,
              bote_asignado,
              tx,
              idRuta
            };
            localStorage.setItem("compra", JSON.stringify(compra));
            //comprobar que no exista asientos repetidos
            comprobar();
          }

    }
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
    let origen = localStorage.getItem("origen");
    //buscar cedula del usuario en la base de datos
    let idUsuario = localStorage.getItem("cedula");
    let bote_asignado = document.getElementById("bote_a").innerHTML;
    let horaSalida = document.getElementById("horaBoleto").innerHTML;
    let totalPago = sessionStorage.getItem("totalPago");
    let asientosArray = [];
    let nombresyapellidos = [];
    let cedula = [];
    let nombre = [];
    let apellido = [];
    let tx = [];
    for (var i = 0; i < cedulas.length; i++) {
      tx.push(Math.floor(Math.random() * 1000000000000))
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
      origen,
      horaSalida,
      idUsuario,
      totalPago,
      bote_asignado,
      tx,
    };
    
    if(compra.cedula.length == 0){
      alert("Por favor seleccione un asiento");
    }else{

      localStorage.setItem("compra", JSON.stringify(compra));
      console.log("guardar en local storage");
    }
    
    //comprobar que no exista asientos repetidos
    comprobar();
}
}*/

const comprobar = async () => {
  let compra = JSON.parse(localStorage.getItem("compra"));
  //buscar si en la base existe una compra con los mismos asientos
  let asientos = compra.asientosArray;
  let fecha = compra.fecha;
  let destino = compra.destino;
  let bote_asignado = compra.bote_asignado;
  console.log(asientos);
  console.log(fecha);
  console.log(destino);
  console.log(bote_asignado);

  //buscar en la base de datos
  let resp = await database.from("compras").select("*").eq("fecha", fecha).eq("destino", destino).eq("bote_asignado", bote_asignado);
  console.log(asientos);
  let asientosOcupados = [];
  resp.data.forEach(element => {
    asientosOcupados.push(element.asientosArray);
  });
  console.log(asientosOcupados);
  let asientosRepetidos = [];

  asientos.forEach(element => {
    asientosOcupados.forEach(element2 => {
      if(element == element2){
        asientosRepetidos.push(element);
      }
    });
  });
  
  console.log(asientosRepetidos);
  if (asientosRepetidos.length > 0) {
    alert("Los asientos " + asientosRepetidos + " ya estan ocupados");
    //recargar la pagina
    location.reload();
  }
  else{
    //guardar en la base de datos
    //generar un número de transacción de 12 digitos
    
    var datos = {
      cedula: compra.cedula,
      nombre: compra.nombre,
      apellido: compra.apellido,
      asientosArray: compra.asientosArray,
      nombresyapellidos: compra.nombresyapellidos,
      fecha: compra.fecha,
      origen: compra.origen,
      destino: compra.destino,
      idUsuario: compra.idUsuario,
      totalPago: compra.totalPago,
      bote_asignado: compra.bote_asignado,
      tx: compra.tx,
      idRuta: compra.idRuta
    }
    for(var i = 0; i < datos.cedula.length; i++){
      //guardar en la base de datos uno por uno
      let resp = await database.from("compras").insert(
        {
          cedula: datos.cedula[i],
          nombre: datos.nombre[i],
          apellido: datos.apellido[i],
          asientosArray: datos.asientosArray[i],
          nombresyapellidos: datos.nombresyapellidos[i],
          fecha: datos.fecha,
          origen: datos.origen,
          destino: datos.destino,
          idUsuario: datos.idUsuario,
          totalPago: datos.totalPago,
          bote_asignado: datos.bote_asignado,
          tx: datos.tx[i],
          idRuta: datos.idRuta
          
        })
    }
    //let resp = await database.from("compras").insert([compra]);
    console.log(resp);
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

function eliminartx(){
  console.log("entro a eliminar");
  //obtener datos de compra para eliminarlos de la base
  let compra = JSON.parse(localStorage.getItem("compra"));
  //eliminar de la base de datos
  for(var i in compra.tx){
     console.log(compra.tx[i])
    database.from("compras").delete().eq("tx",compra.tx[i]).then((data) => {
      console.log(data);
    });
  }
}


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
          let compra = JSON.parse(localStorage.getItem("compra"));
          let correo = localStorage.getItem("correo");
          let body = `
          <table style="undefined;table-layout: fixed; width: 750px">
<colgroup>
<col style="width: 212px">
<col style="width: 236px">
<col style="width: 302px">
</colgroup>
<thead>
  <tr>
    <th>SACHAWASSI</th>
    <th colspan="2">SISTEMA DE COMPRA DE COMPRA DE PASAJES ONLINE</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td>Embarcación</td>
    <td>Fecha</td>
    <td>Destino</td>
  </tr>
  <tr>
    <td>${compra.bote_asignado}</td>
    <td>${compra.fecha}</td>
    <td>${compra.destino}</td>
  </tr>
  <tr>
    <td>Datos del Pasajero</td>
    <td colspan="2">${compra.cedula}</td>
    <td colspan="2">${compra.nombresyapellidos}</td>
  </tr>
  <tr>
    <td>Número de Asiento:</td>
    <td colspan="2">${compra.asientosArray}</td>
  </tr>
  <tr>
    <td>Hora de Salida</td>
    <td>${compra.hora}</td>
    <td>Total: ${compra.totalPago}</td>
  </tr>
</tbody>
</table>
          `
          Email.send({
          SecureToken : "57189a0f-872e-468f-848a-fd3186d3e85d",
          To : correo,
          From : "andriuedg@gmail.com",
          Subject : "SachaWassi",
          Body : body
          }).then(
            message => alert("Datos de la compra enviados a su correo ✅")
            
          );
          //redireccionar en 5 segundos
          setTimeout(function(){window.location.href = "../client/gracias.html" }, 5000);
          

        
      });
    },
    onCancel: (data, actions) => {
      //mostrar mensaje de pago cancelado
      alert("Pago cancelado 😢 ");
      //borrar datos de compra de la base de datos
      eliminartx();
      
    },
    onError: (data, actions) => {
      //mostrar mensaje de error
      alert("Error al procesar el pago 😢 ");
      //borrar datos de compra de la base de datos
      eliminartx();
    },
  })
  .render("#paypal-button-container");
//en caso de rechazo
//cerrar sesion si hizo click 


const logout = document.querySelector("#logout");
logout.addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "https://eduardoguevarasw.github.io/sachawassi/";
})



