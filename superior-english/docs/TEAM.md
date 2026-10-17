# Team and agents

The app is built by a small agent team led by an orchestrator. The agents are defined in
`.claude/agents/` at the repo root, so Claude Code can use them after you pull the repo.

| Agent | Model | Role |
| --- | --- | --- |
| `orchestrator` | Opus | Plans, writes the contracts and reference code, assigns file ownership, convenes the council, reviews, integrates, commits |
| `implementer` | Haiku | Builds a scoped feature in the files it owns: screens, renderers, scripts, tests |
| `content-author` | Haiku | Writes original items, vocabulary and guides that pass schema validation |
| `council-pedagogy` | Haiku | Gives recommendations on learning and exam-fidelity decisions |
| `council-engineering` | Haiku | Gives recommendations on architecture, cost and risk decisions |

## How a feature is built

1. **Decide together.** The orchestrator writes the open decision in `docs/DECISIONS.md`.
   The two council members answer in `docs/council/*.md`. The orchestrator makes the call and
   records it as an ADR.
2. **Foundations first.** The orchestrator writes the types, contracts and one reference
   implementation.
3. **Fan out.** Haiku implementers and content authors work in parallel on files nobody else
   owns, following `docs/team/BRIEF.md`.
4. **Integrate.** The orchestrator reviews every diff, fixes bugs that only appear when the
   pieces meet, then runs `npm run check`, a web build and screenshots before committing.

v0.1 was built this way. Nine Haiku agents wrote the content bank, 23 renderers, the
mock/vocab/progress screens, the emulator tooling and the unit tests, while the council
reviewed ADR-004, ADR-006 and ADR-008.

## Skills (found with `find-skills`)

The skills were found with the [find-skills](https://github.com/vercel-labs/skills/tree/main/skills/find-skills)
workflow (`npx skills find <query>`). Each candidate was checked for its source and install
count before installing at project level (`.claude/skills/`, locked in `skills-lock.json`):

| Skill | Source | Why |
| --- | --- | --- |
| `expo-router` | expo/skills | Routing conventions for SDK 58 |
| `expo-native-ui` | expo/skills | Native UI, audio, storage and styling rules |
| `vercel-react-native-skills` | vercel-labs/agent-skills (≈244K installs) | React Native performance rules |
| `web-design-guidelines` | vercel-labs/agent-skills (≈749K installs) | UI and accessibility review |
| `webapp-testing` | anthropics/skills (≈180K installs) | Playwright checks of the web build |

Update them with `npx skills update -p`. To find more, run
`npx skills find <topic>` and check the install count and source before adding anything.

## About `rea`

[`rea`](https://github.com/morluto/rea) is an MCP server and CLI for reverse engineering, and it
is reserved for software we own or are authorised to examine (ADR-002). Typical use here is
auditing our own release builds: `npx rea-agents setup` registers it with Claude Code. You can
then ask the agent to analyse `dist/` or an APK built with `eas build` for bundle size, leaked
keys or dead code.
