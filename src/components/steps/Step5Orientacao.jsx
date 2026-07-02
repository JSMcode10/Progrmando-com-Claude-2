import { useRef, useState } from 'react';
import ReportView from '../ReportView.jsx';
import { exportNodeToPdf } from '../../utils/pdfExport.js';
import { buildWhatsappLink } from '../../utils/whatsapp.js';

export default function Step5Orientacao({ identificacao, result, orientacao, onBack, onSalvar }) {
  const reportRef = useRef(null);
  const [leadLiberado, setLeadLiberado] = useState(false);
  const [leadNome, setLeadNome] = useState('');
  const [leadWhatsapp, setLeadWhatsapp] = useState('');
  const [logoDataUrl, setLogoDataUrl] = useState(null);
  const [ctaText, setCtaText] = useState('Agende sua reavaliação — JSM Personal');
  const [exportando, setExportando] = useState(false);

  const onLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setLogoDataUrl(reader.result);
    reader.readAsDataURL(file);
  };

  const handleExportPdf = async () => {
    if (!reportRef.current) return;
    setExportando(true);
    try {
      await exportNodeToPdf(reportRef.current, `avaliacao-${identificacao.nome || 'aluno'}.pdf`);
    } finally {
      setExportando(false);
    }
  };

  const whatsappLink = buildWhatsappLink({ identificacao, result }, leadWhatsapp);

  return (
    <div className="space-y-6">
      <div className="jsm-card">
        <h2 className="text-xl mb-4">Orientação de treino e dieta</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <h3 className="jsm-label mb-2">Treino</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              {orientacao.treino.map((t, i) => <li key={i}>{t}</li>)}
            </ul>
          </div>
          <div>
            <h3 className="jsm-label mb-2">Dieta (referência educativa)</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              {orientacao.dieta.map((t, i) => <li key={i}>{t}</li>)}
            </ul>
          </div>
        </div>
        <div className="mt-4 space-y-1 text-xs text-jsm-gold/90">
          {orientacao.avisos.map((a, i) => <p key={i}>⚠ {a}</p>)}
        </div>
      </div>

      {!leadLiberado ? (
        <div className="jsm-card">
          <h2 className="text-xl mb-2">Liberar relatório completo</h2>
          <p className="jsm-label text-sm mb-4">Captura opcional de lead antes de liberar o PDF e o compartilhamento.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="jsm-label">Nome do lead</label>
              <input className="jsm-input mt-1" value={leadNome} onChange={(e) => setLeadNome(e.target.value)} />
            </div>
            <div>
              <label className="jsm-label">WhatsApp</label>
              <input className="jsm-input mt-1" value={leadWhatsapp} onChange={(e) => setLeadWhatsapp(e.target.value)} placeholder="55DDNÚMERO" />
            </div>
          </div>
          <div className="flex gap-3">
            <button className="jsm-btn-primary" onClick={() => setLeadLiberado(true)}>Liberar relatório</button>
            <button className="jsm-btn-secondary" onClick={() => setLeadLiberado(true)}>Pular</button>
          </div>
        </div>
      ) : (
        <div className="jsm-card">
          <h2 className="text-xl mb-4">Relatório e compartilhamento</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="jsm-label">Logo do profissional</label>
              <input type="file" accept="image/*" className="jsm-input mt-1" onChange={onLogoUpload} />
            </div>
            <div>
              <label className="jsm-label">CTA do rodapé</label>
              <input className="jsm-input mt-1" value={ctaText} onChange={(e) => setCtaText(e.target.value)} />
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mb-6">
            <button className="jsm-btn-gold" onClick={handleExportPdf} disabled={exportando}>
              {exportando ? 'Gerando PDF…' : 'Exportar PDF'}
            </button>
            <a className="jsm-btn-secondary" href={whatsappLink} target="_blank" rel="noreferrer">
              Enviar avaliação no WhatsApp
            </a>
            <button
              className="jsm-btn-secondary"
              onClick={() => onSalvar({ identificacao, result, lead: { nome: leadNome, whatsapp: leadWhatsapp } })}
            >
              Salvar no histórico
            </button>
          </div>

          <div className="overflow-x-auto">
            <ReportView ref={reportRef} identificacao={identificacao} result={result} orientacao={orientacao} logoDataUrl={logoDataUrl} ctaText={ctaText} />
          </div>
        </div>
      )}

      <div className="flex justify-between">
        <button className="jsm-btn-secondary" onClick={onBack}>← Voltar</button>
      </div>
    </div>
  );
}
