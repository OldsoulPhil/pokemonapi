const pokeDex = document.querySelector('#pokedex');
const pokedex2 = document.querySelector('#pokedex-two');
const allCards = document.getElementsByClassName('card');
const aToZ = document.querySelector('#aToZ');
const zToA = document.querySelector('#zToA');

const fetchPokemon = async () => {
  const url = `https://pokeapi.co/api/v2/pokemon?limit=30`;
  const res = await fetch(url);
  const data = await res.json();
  const pokemon = data.results.map(async (result, index) => {
    const response = await fetch(result.url);
    const pokemonDetail = await response.json();
    return {
      name: result.name,
      id: index + 1,
      image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index + 1}.png`,
      moves: pokemonDetail.moves.length
    }
  });
  const pokemonWithMoves = await Promise.all(pokemon);
  displayPokemon(pokemonWithMoves);
  moveCards(allCards);
};

const displayPokemon = (pokemon) => {
  const pokemonHTMLString = pokemon.map((monster) =>
    `<div class="card" data-moves="${monster.moves}">
    <img class="card-img" src='${monster.image}'/>
    <h2 class="card-title-id">${monster.id}</h2>
    <h3 class="card-name">${monster.name}</h3>
  </div>
  `).join('');
  pokeDex.innerHTML = pokemonHTMLString;
  const allMoves = pokemon.reduce((acc, val) => acc + val.moves, 0);
  const countBox = document.querySelector('#countBox');
  countBox.innerText = `Total moves: ${allMoves}`;
};

const moveCards = (allCards) => {
  const newArr = Array.from(allCards);
  newArr.forEach((element) => {
    element.addEventListener("click", () => {
      if (element.parentElement === pokeDex || element.parentElement === pokedex2) {
        const container = element.parentElement === pokeDex ? pokedex2 : pokeDex;
        container.appendChild(element);
      }
    });
  });
};

let sortOrder = false;

const toggleSort = (div1, div2, ascending) => {
  const [children1, children2] = [div1, div2].map((container) => Array.from(container.children));

  [children1, children2].forEach((container) => {
    container.sort((a, b) => {
      const arrParams = ascending ? [a, b] : [b, a];
      return arrParams[0].querySelector('.card-name').innerText
        .localeCompare(arrParams[1].querySelector('.card-name').innerText);
    })
  });

  sortOrder = !!ascending;

  [div1, div2].forEach((container) => (container.innerHTML = ''));
  children1.forEach((child) => div1.appendChild(child));
  children2.forEach((child) => div2.appendChild(child));
};

const arr = [
  { container: aToZ, value: true },
  { container: zToA, value: false },
];

arr.forEach((item) => {
  const { container, value } = item;
  container.addEventListener('click', () => {
    toggleSort(pokeDex, pokedex2, value);
  });
});

fetchPokemon();