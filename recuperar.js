const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdmdmxqendwemljd3lucW1pcnVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Njc2NTU5NjcsImV4cCI6MTk4MzIzMTk2N30.Jj6AQlRlabhEBppjaP9Bw0kBa77HHOBTTLNsy5cv2EY";
const url = "https://gfvljzwpzicwynqmirui.supabase.co";
const database = supabase.createClient(url, key);

const recuperar = async (req, res) => {
    //obtener el email del usuario
    let correo = document.getElementById("correo").value;
    //generar una contraseña de 8 caracteres
    let password1 = Math.random().toString(36).slice(-8);
    //utilizar btoa para encriptar la contraseña
    password = btoa(password1);
    //actualizar la contraseña del usuario

    let data = await database.from("clientes").select("*").eq("correo", correo);
    console.log(data);
    if (data) {
        let { error } = await database.from("clientes").update({ password: password }).eq("correo", correo);
        if (error) {
            console.log(error);
        } else {
            //enviar el correo
            let body =`<h1>Recuperación de contraseña</h1>
            <p>Se ha generado una nueva contraseña para tu cuenta</p>
            <p>Correo: ${correo}</p>
            <p>Contraseña: ${password1}</p>
            <p>Ingresa a la página para iniciar sesión</p>
            <a href="https://eduardoguevarasw.github.io/sachawassi/login.html">👉 SachaWassi</a>`;
            Email.send({
                SecureToken : "57189a0f-872e-468f-848a-fd3186d3e85d",
                To : correo,
                From : "andriuedg@gmail.com",
                Subject : "Reseteo Contraseña",
                Body : body
                }).then(
                  message => alert("Revise su correo electrónico ✅")
                  
                );
        }
    }

}



