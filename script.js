// ===== CONFIGURAÇÃO INICIAL =====
document.addEventListener('DOMContentLoaded', function() {
    // Configurar ano atual no footer
    document.getElementById('currentYear').textContent = new Date().getFullYear();
    
    // Inicializar tema baseado na preferência do usuário
    initializeTheme();
    
    // Inicializar idioma
    initializeLanguage();
    
    // Configurar navegação mobile
    setupMobileMenu();
    
    // Configurar smooth scrolling
    setupSmoothScrolling();
    
    // Configurar alternância de tema
    setupThemeToggle();
    
    // Configurar seletor de idioma
    setupLanguageSelector();
    
    // Adicionar animações de entrada
    setupAnimations();
    
    // Configurar links de certificados
    setupCertificateLinks();
});

// ===== GERENCIAMENTO DE TEMA =====
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
        document.body.className = savedTheme;
    } else if (prefersDark) {
        document.body.classList.add('dark-mode');
        document.body.classList.remove('light-mode');
    } else {
        document.body.classList.add('light-mode');
        document.body.classList.remove('dark-mode');
    }
    
    updateThemeIcon();
}

function setupThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    
    themeToggle.addEventListener('click', function() {
        toggleTheme();
    });
}

function toggleTheme() {
    if (document.body.classList.contains('light-mode')) {
        document.body.classList.remove('light-mode');
        document.body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
        document.body.classList.add('light-mode');
        localStorage.setItem('theme', 'light-mode');
    }
    
    updateThemeIcon();
}

function updateThemeIcon() {
    const themeIcon = document.querySelector('#themeToggle i');
    
    if (document.body.classList.contains('dark-mode')) {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
        themeIcon.title = 'Alternar para modo claro';
    } else {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
        themeIcon.title = 'Alternar para modo escuro';
    }
}

// ===== GERENCIAMENTO DE IDIOMA =====
function initializeLanguage() {
    const savedLang = localStorage.getItem('language');
    const browserLang = navigator.language.substring(0, 2);
    
    if (savedLang) {
        setLanguage(savedLang);
    } else if (browserLang === 'en' || browserLang === 'pt') {
        setLanguage(browserLang);
    } else {
        setLanguage('pt');
    }
}

function setupLanguageSelector() {
    const languageBtn = document.getElementById('languageBtn');
    const languageDropdown = document.getElementById('languageDropdown');
    const languageOptions = document.querySelectorAll('.language-option');
    
    if (!languageBtn || !languageDropdown) return;
    
    // Abrir/fechar dropdown
    languageBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        languageDropdown.classList.toggle('show');
    });
    
    // Selecionar idioma
    languageOptions.forEach(option => {
        option.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            setLanguage(lang);
            languageDropdown.classList.remove('show');
            
            // Atualizar botão
            updateLanguageButton(lang);
        });
    });
    
    // Fechar dropdown ao clicar fora
    document.addEventListener('click', function() {
        languageDropdown.classList.remove('show');
    });
    
    // Impedir que clique no dropdown feche
    languageDropdown.addEventListener('click', function(e) {
        e.stopPropagation();
    });
}

function updateLanguageButton(lang) {
    const languageBtn = document.getElementById('languageBtn');
    const flagSpan = languageBtn.querySelector('.flag-icon');
    const codeSpan = languageBtn.querySelector('.lang-code');
    
    if (lang === 'en') {
        flagSpan.className = 'flag-icon flag-us';
        flagSpan.title = 'English';
        codeSpan.textContent = 'EN';
    } else {
        flagSpan.className = 'flag-icon flag-br';
        flagSpan.title = 'Português';
        codeSpan.textContent = 'PT';
    }
}

function setLanguage(lang) {
    document.body.setAttribute('data-lang', lang);
    localStorage.setItem('language', lang);
    updateLanguageButton(lang);
    translatePage(lang);
}

