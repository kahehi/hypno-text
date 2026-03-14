'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Sparkles } from 'lucide-react';
import type { CaseInput } from '@/types';

interface DemoCase {
  approach: string;
  data: CaseInput;
}

const DEMO_CASES: DemoCase[] = [
  {
    approach: 'Ressourcenaktivierung',
    data: {
      caseTitle: 'Erstgespräch Leistungsangst',
      clientInitials: 'M.K.',
      clientAge: '34',
      context: 'Einzelsetting, ambulante hypnotherapeutische Praxis, Erstgespräch',
      concern: 'Ausgeprägte Prüfungsangst und Leistungsblockaden seit der Schulzeit. Körperliche Symptome wie Herzrasen, Schwitzen und Blackouts in Prüfungssituationen. Aktuell anstehende wichtige berufliche Zertifizierung.',
      goal: 'Mehr Gelassenheit in Leistungssituationen entwickeln, Zugang zu inneren Ressourcen und persönlicher Stärke finden. Prüfung erfolgreich ablegen.',
      hypotheses: 'Möglicherweise besteht eine ältere Konditionierung von Bewertungsangst, die in Leistungssituationen automatisch aktiviert wird. Denkbar wäre eine Verbindung mit frühen Erfahrungen von Versagensgefühlen. Es könnte darauf hindeuten, dass das innere Bild von sich selbst in Leistungssituationen noch nicht die tatsächlich vorhandenen Kompetenzen widerspiegelt.',
      resources: 'Hohe intrinsische Motivation, breites Fachwissen im Berufsfeld, unterstützendes soziales Umfeld, gute Selbstreflexionsfähigkeit, Interesse an innerer Arbeit.',
      observations: 'Spricht schnell und gedankenreich. Zeigt beim Thema Ressourcen sichtbare Aufhellung. Nutzt viele Konjunktive. Körperhaltung zunächst angespannt, löst sich im Gespräch.',
      notes: 'Erste Hypnoseerfahrung. Offene Grundhaltung. Bat ausdrücklich um ressourcenorientiertes Vorgehen.',
      inductionMinutes: 8,
      suggestionMinutes: 15,
      exitMinutes: 5,
    },
  },
  {
    approach: 'Metaphernarbeit',
    data: {
      caseTitle: 'Trauerprozess – Sinnkrise nach Verlust',
      clientInitials: 'E.B.',
      clientAge: '52',
      context: 'Einzelsetting, ambulante Praxis, Folgegespräch',
      concern: 'Tiefer Trauerprozess nach dem Tod des Lebenspartners vor 8 Monaten. Gefühl der inneren Leere, Orientierungslosigkeit und Sinnlosigkeit. Schwierigkeit, wieder Wurzeln zu fassen.',
      goal: 'Einen eigenen Weg durch die Trauer finden. Wieder Verbindung zu Lebensfreude und Bedeutung spüren – auf dem eigenen Tempo, ohne zu erzwingen.',
      hypotheses: 'Es zeigt sich möglicherweise ein Übergang zwischen zwei Lebensabschnitten, in dem das Alte noch nicht loslassen konnte und das Neue noch keine Form hat. Symbolsprache scheint besonders zugänglich – mehrfache Nutzung von Naturbildern im Gespräch.',
      resources: 'Starke Naturverbundenheit, breite kreative Ausdrucksfähigkeit, tiefes Vertrauen in zyklische Prozesse (Jahreszeiten), langjährige Meditationserfahrung.',
      observations: 'Spricht langsam und bildreich. Nutzt viele Metaphern spontan. Körperlich geerdet wirkend trotz emotionaler Last. Zeigt Resonanz auf poetische Sprache.',
      notes: 'Hat explizit nach einer Sitzung gefragt, in der "die Seele atmen darf". Kein Druck auf Ziele.',
      inductionMinutes: 10,
      suggestionMinutes: 20,
      exitMinutes: 8,
    },
  },
  {
    approach: 'Utilisation',
    data: {
      caseTitle: 'Einschlafstörung mit Kontrollbedürfnis',
      clientInitials: 'T.W.',
      clientAge: '41',
      context: 'Einzelsetting, Online-Sitzung, Folgegespräch',
      concern: 'Chronische Einschlafschwierigkeiten seit Jahren. Starkes Kontrollbedürfnis beim Einschlafen – versucht den Schlaf aktiv "herzustellen", was ihn weiter entfernt. Körperliche Erschöpfung, mentale Überaktivität.',
      goal: 'Nachts loslassen können. Schlaf als natürlichen Prozess zulassen, ohne ihn zu erzwingen.',
      hypotheses: 'Der Widerstand gegen den Schlaf könnte selbst als Zugang genutzt werden – Kontrolle nicht bekämpfen, sondern einbeziehen. Der aktive Geist ist möglicherweise eine Ressource, die umgelenkt werden will.',
      resources: 'Hohe Intelligenz und Analysefähigkeit, starke Willenskraft, gutes Körperbewusstsein tagsüber, Fähigkeit zu tiefer Konzentration.',
      observations: 'Sehr rationaler Kommunikationsstil. Beschreibt das Einschlafen wie ein Projekt das scheitert. Paradoxe Interventionen stoßen auf Interesse.',
      notes: 'Mag keine direktiven Ansätze. Kontrollbedürfnis selbst als Einladung nutzen.',
      inductionMinutes: 12,
      suggestionMinutes: 18,
      exitMinutes: 6,
    },
  },
  {
    approach: 'Zukunftsprojektion',
    data: {
      caseTitle: 'Neuorientierung nach Burnout',
      clientInitials: 'S.H.',
      clientAge: '45',
      context: 'Einzelsetting, ambulante Praxis, Erstgespräch',
      concern: 'Ausgebrannt nach 20 Jahren im selben Beruf. Aktuell krankgeschrieben. Tiefe Unsicherheit über die berufliche Zukunft. Gleichzeitig Sehnsucht nach Veränderung und Angst davor.',
      goal: 'Eine klare innere Richtung spüren. Den nächsten Schritt aus einer Haltung der Stärke heraus gehen können – nicht aus Zwang.',
      hypotheses: 'Möglicherweise ist die Erschöpfung auch ein Signal, dass alte Werte und Rollen nicht mehr stimmig sind. Zukunftsorientierung über Pseudo-Orientierung in der Zeit könnte Zugang zur eigenen Vision schaffen.',
      resources: 'Breite Lebens- und Berufserfahrung, ausgeprägte Selbstreflexionsfähigkeit, klares Wertebewusstsein im Privatleben, Fähigkeit zur Vorstellung von konkreten Bildern.',
      observations: 'Wirkt erleichtert beim Sprechen über Möglichkeiten statt Problemen. Lebhaftere Körpersprache bei Zukunftsfragen. Nutzt das Wort "eigentlich" häufig.',
      notes: 'Keine konkrete Berufsentscheidung erzwingen – Richtung und Stimmigkeit stärken.',
      inductionMinutes: 10,
      suggestionMinutes: 20,
      exitMinutes: 7,
    },
  },
  {
    approach: 'Altersregression zu Ressourcen',
    data: {
      caseTitle: 'Chronisches Minderwertigkeitsgefühl',
      clientInitials: 'L.G.',
      clientAge: '38',
      context: 'Einzelsetting, ambulante Praxis, Folgegespräch',
      concern: 'Tiefes, lang anhaltendes Gefühl, nicht gut genug zu sein. Selbstsabotage in beruflichen und privaten Situationen. Innerer Kritiker sehr präsent.',
      goal: 'Zugang zu einem inneren Ort finden, an dem Würde und Selbstwert ursprünglich erlebt wurden. Kontakt mit dem Teil, der sich selbst kennt und schätzt.',
      hypotheses: 'Es lässt sich vermuten, dass frühere Erlebnisse von Stärke und natürlichem Selbstsein existieren – möglicherweise in der Kindheit vor der Internalisierung von Kritik. Eine Altersregression zu Ressourcen könnte diesen Zugang öffnen.',
      resources: 'Tiefe Empathiefähigkeit, starke kreative Energie, Fähigkeit zur Selbstbeobachtung, Interesse an innerer Arbeit und Kindheitserinnerungen.',
      observations: 'Erzählt von Kindheitserinnerungen sehr lebendig. Gesicht hellt sich auf bei Erinnerungen an freies Spielen. Braucht Erlaubnis für Selbstmitgefühl.',
      notes: 'Sorgfalt beim Zeitreise-Ansatz – kein Aufzwingen. Nur einladend und sichernd.',
      inductionMinutes: 10,
      suggestionMinutes: 22,
      exitMinutes: 8,
    },
  },
  {
    approach: 'Symptomverschreibung',
    data: {
      caseTitle: 'Perfektionismus und Kontrollzwang',
      clientInitials: 'A.R.',
      clientAge: '29',
      context: 'Einzelsetting, ambulante Praxis, Erstgespräch',
      concern: 'Ausgeprägter Perfektionismus, der zu Blockaden und Überarbeitung führt. Das Symptom soll verschwinden – gleichzeitig ist es eng mit Identität verknüpft. Erlebnis: Nur perfekte Arbeit ist akzeptabel.',
      goal: 'Mehr Leichtigkeit im Umgang mit Unvollständigem. Erkennen, dass Exzellenz und Kontrolle auch dienen können.',
      hypotheses: 'Der Perfektionismus schützt möglicherweise vor tieferer Angst (Ablehnung, Versagen). Eine paradoxe Nutzung des Symptoms – Kontrolle als Stärke würdigen statt bekämpfen – könnte mehr Spielraum schaffen.',
      resources: 'Außergewöhnliche Sorgfalt und Qualitätsbewusstsein, hohe Zuverlässigkeit, Fähigkeit zu tiefer Konzentration, Freude an Exzellenz.',
      observations: 'Spricht präzise und strukturiert. Gerät in Anspannung bei Fehlerthemen. Sichtliche Erleichterung wenn Stärken benannt werden.',
      notes: 'Symptomverschreibung feinfühlig einsetzen – Würdigung vor Umdeutung.',
      inductionMinutes: 8,
      suggestionMinutes: 15,
      exitMinutes: 5,
    },
  },
  {
    approach: 'Dissoziation & Beobachterposition',
    data: {
      caseTitle: 'Belastungsreaktion nach Arbeitsunfall',
      clientInitials: 'R.F.',
      clientAge: '47',
      context: 'Einzelsetting, ambulante Praxis, Erstgespräch',
      concern: 'Belastungsreaktion nach einem Arbeitsunfall vor 4 Monaten. Intrusive Bilder, Schreckhaftigkeit, Vermeidung des Unfallortes. Schwierigkeit, das Erlebte in die Lebensgeschichte einzuordnen.',
      goal: 'Das Erlebte aus sicherem Abstand betrachten können. Inneren Frieden mit dem Geschehenen finden – ohne es wegdrücken zu müssen.',
      hypotheses: 'Eine schützende Distanz zum belastenden Erleben könnte als erste Phase hilfreich sein. Dissoziation nicht als Symptom bekämpfen, sondern als schützende Ressource würdigen und regulieren.',
      resources: 'Gute Fähigkeit zur Visualisierung, starker Überlebenswille, unterstützendes familiäres Umfeld, Fähigkeit zur Selbstbeobachtung.',
      observations: 'Spricht über das Ereignis in der dritten Person ("man"). Körperlich unruhig wenn das Thema direkt angesprochen wird. Entspannt sich bei Naturbildern.',
      notes: 'Traumasensible Vorgehensweise. Sicherheit und Kontrolle priorisieren. Niemals überwältigen.',
      inductionMinutes: 12,
      suggestionMinutes: 20,
      exitMinutes: 10,
    },
  },
  {
    approach: 'Teilearbeit',
    data: {
      caseTitle: 'Innere Zerrissenheit – Lebensentscheidung',
      clientInitials: 'C.M.',
      clientAge: '36',
      context: 'Einzelsetting, ambulante Praxis, Folgegespräch',
      concern: 'Lähmende Ambivalenz bei einer wichtigen Lebensentscheidung (Beziehung beenden oder neu gestalten). Gefühl tief gespaltener innerer Stimmen. Erschöpfung durch den inneren Kampf.',
      goal: 'Die verschiedenen inneren Anteile besser verstehen und in Dialog bringen. Einen inneren Raum finden, in dem alle Stimmen gehört werden können.',
      hypotheses: 'Es zeigt sich möglicherweise ein innerer Konflikt zwischen einem schützenden Anteil (Status quo erhalten) und einem wachstumshungrigen Anteil (Veränderung). Teilearbeit könnte einen Raum schaffen, in dem beide gehört werden ohne zu kämpfen.',
      resources: 'Ausgeprägte Selbstreflexionsfähigkeit, Fähigkeit zu inneren Dialogen, hohe emotionale Intelligenz, Vertrautheit mit psychologischen Konzepten.',
      observations: 'Nutzt spontan Bilder wie "ein Teil von mir will..., aber ein anderer Teil...". Wirkt erleichtert wenn innere Konflikte externalisiert beschrieben werden.',
      notes: 'Keine Seite bevorzugen. Alle Anteile würdigen. Kein Druck auf Entscheidung.',
      inductionMinutes: 10,
      suggestionMinutes: 25,
      exitMinutes: 8,
    },
  },
  {
    approach: 'Dissoziation & Beobachterposition',
    data: {
      caseTitle: 'Geburtsangst – Schmerzen bevorstehende Geburt',
      clientInitials: 'N.V.',
      clientAge: '29',
      context: 'Einzelsetting, ambulante Praxis, Erstgespräch, Geburtsvorbereitung',
      concern: 'Ausgeprägte Angst vor den Schmerzen der bevorstehenden Geburt (32. SSW, erstes Kind). Katastrophisierende Gedanken beim Vorstellen der Wehen. Körperliche Anspannung und Atemstörungen wenn das Thema aufkommt. Schlafstörungen durch gedankliche Vorwegnahme.',
      goal: 'Innere Distanz zum antizipierten Schmerz entwickeln. Den Körper als kompetent und vorbereitet erleben. Ruhige, zugewandte Präsenz für die Geburt finden – mit dem Baby, nicht gegen den Schmerz.',
      hypotheses: 'Möglicherweise wird Schmerz als unkontrollierbares Überwältigtwerden erlebt statt als natürlicher Körperprozess. Denkbar wäre, dass die Dissoziation – als schützende Beobachterperspektive – Raum für Handlungsfähigkeit inmitten intensiver Empfindungen schaffen kann. Die Verbindung zum Baby könnte ein stabilisierender Ressourceanker sein.',
      resources: 'Regelmäßige Geburtsvorbereitung und Yoga, gute Partnerschaft und Unterstützung, tiefes Vertrauen in medizinisches Team, starke emotionale Verbindung zum ungeborenen Kind, Fähigkeit zu körperlicher Selbstwahrnehmung.',
      observations: 'Atmet flacher wenn über Schmerzen gesprochen wird. Entspannt sich sichtlich beim Thema Baby und Verbindung. Zeigt hohe Bereitschaft für innere Arbeit. Hat bereits positive Erfahrungen mit Atemübungen.',
      notes: 'Hypnoseerfahrung: keine. Wunsch nach sanfter, körperorientierter Herangehensweise. Geburtstermin in ca. 8 Wochen.',
      inductionMinutes: 10,
      suggestionMinutes: 20,
      exitMinutes: 8,
    },
  },
  {
    approach: 'Körperanker & Verkörperung',
    data: {
      caseTitle: 'Chronische Rückenschmerzen ohne Befund',
      clientInitials: 'B.S.',
      clientAge: '55',
      context: 'Einzelsetting, ambulante Praxis, Folgegespräch',
      concern: 'Chronische Rückenschmerzen seit 3 Jahren, medizinisch keine strukturelle Ursache gefunden. Enge Verbindung zwischen Stresssituationen und Schmerzintensität. Gefühl, die Last des Alltags "zu tragen".',
      goal: 'Einen anderen Umgang mit dem Körper finden. Somatische Ressourcen entdecken – Stellen im Körper, die sich gut anfühlen. Den Schmerz als Botschaft verstehen dürfen.',
      hypotheses: 'Es könnte eine enge Verbindung zwischen emotionalen Lasten (Verantwortung, Kontrolle) und der körperlichen Manifestation bestehen. Somatische Ressourcenarbeit könnte Zugang zu Erleichterung und Regulierung schaffen.',
      resources: 'Gutes Körperbewusstsein in schmerzfreien Momenten, Erfahrung mit Atem- und Körperarbeit, Fähigkeit zur Körperwahrnehmung, tiefe Sehnsucht nach Entlastung.',
      observations: 'Spricht viel über den Körper und seine Signale. Atmet flacher wenn über Stresssituationen gesprochen wird. Zeigt sichtliche Erleichterung bei Körperexploration in sicheren Bereichen.',
      notes: 'Schmerzbereich nicht direkt adressieren – zu nicht-schmerzhaften Körperstellen arbeiten.',
      inductionMinutes: 12,
      suggestionMinutes: 20,
      exitMinutes: 8,
    },
  },
];

interface Props {
  onLoad: (data: CaseInput) => void;
}

export default function DemoCaseButton({ onLoad }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(prev => !prev)}
        className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all font-medium"
      >
        <Sparkles size={14} />
        Demo-Fall laden
        <ChevronDown size={13} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1 z-50 w-72 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden">
          <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest px-4 pt-3 pb-2">
            Therapeutischer Ansatz
          </p>
          <div className="max-h-80 overflow-y-auto pb-1">
            {DEMO_CASES.map(({ approach, data }) => (
              <button
                key={approach}
                type="button"
                onClick={() => {
                  onLoad(data);
                  setOpen(false);
                }}
                className="w-full text-left px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <span className="block text-sm font-medium text-gray-800 dark:text-gray-200">
                  {approach}
                </span>
                <span className="block text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                  {data.caseTitle}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
