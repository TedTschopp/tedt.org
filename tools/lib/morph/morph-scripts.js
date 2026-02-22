/**
 * morph-scripts.js — Browser-compatible text-transformation script registry.
 *
 * Inspired by IvanMathy/Boop (MIT) — https://github.com/IvanMathy/Boop
 *
 * Each script follows a metadata format (api, name, description, icon, tags)
 * and exposes a `main(state)` function that operates on a ScriptExecution-like object.
 *
 * The state object API:
 *   state.text       — get/set the text (selection-aware in native Boop; here it's fullText)
 *   state.fullText   — get/set the full editor content
 *   state.postInfo(msg)  — display an informational message
 *   state.postError(msg) — display an error message
 *   state.insert(str)    — insert text at cursor (here: append)
 *
 * Licence: MIT
 */

/* global MorphScripts */
window.MorphScripts = (() => {
  'use strict';

  const registry = [];

  function register(meta, fn) {
    registry.push({ meta, main: fn });
  }

  /* ═══════════════════════════════════════════════
     Encoding / Decoding
     ═══════════════════════════════════════════════ */

  register(
    { api: 1, name: 'Base64 Encode', description: 'Encodes your text to Base64.', icon: 'metamorphose', tags: 'base64,atob,encode', category: 'Encoding' },
    (state) => {
      try { state.text = btoa(unescape(encodeURIComponent(state.text))); }
      catch (e) { state.postError('Encoding failed: ' + e.message); }
    }
  );

  register(
    { api: 1, name: 'Base64 Decode', description: 'Decodes your text from Base64.', icon: 'metamorphose', tags: 'base64,btoa,decode', category: 'Encoding' },
    (state) => {
      try { state.text = decodeURIComponent(escape(atob(state.text.trim()))); }
      catch (e) { state.postError('Invalid Base64'); }
    }
  );

  register(
    { api: 1, name: 'Base64 URL Encode', description: 'Encodes text as URL-safe Base64.', icon: 'metamorphose', tags: 'base64url,base64,url,encode,jwt', category: 'Encoding' },
    (state) => {
      try {
        const encoded = btoa(unescape(encodeURIComponent(state.text)));
        state.text = encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
      } catch (e) {
        state.postError('Base64 URL encode failed: ' + e.message);
      }
    }
  );

  register(
    { api: 1, name: 'Base64 URL Decode', description: 'Decodes URL-safe Base64 text.', icon: 'metamorphose', tags: 'base64url,base64,url,decode,jwt', category: 'Encoding' },
    (state) => {
      try {
        const normalized = state.text.trim().replace(/-/g, '+').replace(/_/g, '/');
        const padded = normalized + '='.repeat((4 - (normalized.length % 4 || 4)) % 4);
        state.text = decodeURIComponent(escape(atob(padded)));
      } catch (e) {
        state.postError('Invalid Base64 URL text');
      }
    }
  );

  register(
    { api: 1, name: 'URL Encode', description: 'Encodes URL entities in your text.', icon: 'link', tags: 'url,encode,convert,percent', category: 'Encoding' },
    (state) => { state.text = encodeURIComponent(state.text); }
  );

  register(
    { api: 1, name: 'URL Decode', description: 'Decodes URL entities in your text.', icon: 'link', tags: 'url,decode,convert,percent', category: 'Encoding' },
    (state) => {
      try { state.text = decodeURIComponent(state.text); }
      catch (e) { state.postError('Invalid URL encoding'); }
    }
  );

  register(
    { api: 1, name: 'HTML Encode', description: 'Encodes HTML entities in your text.', icon: 'HTML', tags: 'html,encode,web,entities', category: 'Encoding' },
    (state) => {
      const el = document.createElement('textarea');
      el.textContent = state.text;
      state.text = el.innerHTML;
    }
  );

  register(
    { api: 1, name: 'HTML Decode', description: 'Decodes HTML entities in your text.', icon: 'HTML', tags: 'html,decode,web,entities', category: 'Encoding' },
    (state) => {
      const el = document.createElement('textarea');
      el.innerHTML = state.text;
      state.text = el.textContent;
    }
  );

  register(
    { api: 1, name: 'Add Slashes', description: 'Escapes your text.', icon: 'quote', tags: 'add,slashes,escape', category: 'Encoding' },
    (state) => {
      state.text = (state.text + '')
        .replace(/[\\"']/g, '\\$&')
        .replace(/\u0000/g, '\\0');
    }
  );

  register(
    { api: 1, name: 'Remove Slashes', description: 'Unescapes your text.', icon: 'quote', tags: 'strip,slashes,remove,unescape', category: 'Encoding' },
    (state) => {
      state.text = (state.text + '')
        .replace(/\\(.?)/g, (_, n1) => {
          switch (n1) {
            case '\\': return '\\';
            case '0': return '\u0000';
            case '': return '';
            default: return n1;
          }
        });
    }
  );

  register(
    { api: 1, name: 'ROT13', description: 'Applies the ROT13 cypher to your text.', icon: 'roman', tags: 'spoilers,encryption,plaintext,rot13,cipher', category: 'Encoding' },
    (state) => {
      state.text = state.text.replace(/[a-z]/gi, (c) =>
        String.fromCharCode((c <= 'Z' ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26)
      );
    }
  );

  register(
    { api: 1, name: 'Replace Smart Quotes', description: 'Replace Smart Quotes with their simpler values.', icon: 'broom', tags: 'smart,quotes,quotations', category: 'Encoding' },
    (state) => {
      state.text = state.text
        .replace(/[\u2018\u2019]/g, "'")
        .replace(/[\u201C\u201D]/g, '"')
        .replace(/""/g, '"');
    }
  );

  register(
    { api: 1, name: 'Unicode Escape', description: 'Converts text to Unicode escape sequences.', icon: 'metamorphose', tags: 'unicode,escape,encode', category: 'Encoding' },
    (state) => {
      state.text = Array.from(state.text)
        .map(c => c.charCodeAt(0) > 127 ? '\\u' + c.charCodeAt(0).toString(16).padStart(4, '0') : c)
        .join('');
    }
  );

  register(
    { api: 1, name: 'Unicode Unescape', description: 'Converts Unicode escape sequences to text.', icon: 'metamorphose', tags: 'unicode,unescape,decode', category: 'Encoding' },
    (state) => {
      state.text = state.text.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) =>
        String.fromCharCode(parseInt(hex, 16))
      );
    }
  );

  /* ═══════════════════════════════════════════════
     JSON
     ═══════════════════════════════════════════════ */

  register(
    { api: 1, name: 'Format JSON', description: 'Cleans and formats JSON documents.', icon: 'broom', tags: 'json,prettify,clean,indent,format', category: 'JSON' },
    (state) => {
      try { state.text = JSON.stringify(JSON.parse(state.text), null, 2); }
      catch (e) { state.postError('Invalid JSON'); }
    }
  );

  register(
    { api: 1, name: 'Minify JSON', description: 'Cleans and minifies JSON documents.', icon: 'broom', tags: 'json,minify,clean,compact', category: 'JSON' },
    (state) => {
      try { state.text = JSON.stringify(JSON.parse(state.text)); }
      catch (e) { state.postError('Invalid JSON'); }
    }
  );

  register(
    { api: 1, name: 'Sort JSON', description: 'Recursively sorts JSON keys alphabetically.', icon: 'sort-characters', tags: 'json,sort,keys', category: 'JSON' },
    (state) => {
      function sortObj(obj) {
        if (Array.isArray(obj)) {
          return obj.map(sortObj).sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
        }
        if (obj && typeof obj === 'object') {
          const result = {};
          Object.keys(obj).sort().forEach(k => { result[k] = sortObj(obj[k]); });
          return result;
        }
        return obj;
      }
      try { state.text = JSON.stringify(sortObj(JSON.parse(state.text)), null, 2); }
      catch (e) { state.postError('Invalid JSON'); }
    }
  );

  function yamlScalar(value) {
    if (value === null) return 'null';
    if (typeof value === 'number' || typeof value === 'boolean') return String(value);
    if (typeof value !== 'string') return JSON.stringify(value);
    if (value === '') return "''";
    if (/[:#\n\r\t]|^\s|\s$/.test(value)) return JSON.stringify(value);
    return value;
  }

  function keyForYaml(key) {
    return /^[A-Za-z0-9_-]+$/.test(key) ? key : JSON.stringify(String(key));
  }

  function jsonToYaml(value, indent = 0) {
    const pad = ' '.repeat(indent);
    if (Array.isArray(value)) {
      if (value.length === 0) return pad + '[]';
      return value.map((item) => {
        if (item && typeof item === 'object') {
          return pad + '-\n' + jsonToYaml(item, indent + 2);
        }
        return pad + '- ' + yamlScalar(item);
      }).join('\n');
    }
    if (value && typeof value === 'object') {
      const keys = Object.keys(value);
      if (keys.length === 0) return pad + '{}';
      return keys.map((k) => {
        const v = value[k];
        if (v && typeof v === 'object') {
          return pad + keyForYaml(k) + ':\n' + jsonToYaml(v, indent + 2);
        }
        return pad + keyForYaml(k) + ': ' + yamlScalar(v);
      }).join('\n');
    }
    return pad + yamlScalar(value);
  }

  function parseYamlScalar(token) {
    const t = token.trim();
    if (t === 'null' || t === '~') return null;
    if (t === 'true') return true;
    if (t === 'false') return false;
    if (/^-?\d+(\.\d+)?$/.test(t)) return Number(t);
    if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'"))) {
      if (t.startsWith('"')) {
        try { return JSON.parse(t); } catch (_) { return t.slice(1, -1); }
      }
      return t.slice(1, -1);
    }
    return t;
  }

  function yamlToJson(yaml) {
    const lines = yaml.replace(/\t/g, '  ').split(/\r?\n/);
    let idx = 0;

    function leadingSpaces(s) {
      const m = s.match(/^\s*/);
      return m ? m[0].length : 0;
    }

    function nextSignificant(i) {
      while (i < lines.length) {
        const raw = lines[i];
        const trimmed = raw.trim();
        if (trimmed !== '' && !trimmed.startsWith('#')) return i;
        i += 1;
      }
      return i;
    }

    function parseBlock(indent) {
      idx = nextSignificant(idx);
      if (idx >= lines.length) return null;

      const firstLine = lines[idx];
      const firstTrim = firstLine.trim();
      const isArray = firstTrim.startsWith('- ');

      if (isArray) {
        const arr = [];
        while (idx < lines.length) {
          idx = nextSignificant(idx);
          if (idx >= lines.length) break;
          const raw = lines[idx];
          const currentIndent = leadingSpaces(raw);
          const trimmed = raw.trim();
          if (currentIndent < indent || !trimmed.startsWith('- ')) break;
          if (currentIndent > indent) {
            throw new Error('Unexpected indentation in YAML list');
          }

          const rest = trimmed.slice(2).trim();
          if (rest === '') {
            idx += 1;
            arr.push(parseBlock(indent + 2));
            continue;
          }

          const kv = rest.match(/^([^:]+):\s*(.*)$/);
          if (kv) {
            const obj = {};
            const key = kv[1].trim().replace(/^['"]|['"]$/g, '');
            const valuePart = kv[2];
            if (valuePart === '') {
              idx += 1;
              obj[key] = parseBlock(indent + 2);
            } else {
              obj[key] = parseYamlScalar(valuePart);
              idx += 1;
            }
            arr.push(obj);
            continue;
          }

          arr.push(parseYamlScalar(rest));
          idx += 1;
        }
        return arr;
      }

      const obj = {};
      while (idx < lines.length) {
        idx = nextSignificant(idx);
        if (idx >= lines.length) break;
        const raw = lines[idx];
        const currentIndent = leadingSpaces(raw);
        const trimmed = raw.trim();
        if (currentIndent < indent || trimmed.startsWith('- ')) break;
        if (currentIndent > indent) {
          throw new Error('Unexpected indentation in YAML object');
        }

        const kv = trimmed.match(/^([^:]+):\s*(.*)$/);
        if (!kv) throw new Error('Invalid YAML mapping: ' + trimmed);
        const key = kv[1].trim().replace(/^['"]|['"]$/g, '');
        const valuePart = kv[2];

        if (valuePart === '') {
          idx += 1;
          const nextIdx = nextSignificant(idx);
          if (nextIdx < lines.length && leadingSpaces(lines[nextIdx]) > currentIndent) {
            obj[key] = parseBlock(currentIndent + 2);
          } else {
            obj[key] = null;
          }
        } else {
          obj[key] = parseYamlScalar(valuePart);
          idx += 1;
        }
      }
      return obj;
    }

    const result = parseBlock(0);
    return result === null ? {} : result;
  }

  function parseCsv(csvText) {
    const rows = [];
    let row = [];
    let field = '';
    let inQuotes = false;
    const text = csvText.replace(/\r\n?/g, '\n') + '\n';

    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      const next = text[i + 1];

      if (inQuotes) {
        if (ch === '"' && next === '"') {
          field += '"';
          i += 1;
        } else if (ch === '"') {
          inQuotes = false;
        } else {
          field += ch;
        }
      } else {
        if (ch === '"') {
          inQuotes = true;
        } else if (ch === ',') {
          row.push(field);
          field = '';
        } else if (ch === '\n') {
          row.push(field);
          if (row.length > 1 || row[0] !== '') rows.push(row);
          row = [];
          field = '';
        } else {
          field += ch;
        }
      }
    }

    return rows;
  }

  function csvEscape(value) {
    const s = value == null ? '' : String(value);
    if (/[,"\n]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
    return s;
  }

  register(
    { api: 1, name: 'JSON to YAML', description: 'Converts JSON to YAML.', icon: 'metamorphose', tags: 'json,yaml,convert,config', category: 'JSON' },
    (state) => {
      try {
        const parsed = JSON.parse(state.text);
        state.text = jsonToYaml(parsed);
      } catch (e) {
        state.postError('Invalid JSON');
      }
    }
  );

  register(
    { api: 1, name: 'YAML to JSON', description: 'Converts YAML to JSON (supports common YAML mappings/lists).', icon: 'metamorphose', tags: 'yaml,json,convert,config', category: 'JSON' },
    (state) => {
      try {
        const parsed = yamlToJson(state.text);
        state.text = JSON.stringify(parsed, null, 2);
      } catch (e) {
        state.postError('Invalid/unsupported YAML: ' + e.message);
      }
    }
  );

  register(
    { api: 1, name: 'JSON Array to JSONL', description: 'Converts a JSON array to newline-delimited JSON.', icon: 'metamorphose', tags: 'json,jsonl,ndjson,array,convert', category: 'JSON' },
    (state) => {
      try {
        const parsed = JSON.parse(state.text);
        if (!Array.isArray(parsed)) {
          state.postError('Expected a JSON array');
          return;
        }
        state.text = parsed.map(item => JSON.stringify(item)).join('\n');
      } catch (e) {
        state.postError('Invalid JSON');
      }
    }
  );

  register(
    { api: 1, name: 'JSONL to JSON Array', description: 'Converts newline-delimited JSON to a JSON array.', icon: 'metamorphose', tags: 'jsonl,ndjson,json,array,convert', category: 'JSON' },
    (state) => {
      try {
        const lines = state.text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
        const arr = lines.map((line, i) => {
          try { return JSON.parse(line); }
          catch (_) { throw new Error('Line ' + (i + 1) + ' is not valid JSON'); }
        });
        state.text = JSON.stringify(arr, null, 2);
      } catch (e) {
        state.postError(e.message);
      }
    }
  );

  register(
    { api: 1, name: 'CSV to JSON', description: 'Converts CSV rows to JSON objects using header row.', icon: 'metamorphose', tags: 'csv,json,table,convert', category: 'JSON' },
    (state) => {
      try {
        const rows = parseCsv(state.text);
        if (rows.length === 0) {
          state.postError('CSV appears empty');
          return;
        }
        const headers = rows[0].map(h => h.trim());
        const body = rows.slice(1).map((row) => {
          const obj = {};
          headers.forEach((h, idx) => {
            obj[h || ('column_' + (idx + 1))] = row[idx] ?? '';
          });
          return obj;
        });
        state.text = JSON.stringify(body, null, 2);
      } catch (e) {
        state.postError('Unable to parse CSV: ' + e.message);
      }
    }
  );

  register(
    { api: 1, name: 'JSON to CSV', description: 'Converts JSON array of objects to CSV.', icon: 'metamorphose', tags: 'json,csv,table,convert', category: 'JSON' },
    (state) => {
      try {
        const parsed = JSON.parse(state.text);
        const rows = Array.isArray(parsed) ? parsed : [parsed];
        if (!rows.every(r => r && typeof r === 'object' && !Array.isArray(r))) {
          state.postError('Expected an object or array of objects');
          return;
        }
        const headers = [];
        rows.forEach((row) => {
          Object.keys(row).forEach((k) => {
            if (!headers.includes(k)) headers.push(k);
          });
        });
        const csvRows = [headers.map(csvEscape).join(',')];
        rows.forEach((row) => {
          csvRows.push(headers.map((h) => {
            const value = row[h];
            if (value && typeof value === 'object') return csvEscape(JSON.stringify(value));
            return csvEscape(value);
          }).join(','));
        });
        state.text = csvRows.join('\n');
      } catch (e) {
        state.postError('Invalid JSON');
      }
    }
  );

  register(
    { api: 1, name: 'Python Dict to JSON', description: 'Converts a Python-style dict/object literal into JSON.', icon: 'snake', tags: 'python,dict,json,convert,parse', category: 'JSON' },
    (state) => {
      try {
        const normalized = state.text
          .replace(/\bTrue\b/g, 'true')
          .replace(/\bFalse\b/g, 'false')
          .replace(/\bNone\b/g, 'null')
          .replace(/'/g, '"')
          .replace(/,\s*([}\]])/g, '$1');
        state.text = JSON.stringify(JSON.parse(normalized), null, 2);
      } catch (e) {
        state.postError('Invalid Python dict/object literal');
      }
    }
  );

  register(
    { api: 1, name: 'JSON to Query String', description: 'Converts JSON to URL query string.', icon: 'website', tags: 'url,query,params,json,convert', category: 'JSON' },
    (state) => {
      function toQuery(obj, prefix) {
        const parts = [];
        for (const key in obj) {
          if (!obj.hasOwnProperty(key)) continue;
          const k = prefix ? prefix + '[' + key + ']' : key;
          const v = obj[key];
          parts.push(v !== null && typeof v === 'object' ? toQuery(v, k) : encodeURIComponent(k) + '=' + encodeURIComponent(v));
        }
        return parts.join('&');
      }
      try { state.text = toQuery(JSON.parse(state.text)); }
      catch (e) { state.postError('Invalid JSON'); }
    }
  );

  register(
    { api: 1, name: 'Query String to JSON', description: 'Converts URL query string to JSON.', icon: 'website', tags: 'url,query,params,json,convert,decode', category: 'JSON' },
    (state) => {
      try {
        const result = {};
        state.text.replace(/^\?/, '').split('&').forEach(pair => {
          const [key, ...rest] = pair.split('=');
          const value = decodeURIComponent(rest.join('=') || '');
          if (result.hasOwnProperty(key)) {
            result[key] = [].concat(result[key], value);
          } else {
            result[key] = value;
          }
        });
        state.text = JSON.stringify(result, null, 2);
      } catch (e) { state.postError('Unable to parse query string'); }
    }
  );

  register(
    { api: 1, name: 'Eval JavaScript', description: 'Runs your text as JavaScript code.', icon: 'command', tags: 'js,script,run,eval,execute', category: 'JSON' },
    (state) => {
      const script = state.text.replace(/\n\n\/\/ Result:[\s\S]*$/, '');
      let output = '';
      try {
        output = eval(script); // eslint-disable-line no-eval
        if (typeof output !== 'string') output = JSON.stringify(output, null, 2);
      } catch (e) {
        state.postError(e.toString());
      }
      state.text = script + '\n\n// Result:\n\n' + output;
    }
  );

  /* ═══════════════════════════════════════════════
     Format / Markup
     ═══════════════════════════════════════════════ */

  register(
    { api: 1, name: 'Format XML', description: 'Pretty-prints XML/HTML documents.', icon: 'broom', tags: 'xml,html,prettify,format,indent', category: 'Format' },
    (state) => {
      // Simple XML formatter
      let formatted = '';
      let indent = 0;
      const pad = (n) => '  '.repeat(n);
      state.text.replace(/(>)(<)(\/*)/g, '$1\n$2$3').split('\n').forEach(node => {
        if (node.match(/^<\/\w/)) indent--;
        formatted += pad(indent) + node.trimStart() + '\n';
        if (node.match(/^<\w[^>]*[^/]>.*$/) && !node.match(/^<\w[^>]*\/>/)) indent++;
      });
      state.text = formatted.trim();
    }
  );

  register(
    { api: 1, name: 'Strip HTML Tags', description: 'Removes HTML tags and keeps text content.', icon: 'broom', tags: 'html,strip,tags,text,clean', category: 'Format' },
    (state) => {
      const el = document.createElement('div');
      el.innerHTML = state.text;
      state.text = el.textContent || '';
    }
  );

  register(
    { api: 1, name: 'Regex Escape', description: 'Escapes text so it is safe in regular expressions.', icon: 'metamorphose', tags: 'regex,escape,pattern,safe', category: 'Format' },
    (state) => {
      state.text = state.text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
  );

  register(
    { api: 1, name: 'Markdown Quote', description: 'Adds > to the start of every line.', icon: 'term', tags: 'quote,markdown,blockquote', category: 'Format' },
    (state) => {
      state.text = state.text.split('\n').map(line => '> ' + line).join('\n');
    }
  );

  register(
    { api: 1, name: 'Markdown Unquote', description: 'Removes > from the start of every line.', icon: 'term', tags: 'unquote,markdown,blockquote', category: 'Format' },
    (state) => {
      state.text = state.text.split('\n').map(line => line.replace(/^>\s?/, '')).join('\n');
    }
  );

  register(
    { api: 1, name: 'Number Lines', description: 'Prepends line numbers to each line.', icon: 'counter', tags: 'number,lines,prefix', category: 'Format' },
    (state) => {
      const lines = state.text.split('\n');
      const width = String(lines.length).length;
      state.text = lines.map((l, i) => String(i + 1).padStart(width, ' ') + '  ' + l).join('\n');
    }
  );

  register(
    { api: 1, name: 'Remove Line Numbers', description: 'Strips leading line numbers.', icon: 'counter', tags: 'number,lines,strip', category: 'Format' },
    (state) => {
      state.text = state.text.split('\n').map(l => l.replace(/^\s*\d+\s{1,2}/, '')).join('\n');
    }
  );

  /* ═══════════════════════════════════════════════
     Case Conversion
     ═══════════════════════════════════════════════ */

  // Utility: split text into "words" for case conversion
  function splitWords(str) {
    return str
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/[_\-]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .split(' ')
      .filter(Boolean);
  }

  function capitalizeWord(word) {
    if (!word) return word;
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }

  function isAllUpper(word) {
    return /[A-Z]/.test(word) && word === word.toUpperCase();
  }

  function titleCaseToken(core, shouldLowercase) {
    if (!core) return core;
    const wasAllUpper = isAllUpper(core);
    const parts = core.split('-');
    const cased = parts.map((part) => {
      if (!part) return part;
      if (shouldLowercase(part.toLowerCase())) return part.toLowerCase();
      if (wasAllUpper && part.length <= 5) return part;
      return capitalizeWord(part);
    });
    return cased.join('-');
  }

  function applyTitleCaseLine(line, style) {
    const tokens = line.match(/\S+|\s+/g) || [];
    const wordIndices = [];

    for (let i = 0; i < tokens.length; i++) {
      if (/\S/.test(tokens[i])) wordIndices.push(i);
    }

    if (wordIndices.length === 0) return line;

    function classify(word) {
      const lower = word.toLowerCase();
      if (style.alwaysLower && style.alwaysLower.has(lower)) return true;
      if (style.maxPrepositionLength && style.prepositions && style.prepositions.has(lower)) {
        return lower.length <= style.maxPrepositionLength;
      }
      if (style.lowerAllPrepositions && style.prepositions && style.prepositions.has(lower)) {
        return true;
      }
      return false;
    }

    for (let j = 0; j < wordIndices.length; j++) {
      const tokenIndex = wordIndices[j];
      const isFirst = j === 0;
      const isLast = j === wordIndices.length - 1;
      const token = tokens[tokenIndex];

      const match = token.match(/^([^A-Za-z0-9]*)([A-Za-z0-9][A-Za-z0-9'’.-]*)([^A-Za-z0-9]*)$/);
      if (!match) continue;

      const [, prefix, core, suffix] = match;
      const prevToken = j > 0 ? tokens[wordIndices[j - 1]] : '';
      const forceCap = isFirst || isLast || /[:.!?]\s*$/.test(prevToken);
      const lowered = (w) => !forceCap && classify(w);
      const transformed = titleCaseToken(core, lowered);

      tokens[tokenIndex] = prefix + transformed + suffix;
    }

    return tokens.join('');
  }

  const baseAlwaysLower = new Set([
    'a', 'an', 'the',
    'and', 'but', 'for', 'nor', 'or', 'so', 'yet',
    'as', 'at', 'by', 'in', 'of', 'off', 'on', 'per', 'to', 'up', 'via'
  ]);

  const prepositions = new Set([
    'about', 'above', 'across', 'after', 'against', 'along', 'amid', 'among', 'around', 'as', 'at',
    'before', 'behind', 'below', 'beneath', 'beside', 'between', 'beyond', 'by',
    'despite', 'down', 'during',
    'except',
    'for', 'from',
    'in', 'inside', 'into',
    'like',
    'near',
    'of', 'off', 'on', 'onto', 'out', 'outside', 'over',
    'past', 'per',
    'since',
    'through', 'throughout', 'till', 'to', 'toward', 'towards',
    'under', 'underneath', 'until', 'unto', 'up', 'upon',
    'via',
    'with', 'within', 'without'
  ]);

  const titleStyles = {
    chicago: {
      alwaysLower: baseAlwaysLower,
      prepositions,
      lowerAllPrepositions: true
    },
    ap: {
      alwaysLower: baseAlwaysLower,
      prepositions,
      maxPrepositionLength: 3
    },
    mla: {
      alwaysLower: baseAlwaysLower,
      prepositions,
      lowerAllPrepositions: true
    },
    apa: {
      alwaysLower: baseAlwaysLower,
      prepositions,
      maxPrepositionLength: 3
    },
    nyt: {
      alwaysLower: baseAlwaysLower,
      prepositions,
      maxPrepositionLength: 3
    }
  };

  register(
    { api: 1, name: 'UPPERCASE', description: 'Converts your text to uppercase.', icon: 'type', tags: 'upcase,uppercase,capital', category: 'Case' },
    (state) => { state.text = state.text.toUpperCase(); }
  );

  register(
    { api: 1, name: 'lowercase', description: 'Converts your text to lowercase.', icon: 'type', tags: 'downcase,lowercase', category: 'Case' },
    (state) => { state.text = state.text.toLowerCase(); }
  );

  register(
    { api: 1, name: 'Camel Case', description: 'convertsYourTextToCamelCase', icon: 'camel', tags: 'camel,case,function', category: 'Case' },
    (state) => {
      state.text = state.text.split('\n').map(line =>
        splitWords(line).map((w, i) =>
          i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
        ).join('')
      ).join('\n');
    }
  );

  register(
    { api: 1, name: 'Snake Case', description: 'converts_your_text_to_snake_case', icon: 'snake', tags: 'snake,case,function,underscore', category: 'Case' },
    (state) => {
      state.text = state.text.split('\n').map(line =>
        splitWords(line).map(w => w.toLowerCase()).join('_')
      ).join('\n');
    }
  );

  register(
    { api: 1, name: 'Kebab Case', description: 'converts-your-text-to-kebab-case', icon: 'kebab', tags: 'kebab,case,function,dash', category: 'Case' },
    (state) => {
      state.text = state.text.split('\n').map(line =>
        splitWords(line).map(w => w.toLowerCase()).join('-')
      ).join('\n');
    }
  );

  register(
    { api: 1, name: 'Start Case', description: 'Converts Your Text To Start Case.', icon: 'type', tags: 'start,case,title', category: 'Case' },
    (state) => {
      state.text = state.text.split('\n').map(line =>
        splitWords(line).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')
      ).join('\n');
    }
  );

  register(
    { api: 1, name: 'Swap Case', description: 'Inverts uppercase/lowercase for each character.', icon: 'type', tags: 'swap,case,invert,upper,lower', category: 'Case' },
    (state) => {
      state.text = Array.from(state.text).map((ch) => {
        if (ch >= 'a' && ch <= 'z') return ch.toUpperCase();
        if (ch >= 'A' && ch <= 'Z') return ch.toLowerCase();
        return ch;
      }).join('');
    }
  );

  register(
    { api: 1, name: 'Sentence Case', description: 'Converts text to sentence case.', icon: 'type', tags: 'sentence,sentance,case', category: 'Case' },
    (state) => {
      state.text = state.text
        .toLowerCase()
        .replace(/(^\s*[a-z])|([.!?]\s+[a-z])/g, m => m.toUpperCase());
    }
  );

  register(
    { api: 1, name: 'Sentance Case', description: 'Converts text to sentence case.', icon: 'type', tags: 'sentance,sentence,case,typo-compatible', category: 'Case' },
    (state) => {
      state.text = state.text
        .toLowerCase()
        .replace(/(^\s*[a-z])|([.!?]\s+[a-z])/g, m => m.toUpperCase());
    }
  );

  register(
    { api: 1, name: 'All Caps', description: 'Converts text to all capital letters.', icon: 'type', tags: 'caps,allcaps,uppercase,shouting', category: 'Case' },
    (state) => { state.text = state.text.toUpperCase(); }
  );

  register(
    { api: 1, name: 'CamelCase', description: 'convertsYourTextToCamelCase', icon: 'camel', tags: 'camel,case,function,identifier', category: 'Case' },
    (state) => {
      state.text = state.text.split('\n').map(line =>
        splitWords(line).map((w, i) =>
          i === 0 ? w.toLowerCase() : capitalizeWord(w)
        ).join('')
      ).join('\n');
    }
  );

  register(
    { api: 1, name: 'PascalCase', description: 'ConvertsYourTextToPascalCase', icon: 'camel', tags: 'pascal,case,function,identifier', category: 'Case' },
    (state) => {
      state.text = state.text.split('\n').map(line =>
        splitWords(line).map(w => capitalizeWord(w)).join('')
      ).join('\n');
    }
  );

  register(
    { api: 1, name: 'Chicago Title Case', description: 'Applies Chicago-style title capitalization.', icon: 'type', tags: 'title,case,chicago,headline', category: 'Case' },
    (state) => {
      state.text = state.text.split('\n').map(line => applyTitleCaseLine(line, titleStyles.chicago)).join('\n');
    }
  );

  register(
    { api: 1, name: 'AP Title Case', description: 'Applies AP-style title capitalization.', icon: 'type', tags: 'title,case,ap,headline', category: 'Case' },
    (state) => {
      state.text = state.text.split('\n').map(line => applyTitleCaseLine(line, titleStyles.ap)).join('\n');
    }
  );

  register(
    { api: 1, name: 'MLA Title Case', description: 'Applies MLA-style title capitalization.', icon: 'type', tags: 'title,case,mla,heading', category: 'Case' },
    (state) => {
      state.text = state.text.split('\n').map(line => applyTitleCaseLine(line, titleStyles.mla)).join('\n');
    }
  );

  register(
    { api: 1, name: 'APA Title Case', description: 'Applies APA-style title capitalization.', icon: 'type', tags: 'title,case,apa,heading', category: 'Case' },
    (state) => {
      state.text = state.text.split('\n').map(line => applyTitleCaseLine(line, titleStyles.apa)).join('\n');
    }
  );

  register(
    { api: 1, name: 'New York Times Title Case', description: 'Applies New York Times-style title capitalization.', icon: 'type', tags: 'title,case,nyt,new york times,headline', category: 'Case' },
    (state) => {
      state.text = state.text.split('\n').map(line => applyTitleCaseLine(line, titleStyles.nyt)).join('\n');
    }
  );

  register(
    { api: 1, name: 'Sponge Case', description: 'CoNvERtS yoUR Text To A HIghER fOrM.', icon: 'pineapple', tags: 'bob,sarcasm,sponge,random', category: 'Case' },
    (state) => {
      state.text = state.text.split('').map(c =>
        Math.random() > 0.5 ? c.toUpperCase() : c.toLowerCase()
      ).join('');
    }
  );

  register(
    { api: 1, name: 'Deburr', description: 'Converts accented characters to basic Latin.', icon: 'colosseum', tags: 'deburr,accent,diacritics,normalize', category: 'Case' },
    (state) => {
      state.text = state.text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }
  );

  /* ═══════════════════════════════════════════════
     Lines
     ═══════════════════════════════════════════════ */

  register(
    { api: 1, name: 'Sort Lines', description: 'Sort lines alphabetically.', icon: 'sort-characters', tags: 'sort,alphabet,lines', category: 'Lines' },
    (state) => {
      let sorted = state.text.replace(/\n$/, '').split('\n')
        .sort((a, b) => a.localeCompare(b)).join('\n');
      if (sorted === state.text) sorted = sorted.split('\n').reverse().join('\n');
      state.text = sorted;
    }
  );

  register(
    { api: 1, name: 'Natural Sort Lines', description: 'Sort lines with smart handling of numbers.', icon: 'sort-numbers', tags: 'sort,natural,natsort,numeric', category: 'Lines' },
    (state) => {
      let sorted = state.text.replace(/\n$/, '').split('\n')
        .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }))
        .join('\n');
      if (sorted === state.text) sorted = sorted.split('\n').reverse().join('\n');
      state.text = sorted;
    }
  );

  register(
    { api: 1, name: 'Sort Lines (Case-Insensitive)', description: 'Sort lines alphabetically, ignoring case.', icon: 'sort-characters', tags: 'sort,lines,case-insensitive,alphabet', category: 'Lines' },
    (state) => {
      state.text = state.text.replace(/\n$/, '').split('\n')
        .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }))
        .join('\n');
    }
  );

  register(
    { api: 1, name: 'Reverse Lines', description: 'Flips every line of your text.', icon: 'flip', tags: 'reverse,order,invert,mirror,flip', category: 'Lines' },
    (state) => { state.text = state.text.split('\n').reverse().join('\n'); }
  );

  register(
    { api: 1, name: 'Shuffle Lines', description: 'Randomizes each line of your text.', icon: 'dice', tags: 'shuffle,random,lines', category: 'Lines' },
    (state) => {
      const lines = state.text.split('\n');
      for (let j = lines.length - 1; j > 0; j--) {
        const i = Math.floor(Math.random() * (j + 1));
        [lines[j], lines[i]] = [lines[i], lines[j]];
      }
      state.text = lines.join('\n');
    }
  );

  register(
    { api: 1, name: 'Remove Duplicate Lines', description: 'Ensures each line of your text is unique.', icon: 'filtration', tags: 'unique,duplicate,dedupe', category: 'Lines' },
    (state) => {
      const lines = state.text.split('\n');
      const out = [...new Set(lines)];
      state.text = out.join('\n');
      state.postInfo((lines.length - out.length) + ' duplicate lines removed');
    }
  );

  register(
    { api: 1, name: 'Unique Lines (Case-Insensitive)', description: 'Removes duplicate lines without case sensitivity.', icon: 'filtration', tags: 'unique,lines,dedupe,case-insensitive', category: 'Lines' },
    (state) => {
      const lines = state.text.split('\n');
      const seen = new Set();
      const out = [];
      lines.forEach((line) => {
        const key = line.toLocaleLowerCase();
        if (!seen.has(key)) {
          seen.add(key);
          out.push(line);
        }
      });
      state.text = out.join('\n');
      state.postInfo((lines.length - out.length) + ' duplicate lines removed (case-insensitive)');
    }
  );

  register(
    { api: 1, name: 'Collapse Lines', description: 'Removes all linebreaks from your text.', icon: 'collapse', tags: 'strip,remove,collapse,join', category: 'Lines' },
    (state) => {
      const split = state.text.split(/\r\n|\r|\n/);
      state.postInfo(split.length + ' lines collapsed');
      state.text = split.join('');
    }
  );

  register(
    { api: 1, name: 'Join Lines (Comma)', description: 'Joins all lines with commas.', icon: 'collapse', tags: 'join,lines,comma,csv', category: 'Lines' },
    (state) => {
      state.text = state.text.split(/\r\n|\r|\n/).join(', ');
    }
  );

  register(
    { api: 1, name: 'Join Lines (Space)', description: 'Joins all lines with spaces.', icon: 'collapse', tags: 'join,lines,space', category: 'Lines' },
    (state) => {
      state.text = state.text.split(/\r\n|\r|\n/).join(' ');
    }
  );

  register(
    { api: 1, name: 'Split to Lines', description: 'Splits text on commas or spaces into separate lines.', icon: 'collapse', tags: 'split,lines,comma,space', category: 'Lines' },
    (state) => {
      state.text = state.text.split(/[\s,;]+/).filter(Boolean).join('\n');
    }
  );

  register(
    { api: 1, name: 'Wrap Lines (80 chars)', description: 'Wraps paragraphs to 80 characters per line.', icon: 'collapse', tags: 'wrap,lines,format,80,column', category: 'Lines' },
    (state) => {
      const width = 80;
      function wrapParagraph(paragraph) {
        const words = paragraph.replace(/\s+/g, ' ').trim().split(' ').filter(Boolean);
        if (words.length === 0) return '';
        const lines = [];
        let current = words[0];
        for (let i = 1; i < words.length; i++) {
          const word = words[i];
          if ((current + ' ' + word).length > width) {
            lines.push(current);
            current = word;
          } else {
            current += ' ' + word;
          }
        }
        lines.push(current);
        return lines.join('\n');
      }

      const paragraphs = state.text.split(/\n\s*\n/);
      state.text = paragraphs.map(wrapParagraph).join('\n\n');
    }
  );

  register(
    { api: 1, name: 'Unwrap Lines', description: 'Joins wrapped lines back into paragraphs.', icon: 'collapse', tags: 'unwrap,lines,paragraph,join', category: 'Lines' },
    (state) => {
      const paragraphs = state.text.split(/\n\s*\n/);
      state.text = paragraphs.map(p => p.replace(/\s*\n\s*/g, ' ').replace(/\s+/g, ' ').trim()).join('\n\n');
    }
  );

  /* ═══════════════════════════════════════════════
     Utilities / Text
     ═══════════════════════════════════════════════ */

  register(
    { api: 1, name: 'Trim', description: 'Trims leading and trailing whitespace.', icon: 'scissors', tags: 'trim,whitespace,empty,space', category: 'Utilities' },
    (state) => { state.text = state.text.trim(); }
  );

  register(
    { api: 1, name: 'Trim Lines', description: 'Trims whitespace from each line.', icon: 'scissors', tags: 'trim,whitespace,lines', category: 'Utilities' },
    (state) => {
      state.text = state.text.split('\n').map(l => l.trim()).join('\n');
    }
  );

  register(
    { api: 1, name: 'Normalize Whitespace', description: 'Normalizes line endings, trims trailing spaces, and collapses repeated spaces.', icon: 'scissors', tags: 'normalize,whitespace,spaces,tabs,eol', category: 'Utilities' },
    (state) => {
      state.text = state.text
        .replace(/\r\n?/g, '\n')
        .split('\n')
        .map(line => line.replace(/[\t ]+$/g, '').replace(/\t/g, ' ').replace(/ {2,}/g, ' '))
        .join('\n')
        .replace(/\n{3,}/g, '\n\n');
    }
  );

  register(
    { api: 1, name: 'Tabs to Spaces', description: 'Converts tab characters to four spaces.', icon: 'scissors', tags: 'tabs,spaces,indentation,convert', category: 'Utilities' },
    (state) => {
      state.text = state.text.replace(/\t/g, '    ');
    }
  );

  register(
    { api: 1, name: 'Spaces to Tabs', description: 'Converts groups of four leading spaces to tabs.', icon: 'scissors', tags: 'spaces,tabs,indentation,convert', category: 'Utilities' },
    (state) => {
      state.text = state.text.split('\n').map((line) => {
        const m = line.match(/^ +/);
        if (!m) return line;
        const leading = m[0];
        const tabs = '\t'.repeat(Math.floor(leading.length / 4));
        const spaces = ' '.repeat(leading.length % 4);
        return tabs + spaces + line.slice(leading.length);
      }).join('\n');
    }
  );

  register(
    { api: 1, name: 'Remove Empty Lines', description: 'Removes blank lines from your text.', icon: 'scissors', tags: 'remove,empty,blank,lines', category: 'Utilities' },
    (state) => {
      const lines = state.text.split('\n');
      const out = lines.filter(l => l.trim().length > 0);
      state.text = out.join('\n');
      state.postInfo((lines.length - out.length) + ' empty lines removed');
    }
  );

  register(
    { api: 1, name: 'Remove Zero-Width Chars', description: 'Removes invisible zero-width Unicode characters.', icon: 'scissors', tags: 'zero-width,unicode,clean,invisible', category: 'Utilities' },
    (state) => {
      const before = state.text.length;
      state.text = state.text.replace(/[\u200B\u200C\u200D\u2060\uFEFF]/g, '');
      const removed = before - state.text.length;
      state.postInfo(removed + ' zero-width characters removed');
    }
  );

  register(
    { api: 1, name: 'Reverse String', description: '!seod ti tahw sseuG', icon: 'flip', tags: 'flip,mirror,invert,reverse,string', category: 'Utilities' },
    (state) => { state.text = [...state.text].reverse().join(''); }
  );

  register(
    { api: 1, name: 'Slugify', description: 'Converts text into a URL-friendly slug.', icon: 'link', tags: 'slug,url,seo,normalize,permalink', category: 'Utilities' },
    (state) => {
      state.text = state.text
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }
  );

  register(
    { api: 1, name: 'Lorem Ipsum', description: 'Generates Lorem Ipsum placeholder text.', icon: 'type', tags: 'generate,lorem,ipsum,text,placeholder', category: 'Utilities' },
    (state) => {
      const words = ['ad', 'adipisicing', 'aliqua', 'aliquip', 'amet', 'anim', 'aute', 'cillum', 'commodo',
        'consectetur', 'consequat', 'culpa', 'cupidatat', 'deserunt', 'do', 'dolor', 'dolore', 'duis', 'ea',
        'eiusmod', 'elit', 'enim', 'esse', 'est', 'et', 'eu', 'ex', 'excepteur', 'exercitation', 'fugiat',
        'id', 'in', 'incididunt', 'ipsum', 'irure', 'labore', 'laboris', 'laborum', 'Lorem', 'magna', 'minim',
        'mollit', 'nisi', 'non', 'nostrud', 'nulla', 'occaecat', 'officia', 'pariatur', 'proident', 'qui',
        'quis', 'reprehenderit', 'sint', 'sit', 'sunt', 'tempor', 'ullamco', 'ut', 'velit', 'veniam', 'voluptate'];
      let sentence = '';
      for (let i = 0; i < 100; i++) {
        sentence += words[Math.floor(Math.random() * words.length)] + ' ';
      }
      state.text = sentence.charAt(0).toUpperCase() + sentence.slice(1).trim() + '.';
    }
  );

  /* ═══════════════════════════════════════════════
     Counting / Info
     ═══════════════════════════════════════════════ */

  register(
    { api: 1, name: 'Count Characters', description: 'Get the length of your text.', icon: 'counter', tags: 'count,length,size,character', category: 'Counting' },
    (state) => { state.postInfo([...state.text].length + ' characters'); }
  );

  register(
    { api: 1, name: 'Count Words', description: 'Get the word count of your text.', icon: 'counter', tags: 'count,length,size,words', category: 'Counting' },
    (state) => {
      const words = state.text.trim().match(/\S+/g);
      state.postInfo((words ? words.length : 0) + ' words');
    }
  );

  register(
    { api: 1, name: 'Count Lines', description: 'Get the line count of your text.', icon: 'counter', tags: 'count,length,size,line', category: 'Counting' },
    (state) => { state.postInfo(state.text.split('\n').length + ' lines'); }
  );

  register(
    { api: 1, name: 'Sum All', description: 'Sums up a list of numbers.', icon: 'abacus', tags: 'sum,calculator,addition,add,math', category: 'Counting' },
    (state) => {
      const nums = state.text.replace(/\/\/.*/g, '').split(/[\n\s,;=]/).map(s => s.trim()).filter(Boolean).map(Number).filter(n => !isNaN(n));
      if (nums.length === 0) { state.postError('No numbers found'); return; }
      const sum = nums.reduce((a, b) => a + b, 0);
      state.text = state.text + '\n\n= ' + sum + '  // ' + nums.join(' + ');
    }
  );

  /* ═══════════════════════════════════════════════
     Hashing (uses Web Crypto API)
     ═══════════════════════════════════════════════ */

  async function hashText(algo, state) {
    const encoder = new TextEncoder();
    const data = encoder.encode(state.text);
    const hashBuffer = await crypto.subtle.digest(algo, data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    state.text = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  register(
    { api: 1, name: 'MD5 Checksum', description: 'Computes MD5 hash (uses simple JS implementation).', icon: 'fingerprint', tags: 'md5,hash,checksum', category: 'Hashing', async: false },
    (state) => {
      // Simple MD5 implementation (public domain, RFC 1321)
      function md5(string) {
        function rotl(v, n) { return (v << n) | (v >>> (32 - n)); }
        function hex(n) {
          let s = '';
          for (let i = 0; i < 4; i++) s += ('0' + ((n >> (i * 8 + 4)) & 0xf).toString(16)) + ('0' + ((n >> (i * 8)) & 0xf).toString(16));
          return s;
        }
        const utf8 = unescape(encodeURIComponent(string));
        const words = [];
        for (let i = 0; i < utf8.length * 8; i += 8) words[i >> 5] |= (utf8.charCodeAt(i / 8) & 0xff) << (i % 32);
        words[utf8.length >> 2] |= 0x80 << ((utf8.length % 4) * 8);
        words[(((utf8.length + 8) >>> 6) << 4) + 14] = utf8.length * 8;
        let a = 1732584193, b = -271733879, c = -1732584194, d = 271733878;
        for (let i = 0; i < words.length; i += 16) {
          const oa = a, ob = b, oc = c, od = d;
          const f = (x, y, z) => (x & y) | (~x & z);
          const g = (x, y, z) => (x & z) | (y & ~z);
          const h = (x, y, z) => x ^ y ^ z;
          const k = (x, y, z) => y ^ (x | ~z);
          const op = (fn, a2, b2, c2, d2, x, s, t) => {
            const res = a2 + fn(b2, c2, d2) + (x >>> 0) + t;
            return (rotl(res, s) + b2) | 0;
          };
          const w = (j) => words[i + j] | 0;
          a = op(f,a,b,c,d,w(0),7,-680876936); d = op(f,d,a,b,c,w(1),12,-389564586); c = op(f,c,d,a,b,w(2),17,606105819); b = op(f,b,c,d,a,w(3),22,-1044525330);
          a = op(f,a,b,c,d,w(4),7,-176418897); d = op(f,d,a,b,c,w(5),12,1200080426); c = op(f,c,d,a,b,w(6),17,-1473231341); b = op(f,b,c,d,a,w(7),22,-45705983);
          a = op(f,a,b,c,d,w(8),7,1770035416); d = op(f,d,a,b,c,w(9),12,-1958414417); c = op(f,c,d,a,b,w(10),17,-42063); b = op(f,b,c,d,a,w(11),22,-1990404162);
          a = op(f,a,b,c,d,w(12),7,1804603682); d = op(f,d,a,b,c,w(13),12,-40341101); c = op(f,c,d,a,b,w(14),17,-1502002290); b = op(f,b,c,d,a,w(15),22,1236535329);
          a = op(g,a,b,c,d,w(1),5,-165796510); d = op(g,d,a,b,c,w(6),9,-1069501632); c = op(g,c,d,a,b,w(11),14,643717713); b = op(g,b,c,d,a,w(0),20,-373897302);
          a = op(g,a,b,c,d,w(5),5,-701558691); d = op(g,d,a,b,c,w(10),9,38016083); c = op(g,c,d,a,b,w(15),14,-660478335); b = op(g,b,c,d,a,w(4),20,-405537848);
          a = op(g,a,b,c,d,w(9),5,568446438); d = op(g,d,a,b,c,w(14),9,-1019803690); c = op(g,c,d,a,b,w(3),14,-187363961); b = op(g,b,c,d,a,w(8),20,1163531501);
          a = op(g,a,b,c,d,w(13),5,-1444681467); d = op(g,d,a,b,c,w(2),9,-51403784); c = op(g,c,d,a,b,w(7),14,1735328473); b = op(g,b,c,d,a,w(12),20,-1926607734);
          a = op(h,a,b,c,d,w(5),4,-378558); d = op(h,d,a,b,c,w(8),11,-2022574463); c = op(h,c,d,a,b,w(11),16,1839030562); b = op(h,b,c,d,a,w(14),23,-35309556);
          a = op(h,a,b,c,d,w(1),4,-1530992060); d = op(h,d,a,b,c,w(4),11,1272893353); c = op(h,c,d,a,b,w(7),16,-155497632); b = op(h,b,c,d,a,w(10),23,-1094730640);
          a = op(h,a,b,c,d,w(13),4,681279174); d = op(h,d,a,b,c,w(0),11,-358537222); c = op(h,c,d,a,b,w(3),16,-722521979); b = op(h,b,c,d,a,w(6),23,76029189);
          a = op(h,a,b,c,d,w(9),4,-640364487); d = op(h,d,a,b,c,w(12),11,-421815835); c = op(h,c,d,a,b,w(15),16,530742520); b = op(h,b,c,d,a,w(2),23,-995338651);
          a = op(k,a,b,c,d,w(0),6,-198630844); d = op(k,d,a,b,c,w(7),10,1126891415); c = op(k,c,d,a,b,w(14),15,-1416354905); b = op(k,b,c,d,a,w(5),21,-57434055);
          a = op(k,a,b,c,d,w(12),6,1700485571); d = op(k,d,a,b,c,w(3),10,-1894986606); c = op(k,c,d,a,b,w(10),15,-1051523); b = op(k,b,c,d,a,w(1),21,-2054922799);
          a = op(k,a,b,c,d,w(8),6,1873313359); d = op(k,d,a,b,c,w(15),10,-30611744); c = op(k,c,d,a,b,w(6),15,-1560198380); b = op(k,b,c,d,a,w(13),21,1309151649);
          a = op(k,a,b,c,d,w(4),6,-145523070); d = op(k,d,a,b,c,w(11),10,-1120210379); c = op(k,c,d,a,b,w(2),15,718787259); b = op(k,b,c,d,a,w(9),21,-343485551);
          a = (a + oa) | 0; b = (b + ob) | 0; c = (c + oc) | 0; d = (d + od) | 0;
        }
        return hex(a) + hex(b) + hex(c) + hex(d);
      }
      state.text = md5(state.text);
    }
  );

  register(
    { api: 1, name: 'SHA-1 Hash', description: 'Computes the SHA-1 hash (hex encoded).', icon: 'fingerprint', tags: 'sha1,hash,checksum', category: 'Hashing', async: true },
    async (state) => { await hashText('SHA-1', state); }
  );

  register(
    { api: 1, name: 'SHA-256 Hash', description: 'Computes the SHA-256 hash (hex encoded).', icon: 'fingerprint', tags: 'sha256,hash,checksum', category: 'Hashing', async: true },
    async (state) => { await hashText('SHA-256', state); }
  );

  register(
    { api: 1, name: 'SHA-512 Hash', description: 'Computes the SHA-512 hash (hex encoded).', icon: 'fingerprint', tags: 'sha512,hash,checksum', category: 'Hashing', async: true },
    async (state) => { await hashText('SHA-512', state); }
  );

  /* ═══════════════════════════════════════════════
     Number / Color Conversion
     ═══════════════════════════════════════════════ */

  register(
    { api: 1, name: 'Hex to RGB', description: 'Converts hex color to RGB.', icon: 'color-wheel', tags: 'hex,color,rgb,convert', category: 'Conversion' },
    (state) => {
      const hex = state.text.trim().replace(/^#/, '');
      if (!/^[0-9a-f]{6}$/i.test(hex)) { state.postError('Invalid hex color'); return; }
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      state.text = `rgb(${r}, ${g}, ${b})`;
    }
  );

  register(
    { api: 1, name: 'RGB to Hex', description: 'Converts RGB color to hex.', icon: 'color-wheel', tags: 'rgb,color,hex,convert', category: 'Conversion' },
    (state) => {
      const match = state.text.match(/(\d+)\s*[,\s]\s*(\d+)\s*[,\s]\s*(\d+)/);
      if (!match) { state.postError('Expected format: r, g, b'); return; }
      const hex = [match[1], match[2], match[3]]
        .map(n => Math.max(0, Math.min(255, parseInt(n))).toString(16).padStart(2, '0'))
        .join('');
      state.text = '#' + hex;
    }
  );

  register(
    { api: 1, name: 'Decimal to Hex', description: 'Converts decimal numbers to hexadecimal.', icon: 'metamorphose', tags: 'decimal,hex,convert,number', category: 'Conversion' },
    (state) => {
      const num = parseInt(state.text.trim(), 10);
      if (isNaN(num)) { state.postError('Invalid number'); return; }
      state.text = '0x' + num.toString(16).toUpperCase();
    }
  );

  register(
    { api: 1, name: 'Hex to Decimal', description: 'Converts hexadecimal to decimal.', icon: 'metamorphose', tags: 'hex,decimal,convert,number', category: 'Conversion' },
    (state) => {
      const num = parseInt(state.text.trim().replace(/^0x/i, ''), 16);
      if (isNaN(num)) { state.postError('Invalid hex'); return; }
      state.text = String(num);
    }
  );

  register(
    { api: 1, name: 'Decimal to Binary', description: 'Converts decimal numbers to binary.', icon: 'metamorphose', tags: 'decimal,binary,convert,number', category: 'Conversion' },
    (state) => {
      const num = parseInt(state.text.trim(), 10);
      if (isNaN(num)) { state.postError('Invalid number'); return; }
      state.text = num.toString(2);
    }
  );

  register(
    { api: 1, name: 'Binary to Decimal', description: 'Converts binary to decimal.', icon: 'metamorphose', tags: 'binary,decimal,convert,number', category: 'Conversion' },
    (state) => {
      const num = parseInt(state.text.trim(), 2);
      if (isNaN(num)) { state.postError('Invalid binary'); return; }
      state.text = String(num);
    }
  );

  register(
    { api: 1, name: 'ASCII to Hex', description: 'Converts ASCII text to hex representation.', icon: 'metamorphose', tags: 'ascii,hex,convert', category: 'Conversion' },
    (state) => {
      state.text = Array.from(state.text).map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join(' ');
    }
  );

  register(
    { api: 1, name: 'Hex to ASCII', description: 'Converts hex representation to ASCII text.', icon: 'metamorphose', tags: 'hex,ascii,convert', category: 'Conversion' },
    (state) => {
      try {
        state.text = state.text.trim().split(/\s+/).map(h => String.fromCharCode(parseInt(h, 16))).join('');
      } catch (e) { state.postError('Invalid hex string'); }
    }
  );

  /* ═══════════════════════════════════════════════
     Date / Time
     ═══════════════════════════════════════════════ */

  register(
    { api: 1, name: 'Date to Timestamp', description: 'Converts dates to Unix timestamp.', icon: 'watch', tags: 'date,time,calendar,unix,timestamp', category: 'Date/Time' },
    (state) => {
      const parsed = Date.parse(state.text);
      if (isNaN(parsed)) { state.postError('Invalid Date'); return; }
      state.text = String(parsed / 1000);
    }
  );

  register(
    { api: 1, name: 'Timestamp to Date', description: 'Converts Unix timestamp to a date.', icon: 'watch', tags: 'date,time,calendar,unix,timestamp', category: 'Date/Time' },
    (state) => {
      let ts = parseInt(state.text.trim(), 10);
      if (isNaN(ts)) { state.postError('Invalid timestamp'); return; }
      // Auto-detect seconds vs milliseconds
      if (ts < 1e12) ts *= 1000;
      state.text = new Date(ts).toUTCString();
    }
  );

  register(
    { api: 1, name: 'Date to ISO 8601', description: 'Converts dates to ISO 8601 format.', icon: 'watch', tags: 'date,time,iso,8601', category: 'Date/Time' },
    (state) => {
      const parsed = Date.parse(state.text);
      if (isNaN(parsed)) { state.postError('Invalid Date'); return; }
      state.text = new Date(parsed).toISOString();
    }
  );

  /* ═══════════════════════════════════════════════
     JWT
     ═══════════════════════════════════════════════ */

  register(
    { api: 1, name: 'JWT Decode', description: 'Decodes a JWT token to JSON.', icon: 'identification', tags: 'decode,jwt,token,json', category: 'Encoding' },
    (state) => {
      const parts = state.text.trim().split('.');
      if (parts.length !== 3) { state.postError('Invalid JWT (expected 3 parts)'); return; }
      try {
        const header = JSON.parse(decodeURIComponent(escape(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/')))));
        const payload = JSON.parse(decodeURIComponent(escape(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')))));
        state.text = JSON.stringify({ header, payload, signature: parts[2] }, null, 2);
      } catch (e) { state.postError('Error parsing JWT: ' + e.message); }
    }
  );

  // ── Public API ──
  return {
    list: () => registry.slice(),
    categories: () => [...new Set(registry.map(s => s.meta.category))],
    search: (query) => {
      const q = query.toLowerCase().trim();
      if (!q || q === '*') return registry.slice();
      return registry.filter(s => {
        const m = s.meta;
        return m.name.toLowerCase().includes(q)
          || m.description.toLowerCase().includes(q)
          || (m.tags || '').toLowerCase().includes(q)
          || (m.category || '').toLowerCase().includes(q);
      });
    },
    run: async (script, text) => {
      let infoMsg = null, errorMsg = null;
      const state = {
        get text() { return this._text; },
        set text(v) { this._text = String(v); },
        get fullText() { return this._text; },
        set fullText(v) { this._text = String(v); },
        _text: text,
        postInfo(msg) { infoMsg = msg; },
        postError(msg) { errorMsg = msg; },
        insert(str) { this._text += str; }
      };
      if (script.meta.async) {
        await script.main(state);
      } else {
        script.main(state);
      }
      return { text: state._text, info: infoMsg, error: errorMsg };
    }
  };
})();
