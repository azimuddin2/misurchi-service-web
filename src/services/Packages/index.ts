'use server';

import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';
import { FieldValues } from 'react-hook-form';

export const addService = async (data: FieldValues) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/services`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: (await cookies()).get('accessToken')!.value,
      },
      body: JSON.stringify(data),
    });

    revalidateTag('SERVICE');

    return res.json();
  } catch (error: any) {
    return Error(error);
  }
};

export const getAllServices = async (
  page?: string | number,
  limit?: string | number,
  query?: { [key: string]: string | string[] | undefined },
) => {
  const params = new URLSearchParams();

  if (query?.searchTerm) {
    params.append('searchTerm', query.searchTerm.toString());
  }

  if (query?.createdAt) {
    // Send full ISO string (e.g., 2025-08-04T00:00:00.000Z)
    const date = new Date(query.createdAt.toString().slice(0, 10));
    params.append('createdAt', date.toISOString());
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/services?page=${page}&limit=${limit}&${params}`,
      {
        next: {
          tags: ['SERVICE'],
        },
      },
    );

    return res.json();
  } catch (error: any) {
    return Error(error);
  }
};
