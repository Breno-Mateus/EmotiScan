import AnalysisSection from "./components/analysisSection";

function App() {
  return (
    <main className="flex w-screen min-h-screen p-12">
      <div className="w-1/2 flex flex-col justify-center pl-12">
        <h1 className="font-black text-7xl">
          EmotiScan <span className="text-[#6C63FF]">.</span>
        </h1>
        <p className="text-[#6C63FF] text-sm">
          Detectando emoções. Revelando sentimentos
        </p>
      </div>

      <AnalysisSection />
    </main>
  );
}

export default App;
