const key ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdmdmxqendwemljd3lucW1pcnVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Njc2NTU5NjcsImV4cCI6MTk4MzIzMTk2N30.Jj6AQlRlabhEBppjaP9Bw0kBa77HHOBTTLNsy5cv2EY";
const url = "https://gfvljzwpzicwynqmirui.supabase.co";
const database = supabase.createClient(url, key);


const logout = document.querySelector(".logout");
logout.addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "https://eduardoguevarasw.github.io/sachawassionline/";
})


const body = document.querySelector("body"),
      modeToggle = body.querySelector(".mode-toggle");
      sidebar = body.querySelector("nav");
      sidebarToggle = body.querySelector(".sidebar-toggle");

let getMode = localStorage.getItem("mode");
if(getMode && getMode ==="dark"){
    body.classList.toggle("dark");
}

let getStatus = localStorage.getItem("status");
if(getStatus && getStatus ==="close"){
    sidebar.classList.toggle("close");
}

modeToggle.addEventListener("click", () =>{
    body.classList.toggle("dark");
    if(body.classList.contains("dark")){
        localStorage.setItem("mode", "dark");
    }else{
        localStorage.setItem("mode", "light");
    }
});

sidebarToggle.addEventListener("click", () => {
    sidebar.classList.toggle("close");
    if(sidebar.classList.contains("close")){
        localStorage.setItem("status", "close");
    }else{
        localStorage.setItem("status", "open");
    }
})


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



//funcion para mostrar los botes disponibles para la fecha actual
/*
async function mostrarbotes(){
 //obtener la fecha actual en formato lunes, martes, miercoles, etc
    let fecha = new Date();
    let dia = fecha.getDay();
    let diasemana = ["domingo", "lunes", "martes", "miercoles", "jueves", "viernes", "sabado"];
    let diaactual = diasemana[dia];
    //obtener la hora actual
    console.log(diaactual);
    let hora = fecha.getHours();
    let minutos = fecha.getMinutes();
    let segundos = fecha.getSeconds();
    if(hora < 10){
        hora = "0" + hora;
        if(minutos < 10){
            minutos = "0" + minutos;
            if(segundos < 10){
                segundos = "0" + segundos;
            }
        }
    }
    let horactual = hora + ":" + minutos+ ":" + segundos;
    let botes_disponibles = document.getElementById("botes_disponibles");
    //console.log(horactual)
    //buscar las rutas que incluyan el día actual 
    let res = await database.from("rutas").select("*");
    //iterar sobre las rutas
    let opcion = '';
    for(var i  in res.data){
        let dias = res.data[i].dias_disponible;
        let horario = res.data[i].hora;
        if(horactual > horario){
            console.log("no hay botes disponibles")
        }else{
            if(dias.includes(diaactual)){
                opcion+=`
               <tr>
                    <td>${res.data[i].bote_asignado}</td>
                    <td>${res.data[i].origen}</td>
                    <td>${res.data[i].destino}</td>
                    <td>${res.data[i].hora}</td>
                    <td>${res.data[i].precio}</td>
                    <td><button class="btnPagar" onclick=comprar(${res.data[i].id})>Ver más</button></td>
                </tr>
               `;
            }
        }
        
       
    }
    botes_disponibles.innerHTML = opcion;
}
mostrarbotes();*/

//funcion comprar
function comprar(id){
    localStorage.setItem("idruta", id);

    
    window.location.href = "ventas.html";
}

function procesoCompra(id) {
    let fechaViaje = document.getElementById("fecha").value;
    //dar formato a la fecha 01 a 1 
    let fecha = fechaViaje.split("-");
    let dia = fecha[2];
    let mes = fecha[1];
    let anio = fecha[0];
    if (dia < 10) {
        dia = dia.replace("0", "");
    }
    if (mes < 10) {
        mes = mes.replace("0", "");
    }
    let fechaFormateada = dia + "/" + mes + "/" + anio;
    localStorage.setItem("fechaViaje", fechaFormateada);
    localStorage.setItem("idRuta", id);
    window.location.href = "ventas.html";
}

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


