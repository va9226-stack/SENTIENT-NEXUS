export interface Entity {
  id: string;
  name: string;
  symbol?: string;
  role: string;
  integrity_score: number;
  rarity_score: number;
  status: 'ACTIVE' | 'DORMANT' | 'PENDING' | 'SEALED';
  ontology: string;
  capabilities: string[];
  constraints: string[];
  instructions?: string;
  model_type?: 'sphere' | 'cube' | 'pyramid' | 'icosahedron' | 'torus';
  color_scheme: {
    primary: string;
    secondary: string;
  };
  octagon?: Record<string, any>;
}

export interface Message {
  id?: number | string;
  role: 'user' | 'entity' | 'system' | 'observer' | 'cross-entity';
  content: string;
  timestamp: string;
  source_entity?: string;
  visualization?: any;
  concepts?: any;
}

export interface Session {
  entity_id: string;
  entity_name: string;
  messages: Message[];
  state: Record<string, any>;
}

export interface Learning {
  id: string;
  entity_id: string;
  entity_name: string;
  learning_type: string;
  content: string;
  context: string;
  source: string;
  confidence_score: number;
  usage_count: number;
  success_rate: number;
  is_active?: boolean;
}
