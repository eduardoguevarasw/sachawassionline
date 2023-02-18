const key = 
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdmdmxqendwemljd3lucW1pcnVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Njc2NTU5NjcsImV4cCI6MTk4MzIzMTk2N30.Jj6AQlRlabhEBppjaP9Bw0kBa77HHOBTTLNsy5cv2EY";
const url = "https://gfvljzwpzicwynqmirui.supabase.co";
const database = supabase.createClient(url, key);

document.getElementById("miperfil").style.display = "none";

//si sesion es true mostrar el boton de cerrar sesion
if (localStorage.getItem("sesion") == "true") {
    document.getElementById("sesion").style.display = "none";
    document.getElementById("miperfil").style.display = "block";
} 

//traer los datos de ciudades y mostrar en select
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

const minValue = new Date();
minValue.setDate(minValue.getDate());
document.getElementById('fecha').min = minValue.toISOString().split("T")[0];
//controlar la fecha minima
const fecha = document.getElementById("fecha");
fecha.addEventListener("change", function(){
    const fechaMax = new Date();
    fechaMax.setDate(fechaMax.getDate() + 90);
    console.log(fechaMax.toISOString().split("T")[0]);
    if(fecha.value > fechaMax.toISOString().split("T")[0]){
        alert("La fecha maxima es " + fechaMax.toISOString().split("T")[0]);
        fecha.value = "";
    }
});


function buscarRutas() {
    document.getElementById("infoBotes").innerHTML = "";
    const origen = document.getElementById("origen").value;
    const destino = document.getElementById("destino").value;
    const fecha = document.getElementById("fecha").value;
    const fechaFormateada2 = fecha.split("-").reverse().join("-");

    //bajar a #busqueda 
    document.getElementById("busqueda").scrollIntoView();
    //convertir fecha en día de la semana
    const fechaConvertida = new Date(fecha);
    const diaSemana = fechaConvertida.getDay();
    const dias = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"];
    const dia = dias[diaSemana]; //dia en letras
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
        //formato dd-mm-aaaa
        let fechaFormateada = fechaActual.getDate() + "-" + (fechaActual.getMonth() + 1) + "-" + fechaActual.getFullYear();
        if(fechaActual.getMonth() + 1 < 10){
            fechaFormateada = fechaActual.getDate() + "-0" + (fechaActual.getMonth() + 1) + "-" + fechaActual.getFullYear();
        }


        
       database.from('rutas').select().then(({ data, error }) => {
            document.getElementById("boteList").innerHTML = `<h4>${origen} ➡️ ${destino}   |  ${dia} </h4>`;
            option = "";
            for (var i = 0; i < data.length; i++) {
                if(fechaFormateada == fechaFormateada2 && horaFormateada > data[i].hora){
                    document.getElementById("boteList").innerHTML = `
                    <h4>Lo sentimos,ruta fuera de horario ❌ </h4>
                    <h4>🕙 ${data[i].hora} </h4>`
                }else{
                    if (data[i].origen == origen && data[i].destino == destino && data[i].dias_disponible.includes(dia) && data[i].estado == "disponible") {
                    
                        //contar todos los asientos registrados en la tabla botes
                        

                        console.log("si");
                        option += `
                        <tr>
                        <td><h3>🛥️ ${data[i].bote_asignado}</h3></th>
                        <td><h3>🕙 ${data[i].hora}</h3></td>
                        <td><h3>$${data[i].precio} USD</h3></td>
                        <td><button class="btn btn-success btn-lg" onclick="procesoCompra(${data[i].id})">☞ Escoger</button></td>
                        </tr>`;
                    }
                }
                
            }
            document.getElementById("infoBotes").innerHTML += option;
        })
        
        
    }
}

function procesoCompra(id) {
    let fechaViaje = document.getElementById("fecha").value;
    //dar formato a la fecha 01 a 1 
    /*let fecha = fechaViaje.split("-");
    let dia = fecha[2];
    let mes = fecha[1];
    let anio = fecha[0];
    if (dia < 10) {
        dia = dia.replace("0", "");
    }
    if (mes < 10) {
        mes = mes.replace("0", "");
    }
    let fechaFormateada = dia + "/" + mes + "/" + anio;*/
    localStorage.setItem("fechaViaje", fechaViaje);
    localStorage.setItem("idRuta", id);
    //comprobar si hay usuario logueado
    if (localStorage.getItem("cedula") == null) {
        window.location.href = "./login.html";
    }else{
        window.location.href = "./public/client/index.html";
    }
}

 