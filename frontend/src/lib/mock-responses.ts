/**
 * Mock response engine for Athena.
 *
 * No real AI — returns pre-written, structured study guidance based on
 * keyword matching. Responses are warm, clear, and use bullet points
 * to keep cognitive load low.
 */

export type MockReply = {
  text: string;
  delay: number; // ms to simulate "thinking"
};

type Category = {
  keywords: string[];
  replies: string[];
};

const categories: Category[] = [
  {
    keywords: ["foco", "concentr", "atenção", "atencao", "distra", "adhd", "tdah", "hyperfocus", "hiperfoco"],
    replies: [
      `### Estratégias de foco 🧠

Manter o foco pode ser desafiante, e isso é totalmente normal. Aqui vão algumas estratégias testadas:

- **Técnica Pomodoro**: estude por 25 min, descanse 5 min. Repita 4 ciclos e faça uma pausa maior de 15–30 min.
- **Remova distrações visuais**: deixe só o material necessário na mesa. Cada objeto extra compete por atenção.
- **Timer visível**: um cronômetro físico (não no celular) ajuda o cérebro a perceber o tempo passando.
- **Divida em micro-tarefas**: em vez de "estudar matemática", que tal "resolver 3 exercícios de frações"?

> 💡 Dica: se perder o foco, anote o pensamento que te distraiu num papel e volte. Assim ele sai da cabeça sem te interromper.`,
      `### Quando a atenção oscila 🌊

É natural que o nível de atenção varie. O importante é ter um plano para voltar:

- **Ancora de retorno**: escolha uma frase como *"voltei para o material"*. Repita mentalmente ao se distrair.
- **Fones com ruído branco**: marrom ou rosa costumam ser mais suaves que o branco puro.
- **Movimento antes de estudar**: 5 min de alongamento ou caminhada ajudam a regular a atenção.

Qual dessas você quer testar primeiro? Posso te ajudar a montar um plano.`,
    ],
  },
  {
    keywords: ["ansiedade", "ansioso", "ansiosa", "nervos", "stressed", "estress", "overwhelm", "sobrecarreg", "pânico", "panico"],
    replies: [
      `### Estante a ansiedade de estudar 💜

Primeiro: respire comigo por 10 segundos. Inspire em 4, segure em 4, solte em 6.

Quando a ansiedade bate antes de estudar, geralmente é o cérebro tentando processar muita coisa ao mesmo tempo. Vamos organizar:

- **Externalize**: escreva tudo que está te preocupando numa folha. Tirar da cabeça para o papel já reduz a carga.
- **Escolha UMA coisa só**: qual é a menor tarefa possível? "Abrir o livro na página 42" conta.
- **Valide a emoção**: está tudo bem sentir isso. Ansiedade não é fracasso — é informação.

> 🫧 Quando sentir que está acelerando, toque os pés no chão e nomeie 3 coisas que você vê ao redor.

Quer que eu te ajude a quebrar uma tarefa em passos bem pequenos?`,
    ],
  },
  {
    keywords: ["matemática", "matematica", "mat", "cálculo", "calculo", "fração", "fracao", "álgebra", "algebra", "equação", "equacao", "geometria", "número", "numero"],
    replies: [
      `### Vamos destrinchar matemática 📐

Matemática fica muito mais gentil quando a separamos em passos. Me conta mais:

- É um **conceito** que você não entendeu (ex: frações, logaritmos)?
- É um **exercício específico** que travou?
- Ou é a **sensação** de não saber por onde começar?

Enquanto isso, uma estratégia que costuma ajudar:

1. Reescreva o enunciado com suas palavras
2. Identifique o que você **sabe** e o que **não sabe**
3. Desenhe o problema — sim, desenhe! Mesmo em matemática abstrata, um esquema visual ajuda

> ✏️ Não existe "pergunta burra". Se algo não fez sentido, é porque ainda não foi explicado do seu jeito.

Qual é o tópico específico? Posso montar uma explicação passo a passo.`,
    ],
  },
  {
    keywords: ["organiza", "planej", "rotina", "agenda", "tempo", "prazo", "entrega", "tarefa", "to-do", "todo list", "produtiv"],
    replies: [
      `### Organização sem sobrecarga 📋

Sistemas de organização só funcionam se forem simples o suficiente para usar nos dias difíceis. Aqui vai um modelo:

- **3 tarefas por dia**: não mais que isso. Priorize por: o que tem prazo, o que te tira peso da mente, o que te dá satisfação.
- **Bloco de tempo, não horário exato**: em vez de "14h–15h", use "manhã: revisão, tarde: exercícios".
- **Check-in de 2 min**: comece o dia listando só 3 coisas. Acabou o dia? Veja o que rolou, sem julgamento.

> 🔁 Consistência > perfeição. Um sistema simples usado todo dia vence um sistema complexo abandonado em 3 dias.

Quer que eu te ajude a montar uma rotina para esta semana?`,
    ],
  },
  {
    keywords: ["ler", "leitura", "texto", "interpretação", "interpretacao", "redação", "redacao", "escrev", "dissert", "ensaio", "resumo"],
    replies: [
      `### Leitura e escrita com mais clareza 📖

Para textos longos, o cérebro neurodivergente costuma se beneficiar de "marcos" visuais:

- **Pré-leitura**: leia só títulos, subtítulos e a primeira frase de cada parágrafo. Isso cria um "mapa" mental.
- **Marca-dores coloridos**: amarelo = ideia principal, verde = exemplo, rosa = dúvida. Usa quantas cores conseguir gerenciar.
- **Resumo em tópicos**: depois de ler, escreva 3 bullet points. Se não consegue, releu o trecho — não tem problema.

Para escrita:
- Comece pelo esqueleto: introdução / argumento 1 / argumento 2 / conclusão
- Escreva feio primeiro, arrume depois. A página em branco é o maior inimigo.

Qual parte está te dando mais trabalho — a leitura ou a escrita?`,
    ],
  },
  {
    keywords: ["cansad", "exaust", "esgot", "sleep", "dormir", "sono", "descans", "pausa", "break", "burnout"],
    replies: [
      `### Cansaço e descanso 🌙

Esgotamento não é preguiça — é o corpo e a mente dizendo que precisam de algo que não receberam.

- **Pausa ativa vs. passiva**: rolar o feed não descansa. Pausa real = mudar de estímulo (caminhar, olhar pela janela, alongar).
- **Sono antes de tudo**: estudar com 4h de sono é como dirigir alcoolizado — o cérebro não processa nem retém.
- **Hidratação e comida**: às vezes "não consigo focar" é só o corpo precisando de água ou comida de verdade.

> 🧡 Se você está exausto(a), a tarefa mais produtiva de hoje pode ser descansar de verdade.

Que tal uma pausa de 10 minutos agora? Depois voltamos com mais calma.`,
    ],
  },
  {
    keywords: ["memória", "memoria", "decor", "lembr", "esquec", "revis", "anki", "flashcard"],
    replies: [
      `### Memória e retenção 🧩

Esquecer é parte normal do aprendizado — o cérebro descarta o que não é revisitado. Para reter mais com menos esforço:

- **Repetição espaçada**: revise após 1 dia, 3 dias, 7 dias, 21 dias. Aplicativos como Anki automatizam isso.
- **Recuperação ativa**: feche o material e tente explicar em voz alta. Errar e corrigir fixa mais que reler.
- **Conexões pessoais**: associe o conceito a algo da sua vida. Memória emocional é mais duradoura.

> 🔗 Não tente decorar tudo de uma vez. 15 min de revisão ativa valem mais que 2h de releitura passiva.

Quer que eu te ajude a montar um plano de revisão para um tópico específico?`,
    ],
  },
  {
    keywords: ["motiva", "procrastin", "preguiç", "preguic", "não consigo", "nao consigo", "começar", "comecar", "trav", "bloqueio"],
    replies: [
      `### Para começar quando está difícil 🚀

Procrastinação quase nunca é preguiça. Geralmente é o cérebro evitando uma emoção desconfortável (medo de falhar, tarefa parecer grande demais, perfeccionismo).

- **Regra dos 2 minutos**: comprometa-se com só 2 minutos de tarefa. Geralmente a inércia inicial é o único obstáculo.
- **Baixe o padrão**: "um rascunho ruim" > "nenhum rascunho". Perfeição vem na revisão, não no começo.
- **Tire a atrito**: deixo o material aberto na mesa antes de começar. Menos passos entre você e a tarefa = mais chance de começar.

> 🎯 Você não precisa de motivação para começar. Comece, e a motivação vem depois.

O que está te travando agora? Me conta que a gente quebra isso juntos.`,
    ],
  },
  {
    keywords: ["olá", "ola", "oi", "bom dia", "boa tarde", "boa noite", "hey", "hello", "e aí", "e ai"],
    replies: [
      `Olá! 👋 Eu sou a **Athena**, sua assistente de estudos.

Estou aqui pra te ajudar com dúvidas, organização e estratégias de aprendizado — no seu ritmo.

Você pode me perguntar sobre:
- 📐 Matemática e matérias específicas
- 🧠 Foco, concentração e TDAH
- 💜 Ansiedade e sobrecarga
- 📋 Organização e planejamento
- 📖 Leitura e escrita
- 🧩 Memória e revisão

O que está na sua mente hoje?`,
    ],
  },
];

