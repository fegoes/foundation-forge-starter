export interface KanbanCard {
  id: number
  titulo: string
  cliente: string
  valor: number
  dataVencimento: string
  descricao: string
  prioridade: "baixa" | "media" | "alta"
  tags: string[]
  anexos: number
  comentarios: Comentario[]
  atividades: Atividade[]
  servicos: ServicoItem[]
  stageId: number
  createdAt: string
  updatedAt: string
  status: string
  labels?: string[]
  membros?: string[]
  acaoId?: number
}

export interface Stage {
  id: number
  nome: string
  ordem: number
  cor: string
  cards: KanbanCard[]
}

export interface Comentario {
  id: number
  texto: string
  autor: string
  createdAt: string
  timestamp?: string
  tipo?: string
  icone?: string
}

export interface Atividade {
  id: number
  tipo: string
  descricao: string
  data: string
  autor: string
}

export interface Anexo {
  id: number
  nome: string
  url: string
  tipo: string
  tamanho: number
}

export interface ServicoItem {
  id: number
  nome: string
  quantidade: number
  valor: number
  produtoId?: number
  produto?: string
}

export interface AcaoCard {
  id: number
  nome: string
  descricao: string
  icone: string
  cor: string
  ordem?: number
}