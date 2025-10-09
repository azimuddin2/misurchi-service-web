import ProductDetails from '../_component';

const ProductDetailsPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const productID = (await params).id;

  return (
    <div className="max-w-7xl mx-auto px-3 lg:px-5">
      <ProductDetails productId={productID} />
    </div>
  );
};

export default ProductDetailsPage;
