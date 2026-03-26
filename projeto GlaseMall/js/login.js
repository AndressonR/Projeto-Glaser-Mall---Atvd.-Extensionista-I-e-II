(function(){
  const btn = document.getElementById("btnLogin");
  const erro = document.getElementById("erro");
  const form = document.getElementById("loginForm");
  if(!form) return;

  function showError(msg){
    if(!erro) return;
    erro.textContent = msg;
    erro.style.display = "block";
  }

  async function doLogin(){
    if(!window.supabaseClient){
      showError("Supabase não configurado. Edite js/config.js");
      return;
    }

    const email = document.getElementById("user").value.trim();
    const password = document.getElementById("pass").value.trim();

    if(!email || !password){
      showError("Preencha e-mail e senha.");
      return;
    }

    const { error } = await window.supabaseClient.auth.signInWithPassword({ email, password });
    if(error){
      console.error(error);
      showError("Usuário ou senha inválidos.");
      return;
    }

    window.location.href = "admin.html";
  }

  form.addEventListener("submit", (e) => { e.preventDefault(); doLogin(); });
  if(btn) btn.addEventListener("click", doLogin);
})();
