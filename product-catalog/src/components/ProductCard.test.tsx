import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProductCard from './ProductCard';
import type { Product } from '../types';

const product: Product = {
  _id: 7, title: 'Yellow Hoody', isNew: true, oldPrice: '200', price: 180, discountedPrice: 162,
  description: 'Warm', category: 'men', type: 'hoodie', stock: 40, brand: 'UrbanVibe',
  size: ['M'], image: 'https://example.com/a.jpg', rating: 4,
};

describe('<ProductCard />', () => {
  it('shows image, title, price, category and links to the detail page', () => {
    render(
      <MemoryRouter>
        <ul><ProductCard product={product} /></ul>
      </MemoryRouter>,
    );
    expect(screen.getByRole('img', { name: 'Yellow Hoody' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Yellow Hoody' })).toBeInTheDocument();
    expect(screen.getByText('$162.00')).toBeInTheDocument();
    expect(screen.getByText('Men')).toBeInTheDocument();
    expect(screen.getByText('New')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', '/products/7');
  });
});
