(async function(){
  if(!window.supabaseClient){
    alert("Supabase não configurado. Edite js/config.js");
    window.location.href = "administracao.html";
    return;
  }

  // Proteção real do admin (session do Supabase)
  const { data: sess } = await window.supabaseClient.auth.getSession();
  if(!sess.session){
    window.location.href = "administracao.html";
    return;
  }

  const listaContatos = document.getElementById('listaContatos');
  const listaExclusao = document.getElementById('listaExclusao');

  function onlyDigits(v){ return String(v||'').replace(/\D/g,''); }
  function instaUser(v){ return String(v||'').trim().replace(/^@/,''); }

  async function load(){
    const { data, error } = await window.supabaseClient
      .from('lojas')
      .select('*')
      .order('created_at', { ascending: true });

    if(error){
      console.error(error);
      if(listaContatos) listaContatos.innerHTML = '<li><span>Erro ao carregar lojas.</span></li>';
      if(listaExclusao) listaExclusao.innerHTML = '<li><span>Erro ao carregar lojas.</span></li>';
      return;
    }

    render(data || []);
  }

  function render(lojas){
    if(!listaContatos || !listaExclusao) return;

    listaContatos.innerHTML = '';
    listaExclusao.innerHTML = '';

    if(!lojas.length){
      listaContatos.innerHTML = '<li><span>Nenhuma loja cadastrada.</span></li>';
      listaExclusao.innerHTML = '<li><span>Nenhuma loja cadastrada.</span></li>';
      return;
    }

    lojas.forEach((l) => {
      const tel = onlyDigits(l.telefone);
      const ig = instaUser(l.rede_social);
      const horario = l.horario_funcionamento || '';
      const waLink = tel ? `https://wa.me/55${tel}` : '#';
      const igLink = ig ? `https://instagram.com/${ig}` : '#';

      // CONTATOS
      const li1 = document.createElement('li');
      li1.innerHTML = `
        <div>
          <strong>${l.nome}</strong><br>
          <small style="color:var(--muted)">${l.numero || ''}</small><br><br>

          ${tel ? `
          <a href="${waLink}" target="_blank"
             style="display:inline-block;margin-bottom:6px;
                    background:#25D366;color:#fff;
                    padding:6px 10px;border-radius:6px;
                    text-decoration:none;font-weight:700">
            📞 WhatsApp
          </a><br>` : ''}

          ${ig ? `
          <a href="${igLink}" target="_blank"
             style="text-decoration:none;color:var(--blue-600);font-weight:700">
            📸 @${ig}
          </a><br>` : ''}

          ${horario ? `
          <span style="display:inline-block;margin-top:6px;font-size:.9rem;color:var(--muted)">
            🕒 ${horario}
          </span>` : ''}
        </div>
      `;
      listaContatos.appendChild(li1);

      // EXCLUSÃO
      const li2 = document.createElement('li');
      li2.innerHTML = `
        <span>
          <strong>${l.nome}</strong><br>
          <small style="color:var(--muted)">${l.numero || ''}</small>
        </span>
        <span class="action-btns">
          <button class="btn-delete" type="button">Excluir</button>
        </span>
      `;
      li2.querySelector("button").addEventListener("click", async () => {
        if(confirm("Deseja excluir esta loja?")){
          const { error } = await window.supabaseClient.from('lojas').delete().eq('id', l.id);
          if(error){ alert("Erro ao excluir."); console.error(error); }
          await load();
        }
      });
      listaExclusao.appendChild(li2);
    });
  }

  async function addLoja(){
    const nome = document.getElementById('nome').value.trim();
    const numero = document.getElementById('numero').value.trim();
    const telefone = document.getElementById('telefone').value.trim();
    const redeSocial = document.getElementById('redeSocial').value.trim();
    const horarioFuncionamento = document.getElementById('horarioFuncionamento').value.trim();

    if(!nome || !numero || !telefone || !redeSocial || !horarioFuncionamento){
      alert('Preencha todos os campos.');
      return;
    }

    const payload = {
      nome,
      numero,
      telefone,
      rede_social: redeSocial,
      horario_funcionamento: horarioFuncionamento
    };

    const { error } = await window.supabaseClient.from('lojas').insert(payload);
    if(error){
      console.error(error);
      alert("Erro ao adicionar (confira as Policies no Supabase).");
      return;
    }

    ['nome','numero','telefone','redeSocial','horarioFuncionamento'].forEach(id => {
      document.getElementById(id).value = '';
    });

    await load();
  }

  const btnAdd = document.getElementById("btnAddLoja");
  if(btnAdd) btnAdd.addEventListener("click", addLoja);

  // Logout
  window.logout = async function(){
    await window.supabaseClient.auth.signOut();
    window.location.href = "index.html";
  };

  await load();
})();
