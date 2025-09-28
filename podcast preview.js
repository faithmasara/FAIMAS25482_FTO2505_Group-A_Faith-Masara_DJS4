// <podcast-preview> — optional Web Component (not required by the React path)
// Shadow DOM + custom event; styles encapsulated.
const tpl = document.createElement('template');
tpl.innerHTML = `
  <style>
    :host{display:block}
    .card{background:#fff;border:1px solid #e5e7eb;border-radius:12px;padding:16px;box-shadow:0 1px 1px rgb(0 0 0 / .05), 0 6px 16px rgb(0 0 0 / .06)}
    .cover{width:100%;aspect-ratio:4/3;background:#cbd5e1;border-radius:8px;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:600}
    .title{margin-top:12px;font-size:1rem;font-weight:700;color:#111827}
    .meta{display:flex;align-items:center;gap:6px;margin-top:6px;font-size:.875rem;color:#4b5563}
    .tags{display:flex;flex-wrap:wrap;gap:6px;margin-top:6px}
    .pill{display:inline-flex;align-items:center;padding:2px 8px;border-radius:999px;border:1px solid #e5e7eb;background:#f3f4f6;font-size:.75rem;color:#1f2937}
    .updated{margin-top:10px;font-size:.875rem;color:#6b7280}
  </style>
  <article class="card" tabindex="0" role="button" aria-label="Open podcast details">
    <div class="cover">Podcast Cover</div>
    <h3 class="title">Podcast Title</h3>
    <div class="meta"><span id="s">0 seasons</span></div>
    <div class="tags" id="g"></div>
    <p class="updated" id="u">Updated —</p>
  </article>
`;
class PodcastPreview extends HTMLElement{
  static get observedAttributes(){ return ['title','seasons','genres','updated','podcastid']; }
  constructor(){
    super();
    this.attachShadow({mode:'open'}).appendChild(tpl.content.cloneNode(true));
    const root=this.shadowRoot;
    root.querySelector('article').addEventListener('click', ()=> {
      this.dispatchEvent(new CustomEvent('podcast-preview:select',{bubbles:true,composed:true,detail:{id:this.getAttribute('podcastid')}}));
    });
    root.querySelector('article').addEventListener('keydown', e=>{
      if(e.key==='Enter'||e.key===' '){e.preventDefault();this.dispatchEvent(new CustomEvent('podcast-preview:select',{bubbles:true,composed:true,detail:{id:this.getAttribute('podcastid')}}));}
    });
  }
  attributeChangedCallback(){ this.render(); }
  render(){
    const r=this.shadowRoot;
    r.querySelector('.title').textContent = this.getAttribute('title') || 'Podcast Title';
    const n=Number(this.getAttribute('seasons')||0);
    r.getElementById('s').textContent = `${n} season${n===1?'':'s'}`;
    const tags=r.getElementById('g'); tags.innerHTML='';
    (this.getAttribute('genres')||'').split(',').filter(Boolean).forEach(g=>{
      const pill=document.createElement('span'); pill.className='pill'; pill.textContent=g.trim(); tags.appendChild(pill);
    });
    r.getElementById('u').textContent = this.getAttribute('updated') || 'Updated —';
  }
}
customElements.define('podcast-preview', PodcastPreview);
