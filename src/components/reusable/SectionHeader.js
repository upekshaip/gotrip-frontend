import React from "react";

const SectionHeader = ({ icon, title }) => {
  return (
    <>
      <div className="flex items-center mb-2 gap-2">
        {icon}
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
    </>
  );
};

export default SectionHeader;
