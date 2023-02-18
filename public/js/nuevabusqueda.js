const key =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdmdmxqendwemljd3lucW1pcnVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Njc2NTU5NjcsImV4cCI6MTk4MzIzMTk2N30.Jj6AQlRlabhEBppjaP9Bw0kBa77HHOBTTLNsy5cv2EY";
const url = "https://gfvljzwpzicwynqmirui.supabase.co";
const database = supabase.createClient(url, key);

const logout = document.querySelector("#logout");
logout.addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "https://eduardoguevarasw.github.io/sachawassi/";
})

const minValue = new Date();
minValue.setDate(minValue.getDate());
document.getElementById('fecha').min = minValue.toISOString().split("T")[0];

function traerCiudades() {
  database.from('rutas').select("origen").then(({ data, error }) => {
      //guara los destinos en un array para no repetir
      let ciudades = [];
      if (error) {
          console.log('error', error)
      }else{
          for (let i = 0; i < data.length; i++) {
              ciudades.push(data[i].origen);
          }
          //eliminar los destinos repetidos
          let ciudadesUnicas = [...new Set(ciudades)];
          console.log(ciudadesUnicas);
          let origen = document.getElementById("origen");
          for (let i = 0; i < ciudadesUnicas.length; i++) {
              origen.innerHTML += `<option value="${ciudadesUnicas[i]}">${ciudadesUnicas[i]}</option>`;
          }
      }
  })
  database.from('rutas').select("destino").then(({ data, error }) => {
      //guara los destinos en un array para no repetir
      let destinos = [];
      if (error) {
          console.log('error', error)
      }else{
          for (let i = 0; i < data.length; i++) {
              destinos.push(data[i].destino);
          }
          //eliminar los destinos repetidos
          let destinosUnicos = [...new Set(destinos)];
          console.log(destinosUnicos);
          let destino = document.getElementById("destino");
          for (let i = 0; i < destinosUnicos.length; i++) {
              destino.innerHTML += `<option value="${destinosUnicos[i]}">${destinosUnicos[i]}</option>`;
          }
      }
  })
}
traerCiudades();


function buscarRuta() {
  document.getElementById("botes_disponibles").innerHTML = "";
  const origen = document.getElementById("origen").value;
  const destino = document.getElementById("destino").value;
  const fecha = document.getElementById("fecha").value;
  console.log(origen, destino, fecha)
  //bajar a #busqueda 
  //document.getElementById("busqueda").scrollIntoView();
  //convertir fecha en día de la semana
  const fechaConvertida = new Date(fecha);
  const diaSemana = fechaConvertida.getDay();
  const dias = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"];
  const dia = dias[diaSemana]; //dia en letras
  console.log(dia);
  if (origen == destino) {
      alert("El origen y el destino no pueden ser iguales");
  } else {
      //obterner la hora actual
      let hora = new Date();
      let horaActual = hora.getHours();
      let minutos = hora.getMinutes();
      let segundos = hora.getSeconds();
      if(horaActual < 10){
          horaActual = "0" + horaActual;
          if(minutos < 10){
          minutos = "0" + minutos;
              if(segundos < 10){
                  segundos = "0" + segundos;
              }
          }
      }
      let horaFormateada = horaActual + ":" + minutos + ":" + segundos;
      //si la hora actual es menor a la hora de salida mostrar
      //fecha actual en formato dd/mm/aaaa
      let fechaActual = new Date();
      let diaActual = fechaActual.getDate();
      let mesActual = fechaActual.getMonth() + 1;
      let anioActual = fechaActual.getFullYear();
      let fechaFormateada = anioActual + "-" + mesActual + "-" + diaActual;
      //comparar fecha actual con fecha de viaje
      console.log(fechaFormateada);
      console.log(fecha);
      console.log(horaFormateada);
      
     database.from('rutas').select().then(({ data, error }) => {
          //document.getElementById("boteList").innerHTML = `<h4>${origen} ➡️ ${destino}   |  ${dia} </h4>`;
          option = "";
          for (var i = 0; i < data.length; i++) {
              if(fechaFormateada == fecha && horaFormateada > data[i].hora){
                  //document.getElementById("boteList").innerHTML = `<h4>Lo sentimos, no hay rutas disponibles para la fecha seleccionada</h4>`
              }else{
                  if (data[i].origen == origen && data[i].destino == destino && data[i].dias_disponible.includes(dia) && data[i].estado == "disponible") {
                  
                      console.log("si");
                      option += `
                      <tr>
                      <td><h5>🛥️ ${data[i].bote_asignado}</h5></th>
                      <td><h5>🕙 ${data[i].hora}</h5></td>
                      <td><h5>$${data[i].precio} USD</h5></td>
                      <td><button class="btn btn-success btn-lg" onclick="procesoCompra(${data[i].id})">☞ Escoger</button></td>
                      </tr>`;
                  }
              }
              
          }
          document.getElementById("botes_disponibles").innerHTML += option;
      })
  }
}

function procesoCompra(id) {
  //subir idRuta a localstorage
  localStorage.setItem("idRuta", id);
  //subir fecha a localstorage
  const fecha = document.getElementById("fecha").value;
  localStorage.setItem("fecha", fecha);
  //subir origen a localstorage
  const origen = document.getElementById("origen").value;
  localStorage.setItem("origen", origen);
  //subir destino a localstorage
  const destino = document.getElementById("destino").value;
  localStorage.setItem("destino", destino);
  //llevar a index.html
  window.location.href = "index.html";
}