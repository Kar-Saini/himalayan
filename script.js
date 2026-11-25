(()=>{'use strict';const $=(s,r=document)=>r.querySelector(s);const $$=(s,r=document)=>[...r.querySelectorAll(s)];$$('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());const menu=$('.menu-toggle'),nav=$('.nav');if(menu&&nav)menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.textContent=open?'×':'☰'});
// Fixed Google Translate control. Translation is performed by Google's website translator.
const languageOptions=[
 {code:'en',flag:'🇬🇧',name:'English'}, {code:'hi',flag:'🇮🇳',name:'हिन्दी'},
 {code:'ar',flag:'🇸🇦',name:'العربية'}, {code:'ru',flag:'🇷🇺',name:'Русский'},
 {code:'fr',flag:'🇫🇷',name:'Français'}, {code:'es',flag:'🇪🇸',name:'Español'},
 {code:'bn',flag:'🇧🇩',name:'বাংলা'}, {code:'pt',flag:'🇧🇷',name:'Português'},
 {code:'de',flag:'🇩🇪',name:'Deutsch'}, {code:'zh-CN',flag:'🇨🇳',name:'中文'},
 {code:'tr',flag:'🇹🇷',name:'Türkçe'}, {code:'id',flag:'🇮🇩',name:'Bahasa Indonesia'}
];
const translateUI=document.createElement('div');translateUI.className='translate-fixed';translateUI.innerHTML=`
 <div id="google_translate_element" class="google-translate-hidden"></div>
 <button class="translate-trigger" type="button" aria-expanded="false" aria-controls="translateMenu" aria-label="Translate website">
  <svg class="google-translate-mark" viewBox="0 0 72 72" aria-hidden="true"><rect x="5" y="5" width="38" height="49" rx="4" fill="#07579b"/><path d="M13 24c0-8 5-13 13-13 5 0 9 2 12 6l-6 5c-2-3-4-4-7-4-4 0-7 3-7 7s3 7 7 7c3 0 5-1 6-3h-7v-6h15v4c0 9-6 15-14 15-7 0-12-5-12-13z" fill="#fff"/><rect x="34" y="18" width="31" height="46" rx="4" fill="#fff" stroke="#07579b" stroke-width="4"/><path d="M38 29h23M49 24v7M41 35c3 8 8 13 16 17M56 35c-3 7-7 12-12 15" fill="none" stroke="#07579b" stroke-width="3" stroke-linecap="round"/><path d="M43 48l8-11 8 11" fill="none" stroke="#07579b" stroke-width="2.5"/></svg>
  <span class="translate-selected-flag">🇬🇧</span><span class="translate-selected-name">English</span><svg class="translate-chevron" viewBox="0 0 24 24" aria-hidden="true"><path d="m5 9 7 7 7-7" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
 </button>
 <div class="translate-menu" id="translateMenu" hidden><div class="translate-menu-title">Choose language</div><div class="translate-options">${languageOptions.map(l=>`<button type="button" class="translate-option" data-lang="${l.code}"><span class="translate-flag">${l.flag}</span><span>${l.name}</span></button>`).join('')}</div><p class="translate-powered">Powered by Google Translate</p></div>`;
const headerWrap=document.querySelector('.nav-wrap');
if(headerWrap) headerWrap.appendChild(translateUI); else document.body.appendChild(translateUI);
const translateTrigger=translateUI.querySelector('.translate-trigger'),translateMenu=translateUI.querySelector('.translate-menu');
const savedLanguage=localStorage.getItem('ht-language')||'en';
function updateLanguageButton(code){const lang=languageOptions.find(l=>l.code===code)||languageOptions[0];translateUI.querySelector('.translate-selected-flag').textContent=lang.flag;translateUI.querySelector('.translate-selected-name').textContent=lang.name;translateTrigger.setAttribute('aria-label','Current language: '+lang.name);}
updateLanguageButton(savedLanguage);
translateTrigger.addEventListener('click',()=>{const open=translateMenu.hidden;translateMenu.hidden=!open;translateTrigger.setAttribute('aria-expanded',String(open))});
document.addEventListener('click',e=>{if(!translateUI.contains(e.target)){translateMenu.hidden=true;translateTrigger.setAttribute('aria-expanded','false')}});
function applyGoogleLanguage(code, attempts=0){
 const combo=document.querySelector('#google_translate_element select.goog-te-combo') || document.querySelector('select.goog-te-combo');
 if(!combo){
  if(attempts<20){setTimeout(()=>applyGoogleLanguage(code,attempts+1),300);return}
  translateUI.querySelector('.translate-powered').textContent='Translation did not load. Check your internet connection and open this site from its hosted URL.';
  return;
 }
 combo.value=code;
 combo.dispatchEvent(new Event('change',{bubbles:true}));
 translateMenu.hidden=true;translateTrigger.setAttribute('aria-expanded','false');
}
function selectGoogleLanguage(code){
 updateLanguageButton(code);localStorage.setItem('ht-language',code);
 const status=translateUI.querySelector('.translate-powered');
 status.textContent='Connecting to Google Translate…';
 applyGoogleLanguage(code);
}
translateUI.querySelectorAll('[data-lang]').forEach(btn=>btn.addEventListener('click',()=>selectGoogleLanguage(btn.dataset.lang)));
window.googleTranslateElementInit=function(){
 if(!(window.google&&google.translate))return;
 new google.translate.TranslateElement({pageLanguage:'en',includedLanguages:'en,hi,ar,ru,fr,es,bn,pt,de,zh-CN,tr,id',autoDisplay:false,layout:google.translate.TranslateElement.InlineLayout.SIMPLE},'google_translate_element');
 if(savedLanguage!=='en')setTimeout(()=>applyGoogleLanguage(savedLanguage),700);
};
const googleTranslateScript=document.createElement('script');googleTranslateScript.src='https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';googleTranslateScript.async=true;
googleTranslateScript.onerror=()=>{const status=translateUI.querySelector('.translate-powered');if(status)status.textContent='Google Translate could not load. Check your connection or browser settings.'};
document.head.appendChild(googleTranslateScript);
const hospitalSearch=$('#hospitalSearch');if(hospitalSearch){const cards=$$('.searchable');hospitalSearch.addEventListener('input',()=>{const q=hospitalSearch.value.toLowerCase().trim();let count=0;cards.forEach(c=>{const show=(c.dataset.search+' '+c.textContent).toLowerCase().includes(q);c.hidden=!show;if(show)count++});$('#noHospitals').hidden=count>0})}
const doctorSearch=$('#doctorSearch'),doctorHospital=$('#doctorHospital');if(doctorSearch&&doctorHospital){const cards=$$('.searchable-doctor');const filter=()=>{const q=doctorSearch.value.toLowerCase().trim(),h=doctorHospital.value;let count=0;cards.forEach(c=>{const matchesText=(c.dataset.search+' '+c.textContent).toLowerCase().includes(q),matchesHospital=h==='all'||c.dataset.hospital===h,show=matchesText&&matchesHospital;c.hidden=!show;if(show)count++});$('#noDoctors').hidden=count>0};doctorSearch.addEventListener('input',filter);doctorHospital.addEventListener('change',filter)}
const params=new URLSearchParams(location.search),hospital=params.get('hospital'),hospitalSelect=$('#hospital');if(hospital&&hospitalSelect){const match=[...hospitalSelect.options].find(o=>o.text.toLowerCase()===hospital.toLowerCase());if(match)hospitalSelect.value=match.value;else{const opt=document.createElement('option');opt.textContent=hospital;opt.value=hospital;hospitalSelect.insertBefore(opt,hospitalSelect.options[1]);hospitalSelect.value=hospital}}
const form=$('#consultForm');if(form){form.addEventListener('submit',async e=>{if(!form.action||form.action.endsWith('backend/contact.php')&&location.protocol==='file:'){e.preventDefault();const status=$('#formStatus');status.textContent='The form is ready, but email delivery requires hosting with PHP enabled. Please deploy the site and configure backend/contact.php.';status.scrollIntoView({behavior:'smooth',block:'nearest'});return}if(form.dataset.ajax==='true'){e.preventDefault();const status=$('#formStatus');status.textContent='Sending…';try{const res=await fetch(form.action,{method:'POST',body:new FormData(form),headers:{'Accept':'application/json'}});const data=await res.json();if(!res.ok)throw new Error(data.message||'Could not send your enquiry.');status.textContent=data.message||'Thank you. Your enquiry has been sent.';form.reset()}catch(err){status.textContent=err.message||'Unable to send right now. Please try again.'}}})}
})();