// ===== TRADUÇÃO =====
const translations = {
    pt: {
        // Navegação
        'nav.home': 'Início',
        'nav.experience': 'Experiência',
        'nav.skills': 'Habilidades',
        'nav.certifications': 'Certificações',
        'nav.languages': 'Idiomas',
        
        // Hero Section
        'hero.name': 'Lucas Cavalcante dos Santos',
        'hero.title': 'Analista de Dados | IA & Machine Learning | Visão Computacional',
        'hero.description': 'Analista de Dados com experiência em projetos de IA, automação e marketing digital. Especializado no desenvolvimento de chatbots, dashboards interativos, pipelines de dados de séries temporais e geoespaciais, e implementação de estratégias de SEO/SEM.',
        
        // Contato
        'contact.location': 'Fortaleza - CE',
        
        // Botões
        'button.cv': 'Currículo',
        'button.view': 'Ver Certificado',
        
        // Seções
        'sections.experience': 'Experiência Profissional',
        'sections.skills': 'Habilidades Técnicas',
        'sections.certifications': 'Certificações',
        'sections.languages': 'Idiomas',
        
        // Experiência
        'experience.1.title': 'Analista de Dados',
        'experience.1.1': 'Definição do escopo e modelagem de dados (DER) para projeto no mercado de moda do Ceará.',
        'experience.1.2': 'Coleta, limpeza e preparação de datasets utilizando Python e bibliotecas de análise.',
        'experience.1.3': 'Realização de Análise Exploratória de Dados (EDA) e cálculo de estatísticas descritivas.',
        'experience.1.4': 'Implementação de modelo de machine learning (Random Forest) com avaliação de métricas.',
        'experience.1.5': 'Geração de dashboards interativos e relatórios para alta gestão.',
        
        'experience.2.title': 'Analista de Dados',
        'experience.2.1': 'Definição do escopo e modelagem de dados (DER) para projeto no mercado de moda do Ceará.',
        'experience.2.2': 'Coleta, limpeza e preparação de datasets utilizando Python e bibliotecas de análise.',
        'experience.2.3': 'Realização de Análise Exploratória de Dados (EDA) e cálculo de estatísticas descritivas.',
        'experience.2.4': 'Implementação de modelo de machine learning (Random Forest) com avaliação de métricas.',
        'experience.2.5': 'Geração de dashboards interativos e relatórios para alta gestão.',
        
        'experience.3.title': 'Analista de Marketing e Comercial',
        'experience.3.1': 'Planejamento e gestão de campanhas digitais (Google Ads, Meta Ads) com monitoramento de KPIs.',
        'experience.3.2': 'Implementação de estratégias de SEO e SEM, resultando em aumento do tráfego orgânico.',
        'experience.3.3': 'Criação e edição de conteúdo audiovisual para redes sociais e funis de vendas.',
        'experience.3.4': 'Gerenciamento de CRM via ERP interno.',
        'experience.3.5': 'Suporte à equipe comercial na prospecção e fidelização de clientes.',
        
        'experience.4.title': 'Analista de Marketing | Assistente de Marketing',
        'experience.4.1': 'Desenvolvimento e monitoramento de campanhas promocionais.',
        'experience.4.2': 'Implementação de estratégias de SEO/SEM e gestão de conteúdo para site e redes sociais.',
        'experience.4.3': 'Criação de conteúdo gráfico e manutenção dos canais de comunicação digitais.',
        
        'experience.5.title': 'Técnico em Informática e Redes',
        'experience.5.company': 'Autônomo',
        'experience.5.1': 'Montagem, manutenção e configuração de infraestrutura de TI (computadores, servidores, redes TCP/IP, Wi-Fi).',
        'experience.5.2': 'Suporte técnico remoto e presencial, instalação de software e permissionamento de acesso.',
        'experience.5.3': 'Consultoria técnica e elaboração de propostas para licitações de equipamentos.',
        
        // Habilidades
        'skills.languages': 'Linguagens & Bibliotecas',
        'skills.ml': 'Machine Learning',
        'skills.dl': 'Deep Learning & Visão Computacional',
        'skills.platforms': 'Plataformas & Ferramentas',
        'skills.marketing': 'Marketing Digital',
        'skills.tech': 'Técnico em TI',
        'skills.agile': 'Gestão Ágil',
        'skills.office': 'Microsoft Office',
        'skills.soft': 'Habilidades Interpessoais',
        'skills.communication': 'Comunicação',
        'skills.teamwork': 'Trabalho em Equipe',
        'skills.problem-solving': 'Resolução de Problemas',
        'skills.adaptability': 'Adaptabilidade',
        'skills.time-management': 'Gestão de Tempo',
        'skills.critical-thinking': 'Pensamento Crítico',
        'skills.creativity': 'Criatividade',

        // Certificações
        'certifications.subtitle': 'Clique nos links para visualizar os certificados',
        'cert.1.title': 'Inteligência Artificial',
        'cert.2.title': 'Administração de Banco de Dados',
        'cert.3.title': 'Engenharia de Software',
        'cert.4.title': 'Ciência de Dados',
        'cert.5.title': 'AWS Cloud Practitioner',
        'cert.6.title': 'DevOps',
        'cert.7.title': 'Python AI Backend Developer',
        'cert.8.title': 'Design Gráfico & Web Design',
        'cert.9.title': 'Análise e Desenvolvimento de Sistemas',
        'cert.10.title': 'Ciências Sociais',
        
        // Idiomas
        'lang.portuguese': 'Português',
        'lang.english': 'Inglês',
        'lang.spanish': 'Espanhol',
        'lang.japanese': 'Japonês',
        'lang.level.native': 'Nativo',
        'lang.level.advanced': 'Avançado',
        'lang.level.basic': 'Básico',
        
        // Footer
        'footer.contact': 'Entre em Contato',
        'footer.message': 'Estou sempre aberto a novas oportunidades e colaborações.',
        'footer.rights': 'Todos os direitos reservados.'
    },
    
    en: {
        // Navigation
        'nav.home': 'Home',
        'nav.experience': 'Experience',
        'nav.skills': 'Skills',
        'nav.certifications': 'Certifications',
        'nav.languages': 'Languages',
        
        // Hero Section
        'hero.name': 'Lucas Cavalcante dos Santos',
        'hero.title': 'Data Analyst | AI & Machine Learning | Computer Vision',
        'hero.description': 'Data Analyst with experience in AI, automation, and digital marketing projects. Specialized in developing chatbots, interactive dashboards, time series and geospatial data pipelines, and implementing SEO/SEM strategies.',
        
        // Contact
        'contact.location': 'Fortaleza - CE, Brazil',
        
        // Buttons
        'button.cv': 'Resume',
        'button.view': 'View Certificate',
        
        // Sections
        'sections.experience': 'Professional Experience',
        'sections.skills': 'Technical Skills',
        'sections.certifications': 'Certifications',
        'sections.languages': 'Languages',
        
        // Experience
        'experience.1.title': 'Data Analyst',
        'experience.1.1': 'Definition of scope and data modeling (ERD) for a project in the Ceará fashion market.',
        'experience.1.2': 'Collection, cleaning, and preparation of datasets using Python and analysis libraries.',
        'experience.1.3': 'Performance of Exploratory Data Analysis (EDA) and calculation of descriptive statistics.',
        'experience.1.4': 'Implementation of machine learning model (Random Forest) with metric evaluation.',
        'experience.1.5': 'Generation of interactive dashboards and reports for senior management.',

        'experience.2.title': 'Data Analyst',
        'experience.2.1': 'Definition of scope and data modeling (ERD) for a project in the Ceará fashion market.',
        'experience.2.2': 'Collection, cleaning, and preparation of datasets using Python and analysis libraries.',
        'experience.2.3': 'Performance of Exploratory Data Analysis (EDA) and calculation of descriptive statistics.',
        'experience.2.4': 'Implementation of machine learning model (Random Forest) with metric evaluation.',
        'experience.2.5': 'Generation of interactive dashboards and reports for senior management.',
        
        'experience.3.title': 'Marketing and Commercial Analyst',
        'experience.3.1': 'Planning and management of digital campaigns (Google Ads, Meta Ads) with KPI monitoring.',
        'experience.3.2': 'Implementation of SEO and SEM strategies, resulting in increased organic traffic.',
        'experience.3.3': 'Creation and editing of audiovisual content for social media and sales funnels.',
        'experience.3.4': 'CRM management via internal ERP.',
        'experience.3.5': 'Support to the commercial team in customer prospecting and retention.',
        
        'experience.4.title': 'Marketing Analyst | Marketing Assistant',
        'experience.4.1': 'Development and monitoring of promotional campaigns.',
        'experience.4.2': 'Implementation of SEO/SEM strategies and content management for website and social media.',
        'experience.4.3': 'Creation of graphic content and maintenance of digital communication channels.',
        
        'experience.5.title': 'IT and Networks Technician',
        'experience.5.company': 'Freelancer',
        'experience.5.1': 'Assembly, maintenance, and configuration of IT infrastructure (computers, servers, TCP/IP networks, Wi-Fi).',
        'experience.5.2': 'Remote and on-site technical support, software installation, and access permissioning.',
        'experience.5.3': 'Technical consulting and preparation of proposals for equipment bidding.',
        
        // Skills
        'skills.languages': 'Languages & Libraries',
        'skills.ml': 'Machine Learning',
        'skills.dl': 'Deep Learning & Computer Vision',
        'skills.platforms': 'Platforms & Tools',
        'skills.marketing': 'Digital Marketing',
        'skills.tech': 'IT Technician',
        'skills.agile': 'Agile Management',
        'skills.office': 'Microsoft Office',
        'skills.soft': 'Soft Skills',
        'skills.communication': 'Communication',
        'skills.teamwork': 'Teamwork',
        'skills.problem-solving': 'Problem Solving',
        'skills.adaptability': 'Adaptability',
        'skills.time-management': 'Time Management',
        'skills.critical-thinking': 'Critical Thinking',
        'skills.creativity': 'Creativity',

        // Certifications
        'certifications.subtitle': 'Click on links to view certificates',
        'cert.1.title': 'Artificial Intelligence',
        'cert.2.title': 'Database Administration',
        'cert.3.title': 'Software Engineering',
        'cert.4.title': 'Data Science',
        'cert.5.title': 'AWS Cloud Practitioner',
        'cert.6.title': 'DevOps',
        'cert.7.title': 'Python AI Backend Developer',
        'cert.8.title': 'Graphic & Web Design',
        'cert.9.title': 'Systems Analysis and Development',
        'cert.10.title': 'Social Sciences',
        
        // Languages
        'lang.portuguese': 'Portuguese',
        'lang.english': 'English',
        'lang.spanish': 'Spanish',
        'lang.japanese': 'Japanese',
        'lang.level.native': 'Native',
        'lang.level.advanced': 'Advanced',
        'lang.level.basic': 'Basic',
        
        // Footer
        'footer.contact': 'Contact Me',
        'footer.message': 'I am always open to new opportunities and collaborations.',
        'footer.rights': 'All rights reserved.'
    }
};

