const key =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdmdmxqendwemljd3lucW1pcnVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Njc2NTU5NjcsImV4cCI6MTk4MzIzMTk2N30.Jj6AQlRlabhEBppjaP9Bw0kBa77HHOBTTLNsy5cv2EY";
const url = "https://gfvljzwpzicwynqmirui.supabase.co";
const database = supabase.createClient(url, key);

const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");

sign_up_btn.addEventListener("click", () => {
  container.classList.add("sign-up-mode");
});

sign_in_btn.addEventListener("click", () => {
  container.classList.remove("sign-up-mode");
});


//al hacer click en el boton de registrar usuario
document.getElementById("registrar").addEventListener(
  "click",
  function () {
    var result = document.getElementById("result");
    //verificar que todos los campos estén llenos
    if (
      document.getElementById("nombres").value == "" ||
      document.getElementById("apellidos").value == "" ||
      document.getElementById("identificacion").value == "" ||
      document.getElementById("correo").value == "" ||
      document.getElementById("contrasena1").value == ""
    ) {
      result.innerHTML = "Por favor llene todos los campos 💡";
      result.style.color = "red";
      return;
    }

    var nombre = document.getElementById("nombres").value;
    var apellido = document.getElementById("apellidos").value;
    //var cedula = document.getElementById("cedula").value;
    var correo = document.getElementById("correo").value;
    var contrasena = document.getElementById("contrasena1").value;
    var securepassword = btoa(contrasena);

    var pasaporte = document.getElementById("pasaporte").checked;
    var cedula = document.getElementById("cedula").checked;
    var identificacion = document.getElementById("identificacion").value;
    if (pasaporte) {
      //guardar en supabase
      var datos = {
        nombres: nombre,
        apellidos: apellido,
        cedula: identificacion,
        correo: correo,
        password: securepassword,
      };

      result.innerHTML = "Identificación Correcta ✅";
      result.style.color = "green";
    } else if (cedula) {
      var dni = identificacion;
      array = dni.split("");
      num = array.length;
      if (num == 10) {
        total = 0;
        digito = array[9] * 1;
        for (i = 0; i < num - 1; i++) {
          mult = 0;
          if (i % 2 != 0) {
            total = total + array[i] * 1;
          } else {
            mult = array[i] * 2;
            if (mult > 9) total = total + (mult - 9);
            else total = total + mult;
          }
        }
        decena = total / 10;
        decena = Math.floor(decena);
        decena = (decena + 1) * 10;
        final = decena - total;
        if ((final == 10 && digito == 0) || final == digito) {
          result.innerHTML = "Identificación Correcta ✅";
          result.style.color = "green";
          //guardar en supabase
          var datos = {
            nombres: nombre,
            apellidos: apellido,
            cedula: identificacion,
            correo: correo,
            password: securepassword,
          };
        }
      }
    }

    if (result.innerHTML == "Identificación Correcta ✅") {
      //buscar si ya existe el usuario
      database
        .from("clientes")
        .select("*")
        .eq("cedula", identificacion)
        .then(({ data, error }) => {
          console.log(data);
          console.log(error);
          if (data.length > 0) {
            result.innerHTML = "El usuario ya existe";
            result.style.color = "red";
            //esperar 1 segundo y recargar
            /*
            setTimeout(function(){
              window.location.reload();
            }, 1000);*/
          } else {
            //buscar el correo si existe
            database
              .from("clientes")
              .select("*")
              .eq("correo", correo)
              .then(({ data, error }) => {
                console.log(data);
                console.log(error);
                if (data.length > 0) {
                  result.innerHTML = "El correo ya existe";
                  result.style.color = "red";
                  //esperar 1 segundo y recargar
                  /*
                setTimeout(function(){
                  window.location.reload();
                }, 1000);*/
                } else {
                  //guardar correo en supabase con authentification
                  database
                    .from("clientes")
                    .insert([datos])
                    .then((response) => {
                      console.log(response);
                      result.innerHTML = "Usuario registrado ✅";
                      result.style.color = "green";
                      //esperar 5 segundos y redirigir
                      localStorage.setItem("cedula", identificacion);
                      localStorage.setItem("correo", correo);
                      let idRuta = localStorage.getItem("idRuta");
                      if (idRuta != null) {
                        setTimeout(function () {
                          localStorage.setItem("sesion", true);
                          window.location.href =
                            "https://eduardoguevarasw.github.io/sachawassi/public/client/index.html";
                        }, 5000);
                      } else {
                        localStorage.setItem("sesion", true);
                        window.location.href =
                          "https://eduardoguevarasw.github.io/sachawassi/public/client/nuevabusqueda.html";
                          
                      }
                      //redirigir a inicio de client
                    });
                }
              });
          }
        });
    } else {
      result.innerHTML = "Por favor verifique su Cédula";
      result.style.color = "red";
      //focus en el campo de cedula
      document.getElementById("cedula").focus();
    }
  },
  false
);

//iniciar sesión
document.getElementById("ingresar").addEventListener(
  "click",
  function () {
    var correo = document.getElementById("correologin").value;
    var contrasena = document.getElementById("contrasenalogin").value;
    var securepassword = btoa(contrasena);
    var result = document.getElementById("resultado");
    console.log(correo, securepassword);
    //login con los datos ingresados
    database
      .from("clientes")
      .select("*")
      .eq("correo", correo)
      .eq("password", securepassword)
      .then(({ data, error }) => {
        if (data.length == 0) {
          console.log(error);
          result.innerHTML = "Usuario o contraseña incorrectos";
          result.style.color = "red";
          //esperar 1 segundo y recargar
          setTimeout(function () {
            window.location.reload();
          }, 1000);
        } else {
          console.log(data);
          result.innerHTML = "Iniciando sesión...";
          result.style.color = "green";
          //guardar id del usuario en el local storage
          localStorage.setItem("cedula", data[0].cedula);
          //esperar 5 segundos y redirigir
          //guardar el correo
          localStorage.setItem("correo", correo);
          let idRuta = localStorage.getItem("idRuta");
          if (idRuta != null) {
            setTimeout(function () {
              localStorage.setItem("sesion", true);
              window.location.href =
                "https://eduardoguevarasw.github.io/sachawassi/public/client/index.html";
            }, 5000);
          } else {
            localStorage.setItem("sesion", true);
            window.location.href =
              "https://eduardoguevarasw.github.io/sachawassi/public/client/nuevabusqueda.html";
            
          }
        }
      });
  },
  false
);

/*
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
  },
  onInvalid: function () {
    $("#result").html("identificación No válida ❌");
  },
});*/
