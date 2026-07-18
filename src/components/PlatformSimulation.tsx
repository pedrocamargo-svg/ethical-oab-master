import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle2, Lock, Play, ArrowLeft, ArrowRight, ChevronRight, X } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { daysData } from "@/data/day1";

const CHECKOUT_LINK = "https://pay.hub.la/iQcJ35LJetPx7qu6aKRD";

type SimSection = "mapa" | "raio-x" | "introducao" | "tpp" | "questao" | "comentario" | "finalizacao";

export default function PlatformSimulation() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showLockedDialog, setShowLockedDialog] = useState(false);
  const [section, setSection] = useState<SimSection>("mapa");
  const [disciplineIdx, setDisciplineIdx] = useState(0);
  const [topicIdx, setTopicIdx] = useState(0);
  const [questionIdx, setQuestionIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const dayData = daysData[1];
  const totalDays = 40;

  const currentDiscipline = dayData?.disciplines[disciplineIdx];
  const currentTopic = currentDiscipline?.topics[topicIdx];
  const currentQuestion = currentTopic?.questions[questionIdx];

  const handleDayClick = (dayNumber: number) => {
    if (dayNumber === 1) {
      setSection("raio-x");
      setDisciplineIdx(0);
      setTopicIdx(0);
      setQuestionIdx(0);
      setSelectedAnswer(null);
    } else {
      setShowLockedDialog(true);
    }
  };

  const handleBack = () => {
    if (section === "raio-x") setSection("mapa");
    else if (section === "introducao") setSection("raio-x");
    else if (section === "tpp") setSection("introducao");
    else if (section === "questao") { setSection("tpp"); setSelectedAnswer(null); }
    else if (section === "comentario") setSection("questao");
    else if (section === "finalizacao") {
      const lastDisc = dayData.disciplines[dayData.disciplines.length - 1];
      const lastTopic = lastDisc.topics[lastDisc.topics.length - 1];
      setDisciplineIdx(dayData.disciplines.length - 1);
      setTopicIdx(lastDisc.topics.length - 1);
      setQuestionIdx(lastTopic.questions.length - 1);
      setSection("comentario");
    }
  };

  const handleNext = () => {
    if (section === "raio-x") setSection("introducao");
    else if (section === "introducao") setSection("tpp");
    else if (section === "tpp") { setSection("questao"); setSelectedAnswer(null); }
    else if (section === "questao") setSection("comentario");
    else if (section === "comentario") {
      if (currentQuestion && questionIdx < currentTopic.questions.length - 1) {
        setQuestionIdx(prev => prev + 1);
        setSection("questao");
        setSelectedAnswer(null);
      } else if (topicIdx < currentDiscipline.topics.length - 1) {
        setTopicIdx(prev => prev + 1);
        setQuestionIdx(0);
        setSection("tpp");
        setSelectedAnswer(null);
      } else if (disciplineIdx < dayData.disciplines.length - 1) {
        setDisciplineIdx(prev => prev + 1);
        setTopicIdx(0);
        setQuestionIdx(0);
        setSection("introducao");
        setSelectedAnswer(null);
      } else {
        setSection("finalizacao");
      }
    } else if (section === "finalizacao") {
      setSection("mapa");
    }
  };

  const renderStudyContent = () => {
    if (!dayData) return null;

    switch (section) {
      case "raio-x":
        return (
          <div className="space-y-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-center text-red-600">DIA 1 - RAIO-X DO ESTUDO</h1>
            <Card className="border-2 border-red-500">
              <CardHeader className="bg-red-50">
                <CardTitle className="text-center text-lg sm:text-xl text-red-600">🎯 OBJETIVO DO DIA</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="text-sm sm:text-base leading-relaxed neutral-colors" dangerouslySetInnerHTML={{ __html: dayData.objective }} />
              </CardContent>
            </Card>
            <Card className="border-2 border-gray-300">
              <CardHeader><CardTitle className="text-xl">📚 Temas do Dia</CardTitle></CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {(() => {
                    let tppNum = 0;
                    return dayData.disciplines.flatMap((disc, dIdx) =>
                      disc.topics.map((topic, tIdx) => {
                        tppNum++;
                        return (
                          <Button key={`${dIdx}-${tIdx}`} variant="outline" className="border-red-300 hover:bg-red-50 text-sm"
                            onClick={() => { setDisciplineIdx(dIdx); setTopicIdx(tIdx); setQuestionIdx(0); setSelectedAnswer(null); setSection("tpp"); }}>
                            TPP {tppNum} - {topic.theme.length > 30 ? topic.theme.substring(0, 30) + "…" : topic.theme}
                          </Button>
                        );
                      })
                    );
                  })()}
                </div>
              </CardContent>
            </Card>
            <NavButtons onBack={handleBack} onNext={handleNext} backLabel="Voltar" nextLabel="Avançar" />
          </div>
        );

      case "introducao":
        if (!currentDiscipline) return null;
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-xl sm:text-2xl font-bold">DIA 1</h1>
              <h2 className="text-lg sm:text-xl font-semibold text-red-600">DISCIPLINA {disciplineIdx + 1}: {currentDiscipline.name.toUpperCase()}</h2>
              <h3 className="text-base sm:text-lg">ASSUNTO: {currentDiscipline.subject.toUpperCase()}</h3>
            </div>
            <Card className="border-2 border-red-500 bg-red-50">
              <CardHeader><CardTitle className="text-red-600">🔎 Temas Trabalhados</CardTitle></CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {currentDiscipline.themesWorked.map((theme, idx) => (
                    <li key={idx} className="flex items-start"><span className="text-red-600 mr-2">{idx + 1}.</span><span className="neutral-colors" dangerouslySetInnerHTML={{ __html: theme }} /></li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card className="border-2 border-gray-300">
              <CardHeader><CardTitle>📖 Dispositivos que você deve ler hoje</CardTitle></CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {currentDiscipline.devicesToRead.map((device, idx) => (
                    <li key={idx} className="flex items-start"><span className="mr-2">📖</span><span className="neutral-colors" dangerouslySetInnerHTML={{ __html: device }} /></li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <NavButtons onBack={handleBack} onNext={handleNext} backLabel="Voltar" nextLabel="Avançar" />
          </div>
        );

      case "tpp":
        if (!currentTopic) return null;
        let globalTppNumber = 0;
        for (let i = 0; i < disciplineIdx; i++) globalTppNumber += dayData.disciplines[i].topics.length;
        globalTppNumber += topicIdx + 1;
        return (
          <div className="space-y-6">
            <h1 className="text-xl sm:text-2xl font-bold text-center"><span className="bg-yellow-200 px-3 py-1 inline-block">{currentDiscipline.name}</span></h1>
            <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-1 rounded-lg shadow-lg">
              <Card className="border-4 border-purple-600 bg-purple-50">
                <CardHeader className="bg-purple-100">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-purple-900 text-xl font-bold">📚 TEMA</CardTitle>
                    <span className="text-purple-700 font-semibold text-sm bg-white px-3 py-1 rounded-full">TPP {globalTppNumber}</span>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-base sm:text-lg font-bold text-purple-900">{currentTopic.theme}</p>
                  {currentTopic.level && <p className="text-base text-purple-700 mt-3 font-semibold">📊 Nível: {currentTopic.level}</p>}
                </CardContent>
              </Card>
            </div>
            {currentTopic.legalText && (
              <Card className="border-2 border-yellow-600 bg-yellow-50">
                <CardHeader><CardTitle className="text-yellow-800">📜 Texto da Lei - Leitura Estratégica</CardTitle></CardHeader>
                <CardContent><div className="neutral-colors" dangerouslySetInnerHTML={{ __html: currentTopic.legalText }} /></CardContent>
              </Card>
            )}
            <Card className="border-2 border-red-500 bg-red-50">
              <CardHeader><CardTitle className="text-red-600 flex items-center gap-2"><span>⚠️</span> IMPORTANTE - Mini Resumo do Tema</CardTitle></CardHeader>
              <CardContent><div className="neutral-colors" dangerouslySetInnerHTML={{ __html: currentTopic.miniSummary }} /></CardContent>
            </Card>
            <NavButtons onBack={handleBack} onNext={handleNext} backLabel="Voltar" nextLabel="Questões" />
          </div>
        );

      case "questao":
        if (!currentQuestion) return null;
        const options = currentQuestion.options || [];
        return (
          <div className="space-y-6">
            <div className="text-sm sm:text-base leading-relaxed">
              <div className="neutral-colors" dangerouslySetInnerHTML={{ __html: currentQuestion.questionText }} />
            </div>
            <div className="space-y-3">
              {options.map((option) => {
                const isSelected = selectedAnswer === option.optionLetter;
                const isCorrect = option.optionLetter === currentQuestion.correctAnswer;
                const showResult = selectedAnswer !== null;
                return (
                  <button key={option.optionLetter} onClick={() => !selectedAnswer && setSelectedAnswer(option.optionLetter)} disabled={selectedAnswer !== null}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all
                      ${!showResult ? "border-gray-300 hover:bg-gray-50 cursor-pointer" : "cursor-not-allowed"}
                      ${showResult && isCorrect ? "border-green-500 bg-green-50" : ""}
                      ${showResult && isSelected && !isCorrect ? "border-red-500 bg-red-50" : ""}
                      ${showResult && !isCorrect && !isSelected ? "border-gray-300 bg-gray-50" : ""}
                    `}>
                    <div className="flex items-start gap-3">
                      <span className="font-bold text-lg">{option.optionLetter})</span>
                      <div className="flex-1"><span className="neutral-colors" dangerouslySetInnerHTML={{ __html: option.optionText }} /></div>
                      {showResult && isCorrect && <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />}
                      {showResult && isSelected && !isCorrect && <span className="text-red-600 text-2xl flex-shrink-0">✗</span>}
                    </div>
                  </button>
                );
              })}
            </div>
            <NavButtons onBack={handleBack} onNext={handleNext} backLabel="Voltar" nextLabel="Comentários" />
          </div>
        );

      case "comentario":
        if (!currentQuestion) return null;
        const comments = currentQuestion.strategicComments || [];
        const colors = ["bg-blue-50 border-blue-500", "bg-green-50 border-green-500", "bg-yellow-50 border-yellow-500", "bg-purple-50 border-purple-500"];
        return (
          <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-center">📝 COMENTÁRIOS ESTRATÉGICOS</h2>
            <div className="space-y-4">
              {comments.map((comment, idx) => (
                <Card key={idx} className={`border-2 ${colors[idx % colors.length]}`}>
                  <CardContent className="pt-6"><div className="strategic-comment" dangerouslySetInnerHTML={{ __html: comment }} /></CardContent>
                </Card>
              ))}
            </div>
            <NavButtons onBack={handleBack} onNext={handleNext} backLabel="Voltar" nextLabel="Continuar" />
          </div>
        );

      case "finalizacao": {
        let tppCounter = 0;
        const tppsByDiscipline: Record<string, Array<{ name: string }>> = {};
        dayData.disciplines.forEach((disc) => {
          if (!tppsByDiscipline[disc.name]) tppsByDiscipline[disc.name] = [];
          disc.topics.forEach((topic) => { tppCounter++; tppsByDiscipline[disc.name].push({ name: topic.name }); });
        });
        return (
          <div className="space-y-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-center">🎓 Parabéns! Você Concluiu o Dia 1</h1>
            <div className="text-center text-base sm:text-lg text-gray-700">Você treinou: ✔ {tppCounter} TPPs</div>
            <div className="space-y-6">
              {Object.entries(tppsByDiscipline).map(([discName, topics]) => (
                <Card key={discName} className="border-2 border-blue-500 bg-blue-50">
                  <CardHeader><CardTitle className="text-2xl text-blue-900">{discName}</CardTitle></CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {topics.map((t, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-lg"><CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" /><strong>{t.name}</strong></li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2 text-green-600">
                <CheckCircle2 className="w-6 h-6" />
                <span className="text-base sm:text-xl font-bold">Gostou? Desbloqueie os 40 dias completos!</span>
              </div>
              <Button onClick={() => window.open(CHECKOUT_LINK, "_blank")} className="bg-red-600 hover:bg-red-700 text-white px-8 py-5 text-lg font-bold rounded-xl shadow-lg hover:scale-105 transition-all">
                Quero todos os 40 dias <ChevronRight className="ml-2 w-5 h-5" />
              </Button>
              <Button variant="outline" onClick={() => setSection("mapa")} className="ml-4 px-6 py-5">
                Voltar ao Mapa
              </Button>
            </div>
          </div>
        );
      }

      default:
        return null;
    }
  };

  const renderMapa = () => (
    <div className="bg-white rounded-xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-4 sm:py-6 px-3 sm:px-4 rounded-t-xl">
        <div className="text-center mb-4">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">MAPA DA <span className="font-serif italic underline decoration-2 underline-offset-4">APROVAÇÃO</span></h1>
          <p className="text-red-100 text-xs sm:text-sm mt-1">Ciclo de 40 dias - Prepare-se para a OAB</p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold">Seu Progresso</span>
            <span className="text-lg font-bold">0/{totalDays}</span>
          </div>
          <Progress value={0} className="h-2 sm:h-3 bg-white/20" />
          <p className="text-xs text-red-100 mt-1">Comece sua jornada hoje!</p>
        </div>
      </div>

      {/* Grid */}
      <div className="p-3 sm:p-4 md:p-6">
        <div className="grid grid-cols-5 sm:grid-cols-5 md:grid-cols-8 gap-2 sm:gap-3">
          {Array.from({ length: totalDays }, (_, i) => i + 1).map((dayNumber) => {
            const isUnlocked = dayNumber === 1;
            return (
              <button
                key={dayNumber}
                onClick={() => handleDayClick(dayNumber)}
                className={`aspect-square flex flex-col items-center justify-center rounded-lg border-2 transition-all
                  ${isUnlocked ? "bg-white border-red-500 hover:bg-red-50 hover:scale-105 cursor-pointer shadow-sm" : "bg-gray-50 border-gray-300 cursor-pointer hover:border-gray-400"}
                `}
              >
                <span className={`text-lg sm:text-xl font-bold ${isUnlocked ? "text-red-600" : "text-gray-400"}`}>{dayNumber}</span>
                {isUnlocked ? (
                  <Play className="w-4 h-4 text-red-600" />
                ) : (
                  <Lock className="w-4 h-4 text-gray-400" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  // Fullscreen mode
  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-white overflow-auto">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-white border-b shadow-sm">
          <div className="container max-w-4xl mx-auto py-3 px-4 flex items-center justify-between">
            <Button onClick={() => { setIsFullscreen(false); setSection("mapa"); }} variant="outline" className="flex items-center gap-2 text-base font-bold px-5 py-3 border-2 border-red-500 text-red-600 hover:bg-red-50">
              <ArrowLeft className="w-5 h-5" /> Voltar à página
            </Button>
            {section !== "mapa" && (
              <Button onClick={() => setSection("mapa")} variant="ghost" className="text-sm text-gray-500">
                Voltar ao Mapa
              </Button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="container max-w-4xl mx-auto py-6 px-3 sm:px-4">
          {section === "mapa" ? renderMapa() : renderStudyContent()}
        </div>

        {/* Locked day dialog */}
        <Dialog open={showLockedDialog} onOpenChange={setShowLockedDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl text-red-600">🔒 Dia Bloqueado</DialogTitle>
              <DialogDescription className="text-base">
                Para desbloquear os outros 39 dias de conteúdo completo, adquira o Mapa da Aprovação.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex flex-col gap-3 sm:flex-col">
              <Button onClick={() => window.open(CHECKOUT_LINK, "_blank")} className="bg-red-600 hover:bg-red-700 w-full text-base py-5 font-bold">
                Desbloquear todos os dias <ChevronRight className="ml-2 w-5 h-5" />
              </Button>
              <Button variant="outline" onClick={() => setShowLockedDialog(false)} className="w-full">
                Voltar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // Inline preview (on sales page)
  return (
    <div className="relative">
      {/* Click overlay */}
      <div
        onClick={() => setIsFullscreen(true)}
        className="absolute inset-0 z-10 cursor-pointer flex items-center justify-center bg-black/0 hover:bg-black/5 transition-colors rounded-2xl group"
      >
        <div className="bg-red-600 text-white px-6 py-3 rounded-xl font-bold text-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
          <Play className="w-5 h-5" /> Clique para explorar
        </div>
      </div>

      {/* Mini preview */}
      <div className="rounded-2xl overflow-hidden border-2 border-foreground/10 shadow-xl pointer-events-none">
        {renderMapa()}
      </div>
    </div>
  );
}

function NavButtons({ onBack, onNext, backLabel, nextLabel }: { onBack: () => void; onNext: () => void; backLabel: string; nextLabel: string }) {
  return (
    <div className="flex justify-between items-center">
      <Button onClick={onBack} variant="outline" className="px-3 sm:px-6 py-4 sm:py-6 text-sm sm:text-base">
        <ArrowLeft className="mr-1 sm:mr-2 w-4 h-4 sm:w-5 sm:h-5" /> {backLabel}
      </Button>
      <Button onClick={onNext} className="bg-red-600 hover:bg-red-700 text-white px-4 sm:px-8 py-4 sm:py-6 text-sm sm:text-base">
        {nextLabel} <ArrowRight className="ml-1 sm:ml-2 w-4 h-4 sm:w-5 sm:h-5" />
      </Button>
    </div>
  );
}
