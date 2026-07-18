export interface QuestionOption {
  optionLetter: string;
  optionText: string;
}

export interface Question {
  id: number;
  questionText: string;
  options: QuestionOption[];
  correctAnswer: string;
  strategicComments: string[];
}

export interface Topic {
  id: number;
  theme: string;
  name: string;
  level: string;
  legalText: string;
  miniSummary: string;
  questions: Question[];
}

export interface Discipline {
  name: string;
  subject: string;
  themesWorked: string[];
  devicesToRead: string[];
  additionalInfo: string;
  topics: Topic[];
}

export interface DayData {
  dayNumber: number;
  objective: string;
  objectiveDescription: string;
  disciplines: Discipline[];
  finalStrategy: string;
}

export const day1Data: DayData = {
  dayNumber: 1,
  objective: "Consolidar dois pilares estruturais da prova da OAB:<br/>• <u>Ética Profissional</u> (altíssima incidência)<br/>• <u>Direito Constitucional</u> – Direitos Individuais (Art. 5º da CF)",
  objectiveDescription: "Hoje você trabalha <u>núcleo duro da prova</u>. São temas recorrentes, com padrão clássico de cobrança pela FGV.",
  disciplines: [
    {
      name: "ÉTICA PROFISSIONAL",
      subject: "Atividade da Advocacia",
      themesWorked: [
        "<u>Renúncia do Mandato</u>",
        "<u>Atos Privativos de Advocacia</u>",
        "<u>Prerrogativas do Advogado</u>",
        "<u>Infrações Disciplinares (Abandono da Causa)</u>",
        "<u>Visto em Atos Constitutivos e Exercício Ilegal da Advocacia</u>"
      ],
      devicesToRead: [
        "<u>Art. 1º do EOAB</u>",
        "<u>Art. 4º do EOAB</u>",
        "<u>Art. 5º, §3º do EOAB</u>",
        "<u>Art. 7º do EOAB</u>",
        "<u>Art. 22 e 23 do EOAB</u>",
        "<u>Art. 34, XI do EOAB</u>",
        "<u>Art. 112 do CPC</u>"
      ],
      additionalInfo: "👉 Ética é matéria literal.<br/>👉 A FGV cobra exatamente o texto da lei, com pequenas inversões.",
      topics: [
        {
          id: 1,
          theme: "Renúncia do Mandato (Art. 5º, §3º, EOAB + Art. 112 CPC)",
          name: "Renúncia do Mandato",
          level: "Médio",
          legalText: "🔹 CPC, Art. 112; EOAB, Art. 5º, §3º",
          miniSummary: "✅ Renúncia = ato do advogado<br/>✅ Exige notificação ao cliente<br/>✅ Mantém responsabilidade por 10 dias<br/>✅ Pode cessar antes se houver substituição",
          questions: [
            {
              id: 1,
              questionText: "Maria, advogada, decide renunciar ao mandato que lhe foi outorgado por seu cliente em ação judicial. Após comunicar formalmente a renúncia, o cliente <span class='text-red-600 font-bold'>não</span> constitui novo advogado. Considerando o Estatuto da Advocacia e o CPC, é correto afirmar que Maria",
              options: [
                { optionLetter: "A", optionText: "deixa imediatamente de responder pelo processo após a notificação." },
                { optionLetter: "B", optionText: "permanece responsável pelo processo por 10 dias após a notificação, salvo substituição anterior." },
                { optionLetter: "C", optionText: "somente deixará de responder após homologação judicial." },
                { optionLetter: "D", optionText: "somente deixará de responder após o trânsito em julgado da ação." }
              ],
              correctAnswer: "B",
              strategicComments: [
                "<h3>🔎 A) Fundamento Legal Essencial</h3><p>Art. 112 do CPC e Art. 5º, §3º, do EOAB.</p><p>A regra é clara: Renúncia <span class='text-red-600 font-bold'>não</span> encerra imediatamente a responsabilidade. O advogado continua responsável por 10 dias após a notificação.</p>",
                "<h3>⚠ B) Pegadinha da FGV</h3><p>A banca costuma testar:</p><p>\"comunicou\" → mas <span class='text-red-600 font-bold'>não</span> menciona o prazo</p><p>alternativa dizendo que a responsabilidade cessa imediatamente</p><p>Isso está errado.</p>",
                "<h3>🧠 C) Como Resolver na Prova</h3><p>Pergunte:</p><p>✅ Houve notificação? → <span class='text-green-600 font-bold'>Sim</span>.</p><p>✅ Existe prazo legal? → <span class='text-green-600 font-bold'>Sim</span>, 10 dias.</p><p>✅ Há substituição? → <span class='text-red-600 font-bold'>Não</span>.</p><p>Logo, mantém responsabilidade.</p>",
                "<h3>🔁 D) Revisão Rápida</h3><p>✅ Pode renunciar a qualquer momento</p><p>✅ Deve notificar o cliente</p><p>✅ Mantém responsabilidade por 10 dias</p><p>✅ Exceção: substituição antes do prazo</p>"
              ]
            }
          ]
        },
        {
          id: 2,
          theme: "Atos Privativos de Advocacia",
          name: "Atos Privativos de Advocacia",
          level: "Médio",
          legalText: "🔹 Art. 1º, EOAB; Art. 4º, EOAB",
          miniSummary: "✅ Postulação em juízo = atividade privativa<br/>✅ Consultoria jurídica = também é privativa<br/>✅ Bacharel sem OAB <span class='text-red-600 font-bold'>não</span> pode exercer<br/>✅ Ato praticado sem inscrição é nulo",
          questions: [
            {
              id: 2,
              questionText: "João, bacharel em Direito <span class='text-red-600 font-bold'>não</span> inscrito na OAB, presta consultoria jurídica remunerada a determinada empresa. À luz do Estatuto da Advocacia, essa conduta é",
              options: [
                { optionLetter: "A", optionText: "válida, pois <span class='text-red-600 font-bold'>não</span> envolve atuação judicial." },
                { optionLetter: "B", optionText: "válida se houver contrato escrito." },
                { optionLetter: "C", optionText: "nula, por se tratar de atividade privativa de advogado." },
                { optionLetter: "D", optionText: "válida, mas sujeita apenas a multa administrativa." }
              ],
              correctAnswer: "C",
              strategicComments: [
                "<h3>🔎 A) Fundamento Legal Essencial</h3><p>Art. 1º, II e Art. 4º do EOAB. Consultoria jurídica é atividade privativa. Quem <span class='text-red-600 font-bold'>não</span> é inscrito → <span class='text-red-600 font-bold'>não</span> pode exercer.</p>",
                "<h3>⚠ B) Pegadinha da FGV</h3><p>A banca tenta limitar atividade privativa apenas à atuação judicial. Isso é errado. Consultoria também é atividade privativa.</p>",
                "<h3>🧠 C) Como Resolver na Prova</h3><p>Pergunte:</p><p>✅ É atividade jurídica? → <span class='text-green-600 font-bold'>Sim</span>.</p><p>✅ Está no art. 1º? → <span class='text-green-600 font-bold'>Sim</span>.</p><p>✅ Tem inscrição na OAB? → <span class='text-red-600 font-bold'>Não</span>.</p><p>Logo, o ato é nulo.</p>",
                "<h3>🔁 D) Revisão Rápida</h3><p>✅ Postular = privativo</p><p>✅ Consultoria = privativo</p><p>✅ Sem OAB = ato nulo</p>"
              ]
            }
          ]
        },
        {
          id: 3,
          theme: "Prerrogativas do Advogado – Comunicação com Cliente Preso e Inviolabilidade",
          name: "Prerrogativas do Advogado",
          level: "Médio",
          legalText: "🔹 Estatuto da Advocacia – Art. 7º, incisos II e III.",
          miniSummary: "Prerrogativas <span class='text-red-600 font-bold'>NÃO</span> são privilégios. São garantias para assegurar a defesa.<br/><br/>Pontos centrais cobrados pela FGV:<br/>✅ Comunicação reservada com cliente preso<br/>✅ Independe de procuração<br/>✅ Inviolabilidade do escritório<br/>✅ Restrição somente por decisão judicial fundamentada",
          questions: [
            {
              id: 3,
              questionText: "Advogado comparece à delegacia para entrevistar cliente preso preventivamente. A autoridade policial impede a conversa sob o argumento de que o advogado ainda <span class='text-red-600 font-bold'>não</span> apresentou procuração nos autos. À luz do Estatuto da Advocacia, a conduta da autoridade é",
              options: [
                { optionLetter: "A", optionText: "correta, pois a comunicação depende de procuração formal." },
                { optionLetter: "B", optionText: "correta, pois o advogado somente pode atuar após habilitação nos autos." },
                { optionLetter: "C", optionText: "incorreta, pois o advogado tem direito de comunicar-se reservadamente com cliente preso, ainda que sem procuração." },
                { optionLetter: "D", optionText: "incorreta apenas se o cliente já tiver sido denunciado." }
              ],
              correctAnswer: "C",
              strategicComments: [
                "<h3>🔎 A) Fundamento Essencial</h3><p>Art. 7º, III, EOAB. O advogado pode comunicar-se com cliente preso:</p><p>• Pessoalmente</p><p>• Reservadamente</p><p>• Mesmo sem procuração</p>",
                "<h3>⚠ B) Pegadinha da FGV</h3><p>A banca tenta exigir:</p><p>• Procuração</p><p>• Habilitação formal</p><p>• Existência de processo judicial</p><p>Nada disso é necessário.</p>",
                "<h3>🧠 C) Como Resolver na Prova</h3><p>Pergunte:</p><p>• O cliente está preso? → <span class='text-green-600 font-bold'>Sim</span>.</p><p>• O advogado quer conversar? → <span class='text-green-600 font-bold'>Sim</span>.</p><p>• Precisa de procuração? → <span class='text-red-600 font-bold'>Não</span>.</p><p>Logo, a autoridade violou prerrogativa.</p>",
                "<h3>🔁 D) Revisão Rápida</h3><p>✅ Comunicação reservada</p><p>✅ Independe de procuração</p><p>✅ É prerrogativa funcional</p>"
              ]
            }
          ]
        },
        {
          id: 4,
          theme: "Infração Disciplinar – Abandono da Causa",
          name: "Infração Disciplinar – Abandono da Causa",
          level: "Médio",
          legalText: "📖 Estatuto da Advocacia – Art. 34, XI.",
          miniSummary: "Constitui infração disciplinar:<br/>✅ Abandonar a causa<br/>✅ Sem justo motivo<br/>✅ Sem comunicar previamente o cliente<br/><br/>⚠ Diferente da renúncia regular.<br/>Renúncia = com notificação + prazo de 10 dias<br/>Abandono = sai sem cumprir dever legal",
          questions: [
            {
              id: 4,
              questionText: "Advogado deixa de comparecer à audiência designada em processo no qual atua, sem comunicar o cliente e sem apresentar justificativa plausível, causando prejuízo processual. À luz do Estatuto da Advocacia, tal conduta:",
              options: [
                { optionLetter: "A", optionText: "caracteriza exercício regular da profissão." },
                { optionLetter: "B", optionText: "<span class='text-red-600 font-bold'>não</span> constitui infração disciplinar, pois o cliente pode constituir outro advogado." },
                { optionLetter: "C", optionText: "constitui infração disciplinar por abandono da causa." },
                { optionLetter: "D", optionText: "constitui mera irregularidade processual sem repercussão disciplinar." }
              ],
              correctAnswer: "C",
              strategicComments: [
                "<h3>🔎 A) Fundamento Essencial</h3><p>Art. 34, XI, EOAB. Abandonar causa sem justo motivo e sem comunicação prévia é infração disciplinar.</p>",
                "<h3>⚠ B) Pegadinha da FGV</h3><p>A banca tenta suavizar a conduta dizendo:</p><p>• \"O cliente pode contratar outro advogado\"</p><p>• \"Foi apenas ausência pontual\"</p><p>Mas o ponto é:</p><p>• Houve comunicação? • Houve justo motivo?</p><p>Se <span class='text-red-600 font-bold'>não</span> → infração.</p>",
                "<h3>🧠 C) Como Resolver na Prova</h3><p>Pergunte:</p><p>• Houve renúncia formal? → <span class='text-red-600 font-bold'>Não</span>.</p><p>• Houve notificação? → <span class='text-red-600 font-bold'>Não</span>.</p><p>• Houve justo motivo? → <span class='text-red-600 font-bold'>Não</span>.</p><p>Logo, abandono da causa.</p>",
                "<h3>🔁 D) Revisão Rápida</h3><p>✅ Renúncia regular → permitida</p><p>✅ Abandono sem aviso → infração</p><p>✅ Pode gerar sanção disciplinar</p>"
              ]
            }
          ]
        },
        {
          id: 5,
          theme: "Visto em Atos Constitutivos e Exercício Ilegal da Advocacia",
          name: "Visto em Atos Constitutivos e Exercício Ilegal",
          level: "Médio/Alto",
          legalText: "🔹 Regulamento Geral da OAB – Art. 2º e parágrafo único<br/>🔹 Regulamento Geral da OAB – Art. 4º e parágrafo único<br/>🔹 Estatuto da Advocacia – Art. 1º, §2º",
          miniSummary: "<strong>1. Visto do Advogado em Atos Constitutivos</strong><br/>O visto do advogado:<br/>✅ É indispensável para registro e arquivamento<br/>✅ <span class='text-red-600 font-bold'>Não</span> é mera formalidade<br/>✅ Exige exame efetivo da legalidade<br/>⚠ O advogado deve verificar se o instrumento atende às exigências legais.<br/>Ponto-chave: O visto decorre de responsabilidade técnica.<br/><br/><strong>2. Impedimento Específico</strong><br/>Estão impedidos de apor o visto:<br/>✅ Advogados que prestem serviços à Administração Pública<br/>✅ Da mesma unidade federativa<br/>✅ Vinculada à Junta Comercial ou órgão registrador<br/>⚠ Trata-se de impedimento específico para evitar conflito institucional.<br/><br/><strong>3. Exercício Ilegal da Advocacia</strong><br/>Constitui exercício ilegal:<br/>✅ Prática de atos privativos por quem <span class='text-red-600 font-bold'>não</span> está inscrito na OAB<br/>Também é vedado:<br/>✅ Prestar consultoria jurídica em sociedade que <span class='text-red-600 font-bold'>não</span> possa ser registrada na OAB<br/><br/>FGV costuma testar:<br/>• Confusão entre nulidade do ato e infração administrativa<br/>• Confusão entre impedimento e incompatibilidade<br/>• Confusão entre sociedade empresarial e sociedade de advocacia",
          questions: [
            {
              id: 5,
              questionText: "Sociedade empresária apresenta contrato social para registro na Junta Comercial, contendo visto de advogado regularmente inscrito na OAB. Posteriormente, verifica-se que o advogado responsável presta serviços jurídicos à Procuradoria do Estado daquela unidade federativa, à qual se vincula a Junta Comercial. À luz do Regulamento Geral da OAB, é correto afirmar que",
              options: [
                { optionLetter: "A", optionText: "o visto é válido, pois basta a inscrição regular na OAB." },
                { optionLetter: "B", optionText: "o visto é inválido, pois o advogado está impedido de exercer esse ato específico." },
                { optionLetter: "C", optionText: "o visto é válido se <span class='text-red-600 font-bold'>não</span> houver má-fé." },
                { optionLetter: "D", optionText: "o impedimento só existiria se o advogado fosse servidor efetivo da Junta Comercial." }
              ],
              correctAnswer: "B",
              strategicComments: [
                "<h3>🔎 A) Fundamento Legal Essencial</h3><p>Art. 2º, parágrafo único, do Regulamento Geral. O advogado que presta serviços à Administração Pública:</p><p>✅ Da mesma unidade federativa</p><p>✅ Vinculada ao órgão registrador</p><p>Está impedido de apor o visto. Trata-se de impedimento específico e objetivo.</p>",
                "<h3>⚠ B) Pegadinha da FGV</h3><p>A banca pode:</p><p>• Reduzir o impedimento apenas a servidores do órgão</p><p>• Exigir má-fé</p><p>• Tratar como mera irregularidade formal</p>",
                "<h3>🧠 C) Como Resolver na Prova</h3><p>Pergunte:</p><p>✅ Presta serviço à Administração da mesma unidade federativa? → <span class='text-green-600 font-bold'>Sim</span>.</p><p>✅ A norma proíbe? → <span class='text-green-600 font-bold'>Sim</span>.</p><p>Logo, o visto é inválido.</p>",
                "<h3>🔁 D) Revisão Rápida</h3><p>✅ Visto é indispensável</p><p>✅ Deve haver análise real do instrumento</p><p>✅ Há impedimento específico no Regulamento</p><p>✅ FGV gosta de misturar impedimento com incompatibilidade</p>"
              ]
            },
            {
              id: 51,
              questionText: "Sociedade empresarial de consultoria administrativa oferece serviços de \"assessoria jurídica estratégica\", sem possuir registro na OAB. Um advogado inscrito presta serviços à referida sociedade, elaborando pareceres jurídicos para clientes. À luz do Regulamento Geral da OAB, é correto afirmar que",
              options: [
                { optionLetter: "A", optionText: "a conduta é válida, pois a sociedade é empresarial." },
                { optionLetter: "B", optionText: "há exercício ilegal da profissão, e é vedado ao advogado prestar consultoria por meio de sociedade <span class='text-red-600 font-bold'>não</span> registrável na OAB." },
                { optionLetter: "C", optionText: "é válida se o advogado assinar individualmente os pareceres." },
                { optionLetter: "D", optionText: "é válida se houver contrato escrito entre a sociedade e os clientes." }
              ],
              correctAnswer: "B",
              strategicComments: [
                "<h3>🔎 A) Fundamento Legal Essencial</h3><p>Art. 4º do Regulamento Geral:</p><p>✅ Prática de atos privativos por <span class='text-red-600 font-bold'>não</span> inscritos = exercício ilegal.</p><p>Parágrafo único: É defeso ao advogado prestar consultoria jurídica em sociedade que <span class='text-red-600 font-bold'>não</span> possa ser registrada na OAB. Sociedade empresarial comum <span class='text-red-600 font-bold'>não</span> pode exercer atividade jurídica privativa.</p>",
                "<h3>⚠ B) Pegadinha da FGV</h3><p>A banca costuma:</p><p>• Confundir sociedade empresarial com sociedade de advocacia</p><p>• Achar que assinatura individual resolve</p><p>• Supor que contrato escrito legitima</p><p><span class='text-red-600 font-bold'>Não</span> legitima. A estrutura societária é que está irregular.</p>",
                "<h3>🧠 C) Como Resolver na Prova</h3><p>Pergunte:</p><p>✅ A sociedade é registrável na OAB? → <span class='text-red-600 font-bold'>Não</span>.</p><p>✅ Está prestando consultoria jurídica? → <span class='text-green-600 font-bold'>Sim</span>.</p><p>✅ A norma permite? → <span class='text-red-600 font-bold'>Não</span>.</p><p>Logo, exercício ilegal.</p>",
                "<h3>🔁 D) Revisão Rápida</h3><p>✅ Só sociedade registrada na OAB pode exercer atividade jurídica</p><p>✅ Atos privativos por <span class='text-red-600 font-bold'>não</span> inscritos = exercício ilegal</p><p>✅ Assinatura individual <span class='text-red-600 font-bold'>não</span> convalida estrutura irregular</p><p>✅ FGV gosta de confundir consultoria empresarial com consultoria jurídica</p>"
              ]
            }
          ]
        }
      ]
    },
    {
      name: "DIREITO CONSTITUCIONAL",
      subject: "Direitos Individuais (Art. 5º CF)",
      themesWorked: [
        "<u>Inviolabilidade do Domicílio</u>",
        "<u>Liberdade de Reunião</u>",
        "<u>Sigilo das Comunicações</u>",
        "<u>Liberdade de Associação</u>",
        "<u>Tribunal do Júri</u>"
      ],
      devicesToRead: [
        "<u>Art. 5º, XI da CF</u>",
        "<u>Art. 5º, XII da CF</u>",
        "<u>Art. 5º, XVI da CF</u>",
        "<u>Art. 5º, XVII a XXI da CF</u>",
        "<u>Art. 5º, XXXVIII da CF</u>",
        "(Leitura complementar: Lei 9.296/96 – interceptação telefônica)"
      ],
      additionalInfo: "👉 Constitucional aqui é pura interpretação literal + pegadinhas clássicas da FGV.",
      topics: [
        {
          id: 6,
          theme: "Inviolabilidade do Domicílio (Art. 5º, XI, CF)",
          name: "Inviolabilidade do Domicílio",
          level: "Médio",
          legalText: "🔹 Art. 5º, XI, CF",
          miniSummary: "A Constituição prevê 5 hipóteses de ingresso:<br/>✅ Consentimento (dia ou noite)<br/>✅ Flagrante (dia ou noite)<br/>✅ Desastre (dia ou noite)<br/>✅ Socorro (dia ou noite)<br/>✅ Mandado judicial (somente durante o dia)",
          questions: [
            {
              id: 6,
              questionText: "Durante investigação criminal, a autoridade policial obteve mandado judicial de busca e apreensão na residência de Carlos. A diligência foi realizada às 22h, sem consentimento do morador e inexistindo flagrante delito, desastre ou necessidade de socorro. A diligência foi",
              options: [
                { optionLetter: "A", optionText: "válida, pois o mandado autoriza ingresso em qualquer horário." },
                { optionLetter: "B", optionText: "válida, pois investigação criminal afasta a limitação temporal." },
                { optionLetter: "C", optionText: "inválida, pois o ingresso por determinação judicial só pode ocorrer durante o dia." },
                { optionLetter: "D", optionText: "inválida, pois nunca se pode ingressar sem consentimento." }
              ],
              correctAnswer: "C",
              strategicComments: [
                "<h3>🔎 A) Fundamento Legal Essencial</h3><p>Art. 5º, XI, CF.</p><p>Mandado judicial → somente durante o dia.</p>",
                "<h3>⚠ B) Pegadinha da FGV</h3><p>A banca testa a diferença entre:</p><p>✅ Mandado judicial</p><p>✅ Flagrante delito</p><p>Muitos pensam que mandado autoriza qualquer horário. Errado.</p>",
                "<h3>🧠 C) Como Resolver na Prova</h3><p>Há flagrante? → <span class='text-red-600 font-bold'>Não</span>.</p><p>Há consentimento? → <span class='text-red-600 font-bold'>Não</span>.</p><p>Há socorro/desastre? → <span class='text-red-600 font-bold'>Não</span>.</p><p>Resta mandado judicial.</p><p>Às 22h → noite.</p><p>Logo, é inválida.</p>",
                "<h3>🔁 D) Revisão Rápida</h3><p>✅ Mandado → apenas durante o dia</p><p>✅ À noite → só flagrante, socorro ou desastre</p><p>✅ FGV sempre coloca horário</p>"
              ]
            }
          ]
        },
        {
          id: 7,
          theme: "Liberdade de Reunião (Art. 5º, XVI, CF)",
          name: "Liberdade de Reunião",
          level: "Médio",
          legalText: "🔹 Art. 5º, XVI, CF",
          miniSummary: "✅ Independe de autorização<br/>✅ Exige apenas aviso prévio<br/>✅ Deve ser pacífica<br/>✅ <span class='text-red-600 font-bold'>Não</span> pode frustrar reunião anterior",
          questions: [
            {
              id: 7,
              questionText: "Grupo de manifestantes realiza reunião pacífica em praça pública, comunicando previamente a autoridade competente, mas sem solicitar autorização formal. A conduta é",
              options: [
                { optionLetter: "A", optionText: "inconstitucional, pois depende de autorização." },
                { optionLetter: "B", optionText: "constitucional, pois a reunião independe de autorização." },
                { optionLetter: "C", optionText: "inconstitucional, pois exige licença administrativa." },
                { optionLetter: "D", optionText: "constitucional apenas se houver decisão judicial." }
              ],
              correctAnswer: "B",
              strategicComments: [
                "<h3>🔎 A) Fundamento Legal Essencial</h3><p>Art. 5º, XVI, CF. A Constituição exige aviso prévio, <span class='text-red-600 font-bold'>não</span> autorização.</p>",
                "<h3>⚠ B) Pegadinha da FGV</h3><p>Trocar \"aviso\" por \"autorização\". Essa é a pegadinha clássica.</p>",
                "<h3>🧠 C) Como Resolver na Prova</h3><p>Pergunte:</p><p>• Há violência? → <span class='text-red-600 font-bold'>Não</span>.</p><p>• Há armas? → <span class='text-red-600 font-bold'>Não</span>.</p><p>• Houve aviso? → <span class='text-green-600 font-bold'>Sim</span>.</p><p>Logo, é constitucional.</p>",
                "<h3>🔁 D) Revisão Rápida</h3><p>✅ Independe de autorização</p><p>✅ Exige aviso</p><p>✅ Deve ser pacífica</p>"
              ]
            }
          ]
        },
        {
          id: 8,
          theme: "Sigilo das Comunicações (Art. 5º, XII, CF)",
          name: "Sigilo das Comunicações",
          level: "Médio",
          legalText: "📖 Art. 5º, XII, CF<br/>📖 Lei 9.296/96",
          miniSummary: "A Constituição protege o sigilo:<br/>✅ Correspondência<br/>✅ Comunicações telegráficas<br/>✅ Dados<br/>✅ Comunicações telefônicas<br/><br/>⚠ Exceção constitucional expressa:<br/>Interceptação telefônica →<br/>✅ Ordem judicial<br/>✅ Finalidade criminal (investigação ou instrução penal)",
          questions: [
            {
              id: 8,
              questionText: "Autoridade policial determina, sem autorização judicial, a interceptação de comunicações telefônicas no curso de investigação criminal. À luz da Constituição Federal, tal medida é",
              options: [
                { optionLetter: "A", optionText: "válida, pois a investigação criminal autoriza a interceptação." },
                { optionLetter: "B", optionText: "válida se houver urgência." },
                { optionLetter: "C", optionText: "inválida, pois depende de ordem judicial." },
                { optionLetter: "D", optionText: "válida se houver indícios suficientes de autoria." }
              ],
              correctAnswer: "C",
              strategicComments: [
                "<h3>🔎 A) Fundamento Legal Essencial</h3><p>Art. 5º, XII, CF.</p><p>A interceptação telefônica somente pode ocorrer:</p><p>✅ Por ordem judicial</p><p>✅ Nas hipóteses e forma previstas em lei</p><p>✅ Para fins de investigação criminal ou instrução processual penal</p><p>Sem ordem judicial → é inconstitucional.</p>",
                "<h3>⚠ B) Pegadinha da FGV</h3><p>A banca testa três confusões:</p><p>1. Investigação criminal autoriza interceptação automaticamente? → <span class='text-red-600 font-bold'>Não</span>.</p><p>2. Urgência dispensa ordem judicial? → <span class='text-red-600 font-bold'>Não</span>.</p><p>3. Indícios suficientes substituem decisão judicial? → <span class='text-red-600 font-bold'>Não</span>.</p><p>Interceptação sempre depende de juiz.</p>",
                "<h3>🧠 C) Como Resolver na Prova</h3><p>Pergunte:</p><p>• Há ordem judicial? → <span class='text-red-600 font-bold'>Não</span>.</p><p>• A Constituição exige? → <span class='text-green-600 font-bold'>Sim</span>.</p><p>Logo, é inválida.</p><p><span class='text-red-600 font-bold'>Não</span> importa se há investigação ou urgência.</p>",
                "<h3>🔁 D) Revisão Rápida</h3><p>✅ Interceptação telefônica → só com ordem judicial</p><p>✅ Finalidade exclusivamente criminal</p><p>✅ Sem juiz → inconstitucional</p><p>✅ FGV ama testar \"urgência\"</p>"
              ]
            }
          ]
        },
        {
          id: 9,
          theme: "Liberdade de Associação (Art. 5º, XVII a XXI, CF)",
          name: "Liberdade de Associação",
          level: "Médio",
          legalText: "🔹 Art. 5º, XVII a XXI, CF",
          miniSummary: "✅ Plena liberdade de associação para fins lícitos<br/>✅ Vedada associação paramilitar<br/>✅ Dissolução compulsória → somente por decisão judicial<br/>✅ Dissolução definitiva → exige trânsito em julgado<br/>✅ Ninguém é obrigado a se associar",
          questions: [
            {
              id: 9,
              questionText: "Determinado grupo associativo é dissolvido por ato administrativo do Poder Executivo, sob alegação de interesse público e ameaça à ordem social. <span class='text-red-600 font-bold'>Não</span> houve decisão judicial. À luz da Constituição Federal, tal medida é",
              options: [
                { optionLetter: "A", optionText: "válida, pois decorre do poder de polícia estatal." },
                { optionLetter: "B", optionText: "válida se houver motivação suficiente." },
                { optionLetter: "C", optionText: "inválida, pois a dissolução compulsória depende de decisão judicial transitada em julgado." },
                { optionLetter: "D", optionText: "inválida apenas se <span class='text-red-600 font-bold'>não</span> houver contraditório administrativo." }
              ],
              correctAnswer: "C",
              strategicComments: [
                "<h3>🔎 A) Fundamento Legal Essencial</h3><p>Art. 5º, XIX, CF. As associações só podem ser:</p><p>• Suspensas por decisão judicial</p><p>• Dissolvidas compulsoriamente por decisão judicial com trânsito em julgado</p><p>O Executivo <span class='text-red-600 font-bold'>não</span> pode dissolver associação por ato próprio.</p>",
                "<h3>⚠ B) Pegadinha da FGV</h3><p>A banca tenta legitimar a dissolução com:</p><p>• \"Interesse público\"</p><p>• \"Ordem social\"</p><p>• \"Poder de polícia\"</p><p>Nada disso supera a exigência constitucional de decisão judicial.</p>",
                "<h3>🧠 C) Como Resolver na Prova</h3><p>Pergunte:</p><p>• Houve decisão judicial? → <span class='text-red-600 font-bold'>Não</span>.</p><p>• A Constituição exige? → <span class='text-green-600 font-bold'>Sim</span>.</p><p>Logo, é inconstitucional.</p>",
                "<h3>🔁 D) Revisão Rápida</h3><p>✅ Associação é livre</p><p>✅ Vedada interferência estatal</p><p>✅ Dissolução → só por decisão judicial</p><p>✅ Dissolução definitiva → exige trânsito em julgado</p>"
              ]
            }
          ]
        },
        {
          id: 10,
          theme: "Tribunal do Júri (Art. 5º, XXXVIII, CF)",
          name: "Tribunal do Júri",
          level: "Médio",
          legalText: "📖 Art. 5º, XXXVIII, CF",
          miniSummary: "A Constituição reconhece o júri com 4 garantias:<br/>✅ Plenitude de defesa<br/>✅ Sigilo das votações<br/>✅ Soberania dos veredictos<br/>✅ Competência para crimes dolosos contra a vida<br/><br/>A competência para crimes dolosos contra a vida é garantia constitucional.",
          questions: [
            {
              id: 10,
              questionText: "Lei estadual retira do Tribunal do Júri a competência para julgar determinado crime doloso contra a vida, transferindo-o para juiz singular, sob argumento de maior celeridade processual. À luz da Constituição Federal, a medida é",
              options: [
                { optionLetter: "A", optionText: "válida, pois o legislador pode redefinir competência processual." },
                { optionLetter: "B", optionText: "inválida, pois a competência do júri para crimes dolosos contra a vida é garantia constitucional." },
                { optionLetter: "C", optionText: "válida se houver previsão no Código Penal." },
                { optionLetter: "D", optionText: "válida se houver justificativa de interesse público." }
              ],
              correctAnswer: "B",
              strategicComments: [
                "<h3>🔎 A) Fundamento Legal Essencial</h3><p>Art. 5º, XXXVIII, CF.</p><p>A competência do júri para julgar crimes dolosos contra a vida é garantia constitucional.</p><p>Lei ordinária <span class='text-red-600 font-bold'>não</span> pode suprimir essa competência.</p>",
                "<h3>⚠ B) Pegadinha da FGV</h3><p>A banca tenta justificar a retirada com:</p><p>• Celeridade</p><p>• Interesse público</p><p>• Organização judiciária</p><p>Mas nenhuma dessas hipóteses autoriza afastar garantia constitucional.</p>",
                "<h3>🧠 C) Como Resolver na Prova</h3><p>Pergunte:</p><p>O crime é doloso contra a vida? → <span class='text-green-600 font-bold'>Sim</span>.</p><p>A Constituição assegura julgamento pelo júri? → <span class='text-green-600 font-bold'>Sim</span>.</p><p>Lei ordinária pode afastar? → <span class='text-red-600 font-bold'>Não</span>.</p>",
                "<h3>🔁 D) Revisão Rápida</h3><p>✅ Júri julga crimes dolosos contra a vida</p><p>✅ É garantia constitucional</p><p>✅ Lei estadual <span class='text-red-600 font-bold'>não</span> pode retirar competência</p><p>✅ FGV adora testar \"lei estadual\"</p>"
              ]
            }
          ]
        }
      ]
    }
  ],
  finalStrategy: "Você treinou:\n\n✔ Interpretação literal de norma\n✔ Identificação de exceções constitucionais\n✔ Diferenciação entre regra e exceção\n✔ Pegadinhas clássicas da FGV\n\nEsse é um dia de base estrutural da prova.\nSem dominar esses temas, o desempenho geral cai."
};

