(async function(){
  const wrap = document.getElementById('listaLojas');
  if(!wrap) return;

  function onlyDigits(v){ return String(v||'').replace(/\D/g,''); }
  function instaUser(v){ return String(v||'').trim().replace(/^@/,''); }

  // Páginas individuais (opcional)
  const paginas = {
    "Lavanderia Lemes": "lojas/lavanderia.html",
    "Casa do Nordeste Mandacaru": "lojas/distribuidora.html",
    "Marka da Paz": "lojas/vestuario.html",
    "Best Workout": "lojas/academia.html",
    "Mappi Odonto": "lojas/clinica-odontologica.html",
    "Pet House": "lojas/petshop.html",
    "Pancini Celulares": "lojas/acessorios-celular.html",
    "Barbearia K2": "lojas/barbearia.html"
  };

  function render(lojas){
    if(!lojas || !lojas.length){
      wrap.innerHTML = `
        <div class="info-box">
          Nenhuma loja encontrada no banco.<br>
          Entre no <strong>Admin</strong> e cadastre as lojas.
        </div>
      `;
      return;
    }

    wrap.innerHTML = lojas.map(l => {
      const nome = (l.nome || 'Sem nome').trim();
      const numero = (l.numero || '').trim();
      const tel = onlyDigits(l.telefone);
      const ig = instaUser(l.rede_social || l.redeSocial);
      const horario = (l.horario_funcionamento || l.horarioFuncionamento || '').trim();
      const logo = l.logo_url || l.logoData || '';

      const waLink = tel ? `https://wa.me/55${tel}` : '#';
      const igLink = ig ? `https://instagram.com/${ig}` : '#';
      const pagina = paginas[nome] ? `<a class="btn-pagina" href="${paginas[nome]}">Página da loja</a>` : '';
      const logoHtml = logo
        ? `<img src="${logo}" alt="${nome}">`
        : `<img src="images/logo.png" alt="Glaser Mall">`;

      return `
        <div class="loja-card">
          <div class="loja-logo-box">${logoHtml}</div>

          <div class="loja-info">
            <h3>${nome}</h3>
            <p class="loja-meta">${numero}</p>

            <div class="loja-actions">
              ${tel ? `<a class="btn-wa" target="_blank" href="${waLink}">📞 WhatsApp</a>` : ''}
              ${ig ? `<a class="btn-ig" target="_blank" href="${igLink}">📸 @${ig}</a>` : ''}
              ${pagina}
            </div>

            ${horario ? `<div class="loja-horario">🕒 ${horario}</div>` : ''}
          </div>
        </div>
      `;
    }).join('');
  }

  wrap.innerHTML = '<div class="info-box">Carregando lojas…</div>';

  if(!window.supabaseClient){
    wrap.innerHTML = `
      <div class="info-box">
        Supabase não configurado.<br>
        Edite <strong>js/config.js</strong> e cole sua URL e anon key.
      </div>
    `;
    return;
  }

  const { data, error } = await window.supabaseClient
    .from('lojas')
    .select('*')
    .order('created_at', { ascending: true });

  if(error){
    console.error(error);
    wrap.innerHTML = `
      <div class="info-box">
        Erro ao carregar lojas do Supabase.<br>
        Confira se a tabela <strong>lojas</strong> e as Policies (RLS) estão criadas.
      </div>
    `;
    return;
  }

  render(data || []);
})();
