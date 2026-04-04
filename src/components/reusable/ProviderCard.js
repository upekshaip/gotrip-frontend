"use client";

import React, { useEffect, useState } from "react";
import ProfileImage from "./ProfileImage";
import { Briefcase, Mail } from "lucide-react";
import UseFetch from "@/hooks/UseFetch";

const ProviderCard = ({ providerId }) => {
  const [providerData, setProviderData] = useState(null);
  const [fetchingProvider, setFetchingProvider] = useState(false);

  const fetchProviderDetails = async () => {
    setFetchingProvider(true);
    setProviderData(null);
    try {
      const data = await UseFetch("GET", `/user/admin/provider/${providerId}`);
      if (data && !data.timestamp) setProviderData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setFetchingProvider(false);
    }
  };

  useEffect(() => {
    if (providerId) fetchProviderDetails();
  }, [providerId]);

  return (
    <div className="p-3 bg-base-200/50 rounded-2xl mb-4 border border-base-300">
      <p className="text-[10px] font-bold opacity-50 uppercase mb-2 ml-1">
        Managed By
      </p>
      {fetchingProvider ? (
        <div className="flex items-center gap-3 animate-pulse">
          <div className="w-10 h-10 bg-base-300 rounded-full"></div>
          <div className="space-y-2 flex-1">
            <div className="h-3 w-24 bg-base-300 rounded"></div>
            <div className="h-2 w-full bg-base-300 rounded"></div>
          </div>
        </div>
      ) : providerData ? (
        <div className="flex items-center gap-3">
          <div className="w-10">
            <ProfileImage
              name={providerData.name || providerData.email}
              size={40}
            />
          </div>
          <div className="truncate">
            <div className="font-bold text-sm">{providerData.name}</div>
            <div className="text-[10px] opacity-60 flex items-center gap-2">
              <Mail size={10} /> {providerData.email} | <Briefcase size={10} />{" "}
              {providerData.serviceProviderProfile?.businessName ||
                "No Business"}
            </div>
          </div>
        </div>
      ) : (
        <p className="text-xs italic opacity-40">Loading provider...</p>
      )}
    </div>
  );
};

export default ProviderCard;
