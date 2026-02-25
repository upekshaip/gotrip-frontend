import Image from "next/image";
import React from "react";

const ProfileImage = ({ name, size = 40 }) => {
  return (
    <Image
      alt="User Avatar"
      className="w-full h-full object-cover rounded-full"
      src={`https://ui-avatars.com/api/?name=${name || "User"}&background=random&bold=true&format=png`}
      width={size}
      height={size}
    />
  );
};

export default ProfileImage;
