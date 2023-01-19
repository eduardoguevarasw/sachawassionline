const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdmdmxqendwemljd3lucW1pcnVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Njc2NTU5NjcsImV4cCI6MTk4MzIzMTk2N30.Jj6AQlRlabhEBppjaP9Bw0kBa77HHOBTTLNsy5cv2EY";
const url = "https://gfvljzwpzicwynqmirui.supabase.co";
const database = supabase.createClient(url, key);

//mostrar rutas y horarios de las rutas

function mostrarRutas() {
    database.from('rutas').select("*").then(({ data, error}) => {
        if (error) {
            console.log('error', error)
        }else{
            console.log(data);
            let horarios = document.getElementById("horarios");
            //mostrar en una tabla las rutas sin repetir 
            let rutas = [];
        
            for (let i = 0; i < data.length; i++) {
                if (!rutas.includes(data[i].bote_asignado)) {
                    rutas.push(data[i].bote_asignado, data[i].dias_disponible,data[i].hora, data[i].origen);
                }
            }
            console.log(rutas);
            //bucle para generar 0,1,2,3,4
            for (let i = 0; i < rutas.length; i+=4) {
                console.log(i);
                horarios.innerHTML += `
                    <tr>
                        <th>${rutas[i]}</th> 
                        <th>${rutas[i+1]}</th>
                        <th>${rutas[i+2]}</th>
                        <th>${rutas[i+3]}</th>
                    </tr>
                `
            }
        }
    })
}
mostrarRutas();