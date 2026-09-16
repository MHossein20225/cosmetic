import { MouseEventHandler } from "react";

export interface Category {
    id: string;  
    name: string;
    description: string;
    count: string;
    image: string;
}

export interface CategoryCardProps {
    category: Category;
}


export interface Product {
  id: number;
  category: string;
  name: string;
  description: string
  price: number;
  image: string;
}
export interface ProductCardProps {
    product: Product
}
export interface NavLink {
    label: string;
    readonly href: string;
}

export interface NavLinkProps {
    link: NavLink;
    onClickFn?: MouseEventHandler;
}