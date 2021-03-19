import fs from "fs";
import { v4 as uuid } from "uuid";

type ErrorName = "BadRequest" | "UnathorizedError";
type ImageType = "Company" | "PersonInCharge" | "Product";

function injectKeyToArray(key: string, value: any, arr: Array<any>) {
  return arr.map((member) => {
    member[key] = value;
    return member;
  });
}

function createError(name: ErrorName, message: string) {
  const error = new Error(message);
  error.name = name;
  return error;
}

function getImageFolder(type: ImageType) {
  switch (type) {
    case "Company":
      return "company";
    case "PersonInCharge":
      return "personincharge";
    case "Product":
      return "product";
  }
}

function saveImage(imageData: string, type: ImageType, id: string) {
  const imageFolder = getImageFolder(type);
  const path = `images/${imageFolder}/${id}.jpg`;
  const base64Data = imageData.replace(/^data:([A-Za-z-+/]+);base64,/, "");

  fs.writeFileSync(`public/${path}`, base64Data, { encoding: "base64" });
  return `/static/${path}`;
}

function saveMultipleImages(imageData: Array<string>, type: ImageType) {
  const ids = imageData.map((_) => uuid());
  const imgPaths = imageData.map((img, idx) => saveImage(img, type, ids[idx]));
  return imgPaths;
}

export { injectKeyToArray, createError, saveImage, saveMultipleImages };
