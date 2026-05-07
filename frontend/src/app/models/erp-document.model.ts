export interface ErpDocument {
  id: number;
  source_name: string;
  content: string;
  created_at: string;
}

export interface ErpDocumentCreate {
  source_name: string;
  content: string;
}
