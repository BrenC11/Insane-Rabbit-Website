type PolicyContentProps = {
  text: string;
};

type Block =
  | { type: "title"; text: string }
  | { type: "updated"; text: string }
  | { type: "section"; text: string }
  | { type: "subsection"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] };

const TITLE_CASE_RE = /^[A-Z0-9 ?()-]+$/;
const SECTION_RE = /^\d+\.\s+/;
const SUBSECTION_RE = /^[a-z]\.\s+/;

function parseBlocks(text: string): Block[] {
  const rawBlocks = text
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);

  const blocks: Block[] = [];

  rawBlocks.forEach((block) => {
    const lines = block
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    if (lines.length === 1) {
      const line = lines[0];

      if (TITLE_CASE_RE.test(line)) {
        blocks.push({ type: "title", text: line });
        return;
      }

      if (/^Last updated:/i.test(line)) {
        blocks.push({ type: "updated", text: line });
        return;
      }

      if (SECTION_RE.test(line)) {
        blocks.push({ type: "section", text: line });
        return;
      }

      if (SUBSECTION_RE.test(line)) {
        blocks.push({ type: "subsection", text: line });
        return;
      }

      blocks.push({ type: "paragraph", text: line });
      return;
    }

    if (lines.every((line) => line.startsWith("- "))) {
      blocks.push({
        type: "ul",
        items: lines.map((line) => line.replace(/^- /, ""))
      });
      return;
    }

    if (lines.every((line) => SECTION_RE.test(line))) {
      blocks.push({
        type: "ol",
        items: lines.map((line) => line.replace(SECTION_RE, ""))
      });
      return;
    }

    lines.forEach((line) => {
      blocks.push({ type: "paragraph", text: line });
    });
  });

  return blocks;
}

export default function PolicyContent({ text }: PolicyContentProps) {
  const blocks = parseBlocks(text);

  return (
    <div className="flex flex-col gap-4">
      {blocks.map((block, index) => {
        if (block.type === "title") {
          return (
            <h1
              key={`title-${index}`}
              className="text-3xl font-semibold text-white"
            >
              {block.text}
            </h1>
          );
        }

        if (block.type === "updated") {
          return (
            <p key={`updated-${index}`} className="text-sm text-zinc-400">
              {block.text}
            </p>
          );
        }

        if (block.type === "section") {
          return (
            <h2
              key={`section-${index}`}
              className="pt-2 text-xl font-semibold text-white"
            >
              {block.text}
            </h2>
          );
        }

        if (block.type === "subsection") {
          return (
            <h3
              key={`subsection-${index}`}
              className="text-base font-semibold text-white"
            >
              {block.text}
            </h3>
          );
        }

        if (block.type === "ul") {
          return (
            <ul
              key={`ul-${index}`}
              className="list-disc space-y-2 pl-5 text-base text-zinc-300"
            >
              {block.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          );
        }

        if (block.type === "ol") {
          return (
            <ol
              key={`ol-${index}`}
              className="list-decimal space-y-2 pl-5 text-base text-zinc-300"
            >
              {block.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          );
        }

        return (
          <p key={`paragraph-${index}`} className="text-base text-zinc-300">
            {block.text}
          </p>
        );
      })}
    </div>
  );
}
