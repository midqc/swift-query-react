import { useState, useEffect } from "react";

const usePexelsAPI = (query, perPage = 8) => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      const response = await fetch(
        `https://api.pexels.com/v1/search?query=${query}&per_page=${perPage}`,
        {
          headers: {
            Authorization: "Bearer CLuJtYtkhKvwGiLeCTzP4mDCPnbvCJmj3gxMlAFyAfNnmubMIWnP7EdP",
          },
        }
      );
      const data = await response.json();
      setImages(data.photos);
    };
    fetchImages();
  }, [query, perPage]);

  return images;
};

export default usePexelsAPI;
