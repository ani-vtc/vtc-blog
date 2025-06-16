// Configuration
const config = {
    contentDir: 'content', // Directory containing your content files
    defaultSection: 'Getting Started', // Default section to show
    defaultSubsection: 'Introduction' // Default subsection to show
};

// State
let currentSection = '';
let currentSubsection = '';
let sections = [];

// DOM Elements
const sidebar = document.getElementById('sidebar');
const navContent = document.getElementById('navContent');
const mainContent = document.getElementById('mainContent');

// Toggle sidebar on mobile
function toggleSidebar() {
    sidebar.classList.toggle('active');
}

// Close sidebar when clicking outside on mobile
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768 && 
        !sidebar.contains(e.target) && 
        !e.target.classList.contains('menu-toggle')) {
        sidebar.classList.remove('active');
    }
});

// Load and parse content
async function loadContent(path) {
    try {
        const response = await fetch(path);
        if (!response.ok) throw new Error('Failed to load content');
        const text = await response.text();
        return text;
    } catch (error) {
        console.error('Error loading content:', error);
        return '# Error\nFailed to load content.';
    }
}

// Convert markdown to HTML
function markdownToHtml(markdown) {
    return markdown
        .replace(/^# (.*$)/gm, '<h1>$1</h1>')
        .replace(/^## (.*$)/gm, '<h2 id="$1">$1</h2>')
        .replace(/^### (.*$)/gm, '<h3 id="$1">$1</h3>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`(.*?)`/g, '<code>$1</code>')
        .replace(/\n/g, '<br>');
}

// Extract headings from HTML content
function extractHeadingsFromHtml(html) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    const headings = tempDiv.querySelectorAll('h1, h2, h3');
    return Array.from(headings).map(heading => ({
        level: parseInt(heading.tagName[1]),
        title: heading.textContent,
        id: heading.id || heading.textContent.toLowerCase().replace(/\s+/g, '-')
    }));
}

// Extract headings from markdown content
function extractHeadingsFromMarkdown(markdown) {
    const headings = markdown.match(/^#{1,3} (.*$)/gm) || [];
    return headings.map(heading => {
        const level = heading.match(/^#+/)[0].length;
        const title = heading.replace(/^#+ /, '');
        const id = title.toLowerCase().replace(/\s+/g, '-');
        return { level, title, id };
    });
}

// Update navigation
async function updateNavigation() {
    try {
        const response = await fetch(`${config.contentDir}/sections.json`);
        if (!response.ok) throw new Error('Failed to load sections');
        const data = await response.json();
        sections = data.sections;

        const navHtml = sections.map(section => `
            <div class="section-group">
                <h3 class="section-title">${section.title}</h3>
                <ul>
                    ${section.subsections.map(subsection => `
                        <li class="subsection-item ${subsection.title === currentSubsection ? 'active' : ''}">
                            <a href="#${section.title}/${subsection.title}" 
                               onclick="event.preventDefault(); navigateTo('${section.title}', '${subsection.title}')">
                                ${subsection.title}
                            </a>
                        </li>
                    `).join('')}
                </ul>
            </div>
        `).join('');

        navContent.innerHTML = navHtml;
    } catch (error) {
        console.error('Error updating navigation:', error);
        navContent.innerHTML = '<p>Error loading navigation</p>';
    }
}

// Create navigation controls between subsections
function createSubsectionNavigation(section, currentSubsectionIndex) {
    const subsections = section.subsections;
    const prevSubsection = subsections[currentSubsectionIndex - 1];
    const nextSubsection = subsections[currentSubsectionIndex + 1];

    return `
        <div class="subsection-navigation">
            ${prevSubsection ? `
                <a href="#${section.title}/${prevSubsection.title}" 
                   class="prev-subsection"
                   onclick="event.preventDefault(); navigateTo('${section.title}', '${prevSubsection.title}')">
                    ← ${prevSubsection.title}
                </a>
            ` : ''}
            ${nextSubsection ? `
                <a href="#${section.title}/${nextSubsection.title}" 
                   class="next-subsection"
                   onclick="event.preventDefault(); navigateTo('${section.title}', '${nextSubsection.title}')">
                    ${nextSubsection.title} →
                </a>
            ` : ''}
        </div>
    `;
}

// Handle navigation
async function navigateTo(sectionTitle, subsectionTitle) {
    currentSection = sectionTitle;
    currentSubsection = subsectionTitle;

    // Find the section and subsection in our sections data
    const section = sections.find(s => s.title === sectionTitle);
    if (!section) return;

    const currentSubsectionIndex = section.subsections.findIndex(s => s.title === subsectionTitle);
    if (currentSubsectionIndex === -1) return;

    // Load all subsections of the current section
    const subsectionContents = await Promise.all(
        section.subsections.map(async (subsection) => {
            const content = await loadContent(`${config.contentDir}/${subsection.file}`);
            const isHtml = subsection.file.endsWith('.html');
            return {
                title: subsection.title,
                content: isHtml ? content : markdownToHtml(content),
                isCurrent: subsection.title === subsectionTitle
            };
        })
    );

    // Combine all subsections into one content
    const combinedContent = subsectionContents.map(subsection => `
        <div class="subsection-content ${subsection.isCurrent ? 'active' : ''}" 
             id="${section.title}/${subsection.title}">
            ${subsection.content}
        </div>
    `).join('');

    // Add navigation controls
    const navigationControls = createSubsectionNavigation(section, currentSubsectionIndex);

    // Update the main content
    mainContent.innerHTML = `
        ${navigationControls}
        <div class="section-content">
            ${combinedContent}
        </div>
        ${navigationControls}
    `;

    // Update URL
    history.pushState(null, '', `#${sectionTitle}/${subsectionTitle}`);

    // Update navigation
    updateNavigation();

    // Scroll to the current subsection
    const currentSubsectionElement = document.getElementById(`${sectionTitle}/${subsectionTitle}`);
    if (currentSubsectionElement) {
        currentSubsectionElement.scrollIntoView({ behavior: 'smooth' });
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    // Load sections first
    await updateNavigation();

    // Get section and subsection from URL or use defaults
    const hash = window.location.hash.slice(1);
    if (hash) {
        const [section, subsection] = hash.split('/');
        if (section && subsection) {
            navigateTo(section, subsection);
        } else {
            navigateTo(config.defaultSection, config.defaultSubsection);
        }
    } else {
        navigateTo(config.defaultSection, config.defaultSubsection);
    }

    // Handle browser back/forward
    window.addEventListener('popstate', () => {
        const hash = window.location.hash.slice(1);
        if (hash) {
            const [section, subsection] = hash.split('/');
            if (section && subsection) {
                navigateTo(section, subsection);
            }
        }
    });
}); 