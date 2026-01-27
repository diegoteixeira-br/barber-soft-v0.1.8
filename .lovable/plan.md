

# Redesign do Botão do Chat - Formato Nuvem de Conversa

## O Que Será Alterado

Vou redesenhar o botão flutuante do chat de suporte para ter um formato de **balão de conversa (speech bubble)** com:

- Texto **"Suporte 24h"** escrito na parte superior
- A letra **"J"** centralizada no meio do balão
- Mantendo as cores douradas/gold atuais que você aprovou
- Um "rabinho" de balão de conversa apontando para baixo/direita

## Design Visual

```text
   ┌─────────────────┐
   │  Suporte 24h    │
   │                 │
   │       J         │
   │                 │
   └──────┬──────────┘
          ▼
     (rabinho do balão)
```

## Detalhes Técnicos

### Estrutura do Componente

```text
<button> (container flutuante)
  └── <div> (formato balão com borda dourada)
       ├── <span> "Suporte 24h" (texto superior)
       ├── <span> "J" (letra centralizada, grande)
       └── <div> (rabinho do balão - pseudo-elemento ou div)
```

### Cores e Estilo

| Elemento | Estilo |
|----------|--------|
| Fundo do balão | Transparente ou preto (#000) |
| Borda | Dourada (primary - #D4AF37) 2px |
| Texto "Suporte 24h" | Dourado, fonte pequena (text-xs) |
| Letra "J" | Dourado, fonte grande e bold |
| Rabinho | Borda dourada, mesma espessura |

### Posicionamento

- Fixo no canto inferior direito
- Maior que o botão atual (aproximadamente 80x70px)
- Animação de hover sutil (scale ou glow)

## Arquivo a Modificar

| Arquivo | Alteração |
|---------|-----------|
| `src/components/support/SupportChatWidget.tsx` | Substituir o botão circular pelo novo design de balão de conversa |

## Comportamento

- Clique abre o chat (mesmo comportamento atual)
- Animação de entrada suave
- Efeito hover com leve brilho/scale
- Some quando o chat está aberto (comportamento atual mantido)

