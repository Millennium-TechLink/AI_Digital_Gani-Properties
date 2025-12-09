import { ImgHTMLAttributes, useState } from 'react';

interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  width?: number | string;
  height?: number | string;
}

export default function Image({ 
  src, 
  alt, 
  fill = false, 
  sizes,
  priority = false,
  width,
  height,
  className = '',
  style,
  onError,
  ...props 
}: ImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (!hasError && imgSrc !== '/images/Land.webp') {
      // Fallback to default image on error
      setHasError(true);
      setImgSrc('/images/Land.webp');
    } else {
      // If fallback also fails, prevent infinite loop
      setHasError(true);
      if (onError) {
        onError(e);
      }
    }
  };

  const imageStyle = fill
    ? {
        position: 'absolute' as const,
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover' as const,
        ...style,
      }
    : {
        ...(width && { width: typeof width === 'number' ? `${width}px` : width }),
        ...(height && { height: typeof height === 'number' ? `${height}px` : height }),
        ...style,
      };

  // Don't render broken images
  if (hasError && imgSrc === '/images/Land.webp') {
    return (
      <div 
        className={`${className} bg-gp-surface/10 flex items-center justify-center`}
        style={fill ? imageStyle : { width, height, ...imageStyle }}
      >
        <span className="text-gp-ink-muted text-sm">Image not available</span>
      </div>
    );
  }

  return (
    <img
      src={imgSrc || '/images/Land.webp'}
      alt={alt || 'Property image'}
      loading={priority ? 'eager' : 'lazy'}
      className={className}
      style={imageStyle}
      width={width}
      height={height}
      onError={handleError}
      {...props}
    />
  );
}
