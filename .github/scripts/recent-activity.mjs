const API = "https://api.github.com";
const TOKEN = process.env.GITHUB_TOKEN;
const OWNER = process.env.GITHUB_REPOSITORY_OWNER;
const REPO = process.env.GITHUB_REPOSITORY;
const [USER] = [OWNER];
const BRANCH = "main";
const FILE = "README.md";
const MAX_LINES = 5;
const START = "<!--RECENT_ACTIVITY:start-->";
const END = "<!--RECENT_ACTIVITY:end-->";
const STAMP = "<!--RECENT_ACTIVITY:last_update-->";
const COMMIT_MSG = "docs(readme): atualiza atividade recente automaticamente";

if (!TOKEN || !OWNER || !REPO) {
  console.error("Variaveis GITHUB_TOKEN/GITHUB_REPOSITORY ausentes.");
  process.exit(1);
}

const headers = {
  Authorization: `Bearer ${TOKEN}`,
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
  "User-Agent": "recent-activity-readme",
};

async function api(path, options = {}) {
  const res = await fetch(`${API}${path}`, { headers, ...options });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`${options.method || "GET"} ${path} -> ${res.status}\n${text}`);
  }
  return text ? JSON.parse(text) : {};
}

const repoShort = (full) => full.split("/")[1];
const repoLink = (full) => `[${repoShort(full)}](https://github.com/${full})`;

const serializers = {
  PushEvent: (e) => `⬆️ Enviei commits para ${repoLink(e.repo.name)}`,
  CreateEvent: (e) => {
    const ref = e.payload.ref;
    if (e.payload.ref_type === "repository") {
      return `📔 Criei o repositório ${repoLink(e.repo.name)}`;
    }
    if (e.payload.ref_type === "tag") {
      return `🏷️ Criei a tag \`${ref}\` em ${repoLink(e.repo.name)}`;
    }
    if (e.payload.ref_type === "branch") {
      return `🌿 Criei a branch \`${ref}\` em ${repoLink(e.repo.name)}`;
    }
    return `📦 Criei ${e.payload.ref_type} em ${repoLink(e.repo.name)}`;
  },
  ReleaseEvent: (e) => `🚀 Publiquei a release \`${e.payload.release.tag_name}\` em ${repoLink(e.repo.name)}`,
  ForkEvent: (e) => `🍴 Fiz fork de ${repoLink(e.repo.name)}`,
  IssuesEvent: (e) => {
    const n = e.payload.issue.number;
    const map = {
      opened: `❗ Abri a issue #${n} em ${repoLink(e.repo.name)}`,
      reopened: `♻️ Reabri a issue #${n} em ${repoLink(e.repo.name)}`,
      closed: `✔️ Fechei a issue #${n} em ${repoLink(e.repo.name)}`,
    };
    return map[e.payload.action] || null;
  },
  PullRequestEvent: (e) => {
    const n = e.payload.pull_request.number;
    const merged = e.payload.pull_request.merged;
    const map = {
      opened: `💪 Abri o PR #${n} em ${repoLink(e.repo.name)}`,
      reopened: `♻️ Reabri o PR #${n} em ${repoLink(e.repo.name)}`,
      closed: merged
        ? `🎉 Fiz merge do PR #${n} em ${repoLink(e.repo.name)}`
        : `❌ Fechei o PR #${n} em ${repoLink(e.repo.name)}`,
    };
    return map[e.payload.action] || null;
  },
  PullRequestReviewEvent: (e) =>
    `🔎 Revisei o PR #${e.payload.pull_request.number} em ${repoLink(e.repo.name)}`,
  IssueCommentEvent: (e) => `💬 Comentei na issue #${e.payload.issue.number} em ${repoLink(e.repo.name)}`,
  PullRequestReviewCommentEvent: (e) =>
    `💬 Comentei no PR #${e.payload.pull_request.number} em ${repoLink(e.repo.name)}`,
  CommitCommentEvent: (e) => `💬 Comentei em um commit de ${repoLink(e.repo.name)}`,
  WatchEvent: (e) => `⭐ Marquei com estrela ${repoLink(e.repo.name)}`,
  GollumEvent: (e) => `📖 Atualizei a wiki de ${repoLink(e.repo.name)}`,
  MemberEvent: (e) => `🤝 Virei colaborador de ${repoLink(e.repo.name)}`,
  PublicEvent: (e) => `📢 Tornei público ${repoLink(e.repo.name)}`,
};

function buildLines(events) {
  const lines = [];
  for (const event of events) {
    if (event.repo.name === `${OWNER}/${repoShort(REPO)}`) continue;
    if (event.repo.name === REPO) continue;
    const serializer = serializers[event.type];
    if (!serializer) continue;
    const line = serializer(event);
    if (!line) continue;
    if (lines.length && lines[lines.length - 1] === line) continue;
    lines.push(line);
    if (lines.length === MAX_LINES) break;
  }
  return lines;
}

function renderSection(lines) {
  return lines.map((line, i) => `${i + 1}. ${line}`).join("<br>\n");
}

function formatStamp() {
  const fmt = new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Fortaleza",
    dateStyle: "short",
    timeStyle: "short",
  });
  return `Atualizado em ${fmt.format(new Date())} (BRT)`;
}

async function main() {
  const events = await api(`/users/${USER}/events/public?per_page=100`);
  console.log(`${events.length} eventos publicos encontrados para ${USER}.`);

  const lines = buildLines(events);
  if (!lines.length) {
    console.log("Nenhum evento elegivel. README inalterado.");
    return;
  }

  const current = await api(`/repos/${REPO}/contents/${FILE}?ref=${BRANCH}`);
  const content = Buffer.from(current.content, "base64").toString("utf-8");

  const start = content.indexOf(START);
  const end = content.indexOf(END);
  if (start === -1 || end === -1 || end < start) {
    throw new Error("Marcadores RECENT_ACTIVITY nao encontrados no README.");
  }

  const head = content.slice(0, start + START.length);
  const tail = content.slice(end);
  let updated = `${head}\n${renderSection(lines)}\n${tail}`;
  updated = updated.replace(STAMP, formatStamp());

  if (updated === content) {
    console.log("Conteudo identico. Nada a commitar.");
    return;
  }

  if (process.env.DRY_RUN === "1") {
    console.log("--- DRY_RUN: secao que seria gravada ---");
    console.log(renderSection(lines));
    console.log("--- DRY_RUN: nada foi commitado ---");
    return;
  }

  await api(`/repos/${REPO}/contents/${FILE}`, {
    method: "PUT",
    body: JSON.stringify({
      message: COMMIT_MSG,
      content: Buffer.from(updated, "utf-8").toString("base64"),
      sha: current.sha,
      branch: BRANCH,
    }),
  });
  console.log("README atualizado via API Contents (commit assinado pelo GitHub).");
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
