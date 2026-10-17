import React from "react";
import { Outlet } from "react-router-dom";

import "@shared/HotelServices/styles/index.scss";

const ProductsContainer = () => {
  return (
    <div className="services">
      <Outlet />
    </div>
  );
};

export default ProductsContainer;
