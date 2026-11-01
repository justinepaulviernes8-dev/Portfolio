"""Build the review PDF from the actual local source and captured screenshots.

Requires: reportlab, Pillow. Run from any directory with Python 3.10+.
The PDF remains a draft until the author adds personal reflection and a video link.
"""
from pathlib import Path
from html import escape
from textwrap import TextWrapper
import re

from PIL import Image as PILImage
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, PageBreak, Image,
    Preformatted, Table, TableStyle, CondPageBreak, KeepTogether,
)

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'output/pdf/Midterm-Documentation-Draft.pdf'
OUT.parent.mkdir(parents=True, exist_ok=True)
FONT_DIR = Path('C:/Windows/Fonts')
if (FONT_DIR / 'arial.ttf').exists():
    for name, file in [('Body', 'arial.ttf'), ('Body-Bold', 'arialbd.ttf'), ('Mono', 'consola.ttf')]:
        pdfmetrics.registerFont(TTFont(name, str(FONT_DIR / file)))
    pdfmetrics.registerFontFamily('Body', normal='Body', bold='Body-Bold')
else:
    FONT_DIR = Path('/usr/share/fonts/truetype/dejavu')
    for name, file in [('Body', 'DejaVuSans.ttf'), ('Body-Bold', 'DejaVuSans-Bold.ttf'), ('Mono', 'DejaVuSansMono.ttf')]:
        pdfmetrics.registerFont(TTFont(name, str(FONT_DIR / file)))
    pdfmetrics.registerFontFamily('Body', normal='Body', bold='Body-Bold')

BLUE = colors.HexColor('#1d4ed8')
INK = colors.HexColor('#0f172a')
MUTED = colors.HexColor('#475569')
styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name='BodyCopy', fontName='Body', fontSize=10, leading=15, spaceAfter=9, textColor=INK))
styles.add(ParagraphStyle(name='Section', fontName='Body-Bold', fontSize=20, leading=25, spaceAfter=18, textColor=BLUE, keepWithNext=True))
styles.add(ParagraphStyle(name='Subhead', fontName='Body-Bold', fontSize=12, leading=17, spaceBefore=12, spaceAfter=8, textColor=INK, keepWithNext=True))
styles.add(ParagraphStyle(name='Caption', fontName='Body', fontSize=9, leading=13, spaceBefore=8, spaceAfter=14, textColor=MUTED))
styles.add(ParagraphStyle(name='Cell', fontName='Body', fontSize=8, leading=11, textColor=INK))
styles.add(ParagraphStyle(name='CodeBlock', fontName='Mono', fontSize=7, leading=9, spaceBefore=6, spaceAfter=14, textColor=INK))
styles.add(ParagraphStyle(name='CoverTitle', fontName='Body-Bold', fontSize=30, leading=37, alignment=TA_CENTER, textColor=INK, spaceAfter=20))
styles.add(ParagraphStyle(name='CoverSub', fontName='Body', fontSize=13, leading=21, alignment=TA_CENTER, textColor=MUTED, spaceAfter=16))

def plain(text):
    return text.replace('\u2011', '-').replace('\u2013', '-').replace('\u2014', '-').replace('\u00a0', ' ')

def inline(text):
    text = escape(plain(text))
    text = re.sub(r'`([^`]+)`', r'<font name="Mono">\1</font>', text)
    text = re.sub(r'\*\*([^*]+)\*\*', r'<b>\1</b>', text)
    return text

def para(text, style='BodyCopy'):
    return Paragraph(inline(text), styles[style])

story = []
WIDTH = A4[0] - 88

def section(number, title):
    if story: story.append(PageBreak())
    story.append(para(f'{number}. {title}', 'Section'))

def table(rows, widths=None):
    cells = [[Paragraph(inline(cell), styles['Cell']) for cell in row] for row in rows]
    if widths is None: widths = [WIDTH / len(rows[0])] * len(rows[0])
    t = Table(cells, colWidths=widths, repeatRows=1, hAlign='LEFT')
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#dbeafe')),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('GRID', (0,0), (-1,-1), 0.4, colors.HexColor('#cbd5e1')),
        ('LEFTPADDING', (0,0), (-1,-1), 7), ('RIGHTPADDING', (0,0), (-1,-1), 7),
        ('TOPPADDING', (0,0), (-1,-1), 7), ('BOTTOMPADDING', (0,0), (-1,-1), 7),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor('#f8fafc')]),
    ]))
    story.extend([t, Spacer(1,12)])

