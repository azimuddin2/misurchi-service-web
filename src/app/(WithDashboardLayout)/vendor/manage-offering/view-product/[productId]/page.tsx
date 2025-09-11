import ViewProduct from '../../_components/products/view-product';

const ViewProductPage = ({ params }: { params: { productId: string } }) => {
  return (
    <div>
      <ViewProduct productId={params.productId} />
    </div>
  );
};

export default ViewProductPage;
