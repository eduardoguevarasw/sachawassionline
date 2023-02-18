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

  if (asiento.classList.contains("seat-ocupado")) {
    alert("Asiento ocupado");
  } else {
    if (asiento.classList.contains("seat")) {
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
      <h5 class="card-title">ASIENTO ${id}</h5>
      <div class="form-check form-check-inline">
      <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="option1">
      <label class="form-check-label" for="inlineRadio1">Cédula</label>
      </div>
      <div class="form-check form-check-inline">
      <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="option2">
      <label class="form-check-label" for="inlineRadio2">Pasaporte</label>
      </div>
      <br>
      <label>Indenficación</label>
      <input class="form-control" type="text" id="cedula" name="cedula" placeholder="Ej: 1500XXXXX" required/><br>
      <label>Nombre</label>
      <input type="text"  class="form-control" id="nombre" name="nombre" placeholder="Juan"><br>
      <label>Apellido</label>
      <input type="text" class="form-control" id="apellido" name="apellido" placeholder="Pérez"><br>
      </div>
      </div>
      </div>
      </div>
      `;
      console.log(precio);
      //sumar los precios
      let suma = 0;
      for (var i in precio) {
        suma += parseFloat(precio[i].replace("$", ""));
      }
      totalPago.innerHTML = suma;
    } else {
      if (asiento.classList.contains("seat-selected")) {
        asiento.classList.remove("seat-selected");
        asiento.classList.add("seat");
        asientos.splice(asientos.indexOf(id), 1);
        precio.splice(precio.indexOf(precioBoleto.innerHTML), 1);
        asientosSelected.innerHTML = asientos;
        let pasajero = document.getElementById("pasajero" + id);
        pasajero.remove();
        console.log(precio);
        //sumar los precios
        let suma = 0;
        for (var i in precio) {
          suma += parseFloat(precio[i].replace("$", ""));
        }
        totalPago.innerHTML = suma;
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
  let origen = document.getElementById("origen");
  let bote_asignado = document.getElementById("bote_asignado");
  let fechaviaje = document.getElementById("fecha");
  let hora = document.getElementById("hora");
  let precio = document.getElementById("precioBoleto");
  localStorage.setItem("destino", res.data[0].destino);
  localStorage.setItem("origen", res.data[0].origen);
  destino.innerHTML = res.data[0].destino;
  origen.innerHTML = res.data[0].origen;
  bote_asignado.innerHTML = res.data[0].bote_asignado;
  fechaviaje.innerHTML = localStorage.getItem("fechaViaje");
  hora.innerHTML = res.data[0].hora;
  precio.innerHTML = res.data[0].precio;
};
infoAsiento();

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
    
    //si el checkbox de cedula esta seleccionado
    if (document.getElementById("inlineRadio1").checked) {

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
            let destino = localStorage.getItem("destino");
            console.log(destino);
            let origen  = localStorage.getItem("origen");
            //buscar cedula del usuario en la base de datos
            let idUsuario = "MCastillo";
            let bote_asignado = document.getElementById("bote_asignado").innerHTML;
            let totalPago = document.getElementById("totalPago").innerHTML;
            let idRuta = localStorage.getItem("idRuta");
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
              destino,
              idUsuario,
              totalPago,
              bote_asignado,
              tx,
              idRuta,
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
        alert("La cedula:" + cedula + " tiene menos de 10 digitos")
        return false;
      }
    });
    //no continuar si hay cedulas invalidas
    //obtener los asientos seleccionados
    }else{
      let asiento = document.querySelectorAll(".seat-selected");
      console.log(asiento);
      let fecha = localStorage.getItem("fechaViaje");
      console.log(fecha);
      let destino = localStorage.getItem("destino");
      console.log(destino);
      let origen  = localStorage.getItem("origen");
      //buscar cedula del usuario en la base de datos
      let idUsuario = "MCastillo";
      let bote_asignado = document.getElementById("bote_asignado").innerHTML;
      let totalPago = document.getElementById("totalPago").innerHTML;
      let idRuta = localStorage.getItem("idRuta");
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
        destino,
        idUsuario,
        totalPago,
        bote_asignado,
        tx,
        idRuta,
      };
      localStorage.setItem("compra", JSON.stringify(compra));
      //comprobar que no exista asientos repetidos
      comprobar();

    }

    
  }

};

const comprobar = async () => {
  let compra = JSON.parse(localStorage.getItem("compra"));
  //buscar si en la base existe una compra con los mismos asientos
  let asientos = compra.asientosArray;
  let fecha = compra.fecha;
  let destino = compra.destino;
  let origen = compra.origen;
  let bote_asignado = compra.bote_asignado;
  //buscar en la base de datos
  let resp = await database
    .from("compras")
    .select("*")
    .eq("fecha", fecha)
    .eq("destino", destino)
    .eq("bote_asignado", bote_asignado);
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
    alert("El asiento: " + asientosRepetidos + " ya esta ocupado");
  } else {
    //guardar en la base de datos
    //generar un número de transacción de 12 digitos

    var datos = {
      cedula: compra.cedula,
      nombre: compra.nombre,
      apellido: compra.apellido,
      asientosArray: compra.asientosArray,
      nombresyapellidos: compra.nombresyapellidos,
      fecha: compra.fecha,
      destino: compra.destino,
      origen: compra.origen,
      idUsuario: compra.idUsuario,
      totalPago: compra.totalPago,
      bote_asignado: compra.bote_asignado,
      tx: compra.tx,
      idRuta: compra.idRuta
    };
    for (var i = 0; i < datos.cedula.length; i++) {
      //guardar en la base de datos uno por uno
      let resp = await database.from("compras").insert({
        cedula: datos.cedula[i],
        nombre: datos.nombre[i],
        apellido: datos.apellido[i],
        asientosArray: datos.asientosArray[i],
        nombresyapellidos: datos.nombresyapellidos[i],
        fecha: datos.fecha,
        destino: datos.destino,
        origen: datos.origen,
        idUsuario: datos.idUsuario,
        totalPago: datos.totalPago,
        bote_asignado: datos.bote_asignado,
        tx: datos.tx[i],
        idRuta: datos.idRuta
      });
    }
    //let resp = await database.from("compras").insert([compra]);
    console.log(resp);
    //mostar compra con éxitos
    alert("Venta realizada con éxito ✅");
    //generar pdf
    var ticket = new jsPDF("p", "cm", [7.5, 15]);
    //pdf de 7.5cm x 10cm
    ticket.setFontSize(17);
    //letra en negrita 
    ticket.setFont("helvetica", "bold");
    ticket.text(1, 1, "**********************");
    ticket.text(2, 1.5, "Sacha Wassi");
    //tamaño de letra 
    ticket.setFontSize(7);
    ticket.text(2, 2, "Cooperativa de Transporte Fluvial");
    ticket.setFontSize(17);
    ticket.text(1, 2.5, "**********************");
    ticket.setFontSize(9);
    ticket.text(1, 3, "C.I/Pasaporte: " + compra.cedula);
    ticket.text(1, 3.5, "Nombres: " + compra.nombresyapellidos);
    ticket.text(1, 4, "Fecha de Salida: " + compra.fecha);
    ticket.setFontSize(9);
    ticket.text(1, 4.5, "Destino: " + compra.destino);
    ticket.text(1, 5, "No de Asiento: " + compra.asientosArray);
    ticket.text(1, 5.5, "Embarcación:"+compra.bote_asignado);
    ticket.setFontSize(20);
    ticket.text(1, 7, "Total:$ " + compra.totalPago);
    ticket.setFontSize(9);
    ticket.text(1, 8, "Atendido por: " + compra.idUsuario);
    let fecha = new Date();
    //formato de fecha dd/mm/aaaa
    let dia = fecha.getDate();
    let mes = fecha.getMonth() + 1;
    let anio = fecha.getFullYear();
    let fechaActual = dia + "/" + mes + "/" + anio;
    ticket.text(1, 8.5, "Fecha de Emisión: " + fechaActual);
    ticket.text(1, 9, "Gracias por su compra");
    ticket.text(1, 9.5, "Transacción: " + compra.tx[0]);
    ticket.setFontSize(9);
    ticket.text(1.3, 10, "Ahora puedes comprar en línea:");
    ticket.text(2, 10.5, "www.sachawassi.com");
    ticket.save("ticket.pdf");

    //espera 3 segundos y recarga la página
    setTimeout(function () {
      location.reload();
    }, 3000);
  }
};

(function () {
  var __bind = function (fn, me) {
    return function () {
      return fn.apply(me, arguments);
    };
  };

  (function ($) {
    var RucValidatorEc, jQueryRucValidatorEc;
    RucValidatorEc = (function () {
      function RucValidatorEc(numero) {
        this.numero = numero;
        this.numero = this.numero.toString();
        this.valid = false;
        this.codigo_provincia = null;
        this.tipo_de_cedula = null;
        this.already_validated = false;
      }

      RucValidatorEc.prototype.validate = function () {
        var digito_verificador,
          i,
          modulo,
          multiplicadores,
          p,
          producto,
          productos,
          provincias,
          residuo,
          suma,
          tercer_digito,
          verificador,
          _i,
          _j,
          _k,
          _l,
          _len,
          _len1,
          _ref,
          _ref1;
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
            throw new Error(
              "RUC de empresa del sector público debe terminar en 0001"
            );
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

      RucValidatorEc.prototype.isValid = function () {
        if (!this.already_validated) {
          this.validate();
        }
        return this.valid;
      };

      return RucValidatorEc;
    })();
    jQueryRucValidatorEc = (function () {
      function jQueryRucValidatorEc($node, options) {
        this.$node = $node;
        this.options = options;
        this.validateContent = __bind(this.validateContent, this);
        this.options = $.extend(
          {},
          $.fn.validarCedulaEC.defaults,
          this.options
        );
        this.$node.on(this.options.events, this.validateContent);
      }

      jQueryRucValidatorEc.prototype.validateContent = function () {
        var check, error, numero_de_cedula, _ref;
        numero_de_cedula = this.$node.val().toString();
        check = this.options.strict;
        if (
          !check &&
          ((_ref = numero_de_cedula.length) === 10 || _ref === 13)
        ) {
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
    $.fn.validarCedulaEC = function (options) {
      this.each(function () {
        return new jQueryRucValidatorEc($(this), options);
      });
      return this;
    };
    $.fn.validarCedulaEC.RucValidatorEc = RucValidatorEc;
    return ($.fn.validarCedulaEC.defaults = {
      strict: true,
      events: "change",
      the_classes: "invalid",
      onValid: function () {
        return null;
      },
      onInvalid: function () {
        return null;
      },
    });
  })(jQuery);
}.call(this));

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
  window.location.href = "https://eduardoguevarasw.github.io/sachawassi/";
});
