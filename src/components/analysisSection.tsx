import { useEffect, useRef } from "react";

const AnalysisSection = () => {

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Erro ao acessar a câmera:", err);
      }
    }

    startCamera();
  }, []);

  return (
    <section className="flex flex-col gap-4 text-black w-1/2 justify-center items-center">
      <div className="bg-white rounded-md p-2">
        <div className="bg-gray-300 rounded-md flex justify-center">
          <video ref={videoRef} autoPlay playsInline className="rounded-md"/>
        </div>
      </div>

      <div className="bg-white rounded-md p-2 w-full">olá</div>
    </section>
  );
};

export default AnalysisSection;
