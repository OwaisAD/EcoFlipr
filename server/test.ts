// const fs = require("fs");
// import { cities } from "./data/zipsAndCitites";
// import mongoose from "mongoose";
import { cities } from "./data/zipsAndCities";
import City from "./models/city";

// type City = {
//   _id: mongoose.Types.ObjectId;
//   zip_code: string;
//   name: string;
// };

// function removeDuplicateCities(cities: City[]): City[] {
//   const uniqueZipCodes = new Set<string>();
//   const uniqueCities: City[] = [];

//   for (const city of cities) {
//     if (!uniqueZipCodes.has(city.zip_code)) {
//       uniqueZipCodes.add(city.zip_code);
//       uniqueCities.push(city);
//     }
//   }

//   return uniqueCities;
// }

// const uniqueCities = removeDuplicateCities(cities);

// fs.writeFile("unique-cities.json", JSON.stringify(uniqueCities), (err: any) => {
//   if (err) {
//     console.error(err);
//     return;
//   }
//   console.log("File has been written.");
// });


