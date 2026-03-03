'use client';

import { useState } from 'react';
import Link from 'next/link';
import { candidates } from '@/data/candidates';

type CorrectionStep = 'initial' | 'selecting' | 'message' | 'correction' | 'contact' | 'submitted';

interface CorrectionData {
  candidateSlug?: string;
  candidateName?: string;
  message?: string;
  correction?: string;
  email?: string;
}

export default function CorreccionsPage() {
  const [step, setStep] = useState<CorrectionStep>('initial');
  const [data, setData] = useState<CorrectionData>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCandidateSelect = (slug: string, name: string) => {
    setData({ ...data, candidateSlug: slug, candidateName: name });
    setStep('message');
  };

  const handleSubmitMessage = () => {
    if (!data.message?.trim()) {
      setError('Por favor escribe un mensaje');
      return;
    }
    setError(null);
    setStep('correction');
  };

  const handleSubmitCorrection = () => {
    if (!data.correction?.trim()) {
      setError('Por favor escribe la corrección');
      return;
    }
    setError(null);
    setStep('contact');
  };

  const handleSubmitForm = async () => {
    if (!data.email?.trim()) {
      setError('Por favor escribe tu email');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/corrections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidate_slug: data.candidateSlug,
          candidate_name: data.candidateName,
          email: data.email,
          message: data.message,
          correction_text: data.correction,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al enviar la corrección');
      }

      setStep('submitted');
      setData({});
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setStep('initial');
    setData({});
    setError(null);
  };

  return (
    <div className="mx-auto max-w-2xl px-6 py-8">
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-voraz-gray-400 transition-colors hover:text-voraz-black"
      >
        <span>←</span> Inicio
      </Link>

      <div className="mb-8">
        <h1 className="font-display text-4xl font-black uppercase tracking-tight text-voraz-black">
          Reportar error
        </h1>
        <div className="mt-4 h-1 w-12 bg-voraz-red" />
      </div>

      {/* Chat interface */}
      <div className="rounded-2xl bg-voraz-white p-6 shadow-[var(--shadow-card)]">
        <div className="mb-6 space-y-4 min-h-[200px]">
          {/* Initial message */}
          {step === 'initial' && (
            <div className="space-y-4">
              <div className="mb-6">
                <p className="text-sm text-voraz-gray-600">
                  ¿Encontraste un error o información desactualizada? Cuéntanos y lo corregiremos.
                </p>
              </div>
              <button
                onClick={() => setStep('selecting')}
                className="w-full rounded-lg bg-voraz-red text-voraz-white py-3 font-medium transition-colors hover:bg-voraz-red/90"
              >
                Reportar error →
              </button>
            </div>
          )}

          {/* Candidate selection */}
          {step === 'selecting' && (
            <div className="space-y-3">
              <p className="text-xs text-voraz-gray-500 uppercase tracking-wider font-bold">
                ¿Cuál candidato?
              </p>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {candidates.map((c) => (
                  <button
                    key={c.slug}
                    onClick={() => handleCandidateSelect(c.slug, c.name)}
                    className="w-full text-left rounded-lg bg-voraz-gray-50 px-4 py-3 text-sm transition-colors hover:bg-voraz-red/10 hover:text-voraz-red"
                  >
                    <span className="font-bold">{c.name}</span>
                    <span className="text-voraz-gray-400 ml-2">({c.party})</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Message input */}
          {step === 'message' && (
            <div className="space-y-3">
              <p className="text-xs text-voraz-gray-500 uppercase tracking-wider font-bold">
                Acerca de {data.candidateName}
              </p>
              <textarea
                value={data.message || ''}
                onChange={(e) => setData({ ...data, message: e.target.value })}
                placeholder="¿Qué sección tiene error? (Educación, Legal, Plan de gobierno, etc.)"
                className="w-full rounded-lg border border-voraz-gray-200 px-4 py-3 text-sm placeholder:text-voraz-gray-400 focus:border-voraz-red focus:outline-none"
                rows={3}
              />
              {error && <p className="text-xs text-voraz-red">{error}</p>}
              <button
                onClick={handleSubmitMessage}
                className="w-full rounded-lg bg-voraz-red text-voraz-white py-2 text-sm font-medium transition-colors hover:bg-voraz-red/90"
              >
                Siguiente →
              </button>
            </div>
          )}

          {/* Correction input */}
          {step === 'correction' && (
            <div className="space-y-3">
              <p className="text-xs text-voraz-gray-500 uppercase tracking-wider font-bold">
                Cuéntanos la corrección
              </p>
              <textarea
                value={data.correction || ''}
                onChange={(e) => setData({ ...data, correction: e.target.value })}
                placeholder="¿Cuál es la información correcta? Incluye fuentes si es posible."
                className="w-full rounded-lg border border-voraz-gray-200 px-4 py-3 text-sm placeholder:text-voraz-gray-400 focus:border-voraz-red focus:outline-none"
                rows={4}
              />
              {error && <p className="text-xs text-voraz-red">{error}</p>}
              <button
                onClick={handleSubmitCorrection}
                className="w-full rounded-lg bg-voraz-red text-voraz-white py-2 text-sm font-medium transition-colors hover:bg-voraz-red/90"
              >
                Siguiente →
              </button>
            </div>
          )}

          {/* Contact input */}
          {step === 'contact' && (
            <div className="space-y-3">
              <p className="text-xs text-voraz-gray-500 uppercase tracking-wider font-bold">
                Tu email (para confirmar)
              </p>
              <input
                type="email"
                value={data.email || ''}
                onChange={(e) => setData({ ...data, email: e.target.value })}
                placeholder="tu@email.com"
                className="w-full rounded-lg border border-voraz-gray-200 px-4 py-3 text-sm placeholder:text-voraz-gray-400 focus:border-voraz-red focus:outline-none"
              />
              {error && <p className="text-xs text-voraz-red">{error}</p>}
              <button
                onClick={handleSubmitForm}
                disabled={isSubmitting}
                className="w-full rounded-lg bg-voraz-red text-voraz-white py-2 text-sm font-medium transition-colors hover:bg-voraz-red/90 disabled:opacity-50"
              >
                {isSubmitting ? 'Enviando...' : 'Enviar corrección'}
              </button>
            </div>
          )}

          {/* Success */}
          {step === 'submitted' && (
            <div className="space-y-4 text-center">
              <div className="text-4xl">✓</div>
              <p className="font-bold text-voraz-black">Gracias por tu corrección</p>
              <p className="text-sm text-voraz-gray-600">
                La revisaremos y la publicaremos en esta página si es correcta.
              </p>
              <button
                onClick={handleReset}
                className="w-full rounded-lg bg-voraz-red text-voraz-white py-2 text-sm font-medium transition-colors hover:bg-voraz-red/90"
              >
                Reportar otro error
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="mt-8 rounded-lg bg-voraz-gray-50 p-4">
        <p className="text-xs text-voraz-gray-500">
          Todas las correcciones son revisadas antes de publicarse. Si tu corrección es válida, aparecerá en esta página con una referencia a tu email.
        </p>
      </div>
    </div>
  );
}
