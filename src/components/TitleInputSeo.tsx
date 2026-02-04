'use client'

const TITLE_SUFFIX = ' | Nox Imóveis'
const SEO_MIN = 35
const SEO_MAX = 60

export interface TitleInputSeoProps {
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  required?: boolean
  name?: string
  id?: string
}

/**
 * Campo de título com dica de SEO: mostra contagem de caracteres e alerta
 * (borda vermelha) quando o título da página ficar fora do ideal 35–60 caracteres.
 * O título da página é sempre "valor | Nox Imóveis". Não impede salvar.
 */
export default function TitleInputSeo({
  label,
  value,
  onChange,
  placeholder,
  required,
  name,
  id,
}: TitleInputSeoProps) {
  const fullLength = value.length + TITLE_SUFFIX.length
  const isShort = value.length > 0 && fullLength < SEO_MIN
  const isLong = fullLength > SEO_MAX
  const isOutOfRange = isShort || isLong

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && '*'}
      </label>
      <input
        type="text"
        name={name}
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
          isOutOfRange
            ? 'border-red-500 focus:ring-red-400 focus:border-red-500 bg-red-50/50'
            : 'border-gray-300 focus:ring-purple-500 focus:border-transparent'
        }`}
      />
      <p
        className={`mt-1 text-xs ${isOutOfRange ? 'text-red-600' : 'text-gray-500'}`}
        role="status"
        aria-live="polite"
      >
        {value.length} caracteres → título da página: {fullLength} (ideal SEO: {SEO_MIN}–{SEO_MAX})
        {isShort && ' — muito curto'}
        {isLong && ' — muito longo'}
      </p>
    </div>
  )
}
