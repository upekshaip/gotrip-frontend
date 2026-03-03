"use client";
import React from "react";

const EmptyState = ({ icon: Icon, title, description, action = null }) => {
  return (
    <div className="text-center py-16">
      {Icon && (
        <Icon size={48} className="mx-auto text-base-content/20 mb-4" />
      )}
      <h3 className="text-lg font-medium">{title}</h3>
      {description && (
        <p className="text-sm text-base-content/50 mt-1">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};

export default EmptyState;
