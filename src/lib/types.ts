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

export interface ThresholdConfig {
  metric: string;
  threshold_value: number;
  condition: string;
  actual_value: number;
}

export interface Alert {
  id?: string;
  entity_id: string;
  entity_name?: string;
  alert_type:
    | 'INTEGRITY_DROP'
    | 'STATUS_CHANGE'
    | 'PERFORMANCE_ISSUE'
    | 'THRESHOLD_BREACH'
    | 'ANOMALY_DETECTED';
  severity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  message: string;
  threshold_config?: ThresholdConfig;
  acknowledged?: boolean;
  acknowledged_by?: string;
  acknowledged_at?: string;
  resolved?: boolean;
  metadata?: Record<string, any>;
  timestamp: string;
}

export interface EntityMetric {
  id?: string;
  entity_id: string;
  entity_name?: string;
  metric_name:
    | 'task_completion_rate'
    | 'communication_efficiency'
    | 'resource_utilization'
    | 'response_time'
    | 'error_rate'
    | 'interaction_count';
  value: number;
  timestamp: string;
  metadata?: Record<string, any>;
}
