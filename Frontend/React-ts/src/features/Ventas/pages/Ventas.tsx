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

function Ventas() {
  return (
    <div>
      <TablaVentas />
      <TablaFiltroProductos />
    </div>
  );
}

export default Ventas;
