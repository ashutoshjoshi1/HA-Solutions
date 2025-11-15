import re
from django import template
from django.utils.safestring import mark_safe
from django.utils.html import escape

register = template.Library()

@register.filter
def format_job_description_html(html_content):
    """
    Format HTML content from Quill editor to ensure proper paragraph structure.
    Converts line breaks within paragraphs to <br> tags and ensures proper spacing.
    """
    if not html_content:
        return ''
    
    # If it's already HTML, process it to ensure proper paragraph breaks
    if html_content.strip().startswith('<'):
        # Split content by double line breaks or </p><p> patterns
        # First, normalize line breaks
        html_content = html_content.replace('\r\n', '\n').replace('\r', '\n')
        
        # If we have a single <p> tag with line breaks inside, split it
        if html_content.count('<p>') == 1 and html_content.count('</p>') == 1:
            # Extract content between <p> and </p>
            match = re.search(r'<p[^>]*>(.*?)</p>', html_content, re.DOTALL)
            if match:
                content = match.group(1)
                # Split by double line breaks
                paragraphs = re.split(r'\n\s*\n', content)
                # Rebuild with proper <p> tags
                html_content = ''.join(['<p>' + p.strip().replace('\n', '<br>') + '</p>' for p in paragraphs if p.strip()])
        
        # Ensure multiple <p> tags are properly separated
        html_content = re.sub(r'</p>\s*<p>', '</p><p>', html_content)
        
        return mark_safe(html_content)
    
    return mark_safe(html_content)

@register.filter
def format_job_description(text):
    """
    Convert markdown-style formatting to HTML and preserve line breaks.
    Supports:
    - **bold** or __bold__ -> <strong>bold</strong>
    - *italic* or _italic_ -> <em>italic</em>
    - Line breaks preserved
    - HTML tags are preserved (if user enters them directly)
    """
    if not text:
        return ''
    
    # First, preserve existing HTML tags by temporarily replacing them
    html_placeholders = {}
    html_pattern = r'<[^>]+>'
    html_tags = re.findall(html_pattern, text)
    for i, tag in enumerate(html_tags):
        placeholder = f'__HTML_TAG_{i}__'
        html_placeholders[placeholder] = tag
        text = text.replace(tag, placeholder, 1)
    
    # Convert markdown bold **text** or __text__ to <strong>
    text = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', text)
    text = re.sub(r'__(.+?)__', r'<strong>\1</strong>', text)
    
    # Convert markdown italic *text* or _text_ to <em>
    # Match single asterisks/underscores that aren't part of double ones
    text = re.sub(r'(?<!\*)\*([^*]+?)\*(?!\*)', r'<em>\1</em>', text)
    text = re.sub(r'(?<!_)_([^_]+?)_(?!_)', r'<em>\1</em>', text)
    
    # Restore HTML tags
    for placeholder, tag in html_placeholders.items():
        text = text.replace(placeholder, tag)
    
    # Convert line breaks to HTML
    # Split by double line breaks to create paragraphs
    paragraphs = text.split('\n\n')
    formatted_paragraphs = []
    
    for para in paragraphs:
        para = para.strip()
        if para:
            # Replace single line breaks with <br>
            para = para.replace('\n', '<br>')
            formatted_paragraphs.append(f'<p>{para}</p>')
    
    # If no double line breaks, just convert single line breaks to <br>
    if not formatted_paragraphs:
        result = text.replace('\n', '<br>')
    else:
        result = '\n'.join(formatted_paragraphs)
    
    return mark_safe(result)

