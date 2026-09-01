(function(){
  "use strict";
  /* CALCKOSH_TRAFFIC_V7 */
  const input=document.getElementById("toolSearch");
  const clear=document.getElementById("clearSearch");
  const cards=[...document.querySelectorAll("[data-tool]")];
  const chips=[...document.querySelectorAll("[data-filter]")];
  const count=document.getElementById("visibleCount");
  const empty=document.getElementById("emptyTools");
  if(!input||!cards.length)return;

  let category="all";
  const normalize=s=>(s||"").toLowerCase().normalize("NFKD");

  function apply(){
    const q=normalize(input.value.trim());
    let visible=0;
    cards.forEach(card=>{
      const hay=normalize(card.dataset.search+" "+card.textContent);
      const cat=hay.includes(category);
      const text=!q||q.split(/\s+/).every(word=>hay.includes(word));
      const show=(category==="all"||cat)&&text;
      card.hidden=!show;
      if(show)visible++;
    });
    if(count)count.textContent=visible;
    if(empty)empty.hidden=visible!==0;
    if(clear)clear.hidden=!input.value;
    if(window.CalcKoshGrowth?.track && q.length>=3){
      window.CalcKoshGrowth.track("finder_used",{query_length:q.length,visible});
    }
  }

  input.addEventListener("input",apply);
  clear?.addEventListener("click",()=>{input.value="";input.focus();apply()});
  chips.forEach(chip=>chip.addEventListener("click",()=>{
    category=normalize(chip.dataset.filter);
    chips.forEach(x=>x.classList.toggle("active",x===chip));
    apply();
    window.CalcKoshGrowth?.track?.("finder_filter",{category});
  }));
  apply();
})();
