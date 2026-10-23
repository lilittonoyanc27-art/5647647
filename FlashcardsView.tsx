import React, { useState } from 'react';
import { Volume2, RotateCw, Check, Sparkles } from 'lucide-react';
import { FIGURES_THEORY } from './dataMain';
import { LangChoice } from './types';
import { speakSpanish } from './audioHelper';

interface FlashcardsViewProps {
  globalLang: LangChoice;
}

export const FlashcardsView: React.FC<FlashcardsViewProps> = ({ globalLang }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'fónico' | 'morfosintáctico' | 'semántico'>('all');

  const filteredCards = FIGURES_THEORY.filter((card) => {
    if (activeFilter === 'all') return true;
    return card.level === activeFilter;
  });

  const currentCard = filteredCards[currentIndex] || filteredCards[0];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % filteredCards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + filteredCards.length) % filteredCards.length);
  };

  const effectiveLang = globalLang === 'hidden' ? 'both' : globalLang;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 bg-slate-100 p-1.5 rounded-2xl">
        <button
          onClick={() => {
            setActiveFilter('all');
            setCurrentIndex(0);
            setIsFlipped(false);
          }}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeFilter === 'all' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Բոլորը / Все ({FIGURES_THEORY.length})
        </button>
        <button
          onClick={() => {
            setActiveFilter('fónico');
            setCurrentIndex(0);
            setIsFlipped(false);
          }}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeFilter === 'fónico' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Nivel fónico (Հնչյունային)
        </button>
        <button
          onClick={() => {
            setActiveFilter('morfosintáctico');
            setCurrentIndex(0);
            setIsFlipped(false);
          }}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeFilter === 'morfosintáctico' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Nivel morfosintáctico (Շարահյուսական)
        </button>
        <button
          onClick={() => {
            setActiveFilter('semántico');
            setCurrentIndex(0);
            setIsFlipped(false);
          }}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeFilter === 'semántico' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Nivel semántico (Իմաստային)
        </button>
      </div>

      {/* Main Flashcard Box */}
      <div className="relative">
        <div
          onClick={() => setIsFlipped(!isFlipped)}
          className="min-h-[360px] sm:min-h-[400px] w-full bg-gradient-to-br from-white via-indigo-50/20 to-white border-2 border-indigo-200/80 rounded-3xl p-6 sm:p-10 shadow-lg cursor-pointer flex flex-col justify-between transition-all hover:border-indigo-400 hover:shadow-xl"
        >
          {/* Card Top Indicator */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-indigo-100 text-indigo-800">
              Nivel {currentCard.level} · {currentIndex + 1} / {filteredCards.length}
            </span>
            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => speakSpanish(currentCard.name + '. ' + currentCard.exampleEs)}
                title="Escuchar pronunciación"
                className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-indigo-700 shadow-xs"
              >
                <Volume2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsFlipped(!isFlipped)}
                title="Girar tarjeta"
                className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 shadow-xs"
              >
                <RotateCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Front vs Back Content */}
          {!isFlipped ? (
            <div className="text-center py-8 space-y-4">
              <Sparkles className="w-8 h-8 text-indigo-500 mx-auto" />
              <h3 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-serif">
                {currentCard.name}
              </h3>
              {(effectiveLang === 'hy' || effectiveLang === 'both') && (
                <p className="text-lg font-bold text-amber-900">
                  {currentCard.nameHy}
                </p>
              )}
              {(effectiveLang === 'ru' || effectiveLang === 'both') && (
                <p className="text-base font-semibold text-sky-800">
                  {currentCard.nameRu}
                </p>
              )}
              <p className="text-xs text-slate-400 mt-4">
                Սեղմի՛ր քարտին բացատրությունը և օրինակը տեսնելու համար / Нажми, чтобы перевернуть
              </p>
            </div>
          ) : (
            <div className="py-4 space-y-4 text-left">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase text-indigo-700">Explicación en español:</span>
                <p className="text-base sm:text-lg font-medium text-slate-900 leading-relaxed">
                  {currentCard.explanationEs}
                </p>
              </div>

              {(effectiveLang === 'hy' || effectiveLang === 'both') && (
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-xs font-bold text-amber-800">Հայերեն բացատրություն՝</span>
                  <p className="text-sm text-slate-700 mt-0.5">
                    {currentCard.explanationHy}
                  </p>
                </div>
              )}

              {(effectiveLang === 'ru' || effectiveLang === 'both') && (
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-xs font-bold text-sky-800">Русское объяснение:</span>
                  <p className="text-sm text-slate-600 mt-0.5">
                    {currentCard.explanationRu}
                  </p>
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 bg-indigo-50/50 p-3.5 rounded-xl">
                <span className="text-xs font-bold text-indigo-900">Ejemplo / Օրինակ / Пример:</span>
                <p className="text-sm font-semibold text-indigo-950 font-serif mt-1">
                  «{currentCard.exampleEs}»
                </p>
                {(effectiveLang === 'hy' || effectiveLang === 'both') && (
                  <p className="text-xs text-slate-700 mt-0.5">
                    {currentCard.exampleHy}
                  </p>
                )}
                {(effectiveLang === 'ru' || effectiveLang === 'both') && (
                  <p className="text-xs text-slate-500 mt-0.5">
                    {currentCard.exampleRu}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Card Bottom Controls */}
          <div className="flex items-center justify-between text-xs text-slate-500 pt-4 border-t border-slate-100">
            <span>{isFlipped ? 'Սեղմի՛ր՝ դիմերեսը վերադառնալու համար' : 'Դիմերես / Лицевая сторона'}</span>
            <span className="flex items-center gap-1 font-semibold text-indigo-600">
              <RotateCw className="w-3.5 h-3.5" /> Շրջել
            </span>
          </div>
        </div>

        {/* Prev & Next Controls */}
        <div className="flex items-center justify-between mt-4">
          <button
            onClick={handlePrev}
            className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 font-semibold text-sm text-slate-700 shadow-xs cursor-pointer"
          >
            ← Նախորդը / Назад
          </button>
          <button
            onClick={handleNext}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 font-semibold text-sm text-white shadow-md cursor-pointer"
          >
            Հաջորդը / Вперед →
          </button>
        </div>
      </div>
    </div>
  );
};