import { day2Data } from "./day2";
import { day3Data } from "./day3";
import { day4Data } from "./day4";
import { day5Data } from "./day5";
import { day6Data } from "./day6";
import { day7Data } from "./day7";
import { day8Data } from "./day8";
import { day9Data } from "./day9";
import { day10Data } from "./day10";
import { day11Data } from "./day11";
import { day12Data } from "./day12";
import { day13Data } from "./day13";
import { day14Data } from "./day14";
import { day15Data } from "./day15";
import { day16Data } from "./day16";
import { day17Data } from "./day17";
import { day18Data } from "./day18";
import { day19Data } from "./day19";
import { day20Data } from "./day20";
import { day21Data } from "./day21";
import { day22Data } from "./day22";
import { day23Data } from "./day23";
import { day24Data } from "./day24";
import { day25Data } from "./day25";
import { day26Data } from "./day26";
import { day27Data } from "./day27";
import { day28Data } from "./day28";
import { day29Data } from "./day29";
import { day30Data } from "./day30";
import { day31Data } from "./day31";
import { day32Data } from "./day32";
import { day33Data } from "./day33";
import { day34Data } from "./day34";
import { day35Data } from "./day35";
import { day36Data } from "./day36";
import { day37Data } from "./day37";
import { day38Data } from "./day38";
import { day39Data } from "./day39";
import { day40Data } from "./day40";

export const daysData: Record<number, DayData> = {
  1: day1Data,
  2: day2Data,
  3: day3Data,
  4: day4Data,
  5: day5Data,
  6: day6Data,
  7: day7Data,
  8: day8Data,
  9: day9Data,
  10: day10Data,
  11: day11Data,
  12: day12Data,
  13: day13Data,
  14: day14Data,
  15: day15Data,
  16: day16Data,
  17: day17Data,
  18: day18Data,
  19: day19Data,
  20: day20Data,
  21: day21Data,
  22: day22Data,
  23: day23Data,
  24: day24Data,
  25: day25Data,
  26: day26Data,
  27: day27Data,
  28: day28Data,
  29: day29Data,
  30: day30Data,
  31: day31Data,
  32: day32Data,
  33: day33Data,
  34: day34Data,
  35: day35Data,
  36: day36Data,
  37: day37Data,
  38: day38Data,
  39: day39Data,
  40: day40Data
};
