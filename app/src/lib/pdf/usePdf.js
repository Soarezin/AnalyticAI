import { useEffect, useState } from "react";
import { GlobalWorkerOptions, getDocument } from "pdfjs-dist";

GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLibVersion()}/pdf.worker.min.js`;

function pdfjsLibVersion() {
  return "3.11.174";
}

export function usePdf({ url }) {
  const [loading, setLoading] = useState(true);
  const [doc, setDoc] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    if (!url) return;

    setLoading(true);
    setError(null);

    getDocument(url)
      .promise.then((pdf) => {
        if (!cancelled) {
          setDoc(pdf);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error(err);
        if (!cancelled) {
          setError(err);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [url]);

  return { loading, doc, error };
}
