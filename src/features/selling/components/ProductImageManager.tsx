'use client';

import Image from 'next/image';
import { useRef, type ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Icon, Spinner } from '@shared/components/ui';
import { getErrorCode, resolveAssetUrl } from '@shared/lib';
import { useAddProductImage, useRemoveProductImage } from '../hooks/useProducts';
import { useSellingTranslation } from '../hooks/useSellingTranslation';
import type { SellerProduct } from '../types/selling.types';

/**
 * Photos are managed against a saved product, not collected alongside the form: both endpoints
 * are `/products/:id/images`, so there is no id to attach an upload to until the product exists.
 * The editor therefore only shows this once the product has been created.
 */
export function ProductImageManager({ product }: { product: SellerProduct }) {
  const { t } = useSellingTranslation();
  const { t: tCommon } = useTranslation('common');
  const addImage = useAddProductImage();
  const removeImage = useRemoveProductImage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const errorCode = getErrorCode(addImage.error) ?? getErrorCode(removeImage.error);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    addImage.mutate({
      productId: product.id,
      file,
      // The first photo becomes the cover, which is what the auction grid renders.
      isCover: product.images.length === 0,
    });
    // Clears the input so picking the same file twice still fires a change event.
    event.target.value = '';
  };

  return (
    <div className="flex flex-col gap-2">
      <p className="text-footnote font-semibold text-foreground-soft">{t('fields.photos')}</p>

      <div className="flex flex-wrap gap-2">
        {product.images.map((image) => {
          const url = resolveAssetUrl(image.url);
          const isRemoving = removeImage.isPending && removeImage.variables?.imageId === image.id;

          return (
            <div key={image.id} className="relative size-24 overflow-hidden rounded-md bg-fill">
              {url ? <Image src={url} alt="" fill sizes="96px" className="object-cover" /> : null}

              {image.isCover ? (
                <span className="absolute inset-x-0 bottom-0 bg-foreground/72 py-0.5 text-center text-caption-2 font-semibold text-surface">
                  {t('fields.coverPhoto')}
                </span>
              ) : null}

              <button
                type="button"
                aria-label={t('fields.removePhoto')}
                disabled={isRemoving}
                onClick={() => removeImage.mutate({ productId: product.id, imageId: image.id })}
                className="absolute end-1 top-1 inline-flex size-6 items-center justify-center rounded-full bg-foreground/72 text-surface disabled:opacity-50"
              >
                {isRemoving ? <Spinner /> : <Icon name="x" size={14} />}
              </button>
            </div>
          );
        })}

        <button
          type="button"
          disabled={addImage.isPending}
          onClick={() => fileInputRef.current?.click()}
          className="flex size-24 flex-col items-center justify-center gap-1 rounded-md border border-dashed border-border text-muted-foreground disabled:opacity-50"
        >
          {addImage.isPending ? <Spinner /> : <Icon name="camera" size={22} />}
          <span className="text-caption-2">{t('fields.addPhoto')}</span>
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        // Matches mazad-api's ALLOWED_MIMES; anything else is rejected with INVALID_FILE_TYPE.
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />

      {errorCode ? (
        <p role="alert" className="text-footnote text-destructive">
          {t(`errors.${errorCode}`, { defaultValue: tCommon('errors.generic') })}
        </p>
      ) : null}
    </div>
  );
}
