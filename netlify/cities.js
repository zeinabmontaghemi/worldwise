import fs from "fs";
import path from "path";

const dataFilePath = path.resolve(__dirname, "../../data/cities.json");

exports.handler = async function (event, context) {
  const method = event.httpMethod;

  if (method === "GET") {
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
    const newCity = JSON.parse(event.body);
    const cities = JSON.parse(fs.readFileSync(dataFilePath, "utf-8"));
    cities.push(newCity);

    fs.writeFileSync(dataFilePath, JSON.stringify(cities, null, 2));

    return {
      statusCode: 201,
      body: JSON.stringify(newCity),
      headers: {
        "Content-Type": "application/json",
      },
    };
  }

  return {
    statusCode: 405,
    body: JSON.stringify({ message: "Method Not Allowed" }),
  };
};
