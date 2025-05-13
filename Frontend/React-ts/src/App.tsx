import "./App.css";

function App() {
  return (
    <>
      <div className="formulario">
        <h1>Inicio de Sesión</h1>
        <form method="post">
          {/**Input del nombre del Usuario */}
          <div className="nombreUsuario">
            <input type="text" required></input>
            <label>Nombre de Usuario</label>
          </div>

          {/** Input de la contraseña*/}
          <div className="nombreUsuario">
            <input type="password" required></input>
            <label>Contraseña</label>
          </div>

          <div className="recordar">
            <a
              href="https://www.mayoclinic.org/es/diseases-conditions/amnesia/diagnosis-treatment/drc-20353366"
              target="_blank"
            >
              ¿Olvido su contraseña?
            </a>
          </div>
          {/** Boton Iniciar */}
          <input type="submit" value="Iniciar"></input>
        </form>
      </div>
    </>
  );
}

export default App;
