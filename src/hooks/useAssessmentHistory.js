import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'jsm-avaliacao-pro:historico';

function readHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeHistory(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function useAssessmentHistory() {
  const [historico, setHistorico] = useState(readHistory);

  useEffect(() => {
    writeHistory(historico);
  }, [historico]);

  const salvarAvaliacao = useCallback((avaliacao) => {
    setHistorico((prev) => [
      { ...avaliacao, id: crypto.randomUUID(), criadoEm: new Date().toISOString() },
      ...prev,
    ]);
  }, []);

  const removerAvaliacao = useCallback((id) => {
    setHistorico((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const avaliacoesDoAluno = useCallback(
    (nome) => historico.filter((a) => a.identificacao?.nome?.toLowerCase() === nome?.toLowerCase()),
    [historico]
  );

  return { historico, salvarAvaliacao, removerAvaliacao, avaliacoesDoAluno };
}
