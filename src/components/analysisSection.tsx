import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import { loadModels } from "../utils/loadModels";
import { emotionLabels } from "../data/emotion";

const AnalysisSection = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [emotion, setEmotion] = useState<string | null>(null);

  useEffect(() => {
    async function start() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;

          videoRef.current.onloadedmetadata = async () => {
            await loadModels();

            const video = videoRef.current!;
            const canvas = canvasRef.current!;
            const displaySize = {
              width: video.videoWidth,
              height: video.videoHeight,
            };

            // Ajusta o tamanho do canvas para o vídeo
            canvas.width = displaySize.width;
            canvas.height = displaySize.height;

            faceapi.matchDimensions(canvas, displaySize);

            const interval = setInterval(async () => {
              if (!video) return;

              // Detecta todos os rostos com expressões
              const detections = await faceapi
                .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
                .withFaceExpressions();

              // Redimensiona as detecções para o tamanho do vídeo
              const resizedDetections = faceapi.resizeResults(detections, displaySize);

              const ctx = canvas.getContext("2d");
              if (ctx) {
                // Limpa o canvas antes de desenhar
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                // Desenha as caixas ao redor dos rostos detectados
                faceapi.draw.drawDetections(canvas, resizedDetections);

                // Desenha as expressões detectadas
                faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
              }

              if (detections.length > 0) {
                const main = detections[0];
                const [mainEmotion] = Object.entries(main.expressions)
                  .sort((a, b) => b[1] - a[1])[0];

                const label = emotionLabels[mainEmotion] || mainEmotion;
                setEmotion(`Detectamos que você está ${label}.`);
              } else {
                setEmotion(null);
              }
            }, 1000);

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
      <div className="relative bg-white rounded-md p-2 w-full">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="rounded-md w-full"
          style={{ position: "relative", zIndex: 1 }}
        />
        <canvas
          ref={canvasRef}
          className="absolute top-2 left-2 rounded-md"
          style={{ pointerEvents: "none", zIndex: 2 }}
        />
      </div>

      <div className="bg-white rounded-md p-2 w-full text-center text-sm lg:text-lg font-medium">
        {emotion || "Nenhum rosto detectado"}
      </div>
    </section>
  );
};

export default AnalysisSection;
