import { MouseEventHandler } from "react";

export interface Category {
    id: number;  
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
  description: string;
  price: number;
  image: string;
}

export interface ProductCardProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  image?: string;
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

export interface CartItem {
    id: number,
    name: string,
    category: string,
    description: string;
    price: number,
    qty: number,
    image: string,
}

export interface Brand {
    id: number;
    name: string;
    image: string;
}