/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
"use client";

import { normalizeSriLankaTime } from "@/function/normalize";
import UseFetch from "@/hooks/UseFetch";
import React, { useEffect, useState, useRef, useCallback } from "react";
import toast from "react-hot-toast";
import {
  User,
  Mail,
  Phone,
  Calendar,
  ShieldCheck,
  ShieldAlert,
  UserCheck,
  Settings2,
  X,
  Save,
  UserCircle,
  Shield,
} from "lucide-react";
import clsx from "clsx";
import ProfileImage from "@/components/reusable/ProfileImage";

const AllTravellersPage = () => {
  const [loading, setLoading] = useState(false);
  const [travellers, setTravellers] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // 🔹 State for User Profile Editing
  const [selectedUser, setSelectedUser] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    phone: "",
    dob: "",
    gender: "",
  });

  // 🔹 State for Role Editing
  const [roleTargetUser, setRoleTargetUser] = useState(null);
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");

  const observer = useRef();

  const fetchTravellers = async (isFirstLoad = false, nextPage = 1) => {
    if (loading) return;
    setLoading(true);

    const currentPage = isFirstLoad ? 1 : nextPage;
    const params = new URLSearchParams();
    params.append("page", currentPage.toString());
    params.append("limit", "10");

    try {
      const data = await UseFetch(
        "GET",
        `/user/admin/all-travellers?${params.toString()}`,
      );

      if (data && !data.timestamp) {
        const newContent = data.content || [];

        setTravellers((prev) => {
          if (isFirstLoad) return newContent;
          const existingIds = new Set(prev.map((u) => u.userId));
          const uniqueNewContent = newContent.filter(
            (u) => !existingIds.has(u.userId),
          );
          return [...prev, ...uniqueNewContent];
        });

        setHasMore(!data.last);
      } else {
        toast.error("Failed to fetch traveller data.");
      }
    } catch (error) {
      toast.error("Error connecting to user service.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setTravellers([]);
    setPage(1);
    setHasMore(true);
    fetchTravellers(true);
  }, []);

  const lastElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(async (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          const nextPage = page + 1;
          setPage(nextPage);
          await fetchTravellers(false, nextPage);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore, page, fetchTravellers],
  );

  // 🔹 Handle Profile Update
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;
    setIsUpdating(true);

    try {
      const payload = {
        userId: selectedUser.userId,
        name: editForm.name,
        phone: editForm.phone,
        dob: editForm.dob,
        gender: editForm.gender,
      };

      const res = await UseFetch("PATCH", "/user/admin/edit-user", payload);

      if (res && !res.timestamp && !res.error) {
        toast.success(`Profile updated successfully.`);
        setTravellers((prev) =>
          prev.map((u) =>
            u.userId === selectedUser.userId ? { ...u, ...editForm } : u,
          ),
        );
        setSelectedUser(null);
      } else {
        toast.error("Failed to update user profile.");
      }
    } catch (err) {
      toast.error("An error occurred during update.");
    } finally {
      setIsUpdating(false);
    }
  };

  // 🔹 Handle Role Update
  const handleUpdateRole = async (e) => {
    e.preventDefault();
    if (!roleTargetUser || !selectedRole) return;
    setIsUpdatingRole(true);

    try {
      const payload = {
        userId: roleTargetUser.userId,
        role: selectedRole,
      };

      const res = await UseFetch(
        "PATCH",
        "/user/admin/edit-user-role",
        payload,
      );

      if (res && !res.timestamp && !res.error) {
        toast.success(`Role changed to ${selectedRole}.`);

        // Update local state based on your profile rules
        const isAdmin = selectedRole === "ADMIN";
        const isSP = selectedRole === "SERVICE_PROVIDER" || isAdmin;
        const isTraveller = true; // Always true per your rules

        setTravellers((prev) =>
          prev.map((u) =>
            u.userId === roleTargetUser.userId
              ? {
                  ...u,
                  admin: isAdmin,
                  serviceProvider: isSP,
                  traveller: isTraveller,
                }
              : u,
          ),
        );
        setRoleTargetUser(null);
      } else {
        toast.error("Failed to update user role.");
      }
    } catch (err) {
      toast.error("An error occurred during role update.");
    } finally {
      setIsUpdatingRole(false);
    }
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setEditForm({
      name: user.name || "",
      phone: user.phone || "",
      dob: user.dob || "",
      gender: user.gender || "",
    });
  };

  const openRoleModal = (user) => {
    setRoleTargetUser(user);
    // Determine current primary role for default value
    if (user.admin) setSelectedRole("ADMIN");
    else if (user.serviceProvider) setSelectedRole("SERVICE_PROVIDER");
    else setSelectedRole("TRAVELLER");
  };

  return (
    <section className="section-container">
      <div className="flex flex-col">
        {/* Header */}
        <div className="sticky top-0 p-4 bg-base-100 border-b border-base-200 z-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h1 className="text-xl font-bold flex items-center gap-2">
              <UserCheck className="text-primary" /> Traveller Management
            </h1>
            <div className="badge badge-outline gap-2 p-3">
              Total Elements: {travellers.length} Loaded
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-base-100">
          <table className="table table-zebra w-full text-left">
            <thead className="bg-base-200">
              <tr>
                <th>User Details</th>
                <th>Contact Info</th>
                <th>Roles</th>
                <th>Demographics</th>
                <th>Joined Date</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {travellers.map((user, index) => (
                <tr key={`${user.userId}-${index}`}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar placeholder">
                        <div className="bg-neutral text-neutral-content rounded-full w-10">
                          <ProfileImage
                            name={user.name || user.email}
                            size={40}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="font-bold flex items-center gap-2">
                          {user.name || "Unnamed User"}
                        </div>
                        <div className="text-[10px] opacity-50 flex items-center gap-1">
                          <Mail size={12} /> {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="flex flex-col text-xs gap-1">
                      <span className="opacity-60 flex items-center gap-1">
                        <Phone className="w-3 h-3" /> {user.phone || "No Phone"}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="flex flex-wrap gap-1">
                      {user.admin && (
                        <span className="badge badge-error badge-xs font-bold text-[10px] gap-1 px-2">
                          <ShieldAlert size={10} /> ADMIN
                        </span>
                      )}
                      {user.serviceProvider && (
                        <span className="badge badge-primary badge-xs font-bold text-[10px] gap-1 px-2">
                          <ShieldCheck size={10} /> PROVIDER
                        </span>
                      )}
                      {user.traveller && (
                        <span className="badge badge-success badge-xs font-bold text-[10px] gap-1 px-2">
                          <User size={10} /> TRAVELLER
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="flex flex-col text-[11px]">
                      <span className="font-medium">
                        {user.gender === "m"
                          ? "Male"
                          : user.gender === "f"
                            ? "Female"
                            : "Not Specified"}
                      </span>
                      <span className="opacity-50 flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {user.dob || "N/A"}
                      </span>
                    </div>
                  </td>
                  <td className="text-xs">
                    {normalizeSriLankaTime(user.createdAt)}
                  </td>
                  <td className="text-right">
                    <div className="flex justify-end gap-1">
                      <button
                        title="Edit Roles"
                        className="btn btn-ghost btn-xs text-secondary hover:bg-secondary/10"
                        onClick={() => openRoleModal(user)}
                      >
                        <Shield size={16} />
                      </button>
                      <button
                        title="Edit Profile"
                        className="btn btn-ghost btn-xs text-primary hover:bg-primary/10"
                        onClick={() => openEditModal(user)}
                      >
                        <Settings2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div
            ref={lastElementRef}
            className="py-12 flex flex-col items-center justify-center min-h-[100px]"
          >
            {loading ? (
              <span className="loading loading-dots loading-md text-primary"></span>
            ) : (
              !hasMore &&
              travellers.length > 0 && (
                <div className="flex flex-col items-center opacity-20 mt-4">
                  <div className="h-px w-20 bg-base-content mb-4"></div>
                  <p className="text-[10px] font-black uppercase tracking-[0.5em]">
                    Fin.
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* 🔹 MODAL 1: USER PROFILE EDITOR */}
      <div className={clsx("modal", selectedUser && "modal-open")}>
        <div className="modal-box max-w-md">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <UserCircle size={20} className="text-primary" /> Edit User
              Profile
            </h3>
            <button
              onClick={() => setSelectedUser(null)}
              className="btn btn-sm btn-circle btn-ghost"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleUpdateUser} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text text-xs font-bold uppercase opacity-50">
                  Full Name
                </span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full"
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({ ...editForm, name: e.target.value })
                }
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text text-xs font-bold uppercase opacity-50">
                  Phone Number
                </span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full"
                value={editForm.phone}
                onChange={(e) =>
                  setEditForm({ ...editForm, phone: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-xs font-bold uppercase opacity-50">
                    Date of Birth
                  </span>
                </label>
                <input
                  type="date"
                  className="input input-bordered w-full"
                  value={editForm.dob}
                  onChange={(e) =>
                    setEditForm({ ...editForm, dob: e.target.value })
                  }
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-xs font-bold uppercase opacity-50">
                    Gender
                  </span>
                </label>
                <select
                  className="select select-bordered w-full"
                  value={editForm.gender}
                  onChange={(e) =>
                    setEditForm({ ...editForm, gender: e.target.value })
                  }
                >
                  <option value="">Not Specified</option>
                  <option value="m">Male</option>
                  <option value="f">Female</option>
                </select>
              </div>
            </div>
            <div className="modal-action pt-4">
              <button
                type="submit"
                className="btn btn-primary btn-block rounded-xl"
                disabled={isUpdating}
              >
                {!isUpdating && <Save size={18} className="mr-2" />}{" "}
                {isUpdating ? "Saving..." : "Update Profile"}
              </button>
            </div>
          </form>
        </div>
        <div
          className="modal-backdrop"
          onClick={() => !isUpdating && setSelectedUser(null)}
        ></div>
      </div>

      {/* 🔹 MODAL 2: USER ROLE EDITOR */}
      <div className={clsx("modal", roleTargetUser && "modal-open")}>
        <div className="modal-box max-w-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Shield size={20} className="text-secondary" /> Update User Role
            </h3>
            <button
              onClick={() => setRoleTargetUser(null)}
              className="btn btn-sm btn-circle btn-ghost"
            >
              <X size={18} />
            </button>
          </div>

          <div className="p-4 bg-base-200/50 rounded-2xl flex items-center gap-3 mb-6">
            <div className="w-10">
              <ProfileImage
                name={roleTargetUser?.name || roleTargetUser?.email}
                size={40}
              />
            </div>
            <div className="truncate">
              <p className="font-bold text-sm truncate">
                {roleTargetUser?.name || "User"}
              </p>
              <p className="text-[10px] opacity-50 truncate">
                {roleTargetUser?.email}
              </p>
            </div>
          </div>

          <form onSubmit={handleUpdateRole} className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text text-xs font-bold uppercase opacity-50">
                  Select Primary Role
                </span>
              </label>
              <select
                className="select select-bordered w-full font-bold"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                required
              >
                <option value="ADMIN">ADMIN</option>
                <option value="SERVICE_PROVIDER">SERVICE PROVIDER</option>
                <option value="TRAVELLER">TRAVELLER</option>
              </select>
              <div className="mt-2 p-2 bg-info/10 rounded-lg">
                <p className="text-[10px] leading-tight">
                  Note: Role changes automatically adjust profile access levels
                  (e.g., Admins gain all profile types).
                </p>
              </div>
            </div>

            <div className="modal-action">
              <button
                type="submit"
                className="btn btn-secondary btn-block rounded-xl"
                disabled={isUpdatingRole}
              >
                {!isUpdatingRole && <Save size={18} className="mr-2" />}
                {isUpdatingRole ? "Updating..." : "Update Role"}
              </button>
            </div>
          </form>
        </div>
        <div
          className="modal-backdrop"
          onClick={() => !isUpdatingRole && setRoleTargetUser(null)}
        ></div>
      </div>
    </section>
  );
};

export default AllTravellersPage;
