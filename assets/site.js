(function(){
  "use strict";
  const money=n=>new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(Number(n)||0);
  const number=(n,d=2)=>new Intl.NumberFormat("en-IN",{maximumFractionDigits:d}).format(Number(n)||0);
  const months=m=>{m=Math.max(0,Math.round(+m||0));const y=Math.floor(m/12),mo=m%12;return[y?`${y} yr${y===1?"":"s"}`:"",mo?`${mo} mo${mo===1?"":"s"}`:""].filter(Boolean).join(" ")||"0 months"};
  const futureMonth=m=>{const d=new Date();d.setMonth(d.getMonth()+Math.max(0,Math.round(+m||0)));return d.toLocaleDateString("en-IN",{month:"short",year:"numeric"})};
  window.UI={money,number,months,futureMonth};
  document.querySelectorAll("[data-year]").forEach(x=>x.textContent=new Date().getFullYear());

  /* CALCKOSH_GROWTH_V5 */
  const track=(event,detail={})=>{
    const payload={event,calculator:document.body?.dataset?.ckCalculator||null,path:location.pathname,...detail};
    document.dispatchEvent(new CustomEvent("calckosh:analytics",{detail:payload}));
    if(Array.isArray(window.dataLayer)) window.dataLayer.push({event:`calckosh_${event}`,...payload});
  };

  const calcInputs=()=>[...document.querySelectorAll("body[data-ck-calculator] input[id], body[data-ck-calculator] select[id]")].filter(el=>!el.disabled&&el.type!=="button"&&el.type!=="submit");

  const hydrateFromUrl=()=>{
    if(!document.body?.dataset?.ckCalculator)return;
    const q=new URLSearchParams(location.search);
    let changed=false;
    calcInputs().forEach(el=>{if(q.has(el.id)){const v=q.get(el.id);if(v!==null&&v!==""){el.value=v;changed=true}}});
    if(changed)track("scenario_opened",{source:"shared_url"});
  };

  const scenarioUrl=()=>{
    const u=new URL(location.href);u.search="";u.hash="";
    calcInputs().forEach(el=>{const v=String(el.value??"").trim();if(v!=="")u.searchParams.set(el.id,v)});
    return u.toString();
  };

  const resultSummary=()=>{
    const title=document.querySelector("h1")?.textContent?.trim()||document.title;
    const lines=[`${title} - CalcKosh`];
    document.querySelectorAll(".metric").forEach(m=>{const k=m.querySelector(".k")?.textContent?.trim(),v=m.querySelector(".v")?.textContent?.trim();if(k&&v&&v!=="—")lines.push(`${k}: ${v}`)});
    lines.push(`Scenario: ${scenarioUrl()}`);
    return lines.join("\n");
  };

  const copyText=async text=>{
    if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(text);return}
    const t=document.createElement("textarea");t.value=text;t.style.position="fixed";t.style.opacity="0";document.body.appendChild(t);t.select();document.execCommand("copy");t.remove();
  };

  const flash=(button,text)=>{if(!button)return;const old=button.textContent;button.textContent=text;button.disabled=true;setTimeout(()=>{button.textContent=old;button.disabled=false},1200)};

  const applyPreset=button=>{
    let values={};try{values=JSON.parse(button.dataset.ckPreset||"{}")}catch(_){return}
    Object.entries(values).forEach(([id,value])=>{const el=document.getElementById(id);if(!el)return;el.value=value;el.dispatchEvent(new Event("input",{bubbles:true}))});
    track("preset_used",{preset:button.textContent.trim()});
  };

  const handleAction=async button=>{
    const action=button.dataset.ckAction;
    if(action==="copy"){try{await copyText(resultSummary());flash(button,"Copied");track("result_copied")}catch(_){flash(button,"Copy failed")}return}
    if(action==="share"){
      const data={title:document.querySelector("h1")?.textContent?.trim()||"CalcKosh",text:"My CalcKosh calculator scenario",url:scenarioUrl()};
      if(navigator.share){try{await navigator.share(data);track("scenario_shared",{method:"native"});return}catch(err){if(err?.name==="AbortError")return}}
      try{await copyText(data.url);flash(button,"Link copied");track("scenario_shared",{method:"clipboard"})}catch(_){flash(button,"Share failed")}
      return
    }
    if(action==="print"){track("print_opened");window.print()}
  };

  hydrateFromUrl();
  document.querySelectorAll("[data-ck-preset]").forEach(btn=>btn.addEventListener("click",()=>applyPreset(btn)));
  document.querySelectorAll("[data-ck-action]").forEach(btn=>btn.addEventListener("click",()=>handleAction(btn)));
  document.querySelectorAll("button#calc").forEach(btn=>btn.addEventListener("click",()=>track("calculate_clicked")));
  window.CalcKoshGrowth={track,scenarioUrl,resultSummary};
})();
