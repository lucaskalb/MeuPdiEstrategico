import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from './Button'

describe('Button', () => {
  it('deve renderizar o texto do botão', () => {
    render(<Button>Clique aqui</Button>)
    expect(screen.getByText('Clique aqui')).toBeInTheDocument()
  })

  it('deve chamar a função onClick quando clicado', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Clique aqui</Button>)
    
    fireEvent.click(screen.getByText('Clique aqui'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('deve aplicar a classe correta para a variante primary', () => {
    render(<Button variant="primary">Clique aqui</Button>)
    const button = screen.getByText('Clique aqui')
    expect(button).toHaveClass('bg-blue-500', 'text-white')
  })

  it('deve aplicar a classe correta para a variante secondary', () => {
    render(<Button variant="secondary">Clique aqui</Button>)
    const button = screen.getByText('Clique aqui')
    expect(button).toHaveClass('bg-gray-200', 'text-gray-800')
  })
}) 