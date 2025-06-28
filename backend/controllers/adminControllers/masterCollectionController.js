import MasterData from "../../models/masterDataModel.js";
import { v4 as uuidv4 } from "uuid";
import { errorHandler } from "../../utils/error.js";
import pool from "../../db.js";

const dummyData = [
  // Kathmandu
  {
    id: uuidv4(),
    district: "Kathmandu",
    location: "new baneshwor : bus park",
    type: "location",
  },
  {
    id: uuidv4(),
    district: "Kathmandu",
    location: "kalanki : taxi stand",
    type: "location",
  },
  {
    id: uuidv4(),
    district: "Kathmandu",
    location: "koteshwor : ring road junction",
    type: "location",
  },

  // Pokhara
  {
    id: uuidv4(),
    district: "Kaski",
    location: "lakeside : tourist bus park",
    type: "location",
  },
  {
    id: uuidv4(),
    district: "Kaski",
    location: "prithvi chowk : taxi stand",
    type: "location",
  },
  {
    id: uuidv4(),
    district: "Kaski",
    location: "pokhara airport : arrival area",
    type: "location",
  },

  // Chitwan
  {
    id: uuidv4(),
    district: "Chitwan",
    location: "bharatpur : central bus station",
    type: "location",
  },
  {
    id: uuidv4(),
    district: "Chitwan",
    location: "narayangadh : narayani river bridge",
    type: "location",
  },
  {
    id: uuidv4(),
    district: "Chitwan",
    location: "ratnanagar : sauraha bus stop",
    type: "location",
  },

  // Bhaktapur
  {
    id: uuidv4(),
    district: "Bhaktapur",
    location: "bhaktapur : durbar square",
    type: "location",
  },
  {
    id: uuidv4(),
    district: "Bhaktapur",
    location: "thimi : bus stand",
    type: "location",
  },
  {
    id: uuidv4(),
    district: "Bhaktapur",
    location: "suryabinayak : taxi stand",
    type: "location",
  },

  // Biratnagar
  {
    id: uuidv4(),
    district: "Biratnagar",
    location: "biratnagar : bus park",
    type: "location",
  },
  {
    id: uuidv4(),
    district: "Biratnagar",
    location: "rangeli road : taxi stand",
    type: "location",
  },
  {
    id: uuidv4(),
    district: "Biratnagar",
    location: "jogbani border : taxi stand",
    type: "location",
  },

  //cars

  //alto
  {
    id: uuidv4(),
    model: "Alto 800",
    variant: "manual",
    type: "car",
    brand: "maruthi",
  },
  {
    id: uuidv4(),
    model: "Alto 800",
    variant: "automatic",
    type: "car",
    brand: "maruthi",
  },
  {
    id: uuidv4(),
    model: "SKODA SLAVIA PETROL AT",
    variant: "automatic",
    type: "car",
    brand: "maruthi",
  },
  {
    id: uuidv4(),
    model: "NISSAN MAGNITE PETROL MT",
    variant: "manual",
    type: "car",
    brand: "nissan",
  },
  {
    id: uuidv4(),
    model: "SKODA KUSHAQ Petrol MT",
    variant: "manual",
    type: "car",
    brand: "skoda",
  },
  {
    id: uuidv4(),
    model: "SKODA KUSHAQ Petrol AT",
    variant: "automatic",
    type: "car",
    brand: "skoda",
  },
  {
    id: uuidv4(),
    model: "MG HECTOR Petrol MT",
    variant: "manual",
    type: "car",
    brand: "mg",
  },
  {
    id: uuidv4(),
    model: "MG HECTOR Petrol AT",
    variant: "automatic",
    type: "car",
    brand: "mg",
  },
  {
    id: uuidv4(),
    model: "MG HECTOR Diesel MT",
    variant: "manual",
    type: "car",
    brand: "mg",
  },
  {
    id: uuidv4(),
    model: "NISSAN TERRANO Diesel MT",
    variant: "manual",
    type: "car",
    brand: "nissan",
  },
  {
    id: uuidv4(),
    model: "NISSAN KICKS Petrol MT",
    variant: "manual",
    type: "car",
    brand: "nissan",
  },
  {
    id: uuidv4(),
    model: "NISSAN KICKS Petrol AT",
    variant: "manual",
    type: "car",
    brand: "nissan",
  },
  {
    id: uuidv4(),
    model: "VW TAIGUN Petrol MT",
    variant: "manual",
    type: "car",
    brand: "volkswagen",
  },
  {
    id: uuidv4(),
    model: "NISSAN MAGNITE Petrol MT",
    variant: "manual",
    type: "car",
    brand: "nissan",
  },
  {
    id: uuidv4(),
    model: "HYUNDAI ALCAZAR Diesel AT",
    variant: "automatic",
    type: "car",
    brand: "hyundai",
  },
  {
    id: uuidv4(),
    model: "CITROEN C3 Petrol MT",
    variant: "automatic",
    type: "car",
    brand: "citroen",
  },
  {
    id: uuidv4(),
    model: "ISUZU MUX Diesel AT",
    variant: "automatic",
    type: "car",
    brand: "isuzu",
  },
  {
    id: uuidv4(),
    model: "MG HECTOR PLUS Petrol MT",
    variant: "manual",
    type: "car",
    brand: "mg",
  },
  {
    id: uuidv4(),
    model: "MG HECTOR PLUS Petrol AT",
    variant: "automatic",
    type: "car",
    brand: "mg",
  },
  {
    id: uuidv4(),
    model: "MG HECTOR PLUS Diesel MT",
    variant: "manual",
    type: "car",
    brand: "mg",
  },

  {
    id: uuidv4(),
    model: "MARUTI SWIFT Petrol AT",
    variant: "automatic",
    type: "car",
    brand: "maruthi",
  },
  {
    id: uuidv4(),
    model: "DATSUN REDI GO Petrol MT",
    variant: "manual",
    type: "car",
    brand: "DATSUN",
  },
  {
    id: uuidv4(),
    model: "DATSUN REDI GO Petrol AT",
    variant: "automatic",
    type: "car",
    brand: "DATSUN",
  },
  {
    id: uuidv4(),
    model: "NISSAN MICRA Petrol MT",
    variant: "automatic",
    type: "car",
    brand: "NISSAN",
  },
  {
    id: uuidv4(),
    model: "VW AMEO Diesel MT",
    variant: "manual",
    type: "car",
    brand: "volkswagen",
  },
  {
    id: uuidv4(),
    model: "SKODA RAPID Petrol MT",
    variant: "manual",
    type: "car",
    brand: "skoda",
  },
  {
    id: uuidv4(),
    model: "MARUTI DZIRE Petrol MT",
    variant: "manual",
    type: "car",
    brand: "maruthi",
  },
  {
    id: uuidv4(),
    model: "VW VENTO Petrol MT",
    variant: "manual",
    type: "car",
    brand: "volkswagen",
  },
  {
    id: uuidv4(),
    model: "VW VENTO Petrol AT",
    variant: "automatic",
    type: "car",
    brand: "volkswagen",
  },
  {
    id: uuidv4(),
    model: "VW VENTO Diesel AT",
    variant: "automatic",
    type: "car",
    brand: "volkswagen",
  },
  {
    id: uuidv4(),
    model: "VW POLO Petrol MT",
    variant: "manual",
    type: "car",
    brand: "volkswagen",
  },
  {
    id: uuidv4(),
    model: "VW POLO Petrol AT",
    variant: "automatic",
    type: "car",
    brand: "volkswagen",
  },
  {
    id: uuidv4(),
    model: "VW POLO Diesel MT",
    variant: "manual",
    type: "car",
    brand: "volkswagen",
  },
];

