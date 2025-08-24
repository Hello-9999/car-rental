import { errorHandler } from "../../utils/error.js";
import vehicle from "../../models/vehicleModel.js";

import { uploader } from "../../utils/cloudinaryConfig.js";
import { base64Converter } from "../../utils/multer.js";
import Vehicle from "../../models/vehicleModel.js";
import pool from "../../db.js";

// vendor add vehicle
export const vendorAddVehicle = async (req, res, next) => {
  try {
    const vendorId = req.user?.id;
    if (!vendorId) return next(errorHandler(400, "Vendor ID missing"));

    const vehicleNumber = Date.now(); // e.g. 1738123912938

    const addedBy = req.user?.id || req.body.addedBy; // from token or request body
    const uploadedFiles = {
      images: [],
      insurance_image: [],
      rc_book_image: [],
      pollution_image: [],
    };

    await Promise.all(
      Object.keys(req.files).map(async (field) => {
        const filesArray = req.files[field]; // array of files for this field

        await Promise.all(
          filesArray.map(async (file) => {
            // iterate each file in that field
            const folder = `vehicles/vendor-${addedBy}/${vehicleNumber}`;

            const result = await uploader.upload(
              `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
              {
                folder: folder,
                public_id: file.originalname.split(".")[0],
              }
            );

            uploadedFiles[field].push(result.secure_url); // push to correct field
          })
        );
      })
    );
    const insertValues = [
      req.body.registeration_number || null,
      req.body.company || null,
      req.body.model || null,
      req.body.title || null,
      // req.body.base_package || null,
      req.body.price || null,
      req.body.year_made || null,
      req.body.fuel_type || null,
      req.body.seat || null,
      req.body.transmition_type || null,
      req.body.insurance_end_date || null,
      req.body.registeration_end_date || null,
      req.body.polution_end_date || null,
      req.body.car_type || null,
      new Date(),
      req.body.location || null,
      req.body.district || null,
      0, // isAdminAdded
      addedBy || null,
      0, // isAdminApproved
      uploadedFiles.images?.[0] || null,
      uploadedFiles.rc_book_image?.[0] || null,
      uploadedFiles.insurance_image?.[0] || null,
      uploadedFiles.pollution_image?.[0] || null,
    ];

    // 5️⃣ Insert into DB (store JSON string of URLs)
    await pool.execute(
      `
  INSERT INTO vehicles 
  (registeration_number, company, model, car_title, price, year_made, fuel_type, seats, transmition, insurance_end, registeration_end, pollution_end, car_type, created_at, location, district, isAdminAdded, addedBy, isAdminApproved, image, rc_book_image, insurance_image, pollution_image)
  VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
`,
      // [
      //   req.body.registeration_number,
      //   req.body.company,
      //   // req.body.name,
      //   req.body.model,
      //   req.body.title,
      //   req.body.base_package,
      //   req.body.price,
      //   req.body.year_made,
      //   req.body.fuel_type,
      //   req.body.seat,
      //   req.body.transmition_type,
      //   req.body.insurance_end_date,
      //   req.body.registeration_end_date,
      //   req.body.polution_end_date,
      //   req.body.car_type,
      //   new Date(),
      //   req.body.location,
      //   req.body.district,
      //   0, // isAdminAdded false
      //   addedBy,
      //   0, // isAdminApproved false
      //   ...uploadedFiles.images,
      //   ...uploadedFiles.rc_book_image,
      //   ...uploadedFiles.insurance_image,
      //   ...uploadedFiles.pollution_image,
      // ]
      insertValues
    );
    console.log(insertValues, "insertValues");

    res.status(200).json({
      message: "✅ Vehicle added successfully",
      folderPath: `vehicles/vendor-${vendorId}/${vehicleNumber}`,
    });
  } catch (error) {
    console.error("❌ Error in vendorAddVehicle:", error);
    next(errorHandler(400, "vehicle failed to add"));
  }
};

//edit vendorVehicles
export const vendorEditVehicles = async (req, res, next) => {
  try {
    const vehicle_id = req.params.id;

    if (!vehicle_id) {
      return next(errorHandler(401, "Vehicle ID cannot be empty"));
    }

    if (!req.body) {
      return next(errorHandler(404, "Add data to edit first"));
    }

    const {
      district,
      insurance_end_date,
      year_made,
      fuel_type,
      transmition,
      registeration_end_date,
      polution_end_date,
      car_type,
      location,
      addedBy,
      registeration_number,
      company,
      name,
      model,
      base_package,
      price,
      id,
      seats,
    } = req.body;
    console.log(
      [
        district,
        insurance_end_date,
        year_made,
        fuel_type,
        transmition,
        registeration_end_date,
        polution_end_date,
        car_type,
        location,
        addedBy,
        registeration_number,
        company,
        name,
        model,
        base_package,
        price,
        id,
        seats,
      ],
      "ty"
    );

    const query = `
      UPDATE vehicles SET
        registeration_number = ?, company = ?, name = ?, model = ?, car_title = ?,
        car_description = ?, base_package = ?, price = ?, year_made = ?, fuel_type = ?,
        seats = ?, transmition = ?, insurance_end = ?, registeration_end = ?,
        pollution_end = ?, car_type = ?, updated_at = NOW(), location = ?, district = ?,
        isAdminApproved = 0, isRejected = 0
      WHERE id = ?
    `;

    const values = [
      registeration_number,
      company,
      name,
      model,
      "title",
      "description",
      base_package,
      price,
      year_made,
      fuel_type,
      seats,
      transmition,
      insurance_end_date,
      registeration_end_date,
      polution_end_date,
      car_type,
      "vehicleLocation",
      district,
      vehicle_id,
    ];

    const [result] = await pool.execute(query, values);

    if (result.affectedRows === 0) {
      return next(errorHandler(404, "Vehicle with this ID not found"));
    }

    res
      .status(200)
      .json({ success: true, message: "Vehicle updated successfully" });
  } catch (error) {
    // Handle duplicate entry
    if (error.code === "ER_DUP_ENTRY") {
      return next(errorHandler(409, "Registration number already exists"));
    }
    console.error(error);
    return next(errorHandler(500, "Something went wrong"));
  }
};

export const vendorDeleteVehicles = async (req, res, next) => {
  try {
    const vehicle_id = req.params.id;

    // First, check if vehicle exists
    const [rows] = await pool.execute("SELECT * FROM vehicles WHERE id = ?", [
      vehicle_id,
    ]);
    if (rows.length === 0) {
      return next(errorHandler(400, "Vehicle not found"));
    }

    // Soft delete by updating isDeleted to 'true'
    await pool.execute("UPDATE vehicles SET isDeleted = ? WHERE id = ?", [
      1,
      vehicle_id,
    ]);

    res.status(200).json({ message: "Deleted successfully  " });
  } catch (error) {
    console.error(error);
    next(errorHandler(500, "Error while vendorDeleteVehicles"));
  }
};

//show vendor vehicles
export const showVendorVehicles = async (req, res, next) => {
  try {
    if (!req.body) {
      throw errorHandler(400, "User not found");
    }

    const { _id } = req.body;

    const vendorsVehicles = await vehicle.aggregate([
      {
        $match: {
          isDeleted: "false",
          isAdminAdded: false,
          addedBy: _id,
        },
      },
    ]);

    if (!vendorsVehicles || vendorsVehicles.length === 0) {
      throw errorHandler(400, "No vehicles found");
    }

    res.status(200).json(vendorsVehicles);
  } catch (error) {
    console.error(error);
    next(errorHandler(500, "Error in showVendorVehicles"));
  }
};
