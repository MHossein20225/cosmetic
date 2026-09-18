import ProductsView from "@/components/ProductsView";
import { PRODUCTS } from "@/data/data";

export default function CategoriedProduct() {
    return(
        <ProductsView
            title={`${PRODUCTS[0].category} Products`}
            products={PRODUCTS}
            categoryLabel={"oil"}
        />
    )
}