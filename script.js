// ===== CONFIGURAÇÃO INICIAL =====
document.addEventListener('DOMContentLoaded', function () {
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
    
    setupCertificateLinksAlternative();
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

    themeToggle.addEventListener('click', function () {
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
    } else if (browserLang === 'en' || browserLang === 'pt' || browserLang === 'es') {
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
    languageBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        languageDropdown.classList.toggle('show');
    });

    // Selecionar idioma
    languageOptions.forEach(option => {
        option.addEventListener('click', function () {
            const lang = this.getAttribute('data-lang');
            setLanguage(lang);
            languageDropdown.classList.remove('show');
            updateLanguageButton(lang);
        });
    });

    // Fechar dropdown ao clicar fora
    document.addEventListener('click', function () {
        languageDropdown.classList.remove('show');
    });

    // Impedir que clique no dropdown feche
    languageDropdown.addEventListener('click', function (e) {
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
    } else if (lang === 'es') {
        flagSpan.className = 'flag-icon flag-es';
        flagSpan.title = 'Español';
        codeSpan.textContent = 'ES';
    } else {
        flagSpan.className = 'flag-icon flag-br';
        flagSpan.title = 'Português';
        codeSpan.textContent = 'PT';
    }
}

// ===== GERENCIAMENTO DE CV =====
function setupCvLink(lang) {
    const cvLinks = document.querySelectorAll(".cv-download-link");
    
    cvLinks.forEach(link => {
        if (lang === "en") {
            link.href = "assets/certificados/cv_en_lucas_cavalcante.pdf";
            link.setAttribute("aria-label", "Download Resume");
            link.download = "Lucas_Cavalcante_Resume.pdf";
        } else if (lang === "es") {
            link.href = "assets/certificados/cv_es_lucas_cavalcante.pdf";
            link.setAttribute("aria-label", "Descargar Currículum");
            link.download = "Lucas_Cavalcante_Curriculum.pdf";
        } else {
            link.href = "assets/certificados/cv_br_lucas_cavalcante.pdf";
            link.setAttribute("aria-label", "Download Currículo");
            link.download = "Lucas_Cavalcante_Curriculo.pdf";
        }
        // CORREÇÃO: Adicionar target blank para abrir em nova aba
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
    });
}

// ===== GERENCIAMENTO DE CERTIFICADOS =====
function setupCertificateLinks() {
    console.log("Configurando links dos certificados...");
    
    const certificateFiles = {
        'cert1Link': 'montagem_manutencao.pdf',
        'cert2Link': 'design_grafico.pdf',
        'cert3Link': 'ciencias_sociais_ufc.pdf',
        'cert4Link': 'fullstack_iel.pdf',
        'cert5Link': 'devops_ada.pdf',
        'cert6Link': 'ciencia_dados_uece.pdf',
        'cert7Link': 'ads_unifor.pdf',
        'cert8Link': 'engenharia_software.pdf',
        'cert9Link': 'banco_dados.pdf'
    };
    
    Object.entries(certificateFiles).forEach(([id, file]) => {
        const link = document.getElementById(id);
        if (link) {
            // CORREÇÃO: Remova o atributo download e configure para abrir em nova aba
            link.href = `assets/certificados/${file}`;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            
            // Remove o atributo download se existir
            if (link.hasAttribute('download')) {
                link.removeAttribute('download');
            }
            
            // Adiciona título para acessibilidade
            link.title = `Visualizar certificado: ${file.replace('.pdf', '').replace(/_/g, ' ')}`;
            
            // Evento de clique para logging
            link.addEventListener('click', function() {
                console.log(`Abrindo certificado: ${file}`);
            });
        } else {
            console.warn(`Elemento com ID ${id} não encontrado`);
        }
    });
    
    console.log("✅ Links dos certificados configurados!");
}

// ===== SOLUÇÃO ALTERNATIVA PARA CERTIFICADOS =====
function setupCertificateLinksAlternative() {
    console.log("🔄 Usando solução alternativa para certificados...");
    
    const certificateFiles = {
        'cert1Link': 'montagem_manutencao.pdf',
        'cert2Link': 'design_grafico.pdf',
        'cert3Link': 'ciencias_sociais_ufc.pdf',
        'cert4Link': 'fullstack_iel.pdf',
        'cert5Link': 'devops_ada.pdf',
        'cert6Link': 'ciencia_dados_uece.pdf',
        'cert7Link': 'ads_unifor.pdf',
        'cert8Link': 'engenharia_software.pdf',
        'cert9Link': 'banco_dados.pdf'
    };
    
    Object.entries(certificateFiles).forEach(([id, file]) => {
        const link = document.getElementById(id);
        if (link) {
            // Substituir completamente o comportamento do link
            link.onclick = function(e) {
                e.preventDefault();
                
                // Determinar o caminho base
                let basePath = 'assets/certificados/';
                const currentPath = window.location.pathname;
                
                if (currentPath.includes('/index.html') || currentPath.endsWith('/')) {
                    basePath = './assets/certificados/';
                }
                
                const fileUrl = basePath + file;
                console.log(`📤 Abrindo: ${fileUrl}`);
                
                // Abrir em nova janela
                window.open(fileUrl, '_blank', 'noopener,noreferrer');
                
                return false;
            };
            
            // Remover href original para prevenir comportamento padrão
            link.removeAttribute('href');
            link.style.cursor = 'pointer';
            
            console.log(`✅ ${id} configurado: ${file}`);
        }
    });
    
    console.log("✅ Solução alternativa aplicada!");
}

// ===== FUNÇÃO PRINCIPAL SETLANGUAGE =====
function setLanguage(lang) {
    // Validar idioma
    const validLanguages = ['pt', 'en', 'es'];
    if (!validLanguages.includes(lang)) {
        lang = 'pt'; // Fallback para português
    }
    
    console.log(`Alterando idioma para: ${lang}`);
    
    document.body.setAttribute('data-lang', lang);
    localStorage.setItem('language', lang);
    
    updateLanguageButton(lang);
    translatePage(lang);
    
    // Atualiza os links do CV
    setupCvLink(lang);
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
        'experience.1.4': 'Geração de dashboards interativos e relatórios para alta gestão utilizando Power BI.',

        'experience.2.title': 'Analista de Dados',
        'experience.2.1': 'Definição do escopo e modelagem de dados (DER) para projeto no mercado de moda do Ceará.',
        'experience.2.2': 'Coleta, limpeza e preparação de datasets utilizando Python e bibliotecas de análise.',
        'experience.2.3': 'Realização de Análise Exploratória de Dados (EDA) e cálculo de estatísticas descritivas.',
        'experience.2.4': 'Implementação de modelo de machine learning (Random Forest) com avaliação de métricas.',
        'experience.2.5': 'Geração de dashboards interativos e relatórios para alta gestão utilizando Streamlit.',

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
        'cert.1.title': 'Montagem e Manutenção de Computadores',
        'cert.2.title': 'Design Gráfico & Web Design',
        'cert.3.title': 'Ciências Sociais',
        'cert.4.title': 'Desenvolvedor FullStack',
        'cert.5.title': 'DevOps',
        'cert.6.title': 'Ciência de Dados',
        'cert.7.title': 'Análise e Desenvolvimento de Sistemas',
        'cert.8.title': 'Engenharia de Software',
        'cert.9.title': 'Administração de Banco de Dados',

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
        'experience.1.4': 'Generation of interactive dashboards and reports for senior management using Power BI.',

        'experience.2.title': 'Data Analyst',
        'experience.2.1': 'Definition of scope and data modeling (ERD) for a project in the Ceará fashion market.',
        'experience.2.2': 'Collection, cleaning, and preparation of datasets using Python and analysis libraries.',
        'experience.2.3': 'Performance of Exploratory Data Analysis (EDA) and calculation of descriptive statistics.',
        'experience.2.4': 'Implementation of machine learning model (Random Forest) with metric evaluation.',
        'experience.2.5': 'Generation of interactive dashboards and reports for senior management using Streamlit.',

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
        'cert.1.title': 'Computer Assembly and Maintenance',
        'cert.2.title': 'Graphic Design & Web Design',
        'cert.3.title': 'Social Sciences',
        'cert.4.title': 'FullStack Developer',
        'cert.5.title': 'DevOps',
        'cert.6.title': 'Data Science',
        'cert.7.title': 'Systems Analysis and Development',
        'cert.8.title': 'Software Engineering',
        'cert.9.title': 'Database Administration',
        
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
    },

    es: {
        // Navegación
        'nav.home': 'Inicio',
        'nav.experience': 'Experiencia',
        'nav.skills': 'Habilidades',
        'nav.certifications': 'Certificaciones',
        'nav.languages': 'Idiomas',

        // Hero Section
        'hero.name': 'Lucas Cavalcante dos Santos',
        'hero.title': 'Analista de Datos | IA & Machine Learning | Visión Computacional',
        'hero.description': 'Analista de Datos con experiencia en proyectos de IA, automatización y marketing digital. Especializado en el desarrollo de chatbots, dashboards interactivos, pipelines de datos de series temporales y geoespaciales, e implementación de estrategias SEO/SEM.',

        // Contacto
        'contact.location': 'Fortaleza - CE, Brasil',

        // Botones
        'button.cv': 'Currículum',
        'button.view': 'Ver Certificado',

        // Secciones
        'sections.experience': 'Experiencia Profesional',
        'sections.skills': 'Habilidades Técnicas',
        'sections.certifications': 'Certificaciones',
        'sections.languages': 'Idiomas',

        // Experiencia
        'experience.1.title': 'Analista de Datos',
        'experience.1.1': 'Definición del alcance y modelado de datos (DER) para un proyecto en el mercado de moda de Ceará.',
        'experience.1.2': 'Recopilación, limpieza y preparación de datasets utilizando Python y bibliotecas de análisis.',
        'experience.1.3': 'Realización de Análisis Exploratorio de Datos (EDA) y cálculo de estadísticas descriptivas.',
        'experience.1.4': 'Generación de dashboards interactivos e informes para la alta gerencia utilizando Power BI.',

        'experience.2.title': 'Analista de Datos',
        'experience.2.1': 'Definición del alcance y modelado de datos (DER) para un proyecto en el mercado de moda de Ceará.',
        'experience.2.2': 'Recopilación, limpeza y preparación de datasets utilizando Python y bibliotecas de análisis.',
        'experience.2.3': 'Realización de Análisis Exploratorio de Datos (EDA) y cálculo de estadísticas descriptivas.',
        'experience.2.4': 'Implementación de modelo de machine learning (Random Forest) con evaluación de métricas.',
        'experience.2.5': 'Generación de dashboards interactivos e informes para la alta gerencia utilizando Streamlit.',

        'experience.3.title': 'Analista de Marketing y Comercial',
        'experience.3.1': 'Planificación y gestión de campañas digitales (Google Ads, Meta Ads) con monitoreo de KPIs.',
        'experience.3.2': 'Implementación de estrategias de SEO y SEM, resultando en aumento del tráfico orgánico.',
        'experience.3.3': 'Creación y edición de contenido audiovisual para redes sociales y embudos de ventas.',
        'experience.3.4': 'Gestión de CRM mediante ERP interno.',
        'experience.3.5': 'Apoyo al equipo comercial en la prospección y retención de clientes.',

        'experience.4.title': 'Analista de Marketing | Asistente de Marketing',
        'experience.4.1': 'Desarrollo y monitoreo de campañas promocionales.',
        'experience.4.2': 'Implementación de estrategias SEO/SEM y gestión de contenido para sitio web y redes sociales.',
        'experience.4.3': 'Creación de contenido gráfico y mantenimiento de los canales de comunicación digitales.',

        'experience.5.title': 'Técnico en Informática y Redes',
        'experience.5.company': 'Autónomo',
        'experience.5.1': 'Ensamblaje, mantenimiento y configuración de infraestructura de TI (computadoras, servidores, redes TCP/IP, Wi-Fi).',
        'experience.5.2': 'Soporte técnico remoto y presencial, instalación de software y permisos de acceso.',
        'experience.5.3': 'Consultoría técnica y elaboración de propuestas para licitaciones de equipos.',

        // Habilidades
        'skills.languages': 'Lenguajes & Bibliotecas',
        'skills.ml': 'Machine Learning',
        'skills.dl': 'Deep Learning & Visión Computacional',
        'skills.platforms': 'Plataformas & Herramientas',
        'skills.marketing': 'Marketing Digital',
        'skills.tech': 'Técnico en TI',
        'skills.agile': 'Gestión Ágil',
        'skills.office': 'Microsoft Office',
        'skills.soft': 'Habilidades Interpersonales',
        'skills.communication': 'Comunicación',
        'skills.teamwork': 'Trabajo en Equipo',
        'skills.problem-solving': 'Resolución de Problemas',
        'skills.adaptability': 'Adaptabilidad',
        'skills.time-management': 'Gestión del Tiempo',
        'skills.critical-thinking': 'Pensamiento Crítico',
        'skills.creativity': 'Creatividad',

        // Certificaciones
        'certifications.subtitle': 'Haga clic en los enlaces para ver los certificados',
        'cert.1.title': 'Ensamblaje y Mantenimiento de Computadoras',
        'cert.2.title': 'Diseño Gráfico & Web Design',
        'cert.3.title': 'Ciencias Sociales',
        'cert.4.title': 'Desarrollador FullStack',
        'cert.5.title': 'DevOps',
        'cert.6.title': 'Ciencia de Datos',
        'cert.7.title': 'Análisis y Desarrollo de Sistemas',
        'cert.8.title': 'Ingeniería de Software',
        'cert.9.title': 'Administración de Base de Datos',

        // Idiomas
        'lang.portuguese': 'Portugués',
        'lang.english': 'Inglés',
        'lang.spanish': 'Español',
        'lang.japanese': 'Japonés',
        'lang.level.native': 'Nativo',
        'lang.level.advanced': 'Avanzado',
        'lang.level.basic': 'Básico',

        // Footer
        'footer.contact': 'Contáctame',
        'footer.message': 'Siempre estoy abierto a nuevas oportunidades y colaboraciones.',
        'footer.rights': 'Todos los derechos reservados.'
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
    } else if (lang === 'es') {
        document.title = 'Lucas Cavalcante | Analista de Datos & IA';
    } else {
        document.title = 'Lucas Cavalcante | Analista de Dados & IA';
    }
}

// ===== MENU MOBILE =====
function setupMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');

    if (!mobileMenuBtn || !navLinks) return;

    mobileMenuBtn.addEventListener('click', function () {
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
    document.addEventListener('click', function (event) {
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
        anchor.addEventListener('click', function (e) {
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

    const observer = new IntersectionObserver(function (entries) {
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

// ===== CACHE =====
window.addEventListener('beforeunload', function () {
    const currentTheme = document.body.classList.contains('dark-mode') ? 'dark-mode' : 'light-mode';
    const currentLang = document.body.getAttribute('data-lang') || 'pt' || 'en' || 'es';

    localStorage.setItem('theme', currentTheme);
    localStorage.setItem('language', currentLang);
});