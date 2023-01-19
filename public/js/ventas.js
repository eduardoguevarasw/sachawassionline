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

//funcion para verificar si un asientos esta reservado
const checkAsiento = async () => {
  let idRuta = localStorage.getItem("idRuta");
  let fecha = localStorage.getItem("fechaViaje");
  console.log(idRuta);
  console.log(fecha);
  let resp = await database.from("rutas").select("*").eq("id", idRuta);
  let bote = resp.data[0].bote_asignado;
  console.log(bote);
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


//seleccionar asiento cambiar de de class
asientos = [];
precio = [];
function seleccionarAsiento(id) {
 let asientosSelected = document.getElementById("asientosSelected");
 let precioBoleto = document.getElementById("precioBoleto");
 let totalPago = document.getElementById("totalPago");
 let usuarios = document.getElementById("usuarios");
  var asiento = document.getElementById(id);

  if(asiento.classList.contains("seat-ocupado")){
    alert("Asiento ocupado");
  }else{
    if(asiento.classList.contains("seat")){
      asiento.classList.remove("seat");
      asiento.classList.add("seat-selected");
      asientos.push(id);
      precio.push(precioBoleto.innerHTML);
      asientosSelected.innerHTML = asientos;
      usuarios.innerHTML += `
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
      `
      console.log(precio);
      //sumar los precios
      let suma = 0;
      for (var i in precio) {
          suma += parseFloat(precio[i].replace("$", ""));
      }
      totalPago.innerHTML =suma;
    }else{
      if(asiento.classList.contains("seat-selected")){
        asiento.classList.remove("seat-selected");
        asiento.classList.add("seat");
        asientos.splice(asientos.indexOf(id), 1);
        precio.splice(precio.indexOf(precioBoleto.innerHTML), 1);
        asientosSelected.innerHTML = asientos;
        let pasajero = document.getElementById("pasajero"+id);
        pasajero.remove();
        console.log(precio);
        //sumar los precios
        let suma = 0;
        for (var i in precio) {
            suma += parseFloat(precio[i].replace("$", ""));
        }
        totalPago.innerHTML=suma;
      }
    }
  }
  
}

const infoAsiento = async () => {
  //obtener idRuta de localstorage
  let idRuta = localStorage.getItem("idRuta");
  //obtener datos de la ruta con el idRuta
  let res = await database.from("rutas").select("*").eq("id", idRuta);
  let destino = document.getElementById("destino");
  let bote_asignado = document.getElementById("bote_asignado");
  let fechaviaje = document.getElementById("fecha");
  let hora = document.getElementById("hora");
  let precio = document.getElementById("precioBoleto");
  localStorage.setItem("destino", res.data[0].destino);
  destino.innerHTML = res.data[0].destino;
  bote_asignado.innerHTML = res.data[0].bote_asignado;
  fechaviaje.innerHTML = localStorage.getItem("fechaViaje");
  hora.innerHTML = res.data[0].hora;
  precio.innerHTML = res.data[0].precio;

};
infoAsiento();

//funcion para buscar pasajero registradas
/*
let buscar = document.querySelector("#btnBuscar");
buscar.addEventListener("click", async (e) => {
  e.preventDefault();
  let dni = document.querySelector("#cedula").value;
  //buscar dni
  let res = await database.from("usuarios").select("*").eq("cedula", dni);
  console.log(res.data);
  if (res.data.length > 0) {
    document.querySelector("#nombre").value = res.data[0].nombres;
    document.querySelector("#apellido").value = res.data[0].apellidos;
    document.querySelector("#telefono").value = res.data[0].telefono;
  } else {
    alert("Usuario no registrado ❌");
  }
});*/

//funcion para guardar compra

const pagar = async () => {
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
    let idUsuario = "MCastillo"
    let bote_asignado = document.getElementById("bote_asignado").innerHTML;
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
    
    //guardar uno por uno
    for (var i = 0; i < cedulas.length; i++) {
      let compra = {
        cedula: cedula[i],
        nombre: nombre[i],
        apellido: apellido[i],
        asientosArray: asientosArray[i],
        fecha,
        destino,
        idUsuario,
        totalPago,
        bote_asignado,
        nombresyapellidos: nombresyapellidos[i],

      };
      //comprobar que no exista asientos con el mismo numero
      let res = await database.from("compras").select("*").eq("asientosArray", asientosArray[i]).eq("fecha", fecha).eq("destino", destino).eq("bote_asignado", bote_asignado);
      if (res.data.length > 0) {
        alert("El asiento " + asientosArray[i] + " ya esta ocupado ❌");
        //reload page
        location.reload();
      } else {
        let resp = await database.from("compras").insert([compra]);
        console.log(resp);
        if(resp.error){
          alert("Error al guardar la compra ❌");
        }else{
          alert("Compra realizada con exito ✔");
          //reload page
          location.reload();
        }
      }
    }
}
}




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
    $("#btnPagar").show();
  },
  onInvalid: function () {
    $("#result").html("identificación No válida ❌");
    //ocultar boton pagar
    $("#btnPagar").hide();
  },
});

const logout = document.querySelector(".logout");
logout.addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "https://eduardoguevarasw.github.io/sachawassi.github.io/";
})
