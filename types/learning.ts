export interface LearningFile {
  id: string;
  name: string;
  type: 'link' | 'document';
  url?: string;
  tags: string;
  folderId?: string;
  timestamp: string;
}
