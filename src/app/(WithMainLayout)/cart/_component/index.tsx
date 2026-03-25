'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import {
  selectCartItems,
  updateQuantity,
  removeFromCart,
  clearCart,
} from '@/redux/features/cart/cartSlice';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Minus, Plus, Store, Trash2 } from 'lucide-react';
import { TProduct } from '@/types/product.type';
import DeleteConfirmationModal from '@/components/ui/core/MSWModal/DeleteConfirmationModal';
import { useRouter } from 'next/navigation';
import { setCheckoutData } from '@/redux/features/checkout/checkoutSlice';
import { toast } from 'sonner';

type CartItem = TProduct & {
  cartQuantity: number;
  selected?: boolean;
  selectedSize?: string;
  selectedColor?: string;
};

// Parse discount string like "20%" into price + percent
const parseDiscount = (price: number, discountStr?: string) => {
  if (!discountStr) return { discountedPrice: price, discountPercent: 0 };
  const discountPercent = Number(discountStr.replace('%', '')) || 0;
  const discountedPrice = price - (price * discountPercent) / 100;
  return { discountedPrice, discountPercent };
};

const Cart = () => {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(selectCartItems) as CartItem[];
  const router = useRouter();

  const [cartState, setCartState] = useState<CartItem[]>([]);
  const [activeVendor, setActiveVendor] = useState<string | null>(null);
  const [selectAll, setSelectAll] = useState(false);

  // Delete modal state
  const [open, setOpen] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<CartItem | null>(null);

  // Initialize cartState from Redux cartItems
  useEffect(() => {
    setCartState(cartItems.map((item) => ({ ...item, selected: false })));
    setActiveVendor(null);
    setSelectAll(false);
  }, [cartItems]);

  // Toggle select all for active vendor
  const handleSelectAll = () => {
    if (!activeVendor) return;
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    setCartState(
      cartState.map((item) =>
        item.vendor?._id === activeVendor
          ? { ...item, selected: newSelectAll }
          : item,
      ),
    );
  };

  // Toggle single item selection
  const toggleItemSelection = (id: string, vendorId: string) => {
    if (!activeVendor || vendorId === activeVendor) {
      setActiveVendor(vendorId);
      setCartState(
        cartState.map((item) =>
          item._id === id ? { ...item, selected: !item.selected } : item,
        ),
      );
    } else {
      // Switch vendor selection: deselect previous, select current
      setActiveVendor(vendorId);
      setCartState(
        cartState.map((item) =>
          item.vendor?._id === vendorId
            ? item._id === id
              ? { ...item, selected: true }
              : { ...item, selected: false }
            : { ...item, selected: false },
        ),
      );
      setSelectAll(false);
    }
  };

  // Delete single item
  const handleDeleteConfirm = () => {
    if (!selectedItem) return;
    dispatch(
      removeFromCart({
        id: selectedItem._id,
        size: selectedItem.selectedSize ?? null,
        color: selectedItem.selectedColor ?? null,
      }),
    );
    toast.success('Item removed from cart');
    setModalOpen(false);
    setSelectedItem(null);
    setCartState(cartState.filter((i) => i._id !== selectedItem._id));
  };

  // Calculate totals
  const calculateTotals = (items: CartItem[]) => {
    let subtotal = 0,
      discount = 0,
      total = 0;

    items.forEach((item) => {
      if (!item.selected) return;
      const qty = item.cartQuantity;
      const { discountedPrice } = parseDiscount(
        item.price,
        typeof item.discountPrice === 'string' ? item.discountPrice : undefined,
      );
      subtotal += item.price * qty;
      discount += (item.price - discountedPrice) * qty;
      total += discountedPrice * qty;
    });

    return { subtotal, discount, total };
  };

  const totals = calculateTotals(cartState);

  // Group by seller/vendor
  const groupedBySeller = cartState.reduce(
    (acc, item) => {
      const sellerId = item.vendor?._id || 'unknown';
      if (!acc[sellerId]) {
        acc[sellerId] = {
          sellerName: item.vendor?.businessName || 'Unknown',
          items: [] as CartItem[],
        };
      }
      acc[sellerId].items.push(item);
      return acc;
    },
    {} as Record<string, { sellerName: string; items: CartItem[] }>,
  );

  // Proceed to checkout
  const handleProceedToCheckout = () => {
    const selectedItems = cartState.filter((i) => i.selected);
    if (!selectedItems.length) return alert('Please select items.');

    const products: any[] = selectedItems.map((i) => {
      const { discountedPrice } = parseDiscount(
        i.price,
        typeof i.discountPrice === 'string' ? i.discountPrice : undefined,
      );
      return {
        name: i.name,
        image: i.images[0]?.url,
        product: i._id,
        quantity: i.cartQuantity,
        price: discountedPrice,
        discount: i.price - discountedPrice,
        size: i.selectedSize,
        color: i.selectedColor,
      };
    });

    dispatch(
      setCheckoutData({
        products,
        vendor: selectedItems[0].vendor?._id,
        totalPrice: products.reduce((sum, p) => sum + p.price * p.quantity, 0),
      }),
    );

    router.push('/shipping-address');
  };

  if (!cartItems.length)
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Image
          src="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
          alt="Empty Cart"
          width={140}
          height={140}
          className="mb-4 opacity-80"
        />
        <h2 className="text-lg font-semibold text-gray-700">
          Your cart is empty
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Looks like you haven’t added anything to your cart yet.
        </p>
      </div>
    );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 sm:p-6">
      {/* Cart Items */}
      <div className="md:col-span-2 space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <Checkbox
            checked={selectAll}
            onCheckedChange={handleSelectAll}
            id="select-all"
            disabled={!activeVendor}
          />
          <label htmlFor="select-all" className="text-sm font-medium">
            SELECT ALL ({cartItems.length} ITEM{cartItems.length !== 1 && 'S'})
          </label>
        </div>

        {Object.entries(groupedBySeller).map(([vendorId, vendor]) => (
          <div key={vendorId} className="border rounded-md shadow-sm">
            <div className="px-4 py-2 bg-gray-50 border-b font-semibold text-sm flex items-center gap-2">
              <Store size={20} />
              <span>{vendor.sellerName}</span>
            </div>

            {vendor.items.map((item) => {
              const { discountedPrice, discountPercent } = parseDiscount(
                item.price,
                typeof item.discountPrice === 'string'
                  ? item.discountPrice
                  : undefined,
              );
              return (
                <div
                  key={
                    item._id +
                    (item.selectedSize || '') +
                    (item.selectedColor || '')
                  }
                  className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 border-b last:border-none"
                >
                  <Checkbox
                    checked={item.selected || false}
                    onCheckedChange={() =>
                      toggleItemSelection(item._id, vendorId)
                    }
                  />

                  <Image
                    src={item.images?.[0]?.url || '/placeholder.png'}
                    alt={item.name}
                    width={80}
                    height={80}
                    className="rounded-md object-cover w-20 h-20 sm:w-24 sm:h-24"
                  />

                  <div className="flex-1">
                    <h3 className="font-medium text-base break-words">
                      {item.name}
                    </h3>
                    <p className="text-xs text-gray-500">{item.productType}</p>

                    {/* Selected size & color */}
                    <div className="flex gap-2 mt-1 flex-wrap">
                      {item.selectedSize && (
                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full flex items-center gap-1 font-medium">
                          <span className="font-semibold">Size:</span>{' '}
                          {item.selectedSize}
                        </span>
                      )}
                      {item.selectedColor && (
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full flex items-center gap-1 font-medium">
                          <span className="font-semibold">Color:</span>
                          <span
                            className="w-3 h-3 rounded-full border border-gray-300 ml-1"
                            style={{ backgroundColor: item.selectedColor }}
                          ></span>
                          {item.selectedColor}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <p className="text-green-600 font-bold text-base">
                        ${discountedPrice.toFixed(2)}
                      </p>
                      {discountPercent > 0 && (
                        <>
                          <p className="text-base line-through text-gray-400">
                            ${item.price.toFixed(2)}
                          </p>
                          <span className="text-sm text-red-600 font-semibold italic">
                            {discountPercent}% OFF
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Quantity + Remove */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          dispatch(
                            updateQuantity({
                              id: item._id,
                              size: item.selectedSize ?? null,
                              color: item.selectedColor ?? null,
                              cartQuantity: Math.max(item.cartQuantity - 1, 1),
                            }),
                          )
                        }
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="px-1">{item.cartQuantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          dispatch(
                            updateQuantity({
                              id: item._id,
                              size: item.selectedSize ?? null,
                              color: item.selectedColor ?? null,
                              cartQuantity: item.cartQuantity + 1,
                            }),
                          )
                        }
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="cursor-pointer bg-gray-100"
                      onClick={() => {
                        setSelectedItem(item);
                        setModalOpen(true);
                      }}
                    >
                      <Trash2 size={20} className="text-red-500" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Order Summary */}
      <div className="p-4 border rounded-md shadow-sm h-fit mt-0 md:mt-9">
        <h2 className="font-semibold text-lg">Order Summary</h2>

        <div className="flex justify-between text-sm mt-3">
          <span>Subtotal ({cartItems.length} items)</span>
          <span>$ {totals.subtotal.toFixed(2)}</span>
        </div>

        {totals.discount > 0 && (
          <div className="flex justify-between text-sm mt-1 text-green-600">
            <span>Discount</span>
            <span>$ {totals.discount.toFixed(2)}</span>
          </div>
        )}

        <div className="flex justify-between text-sm mt-1">
          <span>Shipping Fee</span>
          <span>$ 0.00</span>
        </div>

        <div className="flex justify-between font-bold text-md mt-3 border-t pt-3">
          <span>Total</span>
          <span>$ {totals.total.toFixed(2)}</span>
        </div>

        <Button
          disabled={!cartState.some((item) => item.selected)}
          onClick={handleProceedToCheckout}
          className="w-full mt-3 text-gray-50 rounded bg-gradient-to-t to-green-800 from-green-600/70 hover:bg-green-500/80 font-semibold cursor-pointer p-4 text-sm"
        >
          PROCEED TO CHECKOUT ({cartState.filter((i) => i.selected).length})
        </Button>

        {/* Clear Cart */}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button className="w-full mt-2 bg-red-400 text-white py-3 cursor-pointer">
              <span className="font-medium">Clear Cart</span>
              <Trash2 className="ml-2" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[90vw] max-w-sm">
            <p className="text-sm font-medium mb-3">
              Are you sure you want to remove all items from the cart?
            </p>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                className="bg-red-500 text-white hover:bg-red-600"
                onClick={() => {
                  dispatch(clearCart());
                  setOpen(false);
                }}
              >
                Confirm
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Delete Modal */}
      <DeleteConfirmationModal
        name={selectedItem?.name || ''}
        isOpen={isModalOpen}
        onOpenChange={setModalOpen}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default Cart;
