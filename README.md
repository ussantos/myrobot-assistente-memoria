# Assistente com Memoria

Exemplo didatico para mostrar contexto, historico e memoria em conversas com IA.

O projeto usa `localStorage` para guardar dados simples do aluno, como nome, interesses e objetivo de estudo. A resposta do assistente muda conforme a memoria salva.

## O que o aluno aprende

- Como uma conversa fica mais util quando usa contexto.
- Como salvar e recuperar dados no navegador.
- Como separar memoria do historico de mensagens.
- Como permitir que o usuario apague informacoes salvas.

## Como rodar

Abra `index.html` no navegador.

Opcionalmente, sirva a pasta com:

```bash
python -m http.server 8001
```

Depois acesse `http://localhost:8001`.

## Proximos passos

- Salvar memorias por usuario em um backend.
- Criar categorias de memoria: perfil, preferencias, tarefas e projetos.
- Conectar um modelo real para gerar respostas mais naturais.
