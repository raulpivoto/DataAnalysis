const Q=(e,o,a,c,f)=>({e,o,a,c,f});
const MODS=[];
const L="ABCDE";
const $=s=>document.querySelector(s);
const store={get(k){try{return JSON.parse(localStorage.getItem("tp-"+k))}catch(e){return null}},set(k,v){try{localStorage.setItem("tp-"+k,JSON.stringify(v))}catch(e){}}};
const mods=()=>MODS.slice().sort((a,b)=>a.n-b.n);

function quiz(host,qs,key){
  let done=false;
  host.innerHTML=`<div class="qs"></div><p><button class="btn" data-a="ok">Corrigir</button> <button class="btn sec" data-a="re">Refazer</button></p><div class="res" aria-live="polite"></div>`;
  const box=host.querySelector(".qs"),res=host.querySelector(".res");
  function draw(){
    done=false;res.textContent="";
    box.innerHTML=qs.map((q,i)=>`<div class="q card"><p class="en">Questão ${i+1}${q.m?` <span class="tag">${q.m}</span>`:""}. ${q.e}</p>`+
      q.o.map((t,j)=>`<label class="opt"><input type="radio" name="${key}q${i}" value="${j}"><span><b>(${L[j]})</b> ${t}</span></label>`).join("")+`<div class="fb"></div></div>`).join("");
  }
  box.addEventListener("change",e=>{if(done||e.target.type!=="radio")return;
    e.target.closest(".q").querySelectorAll(".opt").forEach(x=>x.classList.remove("sel"));e.target.closest(".opt").classList.add("sel")});
  host.addEventListener("click",e=>{
    const a=e.target.dataset.a;if(!a)return;
    if(a==="re")return draw();
    if(done)return;
    const marc=qs.map((q,i)=>{const s=box.querySelector(`input[name="${key}q${i}"]:checked`);return s?+s.value:-1});
    if(marc.includes(-1)&&!confirm("Há questões sem resposta. Corrigir mesmo assim?"))return;
    done=true;let ac=0;
    qs.forEach((q,i)=>{
      const b=box.children[i];
      b.querySelectorAll(".opt").forEach((o,j)=>{o.classList.remove("sel");o.querySelector("input").disabled=true;
        if(j===q.a)o.classList.add("right");else if(j===marc[i])o.classList.add("wrong")});
      if(marc[i]===q.a)ac++;
      b.querySelector(".fb").innerHTML=`<details open><summary>Gabarito comentado: ${L[q.a]}</summary>`+
        q.c.map((t,j)=>`<div class="cm"><b>(${L[j]}) ${j===q.a?"certa":"errada"}:</b> ${t}</div>`).join("")+
        (q.f?`<div class="cm"><b>Fonte:</b> ${q.f}</div>`:"")+`</details>`;
    });
    res.textContent=`Resultado: ${ac} de ${qs.length} (${Math.round(100*ac/qs.length)}%)`;
    const p=store.get("prog")||{};p[key]={ac,n:qs.length};store.set("prog",p);
  });
  draw();
}

