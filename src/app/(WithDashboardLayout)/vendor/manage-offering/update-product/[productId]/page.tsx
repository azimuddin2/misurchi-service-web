import UpdateProduct from '../../_components/products/update-product';

const UpdateProductPage = ({ params }: { params: { productId: string } }) => {
  return (
    <div>
      <UpdateProduct productId={params.productId} />
    </div>
  );
};

export default UpdateProductPage;
