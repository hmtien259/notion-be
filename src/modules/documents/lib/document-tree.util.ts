import { DocumentEntity } from "../entities/document.entity";

export interface DocumentTreeNode {
  id: string;
  parentId: string | null;
  title: string;
  icon: string;
  coverStyle: string | null;
  preview: string;
  updatedAt: Date;
  children: DocumentTreeNode[];
}

export function buildDocumentTree(documents: DocumentEntity[]) {
  const map = new Map<string, DocumentTreeNode>();

  documents.forEach((document) => {
    map.set(document.id, {
      id: document.id,
      parentId: document.parentId,
      title: document.title,
      icon: document.icon,
      coverStyle: document.coverStyle,
      preview: document.preview,
      updatedAt: document.updatedAt,
      children: [],
    });
  });

  const roots: DocumentTreeNode[] = [];

  documents.forEach((document) => {
    const node = map.get(document.id);

    if (!node) {
      return;
    }

    if (!document.parentId) {
      roots.push(node);
      return;
    }

    const parent = map.get(document.parentId);

    if (!parent) {
      roots.push(node);
      return;
    }

    parent.children.push(node);
  });

  return roots;
}

