const input = document.getElementById('inputPais');
const btnPesquisar = document.getElementById('btnPesquisar');
const regionSelect = document.getElementById('regionSelect');
const paisesContainer = document.getElementById('paisesContainer');
const toggleDark = document.getElementById('toggleDark');

let todosPaises = [];

// Fetch inicial da API
fetch('https://restcountries.com/v3.1/all?fields=name,capital,population,currencies,region')
  .then(res => res.json())
  .then(data => {
    todosPaises = data;
    mostrarPorRegiao('americas');
  });

function criarCard(pais) {
  const nome = pais.translations.por?.common || pais.name.common;
  const capital = pais.capital?.[0] || 'N/A';
  const populacao = pais.population.toLocaleString('pt-BR');
  const moeda = pais.currencies ? Object.values(pais.currencies)[0].name : 'N/A';
  const regiao = pais.region;
  const bandeira = pais.flags.svg;

  return `
    <div class="pais-card">
      <h2>${nome}</h2>
      <img src="${bandeira}" alt="Bandeira de ${nome}">
      <p><strong>Capital:</strong> ${capital}</p>
      <p><strong>População:</strong> ${populacao}</p>
      <p><strong>Moeda:</strong> ${moeda}</p>
      <p><strong>Região:</strong> ${regiao}</p>
    </div>
  `;
}

function mostrarPaises(lista) {
  paisesContainer.innerHTML = lista.map(criarCard).join('');
}

function mostrarPorRegiao(regiao) {
  const filtrados = todosPaises.filter(p => p.region.toLowerCase() === regiao.toLowerCase());
  mostrarPaises(filtrados);
}

function buscarPorNome(texto) {
  const termo = texto.trim().toLowerCase();
  const resultados = todosPaises.filter(p => {
    const nome = p.translations.por?.common || p.name.common;
    return nome.toLowerCase().startsWith(termo);
  });
  mostrarPaises(resultados);
}

btnPesquisar.addEventListener('click', () => {
  buscarPorNome(input.value);
});

input.addEventListener('input', () => {
  buscarPorNome(input.value);
});

input.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    buscarPorNome(input.value);
  }
});

regionSelect.addEventListener('change', () => {
  mostrarPorRegiao(regionSelect.value);
});

toggleDark.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const icon = toggleDark.querySelector("i");
  icon.classList.toggle("fa-moon");
  icon.classList.toggle("fa-sun");
});
