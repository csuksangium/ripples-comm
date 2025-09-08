/* window.initPinFade — UMD, no imports */
(function () {
  function waitForFonts(){ return (document.fonts && document.fonts.ready) ? document.fonts.ready.catch(function(){}) : Promise.resolve(); }
  function waitForImages(root){ root = root || document; var imgs = Array.prototype.slice.call(root.images||[]); if(!imgs.length) return Promise.resolve();
    return Promise.all(imgs.map(function(img){ return img.decode ? img.decode().catch(function(){}) : Promise.resolve(); }));
  }
  function waitForVideoMetadata(root){ root = root || document; var vids = Array.prototype.slice.call(root.querySelectorAll('video')||[]);
    return Promise.all(vids.map(function(v){ return new Promise(function(res){ if(v.readyState>=1) return res();
      function done(){ v.removeEventListener('loadedmetadata', done); res(); }
      v.addEventListener('loadedmetadata', done, {once:true}); setTimeout(done, 1200); });
    }));
  }
  function waitForStableLayout(el, frames, timeout){ frames=frames||3; timeout=timeout||1500;
    return new Promise(function(resolve){ var last=0, stable=0, tId;
      function tick(){ var h = el.getBoundingClientRect().height;
        if (Math.abs(h-last)<0.5) stable++; else { stable=0; last=h; }
        if (stable>=frames){ clearTimeout(tId); return resolve(); }
        requestAnimationFrame(tick);
      }
      tId = setTimeout(resolve, timeout); requestAnimationFrame(tick);
    });
  }

  window.initPinFade = function initPinFade(){
    var gsap = window.gsap, ScrollTrigger = window.ScrollTrigger;
    if (!gsap || !ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);
    if (ScrollTrigger.normalizeScroll) ScrollTrigger.normalizeScroll(true);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var section = document.querySelector('#horizontal-section');
    var wrapper  = section && section.querySelector('.wrapper');
    var items    = wrapper && wrapper.querySelectorAll('.item');
    if (!section || !wrapper || !items || !items.length) return;

    // kill prior ST on re-inits (Webflow IX page transitions)
    ScrollTrigger.getAll().forEach(function(st){ st.kill(); });

    Promise.resolve()
      .then(function(){ return waitForFonts(); })
      .then(function(){ return waitForImages(section); })
      .then(function(){ return waitForVideoMetadata(section); })
      .then(function(){ return waitForStableLayout(section); })
      .then(function(){
        Array.prototype.forEach.call(items, function(el){ gsap.set(el, { clearProps:'all' }); });
        Array.prototype.forEach.call(items, function(el, i){
          gsap.set(el, i===0 ? {opacity:1, yPercent:0} : {opacity:0, yPercent:100});
        });

        var pinType = ScrollTrigger.isTouch ? 'transform' : 'fixed';

        var tl = gsap.timeline({
          defaults: { ease:'power1.inOut' }, // (removed force3D warning)
          scrollTrigger: {
            trigger: section,
            pin: true,
            pinType: pinType,
            pinReparent: true,
            pinSpacing: true,
            anticipatePin: 1,
            start: 'top top',
            end: function(){ return '+='+(items.length*150+100)+'%'; },
            scrub: 2,
            fastScrollEnd: true,
            invalidateOnRefresh: true
            // ,markers: true
          }
        });

        Array.prototype.forEach.call(items, function(el, i){
          if (i !== items.length - 1) {
            tl.to({}, { duration: 0.7 })
              .to(el,           { scale:0.95, opacity:0, duration:0.8 })
              .to(items[i + 1], { yPercent:0, opacity:1, duration:0.8 }, '<');
          } else {
            tl.to({}, { duration: 1.5 })
              .to(el, { scale:0.95, opacity:0, duration:0.8 });
          }
        });

        ScrollTrigger.refresh();
        setTimeout(function(){ ScrollTrigger.refresh(); }, 100);
        requestAnimationFrame(function(){ ScrollTrigger.refresh(true); });
      });
  };
})();