function translatePage(lang) {
    const elements = document.querySelectorAll('[data-translate]');
    
    elements.forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
    
    // Atualizar título da página
    if (lang === 'en') {
        document.title = 'Lucas Cavalcante | Data Analyst & AI';
    } else {
        document.title = 'Lucas Cavalcante | Analista de Dados & IA';
    }
}

// ===== MENU MOBILE =====
function setupMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    
    if (!mobileMenuBtn || !navLinks) return;
    
    mobileMenuBtn.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        const icon = this.querySelector('i');
        
        if (navLinks.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
            this.setAttribute('aria-expanded', 'true');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
            this.setAttribute('aria-expanded', 'false');
        }
    });
    
    // Fechar menu ao clicar em um link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            mobileMenuBtn.querySelector('i').classList.remove('fa-times');
            mobileMenuBtn.querySelector('i').classList.add('fa-bars');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
        });
    });
    
    // Fechar menu ao clicar fora
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.navbar') && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            mobileMenuBtn.querySelector('i').classList.remove('fa-times');
            mobileMenuBtn.querySelector('i').classList.add('fa-bars');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
        }
    });
}

// ===== SMOOTH SCROLLING =====
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== ANIMAÇÕES =====
function setupAnimations() {
    // Observador de interseção para animações de entrada
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);
    
    // Observar elementos para animação
    document.querySelectorAll('.timeline-item, .skill-category, .cert-card, .language-item').forEach(el => {
        observer.observe(el);
    });
}

