(function(){
  var CONSENT_KEY = 'ps_consent_v1';

  function hasConsent(){
    try { return localStorage.getItem(CONSENT_KEY) === 'granted'; } catch(e){ return false; }
  }
  function setConsent(value){
    try { localStorage.setItem(CONSENT_KEY, value ? 'granted' : 'denied'); } catch(e){}
  }

  function loadScript(src, attrs){
    var s = document.createElement('script');
    s.src = src;
    if (attrs) Object.keys(attrs).forEach(function(k){ s.setAttribute(k, attrs[k]); });
    document.head.appendChild(s);
  }

  function loadConsentManagedScripts(){
    // Load GA
    loadScript('https://www.googletagmanager.com/gtag/js?id=G-JVXERHFJ5B', { async: '' });
    var inline = document.createElement('script');
    inline.text = "window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'G-JVXERHFJ5B');";
    document.head.appendChild(inline);
    // Load AdSense
    loadScript('https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8591816850976205', { async: '', crossorigin: 'anonymous' });
  }

  function buildBanner(){
    var banner = document.createElement('div');
    banner.id = 'consent-banner';
    banner.style.cssText = 'position:fixed;bottom:0;left:0;right:0;background:#0b1220;color:#fff;padding:12px 16px;z-index:9999;box-shadow:0 -2px 10px rgba(0,0,0,.2);font-size:14px;display:flex;align-items:center;gap:12px;flex-wrap:wrap;';
    banner.innerHTML = '<div style="flex:1;min-width:240px;line-height:1.4;">We use cookies or similar technologies for analytics and ads. You can accept or decline. See <a href="privacy.html" style="color:#61dafb;text-decoration:underline;">Privacy Policy</a>.<br><span style="opacity:.8;">我们使用 Cookie 或同类技术用于分析与广告展示，您可以同意或拒绝，详见隐私政策。</span></div>';
    var actions = document.createElement('div');
    actions.style.cssText = 'display:flex;gap:8px;margin-left:auto;';

    var accept = document.createElement('button');
    accept.textContent = 'Accept';
    accept.style.cssText = 'background:#0071e3;color:#fff;border:none;border-radius:6px;padding:8px 12px;cursor:pointer;';
    accept.onclick = function(){ setConsent(true); document.body.removeChild(banner); loadConsentManagedScripts(); };

    var decline = document.createElement('button');
    decline.textContent = 'Decline';
    decline.style.cssText = 'background:#333;color:#fff;border:none;border-radius:6px;padding:8px 12px;cursor:pointer;';
    decline.onclick = function(){ setConsent(false); document.body.removeChild(banner); };

    actions.appendChild(accept);
    actions.appendChild(decline);
    banner.appendChild(actions);
    return banner;
  }
  function showBanner(){
    if (document.getElementById('consent-banner')) return;
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function(){
        document.body.appendChild(buildBanner());
      }, { once: true });
    } else {
      document.body.appendChild(buildBanner());
    }
  }

  function init(){
    if (hasConsent()) {
      loadConsentManagedScripts();
      return;
    }
    // Show minimal, non-intrusive consent banner
    showBanner();

    // Delegate clicks from "Cookie Settings" links
    document.addEventListener('click', function(e){
      var target = e.target;
      if (target && target.closest && target.closest('[data-cookie-settings]')){
        e.preventDefault();
        showBanner();
      }
    });
  }

  init();
  // Expose global for manual triggers
  try { window.psShowConsentBanner = showBanner; } catch(e){}
})();
