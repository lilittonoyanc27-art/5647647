import React, { useState } from 'react';
import { CheckCircle2, Circle, Sparkles, Volume2 } from 'lucide-react';
import { MASTERY_LIST, ORAL_REVISION_QUESTIONS } from './dataExam';
import { LangChoice } from './types';
import { speakSpanish } from './audioHelper';

interface MasteryChecklistProps {
  globalLang: LangChoice;
}

export const MasteryChecklist: React.FC<MasteryChecklistProps> = ({ globalLang }) => {
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});
  const [openOralId, setOpenOralId] = useState<number | null>(null);

  const toggleCheck = (id: number) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const checkedCount = Object.values(checkedItems).filter(Boolean).length;
  const total = MASTERY_LIST.length;
  const progressPercent = Math.round((checkedCount / total) * 100);

  const effectiveLang = globalLang === 'hidden' ? 'both' : globalLang;

  return (
    <div className="space-y-8">
      {/* Mastery List Header & Progress */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Qué debe dominar el alumno
              </h2>
            </div>
            <p className="text-sm font-medium text-slate-600">
              Ի՞նչ պետք է իմանա աշակերտը · Список ключевых навыков для экзамена
            </p>
          </div>

          <div className="flex items-center gap-3 bg-indigo-50 px-4 py-2.5 rounded-2xl border border-indigo-100">
            <div className="text-right">
              <span className="text-xs text-indigo-600 font-semibold block">Առաջընթաց / Прогресс</span>
              <span className="text-lg font-black text-indigo-950">{checkedCount} / {total} ({progressPercent}%)</span>
            </div>
            <div className="w-10 h-10 rounded-full border-4 border-indigo-600 border-t-indigo-200 flex items-center justify-center font-bold text-xs text-indigo-700">
              {progressPercent}%
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 rounded-full h-3 mb-6 overflow-hidden">
          <div
            className="bg-indigo-600 h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* 10 Checklist Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {MASTERY_LIST.map((item) => {
            const isChecked = Boolean(checkedItems[item.id]);

            return (
              <div
                key={item.id}
                onClick={() => toggleCheck(item.id)}
                className={`p-4 rounded-2xl border cursor-pointer select-none transition-all flex items-start gap-3.5 ${
                  isChecked
                    ? 'bg-emerald-50/50 border-emerald-300 ring-1 ring-emerald-200'
                    : 'bg-slate-50/60 border-slate-200 hover:border-indigo-300 hover:bg-white'
                }`}
              >
                <button
                  type="button"
                  className="mt-0.5 text-indigo-600 shrink-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleCheck(item.id);
                  }}
                >
                  {isChecked ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-400" />
                  )}
                </button>

                <div className="space-y-1.5 flex-1">
                  <p
                    className={`text-base sm:text-lg font-bold transition-all leading-snug ${
                      isChecked ? 'text-emerald-950 line-through opacity-80' : 'text-slate-900'
                    }`}
                  >
                    {item.es}
                  </p>
                  {(effectiveLang === 'hy' || effectiveLang === 'both') && (
                    <p className="text-xs sm:text-sm text-slate-700 font-medium">
                      {item.hy}
                    </p>
                  )}
                  {(effectiveLang === 'ru' || effectiveLang === 'both') && (
                    <p className="text-xs sm:text-sm text-slate-600">
                      {item.ru}
                    </p>
                  )}
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    speakSpanish(item.es);
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 shrink-0"
                  title="Escuchar"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Oral Revision Table & Exam Prep Tips */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            Repaso final oral
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
            Վերջնական բանավոր կրկնություն (Repaso final)
          </h3>
          <p className="text-sm text-slate-600 mt-1">
            Քննությունից առաջ աշակերտը պետք է կարողանա իսպաներենով պատասխանել հետևյալ կարևոր հարցերին՝ առանց տետրին նայելու։
          </p>
        </div>

        {/* Teacher / Parent Tip Card from User prompt */}
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-amber-800">
            💡 Խորհուրդ դասի համար (Совет для подготовки)
          </p>
          <p className="text-xs sm:text-sm leading-relaxed">
            Սկզբում թող աշակերտը կատարի բոլոր վարժությունները՝ առանց պատասխանները նայելու։ Այնուհետև յուրաքանչյուր սխալ պատասխանի դեպքում պետք է իսպաներենով բացատրի՝ <span className="font-bold">«Es una anáfora porque...»</span>, <span className="font-bold">«Es un polisíndeton porque...»</span>։ Այսպես նա կսովորի ոչ միայն ճիշտ տարբերակը ընտրել, այլ նաև հիմնավորել այն, ինչը շատ կարևոր է Lengua Castellana-ի ստուգողական աշխատանքների համար։
          </p>
        </div>

        {/* 12 Oral Questions with Audio and Answers */}
        <div className="divide-y divide-slate-100">
          {ORAL_REVISION_QUESTIONS.map((q) => {
            const isOpen = openOralId === q.id;

            return (
              <div key={q.id} className="py-4 first:pt-0 last:pb-0">
                <div
                  onClick={() => setOpenOralId(isOpen ? null : q.id)}
                  className="flex items-start justify-between gap-3 cursor-pointer group"
                >
                  <div className="space-y-1.5">
                    <p className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
                      {q.id}. {q.es}
                    </p>
                    {(effectiveLang === 'hy' || effectiveLang === 'both') && (
                      <p className="text-sm sm:text-base text-slate-700 font-medium">
                        {q.hy}
                      </p>
                    )}
                    {(effectiveLang === 'ru' || effectiveLang === 'both') && (
                      <p className="text-sm sm:text-base text-slate-600">
                        {q.ru}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => speakSpanish(q.es)}
                      title="Escuchar pregunta"
                      className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-indigo-700 transition-colors cursor-pointer"
                    >
                      <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                    <button
                      onClick={() => setOpenOralId(isOpen ? null : q.id)}
                      className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors cursor-pointer"
                    >
                      {isOpen ? 'Փակել' : 'Պատասխան'}
                    </button>
                  </div>
                </div>

                {isOpen && (
                  <div className="mt-3.5 p-5 rounded-2xl bg-indigo-50/50 border border-indigo-200 space-y-3 text-sm sm:text-base">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-slate-900 font-semibold leading-relaxed">
                        <span className="text-indigo-700 font-bold mr-2 text-base sm:text-lg">Respuesta en español:</span>
                        {q.answerEs}
                      </p>
                      <button
                        onClick={() => speakSpanish(q.answerEs)}
                        title="Escuchar respuesta"
                        className="p-2 rounded-xl bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-50 shrink-0 cursor-pointer"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>

                    {(effectiveLang === 'hy' || effectiveLang === 'both') && (
                      <p className="text-slate-800 leading-relaxed pt-2 border-t border-indigo-100">
                        <span className="text-amber-800 font-bold mr-2">Հայերեն թարգմանություն՝</span>
                        {q.answerHy}
                      </p>
                    )}

                    {(effectiveLang === 'ru' || effectiveLang === 'both') && (
                      <p className="text-slate-700 leading-relaxed pt-2 border-t border-indigo-100">
                        <span className="text-sky-800 font-bold mr-2">Русский перевод:</span>
                        {q.answerRu}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
