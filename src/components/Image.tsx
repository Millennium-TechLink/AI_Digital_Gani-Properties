import { ImgHTMLAttributes } from 'react';

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
  ...props 
}: ImageProps) {

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

  return (
    <img
      src={src}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      className={className}
      style={imageStyle}
      width={width}
      height={height}
      {...props}
    />
  );
}
