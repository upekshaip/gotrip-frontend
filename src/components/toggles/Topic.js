import React from "react";

const Topic = ({ Icon, title }) => {
  return (
    <div>
      <h3 className="text-lg font-black uppercase mb-4 flex items-center gap-2">
        <Icon size={18} className="text-primary" /> {title}
      </h3>
    </div>
  );
};

export default Topic;
