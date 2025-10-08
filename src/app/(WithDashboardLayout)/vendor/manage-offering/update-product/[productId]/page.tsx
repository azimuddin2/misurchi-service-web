import UpdateProduct from '../../_components/products/update-product';

const UpdateProductPage = async({ params }: { params: Promise<{ productId: string }> }) => {
  const productID = (await params).productId
  return (
    <div>
      <UpdateProduct productId={productID} />
    </div>
  );
};

export default UpdateProductPage;
