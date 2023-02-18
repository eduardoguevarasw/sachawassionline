      const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdmdmxqendwemljd3lucW1pcnVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Njc2NTU5NjcsImV4cCI6MTk4MzIzMTk2N30.Jj6AQlRlabhEBppjaP9Bw0kBa77HHOBTTLNsy5cv2EY";
      const url = "https://gfvljzwpzicwynqmirui.supabase.co";
      const database = supabase.createClient(url, key);
      //obtener la cédula 
      const cedula = document.getElementById("cedula");
      const password = document.getElementById("password");
      const btnLogin = document.getElementById("btnLogin");
      //buscar el usuario en la base de datos
      btnLogin.addEventListener("click", async (e) => {
        e.preventDefault();
        //comprobar que los campos no estén vacíos
        if (cedula.value === "" || password.value === "") {
          alert("Por favor, llene todos los campos 💡");
        }else{
          //buscar el usuario en la base de datos
          const { data, error } = await database
            .from("usuarios")
            .select("*")
            .eq("cedula", cedula.value);
          //comprobar que el usuario exista
          if (data.length > 0) {
            //comprobar que la contraseña sea correcta
            if (data[0].password === password.value) {
              //comprobar que el usuario sea un administrador
              if (data[0].rol === "admin") {
                //redireccionar a la página de administrador
                window.location.href = "./public/admin/index.html";
              }else{
                //redireccionar a la página de vendedor
                window.location.href = "./public/vendor/index.html";
              }
            }else{
              alert("Contraseña incorrecta");
            }
          }else{
            alert("Usuario no encontrado");
          }
        }
      });
      

let regresar = document.getElementById("regresar");
    regresar.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = "./index.html";
    });