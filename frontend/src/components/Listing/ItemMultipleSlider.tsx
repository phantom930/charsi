import { useMemo } from "react";
import ImageGallery from "react-image-gallery";
import _ from "lodash";
import "react-image-gallery/styles/css/image-gallery.css";

import type { UploadFile } from "@store/listing/listing.slice";

interface MultipleItemSliderProps {
  images: UploadFile[];
}
const MultipleItemSlider = ({ images }: MultipleItemSliderProps) => {
  const items = useMemo(() => {
    return images.map((image: UploadFile) => ({
      original: image.url,
      originalWidth: 680,
      originalHeight: 350,
      originalAlt: _.get(image, "name", "original image"),
      thumbnail: _.get(image, "formats.thumbnail.url", image.url),
      thumbnailWidth: 75,
      thumbnailHeight: 75,
      thumbnailAlt: _.get(image, "formats.thumbnail.name", "thumbnail image"),
      renderLeftNav: (onClick, disabled) => {
        return (
          <button
            type="button"
            className="image-gallery-icon image-gallery-left-nav"
            disabled={disabled}
            onClick={onClick}
            aria-label="Previous Slide"
          >
            Left
          </button>
        );
      },
      renderRightNav: (onClick, disabled) => (
        <button
          type="button"
          className="image-gallery-icon image-gallery-left-nav"
          disabled={disabled}
          onClick={onClick}
          aria-label="Previous Slide"
        >
          Right
        </button>
      ),
    }));
  }, [images]);

  return (
    <ImageGallery
      items={items}
      lazyLoading={true}
      useBrowserFullscreen={false}
      autoPlay={true}
      showPlayButton={false}
      slideDuration={2000}
    />
  );
};

export default MultipleItemSlider;
