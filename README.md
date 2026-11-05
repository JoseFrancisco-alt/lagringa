# Barbearia La'Gringa · protótipo

Protótipo do site da Barbearia La'Gringa (Jatiúca, Maceió/AL), feito para apresentar a ideia ao dono.

**No ar:** https://josefrancisco-alt.github.io/lagringa/

## O que tem
- Abertura com fotos reais de corte espalhadas e a foto do salão crescendo com a rolagem.
- Serviços com preço (tirados do Booksy deles), loja de produtos com "Pedir no WhatsApp", galeria arrastável com setas, barbeiros, mapa e horário.
- Marcação online (`agendar.html`): serviço → barbeiro → dia → hora → dados. A mensagem abre pronta no WhatsApp (+55 82 9398-7108).
- Efeitos: abertura animada, cursor personalizado, botões magnéticos, texto que aparece palavra por palavra, contadores, faixa que entorta com a rolagem, letreiro no rodapé.

## Editar
- Serviços, barbeiros, horário e WhatsApp: topo de `agenda.js`.
- Cores: variáveis no topo de `style.css` (laranja do logo, tijolinho, creme) e `COLORS` em `script.js`.
- Produtos da loja: seção `#loja` em `index.html` (hoje são exemplos, sem preço).

## Pendências antes da versão final
- Confirmar preços e produtos reais da loja.
- Fotos em alta resolução (as atuais vêm do Booksy).
- Horários ocupados são de exemplo: a versão real precisa de banco de dados (plano: Supabase, igual à ótica).

HTML, CSS e JS puros, sem build. Base: protótipo da Raiz & Orgulho + camada de efeitos do site do Manoel Ink.