def markdown(text):
    lines = text.strip().splitlines()
    i = 0
    while i < len(lines):
        line = lines[i].strip()
        if not line: i += 1; continue
        if line.startswith('|'):
            rows = []
            while i < len(lines) and lines[i].strip().startswith('|'):
                row = [cell.strip() for cell in lines[i].strip().strip('|').split('|')]
                if not all(re.fullmatch(r':?-+:?', cell) for cell in row): rows.append(row)
                i += 1
            if rows:
                widths = [WIDTH*0.21, WIDTH*0.23, WIDTH*0.56] if len(rows[0])==3 else None
                if len(rows[0])==6: widths = [27,73,93,90,154,WIDTH-437]
                table(rows, widths)
            continue
        if line.startswith('#'):
            story.append(para(line.lstrip('#').strip(), 'Subhead'))
            i += 1; continue
        paragraph = [line]
        i += 1
        while i < len(lines) and lines[i].strip() and not lines[i].startswith(('#','|','- ')) and not re.match(r'^\d+\. ', lines[i]):
            paragraph.append(lines[i].strip()); i += 1
        text = ' '.join(paragraph)
        if text.startswith('- '): text = '• ' + text[2:]
        story.append(para(text))

def screenshot(file, caption, max_height=520):
    path = ROOT / 'docs/screenshots' / file
    if not path.is_file(): raise FileNotFoundError(f'Required screenshot missing: {path}')
    with PILImage.open(path) as im: w, h = im.size
    scale = min(WIDTH/w, max_height/h)
    story.extend([Image(str(path), width=w*scale, height=h*scale), para(caption, 'Caption')])

def subsection(text, heading):
    token = '## ' + heading + '\n'
    content = text.split(token,1)[1]
    return content.split('\n## ',1)[0]

implementation = (ROOT/'docs/IMPLEMENTATION.md').read_text(encoding='utf-8')
tests = (ROOT/'docs/VALIDATION-TESTS.md').read_text(encoding='utf-8')

# 1. Title page.
story.append(Spacer(1,72))
story.append(para('MIDTERM LABORATORY ACTIVITY', 'CoverSub'))
story.append(para('Portfolio CRUD<br/>with Validation'.replace('<br/>',' '), 'CoverTitle'))
story.append(para('Converting a portfolio to Laravel + Inertia.js + React', 'CoverSub'))
story.append(Spacer(1,34))
for line in ['Justine Paul Viernes', 'IT ELEC01 - Advanced Web Development', 'Block 4', 'November 1, 2026', 'Instructor: Giobet T. Aban']:
    story.append(para(line, 'CoverSub'))
story.append(Spacer(1,30))
story.append(para('LOCAL REVIEW DRAFT', 'CoverSub'))
story.append(para('Implementation, screenshots and source code are included. Personal reflection, final explanation review and the narrated video link remain for the author to complete before submission.', 'CoverSub'))

# 2. Section and fields.
section(2, 'Section chosen and justification')
markdown(subsection(implementation, 'Section chosen and justification'))
story.append(para('Database fields and validation rules', 'Subhead'))
markdown(subsection(implementation, 'Fields'))

# 3. Required page screenshots and feedback.
section(3, 'Screenshots of all pages')
story.append(para('Captured from the running local application. A temporary project used for browser verification was deleted after the test; the original five projects remain.'))
figures = [
    ('01-public-projects.jpg','Figure 1. Public portfolio showing the database-backed Projects section with the original 3D carousel styling.'),
    ('03-project-index.jpg','Figure 2. Index page listing the managed project records in display order.'),
    ('04-project-create.jpg','Figure 3. Create page with the shared project form.'),
    ('07-project-edit.jpg','Figure 4. Edit page with existing values loaded into the shared form.'),
    ('09-delete-confirmation.jpg','Figure 5. Delete confirmation dialog with Cancel focused by default.'),
    ('06-create-success.jpg','Figure 6. Create success message and the temporary browser test record.'),
    ('08-update-success.jpg','Figure 7. Update success message after retaining the current unique title and screenshot.'),
    ('10-delete-success.jpg','Figure 8. Delete success message; the temporary test record is removed.'),
    ('05-validation-errors.jpg','Figure 9. Laravel errors shown beside the fields while the typed description is retained.'),
    ('02-project-popup.jpg','Figure 10. Existing project popup with database-provided details and tools.'),
    ('11-mobile-projects.jpg','Figure 11. Inline Add project dialog at the 375 px mobile breakpoint.'),
    ('13-inline-create.jpg','Figure 12. Add project dialog opened directly within the portfolio.'),
    ('14-inline-validation.jpg','Figure 13. Inline dialog validation retains the entered description.'),
    ('15-inline-edit.jpg','Figure 14. Edit dialog with the project record saved in XAMPP MariaDB.'),
    ('16-inline-delete.jpg','Figure 15. Delete confirmation inside the portfolio.'),
]
for i, (file, caption) in enumerate(figures):
    if i: story.append(PageBreak())
    screenshot(file,caption)

