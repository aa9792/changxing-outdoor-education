document.addEventListener('DOMContentLoaded',()=>{const id=new URLSearchParams(location.search).get('route');if(id&&routes.some(r=>r.id===id))selectRoute(id,false,false);});
