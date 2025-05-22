import { useState } from "react";
import "./Login.css";
import axios from "axios";
// import Input from "../../../shared/components/input/Input";

function Login() {
  const [formData, setFormData] = useState({
    nombreUsuario: "",
    contrasena: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("Iniciando sesión...");

    try {
      const response = await axios.post(
        "http://localhost:5187/api/Auth/Login",
        formData
      );
      console.log("Token recibido:", response.data.token);
      setMessage("Login Exitoso");
      // Aquí se puede guardar el token si querés: localStorage.setItem("token", response.data.token)
    } catch (error) {
      console.error(error);
      setMessage("Error al iniciar sesión");
    }
  };

  return (
    <>
      {/* <Input label="Mondongo" backgroundColor="red" />; */}
      <div className="formulario">
        <h1>Inicio de Sesión</h1>
        <form method="post" onSubmit={handleSubmit}>
          {/**Input del nombre del Usuario */}
          <div className="nombreUsuario">
            <input
              name="nombreUsuario"
              type="text"
              required
              onChange={handleChange}
              value={formData.nombreUsuario}
            ></input>
            <label>Nombre de Usuario</label>
          </div>

          {/** Input de la contraseña*/}
          <div className="nombreUsuario">
            <input
              name="contrasena"
              type="password"
              required
              onChange={handleChange}
              value={formData.contrasena}
            ></input>
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
          <div className="flexdiv">
            <a className="message-align">{message}</a>
          </div>
        </form>
      </div>
    </>
  );
}

export default Login;
