# Plano de execução

Projeto grande. Vou dividir em 4 entregas independentes. Confirma o plano antes de eu começar — depois posso construir tudo ou entregar uma parte por vez pra você validar antes de seguir.

## 1. Páginas de venda por produto (base para os dois funis)

Uma rota por produto, com o mesmo padrão visual da atual (`/`), mudando copy + link Hubla. Cada produto tem 3–4 faixas de preço; o funil escolhe a rota certa conforme o "quanto pode investir".

Rotas:
- `/mapas-mentais-etica` (3 tiers: 15,90 / 19,90 / 27,90)
- `/36-tpps-etica` (42,90 / 47,90 / 57,90)
- `/50-questoes-etica` (19,90 / 27,90 / 37,90) — já existe em `/`, viraria `/50-questoes-etica/[tier]`
- `/mapa-aprovacao` (79,90 / 87,90 / 97,90 / 127,90) — inclui componente de demonstração do "Dia 1" copiado do projeto `@project:9a21d001...`

Cada faixa de preço = mesma página, só troca preço + link checkout via param na URL (ex: `/mapas-mentais-etica?t=1990`). Isso evita 12 páginas duplicadas.

## 2. Funil #1 — Quiz WhatsApp (rota `/quiz`)

9 passos conforme seu roteiro (intro → OAB antes? → nº reprovações OU boas-vindas → dificuldade → sonho → loading → sobre João Pedro → orçamento → recomendação). Estilo: fundo preto, botões verdes, tipografia moderna (referência lowticket.outsiderschool).

Lógica de recomendação (parte 4 × parte 8):
- "Dificuldade em focar" → Mapas Mentais ou combo
- "Branco na prova" → Mapas Mentais ou Mapa da Aprovação
- "Dificuldade em ética" → 50 Questões ou 36 TPPs
- "Não domino FGV" → 36 TPPs ou Mapa da Aprovação
- "Trabalho, sem tempo" → qualquer um

Escolhe o tier mais próximo pra baixo do valor informado. Redireciona pra `/produto?t=preço`.

## 3. Funil #2 — Quiz longo (rota `/quiz2`)

16 partes conforme seu roteiro (nazareth → situação → reprovações → o que falta → apresentação João → nome → sim/não → concorda → aplicaria → depoimentos → objetivo → 30 dias → loading → disposto → orçamento → compromisso → plano pronto). Mesmo estilo visual do Funil #1.

## 4. Sistema `/oabtracker`

**Auth (antes de entrar):** 2 campos de senha (números + alfanumérica). 3 tentativas → bloqueia dispositivo 24h (localStorage + timestamp). Senhas comparadas via edge function pra não vazar no bundle.

**Tracking (nas páginas públicas):**
- Ao entrar em qualquer página/quiz, cria sessão em `tracking_sessions` (id, user_label "user N", ip, cidade, país via ip-api, user_agent, funnel, started_at, access_count).
- Grava cada evento (step, resposta, tempo na página) em `tracking_events`.
- Grava sessão rrweb (mesma lib que você já usa aqui) em `tracking_recordings` (jsonb comprimido).
- Campo `sale_status` (`pending` / `sold` / `not_sold`) manual.

**Dashboard:**
- Seletor de funil no canto sup. direito (todas / quiz1 / quiz2 / cada página de produto).
- Métricas topo: acessos, taxa conversão, taxa initiate checkout, taxa conclusão do quiz.
- Tabela: user_label, acesso#, funil, cidade, tempo total, último passo, status venda (editável).
- Busca + filtros: hoje / 7d / mês / 30d / custom.
- Clique na linha: modal com respostas por passo, timeline visual do progresso, player rrweb, tempo em cada página.
- Ícone lixeira: pop-up período → confirmação "IRREVERSÍVEL" → deleta.

## Detalhes técnicos

- Backend: Lovable Cloud (Supabase) — 4 tabelas + RLS. `tracking_*` = insert público (anon), select só via edge function com senha.
- Auth do painel: edge function `oabtracker-auth` valida senha e devolve JWT curto; frontend guarda em sessionStorage.
- Rate limit tentativas: tabela `auth_attempts(device_fingerprint, count, locked_until)`.
- rrweb: `rrweb` npm package, batch a cada 5s pra edge function.
- IP/geo: `ipapi.co` no client (grátis, sem key).
- Meta Pixel + TikTok Pixel: já instalados, disparar `InitiateCheckout` em cliques CTA e `Lead` ao fim do quiz.

## Ordem sugerida de entrega

1. Páginas de produto (fundação) + rotas dinâmicas de tier
2. Funil #1
3. Funil #2
4. Sistema `/oabtracker` (o maior — 1 entrega inteira só pra ele)

## O que preciso confirmar antes de começar

1. Sigo essa ordem (1→4) entregando um por vez pra você revisar, ou faço tudo de uma vez?
2. Para a página do Mapa da Aprovação: você quer que eu **copie** o componente de "Dia 1" do outro projeto (posso puxar via cross_project) ou você me manda o código?
3. Você tem imagens/depoimentos específicos pros produtos novos (mapas mentais, 36 TPPs, mapa aprovação) ou uso placeholders visuais consistentes com a marca até você mandar?
4. Confirmo: fundo **preto** nos quizzes (estilo lowticket) mesmo com a marca sendo vermelho+branco? Ou mantém branco?
