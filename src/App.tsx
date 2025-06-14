import AnalysisSection from "./components/analysisSection";

function App() {
  return (
    <main className="flex flex-col lg:flex-row w-screen min-h-screen lg:p-12 px-8 py-4 gap-24 lg:gap-0">
      <div className="lg:w-1/2 flex flex-col justify-center lg:pl-12">
        <h1 className="font-black text-4xl lg:text-7xl">
          EmotiScan <span className="text-[#6C63FF]">.</span>
        </h1>
        <p className="text-[#6C63FF] text-xs lg:text-sm">
          Detectando emoções. Revelando sentimentos
        </p>
      </div>

      <AnalysisSection />
    </main>
  );
}

export default App;
