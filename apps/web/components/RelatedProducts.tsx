'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { apiClient } from '../lib/api-client';
import { formatPrice, getStoredCurrency } from '../lib/currency';
import { getStoredLanguage } from '../lib/language';

interface RelatedProduct {
  id: string;
  slug: string;
  title: string;
  price: number;
  originalPrice?: number | null;
  compareAtPrice: number | null;
  discountPercent?: number | null;
  image: string | null;
  inStock: boolean;
  brand?: {
    id: string;
    name: string;
  } | null;
  categories?: Array<{
    id: string;
    slug: string;
    title: string;
  }>;
  variants?: Array<{
    options?: Array<{
      key: string;
      value: string;
    }>;
  }>;
}

interface RelatedProductsProps {
  categorySlug?: string;
  currentProductId: string;
}

/**
 * RelatedProducts component - displays 4 products from the same category
 * Shown at the bottom of the single product page
 */
export function RelatedProducts({ categorySlug, currentProductId }: RelatedProductsProps) {
  const [products, setProducts] = useState<RelatedProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        setLoading(true);
        const language = getStoredLanguage();
        
        // Build params - if no categorySlug, fetch all products
        const params: Record<string, string> = {
          limit: '12', // Fetch more to ensure we have 4 after filtering
          lang: language,
        };
        
        if (categorySlug) {
          params.category = categorySlug;
          console.log('[RelatedProducts] Fetching related products for category:', categorySlug);
        } else {
          console.log('[RelatedProducts] No categorySlug, fetching all products');
        }
        
        const response = await apiClient.get<{
          data: RelatedProduct[];
          meta: {
            total: number;
          };
        }>('/api/v1/products', {
          params,
        });

        console.log('[RelatedProducts] Received products:', response.data.length);
        // Filter out current product and take exactly 4
        const filtered = response.data.filter(p => p.id !== currentProductId);
        console.log('[RelatedProducts] After filtering current product:', filtered.length);
        const finalProducts = filtered.slice(0, 4);
        console.log('[RelatedProducts] Final products to display:', finalProducts.length);
        setProducts(finalProducts);
      } catch (error) {
        console.error('[RelatedProducts] Error fetching related products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [categorySlug, currentProductId]);


  const currency = getStoredCurrency();

  // Always show the section, even if no products (will show loading or empty state)
  return (
    <section className="py-12 mt-20 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-10">Related products</h2>
        
        {loading ? (
          // Loading state
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          // Empty state
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No related products found</p>
          </div>
        ) : (
          // Products Grid - 4 columns on desktop, responsive on mobile
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => {
              const imageUrl = product.image || 'https://via.placeholder.com/400/CCCCCC/FFFFFF?text=No+Image';
              // Get category name from product categories
              const categoryName = product.categories && product.categories.length > 0 
                ? product.categories.map(c => c.title).join(', ')
                : product.brand?.name || 'Product';
              
              return (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="group"
                >
                  <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    {/* Product Image */}
                    <div className="relative aspect-square bg-gray-100 overflow-hidden">
                      <Image
                        src={imageUrl}
                        alt={product.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        unoptimized
                      />
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      {/* Title */}
                      <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-gray-600 transition-colors">
                        {product.title}
                      </h3>

                      {/* Category */}
                      <p className="text-xs text-gray-500 mb-3">
                        {categoryName}
                      </p>

                      {/* Price */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-gray-900">
                            {formatPrice(product.price, currency)}
                          </span>
                          {product.discountPercent && product.discountPercent > 0 && (
                            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                              -{product.discountPercent}%
                            </span>
                          )}
                        </div>
                        {(product.originalPrice && product.originalPrice > product.price) || 
                         (product.compareAtPrice && product.compareAtPrice > product.price) ? (
                          <span className="text-sm text-gray-500 line-through">
                            {formatPrice(
                              (product.originalPrice && product.originalPrice > product.price) 
                                ? product.originalPrice 
                                : (product.compareAtPrice || 0),
                              currency
                            )}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

