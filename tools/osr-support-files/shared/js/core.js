window.WizardawnCore = {
  nowISO() {
    return new Date().toISOString();
  },

  downloadText(filename, content, contentType = 'text/plain;charset=utf-8') {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  },

  exportJSON(filename, value) {
    this.downloadText(filename, JSON.stringify(value, null, 2), 'application/json;charset=utf-8');
  },

  exportMarkdown(filename, content) {
    this.downloadText(filename, content, 'text/markdown;charset=utf-8');
  },

  exportHTML(filename, content) {
    this.downloadText(filename, content, 'text/html;charset=utf-8');
  }
};
