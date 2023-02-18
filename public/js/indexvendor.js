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
    })
    .catch((error) => {
        console.log("error", error);
    });
}
ganancias();

//cerrar sesion si hizo click 
const logout = document.querySelector(".logout");
logout.addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "https://eduardoguevarasw.github.io/sachawassi/";
})
