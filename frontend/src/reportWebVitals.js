/**
 * reportWebVitals.js
 *
 * This module exports a function, `reportWebVitals`, that takes a callback function
 * (`onPerfEntry`) as its parameter. The purpose of this module is to report various
 * web vitals using the `web-vitals` library.
 *
 * @param {Function} onPerfEntry - A callback function that receives performance entries.
 *   This function will be called with web vitals data.
 */
const reportWebVitals = onPerfEntry => {
  // Check if the callback function is provided and is a function
  if (onPerfEntry && onPerfEntry instanceof Function) {
    // Dynamically import the 'web-vitals' library to avoid bundling it with the main app code
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      // Call the provided callback function with each web vital metric
      getCLS(onPerfEntry); // Cumulative Layout Shift
      getFID(onPerfEntry); // First Input Delay
      getFCP(onPerfEntry); // First Contentful Paint
      getLCP(onPerfEntry); // Largest Contentful Paint
      getTTFB(onPerfEntry); // Time to First Byte
    });
  }
};

// Export the `reportWebVitals` function as the default export of this module
export default reportWebVitals;
