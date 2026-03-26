// Menu hamburguer (site inteiro)
(function(){
  const hamb = document.getElementById("hamburger");
  const nav = document.getElementById("nav");
  if(!hamb || !nav) return;

  hamb.addEventListener("click", () => {
    hamb.classList.toggle("open");
    const isOpen = hamb.classList.contains("open");
    nav.style.display = isOpen ? "flex" : "";
  });

  // fecha ao clicar fora em telas menores
  document.addEventListener("click", (e) => {
    if(!hamb.contains(e.target) && !nav.contains(e.target)){
      hamb.classList.remove("open");
      nav.style.display = "";
    }
  });
})();
