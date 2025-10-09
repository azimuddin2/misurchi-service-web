import ViewProduct from '../../_components/products/view-product';

const ViewProductPage = async ({
  params,
}: {
  params: Promise<{ productId: string }>;
}) => {
  const productID = (await params).productId;

  return (
    <div>
      <ViewProduct productId={productID} />
    </div>
  );
};

export default ViewProductPage;
