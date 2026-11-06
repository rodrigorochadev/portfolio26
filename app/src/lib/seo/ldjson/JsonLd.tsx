type JsonLdProps = { data: Record<string, unknown> };

// Escape `<` so no string in the payload can close the script tag (XSS).
export default function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
