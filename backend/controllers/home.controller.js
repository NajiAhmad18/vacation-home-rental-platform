import Home from "../models/home.model.js";
import cloudinary from "../lib/cloudinary.js";
import fs from "fs";

export const createHome = async (req, res) => {
  try {
    const files = req.files; // multer handles this
    const body = JSON.parse(req.body.data); // frontend sends JSON string in 'data'

    console.log("Incoming home data:", body);
    console.log("Cloudinary config:", cloudinary.config());

    if (!process.env.CLOUDINARY_API_KEY) {
      throw new Error("Missing Cloudinary API key");
    }

    // ✅ Upload images to Cloudinary
    const imageUploadPromises = files.map((file) =>
      cloudinary.uploader.upload(file.path, {
        folder: "homes",
      })
    );

    const uploadedImages = await Promise.all(imageUploadPromises);
    const imageUrls = uploadedImages.map((img) => img.secure_url);

    // ✅ Clean up local files
    files.forEach((file) => fs.unlinkSync(file.path));

    // ✅ Restructure location fields
    const location = {
      longitude: body.longitude,
      latitude: body.latitude,
      address: body.address,
      city: body.city,
      district: body.district,
      province: body.province,
    };

    body.ownerId = req.user._id;

    // ✅ Remove top-level location fields
    delete body.longitude;
    delete body.latitude;
    delete body.address;
    delete body.city;
    delete body.district;
    delete body.province;

    // ✅ Create new Home document
    const newHome = new Home({
      ...body,
      location,
      images: imageUrls,
    });

    await newHome.save();
    console.log("Home uploaded");

    res.status(201).json({
      success: true,
      message: "Home created successfully",
      data: newHome,
    });
  } catch (error) {
    console.error("Error creating home:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getHomeById = async (req, res) => {
  try {
    const homeId = req.params.id;
    const home = await Home.findById(homeId);

    if (!home) {
      return res
        .status(404)
        .json({ success: false, message: "Home not found" });
    }

    res.status(200).json({ success: true, data: home });
  } catch (error) {
    console.error("Error fetching home:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getAllHomes = async (req, res) => {
  try {
    const homes = await Home.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: homes });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 👤 Get homes for the logged-in owner
export const getHomesByOwner = async (req, res) => {
  try {
    const ownerId = req.user._id; // ✅ from JWT
    const homes = await Home.find({ ownerId }).sort({ createdAt: -1 });

    if (!homes.length) {
      return res
        .status(404)
        .json({ success: false, message: "No homes found for this owner" });
    }

    res.status(200).json({ success: true, data: homes });
  } catch (error) {
    console.error("Error fetching homes by owner:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateHome = async (req, res) => {
  try {
    const { id } = req.params;

    // Parse structured data and existing images
    const parsedData = JSON.parse(req.body.data || "{}");
    const existingImages = req.body.existingImages
      ? JSON.parse(req.body.existingImages)
      : [];

    let newImageUrls = [];

    // ✅ Handle new image uploads to Cloudinary
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) =>
        cloudinary.uploader.upload(file.path, { folder: "homes" })
      );

      const uploaded = await Promise.all(uploadPromises);
      newImageUrls = uploaded.map((img) => img.secure_url);

      // cleanup local temp files
      req.files.forEach((file) => fs.unlinkSync(file.path));
    }

    // ✅ Final images = old ones (kept) + newly uploaded
    const finalImages = [...existingImages, ...newImageUrls];

    const updatedHome = await Home.findByIdAndUpdate(
      id,
      { ...parsedData, images: finalImages },
      { new: true }
    );

    res.json({ success: true, data: updatedHome });
  } catch (err) {
    console.error("Update home failed:", err);
    res.status(500).json({ success: false, message: "Update failed" });
  }
};

// 🚫 Admin hide home if it violates rules
export const hideHomeByAdmin = async (req, res) => {
  try {
    const homeId = req.params.id;
    const reason = req.body.reason || "Violation of platform rules";

    const home = await Home.findById(homeId);
    if (!home) {
      return res
        .status(404)
        .json({ success: false, message: "Home not found" });
    }

    home.status = "hidden";
    home.approvalDetails.additionalInfo = reason;

    await home.save();

    res.status(200).json({
      success: true,
      message: "Home status updated to hidden due to violation",
      data: home,
    });
  } catch (error) {
    console.error("Error hiding home:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// controllers/homeController.js
export const toggleHomeAvailability = async (req, res) => {
  try {
    const homeId = req.params.id;

    const home = await Home.findById(homeId);

    if (!home) {
      return res
        .status(404)
        .json({ success: false, message: "Home not found" });
    }

    // Toggle status between 'active' and 'unavailable'
    home.status = home.status === "active" ? "unavailable" : "active";
    await home.save();

    res.status(200).json({
      success: true,
      message: `Home ${
        home.status === "active" ? "unarchived" : "archived"
      } successfully`,
      data: home,
    });
  } catch (error) {
    console.error("Error toggling home status:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteHome = async (req, res) => {
  try {
    const homeId = req.params.id;

    const home = await Home.findById(homeId);

    if (!home) {
      return res
        .status(404)
        .json({ success: false, message: "Home not found" });
    }

    await home.deleteOne();

    res.status(200).json({
      success: true,
      message: "Home deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting home:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
