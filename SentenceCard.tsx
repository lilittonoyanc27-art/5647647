import React, { useState } from 'react';
import { Volume2, CheckCircle, HelpCircle, Languages } from 'lucide-react';
import { SentenceItem, LangChoice } from './types';
import { speakSpanish } from './audioHelper';

interface SentenceCardProps {
  sentence: SentenceItem;
  exerciseType?: string;
  defaultLang?: LangChoice;
  userSelection?: string;
  onSelectOption?: (sentenceId: string | number, selectedKey: string) => void;
  showAllAnswers?: boolean;
}

export const SentenceCard: React.FC<SentenceCardProps> = ({
  sentence,
  userSelection,
  onSelectOption,
  showAllAnswers = false,
}) => {
  // Question translation is INDEPENDENT (null initially - only opens on click!)
  const [activeQuestionLang, setActiveQuestionLang] = useState<'hy' | 'ru' | 'both' | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  // EACH OPTION HAS ITS OWN INDEPENDENT TRANSLATION: { [optKey]: 'hy' | 'ru' | null }
  const [optionTranslations, setOptionTranslations] = useState<Record<string, 'hy' | 'ru' | null>>({});

  const handleAudio = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAudioPlaying(true);
    await speakSpanish(sentence.es);
    setIsAudioPlaying(false);
  };

  // Toggle question translation
  const handleQuestionSpanishClick = () => {
    setActiveQuestionLang((prev) => (prev ? null : 'hy'));
  };

  const handleQuestionArmenianClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveQuestionLang((prev) => (prev === 'hy' ? null : 'hy'));
  };

  const handleQuestionRussianClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveQuestionLang((prev) => (prev === 'ru' ? null : 'ru'));
  };

  const handleQuestionBothClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveQuestionLang((prev) => (prev === 'both' ? null : 'both'));
  };

  // Toggle option translation INDEPENDENTLY per option
  const toggleOptionLang = (optKey: string, lang: 'hy' | 'ru', e: React.MouseEvent) => {
    e.stopPropagation();
    setOptionTranslations((prev) => ({
      ...prev,
      [optKey]: prev[optKey] === lang ? null : lang,
    }));
  };

  // Bulk toggle for all options
  const setAllOptionsLang = (lang: 'hy' | 'ru' | null) => {
    if (!sentence.options) return;
    const updated: Record<string, 'hy' | 'ru' | null> = {};
    sentence.options.forEach((opt) => {
      updated[opt.key] = lang;
    });
    setOptionTranslations(updated);
  };

  const isCorrect = userSelection && sentence.correctAnswer && userSelection === sentence.correctAnswer;
  const isWrong = userSelection && sentence.correctAnswer && userSelection !== sentence.correctAnswer;
  const isAnswerVisible = showAllAnswers || showExplanation || Boolean(userSelection);

  return (
    <div
      className={`rounded-2xl sm:rounded-3xl border-2 transition-all duration-200 bg-white shadow-sm overflow-hidden ${
        isCorrect
          ? 'border-emerald-400 ring-2 ring-emerald-200 bg-emerald-50/20'
          : isWrong
          ? 'border-amber-400 ring-2 ring-amber-200 bg-amber-50/20'
          : 'border-slate-200 hover:border-indigo-400 hover:shadow-md'
      }`}
    >
      {/* 1. QUESTION SECTION - INDEPENDENT */}
      <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-50/90 to-white">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          {/* Spanish Question text */}
          <div
            onClick={handleQuestionSpanishClick}
            className="flex-1 cursor-pointer select-none group"
            title="Կտտացրո՛ւ հարցի թարգմանությունը բացելու համար"
          >
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 tracking-wide">
                ՀԱՐՑ · PREGUNTA
              </span>
              <span className="text-xs font-medium text-slate-400 group-hover:text-indigo-600 transition-colors">
                {activeQuestionLang ? '👆 Կտտացրո՛ւ հարցը փակելու համար' : '👆 Կտտացրո՛ւ հարցի թարգմանության համար'}
              </span>
            </div>

            {/* LARGE FONT FOR SPANISH QUESTION */}
            <p className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug tracking-tight font-serif group-hover:text-indigo-950 transition-colors">
              {sentence.es}
            </p>
          </div>

          {/* Audio Button */}
          <button
            onClick={handleAudio}
            title="Escuchar en español / Լսել իսպաներեն"
            className={`px-3.5 py-2.5 rounded-2xl border transition-all inline-flex items-center gap-2 shrink-0 self-start text-xs sm:text-sm font-bold cursor-pointer ${
              isAudioPlaying
                ? 'bg-indigo-600 text-white border-indigo-600 animate-pulse shadow-md'
                : 'bg-white hover:bg-indigo-50 text-indigo-700 border-indigo-200 hover:border-indigo-300 shadow-2xs'
            }`}
          >
            <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>{isAudioPlaying ? 'Հնչում է...' : 'Լսել'}</span>
          </button>
        </div>

        {/* QUESTION-ONLY TRANSLATION BUTTONS (VISIBLE IN ADVANCE) */}
        <div className="mt-4 pt-3.5 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-700">
            <span>Հարցի թարգմանություն / Перевод вопроса:</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleQuestionArmenianClick}
              className={`px-3.5 py-1.5 text-xs sm:text-sm font-bold rounded-xl border transition-all inline-flex items-center gap-1.5 cursor-pointer ${
                activeQuestionLang === 'hy'
                  ? 'bg-amber-500 text-white border-amber-600 shadow-md ring-2 ring-amber-200'
                  : 'bg-white text-slate-800 border-slate-300 hover:border-amber-400 hover:bg-amber-50/60 shadow-2xs'
              }`}
            >
              <span>🇦🇲</span>
              <span>Հարցը հայերեն</span>
              {activeQuestionLang === 'hy' && <span className="text-[10px] ml-1 opacity-90">✓ Բացված է</span>}
            </button>

            <button
              onClick={handleQuestionRussianClick}
              className={`px-3.5 py-1.5 text-xs sm:text-sm font-bold rounded-xl border transition-all inline-flex items-center gap-1.5 cursor-pointer ${
                activeQuestionLang === 'ru'
                  ? 'bg-sky-600 text-white border-sky-700 shadow-md ring-2 ring-sky-200'
                  : 'bg-white text-slate-800 border-slate-300 hover:border-sky-400 hover:bg-sky-50/60 shadow-2xs'
              }`}
            >
              <span>🇷🇺</span>
              <span>Вопрос на русском</span>
              {activeQuestionLang === 'ru' && <span className="text-[10px] ml-1 opacity-90">✓ Открыт</span>}
            </button>

            <button
              onClick={handleQuestionBothClick}
              className={`px-3 py-1.5 text-xs sm:text-sm font-bold rounded-xl border transition-all cursor-pointer ${
                activeQuestionLang === 'both'
                  ? 'bg-indigo-600 text-white border-indigo-700 shadow-md ring-2 ring-indigo-200'
                  : 'bg-white text-slate-700 border-slate-300 hover:border-indigo-400 hover:bg-indigo-50/60 shadow-2xs'
              }`}
            >
              ✨ Երկուսն էլ
            </button>
          </div>
        </div>
      </div>

      {/* REVEALED QUESTION TRANSLATION (Only shown when user clicks question buttons!) */}
      {activeQuestionLang && (
        <div className="px-5 py-4 sm:px-6 sm:py-5 bg-indigo-50/40 border-t-2 border-indigo-100 space-y-3">
          {(activeQuestionLang === 'hy' || activeQuestionLang === 'both') && sentence.hy && (
            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/95 border border-amber-200 shadow-2xs">
              <span className="text-xs font-black px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 shrink-0 mt-0.5">
                HY
              </span>
              <p className="text-base sm:text-lg font-medium text-slate-900 leading-relaxed">
                {sentence.hy}
              </p>
            </div>
          )}

          {(activeQuestionLang === 'ru' || activeQuestionLang === 'both') && sentence.ru && (
            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/95 border border-sky-200 shadow-2xs">
              <span className="text-xs font-black px-2 py-0.5 rounded-md bg-sky-100 text-sky-900 shrink-0 mt-0.5">
                RU
              </span>
              <p className="text-base sm:text-lg font-medium text-slate-800 leading-relaxed">
                {sentence.ru}
              </p>
            </div>
          )}
        </div>
      )}

      {/* 2. OPTIONS SECTION - COMPLETELY SEPARATE WITH INDEPENDENT ARM/RUS CHOICE PER OPTION! */}
      {sentence.options && sentence.options.length > 0 && (
        <div className="p-5 sm:p-6 border-t-2 border-slate-200 bg-white space-y-3">
          {/* Options Header with quick bulk controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-1">
            <div className="flex items-center gap-2">
              <Languages className="w-4 h-4 text-indigo-600" />
              <p className="text-xs sm:text-sm font-extrabold text-slate-700 uppercase tracking-wide">
                Տարբերակներ / Opciones (ընտրի՛ր ճիշտը):
              </p>
            </div>

            {/* Quick buttons to toggle translation for all options */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-400 font-medium hidden sm:inline">Բոլոր տարբերակները:</span>
              <button
                type="button"
                onClick={() => setAllOptionsLang('hy')}
                className="px-2.5 py-1 rounded-lg border border-amber-300 bg-amber-50 text-amber-900 font-bold hover:bg-amber-100 cursor-pointer"
              >
                🇦🇲 Բոլորը Հայ
              </button>
              <button
                type="button"
                onClick={() => setAllOptionsLang('ru')}
                className="px-2.5 py-1 rounded-lg border border-sky-300 bg-sky-50 text-sky-900 font-bold hover:bg-sky-100 cursor-pointer"
              >
                🇷🇺 Все Рус
              </button>
              <button
                type="button"
                onClick={() => setAllOptionsLang(null)}
                className="px-2 py-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 cursor-pointer"
                title="Փակել տարբերակների թարգմանությունները"
              >
                Փակել
              </button>
            </div>
          </div>

          {/* Grid of Options - Each option has independent translation buttons! */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {sentence.options.map((opt) => {
              const isSelected = userSelection === opt.key;
              const isOptionCorrect = sentence.correctAnswer === opt.key;
              const optLang = optionTranslations[opt.key]; // 'hy' | 'ru' | null

              let cardBorder = 'border-slate-300 bg-slate-50/70 hover:bg-slate-100/90 hover:border-slate-400 text-slate-900';

              if (userSelection || showAllAnswers) {
                if (isOptionCorrect) {
                  cardBorder = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold ring-2 ring-emerald-400';
                } else if (isSelected) {
                  cardBorder = 'border-rose-400 bg-rose-50 text-rose-950 ring-2 ring-rose-300';
                } else {
                  cardBorder = 'border-slate-200 bg-white text-slate-400 opacity-60';
                }
              } else if (isSelected) {
                cardBorder = 'border-indigo-600 bg-indigo-50 text-indigo-950 font-bold ring-2 ring-indigo-500';
              }

              return (
                <div
                  key={opt.key}
                  onClick={() => onSelectOption && onSelectOption(sentence.id, opt.key)}
                  className={`p-4 rounded-2xl border-2 transition-all flex flex-col justify-between cursor-pointer ${cardBorder}`}
                >
                  {/* Top row: Option text + ARM/RUS mini buttons on the option itself! */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <span className="text-base sm:text-lg font-bold text-slate-900 leading-snug block">
                        {opt.labelEs}
                      </span>
                    </div>

                    {/* Dedicated language buttons on THIS individual option */}
                    <div className="flex items-center gap-1 shrink-0 ml-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={(e) => toggleOptionLang(opt.key, 'hy', e)}
                        title="Տեսնել տարբերակը հայերենով"
                        className={`px-2 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                          optLang === 'hy'
                            ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                            : 'bg-white hover:bg-amber-50 text-slate-700 border-slate-300'
                        }`}
                      >
                        🇦🇲 Հայ
                      </button>

                      <button
                        type="button"
                        onClick={(e) => toggleOptionLang(opt.key, 'ru', e)}
                        title="Посмотреть вариант на русском"
                        className={`px-2 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                          optLang === 'ru'
                            ? 'bg-sky-600 text-white border-sky-700 shadow-xs'
                            : 'bg-white hover:bg-sky-50 text-slate-700 border-slate-300'
                        }`}
                      >
                        🇷🇺 Рус
                      </button>
                    </div>
                  </div>

                  {/* Option translation box (Only shown if user clicked ARM or RUS for THIS option!) */}
                  {optLang === 'hy' && opt.labelHy && (
                    <div className="mt-2.5 p-2.5 rounded-xl bg-amber-50/90 border border-amber-300 text-xs sm:text-sm font-medium text-amber-950 animate-fadeIn">
                      <span className="font-bold mr-1">🇦🇲 Հայերեն՝</span>
                      {opt.labelHy}
                    </div>
                  )}

                  {optLang === 'ru' && opt.labelRu && (
                    <div className="mt-2.5 p-2.5 rounded-xl bg-sky-50/90 border border-sky-300 text-xs sm:text-sm font-medium text-sky-950 animate-fadeIn">
                      <span className="font-bold mr-1">🇷🇺 Русский:</span>
                      {opt.labelRu}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. ANSWER & EXPLANATION FOOTER */}
      {(sentence.explanationEs || sentence.correctAnswer) && (
        <div className="px-5 py-3.5 sm:px-6 bg-slate-50 border-t-2 border-slate-200 flex flex-col gap-2.5">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <button
              onClick={() => setShowExplanation((prev) => !prev)}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-indigo-700 hover:text-indigo-900 transition-colors cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              {isAnswerVisible
                ? 'Պատասխանը և բացատրությունը / Ответ и объяснение'
                : 'Տեսնել ճիշտ պատասխանը / Показать правильный ответ'}
            </button>

            {sentence.correctAnswer && isAnswerVisible && (
              <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-black text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
                <CheckCircle className="w-4 h-4" />
                Ճիշտ՝ {sentence.correctAnswer}
              </span>
            )}
          </div>

          {isAnswerVisible && (
            <div className="p-4 rounded-2xl bg-white border border-slate-300 text-sm sm:text-base space-y-2 mt-1 shadow-2xs">
              {sentence.explanationEs && (
                <p className="text-slate-900 font-semibold leading-relaxed">
                  <span className="text-indigo-700 font-bold mr-1.5">Explicación:</span>
                  {sentence.explanationEs}
                </p>
              )}
              {sentence.explanationHy && (
                <p className="text-slate-800 leading-relaxed">
                  <span className="text-amber-800 font-bold mr-1.5">Հայերեն՝</span>
                  {sentence.explanationHy}
                </p>
              )}
              {sentence.explanationRu && (
                <p className="text-slate-700 leading-relaxed">
                  <span className="text-sky-800 font-bold mr-1.5">Русский:</span>
                  {sentence.explanationRu}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
