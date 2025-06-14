import * as faceapi from "face-api.js";

export async function loadModels() {
  const MODEL_URL = "/models";
  console.log("Carregando modelos...");

  await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
  console.log("tinyFaceDetector carregado");

  await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
  console.log("faceExpressionNet carregado");
}

