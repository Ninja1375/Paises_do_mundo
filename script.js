const input = document.getElementById('inputPais');
const btnPesquisar = document.getElementById('btnPesquisar');
const regionSelect = document.getElementById('regionSelect');
const paisesContainer = document.getElementById('paisesContainer');
const toggleDark = document.getElementById('toggleDark');

let todosPaises = [];

// Verificar tema salvo
if (localStorage.getItem('darkMode') === 'enabled') {
  document.body.classList.add('dark');
  const icon = toggleDark.querySelector('i');
  icon.classList.add('fa-sun');
  icon.classList.remove('fa-moon');
}

// Fetch inicial da API
fetch('https://restcountries.com/v3.1/all?fields=name,capital,population,currencies,region,flags')
  .then(res => res.json())
  .then(data => {
    todosPaises = data;
    mostrarPorRegiao(regionSelect.value);
  })
  .catch(err => console.error('Erro ao carregar países:', err));

function criarCard(pais) {
  const nome = pais.name.common;
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
  const filtrados = todosPaises.filter(p => 
    p.region.toLowerCase() === regiao.toLowerCase()
  );
  mostrarPaises(filtrados);
}

function buscarPorNome(texto) {
  const termo = texto.trim().toLowerCase();
  const resultados = todosPaises.filter(p => 
    p.name.common.toLowerCase().includes(termo)
  );
  mostrarPaises(resultados);
}

// Event Listeners
btnPesquisar.addEventListener('click', () => {
  buscarPorNome(input.value);
});

input.addEventListener('input', () => {
  if (input.value === '') {
    mostrarPorRegiao(regionSelect.value);
  } else {
    buscarPorNome(input.value);
  }
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
  
  // Salvar preferência no localStorage
  if (document.body.classList.contains("dark")) {
    localStorage.setItem('darkMode', 'enabled');
  } else {
    localStorage.setItem('darkMode', 'disabled');
  }
});
