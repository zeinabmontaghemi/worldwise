import fs from "fs";
import path from "path";

const dataFilePath = path.join(process.cwd(), "/data/cities.json"); // Adjust path according to your project structure

export async function handler(event, context) {
  const method = event.httpMethod;

  if (method === "GET") {
    try {
      const data = fs.readFileSync(dataFilePath, "utf-8");
      return {
        statusCode: 200,
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
      };
    } catch (err) {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Error reading data file" }),
      };
    }
  }

  if (method === "POST") {
    try {
      const newCity = JSON.parse(event.body);
      const cities = JSON.parse(fs.readFileSync(dataFilePath, "utf-8"));
      cities.push(newCity);

      // Since Netlify's filesystem is read-only during runtime, writing won't persist
      // fs.writeFileSync(dataFilePath, JSON.stringify(cities, null, 2));

      return {
        statusCode: 201,
        body: JSON.stringify(newCity),
        headers: {
          "Content-Type": "application/json",
        },
      };
    } catch (err) {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Error processing POST request" }),
      };
    }
  }

  return {
    statusCode: 405,
    body: JSON.stringify({ message: "Method Not Allowed" }),
  };
}
