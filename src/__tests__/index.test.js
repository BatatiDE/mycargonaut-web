import { render, screen } from '@testing-library/react'
import Home from '../app/page' // Ensure this path matches your project structure

test('renders homepage with the correct welcome message', () => {
    render(<Home />)
    const heading = screen.getByRole('heading', {
        name: /MyCargonaut Frontend is Ready! 🚀/i, // Updated text
    })
    expect(heading).toBeInTheDocument()
})