const views={
  edital:()=>EDITAL,
  modulos(){
    const p=store.get("prog")||{};
    const card=m=>{const r=p["m"+m.n];
      return `<a class="mod" href="#m${m.n}"><b>${m.n}. ${m.t}</b><small>${m.edital}</small><br><span class="tag">${r?`última nota: ${r.ac}/${r.n}`:"não feito"}</span></a>`};
    return `<h2>Conteúdo do edital (Anexo IV)</h2><div class="grid">`+mods().filter(m=>!m.fora).map(card).join("")+`</div>
      <h2>Complementos fora do Anexo IV</h2><p class="src">Assuntos úteis para a atuação na área, mas que não constam por nome no edital da Ênfase 9. Estude depois do conteúdo oficial.</p><div class="grid">`+mods().filter(m=>m.fora).map(card).join("")+`</div>
      <p class="src">A ordem segue a dependência entre assuntos, não o peso na prova (o edital não informa pesos por assunto).</p>`;
  },
  modulo(n){
    const list=mods(),m=list.find(x=>x.n===n);if(!m)return "<p>Módulo não encontrado.</p>";
    const i=list.indexOf(m),prev=list[i-1],next=list[i+1];
    return `<p><a href="#modulos">← Módulos</a></p><h2>Módulo ${m.n}: ${m.t}</h2><p><span class="tag">${m.fora?"Complemento fora do Anexo IV":"Edital"}: ${m.edital}</span></p>`+
      (m.alerta?`<div class="alert">${m.alerta}</div>`:"")+
      `<div class="card"><h3>Introdução</h3><p>${m.intro}</p></div>
       <div class="card"><h3>Objetivos de aprendizagem</h3><ul>${m.obj.map(o=>`<li>${o}</li>`).join("")}</ul></div>`+
      m.secs.map(s=>`<div class="card"><h3>${s[0]}</h3>${s[1]}${s[2]?`<p class="src">Fonte: ${s[2]}</p>`:""}</div>`).join("")+
      `<h2>Mapa mental</h2><pre>${m.mapa}</pre><h2>Quiz do módulo <span class="tag">5 questões, padrão Cesgranrio (A a E)</span></h2>
       <div class="alert">Questões autorais e inéditas, não são de provas reais. O gabarito comentado aparece depois de corrigir.</div><div id="quizhost"></div>
       <p class="row"><span>${prev?`<a class="btn sec" href="#m${prev.n}">← ${prev.n}. ${prev.t}</a>`:""}</span><span>${next?`<a class="btn sec" href="#m${next.n}">${next.n}. ${next.t} →</a>`:""}</span></p>`;
  },
  simulado:()=>`<h2>Simulado</h2><div class="card"><p>Sorteia questões dos módulos. Escolha:</p>
     <p><button class="btn" data-sim="10">10 do edital</button> <button class="btn" data-sim="25">25 do edital</button> <button class="btn" data-sim="edital">Todas do edital</button> <button class="btn sec" data-sim="todas">Todas (com complementos)</button></p>
     <p class="src">Referência: a prova real tem 50 questões específicas e exige mínimo de 50% de acerto por fase (item 7.1.4.3 do edital).</p></div><div id="quizhost"></div>`,
  fontes(){
    const all=mods().map(m=>`<div class="card"><h3>Módulo ${m.n}: ${m.t}</h3><ul>`+
      [...new Set(m.secs.map(s=>s[2]).filter(Boolean))].map(f=>`<li>${f}</li>`).join("")+`</ul></div>`).join("");
    return `<h2>Fontes e pontos a conferir</h2><div class="alert">Nos módulos 4 e 5 e na parte de CIDE do módulo 6 a teoria foi conferida no texto oficial enviado. Nos demais (principalmente tributos, LC 123 e Incoterms) os números vêm de conhecimento prévio: <b>confira no texto vigente antes de decorar</b>.</div>`+all+
      `<div class="card"><h3>Situação das fontes</h3><ul><li><b>Lidas no texto oficial (enviado por você):</b> Lei 13.303/2016 (arts. 28 a 91), Lei 9.478/1997, Resolução ANP nº 881/2022, LC 147/2014, Lei 10.336/2001 e Lei 10.636/2002.</li><li><b>Não lidas (conhecimento prévio, conferir):</b> LC 123/2006 (arts. 42, 44 a 46 e 49, I a III), LC 214/2025, EC 132/2023, demais normas tributárias, Lei 12.846/2013, ISO 9001/14001/45001, Incoterms 2020 (ICC) e referências bibliográficas. O texto da LC 123 não foi enviado (enviei apenas a LC 147, que a altera).</li><li>O edital chama o ato 881/2022 de \"Portaria\", mas o documento com esse número é a <b>Resolução</b> ANP nº 881/2022. Confirme se é essa a norma pretendida.</li><li>O edital não traz pesos por assunto nem a profundidade de cada item.</li><li>Módulos 12 a 17 são complementos fora do Anexo IV.</li></ul></div>`;
  }
};

function route(){
  const h=(location.hash||"#edital").slice(1);
  let html,after;
  const mm=h.match(/^m(\d+)$/);
  if(mm){html=views.modulo(+mm[1]);after=()=>{const m=mods().find(x=>x.n===+mm[1]);if(m)quiz($("#quizhost"),m.q,"m"+m.n)}}
  else if(views[h]){html=views[h]();after=null}
  else{html=views.edital();after=null}
  $("main").innerHTML=html;
  document.querySelectorAll("nav a").forEach(a=>a.classList.toggle("on",a.getAttribute("href")==="#"+(mm?"modulos":h)));
  window.scrollTo(0,0);
  if(after)after();
  if(h==="simulado")$("main").onclick=e=>{const n=e.target.dataset.sim;if(!n)return;
    const pool=[];mods().filter(m=>n==="todas"||!m.fora).forEach(m=>m.q.forEach(q=>pool.push(Object.assign({m:"M"+m.n},q))));
    for(let i=pool.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]]}
    quiz($("#quizhost"),n==="todas"||n==="edital"?pool:pool.slice(0,+n),"sim");$("#quizhost").scrollIntoView()};
  else $("main").onclick=null;
}
addEventListener("hashchange",route);
addEventListener("DOMContentLoaded",route);