# 4. Verified file structure.
section(4, 'Folder structure')
story.append(para('The following browser screenshot shows a source listing generated from files verified in the local checkout. It identifies the backend, migrations, seeders, React pages, components and styles used by this implementation.'))
screenshot('12-folder-structure.jpg','Figure 16. Verified local source structure. Original static files remain available as a design reference.')

# 5. Full source, loaded directly from final files.
section(5, 'Complete source code and explanations')
story.append(para('The listings below are read directly from the working project when this PDF is built. Long lines wrap for print; no implementation lines are intentionally omitted. Review and personalize the explanations before submitting them as your own words.'))
descriptions = {
    'ProjectController.php': 'This resource controller handles listing, creating, editing, updating and deleting projects. One validation method supplies rules and custom messages for both writes, and uploaded images are cleaned up when replaced or deleted.',
    'PortfolioController.php': 'The public controller queries the projects in display order and passes them to Inertia. The portfolio carousel receives the same records managed by the CRUD pages.',
    'Project.php': 'The Eloquent model defines the fields that can be mass assigned and casts display order to an integer. Its image URL accessor supports the original bundled screenshots and newly uploaded images.',
    '2026_11_01_000001_create_projects_table.php': 'This migration creates the projects table with nine meaningful fields, an ID and timestamps. A database unique index protects project titles and an order index supports the public display order.',
    'web.php': 'The root route invokes the portfolio controller, while a resource route defines the six management actions. A separate Show route is excluded because project details are read in the public popup.',
    'HandleInertiaRequests.php': 'This middleware selects the root Blade template and shares the success flash message. The parent middleware also supplies Laravel validation errors to Inertia pages.',
    'ProjectForm.jsx': 'The standalone pages and inline portfolio dialog render this shared form, which submits through Inertia useForm and displays each Laravel error beside its field. Updates use multipart POST with a PUT method override, while inline submissions request a return to the portfolio.',
    'FormField.jsx': 'This reusable component keeps labels, hints, required markers and error messages consistent. Each error is associated with its input through matching IDs and accessibility attributes.',
    'Create.jsx': 'This page places an empty shared form inside the management layout. The form handles creation because it receives no existing project.',
    'Edit.jsx': 'This page passes the existing project into the shared form. The form initializes its state from that record and sends updates to the resource URL.',
    'Index.jsx': 'The index displays database records with their current screenshots, text and order. Edit links and the delete dialog provide management actions, while success feedback comes from shared Inertia data.',
    'Portfolio.jsx': 'The public page composes the original portfolio sections as React components. It passes database records to the carousel and initializes the retained interactions with lifecycle cleanup.',
    'ProjectsCarousel.jsx': 'This React component keeps the original center-card geometry, side-card transforms, dots and navigation controls. It also provides Add, Edit and Delete actions directly within the Projects section, using the same resource controller as the separate pages.',
    'ProjectEditorDialog.jsx': 'This native dialog opens the shared form over the existing portfolio for adding or editing a project. It locks background scrolling, handles Escape and closing, and prevents closing while the form is saving.',
    'setup-mysql.php': 'This setup script creates the configured XAMPP database, runs migrations and imports existing SQLite projects when the destination table is empty. It preserves the old SQLite file and never overwrites existing MySQL project records.',
    'phpunit.mysql.xml': 'This PHPUnit configuration forces the feature tests to use the separate viernes_portfolio_test database. That keeps the working portfolio records separate from the database reset and transactions performed by integration tests.',
    'ProjectModal.jsx': 'The project popup uses the original dialog layout and opening/closing animation classes. Native dialog behavior provides focus management and Escape support while React supplies the selected record.',
    'DeleteConfirmation.jsx': 'This native dialog asks for confirmation before the delete request is sent. Cancel is focused initially, and controls are disabled while deletion is processing.',
    'ManagementLayout.jsx': 'The management pages share a header, title and flash-message area. The public portfolio link lets the author check the effect of saved changes.',
    'usePortfolioEffects.js': 'The original theme, menu, navigation, contact validation, reveal and scroll interactions are retained in a React hook. Registered listeners and observers are disposed when Inertia leaves the public page.',
    'ProjectSeeder.php': 'This seeder imports the five original projects from the checked-in JSON data. It creates missing titles without overwriting existing records edited through the form.',
    'DatabaseSeeder.php': 'The main seeder delegates to ProjectSeeder. It avoids creating an unrelated demo user for this local CRUD assignment.',
    'app.css': 'The original Tailwind theme and animation rules are compiled by Vite. Additional contact-width rules prevent long links from causing horizontal scrolling on narrow screens.',
    'app.jsx': 'This frontend entry creates the Inertia React application and resolves page components by name. Pages are loaded as separate bundles while the shared application initializes once.',
    'app.blade.php': 'The Blade root loads the original font, favicon and compiled Vite assets. Inertia mounts the initial page and updates the document head during navigation.',
    'SectionTitle.jsx': 'This shared heading component reproduces the label and title styling repeated across public sections. Centralizing it avoids repeating the same heading markup.',
    'ProjectCrudTest.php': 'These feature tests send actual Laravel requests with isolated database and upload storage. They verify validation failures, successful CRUD, public data, ordering, image cleanup and rejection of unvalidated paths.',
    'serve.ps1': 'The local launcher runs PHP from the public directory and binds only to localhost. Per-process upload settings allow Laravel to enforce its 4 MB image limit without editing the system PHP configuration.',
}
static_names = {'About.jsx','BackToTop.jsx','Contact.jsx','Education.jsx','Footer.jsx','Home.jsx','Navbar.jsx','Skills.jsx'}
source_files = (ROOT/'docs/SOURCE-FILES.txt').read_text(encoding='utf-8').splitlines()
source_files = [p for p in source_files if not p.endswith('projects.json')]
wrapper = TextWrapper(width=112, expand_tabs=False, replace_whitespace=False, drop_whitespace=False, break_long_words=True, break_on_hyphens=False, subsequent_indent='    ')
for relative in source_files:
    path = ROOT / relative
    story.append(CondPageBreak(160))
    story.append(para(relative, 'Subhead'))
    explanation = descriptions.get(path.name)
    if not explanation and path.name in static_names:
        explanation = f'This component preserves the original {path.stem} section markup, content and Tailwind classes as JSX. The public Portfolio page composes it with the other sections while shared effects handle its existing interactions.'
    if not explanation:
        explanation = 'This file connects the Laravel application and Inertia middleware used by the portfolio. It keeps the standard framework bootstrapping structure while registering the application-specific behavior.'
    story.append(para(explanation))
    code = path.read_text(encoding='utf-8').expandtabs(4)
    wrapped = '\n'.join('\n'.join(wrapper.wrap(line)) if line else '' for line in code.splitlines())
    story.append(Preformatted(wrapped, styles['CodeBlock']))

