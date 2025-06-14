import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import { loadModels } from "../utils/loadModels";
import { emotionLabels } from "../data/emotion";

const AnalysisSection = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [emotion, setEmotion] = useState<string | null>(null);

  useEffect(() => {
    async function start() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;

          // Espera o vídeo carregar metadados (tipo resolução, etc.)
          videoRef.current.onloadedmetadata = async () => {
            await loadModels();

            const interval = setInterval(async () => {
              if (!videoRef.current) return;

              const detections = await faceapi
                .detectAllFaces(
                  videoRef.current,
                  new faceapi.TinyFaceDetectorOptions()
                )
                .withFaceExpressions();

              if (detections.length > 0) {
                const main = detections[0];
                const [mainEmotion, confidence] = Object.entries(
                  main.expressions
                ).sort((a, b) => b[1] - a[1])[0];

                const label = emotionLabels[mainEmotion] || mainEmotion;

                console.log("Emoção detectada:", mainEmotion, confidence);
                setEmotion(`Detectamos que você está ${label}.`);
              } else {
                console.log("Nenhum rosto detectado");
              }
            }, 1000);

            // Limpa o intervalo quando o componente for desmontado
            return () => clearInterval(interval);
          };
        }
      } catch (err) {
        console.error("Erro ao acessar a câmera:", err);
      }
    }

    start();
  }, []);

  return (
    <section className="flex flex-col gap-4 text-black lg:w-1/2 justify-center items-center">
      <div className="bg-white rounded-md p-2 w-full">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="rounded-md w-full"
        />
      </div>

      <div className="bg-white rounded-md p-2 w-full text-center text-sm lg:text-lg font-medium">
        {emotion}
      </div>
    </section>
  );
};

export default AnalysisSection;
