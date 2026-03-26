// Supabase client singleton
(function(){
  const cfg = window.APP_CONFIG || {};
  if(!cfg.SUPABASE_URL || !cfg.SUPABASE_ANON_KEY || cfg.SUPABASE_URL.includes("COLE_")){
    console.warn("Supabase não configurado. Edite js/config.js");
    window.supabaseClient = null;
    return;
  }
  window.supabaseClient = supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY, {
    auth: { persistSession: true, autoRefreshToken: true }
  });
})();
