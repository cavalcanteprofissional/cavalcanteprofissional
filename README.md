# Portfólio Profissional - Lucas Cavalcante

![Status](https://img.shields.io/badge/Status-Ativo-brightgreen)
![Licença](https://img.shields.io/badge/Licen%C3%A7a-MIT-blue)
![Versão](https://img.shields.io/badge/Vers%C3%A3o-1.0.0-orange)

Landing page profissional desenvolvida para apresentar o currículo e portfólio de Lucas Cavalcante, Analista de Dados especializado em IA, Machine Learning e Visão Computacional.

## 🌟 Recursos Principais

### ✅ Funcionalidades

- **Design Responsivo** - Adaptado para todos os dispositivos
- **Modo Claro/Escuro** - Toggle automático com preferência salva
- **Tradução PT/EN** - Seletor de idiomas com bandeiras
- **Timeline Interativa** - Experiência profissional em formato cronológico
- **Seção de Certificados** - Links para visualização de certificações
- **Sistema de Habilidades** - Organização por categorias
- **SEO Otimizado** - Meta tags e estrutura semântica

### 🎨 Design Moderno

- Interface limpa e profissional
- Animações suaves e transições
- Paleta de cores cuidadosamente selecionada
- Tipografia moderna (Inter Font)
- Ícones FontAwesome

## 🚀 Como Usar

### Instalação Local

```bash
# 1. Clone o repositório ou baixe os arquivos
git clone [seu-repositorio]

# 2. Navegue até a pasta do projeto
cd landing_page

# 3. Estrutura de arquivos criada:
landing_page/
├── index.html          # Página principal
├── style.css           # Estilos CSS
├── script.js           # Lógica JavaScript
├── assets/
│   ├── foto-perfil.jpeg # (Opcional)
│   ├── flags/
│   │   ├── br.svg      # Bandeira do Brasil
│   │   └── us.svg      # Bandeira EUA
│   └── certificados/   # Certificados em PDF/Imagem (Opcional)
│   │   ├── cv_br_nome_sobrenome.pdf # Currículo em português br
│   │   └── cv_en_nome_sobrenome.pdf # Currículo em português en
└── README.md           # Este arquivo

# 4. Abra index.html no navegador
```

### Hospedagem Gratuita

#### Opção 1: GitHub Pages (Recomendado)

```bash
# 1. Crie um repositório no GitHub
# 2. Faça upload dos arquivos
# 3. Vá em Settings > Pages
# 4. Selecione branch 'main' e pasta '/root'
# 5. Acesse: https://seuusuario.github.io/nome-repositorio
```

#### Opção 2: Vercel

```bash
# 1. Instale Vercel CLI
npm i -g vercel

# 2. Execute na pasta do projeto
vercel

# 3. Siga as instruções no terminal
```

#### Opção 3: Netlify

1. Acesse [netlify.com](https://netlify.com)
2. Arraste a pasta do projeto para a área de upload
3. Pronto! Seu site estará online

## 🛠️ Personalização

### 1. Adicionar Foto de Perfil

```html
<!-- No index.html, linha ~180 -->
<div class="hero-image">
    <!-- Substitua o ícone por: -->
    <img src="assets/foto-perfil.jpeg" alt="Nome Sobrenome">
</div>
```

### 2. Adicionar Certificados

- Coloque seus certificados em `assets/certificados/`
- Formato recomendado: PDF ou imagens (PNG, JPG)
- Atualize os links no HTML (seção "Certificações")

### 3. Atualizar Informações Pessoais

Edite as seguintes seções no `index.html`:

- Informações de contato
- Experiência profissional
- Habilidades técnicas
- Links de redes sociais
- Certificações

### 4. Alterar Cores

```css
/* No style.css, edite as variáveis: */
:root {
    --primary-light: #2563eb;       /* Cor primária modo claro */
    --primary-dark: #3b82f6;        /* Cor primária modo escuro */
    --secondary-light: #0f172a;     /* Texto principal */
    /* ... outras cores */
}
```

## 📱 Compatibilidade

| Navegador | Suporte | Notas |
|-----------|---------|-------|
| Chrome | ✅ Completo | Versão 90+ |
| Firefox | ✅ Completo | Versão 88+ |
| Safari | ✅ Completo | Versão 14+ |
| Edge | ✅ Completo | Versão 90+ |
| Mobile | ✅ Completo | iOS/Android |

## ⚙️ Configuração Técnica

### Dependências

- FontAwesome 6.4.0
- Google Fonts: Inter
- SVG local para bandeiras

### Estrutura de Código

```javascript
// Organização principal do JavaScript
script.js
├── initializeTheme()        // Gerenciamento tema claro/escuro
├── setupLanguageSelector()  // Controle de idiomas
├── setupMobileMenu()        // Menu responsivo
├── setupSmoothScrolling()   // Navegação suave
├── translations{}           // Dicionário PT/EN
└── Utility Functions        // Funções auxiliares
```

### SEO Otimizado

- Meta tags para descrição e keywords
- Título dinâmico por idioma
- Estrutura semântica HTML5
- Imagens com alt text
- URLs amigáveis

## 🔧 Solução de Problemas

### Problema: Bandeiras não aparecem

```css
/* Verifique no style.css: */
.flag-br {
    background-image: url('assets/flags/br.svg'); /* Caminho correto? */
}
```

**Solução:**
- Verifique se os arquivos SVG estão em `assets/flags/`
- Confira os nomes: `br.svg` e `us.svg`
- Teste com caminho absoluto: `/assets/flags/br.svg`

### Problema: Tradução não funciona

```javascript
// Verifique no console do navegador
console.log(localStorage.getItem('language'));
// Deve retornar 'pt' ou 'en'
```

### Problema: Modo escuro não persiste

```javascript
// O tema é salvo no localStorage
localStorage.setItem('theme', 'dark-mode');
```

## 📊 Performance

### Otimizações Implementadas

- CSS minificado e organizado
- JavaScript eficiente com eventos delegados
- Imagens otimizadas (lazy loading pronto)
- Fontes carregadas de CDN confiável
- Caching via localStorage

### Pontuação Lighthouse (Estimada)

- **Performance:** 95+
- **Accessibility:** 100
- **Best Practices:** 100
- **SEO:** 100

## 🎯 Recursos Futuros

### Planejado para Próximas Versões

- **Formulário de Contato** - Integração com email
- **Portfólio de Projetos** - Galeria com filtros
- **Blog Técnico** - Artigos sobre Data Science
- **Animações Avançadas** - GSAP para micro-interações
- **Dashboard Interativo** - Visualizações de dados em tempo real
- **API de Projetos** - Integração com GitHub API

### Melhorias Técnicas

- PWA (Progressive Web App)
- Service Workers para offline
- Web Components reutilizáveis
- Testes automatizados (Jest)
- CI/CD pipeline

## 🤝 Contribuindo

### Encontrou um bug?

1. Verifique a seção de problemas
2. Abra uma issue no GitHub
3. Descreva o problema com detalhes

### Quer contribuir?

1. Fork o repositório
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Add nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo LICENSE para detalhes.

### Direitos de Uso

✅ Use livremente para projetos pessoais  
✅ Modifique e adapte conforme necessário  
✅ Compartilhe com crédito apropriado  
❌ Não revenda como template  
❌ Não remova créditos originais

## 📞 Suporte e Contato

### Contato do Desenvolvedor

- **Nome:** Lucas Cavalcante dos Santos
- **Email:** cavalcanteprofissional@outlook.com
- **LinkedIn:** [linkedin.com/in/cavalcante-Lucas](https://linkedin.com/in/cavalcante-Lucas)
- **GitHub:** [github.com/cavalcanteprofissional](https://github.com/cavalcanteprofissional)
- **Telefone:** (85) 9 9685-9051

### Canais de Suporte

- **Issues no GitHub** - Para bugs e melhorias
- **Email** - Para consultas profissionais
- **LinkedIn** - Para conexões profissionais

## 🌐 Links Úteis

### Ferramentas Utilizadas

- [VS Code](https://code.visualstudio.com/) - Editor de código
- [Git](https://git-scm.com/) - Controle de versão
- [Google Fonts](https://fonts.google.com/) - Tipografia
- [FontAwesome](https://fontawesome.com/) - Ícones
- [SVGOMG](https://jakearchibald.github.io/svgomg/) - Otimizador SVG

### Recursos de Aprendizado

- [MDN Web Docs](https://developer.mozilla.org/)
- [CSS-Tricks](https://css-tricks.com/)
- [JavaScript Info](https://javascript.info/)
- [FreeCodeCamp](https://www.freecodecamp.org/)

## 🎉 Agradecimentos

- Agradecimentos à comunidade open source
- Inspiração de designs modernos do Dribbble e Behance
- Suporte da equipe de desenvolvimento
- Todos os contribuidores e testadores

---

✨ **Desenvolvido com paixão por tecnologia e design** ✨

**Última atualização:** Janeiro 2026  
**Versão:** 1.0.0  
**Por:** Lucas Cavalcante

<div align="center">

[⬆ Voltar ao topo](#portfólio-profissional---lucas-cavalcante)

</div>