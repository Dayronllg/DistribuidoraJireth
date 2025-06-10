// import React from "react";

// function AdminVentas() {
//   return <div>AdminVentas</div>;
// }

// export default AdminVentas;

// export const Sales = () => {
//   return <div>Sales</div>;
// };

import TablaVentas from "../components/TablaVentas";
import TablaFiltroProductos from "../components/TablaFiltroProductos";
import Prueba from "../components/Prueba";

function GestionarVentas() {
  return (
    <div>
      <Prueba />
      <TablaVentas />
      <TablaFiltroProductos />
    </div>
  );
}

export default GestionarVentas;
