import React from "react";

const Loader = () => {
  return (
    <div className="flex justify-center items-center h-screen w-screen">
      <div className="h-14 w-14 border border-solid border-primary animate-spin rounded-full border-t-transparent"></div>
    </div>
  );
};

export default Loader;
