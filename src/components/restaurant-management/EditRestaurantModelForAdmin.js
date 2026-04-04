import React from "react";
import {
  X,
  Save,
  Settings2,
  CircleDollarSign,
  BadgePercent,
  Image as ImageIcon,
  MapPin,
} from "lucide-react";
import clsx from "clsx";
import MapSelector from "@/components/maps/MapSelector";
import ProviderCard from "../reusable/ProviderCard";

export const EditRestaurantModelForAdmin = ({
  restaurant,
  isOpen,
  onClose,
  isUpdating,
  onUpdate,
}) => {
  if (!restaurant) return null;

  const handleLocationChange = (coords) => {
    onUpdate({ ...restaurant, latitude: coords.lat, longitude: coords.lng }, false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(restaurant, true);
  };

  return (
    <div className={clsx("modal", isOpen && "modal-open")}>
      <div className="modal-box max-w-4xl rounded-3xl p-0 overflow-hidden">
        <div className="p-6 bg-base-100 h-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Settings2 size={20} className="text-primary" /> Edit Restaurant
              Details
            </h3>
            <button
              onClick={onClose}
              className="btn btn-sm btn-circle btn-ghost"
            >
              <X size={18} />
            </button>
          </div>

          <ProviderCard providerId={restaurant.providerId} />

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control col-span-2">
                <label className="label-text text-[10px] font-bold mb-1 opacity-50 uppercase">
                  Restaurant Name
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={restaurant.name || ""}
                  onChange={(e) =>
                    onUpdate({ ...restaurant, name: e.target.value }, false)
                  }
                  required
                />
              </div>
              <div className="form-control col-span-2">
                <label className="label-text text-[10px] font-bold mb-1 opacity-50 uppercase">
                  Description
                </label>
                <textarea
                  className="textarea textarea-bordered w-full h-20 text-sm"
                  value={restaurant.description || ""}
                  onChange={(e) =>
                    onUpdate({ ...restaurant, description: e.target.value }, false)
                  }
                />
              </div>
              <div className="form-control">
                <label className="label-text text-[10px] font-bold mb-1 opacity-50 uppercase">
                  Address
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={restaurant.address || ""}
                  onChange={(e) =>
                    onUpdate({ ...restaurant, address: e.target.value }, false)
                  }
                  required
                />
              </div>
              <div className="form-control">
                <label className="label-text text-[10px] font-bold mb-1 opacity-50 uppercase">
                  City
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={restaurant.city || ""}
                  onChange={(e) =>
                    onUpdate({ ...restaurant, city: e.target.value }, false)
                  }
                  required
                />
              </div>
              <div className="form-control">
                <label className="label-text text-[10px] font-bold mb-1 opacity-50 uppercase">
                  Price Unit
                </label>
                <select
                  className="select select-bordered w-full"
                  value={restaurant.priceUnit}
                  onChange={(e) =>
                    onUpdate({ ...restaurant, priceUnit: e.target.value }, false)
                  }
                >
                  <option value="PER_DAY">Per Day</option>
                  <option value="PER_HOUR">Per Hour</option>
                  <option value="PER_PERSON">Per Person</option>
                </select>
              </div>
              <div className="form-control">
                <label className="label-text text-[10px] font-bold mb-1 opacity-50 uppercase flex items-center gap-1">
                  <CircleDollarSign size={12} /> Price
                </label>
                <input
                  type="number"
                  className="input input-bordered w-full"
                  value={restaurant.price || 0}
                  onChange={(e) =>
                    onUpdate(
                      { ...restaurant, price: parseFloat(e.target.value) },
                      false,
                    )
                  }
                  required
                />
              </div>
              <div className="form-control">
                <label className="label-text text-[10px] font-bold mb-1 opacity-50 uppercase flex items-center gap-1">
                  <BadgePercent size={12} /> Discount (LKR)
                </label>
                <input
                  type="number"
                  className="input input-bordered w-full"
                  value={restaurant.discount || 0}
                  onChange={(e) =>
                    onUpdate(
                      { ...restaurant, discount: parseFloat(e.target.value) },
                      false,
                    )
                  }
                />
              </div>
              <div className="form-control">
                <label className="label-text text-[10px] font-bold mb-1 opacity-50 uppercase flex items-center gap-1">
                  <ImageIcon size={12} /> Image URL
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={restaurant.imageUrl || ""}
                  onChange={(e) =>
                    onUpdate({ ...restaurant, imageUrl: e.target.value }, false)
                  }
                />
              </div>
            </div>

            <div className="divider"></div>

            <div className="form-control">
              <label className="label-text text-[10px] font-bold mb-2 opacity-50 uppercase flex items-center gap-2">
                <MapPin size={14} /> Restaurant Location (Sri Lanka)
              </label>
              <MapSelector
                lat={restaurant.latitude}
                lng={restaurant.longitude}
                onChange={handleLocationChange}
              />
            </div>

            <div className="form-control">
              <label className="label cursor-pointer justify-start gap-4 p-0">
                <input
                  type="checkbox"
                  className="toggle toggle-primary toggle-sm"
                  checked={restaurant.featured || false}
                  onChange={(e) =>
                    onUpdate({ ...restaurant, featured: e.target.checked }, false)
                  }
                />
                <span className="label-text text-xs font-bold">
                  Featured on platform
                </span>
              </label>
            </div>
            {restaurant.status !== "REMOVED" && (
              <div className="modal-action">
                <button
                  type="submit"
                  className="btn btn-primary btn-block rounded-xl"
                  disabled={isUpdating}
                >
                  {!isUpdating && <Save size={18} className="mr-2" />} Save
                  Changes
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
      <div
        className="modal-backdrop"
        onClick={() => !isUpdating && onClose()}
      ></div>
    </div>
  );
};
