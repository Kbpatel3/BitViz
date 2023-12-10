/**
 * Layout.js
 *
 * This module defines a simple layout component for a React application. The component
 * acts as a container for rendering the content of the current route using the
 * React Router's `Outlet` component.
 *
 * @module Layout
 * @author Kellan Anderson
 * @author Aidan Kirk
 * @author Kaushal Patel
 * @author Noah Hassett
 */

import React from "react";
import { Outlet } from "react-router-dom";

/**
 * The `Layout` component is a functional component that serves as a container for the
 * content of the current route. It renders the `Outlet` component from React Router,
 * allowing child components associated with the current route to be rendered within
 * this layout.
 *
 * @returns {JSX.Element} - The JSX element representing the layout container.
 */
const Layout = () => {
  return (
    <>
      <Outlet />
    </>
  );
};

// Export the `Layout` component as the default export of this module
export default Layout;
