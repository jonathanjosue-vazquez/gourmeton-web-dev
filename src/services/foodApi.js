const BASE_URL = 'https://www.themealdb.com/api/json/v1/1'

export async function fetchMeals(letter = 'c') {
  const response = await fetch(`${BASE_URL}/search.php?s=${letter}`)

  if (!response.ok) {
    throw new Error(`Erro na requisição: ${response.status}`)
  }

  const data = await response.json()

  if (!data.meals) {
    return []
  }

  return data.meals.map((meal) => ({
    id: meal.idMeal,
    name: meal.strMeal,
    category: meal.strCategory,
    origin: meal.strArea,
    image: meal.strMealThumb,
  }))
}
// Ignora maiúsculas/minúsculas, acentos e espaços desnecessários.

export function normalizeText(text = '') {

  return text

    .normalize('NFD')

    .replace(/[\u0300-\u036f]/g, '')

    .toLowerCase()

    .replace(/\s+/g, ' ')

    .trim()

}
 
// Tipos existentes nos próprios dados, sem repetição.

export function getCategories(meals) {

  const categories = meals.map((meal) => meal.category).filter(Boolean)

  return [...new Set(categories)].sort((a, b) => a.localeCompare(b))

}
 
// Aplica nome E tipo ao mesmo tempo. Filtro vazio = não filtra por ele.

export function filterMeals(meals, searchTerm, category) {

  const term = normalizeText(searchTerm)
 
  return meals.filter((meal) => {

    const matchesCategory = !category || meal.category === category

    const matchesName = !term || normalizeText(meal.name).includes(term)

    return matchesCategory && matchesName

  })

}
 