type GetEmbedMapReturn = {
  error?: string;
  embedUrl?: string;
};
const getEmbedMap = (mapLink?: string | null): GetEmbedMapReturn => {
  let embedUrl = "";

  // Check if the link is from Google Maps
  if (mapLink && mapLink.includes("google.com/maps/place")) {
    const coordinatesMatch = mapLink.match(
      /@(-?\d+\.\d+),(-?\d+\.\d+),(\d+\.?\d*)z/
    );
    const placeIdMatch = mapLink.match(/!1s([^!]+)/);
    const queryMatch = mapLink.match(/place\/([^\/]+)\//);

    if (coordinatesMatch && placeIdMatch && queryMatch) {
      const lat = coordinatesMatch[1];
      const lng = coordinatesMatch[2];
      const placeId = placeIdMatch[1];
      const placeName = decodeURIComponent(queryMatch[1].replace(/\+/g, " "));

      // Construct the embed URL dynamically
      embedUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14004.621477899425!2d${lng}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s${placeId}!2s${placeName}!5e0!3m2!1sen!2sin!4v1691541570213!5m2!1sen!2sin`;
      return { embedUrl };
    } else {
      // Return an error message or handle it appropriately
      //   return <p>Invalid Google Maps link</p>;
      return { error: "Invalid Google Maps link" };
    }
  }
  // Check if the link is from Apple Maps
  else if (mapLink && mapLink.includes("apple.com/maps")) {
    // Convert to Apple Maps embed link
    const encodedUrl = encodeURIComponent(mapLink);
    embedUrl = `https://maps.apple.com/embed?address=${encodedUrl}`;
    return { embedUrl };
  } else {
    // If the link is not recognized, you can display an error message or a default view
    // return <p>Invalid map link provided.</p>;
    return { error: "Invalid map link provided" };
  }
};

export default function EventMap({ mapLink }: { mapLink?: string | null }) {
  const resp = getEmbedMap(mapLink);

  if (resp.error) return;

  if (resp.embedUrl)
    return (
      <div style={{ width: "100%", height: "100%" }}>
        <iframe
          src={resp.embedUrl}
          width="100%"
          height="100%"
          allowFullScreen
          style={{ border: 0 }}
          title="Map Embed"
        ></iframe>
      </div>
    );
}
