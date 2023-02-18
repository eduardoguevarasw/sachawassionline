const key =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdmdmxqendwemljd3lucW1pcnVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Njc2NTU5NjcsImV4cCI6MTk4MzIzMTk2N30.Jj6AQlRlabhEBppjaP9Bw0kBa77HHOBTTLNsy5cv2EY";
const url = "https://gfvljzwpzicwynqmirui.supabase.co";
const database = supabase.createClient(url, key);

//ocultar boton de paypal
document.getElementById("paypal-button-container").style.display = "none";
const listarTours = async () => {
  let tours = document.getElementById("tours");
  let { data, error } = await database.from("tour").select("*").eq("estado", "disponible")
  if (error) {
    console.log(error);
  }
  console.log(data);
  data.forEach((tour) => {
    tours.innerHTML += `
        <div class="col">
            <div class="card">
            <img src="${tour.foto}" class="card-img-top" alt="..." height="200">
            <div class="card-body">
                <input type="hidden" id="id" value="${tour.id}">
                <h5 class="card-title" id="nametour">${tour.nombre}</h5>
                <p class="card-text">${tour.descripcion}</p>
            </div>
            <ul class="list-group list-group-flush">
                <li class="list-group-item">Duración: ${tour.dias} días - ${tour.noches} noches</li>
                <li class="list-group-item">Precio : $${tour.precio} x PAX</li>
                <li class="list-group-item">
                Incluye:
                    <ul>Transporte</ul>
                    <ul>Guía</ul>
                    <ul>Comidas</ul>
                    <ul>Entradas</ul>
                </li>
                <li class="list-group-item">
                <button type="button" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#exampleModal" onclick="modal('${tour.nombre}','${tour.precio}')">
                    Reservar
                </button>
                </li>
            </ul>
            </div>
        </div>`;
  });
};
listarTours();

//restringir la fecha de checkin a partir de hoy
let today = new Date().toISOString().substr(0, 10);
document.querySelector("#fecha").value = today;
document.querySelector("#fecha").min = today;


function modal(nombreTour,precio) {
    //agregar datos al tour
    let nombre = document.getElementById("nombreTour");
    nombre.value = nombreTour;
    let price = document.getElementById("precio");
    price.value = precio;
}

function enviar() {

  const nombre = document.getElementById("nombre").value;
  const apellido = document.getElementById("apellido").value;
  const email = document.getElementById("email").value;
  const pais = document.getElementById("pais").value;
  const telefono = document.getElementById("telefono").value;
  const fecha = document.getElementById("fecha").value;
  const cantidad = document.getElementById("cantidad").value;
  const mensaje = document.getElementById("mensaje").value;
  const nombreTour = document.getElementById("nombreTour").value;

  // const cantidad = document.getElementById("cantidad").value;
  const precio = document.getElementById("precio").value;
  const total = cantidad * precio;
  //guardar total en localstorage
  sessionStorage.setItem("totalTour", total);

  let datos = {
    nombre: nombre,
    apellido: apellido,
    email: email,
    pais: pais,
    telefono: telefono,
    checkin: fecha,
    cantidad: cantidad,
    mensaje: mensaje,
    tour: nombreTour,
    total: total,
  }
    console.log(datos);
    //guardar en base de datos 
    database.from("reservas").insert(datos).then((res) => {
        //mostrar boton de paypal
        document.getElementById("paypal-button-container").style.display = "block";
        //ocultar boton de enviar
       document.querySelector("btn btn-primary").style.display = "none";
        
    } ); 
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
              value: sessionStorage.getItem("totalTour"),
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
         //generar pdf con los datos de la compra del tour
          generarPDF();
         
        
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

function eliminartx() {
    //obtener el id de la ultima reserva
    database.from("reservas").select("*").then((res) => {
        let id = res.data[res.data.length - 1].id;
        //eliminar la reserva
        database.from("reservas").delete().eq("id", id).then((res) => {
            console.log(res);
        });
    });
}    
  

function generarPDF(){
    //obtener el id de la ultima reserva
    database.from("reservas").select("*").then((res) => {
        let id = res.data[res.data.length - 1].id;
        //obtener los datos de la reserva
        database.from("reservas").select("*").eq("id", id).then((res) => {
            console.log(res.data[0]);
            let datos = res.data[0];
            //generar pdf
            var doc = new jsPDF({
              format: [80, 150]
            });
            //tamaño de la letra
            doc.setFontSize(30);
            //agregar texto con esas dimenciones
            doc.text(10, 10, "Sacha Wassi");
            doc.setFontSize(15);
            doc.text(10, 15, "Reserva de Tour");
            doc.setFontSize(10);
            doc.text(10, 20, "Nombre: " + datos.nombre);
            doc.text(10, 25, "Apellido: " + datos.apellido);
            doc.text(10, 30, "Correo: " + datos.email);
            doc.text(10, 35, "Pais: " + datos.pais);
            doc.text(10, 40, "Telefono: " + datos.telefono);
            doc.text(10, 45, "Fecha Salida: " + datos.checkin);
            doc.text(10, 50, "No Personas: " + datos.cantidad);
            //doc.text(10, 55, "Mensaje: " + datos.mensaje);
            doc.text(10, 55, "Tour: " + datos.tour);
            doc.text(10, 60, "Total a Pagar: " + datos.total);
            doc.save("reserva.pdf");
        });
    });
}