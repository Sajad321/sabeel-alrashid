/* =========================================================
   SABEEL AL-RASHID — site shell, i18n toggle, interactions
   ========================================================= */
(function(){
  "use strict";

  const NAV = [
    {href:"index.html",     ar:"الرئيسية",  en:"Home"},
    {href:"about.html",     ar:"من نحن",    en:"About Us"},
    {href:"brands.html",    ar:"علاماتنا",  en:"Our Brands"},
    {href:"franchise.html", ar:"الامتياز",  en:"Franchise"},
    {href:"careers.html",   ar:"الوظائف",   en:"Careers"},
    {href:"news.html",      ar:"الأخبار",   en:"News & Media"},
    {href:"contact.html",   ar:"تواصل معنا",en:"Contact"}
  ];

  const UTILITY = [
    {href:"franchise.html", ar:"المستثمرون",   en:"Investors"},
    {href:"contact.html",   ar:"الموردون",     en:"Suppliers"},
    {href:"news.html",      ar:"غرفة الأخبار", en:"Newsroom"},
    {href:"careers.html",   ar:"الوظائف",      en:"Careers"},
    {href:"contact.html",   ar:"حدّد موقع فرع", en:"Find a Branch"}
  ];

  const BRANDS = [
    {ar:"سوبر تشيكن",   en:"Super Chicken"},
    {ar:"الركن الشرقي", en:"Alrukn Alsharqi"}
  ];

  const T = {
    cta:      {ar:"كن شريكاً", en:"Partner With Us"},
    tagline:  {ar:"للتجارة العامة وإدارة المطاعم وإنتاج وتعبئة المواد الغذائية", en:"General Trade · Restaurant Management · Food Production"},
    brandsT:  {ar:"علاماتنا", en:"Our Brands"},
    soon:     {ar:"قريباً", en:"Coming soon"},
    loc:      {ar:"العراق", en:"Iraq"},
    fAddr:    {ar:"بغداد، جمهورية العراق — برج سبيل الراشد، المنصور", en:"Baghdad, Republic of Iraq — Sabeel Al-Rashid Tower, Mansour"},
    fRights:  {ar:"© 2026 شركة سبيل الراشد. جميع الحقوق محفوظة.", en:"© 2026 Sabeel Al-Rashid Co. All rights reserved."},
    back:     {ar:"العودة للأعلى", en:"Back to top"}
  };

  const FCOLS = [
    { h:{ar:"الشركة", en:"Company"}, links:[
      {href:"about.html",    ar:"من نحن",     en:"About Us"},
      {href:"about.html",    ar:"قيادتنا",    en:"Leadership"},
      {href:"brands.html",   ar:"علاماتنا",   en:"Our Brands"},
      {href:"index.html",    ar:"الاستدامة",  en:"Sustainability"} ]},
    { h:{ar:"المستثمرون والشركاء", en:"Investors & Partners"}, links:[
      {href:"franchise.html", ar:"فرص الاستثمار", en:"Investment"},
      {href:"franchise.html", ar:"طلب امتياز",    en:"Franchise Request"},
      {href:"contact.html",   ar:"الموردون",      en:"Suppliers"},
      {href:"contact.html",   ar:"علاقات المستثمرين", en:"Investor Relations"} ]},
    { h:{ar:"غرفة الأخبار", en:"Newsroom"}, links:[
      {href:"news.html", ar:"الأخبار",         en:"News"},
      {href:"news.html", ar:"البيانات الصحفية", en:"Press Releases"},
      {href:"news.html", ar:"الفعاليات",        en:"Events"},
      {href:"news.html", ar:"مكتبة الوسائط",    en:"Media Library"} ]},
    { h:{ar:"الوظائف", en:"Careers"}, links:[
      {href:"careers.html",       ar:"الوظائف الشاغرة", en:"Open Positions"},
      {href:"careers.html",       ar:"ثقافتنا",         en:"Our Culture"},
      {href:"careers.html#apply", ar:"قدّم الآن",        en:"Apply Now"} ]}
  ];

  const R = (typeof window!=="undefined" && window.__resources) || {};
  const LOGO    = R.logoGold   || "assets/logos/sabeel-gold.png";
  const LOGO_AR = R.logoGoldAr || "assets/logos/sabeel-gold-ar.svg";
  const LOGO_EN = R.logoGoldEn || "assets/logos/sabeel-gold-en.svg";

  const page = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  const isHomeB = page === "home-b.html";
  const activeHref = isHomeB ? "index.html" : page;

  /* ---------- build header ---------- */
  function buildHeader(){
    const links = NAV.map(n=>{
      const act = n.href===activeHref ? " is-active":"";
      return `<a class="nav__link${act}" href="${n.href}" data-en="${n.en}">${n.ar}</a>`;
    }).join("");
    const util = UTILITY.map(n=>`<a class="topbar__link" href="${n.href}" data-en="${n.en}">${n.ar}</a>`).join("");
    const mlinks = NAV.map(n=>{
      const act = n.href===activeHref ? " is-active":"";
      return `<a class="${act?'is-active':''}" href="${n.href}" data-en="${n.en}">${n.ar}</a>`;
    }).join("");
    const mutil = UTILITY.map(n=>`<a href="${n.href}" data-en="${n.en}">${n.ar}</a>`).join("");

    const html = `
    <header class="site-header" id="siteHeader">
      <div class="container nav">
        <a class="nav__logo" href="index.html" aria-label="Sabeel Al-Rashid">
          <img src="${LOGO}" alt="Sabeel Al-Rashid" id="navLogo">
        </a>
        <nav class="nav__links">${links}</nav>
        <div class="nav__actions">
          <button class="lang-toggle" id="langToggle" type="button" aria-label="Switch language"><span data-en="عربي">EN</span></button>
          <a class="btn btn--gold nav__cta" href="franchise.html" data-en="${T.cta.en}">${T.cta.ar}</a>
          <button class="nav__burger" id="burger" type="button" aria-label="Menu"><span></span><span></span><span></span></button>
        </div>
      </div>
    </header>
    <div class="mobile-menu" id="mobileMenu">
      <div class="container" style="padding-inline:0">
        <div class="mobile-menu__top">
          <a class="nav__logo" href="index.html"><img src="${LOGO}" alt="Sabeel Al-Rashid" id="navLogoM" style="height:46px"></a>
          <button class="mobile-menu__close" id="menuClose" aria-label="Close">&times;</button>
        </div>
        ${mlinks}
        <div class="mobile-menu__actions">
          <a class="btn btn--gold" href="franchise.html" data-en="${T.cta.en}">${T.cta.ar}</a>
          <button class="lang-toggle" id="langToggleM" type="button" aria-label="Switch language"><span data-en="عربي">EN</span></button>
        </div>
      </div>
    </div>`;
    const host = document.getElementById("site-header");
    if(host) host.outerHTML = html; else document.body.insertAdjacentHTML("afterbegin", html);
  }

  /* ---------- build footer (Yum-style) ---------- */
  function buildFooter(){
    const social = ["in","X","f","◎"].map(s=>`<a href="#" aria-label="social">${s}</a>`).join("");
    const brandRow = BRANDS.map(b=>`<a class="footer__brandchip" href="brands.html" data-en="${b.en}">${b.ar}</a>`).join("")
      + `<span class="footer__brandchip footer__brandchip--soon" data-en="${T.soon.en}">${T.soon.ar}</span>`;
    const cols = FCOLS.map(c=>`
      <div class="footer__col">
        <h4 data-en="${c.h.en}">${c.h.ar}</h4>
        <ul>${c.links.map(l=>`<li><a href="${l.href}" data-en="${l.en}">${l.ar}</a></li>`).join("")}</ul>
      </div>`).join("");

    const html = `
    <footer class="site-footer">
      <div class="container footer__main">
        <div class="footer__grid">
          <div class="footer__brand">
            <img src="${LOGO}" alt="Sabeel Al-Rashid" id="footLogo">
            <p data-en="${T.tagline.en}">${T.tagline.ar}</p>
            <div class="footer__social">${social}</div>
          </div>
          ${cols}
          <div class="footer__col footer__col--contact">
            <h4 data-en="Contact">تواصل</h4>
            <ul>
              <li><a href="contact.html" data-en="${T.fAddr.en}">${T.fAddr.ar}</a></li>
              <li><a href="tel:+9647700000000" dir="ltr" style="display:inline-block">+964 770 000 0000</a></li>
              <li><a href="mailto:info@sabeelalrashid.com">info@sabeelalrashid.com</a></li>
              <li><a href="mailto:careers@sabeelalrashid.com">careers@sabeelalrashid.com</a></li>
            </ul>
          </div>
        </div>
        <div class="footer__bottom">
          <span data-en="${T.fRights.en}">${T.fRights.ar}</span>
          <span class="footer__legal">
            <a href="#" data-en="Privacy Policy">سياسة الخصوصية</a>
            <a href="#" data-en="Terms">الشروط والأحكام</a>
            <a href="#" data-en="Cookies">ملفات الارتباط</a>
            <a href="#" data-en="Accessibility">إمكانية الوصول</a>
          </span>
          <button class="footer__totop" type="button" id="toTop"><span data-en="${T.back.en}">${T.back.ar}</span> ↑</button>
        </div>
      </div>
    </footer>`;
    const host = document.getElementById("site-footer");
    if(host) host.outerHTML = html; else document.body.insertAdjacentHTML("beforeend", html);
  }

  /* ---------- i18n ---------- */
  const LANG_KEY="sabeel_lang";
  function captureAr(){
    document.querySelectorAll("[data-en]").forEach(el=>{
      if(el.dataset.ar===undefined) el.dataset.ar = el.innerHTML;
    });
    document.querySelectorAll("[data-ph-en]").forEach(el=>{
      if(el.dataset.phAr===undefined) el.dataset.phAr = el.getAttribute("placeholder")||"";
    });
    document.querySelectorAll("[data-label][data-label-en]").forEach(el=>{
      if(el.dataset.labelAr===undefined) el.dataset.labelAr = el.getAttribute("data-label")||"";
    });
  }
  function applyLang(lang){
    const en = lang==="en";
    document.documentElement.lang = en?"en":"ar";
    document.documentElement.dir  = en?"ltr":"rtl";
    document.querySelectorAll("[data-en]").forEach(el=>{
      el.innerHTML = en ? el.dataset.en : (el.dataset.ar ?? el.innerHTML);
    });
    document.querySelectorAll("[data-ph-en]").forEach(el=>{
      el.setAttribute("placeholder", en ? el.dataset.phEn : (el.dataset.phAr ?? ""));
    });
    document.querySelectorAll("[data-label][data-label-en]").forEach(el=>{
      el.setAttribute("data-label", en ? el.dataset.labelEn : (el.dataset.labelAr ?? ""));
    });
    const fl = document.getElementById("footLogo");
    if(fl) fl.src = LOGO;
    try{localStorage.setItem(LANG_KEY,lang);}catch(e){}
  }

  /* ---------- interactions ---------- */
  function wire(){
    const header=document.getElementById("siteHeader");
    const onScroll=()=>{header && header.classList.toggle("is-scrolled", window.scrollY>8);};
    window.addEventListener("scroll",onScroll,{passive:true}); onScroll();

    document.querySelectorAll("#langToggle,#langToggleM").forEach(lt=>{
      lt.addEventListener("click",()=>{
        applyLang(document.documentElement.lang==="en"?"ar":"en");
      });
    });

    const burger=document.getElementById("burger"),
          menu=document.getElementById("mobileMenu"),
          close=document.getElementById("menuClose");
    burger && burger.addEventListener("click",()=>menu.classList.add("is-open"));
    close && close.addEventListener("click",()=>menu.classList.remove("is-open"));
    menu && menu.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>menu.classList.remove("is-open")));

    const io=new IntersectionObserver((es)=>{
      es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("is-in");io.unobserve(e.target);}});
    },{threshold:.12,rootMargin:"0px 0px -8% 0px"});
    document.querySelectorAll(".reveal").forEach(el=>io.observe(el));

    // count-up
    const cu=new IntersectionObserver((es)=>{
      es.forEach(e=>{
        if(!e.isIntersecting) return;
        const el=e.target, to=parseFloat(el.dataset.count), suf=el.dataset.suffix||"";
        const dur=2800, t0=performance.now();
        const fmt=(v)=>v.toLocaleString("en-US")+suf;
        const tick=(t)=>{const p=Math.min(1,(t-t0)/dur);const v=Math.floor((to)*(1-Math.pow(1-p,3)));el.textContent=fmt(v);if(p<1)requestAnimationFrame(tick);else el.textContent=fmt(to);};
        requestAnimationFrame(tick); cu.unobserve(el);
      });
    },{threshold:.5});
    document.querySelectorAll("[data-count]").forEach(el=>cu.observe(el));

    // accordions (careers positions)
    document.querySelectorAll(".position__head").forEach(btn=>{
      btn.addEventListener("click",()=>{
        const item=btn.closest(".position");
        const body=item.querySelector(".position__body");
        const open=item.classList.toggle("is-open");
        body.style.maxHeight = open ? body.scrollHeight+"px" : "0px";
      });
    });

    // filter chips (news) — visual active state
    document.querySelectorAll("[data-filter-group]").forEach(group=>{
      group.querySelectorAll(".filter").forEach(f=>{
        f.addEventListener("click",()=>{
          group.querySelectorAll(".filter").forEach(x=>x.classList.remove("is-active"));
          f.classList.add("is-active");
          const cat=f.dataset.cat;
          document.querySelectorAll("[data-cat-item]").forEach(item=>{
            item.style.display = (!cat||cat==="all"||item.dataset.catItem===cat) ? "" : "none";
          });
        });
      });
    });

    // back-to-top
    const tt=document.getElementById("toTop");
    tt && tt.addEventListener("click",()=>window.scrollTo({top:0,behavior:"smooth"}));

    // careers “apply” buttons — preselect role + jump to form
    document.querySelectorAll("[data-apply-role]").forEach(btn=>{
      btn.addEventListener("click",()=>{
        const role=btn.getAttribute("data-apply-role");
        const sel=document.getElementById("applyRole");
        if(sel) Array.from(sel.options).forEach(o=>{ if(o.dataset.en===role) sel.value=o.value; });
      });
    });

    // forms that send as email (jobs / contact)
    function labelFor(inp){
      const field=inp.closest(".field"), lab=field&&field.querySelector("label");
      return lab ? lab.textContent.replace("*","").trim() : (inp.name||inp.type);
    }
    document.querySelectorAll("form[data-mailto]").forEach(f=>{
      f.addEventListener("submit",e=>{
        e.preventDefault();
        const to=f.getAttribute("data-mailto");
        const subjBase=f.getAttribute("data-subject")||"Website enquiry";
        const roleSel=f.querySelector("#applyRole");
        const subj=roleSel ? subjBase+" — "+(roleSel.options[roleSel.selectedIndex].text) : subjBase;
        let body="";
        f.querySelectorAll("input,select,textarea").forEach(inp=>{
          if(inp.type==="file"){ if(inp.files&&inp.files.length) body+=labelFor(inp)+": "+inp.files[0].name+"\n"; return; }
          const val=(inp.value||"").trim(); if(val) body+=labelFor(inp)+": "+val+"\n";
        });
        const en=document.documentElement.lang==="en";
        body+="\n"+(en?"— Sent from sabeelalrashid.com":"— أُرسلت من موقع سبيل الراشد");
        window.location.href="mailto:"+to+"?subject="+encodeURIComponent(subj)+"&body="+encodeURIComponent(body);
      });
    });
  }

  function init(){
    document.documentElement.classList.add("js");
    buildHeader();
    buildFooter();
    captureAr();
    let saved="ar"; try{saved=localStorage.getItem(LANG_KEY)||"ar";}catch(e){}
    applyLang(saved);
    wire();
  }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",init); else init();
})();
