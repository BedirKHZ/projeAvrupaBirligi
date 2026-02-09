const questions = [
  {key:'age', q:'Yaş aralığın nedir?', type:'radio', options:['18 yaş altı','18–24','25–34','35–44','45+']},
  {key:'relation', q:'Gazetecilikle ilişkin nedir?', type:'radio', options:['Merak ediyorum','Öğrenciyim','Aktif içerik üretiyorum','Gazeteci','Diğer']},
  {key:'areas', q:'Seni en çok hangi alanlar ilgilendiriyor?', type:'checkbox', options:['Haber','Spor','Magazin','Araştırmacı gazetecilik','Kültür & Sanat','Teknoloji','Ekonomi','Yerel haber']},
  {key:'purpose', q:'Amacın nedir?', type:'radio', options:['Profesyonel gazetecilik yapmak','Sosyal medya','Bilgi edinmek','Proje/araştırma için']},
  {key:'skills', q:'Dijital araçlar ve teknik beceriler seviyen nedir?', type:'radio', options:['Hiç','Biraz','İyi']},
  {key:'skills_want', q:'Hangi becerileri geliştirmek istersin?', type:'checkbox', options:['Haber yazımı','Kaynak doğrulama','Başlık–spot','Görsel/Video içerik','Veri gazeteciliği','Sosyal medya haberciliği','Etik & doğruluk','Araştırma teknikleri']},
  {key:'time', q:'Ne kadar zaman ayırabilirsin?', type:'radio', options:['Günde 15–30 dk','Haftada birkaç saat','Haftada 10+ saat','Proje bazlı']},
  {key:'format', q:'Tercih ettiğin öğrenme formatı nedir?', type:'checkbox', options:['Kısa rehberler','Adım adım yol haritası','Pratik görevler','Video ders','Canlı atölye','Mentorluk']},
  {key:'platforms', q:'Hangi platformlarda yayınlamayı düşünüyorsun?', type:'checkbox', options:['Kişisel web/blog','X (Twitter)','Instagram','Facebook','YouTube','Podcast']},
  {key:'example', q:'Daha önce yayınladığın bir örnek var mı? Varsa link paylaş', type:'text'},
  {key:'goal', q:'Hedefin veya kısa vadeli bir hedef tarih var mı?', type:'text'},
  {key:'worry', q:'Yayın yaparken en çok hangi konuda endişen var?', type:'text'},
  {key:'languages', q:'Hangi dilleri rahat kullanıyorsun?', type:'checkbox', options:['Türkçe','İngilizce','Diğer']},
  {key:'consent', q:'Gizlilik ve kullanım onayı', type:'radio', options:['Evet','Hayır']},
  {key:'about', q:'İsteğe bağlı: Bize kendini birkaç cümleyle tanıtır mısın?', type:'textarea'}
];

function el(id){return document.getElementById(id)}

// Form flow
if(el('chat')){
  const chat = el('chat');
  const controls = el('controls');
  let i = 0;
  const answers = {};

  function renderQuestion(){
    chat.innerHTML = '';
    const q = questions[i];
    const div = document.createElement('div'); div.className='question';
    const h = document.createElement('div'); h.textContent = q.q; div.appendChild(h);

    if(q.type==='radio' || q.type==='checkbox'){
      q.options.forEach(opt=>{
        const label = document.createElement('label'); label.className='answer';
        const input = document.createElement('input');
        input.type = q.type; input.name = q.key; input.value = opt;
        label.appendChild(input); label.append(' ' + opt);
        div.appendChild(label);
      });
    } else if(q.type==='text' || q.type==='textarea'){
      const input = q.type==='text' ? document.createElement('input') : document.createElement('textarea');
      input.name = q.key; input.style.width='100%';
      div.appendChild(input);
    }

    const next = document.createElement('div'); next.className='controls';
    const btn = document.createElement('button'); btn.textContent = i<questions.length-1 ? 'İleri' : 'Tamamla';
    btn.onclick = ()=>{
      // collect
      if(q.type==='radio'){
        const sel = div.querySelector('input[type=radio]:checked');
        answers[q.key] = sel ? sel.value : null;
      } else if(q.type==='checkbox'){
        answers[q.key] = Array.from(div.querySelectorAll('input[type=checkbox]:checked')).map(n=>n.value);
      } else if(q.type==='text' || q.type==='textarea'){
        answers[q.key] = div.querySelector('input,textarea').value || null;
      }
      i++;
      if(i<questions.length) renderQuestion(); else finish();
    };
    next.appendChild(btn);
    chat.appendChild(div); chat.appendChild(next);
  }

  function finish(){
    localStorage.setItem('ai_gazetecilik_answers', JSON.stringify(answers));
    window.location = 'result.html';
  }

  renderQuestion();
}

// Result generation (client-side mock roadmap)
if(el('roadmap')){
  const data = JSON.parse(localStorage.getItem('ai_gazetecilik_answers')||'{}');
  const container = el('roadmap');
  function stage(title, items){
    const s = document.createElement('section');
    const h = document.createElement('h3'); h.textContent = title; s.appendChild(h);
    const ul = document.createElement('ul');
    items.forEach(it=>{ const li = document.createElement('li'); li.textContent = it; ul.appendChild(li)});
    s.appendChild(ul); container.appendChild(s);
  }

  // basic personalization
  const skillLevel = (data.skills==='İyi') ? 'İleri' : (data.skills==='Biraz') ? 'Orta' : 'Başlangıç';
  stage('1. Aşama – Temel Bilgiler', ['Gazeteciliğin temel ilkeleri','5N1K','Tarafsızlık & doğrulama']);
  stage('2. Aşama – Dijital Gazetecilik', ['Sosyal medya haberciliği','Kaynak doğrulama','Yanlış bilgi ayırt etme']);
  stage('3. Aşama – Uygulama', ['Örnek haber yazımı','Başlık–spot–metin ilişkisi','Etik ihlal örnekleri']);
  stage('4. Aşama – Gelişim', ['Portföy oluşturma','Staj & gönüllülük','Sürekli öğrenme']);

  const note = document.createElement('p'); note.className='muted small'; note.textContent = `Kişiselleştirme: seviye ${skillLevel}. Daha iyi öneriler için profili güncelle.`; container.appendChild(note);
}
