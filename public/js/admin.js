const key ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdmdmxqendwemljd3lucW1pcnVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Njc2NTU5NjcsImV4cCI6MTk4MzIzMTk2N30.Jj6AQlRlabhEBppjaP9Bw0kBa77HHOBTTLNsy5cv2EY";
const url = "https://gfvljzwpzicwynqmirui.supabase.co";
const database = supabase.createClient(url, key);
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

//cerrar sesion si hizo click 
const logout = document.querySelector(".logout");
logout.addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "https://eduardoguevarasw.github.io/sachawassi/";
})

//obtener datos de la base de datos para el select
const origen = document.getElementById("origen");
const destino = document.getElementById("destino");
function getDestinos(){
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

    database.from('rutas').select("origen").then(({ data, error }) => {
        //guara los destinos en un array para no repetir
        let origenes = [];
        if (error) {
            console.log('error', error)
        }else{
            for (let i = 0; i < data.length; i++) {
                origenes.push(data[i].origen);
            }
            //eliminar los destinos repetidos
            let origenesUnicos = [...new Set(origenes)];
            console.log(origenesUnicos);
            let origen = document.getElementById("origen");
            for (let i = 0; i < origenesUnicos.length; i++) {
                origen.innerHTML += `<option value="${origenesUnicos[i]}">${origenesUnicos[i]}</option>`;
            }
        }
    })

}
getDestinos();


const boletos = document.getElementById("boletosvendidos");
function boletosvendidos (){
    database
    .from("compras")
    .select("*")
    .then((response) => {
        console.log("data", response.data);
        boletos.innerHTML = response.data.length;
    })
    .catch((error) => {
        console.log("error", error);
    });
}
boletosvendidos();

const clientes = document.getElementById("clientes");
function clientesregistrados (){
    database
    .from("clientes")
    .select("*")
    .then((response) => {
        console.log("data", response.data);
        clientes.innerHTML = response.data.length;
    })
    .catch((error) => {
        console.log("error", error);
    });
}
clientesregistrados();

//ganacias 
const ventas = document.getElementById("ganancias");
function ganancias (){
    database
    .from("compras")
    .select("*")
    .then((response) => {
        console.log("data", response.data);
        let total = 0;
        response.data.forEach((item) => {
            //convertir a numero item.totalPago y sumar a total
            total += Number(item.totalPago);
        });
        //convertir el total a formato de moneda USD
        total = total.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
        });
        ventas.innerHTML = total;
        //guardar en localstorage
        localStorage.setItem("ganancias", total);
    })
    .catch((error) => {
        console.log("error", error);
    });
}
ganancias();

//obtener fecha de inicio 
let datagrafica =[];


function reporteFechas(){
    //datagrafica = [];
    const fechaInicio = document.getElementById("fechaInicio");
    const fechaFin = document.getElementById("fechaFin");
    
    //console.log(fechaInicio.value);
    //console.log(fechaFin.value);
    let fechas_compras = [];
    database
    .from("compras")
    .select("*")
    .gte("fecha", fechaInicio.value)
    .lte("fecha", fechaFin.value)
    .then((response) => {
        //console.log("data", response.data);
        let total = 0;
        let contador = 0;
        //datagrafica = [];
        response.data.forEach((item) => {
            contador++;
            total += Number(item.totalPago);
           /// datagrafica.push({x: item.fecha, totalPago: item.totalPago});
            fechas_compras.push(item.fecha);
        });
        //convertir el total a formato de moneda USD
        total = total.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
        });
        
        //por cada fecha en fechas_compras sumar los totales
        let fechas = [...new Set(fechas_compras)];
        console.log(fechas);
        for (let i = 0; i < fechas.length; i++) {
            let totalFecha = 0;
            for (let j = 0; j < response.data.length; j++) {
                if (fechas[i] == response.data[j].fecha) {
                    totalFecha += Number(response.data[j].totalPago);
                }
            }
            datagrafica.push({x: fechas[i], totalPago: totalFecha});
        }
        console.log(datagrafica);

        

        ventas.innerHTML = total;
        boletos.innerHTML = contador;
        
        
    })    
    console.log(datagrafica); 
    console.log(destinos);
    //myChart.data.datasets[0].data = datagrafica;
    myChart.update();   
    //mygraf.update();
    
}

const ctx = document.getElementById('reportes').getContext('2d');
    const myChart = new Chart(ctx, {
        type: 'line',
        data: {

            datasets: [{
              label: 'ventas',
              data: datagrafica,
              parsing: {
                yAxisKey: 'totalPago'
              }
              
            },
            ]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
});



/*;*/

let destinos = [];

function reporteRuta(){

    const origen = document.getElementById("origen").value;
    const destino = document.getElementById("destino").value;
    console.log(origen);
    console.log(destino);
    //buscar las compras que coicidan con el origen y destino
    let destinos_compras = [];
    database
    .from("compras")
    .select("*")
    .eq("origen", origen)
    .eq("destino", destino)
    .then((response) => {
        console.log("data", response.data);
        let total = 0;
        let contador = 0;
        response.data.forEach((item) => {
            contador++;
            total += Number(item.totalPago);
            destinos_compras.push(item.destino);
        });
        //convertir el total a formato de moneda USD
        total = total.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
        });

        //por cada destino en destinos sumar los totales
        let llegadas = [...new Set(destinos_compras)];
        console.log(llegadas);
        for (let i = 0; i < llegadas.length; i++) {
            let totalLlegada = 0;
            for (let j = 0; j < response.data.length; j++) {
                if (llegadas[i] == response.data[j].destino) {
                    totalLlegada += Number(response.data[j].totalPago);
                }
            }
            destinos.push({x: llegadas[i], total: totalLlegada});
        }
        ventas.innerHTML = total;
        boletos.innerHTML = contador;
    })

    mygraf.update();
    console.log("destino");
    console.log(destinos);
}

const graf = document.getElementById('reportesRuta').getContext('2d');
    const mygraf = new Chart(graf, {
        type: 'bar',
        data: {

            datasets: [{
              label: 'Ventas',
              data: destinos,
              parsing: {
                yAxisKey: 'total'
              }
              
            },
            ]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
})

let vector1=[];


function destinosComprados(){
    database
    .from("compras")
    .select("*")
    .then((response) => {
        let contador = 0;
        let vector2 = [];
        response.data.forEach((item) => {
            contador++;
            vector2.push(item.destino);
        });

        let llegadas = [...new Set(vector2)];
        console.log(llegadas);
        for (let i = 0; i < llegadas.length; i++) {
            let totalLlegada = 0;
            for (let j = 0; j < response.data.length; j++) {
                if (llegadas[i] == response.data[j].destino) {
                    totalLlegada++;
                }
            }
            vector1.push({x: llegadas[i], total: totalLlegada});
            console.log(vector1);
        }
        
    })
    mydestin.update();
    console.log("Destinos");
    console.log(vector1);
}


const destin = document.getElementById('reportesDestino').getContext('2d');
    const mydestin = new Chart(destin, {
        type: 'bar',
        data: {
            datasets: [{
                label: 'Destinos',
                data: vector1,
                parsing: {
                    yAxisKey: 'total'
                }
            }]
            
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });


