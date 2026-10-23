import React, { useState } from 'react';
import { CheckCircle2, XCircle, RotateCcw, Volume2, Award, BookOpen } from 'lucide-react';
import { EXAM_QUESTIONS } from './dataExam';
import { LangChoice } from './types';
import { speakSpanish } from './audioHelper';

interface ExamPracticeProps {
  globalLang: LangChoice;
}

export const ExamPractice: React.FC<ExamPracticeProps> = ({ globalLang }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [localLang, setLocalLang] = useState<LangChoice>(globalLang);
  const [questionLang, setQuestionLang] = useState<Record<number, 'hy' | 'ru' | undefined>>({});
  const [optionLangs, setOptionLangs] = useState<Record<string, 'hy' | 'ru' | null>>({});

  React.useEffect(() => {
    setLocalLang(globalLang);
  }, [globalLang]);

  const handleSelect = (questionId: number, optionKey: string) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionKey,
    }));
  };

  const calculateScore = () => {
    let score = 0;
    EXAM_QUESTIONS.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctKey) {
        score++;
      }
    });
    return score;
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setQuestionLang({});
    setOptionLangs({});
    setIsSubmitted(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const score = calculateScore();
  const total = EXAM_QUESTIONS.length;
  const percentage = Math.round((score / total) * 100);
  const answeredCount = Object.keys(selectedAnswers).length;

  const effectiveLang = localLang === 'hidden' ? 'both' : localLang;

  return (
    <div className="space-y-6">
      {/* Exam Header Banner */}
      <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
              <BookOpen className="w-3.5 h-3.5" />
              1.º de ESO · 7-րդ դասարան
            </span>

            {/* Language switch */}
            <div className="flex items-center gap-1 bg-white/10 p-1 rounded-xl backdrop-blur-xs">
              <button
                onClick={() => setLocalLang('hy')}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                  effectiveLang === 'hy' ? 'bg-white text-indigo-900 font-bold' : 'text-indigo-200 hover:text-white'
                }`}
              >
                🇦🇲 Հայերեն
              </button>
              <button
                onClick={() => setLocalLang('ru')}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                  effectiveLang === 'ru' ? 'bg-white text-indigo-900 font-bold' : 'text-indigo-200 hover:text-white'
                }`}
              >
                🇷🇺 Русский
              </button>
              <button
                onClick={() => setLocalLang('both')}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                  effectiveLang === 'both' ? 'bg-white text-indigo-900 font-bold' : 'text-indigo-200 hover:text-white'
                }`}
              >
                ✨ Երկուսն էլ / Оба
              </button>
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            EXAMEN DE PRÁCTICA
          </h2>
          <p className="text-indigo-200 text-sm sm:text-base mt-1 font-medium">
            Փորձնական ստուգողական աշխատանք · 20 preguntas · 4 opciones · Una sola respuesta correcta
          </p>

          {/* Progress / Score Card */}
          <div className="mt-6 pt-5 border-t border-indigo-700/50 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center font-bold text-lg">
                {isSubmitted ? `${score}/${total}` : `${answeredCount}/${total}`}
              </div>
              <div>
                <p className="text-xs text-indigo-300 font-medium">
                  {isSubmitted ? 'Արդյունք / Результат:' : 'Լրացված է / Отвечено:'}
                </p>
                <p className="text-sm font-bold text-white">
                  {isSubmitted ? `${score} ճիշտ (${percentage}%)` : `${answeredCount} հարց 20-ից`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {!isSubmitted ? (
                <button
                  onClick={() => setIsSubmitted(true)}
                  disabled={answeredCount === 0}
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-sm shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  Corregir examen · Ստուգել
                </button>
              ) : (
                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-sm transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                  Repetir · Կրկնել
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Result celebration box if submitted */}
      {isSubmitted && (
        <div
          className={`p-6 rounded-3xl border text-center transition-all shadow-md ${
            percentage >= 70
              ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
              : 'bg-amber-50 border-amber-200 text-amber-950'
          }`}
        >
          <Award className="w-12 h-12 mx-auto mb-2 text-indigo-600" />
          <h3 className="text-xl sm:text-2xl font-black">
            {percentage >= 90
              ? '¡Excelente! / Գերազանց է!'
              : percentage >= 70
              ? '¡Buen trabajo! / Լավ աշխատանք!'
              : '¡Ánimo! / Շարունակի՛ր մարզվել!'}
          </h3>
          <p className="text-sm mt-1 max-w-md mx-auto opacity-90">
            Դուք ճիշտ եք պատասխանել {score} հարցի 20-ից ({percentage}%): Դիտեք ստորև բոլոր բացատրությունները՝ սխալները շտկելու համար:
          </p>
        </div>
      )}

      {/* Question Cards List */}
      <div className="space-y-5">
        {EXAM_QUESTIONS.map((q) => {
          const selected = selectedAnswers[q.id];
          const isCorrect = isSubmitted && selected === q.correctKey;
          const isWrong = isSubmitted && selected && selected !== q.correctKey;
          const notAnswered = isSubmitted && !selected;

          return (
            <div
              key={q.id}
              className={`rounded-2xl border bg-white p-5 sm:p-6 shadow-xs transition-all ${
                isCorrect
                  ? 'border-emerald-300 ring-1 ring-emerald-200 bg-emerald-50/10'
                  : isWrong
                  ? 'border-rose-300 ring-1 ring-rose-200 bg-rose-50/10'
                  : notAnswered
                  ? 'border-amber-300 ring-1 ring-amber-200'
                  : 'border-slate-200 hover:border-indigo-200'
              }`}
            >
              {/* Question Header */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-100 text-indigo-800">
                      Pregunta {q.id}
                    </span>
                    {isSubmitted && (
                      isCorrect ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Ճիշտ է
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-100 px-2.5 py-0.5 rounded-full">
                          <XCircle className="w-3.5 h-3.5" /> {selected ? 'Սխալ է' : 'Չլրացված'}
                        </span>
                      )
                    )}
                  </div>

                  {/* LARGE FONT FOR SPANISH QUESTION */}
                  <p className="text-xl sm:text-2xl font-bold text-slate-900 font-serif leading-snug pt-1">
                    {q.questionEs}
                  </p>

                  {/* Question translation buttons */}
                  <div className="pt-1 flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => setQuestionLang((prev) => ({ ...prev, [q.id]: prev[q.id] === 'hy' ? undefined : 'hy' }))}
                      className={`px-3 py-1 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        questionLang[q.id] === 'hy'
                          ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                          : 'bg-slate-100 hover:bg-amber-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      🇦🇲 Հայերեն
                    </button>
                    <button
                      onClick={() => setQuestionLang((prev) => ({ ...prev, [q.id]: prev[q.id] === 'ru' ? undefined : 'ru' }))}
                      className={`px-3 py-1 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        questionLang[q.id] === 'ru'
                          ? 'bg-sky-600 text-white border-sky-700 shadow-xs'
                          : 'bg-slate-100 hover:bg-sky-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      🇷🇺 Русский
                    </button>
                  </div>

                  {/* Question translation if toggled or if globalLang matches */}
                  {(questionLang[q.id] === 'hy' || (!questionLang[q.id] && (effectiveLang === 'hy' || effectiveLang === 'both'))) && (
                    <p className="text-base sm:text-lg text-slate-800 font-medium bg-amber-50/50 p-2.5 rounded-xl border border-amber-200/60">
                      {q.questionHy}
                    </p>
                  )}
                  {(questionLang[q.id] === 'ru' || (!questionLang[q.id] && (effectiveLang === 'ru' || effectiveLang === 'both'))) && (
                    <p className="text-base sm:text-lg text-slate-700 bg-sky-50/50 p-2.5 rounded-xl border border-sky-200/60">
                      {q.questionRu}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => speakSpanish(q.questionEs)}
                  title="Escuchar pregunta"
                  className="px-3 py-2 rounded-2xl border border-indigo-200 hover:bg-indigo-50 text-indigo-700 transition-colors shrink-0 flex items-center gap-1.5 text-xs font-bold cursor-pointer"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Լսել</span>
                </button>
              </div>

              {/* 4 Options with INDEPENDENT ARM / RUS per option */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {q.options.map((opt) => {
                  const isThisSelected = selected === opt.key;
                  const isThisCorrect = q.correctKey === opt.key;
                  const optStateKey = `${q.id}-${opt.key}`;
                  const optLang = optionLangs[optStateKey];

                  let cardStyle = 'border-slate-300 bg-slate-50/70 hover:bg-slate-100/90 text-slate-900';

                  if (isSubmitted) {
                    if (isThisCorrect) {
                      cardStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold ring-2 ring-emerald-400';
                    } else if (isThisSelected) {
                      cardStyle = 'border-rose-400 bg-rose-50 text-rose-950 ring-2 ring-rose-300';
                    } else {
                      cardStyle = 'border-slate-200 bg-white text-slate-400 opacity-60';
                    }
                  } else if (isThisSelected) {
                    cardStyle = 'border-indigo-600 bg-indigo-50 text-indigo-950 font-bold ring-2 ring-indigo-500';
                  }

                  return (
                    <div
                      key={opt.key}
                      onClick={() => !isSubmitted && handleSelect(q.id, opt.key)}
                      className={`p-4 rounded-2xl border-2 text-left transition-all flex flex-col justify-between ${cardStyle} cursor-pointer`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2.5 flex-1">
                          <span className="w-7 h-7 rounded-full border-2 flex items-center justify-center font-bold text-sm bg-white shrink-0 mt-0.5">
                            {opt.key}
                          </span>
                          <span className="font-bold text-base sm:text-lg text-slate-900 leading-snug">
                            {opt.textEs}
                          </span>
                        </div>

                        {/* Separate ARM / RUS buttons for this specific option */}
                        <div className="flex items-center gap-1 shrink-0 ml-2" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOptionLangs((prev) => ({
                                ...prev,
                                [optStateKey]: prev[optStateKey] === 'hy' ? null : 'hy',
                              }));
                            }}
                            title="Տեսնել տարբերակը հայերենով"
                            className={`px-2 py-0.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                              optLang === 'hy'
                                ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                                : 'bg-white hover:bg-amber-50 text-slate-700 border-slate-300'
                            }`}
                          >
                            🇦🇲 Հայ
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOptionLangs((prev) => ({
                                ...prev,
                                [optStateKey]: prev[optStateKey] === 'ru' ? null : 'ru',
                              }));
                            }}
                            title="Посмотреть вариант на русском"
                            className={`px-2 py-0.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                              optLang === 'ru'
                                ? 'bg-sky-600 text-white border-sky-700 shadow-xs'
                                : 'bg-white hover:bg-sky-50 text-slate-700 border-slate-300'
                            }`}
                          >
                            🇷🇺 Рус
                          </button>
                        </div>
                      </div>

                      {/* Option translation revealed on click */}
                      {optLang === 'hy' && opt.textHy && (
                        <div className="mt-2.5 p-2 rounded-xl bg-amber-50/90 border border-amber-300 text-xs sm:text-sm font-medium text-amber-950">
                          <span className="font-bold mr-1">🇦🇲 Հայերեն՝</span>
                          {opt.textHy}
                        </div>
                      )}

                      {optLang === 'ru' && opt.textRu && (
                        <div className="mt-2.5 p-2 rounded-xl bg-sky-50/90 border border-sky-300 text-xs sm:text-sm font-medium text-sky-950">
                          <span className="font-bold mr-1">🇷🇺 Русский:</span>
                          {opt.textRu}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Explanation after submission with LARGER FONT */}
              {isSubmitted && (
                <div className="mt-5 pt-4 border-t border-slate-200 bg-slate-50/90 -mx-5 -mb-5 sm:-mx-6 sm:-mb-6 p-5 sm:p-6 rounded-b-2xl space-y-2 text-sm sm:text-base">
                  <p className="text-slate-900 font-semibold leading-relaxed">
                    <span className="text-emerald-700 font-bold mr-2 text-base sm:text-lg">Ճիշտ պատասխան՝ {q.correctKey}:</span>
                    {q.explanationEs}
                  </p>
                  {(effectiveLang === 'hy' || effectiveLang === 'both') && (
                    <p className="text-slate-800 leading-relaxed">
                      <span className="text-amber-800 font-bold mr-2">Հայերեն բացատրություն՝</span>
                      {q.explanationHy}
                    </p>
                  )}
                  {(effectiveLang === 'ru' || effectiveLang === 'both') && (
                    <p className="text-slate-700 leading-relaxed">
                      <span className="text-sky-800 font-bold mr-2">Русский:</span>
                      {q.explanationRu}
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Floating Bottom Action Bar */}
      <div className="sticky bottom-4 z-20 flex justify-center">
        <div className="bg-white/95 backdrop-blur-md px-6 py-3 rounded-full shadow-2xl border border-slate-200 flex items-center gap-4">
          <span className="text-xs sm:text-sm font-semibold text-slate-700">
            {isSubmitted
              ? `Գնահատական՝ ${score}/${total} (${percentage}%)`
              : `Պատասխանված է՝ ${answeredCount}/${total}`}
          </span>
          {!isSubmitted ? (
            <button
              onClick={() => setIsSubmitted(true)}
              disabled={answeredCount === 0}
              className="px-5 py-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
            >
              Corregir examen · Ստուգել
            </button>
          ) : (
            <button
              onClick={handleReset}
              className="px-5 py-2 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all inline-flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Repetir · Կրկնել
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
