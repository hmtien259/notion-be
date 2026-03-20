export function extractPreviewFromContent(content: Record<string, unknown>) {
  const collectedText: string[] = [];

  function collect(node: unknown) {
    if (!node || typeof node !== "object") {
      return;
    }

    const candidate = node as { text?: unknown; content?: unknown[] };

    if (typeof candidate.text === "string") {
      collectedText.push(candidate.text);
    }

    if (Array.isArray(candidate.content)) {
      candidate.content.forEach((childNode) => collect(childNode));
    }
  }

  collect(content);

  const preview = collectedText.join(" ").replace(/\s+/g, " ").trim();
  return preview.slice(0, 180) || "Empty document";
}

export function createEmptyDocumentContent() {
  return {
    type: "doc",
    content: [
      {
        type: "paragraph",
      },
    ],
  };
}

