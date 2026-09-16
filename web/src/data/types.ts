export interface Category {
    id: string;  
    title: string;
    description: string;
    count: string;
    image: string;
}

export interface CategoryCardProps {
    category: Category;
}


export interface Product {
  id: string;
  category: string;
  title: string;
  price: number;
  oldPrice: number | null;
  rating: number;
  reviews: number;
  image: string;
}
export interface ProductCardProps {
    product: Product
}