const fallbackReplies: string[] = [
  `Entendi! Obrigado por compartilhar isso comigo. 🌟

Me conta um pouco mais pra eu te ajudar melhor:

- É uma **dúvida de conteúdo** específico?
- É sobre **como estudar** (foco, organização, memória)?
- Ou é sobre **como se sentir melhor** enquanto estuda?

Quanto mais específico, melhor eu consigo ajudar. Não existe pergunta pequena demais.`,
  `Estou aqui pra te ajudar com isso! 💜

Como sou um protótipo, ainda não tenho respostas prontas para tudo — mas posso te ajudar com:

- **Matérias**: matemática, leitura, escrita
- **Estratégias**: foco, organização, memória, motivação
- **Bem-estar**: ansiedade, cansaço, sobrecarga

Tenta reformular sua pergunta incluindo uma dessas palavras-chave, ou me conta mais detalhes sobre o que você precisa.`,
];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)] ?? arr[0]!;
}

export function getMockReply(userMessage: string): MockReply {
  const lower = userMessage.toLowerCase();

  for (const category of categories) {
    if (category.keywords.some((kw) => lower.includes(kw))) {
      return {
        text: pickRandom(category.replies),
        delay: 900 + Math.random() * 800,
      };
    }
  }

  return {
    text: pickRandom(fallbackReplies),
    delay: 800 + Math.random() * 600,
  };
}

export type Suggestion = {
  label: string;
  prompt: string;
  emoji: string;
};

export const suggestions: Suggestion[] = [
  {
    label: "Não consigo focar",
    prompt: "Não consigo manter o foco nos estudos, começo e logo me distraio. O que posso fazer?",
    emoji: "🧠",
  },
  {
    label: "Ansiedade antes da prova",
    prompt: "Fico muito ansioso antes das provas e travo. Como lidar com isso?",
    emoji: "💜",
  },
  {
    label: "Organizar minha rotina",
    prompt: "Como posso organizar minha rotina de estudos sem me sobrecarregar?",
    emoji: "📋",
  },
  {
    label: "Esqueço o que estudo",
    prompt: "Eu estudo mas esqueço tudo depois. Como melhorar minha memória?",
    emoji: "🧩",
  },
];
