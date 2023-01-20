const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdmdmxqendwemljd3lucW1pcnVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Njc2NTU5NjcsImV4cCI6MTk4MzIzMTk2N30.Jj6AQlRlabhEBppjaP9Bw0kBa77HHOBTTLNsy5cv2EY";
const url = "https://gfvljzwpzicwynqmirui.supabase.co";
const database = supabase.createClient(url, key);

//ocultar el boton de comprar boleto de paypal 
document.getElementById("paypal-button-container").style.display = "none";

//cerrar sesion si hizo click 
const logout = document.querySelector("#logout");
logout.addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "https://eduardoguevarasw.github.io/sachawassionline/";
})


//mostrar informacion de ruta
const comprobarRuta = async () => {
  let idRuta = localStorage.getItem("idRuta");
  let fechaViaje = localStorage.getItem("fechaViaje");
  database.from('rutas').select('*').eq('id', idRuta).then(({ data, error }) => {
    if (error) {
        console.log('error', error)
    } else {
       
        let hora = new Date();
        let horaActual = hora.getHours();
        let minutos = hora.getMinutes();
        let segundos = hora.getSeconds();
        if(minutos<10){
          minutos = '0'+minutos;
        }
        if(segundos<10){
          segundos = '0'+segundos;
        }
        if(horaActual<10){
          horaActual = '0'+horaActual;
        }
        let horaFormateada = horaActual + ":" + minutos + ":" + segundos;
        if(horaFormateada>data[0].hora & fechaViaje == data[0].fecha)
        {
          console.log("ruta no disponible")
        }else{
          console.log('data', data)
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
          `
         
        }
        
    }
})
  
}
comprobarRuta();

//temporizador
function temporizador(){
//iniciar temporizador de 10 minutos
let tiempo = 600;
let minutos = 10;
let segundos = 0;
let temporizador = document.getElementById("temporizador"); 
let intervalo = setInterval(function(){
    if(segundos == 0){
        segundos = 60;
        minutos--;
    }
    if(minutos == 0){
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
};
temporizador();

function cerrarSesion(){
  sessionStorage.clear();
  window.location.href = "../login.html";
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
        <input class="cedula" type="text" id="cedula" name="cedula" placeholder="Cédula" required/><br>
        <label>Nombre</label>
        <input type="text"  class="nombre" id="nombre" placeholder="Nombre"><br>
        <label>Apellido</label>
        <input type="text" class="apellido" id="apellido" placeholder="Apellido"><br>
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

//funcion para comprobar asientos ocupados
const comprobarAsientos = async () => {
  let idRuta = localStorage.getItem("idRuta");
  //buscar nombre de bote
  let resp = await database.from("rutas").select("*").eq("id", idRuta);
  let nombreBote = resp.data[0].bote_asignado;
  console.log(nombreBote);
  let res = await database.from("compras").select("*");
 //obtener el bote asignado con idRuta
  let fechabusca = localStorage.getItem("fechaViaje");
  console.log(fechabusca);
  //poner los asientos ocupados si la fecha de compra es igual a la fecha de busqueda
  for (var i in res.data) {
    let fechaCompra = res.data[i].fecha;
    if (fechabusca == fechaCompra && res.data[i].bote_asignado == nombreBote) {
      let asientosArray = res.data[i].asientosArray;
      for (var j in asientosArray) {
       //mostrar array
        document.getElementById(asientosArray[j]).classList.add("seat-ocupado");
      }
    }
  }
}
comprobarAsientos();


const menuBtn = document.querySelector(".menu-icon span");
const searchBtn = document.querySelector(".search-icon");
const cancelBtn = document.querySelector(".cancel-icon");
const items = document.querySelector(".nav-items");
const form = document.querySelector("form");
menuBtn.onclick = ()=>{
  items.classList.add("active");
  menuBtn.classList.add("hide");
  searchBtn.classList.add("hide");
  cancelBtn.classList.add("show");
}
cancelBtn.onclick = ()=>{
  items.classList.remove("active");
  menuBtn.classList.remove("hide");
  searchBtn.classList.remove("hide");
  cancelBtn.classList.remove("show");
  form.classList.remove("active");
  cancelBtn.style.color = "#ff3d00";
}
searchBtn.onclick = ()=>{
  form.classList.add("active");
  searchBtn.classList.add("hide");
  cancelBtn.classList.add("show");
}




function continuar(){
  //comprobar que todos los campos esten llenos 
  if(document.getElementById("cedula").value == "" || document.getElementById("nombre").value == "" || document.getElementById("apellido").value == ""){
    alert("Por favor llene todos los campos 💡");
  }else{
    let cedulas = document.getElementsByClassName("cedula");
    let nombres = document.getElementsByClassName("nombre");
    let apellidos = document.getElementsByClassName("apellido");
    //obtener los asientos seleccionados
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
    
    var compra ={
      cedula,
      nombre,
      apellido,
      asientosArray,
      nombresyapellidos,
      fecha,
      destino,
      idUsuario,
      totalPago,
      bote_asignado
    }
    console.log(compra);
    //comprobar en la base si existe asientos registrados con la misma fecha y el mismo bote
    database.from("compras").select("*").eq("fecha", fecha).eq("bote_asignado", bote_asignado).then((res)=>{
      //si no hay registros
      if(res.data.length == 0){
        //guardar compra
        localStorage.setItem("compra", JSON.stringify(compra));
        document.getElementById("paypal-button-container").style.display = "block";

      }else{
        //si hay registros
        //comprobar si los asientos estan ocupados
        comprobarAsientos();
        for(var i in res.data){
          let asientosArray = res.data[i].asientosArray;
          for(var j in asientosArray){
            if(compra.asientosArray.includes(asientosArray[j])){
              alert("El asiento "+asientosArray[j]+" ya esta ocupado");
            }
          }
        }
    }
    //guardar en el localstorage
    //habilitar boton de paypal
    //guardarcompra(compra);
  }, (error)=>{
    console.log(error);
  })
 
}
}

function guardarcompra (){
  let compra = JSON.parse(localStorage.getItem("compra"));
  //guardar uno por uno  
  
  for(var i in compra.asientosArray){
    database.from("compras").insert([
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
        bote_asignado: compra.bote_asignado
      }
    ]).then((data) => {
      console.log(data);
      alert("Compra realizada con éxito ✅ ");
      window.location.href = "../client/gracias.html";
    }).catch((error) => {
      console.log(error);
    })
  }
}

paypal.Buttons({
  // Sets up the transaction when a payment button is clicked
  
  createOrder: (data, actions) => {
    return actions.order.create({
      purchase_units: [{
        amount: {
            //obtener el valor de un session storage
            value: sessionStorage.getItem("totalPago")
            //value: 16
        }
      }]
    });
  },
  // Finalize the transaction after payer approval
  onApprove: (data, actions) => {
    return actions.order.capture().then(function(orderData) {
      // Successful capture! For dev/demo purposes:
      //console.log('Capture result', orderData, JSON.stringify(orderData, null, 2));
      //const transaction = orderData.purchase_units[0].payments.captures[0];
      //alert(`Transaction ${transaction.status}: ${transaction.id}\n\nSee console for all available details`);
      // When ready to go live, remove the alert and show a success message within this page. For example:
      // const element = document.getElementById('paypal-button-container');
      // element.innerHTML = '<h3>Thank you for your payment!</h3>';
      // Or go to another URL:  actions.redirect('thank_you.html');
        //una vez confirmado el pago se guarda en la base de datos
        guardarcompra();
      
      });
    }
  }).render('#paypal-button-container');




(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  (function($) {
    var RucValidatorEc, jQueryRucValidatorEc;
    RucValidatorEc = (function() {
      function RucValidatorEc(numero) {
        this.numero = numero;
        this.numero = this.numero.toString();
        this.valid = false;
        this.codigo_provincia = null;
        this.tipo_de_cedula = null;
        this.already_validated = false;
      }

      RucValidatorEc.prototype.validate = function() {
        var digito_verificador, i, modulo, multiplicadores, p, producto, productos, provincias, residuo, suma, tercer_digito, verificador, _i, _j, _k, _l, _len, _len1, _ref, _ref1;
        if ((_ref = this.numero.length) !== 10 && _ref !== 13) {
          this.valid = false;
          throw new Error("Longitud incorrecta.");
        }
        provincias = 22;
        this.codigo_provincia = parseInt(this.numero.substr(0, 2), 10);
        if (this.codigo_provincia < 1 || this.codigo_provincia > provincias) {
          this.valid = false;
          throw new Error("Código de provincia incorrecto.");
        }
        tercer_digito = parseInt(this.numero[2], 10);
        if (tercer_digito === 7 || tercer_digito === 8) {
          throw new Error("Tercer dígito es inválido.");
        }
        if (tercer_digito === 9) {
          this.tipo_de_cedula = "Sociedad privada o extranjera";
        } else if (tercer_digito === 6) {
          this.tipo_de_cedula = "Sociedad pública";
        } else if (tercer_digito < 6) {
          this.tipo_de_cedula = "Persona natural";
        }
        productos = [];
        if (tercer_digito < 6) {
          modulo = 10;
          verificador = parseInt(this.numero.substr(9, 1), 10);
          p = 2;
          _ref1 = this.numero.substr(0, 9);
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            i = _ref1[_i];
            producto = parseInt(i, 10) * p;
            if (producto >= 10) {
              producto -= 9;
            }
            productos.push(producto);
            if (p === 2) {
              p = 1;
            } else {
              p = 2;
            }
          }
        }
        if (tercer_digito === 6) {
          verificador = parseInt(this.numero.substr(8, 1), 10);
          modulo = 11;
          multiplicadores = [3, 2, 7, 6, 5, 4, 3, 2];
          for (i = _j = 0; _j <= 7; i = ++_j) {
            productos[i] = parseInt(this.numero[i], 10) * multiplicadores[i];
          }
          productos[8] = 0;
        }
        if (tercer_digito === 9) {
          verificador = parseInt(this.numero.substr(9, 1), 10);
          modulo = 11;
          multiplicadores = [4, 3, 2, 7, 6, 5, 4, 3, 2];
          for (i = _k = 0; _k <= 8; i = ++_k) {
            productos[i] = parseInt(this.numero[i], 10) * multiplicadores[i];
          }
        }
        suma = 0;
        for (_l = 0, _len1 = productos.length; _l < _len1; _l++) {
          i = productos[_l];
          suma += i;
        }
        residuo = suma % modulo;
        digito_verificador = residuo === 0 ? 0 : modulo - residuo;
        if (tercer_digito === 6) {
          if (this.numero.substr(9, 4) !== "0001") {
            throw new Error("RUC de empresa del sector público debe terminar en 0001");
          }
          this.valid = digito_verificador === verificador;
        }
        if (tercer_digito === 9) {
          if (this.numero.substr(10, 3) !== "001") {
            throw new Error("RUC de entidad privada debe terminar en 001");
          }
          this.valid = digito_verificador === verificador;
        }
        if (tercer_digito < 6) {
          if (this.numero.length > 10 && this.numero.substr(10, 3) !== "001") {
            throw new Error("RUC de persona natural debe terminar en 001");
          }
          this.valid = digito_verificador === verificador;
        }
        return this;
      };

      RucValidatorEc.prototype.isValid = function() {
        if (!this.already_validated) {
          this.validate();
        }
        return this.valid;
      };

      return RucValidatorEc;

    })();
    jQueryRucValidatorEc = (function() {
      function jQueryRucValidatorEc($node, options) {
        this.$node = $node;
        this.options = options;
        this.validateContent = __bind(this.validateContent, this);
        this.options = $.extend({}, $.fn.validarCedulaEC.defaults, this.options);
        this.$node.on(this.options.events, this.validateContent);
      }

      jQueryRucValidatorEc.prototype.validateContent = function() {
        var check, error, numero_de_cedula, _ref;
        numero_de_cedula = this.$node.val().toString();
        check = this.options.strict;
        if (!check && ((_ref = numero_de_cedula.length) === 10 || _ref === 13)) {
          check = true;
        }
        if (check) {
          try {
            if (new RucValidatorEc(numero_de_cedula).isValid()) {
              this.$node.removeClass(this.options.the_classes);
              this.options.onValid.call(this.$node);
            } else {
              this.$node.addClass(this.options.the_classes);
              this.options.onInvalid.call(this.$node);
            }
          } catch (_error) {
            error = _error;
            this.$node.addClass(this.options.the_classes);
            this.options.onInvalid.call(this.$node);
          }
        }
        return null;
      };

      return jQueryRucValidatorEc;

    })();
    $.fn.validarCedulaEC = function(options) {
      this.each(function() {
        return new jQueryRucValidatorEc($(this), options);
      });
      return this;
    };
    $.fn.validarCedulaEC.RucValidatorEc = RucValidatorEc;
    return $.fn.validarCedulaEC.defaults = {
      strict: true,
      events: "change",
      the_classes: "invalid",
      onValid: function() {
        return null;
      },
      onInvalid: function() {
        return null;
      }
    };
  })(jQuery);

}).call(this);

$("#cedula").validarCedulaEC({
  events: "keyup",
  onValid: function () {
    $("#result").html("Identificación Correcta ✅");
    //mostrar boton pagar
    $("#continuar").show();
  },
  onInvalid: function () {
    $("#result").html("identificación No válida ❌");
    //ocultar boton pagar
    $("#continuar").hide();
  },
});
