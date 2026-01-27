'use client';

import React from 'react';
import type { Entity, Session, Message } from '@/lib/types';
import DefaultEntityInterface from './default-entity-interface';
import ObserverInterface from './observer-interface';
import ImmutableLedgerInterface from './immutable-ledger-interface';
import RainbowBridgeInterface from './rainbow-bridge-interface';
import GeneratorAuthorityInterface from './generator-authority-interface';
import GrandLitanyInterface from './grand-litany-interface';
import Jitch1Interface from './jitch1-interface';
import InterpreterInterface from './interpreter-interface';
import WorldModelInterface from './worldmodel-interface';
import EpistemicOctagonInterface from './epistemic-octagon-interface';
import FolderAutomatorInterface from './folder-automator-interface';
import GenesisBlockInterface from './genesis-block-interface';
import MetatronInterface from './metatron-interface';
import GodecoderInterface from './godecoder-interface';
import RoundTableInterface from './roundtable-interface';
import RhadamanthusInterface from './rhadamanthus-interface';

interface EntityInterfaceProps {
  entity: Entity;
  session: Session;
  onClose: () => void;
  onSaveSession: (session: Session) => void;
  onCrossEntitySend: (targetEntity: Entity, message: Message) => void;
  allEntities: Entity[];
}

const componentMap: Record<string, React.ComponentType<any>> = {
  OBSERVER: ObserverInterface,
  Immutable_Event_Ledger: ImmutableLedgerInterface,
  RAINBOW_BRIDGE: RainbowBridgeInterface,
  GENERATOR_AUTHORITY: GeneratorAuthorityInterface,
  GRAND_LITANY: GrandLitanyInterface,
  JITCH1: Jitch1Interface,
  INTERPRETER_OF_INTERPRETERS: InterpreterInterface,
  WORLD_MODEL_AND_CONTEXT_BINDER: WorldModelInterface,
  Epistemic_Octagon_Projector: EpistemicOctagonInterface,
  FOLDER_AUTOMATOR: FolderAutomatorInterface,
  GENESIS_BLOCK_RACHEAL: GenesisBlockInterface,
  METATRON: MetatronInterface,
  GODECODER: GodecoderInterface,
  ROUND_TABLE: RoundTableInterface,
  RHADAMANTHUS: RhadamanthusInterface
};

export default function EntityInterface(props: EntityInterfaceProps) {
  const { entity } = props;
  
  const SpecificInterface = componentMap[entity.name] || componentMap[entity.role];

  if (SpecificInterface) {
    return <SpecificInterface {...props} />;
  }

  return <DefaultEntityInterface {...props} />;
}
