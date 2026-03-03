"use client";

import React from "react";
import { Share2, Copy, Facebook, Twitter } from "lucide-react";
import toast from "react-hot-toast";

const ShareExperience = ({ experience, className = "" }) => {
  if (!experience) return null;

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareText = `Check out "${experience.title}" on GoTrip!`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied to clipboard!");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const shareToFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(url, "_blank", "width=600,height=400");
  };

  const shareToTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, "_blank", "width=600,height=400");
  };

  const nativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: experience.title,
          text: shareText,
          url: shareUrl,
        });
      } catch {
        // User cancelled share
      }
    } else {
      copyToClipboard();
    }
  };

  return (
    <div className={`dropdown dropdown-end ${className}`}>
      <div tabIndex={0} role="button" className="btn btn-sm btn-ghost gap-2">
        <Share2 className="w-4 h-4" />
        Share
      </div>
      <ul tabIndex={0} className="dropdown-content menu bg-base-200 rounded-box z-10 w-52 p-2 shadow-lg">
        <li>
          <button onClick={copyToClipboard}>
            <Copy className="w-4 h-4" />
            Copy Link
          </button>
        </li>
        <li>
          <button onClick={shareToFacebook}>
            <Facebook className="w-4 h-4" />
            Facebook
          </button>
        </li>
        <li>
          <button onClick={shareToTwitter}>
            <Twitter className="w-4 h-4" />
            Twitter
          </button>
        </li>
        <li>
          <button onClick={nativeShare}>
            <Share2 className="w-4 h-4" />
            More Options
          </button>
        </li>
      </ul>
    </div>
  );
};

export default ShareExperience;
