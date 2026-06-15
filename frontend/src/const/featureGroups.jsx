import {
  Fan,
  Sparkles,
  ShowerHead,
  Droplets,
  Zap,
  Landmark,
  Car,
  Trees,
  Toilet,
  ShieldCheck,
  Wifi,
  Refrigerator,
  Bed,
  Bath,
  Ruler,
  Building2,
  ParkingSquare,
  Thermometer,
  Lightbulb,
  Lock,
  Tv,
  Utensils,
} from "lucide-react";

export const featureGroups = [
  {
    title: "Comfort & Utilities",
    features: [
      { name: "AC Rooms", icon: <Fan className="w-4 h-4 text-blue-600" /> },
      { name: "Hot Water", icon: <ShowerHead className="w-4 h-4 text-orange-500" /> },
      { name: "Mainline Water", icon: <Droplets className="w-4 h-4 text-sky-500" /> },
      { name: "3 Phase Electricity", icon: <Zap className="w-4 h-4 text-yellow-500" /> },
      { name: "Overhead Water Storage", icon: <Droplets className="w-4 h-4 text-sky-500" /> },
      { name: "Internet", icon: <Wifi className="w-4 h-4 text-blue-600" /> },
      { name: "Refrigerator", icon: <Refrigerator className="w-4 h-4 text-slate-600" /> },
      { name: "TV Connection", icon: <Tv className="w-4 h-4 text-purple-600" /> },
    ],
  },
  {
    title: "Architecture & Style",
    features: [
      { name: "Luxury Specs", icon: <Sparkles className="w-4 h-4 text-yellow-600" /> },
      { name: "Colonial Architecture", icon: <Landmark className="w-4 h-4 text-slate-600" /> },
    ],
  },
  {
    title: "Rooms & Facilities",
    features: [
      { name: "Attached Toilets", icon: <Toilet className="w-4 h-4 text-slate-600" /> },
      { name: "Maid's Toilet", icon: <Toilet className="w-4 h-4 text-slate-600" /> },
      { name: "Dining Area", icon: <Utensils className="w-4 h-4 text-rose-600" /> },
      { name: "Living Room", icon: <Bed className="w-4 h-4 text-slate-600" /> },
      { name: "Common Bathroom", icon: <Bath className="w-4 h-4 text-slate-600" /> },
    ],
  },
  {
    title: "Outdoor & Parking",
    features: [
      { name: "Garage", icon: <Car className="w-4 h-4 text-slate-600" /> },
      { name: "Lawn/Garden", icon: <Trees className="w-4 h-4 text-green-600" /> },
      { name: "Parking", icon: <ParkingSquare className="w-4 h-4 text-slate-600" /> },
    ],
  },
  {
    title: "Security & Safety",
    features: [
      { name: "24 Hour Security", icon: <ShieldCheck className="w-4 h-4 text-red-600" /> },
      { name: "CCTV Surveillance", icon: <ShieldCheck className="w-4 h-4 text-red-600" /> },
      { name: "Smart Locks", icon: <Lock className="w-4 h-4 text-slate-600" /> },
      { name: "Emergency Lighting", icon: <Lightbulb className="w-4 h-4 text-yellow-500" /> },
    ],
  },
  {
    title: "Structural",
    features: [
      { name: "Multi-story Building", icon: <Building2 className="w-4 h-4 text-slate-600" /> },
      { name: "Large Floor Area", icon: <Ruler className="w-4 h-4 text-slate-600" /> },
    ],
  },
];
