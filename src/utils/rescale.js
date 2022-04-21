const rescale = (
    x,
    oldMin,
    oldMax,
    newMin,
    newMax
  ) => {
    return ((newMax - newMin) / (oldMax - oldMin)) * (x - oldMin) + newMin;
  };
  
  
  export default rescale;