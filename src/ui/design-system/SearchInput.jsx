import { IconSearch, IconClose } from '../icons'

/**
 * v7 Premium Design System — SearchInput.
 *
 * Icon-prefixed search field per the Blueprint's Forms table ("Search:
 * icon-prefixed, shortcut affordance shown as a subtle inline hint").
 * Shows a clear ("×") button once there's a value, or the optional
 * `shortcut` hint (e.g. "/" or "⌘K") when empty — never both at once.
 */
export function SearchInput({
  value,
  onChange,
  onClear,
  placeholder = 'Search…',
  shortcut,
  className = '',
  ...props
}) {
  return (
    <div className={['ds-search-input', className].filter(Boolean).join(' ')}>
      <IconSearch className="ds-search-icon" width={16} height={16} aria-hidden="true" />
      <input
        type="search"
        className="ds-search-field"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        aria-label={placeholder}
        {...props}
      />
      {value ? (
        <button type="button" className="ds-search-clear" aria-label="Clear search" onClick={onClear}>
          <IconClose width={14} height={14} />
        </button>
      ) : (
        shortcut && (
          <span className="ds-search-shortcut" aria-hidden="true">
            {shortcut}
          </span>
        )
      )}
    </div>
  )
}
