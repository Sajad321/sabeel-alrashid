/* ===== Baghdad branch map — static local map image + our logo pins ===== */
(function(){
  "use strict";

  var SC_LOGO = "https://www.superchicken-iq.com/wp-content/uploads/2022/06/cropped-logo-2-270x270.png";
  var AR_LOGO = "assets/brands/alrukn-logo.png";
  var MAP_IMG = "assets/baghdad-map-crop.png";

  var SC = {ar:"سوبر تشيكن", en:"Super Chicken", logo:SC_LOGO, cls:"sc"};
  var AR = {ar:"الركن الشرقي", en:"Alrukn Alsharqi", logo:AR_LOGO, cls:"ar"};
  // xPct/yPct = position on the static map image (tuned to the labelled districts)
  var BR = [
    {brand:SC, side:{ar:"الكرخ",en:"Karkh"},   district:{ar:"الكاظمية",en:"Kadhimiya"},  lat:33.3790, lon:44.3370, xPct:35, yPct:25},
    {brand:AR, side:{ar:"الكرخ",en:"Karkh"},   district:{ar:"الحارثية",en:"Harthiya"},   lat:33.3180, lon:44.3710, xPct:40, yPct:45},
    {brand:SC, side:{ar:"الكرخ",en:"Karkh"},   district:{ar:"المنصور",en:"Mansour"},    lat:33.3120, lon:44.3570, xPct:29, yPct:52},
    {brand:SC, side:{ar:"الرصافة",en:"Rusafa"}, district:{ar:"الأعظمية",en:"Adhamiyah"},  lat:33.3650, lon:44.3680, xPct:53, yPct:28},
    {brand:AR, side:{ar:"الرصافة",en:"Rusafa"}, district:{ar:"زيونة",en:"Zayouna"},      lat:33.3450, lon:44.4700, xPct:64, yPct:50},
    {brand:SC, side:{ar:"الرصافة",en:"Rusafa"}, district:{ar:"الكرادة",en:"Karrada"},   lat:33.3080, lon:44.4080, xPct:50, yPct:60},
    {brand:AR, side:{ar:"الرصافة",en:"Rusafa"}, district:{ar:"الكرادة الشرقية",en:"East Karrada"}, lat:33.3010, lon:44.4220, xPct:58, yPct:66},
    {brand:SC, side:{ar:"الرصافة",en:"Rusafa"}, district:{ar:"الجادرية",en:"Al-Jadriya"}, lat:33.2790, lon:44.3880, xPct:47, yPct:72}
  ];

  function mapsDir(b){ return "https://www.google.com/maps/dir/?api=1&destination="+b.lat+","+b.lon; }

  function boot(){
    var host=document.getElementById("baghdad-map");
    if(!host) return;
    var lang=function(){return document.documentElement.lang==="en"?"en":"ar";};
    var t=function(ar,en){return lang()==="en"?en:ar;};
    var state={act:-1};

    host.classList.add("bmap");
    host.innerHTML=
      '<div class="bmap__stage">'+
        '<img class="bmap__bg" src="'+MAP_IMG+'" alt="">'+
        '<div class="bmap__pins" id="bmap-pins"></div>'+
        '<div class="bmap__tag"><span class="bmap__dot"></span><span id="bmap-tagt"></span></div>'+
        '<a class="bmap__open" id="bmap-open" target="_blank" rel="noopener"><span id="bmap-opent"></span></a>'+
        '<div class="bmap__legend" id="bmap-legend"></div>'+
      '</div>'+
      '<div class="bpanel"><div class="bpanel__head">'+
        '<div class="bpanel__ey" id="bp-ey"></div>'+
        '<h3 class="bpanel__title" id="bp-title"></h3>'+
        '<p class="bpanel__sub" id="bp-sub"></p>'+
      '</div><div class="bpanel__list" id="bp-list"></div></div>';

    host.querySelector("#bmap-open").href="https://www.google.com/maps/search/?api=1&query=Baghdad+Iraq";

    var pinWrap=host.querySelector("#bmap-pins");
    BR.forEach(function(b,i){
      var p=document.createElement("button");
      p.type="button"; p.className="gpin gpin--"+b.brand.cls; p.setAttribute("data-i",i);
      p.style.left=b.xPct+"%"; p.style.top=b.yPct+"%";
      p.innerHTML='<span class="gpin__body"><img src="'+b.brand.logo+'" alt=""></span>';
      p.addEventListener("click",function(){ setActive(i,true); });
      p.addEventListener("mouseenter",function(){ setActive(i,false); });
      pinWrap.appendChild(p);
    });
    var pins=pinWrap.querySelectorAll(".gpin");

    function setActive(i,scroll){
      state.act=i;
      pins.forEach(function(p,j){ p.classList.toggle("act",j===i); });
      var ap=pinWrap.querySelector('.gpin[data-i="'+i+'"]'); if(ap) pinWrap.appendChild(ap);
      host.querySelectorAll(".bcard").forEach(function(c,j){
        c.classList.toggle("act",j===i);
        if(j===i&&scroll) c.scrollIntoView({block:"nearest"});
      });
    }

    function render(){
      host.querySelector("#bmap-tagt").textContent=t("بغداد · "+BR.length+" فروع","Baghdad · "+BR.length+" branches");
      host.querySelector("#bmap-opent").textContent=t("فتح في خرائط Google ↗","Open in Google Maps ↗");
      host.querySelector("#bmap-legend").innerHTML=
        '<span class="bmap__lg"><img src="'+SC_LOGO+'" alt="">Super Chicken</span>'+
        '<span class="bmap__lg"><img src="'+AR_LOGO+'" alt="">'+t("الركن الشرقي","Alrukn")+'</span>';
      host.querySelector("#bp-ey").textContent=t("شبكة فروعنا","Our network");
      host.querySelector("#bp-title").textContent=t("فروعنا في بغداد","Branches in Baghdad");
      host.querySelector("#bp-sub").textContent=t(BR.length+" فرعاً عبر الكرخ والرصافة — اضغط على علامة لعرض التفاصيل.",
        BR.length+" branches across Karkh & Rusafa — tap a pin for details.");
      var list=host.querySelector("#bp-list");
      list.innerHTML=BR.map(function(b,i){
        var isSC=b.brand.cls==="sc";
        return '<div class="bcard" data-i="'+i+'">'+
          '<div class="bcard__logo"><img src="'+b.brand.logo+'" alt=""></div>'+
          '<div class="bcard__main">'+
            '<div class="bcard__top"><span class="bcard__brand">'+t(b.brand.ar,b.brand.en)+'</span>'+
              '<span class="bcard__tag '+(isSC?"sc":"ar")+'">'+t(b.side.ar,b.side.en)+'</span></div>'+
            '<div class="bcard__city">⌖ '+t(b.district.ar,b.district.en)+'</div>'+
            '<div class="bcard__coord"><span>'+b.lat.toFixed(4)+'°N</span><span>'+b.lon.toFixed(4)+'°E</span></div>'+
            '<a class="bcard__btn bcard__btn--go" target="_blank" rel="noopener" href="'+mapsDir(b)+'">'+t("الاتجاهات","Directions")+' →</a>'+
          '</div>'+
        '</div>';
      }).join("");
      list.querySelectorAll(".bcard").forEach(function(c){
        var i=+c.getAttribute("data-i");
        c.addEventListener("mouseenter",function(){ setActive(i,false); });
        c.addEventListener("click",function(e){ if(!e.target.closest("a")) setActive(i,true); });
      });
    }
    render();
    var stage=host.querySelector(".bmap__stage");
    var panel=host.querySelector(".bpanel");
    function syncHeight(){
      if(window.matchMedia("(max-width:900px)").matches){ panel.style.height=""; return; }
      var h=stage.offsetHeight;
      if(h>0) panel.style.height=h+"px";
    }
    syncHeight();
    var bg=host.querySelector(".bmap__bg");
    if(bg){ if(bg.complete) syncHeight(); else bg.addEventListener("load",syncHeight); }
    setTimeout(syncHeight,300); setTimeout(syncHeight,1000);
    var rt; window.addEventListener("resize",function(){ clearTimeout(rt); rt=setTimeout(syncHeight,120); },{passive:true});
    new MutationObserver(render).observe(document.documentElement,{attributes:true,attributeFilter:["lang"]});
  }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",boot); else boot();
})();
