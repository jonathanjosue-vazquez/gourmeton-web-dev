const fieldClasses =
    'w-full rounded-xl border border-brand-dark/15 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-brand-orange transition-shadow'

function FoodFilters({
    searchTerm,
    onSearchChange,
    category,
    categories,
    onCategoryChange,
    onClear,
    hasActiveFilters,
    resultsCount,
}) {
    return (
        <div role="search" className="mb-10">
            <div className="flex flex-col sm:flex-row gap-4 sm:items-end">
                <div className="flex-1">
                    <label htmlFor="food-search" className="block text-sm font-semibold text-brand-dark mb-1.5">
                        Buscar por nome
                    </label>
                    <input
                        id="food-search"
                        type="text"
                        value={searchTerm}
                        onChange={(event) => onSearchChange(event.target.value)}
                        placeholder="Ex.: chicken, cake, pie..."
                        autoComplete="off"
                        className={fieldClasses}
                    />
                </div>

                <div className="sm:w-56">
                    <label htmlFor="food-category" className="block text-sm font-semibold text-brand-dark mb-1.5">
                        Tipo
                    </label>
                    <select
                        id="food-category"
                        value={category}
                        onChange={(event) => onCategoryChange(event.target.value)}
                        className={fieldClasses}
                    >
                        <option value="">Todos os tipos</option>
                        {categories.map((item) => (
                            <option key={item} value={item}>
                                {item}
                            </option>
                        ))}
                    </select>
                </div>

                {hasActiveFilters && (
                    <button
                        type="button"
                        onClick={onClear}
                        className="border border-brand-dark/15 hover:bg-brand-orangeLight text-brand-dark font-semibold px-5 py-3 rounded-xl transition-colors"
                    >
                        Limpar filtros
                    </button>
                )}
            </div>

            {hasActiveFilters && (
                <p className="text-sm text-brand-dark/60 mt-3" aria-live="polite">
                    {resultsCount} {resultsCount === 1 ? 'prato encontrado' : 'pratos encontrados'}
                </p>
            )}
        </div>
    )
}

export default FoodFilters