// Function to insert dummy data into the database
export async function insertDummyData(res) {
  try {
    // Insert the dummy data into the collection
    // await MasterData.insertMany(dummyData);
    for (const item of dummyData) {
      if (item.type === "location") {
        await pool.query(
          "INSERT INTO locations (id, district, location, type) VALUES (?, ?, ?, ?)",
          [item.id, item.district, item.location, item.type]
        );
      } else if (item.type === "car") {
        await pool.query(
          "INSERT INTO cars (id, model, variant, brand, type) VALUES (?, ?, ?, ?, ?)",
          [item.id, item.model, item.variant, item.brand, item.type]
        );
      }
    }

    console.log("Dummy data inserted successfully.", dummyData);
    // res.status(201).json(dummyData);
  } catch (error) {
    console.error("Error inserting dummy data:", error);
  }
}

//app product modal data fetching from db
export const getCarModelData = async (req, res, next) => {
  try {
    const availableLocations = await pool.query("SELECT * FROM locations");
    const availableCars = await pool.query("SELECT * FROM cars");

    // const availableVehicleModels = await MasterData.find();
    if (!availableCars) {
      return next(errorHandler(404, "no model found"));
    }
    res.json({
      locations: availableLocations[0],
      cars: availableCars[0],
    });
    // res.status(201).json(availableVehicleModels);
  } catch (error) {
    next(errorHandler(500, { "could not get model Data": error }));
  }
};