// ===== LINKS DE CERTIFICADOS =====
function setupCertificateLinks() {
    // Adicionar confirmação para links externos
    document.querySelectorAll('a[target="_blank"]').forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.href.includes('certificados/')) {
                // Verificar se o arquivo existe (simulação)
                const fileName = this.href.split('/').pop();
                console.log(`Abrindo certificado: ${fileName}`);
                // Aqui você poderia adicionar analytics ou tracking
            }
        });
    });
}

// ===== CACHE =====
// Adiciona evento para salvar preferências ao fechar a página
window.addEventListener('beforeunload', function() {
    const currentTheme = document.body.classList.contains('dark-mode') ? 'dark-mode' : 'light-mode';
    const currentLang = document.body.getAttribute('data-lang') || 'pt';
    
    localStorage.setItem('theme', currentTheme);
    localStorage.setItem('language', currentLang);
});

// ===== FUNÇÕES ÚTEIS =====
function showNotification(message, type = 'info') {
    // Criar elemento de notificação
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    // Estilos para notificação
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        border-radius: 5px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 9999;
        display: flex;
        align-items: center;
        gap: 10px;
        animation: slideIn 0.3s ease-out;
    `;
    
    // Adicionar estilos para animação
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    // Botão de fechar
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', function() {
        notification.style.animation = 'slideOut 0.3s ease-out forwards';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    });
    
    // Adicionar ao DOM
    document.body.appendChild(notification);
    
    // Remover automaticamente após 5 segundos
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease-out forwards';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
    }, 5000);
}