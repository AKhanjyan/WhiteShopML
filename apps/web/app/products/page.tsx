import Link from 'next/link';
import { Suspense } from 'react';
import { Button } from '@shop/ui';
import { apiClient } from '../../lib/api-client';
import { getStoredLanguage } from '../../lib/language';
import { PriceFilter } from '../../components/PriceFilter';
import { ColorFilter } from '../../components/ColorFilter';
import { SizeFilter } from '../../components/SizeFilter';
import { BrandFilter } from '../../components/BrandFilter';
import { ProductsHeader } from '../../components/ProductsHeader';
import { ProductsGrid } from '../../components/ProductsGrid';
import { CategoryNavigation } from '../../components/CategoryNavigation';
import { MobileFiltersDrawer } from '../../components/MobileFiltersDrawer';
import { MOBILE_FILTERS_EVENT } from '../../lib/events';

const PAGE_CONTAINER = 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8';

interface Product {
  id: string;
  slug: string;
  title: string;
  price: number;
  compareAtPrice: number | null;
  image: string | null;
  inStock: boolean;
  brand: {
    id: string;
    name: string;
  } | null;
}

interface ProductsResponse {
  data: Product[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/**
 * Մատչելի API-ից բերում է ապրանքների ցանկը՝ կիրառելով բոլոր ֆիլտրերը։
 * Fixed for Vercel production: always uses NEXT_PUBLIC_APP_URL
 */
async function getProducts(
  page: number = 1,
  search?: string,
  category?: string,
  minPrice?: string,
  maxPrice?: string,
  colors?: string,
  sizes?: string,
  brand?: string
): Promise<ProductsResponse> {
  try {
    const language = getStoredLanguage();
    const params: Record<string, string> = {
      page: page.toString(),
      limit: '24',
      lang: language,
    };

    if (search?.trim()) params.search = search.trim();
    if (category?.trim()) params.category = category.trim();
    if (minPrice?.trim()) params.minPrice = minPrice.trim();
    if (maxPrice?.trim()) params.maxPrice = maxPrice.trim();
    if (colors?.trim()) params.colors = colors.trim();
    if (sizes?.trim()) params.sizes = sizes.trim();
    if (brand?.trim()) params.brand = brand.trim();

    const queryString = new URLSearchParams(params).toString();

    // ⭐ PRODUCTION-SAFE FETCH (Works in Vercel SSR, RSC & SSG)
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

    if (!baseUrl) {
      throw new Error("❌ NEXT_PUBLIC_APP_URL is missing from environment variables.");
    }

    const fetchResponse = await fetch(
      `${baseUrl}/api/v1/products?${queryString}`,
      { cache: "no-store" }
    );

    if (!fetchResponse.ok) {
      throw new Error(`API request failed: ${fetchResponse.status}`);
    }

    const response = await fetchResponse.json();

    if (!response?.data || !Array.isArray(response.data)) {
      return {
        data: [],
        meta: {
          total: 0,
          page: 1,
          limit: 24,
          totalPages: 0,
        },
      };
    }

    return response;

  } catch (error: any) {
    console.error('❌ [PRODUCTS] Error fetching products:', error);
    return {
      data: [],
      meta: {
        total: 0,
        page: 1,
        limit: 24,
        totalPages: 0,
      },
    };
  }
}

/**
 * Products Page
 */
export default async function ProductsPage({
  searchParams,
}: {
  searchParams?: Promise<{ page?: string; search?: string; category?: string; minPrice?: string; maxPrice?: string; colors?: string; sizes?: string; brand?: string; sort?: string }>;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : {};

  const page = parseInt(resolvedSearchParams?.page || '1', 10);
  const search = resolvedSearchParams?.search;
  const category = resolvedSearchParams?.category;
  const minPrice = resolvedSearchParams?.minPrice;
  const maxPrice = resolvedSearchParams?.maxPrice;
  const colors = resolvedSearchParams?.colors;
  const sizes = resolvedSearchParams?.sizes;
  const brand = resolvedSearchParams?.brand;
  const sort = resolvedSearchParams?.sort;

  const productsData = await getProducts(page, search, category, minPrice, maxPrice, colors, sizes, brand);

  const selectedColors = colors ? colors.split(',').map(c => c.trim().toLowerCase()) : [];
  const selectedSizes = sizes ? sizes.split(',').map(s => s.trim()) : [];

  const buildPaginationUrl = (pageNum: number) => {
    const params = new URLSearchParams();
    params.set('page', pageNum.toString());
    if (search) params.set('search', search);
    if (category) params.set('category', category);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (colors) params.set('colors', colors);
    if (sizes) params.set('sizes', sizes);
    if (brand) params.set('brand', brand);
    if (sort) params.set('sort', sort);
    return `/products?${params.toString()}`;
  };

  return (
    <div className="w-full">
      <div className={PAGE_CONTAINER}>
        <CategoryNavigation />
        <ProductsHeader />
      </div>

      <div className={`${PAGE_CONTAINER} flex gap-8`}>
        <aside className="w-64 flex-shrink-0 hidden lg:block bg-gray-50 min-h-screen rounded-xl">
          <div className="sticky top-4 p-4 space-y-6">
            <Suspense fallback={<div className="text-sm text-gray-500">Loading filters...</div>}>
              <PriceFilter currentMinPrice={minPrice} currentMaxPrice={maxPrice} category={category} search={search} />
              <ColorFilter category={category} search={search} minPrice={minPrice} maxPrice={maxPrice} selectedColors={selectedColors} />
              <SizeFilter category={category} search={search} minPrice={minPrice} maxPrice={maxPrice} selectedSizes={selectedSizes} />
              <BrandFilter category={category} search={search} minPrice={minPrice} maxPrice={maxPrice} selectedBrand={brand} />
            </Suspense>
          </div>
        </aside>

        <div className="flex-1 min-w-0 py-4">
          <div className="mb-6">
            <MobileFiltersDrawer triggerLabel="Filters" openEventName={MOBILE_FILTERS_EVENT}>
              <Suspense fallback={<div className="text-sm text-gray-500">Loading filters...</div>}>
                <PriceFilter currentMinPrice={minPrice} currentMaxPrice={maxPrice} category={category} search={search} />
                <ColorFilter category={category} search={search} minPrice={minPrice} maxPrice={maxPrice} selectedColors={selectedColors} />
                <SizeFilter category={category} search={search} minPrice={minPrice} maxPrice={maxPrice} selectedSizes={selectedSizes} />
                <BrandFilter category={category} search={search} minPrice={minPrice} maxPrice={maxPrice} selectedBrand={brand} />
              </Suspense>
            </MobileFiltersDrawer>
          </div>

          {productsData.data.length > 0 ? (
            <>
              <ProductsGrid products={productsData.data} sortBy={sort || 'default'} />

              {productsData.meta.totalPages > 1 && (
                <div className="mt-8 flex justify-center gap-2">
                  {page > 1 && (
                    <Link href={buildPaginationUrl(page - 1)}>
                      <Button variant="outline">Previous</Button>
                    </Link>
                  )}
                  <span className="flex items-center px-4">
                    Page {page} of {productsData.meta.totalPages}
                  </span>
                  {page < productsData.meta.totalPages && (
                    <Link href={buildPaginationUrl(page + 1)}>
                      <Button variant="outline">Next</Button>
                    </Link>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <p className="text-gray-500 text-lg font-medium mb-3">No products found</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

