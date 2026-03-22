# Ajustes v28 — Excluir perfil com senha universal

## O que foi adicionado
- Botão **Excluir perfil** na área de Perfil/Estudante.
- A exclusão só acontece se a senha universal `bondadejfa` for digitada corretamente.
- Se a senha estiver errada, o perfil permanece intacto com todos os dados salvos.

## Comportamento
- O botão aparece apenas quando existe um perfil local selecionado.
- Ao confirmar a senha universal correta, o sistema pede uma confirmação final antes de apagar.
- A exclusão apaga apenas os dados locais deste dispositivo:
  - PIN do perfil
  - progresso local
  - histórico local
  - snapshot local da sessão
  - vínculo local com a nuvem neste navegador
  - itens da fila local de sincronização daquele perfil
- Se o perfil excluído for o perfil ativo, o app volta para modo visitante.

## Segurança
- Sem a senha universal correta, nada é apagado.
- O sistema mostra mensagem explícita informando que o perfil foi mantido.
