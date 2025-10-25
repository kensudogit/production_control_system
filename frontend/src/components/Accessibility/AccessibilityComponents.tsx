import React, { useEffect } from 'react'

// アクセシビリティ改善フック
export const useAccessibility = () => {
  useEffect(() => {
    // Forced Colors Mode の検出
    const mediaQuery = window.matchMedia('(forced-colors: active)')
    
    const handleForcedColorsChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        document.documentElement.classList.add('forced-colors-active')
        console.log('Forced Colors Mode is active')
      } else {
        document.documentElement.classList.remove('forced-colors-active')
        console.log('Forced Colors Mode is inactive')
      }
    }

    // 初期状態の設定
    if (mediaQuery.matches) {
      document.documentElement.classList.add('forced-colors-active')
    }

    // リスナーの追加
    mediaQuery.addEventListener('change', handleForcedColorsChange)

    // クリーンアップ
    return () => {
      mediaQuery.removeEventListener('change', handleForcedColorsChange)
    }
  }, [])
}

// 高コントラスト対応コンポーネント
interface AccessibleButtonProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
  disabled?: boolean
  'aria-label'?: string
}

export const AccessibleButton: React.FC<AccessibleButtonProps> = ({
  children,
  onClick,
  className = '',
  variant = 'primary',
  disabled = false,
  'aria-label': ariaLabel,
  ...props
}) => {
  const baseClasses = 'btn'
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    success: 'btn-success',
    warning: 'btn-warning',
    danger: 'btn-danger'
  }

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      {...props}
    >
      {children}
    </button>
  )
}

// 高コントラスト対応カードコンポーネント
interface AccessibleCardProps {
  children: React.ReactNode
  className?: string
  role?: string
  'aria-label'?: string
}

export const AccessibleCard: React.FC<AccessibleCardProps> = ({
  children,
  className = '',
  role = 'region',
  'aria-label': ariaLabel,
  ...props
}) => {
  return (
    <div
      className={`card ${className}`}
      role={role}
      aria-label={ariaLabel}
      {...props}
    >
      {children}
    </div>
  )
}

// 高コントラスト対応入力フィールド
interface AccessibleInputProps {
  type?: string
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  className?: string
  'aria-label'?: string
  'aria-describedby'?: string
  required?: boolean
}

export const AccessibleInput: React.FC<AccessibleInputProps> = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  className = '',
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedby,
  required = false,
  ...props
}) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`input ${className}`}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedby}
      required={required}
      {...props}
    />
  )
}

// スキップリンクコンポーネント
export const SkipLink: React.FC<{ href: string; children: React.ReactNode }> = ({
  href,
  children
}) => {
  return (
    <a
      href={href}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary-600 text-white px-4 py-2 rounded-lg z-50"
    >
      {children}
    </a>
  )
}

// スクリーンリーダー専用テキスト
export const ScreenReaderOnly: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  return <span className="sr-only">{children}</span>
}

