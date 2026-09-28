import { useEffect, useMemo, useState } from 'react'
import { fetchMeals, filterMeals, getCategories, normalizeText } from '../services/foodApi'
import FoodCard from './FoodCard'
import FoodFilters from './FoodFilters'

const MAX_DISHES = 8

function FoodSection() {
  const [meals, setMeals] = useState([])
  const [status, setStatus] = useState('loading')
  const [errorMessage, setErrorMessage] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [category, setCategory] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadMeals() {
      setStatus('loading')
      try {
        const data = await fetchMeals('c')
        if (!isMounted) return
        setMeals(data)
        setStatus('success')
      } catch (error) {
        if (!isMounted) return
        setErrorMessage(error.message)
        setStatus('error')
      }
    }

    loadMeals()

    return () => {
      isMounted = false
    }
  }, [])

  const categories = useMemo(() => getCategories(meals), [meals])
  const hasActiveFilters = normalizeText(searchTerm) !== '' || category !== ''

  const visibleMeals = useMemo(() => {
    const filtered = filterMeals(meals, searchTerm, category)
    return hasActiveFilters ? filtered : filtered.slice(0, MAX_DISHES)
  }, [meals, searchTerm, category, hasActiveFilters])

  const clearFilters = () => {
    setSearchTerm('')
    setCategory('')
  }

  return (
    <section id="pratos" className="py-20 md:py-28 bg-white">
      <div className="max-w-6xl mx-auto px-5">
        <div className="max-w-2xl mx-auto text-center mb-14">
          <span className="text-brand-orange font-semibold text-sm tracking-wide uppercase">
            Cardápio em destaque
          </span>

          <h2 className="text-3xl md:text-4xl font-extrabold text-brand-dark mt-2 mb-4">
            Descubra nossos pratos
          </h2>

          <p className="text-brand-dark/70">
            Cardápio de exemplo recebido da API{' '}
            <a
              href="https://www.themealdb.com/"
              target="_blank"
              rel="noreferrer"
              className="text-brand-orange font-semibold hover:underline"
            >
              TheMealDB
            </a>
            .
          </p>
        </div>

        {status === 'loading' && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6" aria-busy="true">
            {Array.from({ length: MAX_DISHES }).map((_, index) => (
              <div
                key={index}
                className="bg-brand-cream rounded-xl aspect-square animate-pulse"
              />
            ))}
          </div>
        )}

        {status === 'error' && (
          <div className="text-center bg-red-50 border border-red-200 rounded-xl py-12 px-6 max-w-lg mx-auto">
            <p className="font-semibold text-red-700 mb-1">
              Não foi possível carregar os pratos agora.
            </p>
            <p className="text-sm text-red-600/80">
              {errorMessage || 'Tente novamente em instantes.'}
            </p>
          </div>
        )}

        {status === 'success' && meals.length === 0 && (
          <p className="text-center text-brand-dark/60">
            Nenhum prato encontrado no momento.
          </p>
        )}

        {status === 'success' && meals.length > 0 && (
          <>
            <FoodFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              category={category}
              categories={categories}
              onCategoryChange={setCategory}
              onClear={clearFilters}
              hasActiveFilters={hasActiveFilters}
              resultsCount={visibleMeals.length}
            />

            {visibleMeals.length === 0 ? (
              <div className="text-center bg-brand-cream rounded-xl py-12 px-6 max-w-lg mx-auto">
                <p className="font-semibold text-brand-dark mb-1">
                  Nenhuma comida encontrada.
                </p>
                <p className="text-sm text-brand-dark/60">
                  Tente outro nome ou escolha outro tipo.
                </p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {visibleMeals.map((meal) => (
                  <FoodCard
                    key={meal.id}
                    name={meal.name}
                    image={meal.image}
                    category={meal.category}
                    origin={meal.origin}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}

export default FoodSection