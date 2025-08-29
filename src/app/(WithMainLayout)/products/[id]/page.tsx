import ProductDetails from '../_component';

const ProductDetailsPage = ({ params }: { params: { id: string } }) => {
  return (
    <div>
      <ProductDetails productId={params.id} />
    </div>
  );
};

export default ProductDetailsPage;
