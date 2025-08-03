'use server';

import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';
import { FieldValues } from 'react-hook-form';

export const addProduct = async (data: FieldValues) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: (await cookies()).get('accessToken')!.value,
      },
      body: JSON.stringify(data),
    });

    revalidateTag('PRODUCT');

    return res.json();
  } catch (error: any) {
    return Error(error);
  }
};

export const getAllProducts = async (
  page?: string,
  limit?: string | number,
  query?: { [key: string]: string | string[] | undefined },
) => {
  const params = new URLSearchParams();

  if (query?.price) {
    params.append('minPrice', '0');
    params.append('maxPrice', query?.price.toString());
  }

  if (query?.category) {
    params.append('category', query?.category.toString());
  }

  if (query?.searchTerm) {
    params.append('searchTerm', query?.searchTerm.toString());
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/products?page=${page}&limit=${limit}&${params}`,
      {
        next: {
          tags: ['PRODUCT'],
        },
      },
    );

    return res.json();
  } catch (error: any) {
    return Error(error);
  }
};
