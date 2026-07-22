/* ===== Home hero carousel (images / GIFs) ===== */
(function(){
  "use strict";
  function boot(){
    document.querySelectorAll("[data-carousel]").forEach(function(root){
      var track=root.querySelector(".carousel__track");
      var slides=Array.prototype.slice.call(root.querySelectorAll(".carousel__slide"));
      var dotsWrap=root.querySelector(".carousel__dots");
      if(!track||!slides.length) return;
      var i=0, n=slides.length, timer=null, delay=parseInt(root.getAttribute("data-interval"),10)||4500;

      // dots
      var dots=slides.map(function(_,k){
        var b=document.createElement("button");
        b.className="carousel__dot"+(k===0?" act":""); b.type="button";
        b.setAttribute("aria-label","Slide "+(k+1));
        b.addEventListener("click",function(){ go(k,true); });
        dotsWrap.appendChild(b); return b;
      });
      function render(){
        track.style.transform="translateX("+(-i*100)+"%)";
        dots.forEach(function(d,k){ d.classList.toggle("act",k===i); });
      }
      function go(k,user){ i=(k+n)%n; render(); if(user) restart(); }
      function next(){ go(i+1); }
      function prev(){ go(i-1); }
      function restart(){ stop(); start(); }
      function start(){ if(window.matchMedia("(prefers-reduced-motion:reduce)").matches) return; timer=setInterval(next,delay); }
      function stop(){ if(timer){ clearInterval(timer); timer=null; } }

      var pv=root.querySelector(".carousel__arrow--prev"), nx=root.querySelector(".carousel__arrow--next");
      pv&&pv.addEventListener("click",function(){ prev(); restart(); });
      nx&&nx.addEventListener("click",function(){ next(); restart(); });
      root.addEventListener("mouseenter",stop);
      root.addEventListener("mouseleave",start);
      document.addEventListener("visibilitychange",function(){ document.hidden?stop():start(); });

      // swipe
      var x0=null;
      root.addEventListener("touchstart",function(e){ x0=e.touches[0].clientX; stop(); },{passive:true});
      root.addEventListener("touchend",function(e){
        if(x0===null) return; var dx=e.changedTouches[0].clientX-x0;
        if(Math.abs(dx)>40){ dx<0?next():prev(); }
        x0=null; start();
      },{passive:true});

      render(); start();
    });
  }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",boot); else boot();
})();
