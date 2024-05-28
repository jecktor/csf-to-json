import { useState, useRef } from "react";
import * as pdfjs from "pdfjs-dist";
import { csfToJson } from "./utils/csf-to-json";

function App() {
  const [file, setFile] = useState<File>();
  const output = useRef<HTMLPreElement>(null);

  async function handleConvert() {
    if (!file) {
      output.current!.innerText = "Seleccione un archivo";
      return;
    }

    const fileToBuffer = async (f: File) =>
      new Promise<ArrayBuffer>((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () =>
          resolve(new Uint8Array(reader.result as ArrayBuffer));
        reader.onerror = () => reject(reader.error);

        reader.readAsArrayBuffer(f);
      });

    try {
      const pdf = await pdfjs.getDocument(await fileToBuffer(file)).promise;
      const pageTextPromises = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        pageTextPromises.push(
          pdf
            .getPage(i)
            .then((page) => page.getTextContent())
            // @ts-expect-error too lazy to import & cast as TextItem
            .then((content) => content.items.map((item) => item.str).join(" ")),
        );
      }

      const pageTexts = await Promise.all(pageTextPromises);
      const pdfText = pageTexts.join(" ");

      const csf = csfToJson(pdfText);

      output.current!.innerText = JSON.stringify(csf, null, 2);
    } catch (error) {
      output.current!.innerText =
        error instanceof Error ? error.message : "Error desconocido";
    }
  }

  pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

  return (
    <>
      <h1>Seleccione constancia de situación fiscal</h1>
      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files![0])}
      />
      <button onClick={handleConvert}>Convertir a JSON</button>
      <code>
        <pre ref={output}></pre>
      </code>
    </>
  );
}

export default App;