# 6-9. Decisions, tests, author reflection and final links.
section(6, 'Design decisions')
markdown(subsection(implementation, 'Design decisions'))
story.append(para('Request flow', 'Subhead'))
markdown(subsection(implementation, 'Request flow'))

section(7, 'Validation test table')
markdown(tests.split('\n',1)[1])

section(8, 'Reflection - author completion required')
story.append(para('The assignment requires three personal reflection paragraphs. These must describe the author\'s own experience and learning, so this review draft supplies prompts rather than invented personal claims. Replace each prompt with one paragraph after reviewing and testing the application.'))
markdown(subsection(implementation, 'Reflection prompts to personalize before submission'))

section(9, 'Links and source code')
markdown(subsection(implementation, 'Submission links'))
story.append(para('Local review and final-submission checklist', 'Subhead'))
for item in [
    'Review the portfolio and CRUD screens locally before any GitHub push.',
    'Personalize the source-code explanations and the three reflection paragraphs.',
    'Complete any original portfolio content placeholders you want included.',
    'Record all six required video segments in your own voice, including the uncut new-field change.',
    'Add the actual viewable video link, update the source listings after that change, and regenerate this PDF.',
    'Push only when you decide the local version is ready, then verify repository access and README setup steps.',
]: story.append(para('• '+item))
story.append(para('Technical references', 'Subhead'))
markdown(subsection(implementation, 'Reference documentation'))

def footer(canvas, doc):
    canvas.saveState()
    width, height = A4
    canvas.setStrokeColor(colors.HexColor('#cbd5e1'))
    canvas.line(44, 34, width-44, 34)
    canvas.setFont('Body', 8)
    canvas.setFillColor(MUTED)
    canvas.drawString(44, 22, 'Justine Paul Viernes | Block 4 | Local review draft')
    canvas.drawRightString(width-44, 22, str(doc.page))
    canvas.restoreState()

document = SimpleDocTemplate(str(OUT), pagesize=A4, rightMargin=44, leftMargin=44, topMargin=42, bottomMargin=48, title='Portfolio CRUD with Validation - Local Review Draft', author='Justine Paul Viernes')
document.build(story, onFirstPage=footer, onLaterPages=footer)
print(OUT)
