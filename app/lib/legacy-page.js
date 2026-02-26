import { readFile } from 'node:fs/promises';
import path from 'node:path';
import Script from 'next/script';

function normalizeAssetUrl(url) {
  if (!url) return url;
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//')) {
    return url;
  }
  if (url.startsWith('/') || url.startsWith('data:') || url.startsWith('#')) {
    return url;
  }
  return `/${url}`;
}

function extractHead(htmlDocument) {
  const match = htmlDocument.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
  return match ? match[1] : '';
}

function extractBody(htmlDocument) {
  const match = htmlDocument.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  return match ? match[1] : htmlDocument;
}

function extractTitle(headContent) {
  const match = headContent.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return match ? match[1].trim() : 'Oddysee';
}

function extractStylesheets(htmlDocument) {
  const links = [];
  const seen = new Set();
  const regex = /<link[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["'][^>]*>/gi;
  let match;

  while ((match = regex.exec(htmlDocument)) !== null) {
    const normalizedHref = normalizeAssetUrl(match[1]);
    if (normalizedHref && !seen.has(normalizedHref)) {
      seen.add(normalizedHref);
      links.push(normalizedHref);
    }
  }

  return links;
}

function extractScriptsInOrder(htmlDocument) {
  const scripts = [];
  const regex = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
  let match;

  while ((match = regex.exec(htmlDocument)) !== null) {
    const attrs = match[1] || '';
    const inlineCode = (match[2] || '').trim();
    const srcMatch = attrs.match(/\ssrc=["']([^"']+)["']/i);

    if (srcMatch && srcMatch[1]) {
      scripts.push({
        type: 'src',
        src: normalizeAssetUrl(srcMatch[1])
      });
      continue;
    }

    if (inlineCode) {
      scripts.push({
        type: 'inline',
        code: inlineCode
      });
    }
  }

  return scripts;
}

function stripScriptsAndStylesFromBody(bodyContent) {
  return bodyContent
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<link[^>]*rel=["']stylesheet["'][^>]*>/gi, '');
}

function normalizeRelativeBodyAssetUrls(bodyContent) {
  return bodyContent.replace(
    /\b(src|href|poster|data-src)=(["'])([^"']+)\2/gi,
    (fullMatch, attrName, quote, attrValue) => {
      const isRelative =
        !attrValue.startsWith('/') &&
        !attrValue.startsWith('http://') &&
        !attrValue.startsWith('https://') &&
        !attrValue.startsWith('//') &&
        !attrValue.startsWith('#') &&
        !attrValue.startsWith('data:') &&
        !attrValue.startsWith('mailto:') &&
        !attrValue.startsWith('tel:') &&
        !attrValue.startsWith('javascript:');

      if (!isRelative) {
        return fullMatch;
      }

      return `${attrName}=${quote}/${attrValue}${quote}`;
    }
  );
}

export async function loadLegacyPage(htmlFileName) {
  const fullPath = path.join(process.cwd(), 'legacy-pages', htmlFileName);
  const html = await readFile(fullPath, 'utf8');
  const head = extractHead(html);
  const body = extractBody(html);

  return {
    title: extractTitle(head),
    body: normalizeRelativeBodyAssetUrls(stripScriptsAndStylesFromBody(body)),
    stylesheets: extractStylesheets(html),
    scripts: extractScriptsInOrder(html),
  };
}

export function LegacyPage({ pageKey, pageData }) {
  return (
    <>
      {pageData.stylesheets.map((href) => (
        <link key={`${pageKey}-style-${href}`} rel="stylesheet" href={href} />
      ))}

      <Script id={`${pageKey}-dom-ready-shim`} strategy="beforeInteractive">
        {`(function(){
  var originalAddEventListener = document.addEventListener.bind(document);
  document.addEventListener = function(type, listener, options) {
    if (type === 'DOMContentLoaded' && document.readyState !== 'loading' && typeof listener === 'function') {
      setTimeout(function () {
        listener.call(document, new Event('DOMContentLoaded'));
      }, 0);

      if (options && typeof options === 'object' && options.once) {
        return;
      }
    }

    return originalAddEventListener(type, listener, options);
  };
})();`}
      </Script>

      <main dangerouslySetInnerHTML={{ __html: pageData.body }} />

      {pageData.scripts.map((script, index) =>
        script.type === 'src' ? (
          <Script
            key={`${pageKey}-src-${index}`}
            src={script.src}
            strategy="afterInteractive"
          />
        ) : (
          <Script
            key={`${pageKey}-inline-${index}`}
            id={`${pageKey}-inline-${index}`}
            strategy="afterInteractive"
          >
            {script.code}
          </Script>
        )
      )}
    </>
  );
}
