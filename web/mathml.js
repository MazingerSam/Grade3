/* =========================================================
   木新思達 國小數學 - MathML / OMML 數學符號標準渲染引擎 (mathml.js)
   支援標準 W3C MathML 與 OMML (Office Math Markup Language) 語法規範
   提供小學數學專屬符號排版：直式/橫式分數、帶分數、幾何角符號、度數、面積單位、四則運算
   ========================================================= */

(function(window) {
  'use strict';

  /**
   * 將純文字或包含數學表示式的字串，轉換為標準 W3C MathML DOM 標記
   * @param {string} text - 輸入文本
   * @param {object} options - 選項配置
   * @returns {string} 轉換為 MathML 後的 HTML 字串
   */
  function convertToMathML(text, options = {}) {
    if (text === null || text === undefined) return '';
    let s = String(text);

    // 0. 避免重複轉換已經包含 MathML 的片段
    if (s.includes('<math') || s.includes('<mml:math')) {
      return s;
    }

    // 1. 帶分數 (Mixed Fraction): 例如 "2又3/7", "3又6/5", "1又2/4", 或已帶空白之 "2 3/7"
    // 嚴格依據數學 OMML / MathML 規範：以整數緊鄰標準水平橫線分數表示，完全去除口語字 "又"，分開分子分母為清晰橫線
    s = s.replace(/(\d+)\s*(?:又|\s+)\s*([1-9]\d{0,2})\/([1-9]\d{0,2})/g, (match, whole, num, den) => {
      return `<span class="math-mixed" role="math" aria-label="${whole}又${den}分之${num}"><span class="math-whole">${whole}</span><span class="math-frac"><span class="math-frac-num">${num}</span><span class="math-frac-bar"></span><span class="math-frac-den">${den}</span></span><math xmlns="http://www.w3.org/1998/Math/MathML" class="sr-only-mathml" aria-hidden="true"><mn>${whole}</mn><mfrac><mn>${num}</mn><mn>${den}</mn></mfrac></math></span>`;
    });

    // 2. 一般真分數與假分數 (Fraction): 例如 "1/4", "3/8", "12/5"
    // 排除特定非分數情境（如日期 2026/10/11、新臺幣錢幣 1000/100/10/1 或網址）
    s = s.replace(/(?<![\d\/])([1-9]\d{0,2})\/([1-9]\d{0,2})(?![\d\/])/g, (match, num, den) => {
      return `<span class="math-frac" role="math" aria-label="${den}分之${num}"><span class="math-frac-num">${num}</span><span class="math-frac-bar"></span><span class="math-frac-den">${den}</span><math xmlns="http://www.w3.org/1998/Math/MathML" class="sr-only-mathml" aria-hidden="true"><mfrac><mn>${num}</mn><mn>${den}</mn></mfrac></math></span>`;
    });

    // 3. 面積平方單位：cm²、m²、km²
    s = s.replace(/cm²/g, '<span class="math-unit" role="math" aria-label="平方公分">cm<sup class="math-sup">2</sup></span>');
    s = s.replace(/m²/g, '<span class="math-unit" role="math" aria-label="平方公尺">m<sup class="math-sup">2</sup></span>');
    s = s.replace(/km²/g, '<span class="math-unit" role="math" aria-label="平方公里">km<sup class="math-sup">2</sup></span>');

    // 4. 幾何角符號：如 ∠1, ∠2, ∠A, ∠B, ∠BAC
    s = s.replace(/∠([0-9A-Za-z]+)/g, (match, angleTarget) => {
      return `<span class="math-angle" role="math" aria-label="角${angleTarget}">∠${angleTarget}</span>`;
    });

    // 5. 角度度數：例如 30°, 45°, 90°, 180°, 360°
    s = s.replace(/(\d+)°/g, (match, deg) => {
      return `<span class="math-degree" role="math" aria-label="${deg}度">${deg}°</span>`;
    });

    return s;
  }

  /**
   * 建立相容 OMML (Office Math Markup Language) 語法之標記產生器
   * 帶分數以整數 run 緊鄰分數 run (<m:r><m:t>whole</m:t></m:r><m:f>...)，不含 "又" 字
   * @param {string} type - 'mixed_fraction' | 'fraction' | 'sup' | 'angle'
   * @param {object} params - 參數
   * @returns {string} OMML XML 標記字串
   */
  function toOMML(type, params = {}) {
    if (type === 'mixed_fraction') {
      return `<m:oMath><m:r><m:t>${params.whole}</m:t></m:r><m:f><m:num><m:r><m:t>${params.num}</m:t></m:r></m:num><m:den><m:r><m:t>${params.den}</m:t></m:r></m:den></m:f></m:oMath>`;
    } else if (type === 'fraction') {
      return `<m:oMath><m:f><m:num><m:r><m:t>${params.num}</m:t></m:r></m:num><m:den><m:r><m:t>${params.den}</m:t></m:r></m:den></m:f></m:oMath>`;
    } else if (type === 'sup') {
      return `<m:oMath><m:sSup><m:e><m:r><m:t>${params.base}</m:t></m:r></m:e><m:sup><m:r><m:t>${params.sup}</m:t></m:r></m:sup></m:sSup></m:oMath>`;
    }
    return '';
  }

  /**
   * 遞迴掃描指定 DOM 節點，自動將純文字節點中的分數、平方與角度符號替換為 MathML
   * @param {HTMLElement} rootElement 
   */
  function renderMathMLInElement(rootElement) {
    if (!rootElement || !(rootElement instanceof HTMLElement)) return;

    // 略過腳本與樣式標籤
    const ignoredTags = ['SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT', 'SELECT', 'MATH', 'SVG', 'CODE', 'PRE'];
    if (ignoredTags.includes(rootElement.tagName)) return;

    const walker = document.createTreeWalker(
      rootElement,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: function(node) {
          if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
          const parent = node.parentElement;
          if (parent && ignoredTags.includes(parent.tagName)) return NodeFilter.FILTER_REJECT;
          if (parent && (parent.closest('math') || parent.closest('.math-frac') || parent.closest('.math-mixed') || parent.closest('.mathml-rendered-wrap'))) return NodeFilter.FILTER_REJECT;
          
          // 檢查是否含有欲轉換之數學特徵（例如 1/4, 2 1/3, 4 1/5, cm², ∠A, 45° 等）
          const val = node.nodeValue;
          if (/\b\d+\s*\/\s*\d+\b|\d+\s+(?:[1-9]\d{0,2})\/(?:[1-9]\d{0,2})|\d+又\d+\/\d+|cm²|m²|km²|∠\w+|\d+°/.test(val)) {
            // 排除 1000/100/10/1 或 2026/10/11
            if (/\d+\/\d+\/\d+/.test(val)) return NodeFilter.FILTER_REJECT;
            return NodeFilter.FILTER_ACCEPT;
          }
          return NodeFilter.FILTER_REJECT;
        }
      },
      false
    );

    const nodesToReplace = [];
    while (walker.nextNode()) {
      nodesToReplace.push(walker.currentNode);
    }

    nodesToReplace.forEach(textNode => {
      const originalText = textNode.nodeValue;
      const convertedHtml = convertToMathML(originalText);
      if (convertedHtml !== originalText) {
        const span = document.createElement('span');
        span.className = 'mathml-rendered-wrap';
        span.innerHTML = convertedHtml;
        if (textNode.parentNode) {
          textNode.parentNode.replaceChild(span, textNode);
        }
      }
    });
  }

  // 掛載至全域
  window.MathMLRenderer = {
    convert: convertToMathML,
    toOMML: toOMML,
    renderElement: renderMathMLInElement
  };

  // 全域快捷方法
  window.renderMathML = convertToMathML;

  // 網頁載入完成後自動全頁渲染
  if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
      // 延遲微秒確保動態單元初始化後渲染
      setTimeout(() => {
        renderMathMLInElement(document.body);
      }, 100);
    });
  }

})(typeof window !== 'undefined' ? window : this);
