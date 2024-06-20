document.addEventListener('DOMContentLoaded', function() {
    const verTodosBtn = document.getElementById('ver-todos');
    const coctelesBtn = document.getElementById('cocteles');
    const ingredientesBtn = document.getElementById('ingredientes');
    const listaCoctel = document.getElementById('todos');

    async function cargarCocktails() {
        listaCoctel.innerHTML = '';

        try {
            let currentPage = 1;
            let totalCocktails = 0;
            const cocktailsPerPage = 20; 

            do {
                const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=&page=${currentPage}`);
                const data = await response.json();

                if (data.drinks) {
                    totalCocktails = data.drinks.length;

                    data.drinks.forEach(cocktail => {
                        const id = cocktail.idDrink;
                        const nombre = cocktail.strDrink;
                        const imagen = cocktail.strDrinkThumb;
                        const ingredientes = obtenerIngredientes(cocktail);
                        const tipo = cocktail.strCategory;

                        const coctelElemento = document.createElement('div');
                        coctelElemento.classList.add('bg-white', 'rounded-lg', 'shadow-md', 'overflow-hidden', 'mb-4');

                        coctelElemento.innerHTML = `
                            <div class="p-4 hover:scale-105">
                                <div class="flex items-center mb-4">
                                    <img src="${imagen}" alt="${nombre}" class="w-20 h-20 mr-4 rounded-full object-cover">
                                    <div>
                                        <p class="text-gray-600">#${id}</p>
                                        <h2 class="text-lg font-semibold">${nombre}</h2>
                                        <p class="text-sm">${tipo}</p>
                                    </div>
                                </div>
                                <p class="text-sm">Ingredientes: ${ingredientes}</p>
                            </div>
                        `;
                        listaCoctel.appendChild(coctelElemento);
                    });

                    currentPage++;
                } else {
                    break;
                }
            } while (totalCocktails === cocktailsPerPage);

        } catch (error) {
            console.error('Error al cargar los cócteles', error);
        }
    }

    function obtenerIngredientes(cocktail) {
        let ingredientes = '';
        for (let i = 1; i <= 15; i++) {
            const ingrediente = cocktail[`strIngredient${i}`];
            const medida = cocktail[`strMeasure${i}`];

            if (ingrediente) {
                ingredientes += `${ingrediente} - ${medida}, `;
            }
        }
        return ingredientes.slice(0, -2); 
    }

    async function cargarIngredientes() {
        listaCoctel.innerHTML = ''; 

        try {
            const response = await fetch('https://www.thecocktaildb.com/api/json/v1/1/list.php?i=list'); 
            const data = await response.json();

            for (let i = 0; i < data.drinks.length; i++) {
                const ingrediente = data.drinks[i].strIngredient1;
                const imgUrl = `https://www.thecocktaildb.com/images/ingredients/${ingrediente}-Small.png`;

                const ingredienteElemento = document.createElement('div');
                ingredienteElemento.classList.add('bg-white', 'rounded-lg', 'shadow-md', 'overflow-hidden', 'mb-4', 'p-4', 'hover:shadow-xl', 'transition-transform', 'duration-300', 'transform');

                ingredienteElemento.innerHTML = `
                    <div class="flex items-center">
                        <img src="${imgUrl}" alt="${ingrediente}" class="w-10 h-10 mr-4 rounded-full object-cover">
                        <p class="text-lg font-semibold">${ingrediente}</p>
                    </div>
                `;
                listaCoctel.appendChild(ingredienteElemento);
            }
        } catch (error) {
            console.error('Error al cargar los ingredientes', error);
        }
    }

    verTodosBtn.addEventListener('click', async function() {
        await cargarCocktails();
        await cargarIngredientes();
    });

    coctelesBtn.addEventListener('click', cargarCocktails);
    ingredientesBtn.addEventListener('click', cargarIngredientes);
    cargarCocktails();
});


