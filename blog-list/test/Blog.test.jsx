import React from 'react'
import { expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import userEvent from '@testing-library/user-event'
import { Blog } from '../src/components/Blog'


test('Blog component only show title and author', () => {
    // Para esta prueba lo primero que hacemos es crear una nueva entrada de blog con los campos mínimos para pasarle al componente.
    const blogForTesting = {
      title: "Iron Man",
      author: "Stan Lee",
      url: "noURL"
    }
  

    // Renderizamos el componente que hemos importado con la entrada que hemos creado antes. Lo incluimos en el container para poder acceder al className de Blog.
    const {container} = render(<Blog blog={blogForTesting} />)
  
    // Ahora lo siguiente es hacer la prueba específica. En este caso con screen accedemos al componente renderizado y usamos el método getByText de screen
    // para buscar un elemento que tenga el title del blog. 
    // La existencia de un elemento se verifica utilizando el comando expect de Vitest. Y toBeDefined que prueba si el argument element existe.
    const div = container.querySelector('.entryBlog')
    expect(div).toHaveTextContent('Iron Man - Stan Lee')
  
  })

test('Details are shown when button is pressed', () => {
    // Para esta prueba lo primero que hacemos es crear una nueva entrada de blog con los campos mínimos para pasarle al componente.
    const blogForTesting = {
      title: "Spider Man",
      author: "Stan Lee",
      url: "SpiderURL",
      likes: 100
    }
  
    // Utilizamos el mockHandler para simular que el botón de detalles es deplegado.
    const mockHandler = vi.fn()
    // Renderizamos el componente que hemos importado con la entrada que hemos creado antes. Lo incluimos en el container para poder acceder al className de Blog.
    const {container} = render(<Blog blog={blogForTesting} onClickLikes={mockHandler} />)
    
    const div = container.querySelector('.entryBlogDetails')
    expect(div).toHaveTextContent(`Spider Man - Stan LeeSpiderURL100`)
})

test('Likes button sends two request when is pressed twice', async () => {
  const blogForTesting = {
    title: "Spider Man",
    author: "Stan Lee",
    url: "SpiderURL",
    likes: 100
  }

  const mockHandler = vi.fn()
  render(<Blog blog={blogForTesting} onClickLikes={mockHandler} />)

  const user = userEvent.setup()
  const button = screen.getByText('Likes')
  await user.click(button)
  await user.click(button)

  expect(mockHandler.mock.calls).toHaveLength(2)
})