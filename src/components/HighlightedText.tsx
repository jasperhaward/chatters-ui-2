export interface HighlightedTextProps {
  query: string;
  children: string;
}

export function HighlightedText({ query, children }: HighlightedTextProps) {
  // regex capture group to split children by query but
  // also include the query value in the returned array
  const regex = new RegExp(`(${query})`, "i");

  return (
    <span>
      {query === "" // children.split("") will split words into letters...
        ? children
        : children.split(regex).map((substring, index) => {
            if (substring.toUpperCase() === query.toUpperCase()) {
              return <mark key={index}>{substring}</mark>;
            }

            return substring;
          })}
    </span>
  );
}
