import fs from "fs";
import path from "path";

// File where your data is stored
const dataFilePath = path.resolve(__dirname, "../../data/cities.json");

// Helper function to generate unique IDs
function generateId(cities) {
  return cities.length ? Math.max(...cities.map((city) => city.id)) + 1 : 1;
}

export async function handler(event, context) {
  const method = event.httpMethod;

  if (method === "GET") {
    // Handle GET request (fetch all cities)
    const data = fs.readFileSync(dataFilePath, "utf-8");
    return {
      statusCode: 200,
      body: data,
      headers: {
        "Content-Type": "application/json",
      },
    };
  }

  if (method === "POST") {
    // Handle POST request (add new city)
    const newCity = JSON.parse(event.body);
    const fileContent = fs.readFileSync(dataFilePath, "utf-8");
    const citiesData = JSON.parse(fileContent);

    // Ensure lat/lng are numbers, not strings
    newCity.position.lat = parseFloat(newCity.position.lat);
    newCity.position.lng = parseFloat(newCity.position.lng);

    // Assign a unique ID to the new city
    newCity.id = generateId(citiesData.cities);

    // Add the new city to the data
    citiesData.cities.push(newCity);

    // Write updated data back to the file
    fs.writeFileSync(dataFilePath, JSON.stringify(citiesData, null, 2));

    // Return the newly created city
    return {
      statusCode: 201,
      body: JSON.stringify(newCity),
      headers: {
        "Content-Type": "application/json",
      },
    };
  }

  // Handle unsupported HTTP methods
  return {
    statusCode: 405,
    body: JSON.stringify({ message: "Method Not Allowed" }),
    headers: {
      "Content-Type": "application/json",
    },
  };
}
