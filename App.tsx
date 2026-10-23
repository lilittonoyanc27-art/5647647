import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  CheckCircle,
  Search,
  Sparkles,
  Volume2,
  GraduationCap,
  Layers,
  HelpCircle,
  FileText,
  Eye,
  EyeOff,
  Filter,
} from 'lucide-react';
import { MAIN_EXERCISES, FIGURES_THEORY } from './dataMain';
import { ADDITIONAL_EXERCISES } from './dataAdditional';
import { LangChoice, ExerciseData } from './types';
import { SentenceCard } from './SentenceCard';
import { ExamPractice } from './ExamPractice';
import { MasteryChecklist } from './MasteryChecklist';
import { FlashcardsView } from './FlashcardsView';
import { speakSpanish } from './audioHelper';

export default function App() {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'main' | 'additional' | 'exam' | 'checklist' | 'flashcards' | 'theory'>('main');

  // Translation display preference
  // 'hy' = Armenian, 'ru' = Russian, 'both' = Armenian & Russian, 'hidden' = Click each Spanish sentence to reveal!
  const [globalLang, setGlobalLang] = useState<LangChoice>('both');

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');

  // Selected exercise within Main or Additional tab
  const [selectedExerciseNumber, setSelectedExerciseNumber] = useState<number | 'all'>('all');

  // User interactive answers map: { [sentenceId]: selectedKey }
  const [userAnswers, setUserAnswers] = useState<Record<string | number, string>>({});

  // Show all answers toggle
  const [showAllAnswers, setShowAllAnswers] = useState(false);

  const handleSelectOption = (sentenceId: string | number, selectedKey: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [sentenceId]: selectedKey,
    }));
  };

  // Filter exercises based on search and selected exercise
  const currentExercises: ExerciseData[] = useMemo(() => {
    const list = activeTab === 'main' ? MAIN_EXERCISES : ADDITIONAL_EXERCISES;
    return list.filter((ex) => {
      if (selectedExerciseNumber !== 'all' && ex.number !== selectedExerciseNumber) {
        return false;
      }
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const matchTitle =
        ex.titleEs.toLowerCase().includes(q) ||
        ex.titleHy.toLowerCase().includes(q) ||
        ex.titleRu.toLowerCase().includes(q);
      const matchSentence = ex.questions.some(
        (s) =>
          s.es.toLowerCase().includes(q) ||
          s.hy.toLowerCase().includes(q) ||
          s.ru.toLowerCase().includes(q)
      );
      return matchTitle || matchSentence;
    });
  }, [activeTab, selectedExerciseNumber, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased flex flex-col selection:bg-indigo-100 selection:text-indigo-900">
      {/* Top Application Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          {/* Logo & Subject info */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-700 to-indigo-500 text-white flex items-center justify-center shadow-md shadow-indigo-200">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-900">
                  Lengua Castellana · 1.º de ESO
                </h1>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                  7-րդ դասարան
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Վարժություններ՝ պատասխաններով և բացատրություններով | Իսպաներեն · Հայերեն · Ռուսերեն
              </p>
            </div>
          </div>

          {/* Quick Target Language Selector (Armenian / Russian / Both / Click-to-reveal) */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200/80">
            <span className="text-xs font-semibold text-slate-500 px-2 hidden sm:inline">
              Թարգմանություն / Перевод:
            </span>
            <button
              onClick={() => setGlobalLang('hy')}
              title="Ցուցադրել հայերեն թարգմանությունը"
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                globalLang === 'hy'
                  ? 'bg-white text-indigo-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🇦🇲 Հայերեն
            </button>
            <button
              onClick={() => setGlobalLang('ru')}
              title="Показывать русский перевод"
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                globalLang === 'ru'
                  ? 'bg-white text-indigo-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🇷🇺 Русский
            </button>
            <button
              onClick={() => setGlobalLang('both')}
              title="Ցուցադրել երկու լեզուներն էլ / Показать оба"
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                globalLang === 'both'
                  ? 'bg-white text-indigo-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ✨ Երկուսն էլ / Оба
            </button>
            <button
              onClick={() => setGlobalLang('hidden')}
              title="Թաքցնել թարգմանությունները. բացել յուրաքանչյուր նախադասության վրա սեղմելով / Скрыть (открывать по клику)"
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                globalLang === 'hidden'
                  ? 'bg-indigo-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <EyeOff className="w-3.5 h-3.5 inline mr-1" />
              Կտտացնելով
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-100 flex items-center justify-start sm:justify-center overflow-x-auto gap-2 py-2 scrollbar-none">
          <button
            onClick={() => {
              setActiveTab('main');
              setSelectedExerciseNumber('all');
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 flex items-center gap-2 ${
              activeTab === 'main'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            1. Ejercicios 1–12 (Հիմնական)
          </button>

          <button
            onClick={() => {
              setActiveTab('additional');
              setSelectedExerciseNumber('all');
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 flex items-center gap-2 ${
              activeTab === 'additional'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            2. Ejercicios adicionales (70)
          </button>

          <button
            onClick={() => setActiveTab('exam')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 flex items-center gap-2 ${
              activeTab === 'exam'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            3. Examen de práctica (20)
          </button>

          <button
            onClick={() => setActiveTab('checklist')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 flex items-center gap-2 ${
              activeTab === 'checklist'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            4. Lista de preparación & Repaso
          </button>

          <button
            onClick={() => setActiveTab('flashcards')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 flex items-center gap-2 ${
              activeTab === 'flashcards'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-4 h-4" />
            5. Flashcards (Figuras)
          </button>

          <button
            onClick={() => setActiveTab('theory')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 flex items-center gap-2 ${
              activeTab === 'theory'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            6. Teoría & Recordatorio
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Banner with Motivation & Instructions */}
        {(activeTab === 'main' || activeTab === 'additional') && (
          <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-lg relative overflow-hidden">
            <div className="relative z-10 max-w-4xl space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-indigo-200 border border-white/10">
                📚 Lengua Castellana — Preparación completa para 1.º de ESO
              </div>
              <h2 className="text-xl sm:text-2xl font-black">
                {activeTab === 'main'
                  ? 'Lengua Castellana y Literatura — 1.º de ESO'
                  : 'Ejercicios adicionales — 1.º de ESO'}
              </h2>
              <p className="text-xs sm:text-sm text-indigo-100 leading-relaxed opacity-90 font-medium">
                {activeTab === 'main'
                  ? 'Temas: Literatura popular y culta · Verso y prosa · Romance, leyenda, cuento y mito · Figuras literarias y metáforas'
                  : 'Temas: Literatura popular y culta, lenguaje literario, prosa y verso, romance, leyenda, mito, cuento, figuras literarias y metáforas'}
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-indigo-200">
                <span className="flex items-center gap-1">
                  <Volume2 className="w-3.5 h-3.5 text-indigo-300" /> Սեղմի՛ր բարձրախոսին՝ իսպաներեն արտասանությունը լսելու համար
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-indigo-300" /> Սեղմի՛ր ցանկացած նախադասության վրա՝ թարգմանությունը բացելու համար
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Filters and Search Bar (for exercises view) */}
        {(activeTab === 'main' || activeTab === 'additional') && (
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Որոնել նախադասություն, բառ կամ արտահայտություն... / Поиск фразы..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-sm placeholder:text-slate-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                >
                  Մաքրել
                </button>
              )}
            </div>

            {/* Quick Exercise Selector Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 sm:pb-0">
              <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 mr-1">
                <Filter className="w-3 h-3" /> Վարժություն:
              </span>
              <button
                onClick={() => setSelectedExerciseNumber('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shrink-0 ${
                  selectedExerciseNumber === 'all'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Բոլորը
              </button>
              {(activeTab === 'main' ? MAIN_EXERCISES : ADDITIONAL_EXERCISES).map((ex) => (
                <button
                  key={ex.id}
                  onClick={() => setSelectedExerciseNumber(ex.number)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shrink-0 ${
                    selectedExerciseNumber === ex.number
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  #{ex.number}
                </button>
              ))}
            </div>

            {/* Show all answers button */}
            <button
              onClick={() => setShowAllAnswers(!showAllAnswers)}
              className={`px-3.5 py-1.5 rounded-xl border text-xs font-semibold transition-all inline-flex items-center gap-1.5 ${
                showAllAnswers
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
              {showAllAnswers ? 'Թաքցնել բոլոր պատասխանները' : 'Ցուցադրել բոլոր պատասխանները'}
            </button>
          </div>
        )}

        {/* Tab 1: Main Exercises */}
        {activeTab === 'main' && (
          <div className="space-y-10">
            {currentExercises.map((exercise) => (
              <section
                key={exercise.id}
                className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-8 shadow-xs space-y-6"
              >
                {/* Exercise Header */}
                <div className="border-b border-slate-100 pb-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-indigo-100 text-indigo-800">
                      Ejercicio {exercise.number}
                    </span>
                    <span className="text-xs text-slate-400">
                      {exercise.questions.length} առաջադրանք
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-serif">
                    {exercise.titleEs}
                  </h3>
                  {(globalLang === 'hy' || globalLang === 'both' || globalLang === 'hidden') && (
                    <p className="text-sm sm:text-base font-bold text-amber-900 mt-1">
                      {exercise.titleHy}
                    </p>
                  )}
                  {(globalLang === 'ru' || globalLang === 'both') && (
                    <p className="text-xs sm:text-sm font-semibold text-sky-800 mt-0.5">
                      {exercise.titleRu}
                    </p>
                  )}

                  {/* Instruction */}
                  <div className="mt-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5 text-sm sm:text-base">
                    <p className="text-slate-900 font-semibold leading-relaxed">
                      <span className="text-indigo-600 font-extrabold mr-1.5">ES:</span>
                      {exercise.instructionEs}
                    </p>
                    {(globalLang === 'hy' || globalLang === 'both' || globalLang === 'hidden') && (
                      <p className="text-slate-700 leading-relaxed">
                        <span className="text-amber-800 font-bold mr-1.5">HY:</span>
                        {exercise.instructionHy}
                      </p>
                    )}
                    {(globalLang === 'ru' || globalLang === 'both') && (
                      <p className="text-slate-600 leading-relaxed">
                        <span className="text-sky-800 font-bold mr-1.5">RU:</span>
                        {exercise.instructionRu}
                      </p>
                    )}
                  </div>

                  {/* Word bank if fill-in-the-blank */}
                  {exercise.wordBank && (
                    <div className="mt-4 p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
                      <span className="text-xs sm:text-sm font-bold text-amber-900 block mb-2 uppercase tracking-wider">
                        Palabras — Բառեր — Список слов:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {exercise.wordBank.map((word) => (
                          <span
                            key={word}
                            onClick={() => speakSpanish(word)}
                            className="px-3.5 py-1.5 rounded-xl bg-white border border-amber-300 text-sm font-bold text-amber-950 shadow-2xs hover:bg-amber-100 cursor-pointer flex items-center gap-1.5"
                          >
                            {word}
                            <Volume2 className="w-3.5 h-3.5 text-amber-700" />
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Extra pedagogical notes */}
                  {exercise.extraNotes && (
                    <div className="mt-3 p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-100 text-xs sm:text-sm text-indigo-950 space-y-1">
                      <p className="font-semibold">{exercise.extraNotes.es}</p>
                      {(globalLang === 'hy' || globalLang === 'both') && (
                        <p className="text-slate-700">{exercise.extraNotes.hy}</p>
                      )}
                    </div>
                  )}
                </div>

                {/* If there is a reading text attached (Ejercicios 11 & 12) */}
                {exercise.readingTextEs && (
                  <div className="p-5 sm:p-7 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-indigo-600" />
                        <h4 className="text-xl sm:text-2xl font-black text-slate-900 font-serif">
                          {exercise.readingTitleEs}
                        </h4>
                      </div>
                      <button
                        onClick={() => speakSpanish(exercise.readingTextEs || '')}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm font-bold text-indigo-700 hover:bg-indigo-50 shadow-2xs cursor-pointer"
                      >
                        <Volume2 className="w-4 h-4" />
                        Լսել ամբողջ տեքստը
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Spanish original with LARGER FONT */}
                      <div className="p-5 rounded-2xl bg-white border-2 border-indigo-100 shadow-2xs">
                        <span className="text-xs font-bold text-indigo-700 uppercase tracking-wide block mb-2">
                          🇪🇸 Texto en español:
                        </span>
                        <p className="text-base sm:text-xl font-medium text-slate-900 whitespace-pre-line leading-relaxed font-serif">
                          {exercise.readingTextEs}
                        </p>
                      </div>

                      {/* Armenian translation with LARGER FONT */}
                      {(globalLang === 'hy' || globalLang === 'both' || globalLang === 'hidden') && (
                        <div className="p-5 rounded-2xl bg-amber-50/40 border-2 border-amber-200/70 shadow-2xs">
                          <span className="text-xs font-bold text-amber-900 uppercase tracking-wide block mb-2">
                            🇦🇲 Հայերեն թարգմանություն:
                          </span>
                          <p className="text-base sm:text-lg text-slate-800 whitespace-pre-line leading-relaxed">
                            {exercise.readingTextHy}
                          </p>
                        </div>
                      )}

                      {/* Russian translation */}
                      {(globalLang === 'ru' || globalLang === 'both') && (
                        <div className="p-4 rounded-2xl bg-sky-50/40 border border-sky-200/60 md:col-span-2">
                          <span className="text-xs font-bold text-sky-900 uppercase block mb-1">
                            🇷🇺 Русский перевод:
                          </span>
                          <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                            {exercise.readingTextRu}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Question List */}
                <div className="space-y-4">
                  {exercise.questions.map((q) => (
                    <SentenceCard
                      key={q.id}
                      sentence={{
                        ...q,
                        options: q.options || exercise.options,
                      }}
                      exerciseType={exercise.type}
                      defaultLang={globalLang}
                      userSelection={userAnswers[q.id]}
                      onSelectOption={handleSelectOption}
                      showAllAnswers={showAllAnswers}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

        {/* Tab 2: Additional 70 Exercises */}
        {activeTab === 'additional' && (
          <div className="space-y-10">
            {currentExercises.map((exercise) => (
              <section
                key={exercise.id}
                className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-8 shadow-xs space-y-6"
              >
                {/* Header */}
                <div className="border-b border-slate-100 pb-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-indigo-100 text-indigo-800">
                      Ejercicio {exercise.number} Adicional
                    </span>
                    <span className="text-xs text-slate-400">
                      {exercise.questions.length} առաջադրանք
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-serif">
                    {exercise.titleEs}
                  </h3>
                  {(globalLang === 'hy' || globalLang === 'both' || globalLang === 'hidden') && (
                    <p className="text-sm sm:text-base font-bold text-amber-900 mt-1">
                      {exercise.titleHy}
                    </p>
                  )}
                  {(globalLang === 'ru' || globalLang === 'both') && (
                    <p className="text-xs sm:text-sm font-semibold text-sky-800 mt-0.5">
                      {exercise.titleRu}
                    </p>
                  )}

                  {/* Instruction */}
                  <div className="mt-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1 text-xs sm:text-sm">
                    <p className="text-slate-800 font-medium">
                      <span className="text-indigo-600 font-bold mr-1">ES:</span>
                      {exercise.instructionEs}
                    </p>
                    {(globalLang === 'hy' || globalLang === 'both' || globalLang === 'hidden') && (
                      <p className="text-slate-700">
                        <span className="text-amber-800 font-semibold mr-1">HY:</span>
                        {exercise.instructionHy}
                      </p>
                    )}
                    {(globalLang === 'ru' || globalLang === 'both') && (
                      <p className="text-slate-600">
                        <span className="text-sky-800 font-semibold mr-1">RU:</span>
                        {exercise.instructionRu}
                      </p>
                    )}
                  </div>

                  {/* Word bank if fill-in */}
                  {exercise.wordBank && (
                    <div className="mt-3 p-3 rounded-2xl bg-amber-50/60 border border-amber-200">
                      <span className="text-xs font-bold text-amber-900 block mb-1.5 uppercase tracking-wider">
                        Palabras — Բառեր — Список слов:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {exercise.wordBank.map((word) => (
                          <span
                            key={word}
                            onClick={() => speakSpanish(word)}
                            className="px-2.5 py-1 rounded-lg bg-white border border-amber-300 text-xs font-semibold text-amber-950 shadow-2xs hover:bg-amber-100 cursor-pointer flex items-center gap-1"
                          >
                            {word}
                            <Volume2 className="w-3 h-3 text-amber-700" />
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* If reading text attached (Ejercicio 7 Adicional) */}
                {exercise.readingTextEs && (
                  <div className="p-5 sm:p-6 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-indigo-600" />
                        <h4 className="text-xl sm:text-2xl font-black text-slate-900 font-serif">
                          {exercise.readingTitleEs}
                        </h4>
                      </div>
                      <button
                        onClick={() => speakSpanish(exercise.readingTextEs || '')}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm font-bold text-indigo-700 hover:bg-indigo-50 shadow-2xs cursor-pointer"
                      >
                        <Volume2 className="w-4 h-4" />
                        Լսել ամբողջ տեքստը
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Spanish original with LARGER FONT */}
                      <div className="p-5 rounded-2xl bg-white border-2 border-indigo-100 shadow-2xs">
                        <span className="text-xs font-bold text-indigo-700 uppercase tracking-wide block mb-2">
                          🇪🇸 Texto en español:
                        </span>
                        <p className="text-base sm:text-xl font-medium text-slate-900 whitespace-pre-line leading-relaxed font-serif">
                          {exercise.readingTextEs}
                        </p>
                      </div>

                      {/* Armenian translation with LARGER FONT */}
                      {(globalLang === 'hy' || globalLang === 'both' || globalLang === 'hidden') && (
                        <div className="p-5 rounded-2xl bg-amber-50/40 border-2 border-amber-200/70 shadow-2xs">
                          <span className="text-xs font-bold text-amber-900 uppercase tracking-wide block mb-2">
                            🇦🇲 Հայերեն թարգմանություն:
                          </span>
                          <p className="text-base sm:text-lg text-slate-800 whitespace-pre-line leading-relaxed">
                            {exercise.readingTextHy}
                          </p>
                        </div>
                      )}

                      {(globalLang === 'ru' || globalLang === 'both') && (
                        <div className="p-5 rounded-2xl bg-sky-50/40 border-2 border-sky-200/70 shadow-2xs md:col-span-2">
                          <span className="text-xs font-bold text-sky-900 uppercase tracking-wide block mb-2">
                            🇷🇺 Русский перевод:
                          </span>
                          <p className="text-base sm:text-lg text-slate-700 whitespace-pre-line leading-relaxed">
                            {exercise.readingTextRu}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Questions */}
                <div className="space-y-4">
                  {exercise.questions.map((q) => (
                    <SentenceCard
                      key={q.id}
                      sentence={{
                        ...q,
                        options: q.options || exercise.options,
                      }}
                      exerciseType={exercise.type}
                      defaultLang={globalLang}
                      userSelection={userAnswers[q.id]}
                      onSelectOption={handleSelectOption}
                      showAllAnswers={showAllAnswers}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

        {/* Tab 3: Practice Exam */}
        {activeTab === 'exam' && <ExamPractice globalLang={globalLang} />}

        {/* Tab 4: Mastery Checklist & Oral Questions */}
        {activeTab === 'checklist' && <MasteryChecklist globalLang={globalLang} />}

        {/* Tab 5: Flashcards View */}
        {activeTab === 'flashcards' && <FlashcardsView globalLang={globalLang} />}

        {/* Tab 6: Complete Theory Cheatsheet */}
        {activeTab === 'theory' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                2. Las figuras literarias
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 font-serif">
                Գեղարվեստական արտահայտչամիջոցների ամբողջական հիշեցում (Recordatorio)
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Թեմաները բաժանված են երեք մակարդակների՝ հնչյունային, ձևաբանական-շարահյուսական և իմաստային։
              </p>
            </div>

            {/* Level 1: Nivel fónico */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-indigo-900 flex items-center gap-2 border-b border-indigo-100 pb-2">
                <span>🎵 Nivel fónico — Հնչյունային մակարդակ</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {FIGURES_THEORY.filter((f) => f.level === 'fónico').map((fig) => (
                  <div key={fig.name} className="p-4 rounded-2xl bg-indigo-50/40 border border-indigo-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-indigo-950 text-base">{fig.name}</h4>
                      <button
                        onClick={() => speakSpanish(fig.name + '. ' + fig.exampleEs)}
                        className="p-1 rounded-lg hover:bg-white text-indigo-700"
                        title="Escuchar"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-xs font-semibold text-amber-900">{fig.nameHy}</p>
                    <p className="text-xs text-slate-700">{fig.explanationEs}</p>
                    {(globalLang === 'hy' || globalLang === 'both') && (
                      <p className="text-xs text-slate-600">{fig.explanationHy}</p>
                    )}
                    <p className="text-xs font-mono bg-white p-2 rounded-lg border border-indigo-100 text-indigo-900">
                      «{fig.exampleEs}»
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Level 2: Nivel morfosintáctico */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-indigo-900 flex items-center gap-2 border-b border-indigo-100 pb-2">
                <span>📐 Nivel morfosintáctico — Ձևաբանական-շարահյուսական մակարդակ</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {FIGURES_THEORY.filter((f) => f.level === 'morfosintáctico').map((fig) => (
                  <div key={fig.name} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-900 text-base">{fig.name}</h4>
                      <button
                        onClick={() => speakSpanish(fig.name + '. ' + fig.exampleEs)}
                        className="p-1 rounded-lg hover:bg-white text-slate-700"
                        title="Escuchar"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-xs font-semibold text-amber-900">{fig.nameHy}</p>
                    <p className="text-xs text-slate-700">{fig.explanationEs}</p>
                    {(globalLang === 'hy' || globalLang === 'both') && (
                      <p className="text-xs text-slate-600">{fig.explanationHy}</p>
                    )}
                    <p className="text-xs font-mono bg-white p-2 rounded-lg border border-slate-200 text-slate-800">
                      «{fig.exampleEs}»
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Level 3: Nivel semántico (Metáfora) */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-indigo-900 flex items-center gap-2 border-b border-indigo-100 pb-2">
                <span>✨ Nivel semántico — Իմաստային մակարդակ (Metáfora)</span>
              </h3>
              <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50 via-white to-amber-50/30 border border-indigo-200 space-y-4">
                <div>
                  <h4 className="text-base font-extrabold text-indigo-950">
                    Metáfora — Փոխաբերություն (A es B, B, B de A)
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-700 mt-1">
                    Identificación de un elemento real con otro figurado por su semejanza.
                    Իրական տարրի նույնացումն է պատկերավոր տարրի հետ՝ դրանց նմանության հիման վրա։
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1.5">
                    <span className="font-bold text-indigo-700 block text-sm">1. A es B</span>
                    <p className="text-slate-600 font-medium">Aparecen ambos elementos unidos por verbo.</p>
                    <p className="text-slate-500">Ներկայացված են և՛ իրական, և՛ պատկերավոր տարրերը։</p>
                    <p className="font-mono text-indigo-900 font-semibold pt-1">«Tus ojos son estrellas»</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1.5">
                    <span className="font-bold text-indigo-700 block text-sm">2. B (pura)</span>
                    <p className="text-slate-600 font-medium">Aparece únicamente el elemento figurado.</p>
                    <p className="text-slate-500">Ներկայացված է միայն պատկերավոր տարրը։</p>
                    <p className="font-mono text-indigo-900 font-semibold pt-1">«Aparecieron dos perlas» (dientes)</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1.5">
                    <span className="font-bold text-indigo-700 block text-sm">3. B de A</span>
                    <p className="text-slate-600 font-medium">Aparecen ambos unidos por «de».</p>
                    <p className="text-slate-500">Երկու տարրերը կապված են «de» նախդիրով։</p>
                    <p className="font-mono text-indigo-900 font-semibold pt-1">«El oro de su cabello»</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12 text-center text-xs text-slate-500 space-y-1">
        <p className="font-medium text-slate-700">
          📚 Lengua Castellana — Preparación completa para 1.º de ESO (7-րդ դասարան)
        </p>
        <p>
          Español · Հայերեն · Русский | Բոլոր վարժությունները, բացատրությունները, ընթերցանության տեքստերը և փորձնական քննությունը
        </p>
      </footer>
    </div>
  );
}
