import ProductDetails from '../_component';

const ProductDetailsPage = ({ params }: { params: { id: string } }) => {
  return (
    <div className="max-w-7xl mx-auto px-3 lg:px-5">
      <ProductDetails productId={params.id} />
    </div>
  );
};

export default ProductDetailsPage;
